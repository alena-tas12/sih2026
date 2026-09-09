import { UnknownsEngine } from '../src/evaluator';
import { TemporalRule, ExtractedField } from '../src/types';

describe('UnknownsEngine', () => {
    const engine = new UnknownsEngine();
    const scanDate = new Date('2026-06-01');

    test('should return TEMPORAL_UNCERTAINTY if rule is not active', () => {
        const rule: TemporalRule = { 
            id: 'r1', field_name: 'mrp', requirement_type: 'PRESENCE', severity: 'HIGH', 
            effective_from: new Date('2027-01-01'), effective_to: null, jurisdiction: ['IN'] 
        };
        const result = engine.evaluate(rule, scanDate, []);
        expect(result.unknown_category).toBe('TEMPORAL_UNCERTAINTY');
    });

    test('should return MODEL_DISAGREEMENT if OCR and VLM conflict', () => {
        const rule: TemporalRule = { 
            id: 'r2', field_name: 'net_quantity', requirement_type: 'NUMERIC', severity: 'HIGH', 
            effective_from: new Date('2025-01-01'), effective_to: null, jurisdiction: ['IN'] 
        };
        const evidence: ExtractedField[] = [
            { id: 'e1', field_name: 'net_quantity', raw_text: '500 q', normalised_value: null, confidence: 0.9, source_region_id: 'box1', extraction_model: 'OCR_PRIMARY' },
            { id: 'e2', field_name: 'net_quantity', raw_text: null, normalised_value: 500, confidence: 0.9, source_region_id: 'box1', extraction_model: 'VISION_LANGUAGE_SECONDARY' }
        ];
        
        const result = engine.evaluate(rule, scanDate, evidence);
        expect(result.unknown_category).toBe('MODEL_DISAGREEMENT');
    });

    test('should return PASS if evidence is unambiguous and numeric rule is met', () => {
        const rule: TemporalRule = { 
            id: 'r3', field_name: 'mrp', requirement_type: 'NUMERIC', severity: 'HIGH', 
            effective_from: new Date('2025-01-01'), effective_to: null, jurisdiction: ['IN'] 
        };
        const evidence: ExtractedField[] = [
            { id: 'e3', field_name: 'mrp', raw_text: 'Rs 150', normalised_value: 150, confidence: 0.95, source_region_id: 'box2', extraction_model: 'OCR_PRIMARY' }
        ];
        
        const result = engine.evaluate(rule, scanDate, evidence);
        expect(result.result).toBe('PASS');
    });
});
