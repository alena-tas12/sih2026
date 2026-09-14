# Genesis Compliance

**Dual-Modal Extraction & Deterministic Rule Engine for Packaged Commodity Compliance**

Built for **Smart India Hackathon 2026** — an AI-powered platform that verifies packaged commodity declarations (MRP, Net Quantity, Manufacturer Address, FSSAI marks) using a dual-modal vision pipeline and cross-location comparison engine.

[![Live Demo](https://img.shields.io/badge/Live-sih2026.barnes--vianalen.workers.dev-black?style=for-the-badge)](https://sih2026.barnes-vianalen.workers.dev)

---

## Architecture

```
React/Vite Frontend → Cloudflare Worker (Hono API) → D1 Database
```

Single Cloudflare Worker serves both the static React app and the API. No separate backend host required.

```
genesis-compliance/
├── apps/
│   ├── api/              # Hono Worker API (Edge Runtime)
│   │   └── src/
│   │       ├── index.js          # Entry point, CORS, routing, SPA fallback
│   │       └── routes/
│   │           ├── products.js       # GET/PUT product master
│   │           ├── inspections.js    # GET/POST inspection cases
│   │           ├── dashboard.js      # Aggregated metrics
│   │           ├── settings.js       # Engine thresholds
│   │           ├── locations.js      # Hub/warehouse registry
│   │           ├── evidence.js       # Evidence crops
│   │           └── audit-logs.js     # Immutable audit ledger
│   └── web/              # React + TypeScript + Vite
│       └── src/
│           ├── components/
│           │   ├── Sidebar.tsx
│           │   └── Topbar.tsx
│           └── pages/
│               ├── DashboardPage.tsx
│               ├── InspectionsPage.tsx
│               ├── ProductsPage.tsx
│               ├── CasesPage.tsx
│               ├── EvidencePage.tsx
│               ├── RegulationsPage.tsx
│               ├── AnalyticsPage.tsx
│               ├── AuditLogPage.tsx
│               ├── CaseReviewPage.tsx
│               └── SettingsPage.tsx
├── packages/
│   └── rule-engine/      # Deterministic compliance rule evaluator
├── docs/                 # Report chapters & documentation
├── wrangler.toml         # Cloudflare Worker config + D1 binding
└── package.json
```

## Core Features

| Feature | Description |
|---|---|
| **Dual-Modal Extraction** | PaddleOCR + Donut VLM run in parallel. If they disagree, the system halts for human review instead of guessing. |
| **Cross-Location Comparison** | Same product scanned at different hubs → declarations are compared. Differences trigger review, not auto-rejection. |
| **Deterministic Rule Engine** | Legal text (PC Rules 2011, FSSAI) is encoded as verifiable AST logic, not black-box AI. |
| **Evidence Graph** | Every extraction is linked to a cryptographic image crop for full auditability. |
| **Human-in-the-Loop** | The system says *"Declaration difference detected — human review required"*, never *"AI says illegal"*. |
| **6-State Sufficiency Engine** | CONFIRMED_COMPLIANT, CONFIRMED_VIOLATION, MODEL_DISAGREEMENT, REGULATORY_AMBIGUITY, MISSING_EVIDENCE, TEMPORAL_UNCERTAINTY |

## Product Cycle

```
Product → Location → Inspection → Evidence → Extraction → Comparison → Regulatory Check → Human Review → Final Decision → Product History
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Backend | Hono (Edge Runtime) |
| Database | Cloudflare D1 (SQLite) |
| Hosting | Cloudflare Workers |
| OCR Pipeline | PaddleOCR v4 + Donut VLM |
| Rule Engine | Custom AST evaluator (TypeScript) |

## Local Development

```bash
# Install dependencies
cd apps/api && npm install
cd ../web && npm install

# Run frontend dev server (with API proxy)
cd apps/web && npm run dev

# Deploy to Cloudflare
npm run build
npx wrangler deploy
```

## Database

Schema is in `apps/api/schema.sql`. Apply it to your D1 database:

```bash
npx wrangler d1 execute genesis_db --remote --file=./apps/api/schema.sql
```

Or paste the SQL directly into the Cloudflare D1 Dashboard Console.

## Design Philosophy

- **Black, white, and gray** — status colors (green/amber/red) are tiny indicators only
- **The barcode identifies the product, not proves compliance**
- **AI extracts, humans decide** — the system surfaces evidence, never renders legal judgment
- **Deterministic over probabilistic** — legal rules are hard-coded logic, not model outputs

## License

MIT

---

*Built for SIH 2026 by Team Genesis*
