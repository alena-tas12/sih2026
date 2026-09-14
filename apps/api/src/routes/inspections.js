import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT i.*, p.name as productName, p.vendor as orgName
      FROM inspections i
      LEFT JOIN gtin_registry g ON i.gtin = g.gtin
      LEFT JOIN products p ON g.product_id = p.id
      ORDER BY i.created_at DESC
    `).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const caseData = await c.env.DB.prepare(`
      SELECT i.*, p.name as productName, p.vendor as orgName
      FROM inspections i
      LEFT JOIN gtin_registry g ON i.gtin = g.gtin
      LEFT JOIN products p ON g.product_id = p.id
      WHERE i.id = ?
    `).bind(id).first()
    
    if (!caseData) return c.json({ error: 'Not found' }, 404)
    return c.json(caseData)
  } catch (err) {
    return c.json({ error: 'Case not found' }, 404)
  }
})

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { gtin, location_id } = body
    
    const id = body.id || `INS-${Date.now()}`

    await c.env.DB.prepare(`
      INSERT INTO inspections (id, gtin, location_id, status) 
      VALUES (?, ?, ?, ?)
    `).bind(id, gtin, location_id, 'PENDING').run()

    await c.env.DB.prepare(
      "INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)"
    ).bind('CREATE_INSPECTION', 'INSPECTION', id, `Created inspection for GTIN ${gtin} at ${location_id}`).run()

    return c.json({ success: true, id }, 201)
  } catch (err) {
    return c.json({ error: 'Database error saving inspection', detail: String(err) }, 500)
  }
})

router.put('/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { status, review_decision, reviewer_notes, actor } = body
    
    await c.env.DB.prepare(`
      UPDATE inspections SET status = ?, review_decision = ?, reviewer_notes = ? WHERE id = ?
    `).bind(status, review_decision || null, reviewer_notes || null, id).run()

    await c.env.DB.prepare(
      "INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)"
    ).bind('DECISION', 'INSPECTION', id, `Status updated to ${status}. Decision: ${review_decision || 'None'}`).run()

    return c.json({ success: true })
  } catch (err) {
    return c.json({ error: 'Database error updating status', detail: String(err) }, 500)
  }
})

// OBSERVATIONS (HUMAN VERIFIED)
router.get('/:id/observations', async (c) => {
  try {
    const id = c.req.param('id')
    const { results } = await c.env.DB.prepare('SELECT * FROM observations WHERE inspection_id = ?').bind(id).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

router.post('/:id/observations', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json() // Expect array of verified fields
    
    // Clear existing for this inspection
    await c.env.DB.prepare('DELETE FROM observations WHERE inspection_id = ?').bind(id).run()
    
    for (const field of body) {
      const fieldId = `OBS-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      await c.env.DB.prepare(`
        INSERT INTO observations (id, inspection_id, field_key, verified_value, verified_by)
        VALUES (?, ?, ?, ?, ?)
      `).bind(fieldId, id, field.fieldKey, field.fieldValue, 'USER').run()
    }
    
    await c.env.DB.prepare(
      "INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)"
    ).bind('FIELD_CORRECTION', 'INSPECTION', id, `Saved ${body.length} verified observations`).run()

    return c.json({ success: true }, 201)
  } catch (err) {
    return c.json({ error: 'Database error saving fields', detail: String(err) }, 500)
  }
})

// EXTRACTIONS (RAW AI)
router.get('/:id/extractions', async (c) => {
  try {
    const id = c.req.param('id')
    const { results } = await c.env.DB.prepare(`
      SELECT ex.* FROM extractions ex 
      JOIN evidence ev ON ex.evidence_id = ev.id 
      WHERE ev.inspection_id = ?
    `).bind(id).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

// CROSS-LOCATION & PRODUCT MASTER COMPARISON ENGINE
router.get('/:id/comparisons', async (c) => {
  try {
    const id = c.req.param('id')
    const { results } = await c.env.DB.prepare('SELECT * FROM comparisons WHERE inspection_id = ?').bind(id).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})


router.post('/:id/compare', async (c) => {
  try {
    const id = c.req.param('id')
    
    // 1. Get current inspection
    const currentInspection = await c.env.DB.prepare('SELECT * FROM inspections WHERE id = ?').bind(id).first()
    if (!currentInspection) return c.json({ error: 'Inspection not found' }, 404)
    
    // 2. Get current observations
    const { results: currentObs } = await c.env.DB.prepare('SELECT * FROM observations WHERE inspection_id = ?').bind(id).all()
    if (!currentObs || currentObs.length === 0) return c.json({ error: 'No verified observations to compare' }, 400)
    
    let matched = 1
    let differences = []
    let ruleViolations = []

    // 3. Compare against Product Master
    const productMaster = await c.env.DB.prepare(`
      SELECT p.* FROM products p 
      JOIN gtin_registry g ON p.id = g.product_id
      WHERE g.gtin = ?
    `).bind(currentInspection.gtin).first()

    if (productMaster) {
      const mrpObs = currentObs.find(o => o.field_key === 'MRP' || o.field_key === 'mrp');
      if (mrpObs && productMaster.standard_mrp) {
        if (parseFloat(mrpObs.verified_value) !== productMaster.standard_mrp) {
          matched = 0;
          differences.push({
            field: 'MRP',
            extractedValue: mrpObs.verified_value,
            baseValue: productMaster.standard_mrp,
            baseLocation: 'PRODUCT_MASTER',
            baseInspectionId: 'N/A'
          })
        }
      }
    }
    
    // 4. Compare against historical observations across other locations
    const { results: otherObsRes } = await c.env.DB.prepare(`
      SELECT o.*, i.location_id 
      FROM observations o
      JOIN inspections i ON o.inspection_id = i.id
      WHERE i.gtin = ? AND i.id != ?
    `).bind(currentInspection.gtin, id).all()
    
    const otherObs = otherObsRes || []
    
    for (const current of currentObs) {
      const histories = otherObs.filter(f => f.field_key === current.field_key)
      for (const history of histories) {
        if (history.verified_value !== current.verified_value) {
          matched = 0
          differences.push({
            field: current.field_key,
            extractedValue: current.verified_value,
            baseValue: history.verified_value,
            baseLocation: history.location_id,
            baseInspectionId: history.inspection_id
          })
        }
      }
    }

    // 5. EXECUTE REAL DATASET REGULATIONS AST LOGIC
    const { results: rules } = await c.env.DB.prepare('SELECT * FROM rules').all()
    
    if (rules && rules.length > 0) {
      for (const rule of rules) {
        const obs = currentObs.find(o => o.field_key.toLowerCase().includes(rule.field_target.toLowerCase()))
        if (obs) {
           const val = obs.verified_value.toLowerCase();
           let isViolated = false;
           // AST EVALUATION BASED ON ACTUAL LOGIC
           if (rule.logical_constraint.includes('EXISTS(value)') && !val) isViolated = true;
           if (rule.logical_constraint.includes('value > 0') && parseFloat(val) <= 0) isViolated = true;
           if (rule.logical_constraint.includes('length(value) > 10') && val.length <= 10) isViolated = true;
           if (rule.logical_constraint.includes('includes_text("incl. of all taxes")') && !val.includes('incl.') && !val.includes('taxes')) isViolated = true;
           
           if (isViolated) {
             matched = 0;
             ruleViolations.push({
               ruleId: rule.id,
               ruleSection: rule.rule_section,
               field: rule.field_target,
               value: obs.verified_value,
               violation: 'Failed AST check: ' + rule.logical_constraint
             })
           }
        }
      }
    }
    
    const uniqueDifferences = Array.from(new Set(differences.map(a => JSON.stringify(a)))).map(a => JSON.parse(a))
    
    const compId = `COMP-${Date.now()}`
    await c.env.DB.prepare(`
      INSERT INTO comparisons (id, inspection_id, matched, differences)
      VALUES (?, ?, ?, ?)
    `).bind(compId, id, matched ? 1 : 0, JSON.stringify({ diffs: uniqueDifferences, rules: ruleViolations })).run()
    
    const newStatus = matched ? 'COMPLIANT' : 'REVIEW_REQUIRED'
    await c.env.DB.prepare('UPDATE inspections SET status = ? WHERE id = ?').bind(newStatus, id).run()
    
    await c.env.DB.prepare(
      "INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)"
    ).bind(
      'COMPARISON', 'INSPECTION', id, 
      matched ? 'All fields match historical records and master, and passed LMPC rules' : `Found ${uniqueDifferences.length} discrepancies and ${ruleViolations.length} rule violations. Review required.`
    ).run()
    
    return c.json({ success: true, matched, differences: uniqueDifferences, ruleViolations, newStatus })
  } catch (err) {
    return c.json({ error: 'Comparison engine error', detail: String(err) }, 500)
  }
})

export default router
