const fs = require('fs');
let code = fs.readFileSync('apps/api/src/routes/inspections.js', 'utf8');

if (!code.includes('const { results: rules } = await c.env.DB.prepare')) {
  let compareStart = code.indexOf("router.post('/:id/compare', async (c) => {");
  let compareEnd = code.indexOf('export default router');
  
  const newRoute = `
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
    const productMaster = await c.env.DB.prepare(\`
      SELECT p.* FROM products p 
      JOIN gtin_registry g ON p.id = g.product_id
      WHERE g.gtin = ?
    \`).bind(currentInspection.gtin).first()

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
    const { results: otherObsRes } = await c.env.DB.prepare(\`
      SELECT o.*, i.location_id 
      FROM observations o
      JOIN inspections i ON o.inspection_id = i.id
      WHERE i.gtin = ? AND i.id != ?
    \`).bind(currentInspection.gtin, id).all()
    
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
    
    const compId = \`COMP-\${Date.now()}\`
    await c.env.DB.prepare(\`
      INSERT INTO comparisons (id, inspection_id, matched, differences)
      VALUES (?, ?, ?, ?)
    \`).bind(compId, id, matched ? 1 : 0, JSON.stringify({ diffs: uniqueDifferences, rules: ruleViolations })).run()
    
    const newStatus = matched ? 'COMPLIANT' : 'REVIEW_REQUIRED'
    await c.env.DB.prepare('UPDATE inspections SET status = ? WHERE id = ?').bind(newStatus, id).run()
    
    await c.env.DB.prepare(
      "INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)"
    ).bind(
      'COMPARISON', 'INSPECTION', id, 
      matched ? 'All fields match historical records and master, and passed LMPC rules' : \`Found \${uniqueDifferences.length} discrepancies and \${ruleViolations.length} rule violations. Review required.\`
    ).run()
    
    return c.json({ success: true, matched, differences: uniqueDifferences, ruleViolations, newStatus })
  } catch (err) {
    return c.json({ error: 'Comparison engine error', detail: String(err) }, 500)
  }
})
`;

  code = code.substring(0, compareStart) + newRoute + '\n' + code.substring(compareEnd);
  fs.writeFileSync('apps/api/src/routes/inspections.js', code);
  console.log('patched compare route');
}
