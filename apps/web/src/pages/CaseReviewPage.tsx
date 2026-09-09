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
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Case Workspace: {data.caseId}</h1>
          <p className="page-desc">{data.productName} — Scanned on {data.scanDate}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline">Export Evidence Graph</button>
          <button className="btn btn-primary">Finalize Inspection</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Evidence Viewer */}
        <div className="panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 className="panel-title">Evidence Viewer</h2>
            <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
              <span>🔍</span> <span>⛶</span>
            </div>
          </div>
          <div className="panel-body">
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              [ Raw Image / Bounding Box Canvas ]
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Extraction Metadata</h3>
              <table className="data-table">
                <tbody>
                  <tr><td>OCR Engine</td><td className="primary-cell">PaddleOCR v4</td></tr>
                  <tr><td>Vision Model</td><td className="primary-cell">Donut (OCR-free)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Findings */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Deterministic Evaluation Results</h2>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.extractions.map(ext => (
              <div key={ext.id} style={{ 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '6px', 
                padding: '16px',
                borderLeft: ext.ruleResult === 'NEEDS_REVIEW' ? '3px solid var(--warning-text)' : '3px solid var(--success-text)',
                background: ext.ruleResult === 'NEEDS_REVIEW' ? 'rgba(245, 158, 11, 0.05)' : 'transparent'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{ext.fieldName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ext.ruleCitation}</div>
                  </div>
                  <StatusBadge status={ext.ruleResult} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '12px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Extracted</div>
                  <div className="mono" style={{ color: 'var(--text-primary)' }}>{ext.rawText}</div>
                  
                  <div style={{ color: 'var(--text-muted)' }}>Normalized</div>
                  <div style={{ color: 'var(--text-primary)' }}>{ext.normValue}</div>
                  
                  <div style={{ color: 'var(--text-muted)' }}>Confidence</div>
                  <div style={{ color: 'var(--text-primary)' }}>{ext.confidence}% ({ext.model})</div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {ext.reason}
                </div>

                {ext.ruleResult === 'NEEDS_REVIEW' && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    {reviewActions[ext.id] ? (
                       <span style={{ color: 'var(--success-text)', fontSize: '12px' }}>✓ Marked as {reviewActions[ext.id]}</span>
                    ) : (
                      <>
                        <button className="btn btn-outline" style={{ borderColor: 'var(--success-border)', color: 'var(--success-text)' }} onClick={() => handleReview(ext.id, 'Accepted')}>Accept</button>
                        <button className="btn btn-outline" style={{ borderColor: 'var(--accent-main)', color: 'var(--accent-main)' }} onClick={() => handleReview(ext.id, 'Corrected')}>Edit Value</button>
                        <button className="btn btn-outline" style={{ borderColor: 'var(--danger-border)', color: 'var(--danger-text)' }} onClick={() => handleReview(ext.id, 'Rejected')}>Reject</button>
                      </>
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
