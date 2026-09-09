# Phase 0: Product Specification & Acceptance Criteria

## Users
- **Compliance Officers / Inspectors:** Review flagged cases, make final legal determinations.
- **Business Users (Manufacturers/Importers):** Pre-validate packaging before launch.

## Input
- Images of packaged commodity labels (front, back, sides containing declarations).

## Output
- Extracted structured fields (MRP, Net Quantity, Dates, Manufacturer details).
- Applicable legal requirements based on the product category and scan date.
- Deterministic compliance findings (Pass / Fail / Needs Review).
- Explainable evidence (bounding boxes + OCR text + confidence scores).
- A reviewable report preserving the audit trail.

## Initial Scope (MVP)
- **Product Category:** General Packaged Commodities (non-food retail items) to start.
- **Specific Requirements Checked:**
  - Net Quantity declaration presence and format.
  - Maximum Retail Price (MRP) declaration presence and format.
  - Manufacturer / Packer / Importer address presence.
- **Language:** English text extraction.

## Out of Scope (For MVP)
- Unsupported legal conclusions (the AI does not say "You are guilty of a Section 36 violation").
- Automatic enforcement actions (no automatic penalty notices).
- The system does not replace a human legal expert; it acts as an evidence-gathering and filtering tool.

## Acceptance Criteria
- A user can upload a package image.
- The system extracts the Net Quantity, MRP, and Manufacturer address.
- The system links these extractions to specific image regions.
- The deterministic rule engine evaluates if these declarations exist and are formatted correctly according to a versioned rule.
- The system flags missing or malformed data as "Needs Review".
- The entire process is saved as a traceable "Case" in the database.
