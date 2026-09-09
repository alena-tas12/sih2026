import { TemporalRule, ExtractedField } from './types';

export type SufficiencyResult = 
    | 'COMPLIANT' 
    | 'NON_COMPLIANT' 
    | 'INSUFFICIENT_EVIDENCE' 
    | 'CONFLICTING_EVIDENCE' 
    | 'NOT_APPLICABLE' 
    | 'NEEDS_LEGAL_REVIEW';

export interface EvidenceNode {
    rule: TemporalRule;
    evidence: ExtractedField[];
    sufficiency: SufficiencyResult;
    reasoning: string;
}

export class EvidenceSufficiencyEngine {
    
    evaluate(rule: TemporalRule, evidenceList: ExtractedField[]): EvidenceNode {
        
        const relevantEvidence = evidenceList.filter(e => e.field_name === rule.field_name);

        // 1. Missing Evidence
        if (relevantEvidence.length === 0) {
            return {
                rule,
                evidence: [],
                sufficiency: 'INSUFFICIENT_EVIDENCE',
                reasoning: `No multimodal evidence found for mandatory declaration: '${rule.field_name}'.`
            };
        }

        // 2. Conflicting Evidence (Contradiction Detection)
        const ocrEvidence = relevantEvidence.find(e => e.extraction_model === 'OCR_PRIMARY');
        const visionEvidence = relevantEvidence.find(e => e.extraction_model === 'VISION_LANGUAGE_SECONDARY');

        if (ocrEvidence && visionEvidence) {
            if (ocrEvidence.normalised_value !== visionEvidence.normalised_value) {
                return {
                    rule,
                    evidence: [ocrEvidence, visionEvidence],
                    sufficiency: 'CONFLICTING_EVIDENCE',
                    reasoning: `Cross-pathway contradiction: OCR detected '${ocrEvidence.normalised_value}', but Vision-Language detected '${visionEvidence.normalised_value}'.`
                };
            }
        }

        const primaryEvidence = ocrEvidence || visionEvidence || relevantEvidence[0];

        // 3. Ambiguous / Low Confidence Evidence
        if (primaryEvidence.confidence < 0.85) {
            return {
                rule,
                evidence: [primaryEvidence],
                sufficiency: 'NEEDS_LEGAL_REVIEW',
                reasoning: `Evidence found, but AI confidence (${primaryEvidence.confidence}) is below the deterministic threshold. Human validation required.`
            };
        }

        // 4. Deterministic Compliance Evaluation
        if (rule.requirement_type === 'PRESENCE') {
            return {
                rule,
                evidence: [primaryEvidence],
                sufficiency: 'COMPLIANT',
                reasoning: `High-confidence evidence satisfies presence requirement.`
            };
        }

        if (rule.requirement_type === 'NUMERIC') {
            if (typeof primaryEvidence.normalised_value === 'number') {
                return {
                    rule,
                    evidence: [primaryEvidence],
                    sufficiency: 'COMPLIANT',
                    reasoning: `High-confidence numeric value parsed correctly.`
                };
            } else {
                return {
                    rule,
                    evidence: [primaryEvidence],
                    sufficiency: 'NON_COMPLIANT',
                    reasoning: `Evidence found but could not be parsed as a valid numeric declaration as required by law.`
                };
            }
        }

        return {
            rule,
            evidence: [primaryEvidence],
            sufficiency: 'NOT_APPLICABLE',
            reasoning: `Requirement type unknown or inapplicable to this product state.`
        };
    }
}
