import { ExtractedField } from './types';
import { EvidenceNode } from './sufficiency_engine';

/**
 * The Evidence Graph is the central backbone of the entire SIH product.
 * It maps: Image -> Region -> Extracted Field -> Normalized Value -> Requirement -> Decision
 */
export class EvidenceGraph {
    private caseId: string;
    private rawImageUri: string;
    private nodes: EvidenceNode[] = [];

    constructor(caseId: string, rawImageUri: string) {
        this.caseId = caseId;
        this.rawImageUri = rawImageUri;
    }

    public addNode(node: EvidenceNode) {
        this.nodes.push(node);
    }

    public getGraph() {
        return {
            caseId: this.caseId,
            image: this.rawImageUri,
            evaluations: this.nodes.map(node => ({
                rule_id: node.rule.id,
                rule_description: `Must have ${node.rule.field_name} (Type: ${node.rule.requirement_type})`,
                evidence_trail: node.evidence.map(e => ({
                    extraction_id: e.id,
                    model_source: e.extraction_model,
                    bounding_box_node: e.source_region_id, // Link to visual layout graph
                    raw_text: e.raw_text,
                    normalized_data: e.normalised_value,
                    confidence: e.confidence
                })),
                final_decision: node.sufficiency,
                legal_reasoning: node.reasoning
            }))
        };
    }

    /**
     * Determines the overall case state based on all graph nodes.
     */
    public getOverallState(): 'COMPLIANT' | 'NON_COMPLIANT' | 'REVIEW_REQUIRED' {
        let hasReview = false;
        let hasFail = false;

        for (const node of this.nodes) {
            if (node.sufficiency === 'NON_COMPLIANT') hasFail = true;
            if (['INSUFFICIENT_EVIDENCE', 'CONFLICTING_EVIDENCE', 'NEEDS_LEGAL_REVIEW'].includes(node.sufficiency)) {
                hasReview = true;
            }
        }

        if (hasReview) return 'REVIEW_REQUIRED';
        if (hasFail) return 'NON_COMPLIANT';
        return 'COMPLIANT';
    }
}
