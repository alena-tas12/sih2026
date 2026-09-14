# Genesis Compliance - Demo Video Presenter Notes

## Introduction (0:00 - 0:30)
- **Visual**: Start on the **Dashboard** page.
- **Script**: "Welcome to Genesis. Genesis is a nationwide compliance enforcement network that provides strict separation between canonical product master data and physical field observations. Today, we're going to demonstrate the end-to-end inspection lifecycle using our native mobile scanning integration and AI extraction."

## Flow 1: Live Barcode Scan & Inspection (0:30 - 1:30)
- **Visual**: Click the **Scan** button in the topbar. Select **Start Camera** under "Live Barcode".
- **Script**: "An inspector in the field can start a live scan. Because we're using Capacitor ML Kit natively, scanning is lightning fast. When a barcode is detected, the application instantly routes us to the canonical Inspection workflow."
- **Action**: Scan a real barcode (or simulate a scan). The app auto-navigates to the active Inspection page.
- **Script**: "Notice that Genesis automatically retrieved the Product Master identity. The inspector did not have to manually type the GTIN. The system has created a single, persistent inspection record that will track this entire encounter."

## Flow 2: Physical Evidence & AI Extraction (1:30 - 2:30)
- **Visual**: Click **Upload Physical Evidence** on the Inspection page. Select a photo of a product package.
- **Script**: "Next, the inspector captures physical evidence. This is not just uploading a photo; Genesis runs AI Vision OCR on this evidence to extract regulatory declarations like MRP and batch numbers."
- **Action**: Wait for extraction. Show the Human Verification step.
- **Script**: "The AI's raw extraction is preserved, but before it enters the ledger, the inspector must perform human verification. The verified observations are what matter for compliance."

## Flow 3: Cross-Location Comparison & Decision (2:30 - 3:30)
- **Visual**: Click **Verify & Run Comparison Engine**.
- **Script**: "Once verified, Genesis runs the Comparison Engine. It evaluates these physical observations against the canonical Product Master, against historical observations from other states, and against the Legal Metrology rules engine."
- **Action**: Show the Comparison Result (Matched or Discrepancy). Make a final decision (e.g., "Mark Compliant").
- **Script**: "In this case, the engine flagged a discrepancy [or matched perfectly]. The inspector records their final decision, closing the inspection loop. Every step of this process has been cryptographically audited."

## Flow 4: Product Intel & Data Linkage (3:30 - 4:30)
- **Visual**: Navigate to **Products / Product Intel** for the scanned product.
- **Script**: "Let's look at the Product Intel page. Because Genesis uses a unified data model, this page is deeply connected. It shows the Product Master details, but also links directly to the physical inventory records, the history of inspections, and the underlying evidence."
- **Action**: Point out the inventory counts and the recent inspection. 
- **Script**: "If we were to Edit the Master or Sync from an ERP, it updates the canonical product identity, but it *never* silently overwrites our historical physical observations. The integrity of past inspections is strictly maintained."

## Flow 5: Direct Photo Capture [Optional/Bonus] (4:30 - 5:00)
- **Visual**: Click **Scan** in topbar again, then **Start Direct Capture** under "Photo Capture Only".
- **Script**: "Finally, if a product lacks a barcode, the inspector can use 'Photo Capture Only'. This creates an inspection without a GTIN, relying entirely on AI Vision and inspector verification to establish product identity and compliance."

## Conclusion (5:00)
- **Script**: "Genesis replaces fragmented paperwork and disconnected databases with one unified, provable workflow. Thank you."
