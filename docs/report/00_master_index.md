# Master Index: Intelligent Packaged-Commodity Compliance System
## Comprehensive Technical & Research Report

> **Note on Length:** A 40,000 to 50,000-word report is equivalent to a full academic dissertation or a published book. This index structures the report so it can be generated and expanded iteratively chapter-by-chapter.

### Part I: Introduction and Problem Domain
* **Chapter 1: The Packaged Commodity Compliance Landscape in India**
  * Scale of the problem (Legal Metrology, FSSAI, BIS)
  * Failures of manual inspection
  * The limits of existing OCR and "Black-Box" AI tools
* **Chapter 2: Prior Art and Patent Landscape**
  * Analysis of WO2025022453A1 and related patents
  * Defining the architectural novelty gap

### Part II: System Architecture
* **Chapter 3: The Closed-Loop Intelligence Architecture**
  * Moving from static checks to evidence sufficiency
  * The Evidence Graph formulation
* **Chapter 4: The Regulatory Knowledge Base**
  * Temporal rule versioning and time-travel compliance
  * Proactive rule-change impact propagation
* **Chapter 5: Dual-Modal Evidence Fusion**
  * Mitigating OCR failures with Vision-Language Models (Donut, LayoutLM)
  * Spatial reasoning and contradiction detection

### Part III: Engineering and Implementation
* **Chapter 6: Deterministic Evidence Sufficiency Engine**
  * The mathematics of uncertainty
  * Categorizing unknowns: `MODEL_DISAGREEMENT`, `TEMPORAL_UNCERTAINTY`, `MISSING_EVIDENCE`
* **Chapter 7: Backend and Queue Infrastructure**
  * Node.js, Express, BullMQ, Redis, PostgreSQL integration
* **Chapter 8: Frontend and Human-in-the-Loop**
  * Inspector dashboards and Active Learning queues

### Part IV: Research and Future Work
* **Chapter 9: The Recursive Five-Question Framework**
  * Institutionalizing unknown-management
* **Chapter 10: Building an Indian Packaging Dataset**
  * From static evaluation to continuous model improvement
