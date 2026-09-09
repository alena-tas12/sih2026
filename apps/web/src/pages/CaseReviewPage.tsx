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
              <h3 style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em' }}>Extraction Metadata</h3>
              <div className="table-wrap">
                <table className="table">
                  <tbody>
                    <tr><td>OCR Engine</td><td className="primary-cell">PaddleOCR v4</td></tr>
                    <tr><td>Vision Model</td><td className="primary-cell">Donut (OCR-free)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rule Engine Evaluation */}
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Deterministic Rule Evaluation</h2>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <div className="list">
              {data.extractions.map(ext => (
                <div key={ext.id} className="row" style={{ padding: '20px', borderBottom: '1px solid var(--line)', flexDirection: 'column' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>{ext.fieldName}</div>
                    <StatusBadge status={ext.ruleResult} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '13px', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--muted)' }}>Extracted</span>
                    <span className="mono" style={{ color: 'var(--text)' }}>{ext.normValue}</span>
                    <span style={{ color: 'var(--muted)' }}>Confidence</span>
                    <span>
                      <span className={ext.confidence >= 85 ? 'tag green' : 'tag amber'} style={{ padding: '2px 6px', fontSize: '11px' }}>
                        {ext.confidence}%
                      </span>
                    </span>
                    <span style={{ color: 'var(--muted)' }}>Rule</span>
                    <span style={{ color: 'var(--text)' }}>{ext.ruleCitation}</span>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '12px', color: 'var(--dim)' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Engine Log:</span> {ext.reason}
                  </div>

                  {ext.ruleResult === 'NEEDS_REVIEW' && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <button 
                        className={`btn ${reviewActions[ext.id] === 'approve' ? 'primary' : 'outline'}`}
                        onClick={() => handleReview(ext.id, 'approve')}
                      >
                        Override: Approve
                      </button>
                      <button 
                        className={`btn ${reviewActions[ext.id] === 'reject' ? 'btn-danger' : 'outline'}`}
                        onClick={() => handleReview(ext.id, 'reject')}
                        style={reviewActions[ext.id] === 'reject' ? { background: 'var(--danger-text)', color: '#fff', borderColor: 'var(--danger-text)' } : {}}
                      >
                        Confirm Violation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
