# Chapter 5: Security, Scalability, and Government Integration

As the Intelligent Packaged-Commodity Compliance and Inspection System (Genesis Compliance) transitions from a prototype to a national deployment, the architectural constraints shift significantly. A national rollout across multiple regional packaging hubs necessitates an infrastructure capable of handling high-throughput image processing, asynchronous job queues, and robust data security, while maintaining the determinism required for legal enforcement. This chapter details our approach to scaling the system, securing the evidence chain, and integrating with external government infrastructure.

## 5.1 Architectural Scalability and Deployment Strategy

The core challenge in scaling our system lies in the computational asymmetry between our components. The deterministic legal computation (the Evidence Sufficiency Engine and Temporal Regulatory Knowledge Base) is lightweight and CPU-bound, whereas the AI perception layer (Dual-modal extraction via OCR and Vision-Language Models) requires significant GPU resources. Furthermore, the ingestion rate of packaging images from distributed hubs can be highly bursty.

To address this, we designed a microservices architecture deployed via Kubernetes, allowing independent horizontal scaling of each component. 

### 5.1.1 Asynchronous Job Processing with BullMQ

We utilize a Node.js/Express API gateway to handle incoming inspection requests. To decouple request ingestion from the heavy perception tasks, we employ BullMQ backed by a Redis cluster (`redis-cluster.yaml`). 

When a new inspection request arrives, the Express API creates a job payload containing the image references and the relevant product metadata, and enqueues it. 

```typescript
// src/api/queue/InspectionQueue.ts
import { Queue } from 'bullmq';

export const inspectionQueue = new Queue('compliance-inspection', {
  connection: redisConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
  }
});

export async function enqueueInspection(imageUris: string[], hubId: string, timestamp: string) {
  const job = await inspectionQueue.add('inspect-package', {
    imageUris,
    hubId,
    timestamp,
    priorityScore: calculateInitialPriority(hubId) 
  });
  return job.id;
}
```

The Python ML workers subscribe to this queue. By running the Python workers as a separate Kubernetes Deployment with a Horizontal Pod Autoscaler (HPA) bound to a GPU metric server, we can dynamically provision worker nodes based on queue depth. This ensures we do not maintain idle GPU instances during low-traffic periods (e.g., night shifts) while handling peak ingestion from packaging lines without request timeouts.

### 5.1.2 The Python ML Worker and Perception Pipeline

The Python ML worker (`ml_worker/worker.py`) performs the dual-modal extraction. It fetches the image, runs the OCR model, and queries the Vision-Language Model. If contradiction detection flags a discrepancy (e.g., OCR reads `₹15D` but VLM reads `₹150`), the worker updates the Evidence Graph with a `MODEL_DISAGREEMENT` state from our Unknowns Taxonomy. 

The separation of perception from legal reasoning ensures that the ML worker only produces the extracted fields and their confidence scores. It does not decide if the package is legally compliant. This separation allows us to scale the perception layer independently of the regulatory logic, maintaining the system's modularity.

## 5.2 Security and Evidence Integrity

In legal metrology, the output of the compliance system may serve as grounds for punitive action against manufacturers. Consequently, the integrity of the data—from image capture to the final compliance decision—must be cryptographically secure and tamper-evident. We designed our security model to address both unauthorized access and data repudiation.

### 5.2.1 Role-Based Access Control (RBAC)

Access to the Genesis Compliance system is strictly governed by a granular Role-Based Access Control (RBAC) model implemented in our Node.js API and enforced via JWT (JSON Web Tokens). We defined specific roles to mirror the operational hierarchy of the Legal Metrology Department:

*   **INSPECTOR**: Can submit new package images, view results for their designated hub, and transition cases from `NEEDS_LEGAL_REVIEW` to a final state.
*   **AUDITOR**: Has read-only access across multiple hubs to review the Evidence Graph and Active Learning Priority Scoring.
*   **ADMINISTRATOR**: Manages the Temporal Regulatory Knowledge Base, updating rules with specific `effective_from` and `effective_to` dates.

The React/Vite frontend dynamically adjusts the interface based on the user's role claims, hiding administrative panels from field inspectors.

### 5.2.2 Cryptographic Audit Logging and the Evidence Graph

A significant limitation of existing prior art, such as the systems described in patent WO2025022453A1, is the lack of verifiable provenance for the AI's decisions. To ensure our system's outputs are legally defensible, we implemented a cryptographic audit log tightly coupled with the Evidence Graph.

Every node in the Evidence Graph (image regions, extracted fields, legal rules applied, and the final decision) is serialized and hashed. We use a PostgreSQL database with an append-only audit table. When the Evidence Sufficiency Engine reaches one of its terminal or semi-terminal states (`COMPLIANT`, `NON_COMPLIANT`, `INSUFFICIENT_EVIDENCE`, `CONFLICTING_EVIDENCE`, `NOT_APPLICABLE`, `NEEDS_LEGAL_REVIEW`), the entire graph is serialized, signed using a secure key management service (KMS), and stored.

```python
# src/engine/evidence_graph.py
import hashlib
import json

class EvidenceGraph:
    def __init__(self, inspection_id):
        self.inspection_id = inspection_id
        self.nodes = []
        self.edges = []
        self.signature = None

    def add_node(self, node_type, data, source):
        self.nodes.append({"type": node_type, "data": data, "source": source})

    def generate_cryptographic_hash(self):
        # Serialize deterministically
        payload = json.dumps({"nodes": self.nodes, "edges": self.edges}, sort_keys=True)
        return hashlib.sha256(payload.encode('utf-8')).hexdigest()
        
    def sign_graph(self, kms_client):
        graph_hash = self.generate_cryptographic_hash()
        self.signature = kms_client.sign(graph_hash)
```

If a manufacturer disputes a non-compliance notice, the auditor can retrieve the specific Evidence Graph and verify its signature. Any alteration to the database—such as modifying an OCR result or changing a rule in the Temporal Regulatory Knowledge Base retroactively—would invalidate the hash, providing mathematical proof of tampering.

## 5.3 External System Integration

For Genesis Compliance to function effectively at a national scale, it cannot exist as an isolated silo. It must verify the extracted package information against authoritative government product masters. 

### 5.3.1 Interfacing with the FSSAI Database

When inspecting food commodities, our system interfaces securely with the Food Safety and Standards Authority of India (FSSAI) database via REST APIs. This integration is crucial for verifying license numbers and manufacturer details extracted from the package.

We designed a dedicated synchronization service (`src/services/FssaiIntegrationService.ts`) that acts as an adapter. When the ML worker extracts an FSSAI license number, the Evidence Sufficiency Engine triggers a request to the integration service.

```typescript
// src/services/FssaiIntegrationService.ts
import axios from 'axios';

export class FssaiIntegrationService {
    private baseUrl: string;
    private apiKey: string;

    constructor() {
        this.baseUrl = process.env.FSSAI_API_BASE_URL;
        this.apiKey = process.env.FSSAI_API_KEY;
    }

    async verifyLicense(licenseNumber: string): Promise<FssaiVerificationResult> {
        try {
            const response = await axios.get(`${this.baseUrl}/licenses/${licenseNumber}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Request-ID': generateCorrelationId()
                },
                timeout: 5000 // Strict timeout to prevent blocking the engine
            });
            
            return {
                isValid: response.data.status === 'ACTIVE',
                manufacturerName: response.data.manufacturerName,
                registeredAddress: response.data.address
            };
        } catch (error) {
            // Handle timeouts and 5xx errors by assigning a specific unknown state
            return { isValid: false, errorState: 'EXTERNAL_SERVICE_UNAVAILABLE' };
        }
    }
}
```

If the extracted manufacturer address contradicts the FSSAI registered address, the Evidence Sufficiency Engine flags this as `CONFLICTING_EVIDENCE`. If the FSSAI API is unreachable, the system relies on our Unknowns Taxonomy, classifying the missing verification as `MISSING_EVIDENCE` (specifically, external corroboration missing), preventing the system from failing silently or producing a false compliance result. 

### 5.3.2 Active Learning Feedback Loop Integration

The integration with human reviewers—specifically for cases marked as `NEEDS_LEGAL_REVIEW`—forms a critical feedback loop. The React frontend presents the inspector with the Evidence Graph and the exact image regions that caused the uncertainty (e.g., due to `AMBIGUOUS_TEXT` or `TEMPORAL_UNCERTAINTY` regarding rule effective dates). 

When the inspector resolves the case, their decision is fed back into the PostgreSQL database. We built a periodic job that aggregates these resolutions to retrain our Active Learning Priority Scoring model, gradually reducing the number of cases requiring human intervention as the system adapts to new packaging formats and edge cases encountered across the national deployment.
