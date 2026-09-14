import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM evidence ORDER BY uploaded_at DESC LIMIT 50').all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

router.get('/:inspectionId', async (c) => {
  try {
    const inspectionId = c.req.param('inspectionId')
    const { results } = await c.env.DB.prepare('SELECT * FROM evidence WHERE inspection_id = ? ORDER BY uploaded_at DESC').bind(inspectionId).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

function base64ToUint8Array(base64Str) {
  const raw = atob(base64Str.replace(/^data:image\/\w+;base64,/, ''));
  const uint8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return [...uint8Array];
}

router.post('/upload', async (c) => {
  try {
    const contentType = c.req.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return c.json({ error: 'Unsupported content type, please POST JSON with base64 image' }, 415)
    }

    const body = await c.req.json()
    const inspectionId = body.inspectionId || null
    const type = body.type || 'IMAGE'
    const base64 = body.base64 || body.data || null
    
    if (!base64) return c.json({ error: 'No image data provided' }, 400)
    
    let url = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`
    const id = `EV-${Date.now()}`

    // Insert Evidence
    await c.env.DB.prepare(
      'INSERT INTO evidence (id, inspection_id, type, url) VALUES (?, ?, ?, ?)'
    ).bind(id, inspectionId, type, url).run()

    await c.env.DB.prepare(
      'INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)'
    ).bind('UPLOAD_EVIDENCE', 'EVIDENCE', id, `Uploaded ${type} evidence for inspection ${inspectionId}`).run()

    // Real AI OCR Vision Extraction (Cloudflare Llama-3.2-Vision)
    let extractionId = `EXT-${Date.now()}`
    let parsedMrp = null, parsedBatch = null, parsedExp = null
    let confidence = 0.95 // Default confidence assumption
    let rawText = ""

    try {
      const imageBytes = base64ToUint8Array(base64)
      const prompt = `You are a compliance inspection AI. Extract product information from this image. 
      Return ONLY a raw JSON object (no markdown formatting or backticks) with these exact keys: 
      "mrp" (number or null), "batch" (string or null), "expiry" (string or null). 
      If a field is not found, use null.`

      const aiResponse = await c.env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
        image: imageBytes,
        prompt: prompt
      });

      rawText = aiResponse.response || "";
      // Strip markdown code blocks if the AI decided to wrap it anyway
      let cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const extractedData = JSON.parse(cleanJsonStr);
      
      parsedMrp = extractedData.mrp ? parseFloat(extractedData.mrp) : null;
      parsedBatch = extractedData.batch || null;
      parsedExp = extractedData.expiry || null;
      
    } catch (aiErr) {
      console.error("AI OCR Failed: ", aiErr)
      rawText = "AI OCR Failed or timed out."
      confidence = 0.0
    }

    // Save Extraction
    await c.env.DB.prepare(`
      INSERT INTO extractions (id, evidence_id, raw_text, parsed_mrp, parsed_batch, parsed_exp_date, confidence) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(extractionId, id, rawText, parsedMrp, parsedBatch, parsedExp, confidence).run()

    await c.env.DB.prepare(
      'INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)'
    ).bind('OCR_EXTRACTION', 'EVIDENCE', id, `AI Extraction completed`).run()

    // Update inspection status
    if (inspectionId) {
       await c.env.DB.prepare('UPDATE inspections SET status = ? WHERE id = ?').bind('OCR_COMPLETED', inspectionId).run()
    }

    return c.json({ 
      success: true, 
      evidenceId: id,
      extraction: {
        id: extractionId,
        mrp: parsedMrp,
        batch: parsedBatch,
        expiry: parsedExp,
        raw: rawText
      }
    }, 201)
  } catch (err) {
    console.error('upload error', err)
    return c.json({ error: 'Error uploading evidence' }, 500)
  }
})

export default router
