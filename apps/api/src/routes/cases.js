const express = require('express');
const { complianceQueue } = require('../services/queue');
const { UnknownsEngine } = require('rule-engine/dist/evaluator');
const rulesConfig = require('../config/rules.json');

const router = express.Router();
const engine = new UnknownsEngine();

// In-memory store for MVP development. Replace with PG in prod.
const db = new Map();

const parseRules = (rules) => {
    return rules.map(r => ({
        ...r,
        effective_from: new Date(r.effective_from),
        effective_to: r.effective_to ? new Date(r.effective_to) : null
    }));
};

const activeRules = parseRules(rulesConfig);

router.post('/', async (req, res) => {
    try {
        const caseId = `CASE-${Date.now()}`;
        const scanDate = new Date();
        
        const caseRecord = { 
            id: caseId, 
            scanDate, 
            status: 'UPLOADED', 
            results: null, 
            priority: 0 
        };
        
        db.set(caseId, caseRecord);
        
        const job = await complianceQueue.add('process-image', { caseId });
        
        caseRecord.jobId = job.id;
        caseRecord.status = 'PROCESSING';
        db.set(caseId, caseRecord);

        res.status(202).json({ id: caseId, jobId: job.id });
    } catch (error) {
        console.error('Failed to create case:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const record = db.get(req.params.id);
    
    if (!record) {
        return res.status(404).json({ error: 'Not found' });
    }

    if (record.status === 'PROCESSING') {
        try {
            const job = await complianceQueue.getJob(record.jobId);
            if (job && await job.isCompleted()) {
                const evidence = job.returnvalue || [];
                const evaluations = [];
                let priorityScore = 0;

                activeRules.forEach(rule => {
                    const evalResult = engine.evaluate(rule, record.scanDate, evidence);
                    evaluations.push({ ruleId: rule.id, evaluation: evalResult });

                    if (evalResult.unknown_category) {
                        priorityScore += calculatePriority(evalResult.unknown_category);
                    }
                });

                record.status = priorityScore > 0 ? 'REVIEW_REQUIRED' : 'COMPLIANT';
                record.results = evaluations;
                record.priority = priorityScore;
                db.set(record.id, record);
            }
        } catch (error) {
            console.error(`Error fetching job ${record.jobId}:`, error);
        }
    }

    res.json(record);
});

function calculatePriority(category) {
    const scores = {
        'MODEL_DISAGREEMENT': 50,
        'AMBIGUOUS_TEXT': 30,
        'MISSING_EVIDENCE': 20,
        'TEMPORAL_UNCERTAINTY': 100
    };
    return scores[category] || 10;
}

module.exports = router;
