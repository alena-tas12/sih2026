# Rule Engine

Rule engine for the Genesis Compliance system that evaluates compliance rules and generates evidence graphs.

## Installation

```bash
npm install @genesis-compliance/rule-engine
```

## Usage

```typescript
import { Evaluator, KnowledgeBase, SufficiencyEngine } from '@genesis-compliance/rule-engine';

// Create a knowledge base
const kb = new KnowledgeBase();

// Add compliance rules
kb.addRule({
  id: 'rule-1',
  name: 'Data Protection Rule',
  condition: (data) => data.encrypted === true
});

// Evaluate rules
const evaluator = new Evaluator(kb);
const results = evaluator.evaluate(data);

// Check sufficiency
const engine = new SufficiencyEngine();
const isSufficient = engine.checkSufficiency(results);
```

## Features

- Rule evaluation engine
- Evidence graph generation
- Knowledge base management
- Sufficiency checking
- TypeScript support

## License

MIT
