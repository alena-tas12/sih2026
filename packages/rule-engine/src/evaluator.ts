import { TemporalRule, ExtractedField, EvaluationResponse, UnknownCategory } from './types';

export class UnknownsEngine {
    
    evaluate(rule: TemporalRule, scanDate: Date, evidenceList: ExtractedField[]): EvaluationResponse {
        
        // 1. Temporal Applicability Check
        if (scanDate < rule.effective_from || (rule.effective_to && scanDate > rule.effective_to)) {
            return this.buildUnknownResponse(rule, null, 'TEMPORAL_UNCERTAINTY', 
                `Rule ${rule.id} is not definitively active on scan date ${scanDate.toISOString()}`);
        }

        // 2. Filter evidence by field
        const relevantEvidence = evidenceList.filter(e => e.field_name === rule.field_name);

        if (relevantEvidence.length === 0) {
            return this.buildUnknownResponse(rule, null, 'MISSING_EVIDENCE', 
                `Required declaration '${rule.field_name}' not found in any multimodal pathway.`);
        }

        // 3. Dual-Model Disagreement / Evidence Fusion
        const ocrEvidence = relevantEvidence.find(e => e.extraction_model === 'OCR_PRIMARY');
        const visionEvidence = relevantEvidence.find(e => e.extraction_model === 'VISION_LANGUAGE_SECONDARY');

        if (ocrEvidence && visionEvidence) {
            if (ocrEvidence.normalised_value !== visionEvidence.normalised_value) {
                return this.buildUnknownResponse(rule, [ocrEvidence.id, visionEvidence.id], 'MODEL_DISAGREEMENT',
                    `OCR predicts '${ocrEvidence.normalised_value}' but Vision-Language predicts '${visionEvidence.normalised_value}'.`);
            }
        }

        const primaryEvidence = ocrEvidence || visionEvidence || relevantEvidence[0];

        // 4. Ambiguity Check
        if (primaryEvidence.confidence < 0.80) {
            return this.buildUnknownResponse(rule, [primaryEvidence.id], 'AMBIGUOUS_TEXT',
                `Extraction confidence (${primaryEvidence.confidence}) too low for deterministic compliance.`);
        }

        // 5. Deterministic Rules
        if (rule.requirement_type === 'PRESENCE') {
            return this.buildPassResponse(rule, primaryEvidence);
        }

        if (rule.requirement_type === 'NUMERIC') {
            if (typeof primaryEvidence.normalised_value === 'number') {
                return this.buildPassResponse(rule, primaryEvidence);
            }
            return this.buildUnknownResponse(rule, [primaryEvidence.id], 'AMBIGUOUS_TEXT',
                `Could not strictly parse numeric value from '${primaryEvidence.raw_text}'.`);
        }

        return this.buildUnknownResponse(rule, [primaryEvidence.id], 'UNKNOWN_RULE', 'Rule type not implemented.');
    }

    private buildPassResponse(rule: TemporalRule, evidence: ExtractedField): EvaluationResponse {
        return {
            requirement_id: rule.id,
            extracted_field_ids: [evidence.id],
            result: 'PASS',
            reason: `Evidence deterministically satisfies ${rule.requirement_type} requirement.`,
            five_q_context: {
                for_whom: 'Inspector / Compliance Officer',
                which_unknowns: [],
                how: 'Deterministic rule satisfaction via high-confidence evidence.',
                context: 'Standard label evaluation.',
                outcome: 'PASS - No further human review prioritized.'
            }
        };
    }

    private buildUnknownResponse(rule: TemporalRule, evidenceIds: string[] | null, category: UnknownCategory, reason: string): EvaluationResponse {
        return {
            requirement_id: rule.id,
            extracted_field_ids: evidenceIds || [],
            result: 'UNKNOWN',
            unknown_category: category,
            reason: reason,
            five_q_context: {
                for_whom: 'Human Annotator / Legal Reviewer',
                which_unknowns: [category],
                how: 'Prioritize for Active Learning / Manual Resolution',
                context: `Rule ${rule.id} evaluation halted due to ${category}`,
                outcome: 'UNKNOWN - Added to Active Learning Queue.'
            }
        };
    }
}
