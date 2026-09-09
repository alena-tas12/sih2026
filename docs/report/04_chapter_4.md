# Chapter 4: System Implementation & Technology Stack

## 4.1 Introduction

The Genesis Compliance platform is designed to operate in high-throughput government and enterprise environments where both computational efficiency and architectural simplicity are paramount. Our objective during the implementation phase was to build a robust foundation capable of processing thousands of packaged-commodity compliance checks daily, without incurring the operational overhead typically associated with distributed microservices. To this end, we adopted a modular monolith architecture for the core application, supplemented by a dedicated Python microservice strictly isolated for the machine learning (ML) and computer vision workloads. 

This chapter details the specific technologies selected for the Genesis Compliance system, the rationale behind these choices, and the concrete implementation patterns we utilized. The core technology stack consists of a React and TypeScript frontend built with Vite, a Node.js API backend powered by Fastify, a robust asynchronous job queue utilizing Redis and BullMQ, relational data persistence via PostgreSQL, and a specialized Python worker handling the dual-modal extraction pipeline employing Donut and PaddleOCR.

## 4.2 Architectural Paradigm: Modular Monolith

While microservices are often favored for highly scalable systems, the inherent complexity of managing network partitions, distributed transactions, and inter-service communication can reduce development velocity and complicate deployment in air-gapped or on-premise government environments. We opted for a modular monolith approach for the primary business logic layer. In this architecture, distinct functional domains—such as `ComplianceEngine`, `EvidenceGraph`, and `TemporalRules`—are encapsulated as separate modules within a single Node.js codebase.

These modules communicate via in-memory function calls rather than over a network, ensuring low latency and high reliability. The separation of concerns is strictly enforced at the directory and dependency levels. For example, the `ComplianceEngine` module is not permitted to directly query the database tables belonging to the `Auth` module; it must interface through explicitly defined service methods like `UserService.getRole()`. 

The single exception to this monolithic pattern is the AI perception layer. Because machine learning workloads require vastly different computational resources (GPUs) and a distinct ecosystem (Python) compared to deterministic legal computation, we separated the ML pipeline into an isolated worker service. This hybrid approach—a core modular monolith coupled with a specialized microservice—delivers the operational simplicity of a monolith alongside the targeted scalability of a distributed system.

## 4.3 Frontend Implementation

The user interface for Genesis Compliance is built using React and TypeScript, bootstrapped with the Vite build tool. The frontend serves multiple distinct user roles, including Data Entry Operators, Compliance Inspectors, and Legal Reviewers, requiring a highly responsive and strictly typed application structure.

### 4.3.1 Component Architecture and TypeScript

We designed the frontend around a component-driven architecture, heavily utilizing React Hooks for state management and side effects. TypeScript acts as the backbone of our development process, ensuring that the evidence graphs and complex compliance states returned by the backend API are parsed safely. For instance, the Evidence Sufficiency Engine returns one of six distinct states (`COMPLIANT`, `NON_COMPLIANT`, `INSUFFICIENT_EVIDENCE`, `CONFLICTING_EVIDENCE`, `NOT_APPLICABLE`, `NEEDS_LEGAL_REVIEW`). We define this as a strict TypeScript union type:

```typescript
type ComplianceState = 
  | 'COMPLIANT' 
  | 'NON_COMPLIANT' 
  | 'INSUFFICIENT_EVIDENCE' 
  | 'CONFLICTING_EVIDENCE' 
  | 'NOT_APPLICABLE' 
  | 'NEEDS_LEGAL_REVIEW';

interface EvidenceGraphNode {
  id: string;
  regionId: string;
  extractedValue: string | null;
  ruleId: string;
  decisionState: ComplianceState;
  confidenceScore: number;
}
```

By strictly typing the API payloads, we eliminate a significant class of runtime errors related to malformed data parsing.

### 4.3.2 Build Tooling and Performance

Vite replaces traditional bundlers like Webpack in our stack, providing instantaneous hot module replacement (HMR) during development. For production builds, Vite utilizes Rollup to generate highly optimized, chunked static assets. We implemented aggressive code-splitting at the route level, ensuring that users only download the JavaScript bundles necessary for their specific view. For example, the heavy rendering logic associated with visualizing the Evidence Graph on the image canvas is only loaded when an inspector navigates to the detailed review screen.

## 4.4 Backend API Services

The core API backend is engineered using Node.js and Fastify. While Express is a common choice in the Node ecosystem, we selected Fastify for its significantly higher throughput capabilities and built-in schema validation. Fastify achieves superior performance by utilizing `pino` for low-overhead logging and `ajv` (Another JSON Schema Validator) for route serialization and input validation.

### 4.4.1 Fastify Route Handlers and Validation

In Genesis Compliance, the volume of incoming package images and metadata necessitates strict validation before any processing occurs. Fastify allows us to define JSON schemas for both incoming requests and outgoing responses, which are compiled into highly efficient validation functions during server startup.

```javascript
const analyzePackageSchema = {
  body: {
    type: 'object',
    required: ['imagePath', 'categoryCode', 'submissionDate'],
    properties: {
      imagePath: { type: 'string' },
      categoryCode: { type: 'string', maxLength: 10 },
      submissionDate: { type: 'string', format: 'date-time' }
    }
  },
  response: {
    202: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        status: { type: 'string' }
      }
    }
  }
};

fastify.post('/api/v1/compliance/analyze', { schema: analyzePackageSchema }, async (request, reply) => {
  const { imagePath, categoryCode, submissionDate } = request.body;
  const jobId = await JobQueueService.enqueueAnalysis(imagePath, categoryCode, submissionDate);
  return reply.code(202).send({ jobId, status: 'QUEUED' });
});
```

This schema-driven approach ensures that malformed requests are rejected at the framework boundary, protecting the internal deterministic logic and preventing unnecessary load on the database or job queues.

### 4.4.2 Separation of AI Perception and Deterministic Logic

A core principle of the Genesis architecture is the strict separation of probabilistic AI perception from deterministic legal computation. The Fastify application houses the Temporal Regulatory Knowledge Base and the Evidence Sufficiency Engine. When an image is received, the Node.js backend does not process the image directly. Instead, it dispatches the image to the Python ML worker and waits for the extraction results. Once the raw fields (such as MRP, net quantity, manufacturer address) are returned, the Node.js application applies the deterministic rules—e.g., verifying if the extracted MRP text complies with the formatting mandated by the Legal Metrology Rules, 2011, effective for the given date.

## 4.5 Asynchronous Task Processing

Processing high-resolution package images through complex neural networks is inherently synchronous and time-consuming. To prevent the API from blocking and to manage bursts of traffic effectively, we implemented a robust asynchronous job queue utilizing Redis and BullMQ.

### 4.5.1 Redis and BullMQ Architecture

BullMQ is a fast, reliable, and advanced message queue based on Redis for Node.js. In our system, the Fastify API acts as the producer, creating jobs when new packages are submitted. These jobs are placed in a Redis-backed queue. We utilize BullMQ's support for delayed jobs, retries with exponential backoff, and rate limiting.

The job payload typically contains references to the stored image file and relevant metadata. BullMQ orchestrates the flow of these jobs to the Python ML workers. 

### 4.5.2 Priority Scoring and Active Learning Routing

We heavily rely on BullMQ's priority queuing features to implement our Active Learning Priority Scoring. Packages that are flagged with a high uncertainty score by the system—perhaps due to the `Unknowns Taxonomy` identifying `MODEL_DISAGREEMENT` (where OCR and Vision-Language models conflict) or `TEMPORAL_UNCERTAINTY` (where the package date falls on a boundary of a rule change)—are assigned a higher priority in the manual review queue.

```javascript
// Example of enqueueing a task with priority based on uncertainty score
async function enqueueManualReview(evidenceGraph, uncertaintyScore) {
  // Higher uncertainty means lower priority number in BullMQ (processed first)
  const priorityLevel = calculatePriority(uncertaintyScore); 
  
  await reviewQueue.add('manual_inspection', { evidenceGraph }, {
    priority: priorityLevel,
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  });
}
```

This ensures that human reviewers are always looking at the most critical or confusing cases first, maximizing the efficiency of government inspectors.

## 4.6 Machine Learning and Vision Pipeline

The AI perception layer is implemented as a specialized Python microservice. This service is responsible for the dual-modal extraction process, pulling data from images using both Optical Character Recognition (OCR) and Vision-Language Models (VLM).

### 4.6.1 Dual-Modal Extraction: PaddleOCR and Donut

We employ PaddleOCR as our primary deterministic text extraction engine. PaddleOCR was selected for its exceptional accuracy in handling multi-lingual text and challenging real-world package orientations. It returns bounding boxes, text transcriptions, and confidence scores.

In parallel, we utilize Donut (Document Understanding Transformer), an end-to-end VLM. Unlike OCR, which simply reads text, Donut is capable of structural understanding. We fine-tuned a Donut model to extract key-value pairs directly from package images without relying on an intermediate OCR step.

### 4.6.2 Contradiction Detection

The Python worker runs both PaddleOCR and Donut on incoming images. The outputs are then passed through a contradiction detection module. If PaddleOCR extracts "₹150.00" in the region identified as the MRP, but the Donut model predicts the MRP is "150D", the contradiction detector flags the discrepancy.

```python
class ContradictionDetector:
    def __init__(self, threshold=0.85):
        self.similarity_threshold = threshold

    def detect(self, ocr_result: str, vlm_result: str) -> bool:
        # Normalize strings
        ocr_norm = self._normalize(ocr_result)
        vlm_norm = self._normalize(vlm_result)
        
        # Calculate Levenshtein or specialized domain similarity
        similarity = calculate_similarity(ocr_norm, vlm_norm)
        return similarity < self.similarity_threshold
```

When a contradiction is detected, the Python worker assigns a high `Unknowns Taxonomy` flag of `MODEL_DISAGREEMENT`, which the Node.js backend later uses to set the state to `CONFLICTING_EVIDENCE` and prioritize the item for human review. The Python worker exposes these results back to the Node environment via a REST API, or by directly updating the job state in Redis.

## 4.7 Data Persistence Layer

For relational data storage, we selected PostgreSQL. PostgreSQL provides the robust ACID compliance required for legal and regulatory record-keeping.

### 4.7.1 Schema Design for Temporal Rules

A critical component of Genesis Compliance is the Temporal Regulatory Knowledge Base. Legal rules change over time, and a package manufactured in 2022 must be judged against the rules active in 2022, not the current rules. We modeled this in PostgreSQL using temporal validity ranges.

The `rules` table includes `effective_from` and `effective_to` timestamp columns. We utilize PostgreSQL's `tsrange` (timestamp range) data types and exclusion constraints to ensure that overlapping rule definitions cannot exist for the same compliance category.

```sql
CREATE TABLE regulatory_rules (
    rule_id UUID PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL,
    rule_description TEXT,
    validity_period TSTZRANGE NOT NULL,
    EXCLUDE USING GIST (category_code WITH =, validity_period WITH &&)
);
```

This database structure guarantees that the Node.js application can deterministically query the exact legal framework applicable to any specific point in time, completely separating the complex rule history from the application logic.

### 4.7.2 Evidence Graph Storage

The resulting Evidence Graph, which links image regions to extracted fields, to legal rules, and finally to decisions, is stored in PostgreSQL utilizing the `JSONB` column type. While the core relational data (such as package ID, overall status, and timestamp) are stored in standard columns for efficient indexing and querying, the highly nested and variable structure of the evidence graph is perfectly suited for `JSONB`. This allows us to query deep within the graph structure—for example, finding all packages where the MRP field specifically had a `CONFLICTING_EVIDENCE` state—using PostgreSQL's advanced JSON operators.

## 4.8 Deployment and Scalability Considerations

Genesis Compliance is explicitly designed for deployment in government and enterprise environments. These environments often impose stringent security policies, including air-gapped networks and strict access controls.

### 4.8.1 Containerization and Portability

The entire technology stack is containerized using Docker. We maintain separate `Dockerfiles` for the frontend (served via Nginx), the Node.js backend, the Python ML worker, Redis, and PostgreSQL. We use `docker-compose` for orchestration in smaller deployments and Kubernetes manifests for enterprise-scale environments.

Containerization ensures that the exact same environment used during development is replicated in production, eliminating "it works on my machine" issues. Furthermore, by packaging the heavy Python dependencies (such as PyTorch for Donut and PaddlePaddle for PaddleOCR) into a fixed container image, we simplify the deployment process for government IT teams who may not have extensive experience managing complex ML environments.

### 4.8.2 Horizontal Scalability

The modular monolith architecture combined with asynchronous queues allows for targeted horizontal scaling. The most resource-intensive component of the system is the Python ML worker. Because the Fastify API and the Python worker communicate via the Redis job queue, we can scale them independently. 

If a government agency experiences a massive influx of inspection requests, they can simply spin up additional instances of the Python ML worker container, ideally on GPU-accelerated nodes. The Node.js Fastify API, being highly efficient at handling I/O operations, requires far fewer instances to handle the same volume of traffic. This decoupled scaling ensures high throughput while optimizing infrastructure costs.

### 4.8.3 Handling the Prior Art

It is important to acknowledge the existing patent landscape, specifically WO2025022453A1, which describes a basic methodology for capturing package images, passing them through an AI module to check compliance, and generating a report. Our architectural implementation deliberately builds around this prior art. Instead of relying on a black-box AI module to determine compliance directly, our system uses the AI purely for perception (the Python worker) and enforces deterministic, transparent legal reasoning in a separate layer (the Node.js Fastify API). The introduction of the Evidence Graph and the 6-state Evidence Sufficiency Engine are novel architectural implementations that ensure the traceability and accountability required by legal metrology standards, distinguishing our technology stack fundamentally from generic image-to-report pipelines.
