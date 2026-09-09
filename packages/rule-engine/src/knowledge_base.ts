import { TemporalRule } from './types';

export class RegulatoryKnowledgeBase {
    private rules: Map<string, TemporalRule[]> = new Map();

    /**
     * Add or update a rule version in the knowledge base.
     */
    public addRuleVersion(ruleId: string, rule: TemporalRule) {
        if (!this.rules.has(ruleId)) {
            this.rules.set(ruleId, []);
        }
        this.rules.get(ruleId)!.push(rule);
    }

    /**
     * Get the applicable rule version for a specific date and product category.
     */
    public getApplicableRule(ruleId: string, date: Date, category: string): TemporalRule | null {
        const versions = this.rules.get(ruleId) || [];
        
        for (const version of versions) {
            // Check applicability: Temporal bounds and Category/Jurisdiction
            const isTemporallyActive = date >= version.effective_from && (!version.effective_to || date <= version.effective_to);
            const isCategoryApplicable = version.jurisdiction.includes(category); // Using jurisdiction field as category proxy for MVP

            if (isTemporallyActive && isCategoryApplicable) {
                return version;
            }
        }
        return null;
    }

    /**
     * Simulate a regulatory amendment (e.g., DoCA publishes a new rule effective next year).
     */
    public applyAmendment(ruleId: string, newVersion: TemporalRule) {
        // Find current active rule and cap its effective_to date
        const versions = this.rules.get(ruleId) || [];
        const currentActive = versions.find(v => !v.effective_to || v.effective_to > newVersion.effective_from);
        
        if (currentActive) {
            // Cap the old rule the millisecond before the new one starts
            currentActive.effective_to = new Date(newVersion.effective_from.getTime() - 1);
        }
        
        this.addRuleVersion(ruleId, newVersion);
    }

    public getAllApplicableRules(date: Date, category: string): TemporalRule[] {
        const applicable: TemporalRule[] = [];
        for (const [ruleId] of this.rules.entries()) {
            const rule = this.getApplicableRule(ruleId, date, category);
            if (rule) applicable.push(rule);
        }
        return applicable;
    }
}
