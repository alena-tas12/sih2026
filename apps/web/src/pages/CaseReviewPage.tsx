import React, { useState } from 'react';

const mockData = {
  caseId: 'CASE-2026-0104',
  scanDate: '09 Sep 2026, 00:47 IST',
  productName: 'ABC Foods — Premium Basmati Rice (5 kg)',
  status: 'REVIEW_REQUIRED',
  extractions: [
    {
      id: 'e1',
      fieldName: 'Net Quantity',
      rawText: 'NET QUANTITY: 500 g',
      normValue: '500 g',
      confidence: 98,
      model: 'OCR + Vision (Agreed)',
      ruleResult: 'COMPLIANT',
      ruleCitation: 'PC Rules 2011, Rule 6(1)(b)',
      reason: 'Numeric value parsed and cross-validated by both extraction pathways.',
    },
    {
      id: 'e2',
      fieldName: 'Maximum Retail Price',
      rawText: 'MRP ₹150.00 (Incl. of all taxes)',
      normValue: '₹150.00',
      confidence: 95,
      model: 'OCR Primary',
      ruleResult: 'COMPLIANT',
      ruleCitation: 'PC Rules 2011, Rule 6(1)(a)',
      reason: 'MRP declaration found with correct formatting.',
    },
    {
      id: 'e3',
      fieldName: 'Manufacturer Address',
      rawText: 'Mfg by: ABC Foods, Chennai',
      normValue: 'ABC Foods, Chennai',
      confidence: 60,
      model: 'OCR Primary (low confidence)',
      ruleResult: 'NEEDS_REVIEW',
      ruleCitation: 'PC Rules 2011, Rule 6(1)(d)',
      reason: 'Address detected but incomplete. Full pincode and state not found. Human validation required.',
    },
  ],
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLIANT: 'success',
    NON_COMPLIANT: 'danger',
    NEEDS_REVIEW: 'warning',
  };
  return <span className={`badge ${map[status] || 'neutral'}`}>{status.replace('_', ' ')}</span>;
}

export default function CaseReviewPage() {
  const [data] = useState(mockData);
  const [reviewActions, setReviewActions] = useState<Record<string, string>>({});

  const handleReview = (id: string, action: string) => {
    setReviewActions(prev => ({ ...prev, [id]: action }));
  };

  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1>Case Workspace: {data.caseId}</h1>
          <p className="subtitle">{data.productName} — Scanned on {data.scanDate}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="outline">Export Evidence Graph</button>
          <button className="primary">Finalize Inspection</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Evidence Viewer */}
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Evidence Viewer</h2>
            <div style={{ display: 'flex', gap: '8px', color: 'var(--muted)' }}>
              <span>🔍</span> <span>⛶</span>
            </div>
          </div>
          <div className="panel-body">
            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '6px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dim)' }}>
              [ Raw Image / Bounding Box Canvas ]
            </div>
            
            <div style={{ marginTop: '20px' }}>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
