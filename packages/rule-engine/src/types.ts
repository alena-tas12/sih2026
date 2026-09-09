export type EvaluationResult = 'PASS' | 'FAIL' | 'UNKNOWN';

export type UnknownCategory = 
    | 'AMBIGUOUS_TEXT'
    | 'MISSING_EVIDENCE'
    | 'CONFLICTING_EVIDENCE'
    | 'MODEL_DISAGREEMENT'
    | 'UNSEEN_PACKAGING_LAYOUT'
    | 'UNSEEN_LANGUAGE'
    | 'UNKNOWN_RULE'
    | 'TEMPORAL_UNCERTAINTY';

export interface TemporalRule {
    id: string;
    field_name: string;
    requirement_type: 'PRESENCE' | 'FORMAT' | 'NUMERIC' | 'CROSS_FIELD';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    effective_from: Date;
    effective_to: Date | null;
    jurisdiction: string[];
}

export interface ExtractedField {
    id: string;
    field_name: string;
    raw_text: string | null;
    normalised_value: any | null;
    confidence: number;
    source_region_id: string;
    extraction_model: 'OCR_PRIMARY' | 'VISION_LANGUAGE_SECONDARY' | 'HUMAN';
}

export interface EvaluationResponse {
    requirement_id: string;
    extracted_field_ids: string[];
    result: EvaluationResult;
    unknown_category?: UnknownCategory;
    reason: string;
    // The recursive 5-question framework context for this decision
    five_q_context: {
        for_whom: string;
        which_unknowns: string[];
        how: string;
        context: string;
        outcome: string;
    };
}
