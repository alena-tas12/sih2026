# Chapter 2: Proposed Architecture - Dual-Modal Extraction & Deterministic Rule Engine

## 2.1 Overview of the Genesis Architecture

The Intelligent Packaged-Commodity Compliance and Inspection System (Genesis) introduces a novel architectural paradigm designed specifically for the domain of legal metrology. The fundamental limitation in existing automated compliance systems—including generalized prior art such as WO2025022453A1—is their reliance on monolithic artificial intelligence models that attempt to perform both perceptual extraction and legal reasoning simultaneously. This approach inherently creates a "black-box" decision process where the rationale behind a legal judgment cannot be explicitly traced back to both the source evidence and the exact statute applied. 

To overcome this, Genesis structurally segregates AI perception from deterministic legal computation. Our architecture ensures that machine learning models are strictly confined to the role of data extractors—translating pixels into structured text attributes—while a mathematically deterministic rule engine evaluates these attributes against a formalized, temporal regulatory knowledge base. This decoupling not only eliminates the risk of AI-hallucinated legal judgments but also ensures strict adherence to the Legal Metrology (Packaged Commodities) Rules, 2011, by rendering every decision fully auditable through a traceable Evidence Graph.

The system comprises three primary subsystems:
1. **The Dual-Modal Extraction Pipeline**: Responsible for robust, cross-verified attribute extraction from commodity packaging images.
2. **The Deterministic Rule Engine and Temporal Knowledge Base**: Responsible for evaluating extracted attributes against time-versioned legal rules.
3. **The Active Learning and Human-in-the-Loop (HITL) Subsystem**: Responsible for intelligently routing uncertain or legally ambiguous cases to human inspectors based on an algorithmic priority score.

## 2.2 Dual-Modal Extraction Pipeline

Extracting dense, often distorted text from curved and reflective commodity packaging presents a significant computer vision challenge. Traditional Optical Character Recognition (OCR) systems excel at localized text transcription but struggle with semantic context (e.g., distinguishing between a manufacturing date and an expiration date). Conversely, modern end-to-end Vision-Language Models (VLMs) excel at semantic understanding but are prone to hallucination, occasionally generating plausible but incorrect alphanumeric strings.

To mitigate the respective vulnerabilities of each approach, Genesis employs a Dual-Modal Extraction Pipeline. This pipeline processes input images through two orthogonal extraction methodologies and reconciles their outputs using a rigid contradiction detection protocol.

### 2.2.1 Deterministic OCR Sub-pipeline

The first modality relies on a traditional, two-stage text detection and recognition pipeline, implemented using the PaddleOCR framework. This sub-pipeline is optimized for high-fidelity geometric localization and character transcription. The process begins with a lightweight text detection network (e.g., DBNet) that predicts bounding boxes for all visible text regions. These regions are then cropped, rectified, and passed to a sequence recognition network (e.g., CRNN with CTC loss) for exact character decoding.

While the OCR sub-pipeline produces highly accurate text transcriptions, it lacks structural awareness. For instance, it may accurately read "150" and "04/25", but it cannot independently map "150" to the Maximum Retail Price (MRP) field or "04/25" to the date of manufacture. We employ subsequent Named Entity Recognition (NER) heuristics and spatial parsing algorithms to assign semantic labels to the OCR text based on geometric proximity to key phrases (e.g., finding the nearest currency symbol or the string "Rs." to identify the MRP).

### 2.2.2 OCR-Free Vision-Language Model Sub-pipeline

Operating in parallel is the OCR-Free Vision-Language Model sub-pipeline, utilizing architectures similar to Donut (Document Understanding Transformer). Unlike the OCR pipeline, the VLM does not rely on intermediate bounding boxes or explicit text detection. Instead, it treats the entire package image as a visual token sequence and directly auto-regresses a structured JSON output containing the required compliance fields (e.g., `{"mrp": "150", "mfg_date": "04/2025", "net_quantity": "500g"}`).

The VLM excels at understanding the global context of the packaging. It can successfully map fields even when standard spatial heuristics fail due to unconventional package design or complex typography. However, because it generates text auto-regressively, it carries the inherent risk of hallucination—particularly with numerical values, where it might predict an MRP of ₹15D instead of ₹150 due to visual noise or tokenization artifacts.

### 2.2.3 Cross-Modal Contradiction Detection

The outputs from the OCR sub-pipeline and the VLM sub-pipeline are merged in the Cross-Modal Contradiction Detection module. This module executes a strict reconciliation algorithm:

1. **Exact Match**: If both pipelines extract the exact same value for a specific field, the value is accepted with high confidence.
2. **Fuzzy Match (Normalized)**: For text-heavy fields (like manufacturer address), the strings are normalized (case folding, punctuation removal) and compared using Levenshtein distance. If the similarity exceeds a predefined threshold (e.g., 0.92), the OCR output is preferred due to its lower hallucination risk.
3. **Contradiction**: If the values significantly differ (e.g., OCR reads MRP as ₹150, VLM reads ₹15D), the module flags a contradiction. The system does *not* attempt to guess the correct value. Instead, the extracted field is marked with a low-confidence tag, and the contradiction is recorded in the Evidence Graph.

This dual-modal approach guarantees that the system never silently commits to a hallucinated value, ensuring that downstream legal evaluation operates strictly on verified data.

## 2.3 Deterministic Rule Engine & Temporal Knowledge Base

The core differentiator of Genesis is the absolute isolation of legal decision-making from statistical inference. Once the Dual-Modal Extraction Pipeline yields a consolidated set of attributes, the AI's role concludes. The evaluation of whether the packaged commodity complies with the Legal Metrology Rules is executed by a strictly deterministic Rule Engine.

### 2.3.1 Decoupling AI Perception from Legal Computation

In many contemporary systems, LLMs or VLMs are prompted to directly output compliance judgments (e.g., "Is this package compliant?"). This approach is unacceptable for regulatory enforcement because AI decisions are non-deterministic, irreproducible, and incapable of explicit legal citation. 

In Genesis, we treat compliance checking as a boolean satisfiability problem. The extracted attributes (the facts) are evaluated against a formalized set of logical constraints (the law). The engine executes conditional logic operations, mathematical comparisons, and date-time arithmetic that are 100% deterministic and auditable line-by-line in the source code.

### 2.3.2 Temporal Regulatory Knowledge Base

Statutes and regulations are not static; they are subject to continuous amendments, exemptions, and phase-out periods. A package manufactured in 2023 must be evaluated against the rules active in 2023, even if an inspection occurs in 2026. 

To handle this, Genesis employs a Temporal Regulatory Knowledge Base. The legal rules are encoded not as flat logic, but as versioned data structures within the PostgreSQL database. Each rule entity possesses an `effective_from` date and an `effective_to` date. 

When the Rule Engine evaluates a package, it first uses the extracted `mfg_date` (or import date) to query the Temporal Knowledge Base and construct the exact rule set applicable at the time of manufacture. This ensures accurate, context-aware compliance checks that respect regulatory history.

### 2.3.3 Evidence Sufficiency Engine

Unlike binary compliance checkers, our Evidence Sufficiency Engine recognizes that real-world inspections frequently encounter partial or obscured data. The engine maps the evaluated facts against the required rules to output one of six distinct states for every compliance criteria:

1. **COMPLIANT**: All required evidence is present, verified by the dual-modal pipeline, and satisfies the temporal legal constraints.
2. **NON_COMPLIANT**: All required evidence is present and verified, but unequivocally violates a temporal legal constraint (e.g., missing MRP, or incorrect font size).
3. **INSUFFICIENT_EVIDENCE**: The required attribute was not found by either extraction pipeline (e.g., the manufacturing date is physically obscured by a sticker).
4. **CONFLICTING_EVIDENCE**: The dual-modal pipeline detected a contradiction that could not be resolved (e.g., OCR and VLM disagree on the net quantity).
5. **NOT_APPLICABLE**: The rule does not apply to this specific commodity classification (e.g., rules specific to agricultural products do not apply to electronics).
6. **NEEDS_LEGAL_REVIEW**: The extracted attributes trigger a complex regulatory edge case that exceeds the deterministic logic's capabilities, requiring human interpretation.

This granular state model ensures the system fails gracefully and safely. It never forces a binary decision when the underlying perceptual evidence is flawed.

## 2.4 Evidence Graph and Traceability

To support legal audits and provide actionable feedback to manufacturers, Genesis constructs a directed acyclic Evidence Graph for every inspection. The graph acts as an immutable, cryptographically verifiable record of the decision-making process.

The Evidence Graph links discrete image regions (bounding boxes from the OCR) to the extracted text values, which are then linked to the specific legal rule applied (referencing the exact subsection of the Legal Metrology Rules), culminating in the final state decision.

For example, a sub-graph for an MRP check would trace:
`Image Region [x1,y1,x2,y2]` $\rightarrow$ `Raw String: "Rs. 150.00"` $\rightarrow$ `Extracted Attribute: mrp_value=150` $\rightarrow$ `Temporal Rule: Rule 6(1)(e) (Effective: 2011-Present)` $\rightarrow$ `State: COMPLIANT`.

If a package is deemed NON_COMPLIANT, the generated report includes a visual overlay highlighting the offending image region and cites the exact statutory clause violated, derived directly from the graph. This transparent lineage is critical for establishing the system's legal admissibility in tribunal proceedings.

## 2.5 Active Learning and Human-in-the-Loop Routing

Given the vast variance in packaging designs, no automated system can achieve 100% accuracy on day one. Genesis is designed to continuously improve through a Human-in-the-Loop (HITL) architecture and an Active Learning Priority Scoring mechanism.

When the Evidence Sufficiency Engine outputs states of INSUFFICIENT_EVIDENCE, CONFLICTING_EVIDENCE, or NEEDS_LEGAL_REVIEW, the inspection job is routed to the BullMQ/Redis job queue for manual review by a human metrology inspector.

### 2.5.1 Unknowns Taxonomy

To aid the human reviewer and structure the active learning data, the system classifies failures using a strict Unknowns Taxonomy. Every routed case is tagged with one or more of the following meta-labels:
- **MODEL_DISAGREEMENT**: Triggered when the OCR and VLM pipelines extract contradictory values.
- **TEMPORAL_UNCERTAINTY**: Triggered when a required date field is illegible, preventing the selection of the correct temporal rule set.
- **AMBIGUOUS_TEXT**: Triggered when text is extracted with low confidence (e.g., due to blur or glare).
- **MISSING_EVIDENCE**: Triggered when a required attribute cannot be located anywhere on the package.

By explicitly categorizing its own failures, the system provides contextual onboarding for the human reviewer, explaining exactly *why* manual intervention is required.

### 2.5.2 Priority Scoring for Legal Review

In high-throughput environments, human inspectors cannot review every flagged case immediately. Genesis implements an Active Learning Priority Scoring algorithm to dynamically rank the queue of pending reviews.

The priority score is calculated using a weighted combination of:
1. **Uncertainty Density**: Cases with multiple conflicts or missing fields receive higher scores.
2. **Regulatory Risk**: Rules carrying higher statutory penalties (e.g., missing MRP or deceptive net quantity declarations) weigh heavier than minor formatting infractions.
3. **Information Gain (Active Learning)**: Cases exhibiting high `MODEL_DISAGREEMENT` are prioritized because resolving these contradictions provides high-value training data for fine-tuning the underlying models.

Once a human reviewer resolves a case via the React/Vite frontend—by manually correcting an extracted field or confirming a legal exception—the corrected data point is written back to the PostgreSQL database. The Python ML worker periodically samples these resolved cases to retrain and calibrate the dual-modal extraction models, creating a continuous feedback loop that progressively reduces the human review burden over time.

## 2.6 Conclusion

The architecture proposed in Chapter 2 establishes Genesis not merely as an application of machine learning, but as a rigorous legal computation engine. By strictly separating AI perception from deterministic legal evaluation, implementing a dual-modal extraction pipeline with contradiction detection, and enforcing comprehensive traceability via the Evidence Graph, Genesis resolves the critical transparency deficits inherent in prior art. The integration of a temporal knowledge base ensures regulatory accuracy across time, while the intelligent active learning loop guarantees that the system robustly handles edge cases and continually adapts to the evolving landscape of packaged commodities in India.
