import React from 'react';

const evidenceData = [
  { id: 'EV-9932', caseId: 'CASE-104', field: 'Net Quantity', img: '500g.png', text: '500 g', conf: 98, source: 'Vision-Language' },
  { id: 'EV-9931', caseId: 'CASE-104', field: 'MRP', img: 'mrp.png', text: '₹150.00', conf: 95, source: 'PaddleOCR' },
  { id: 'EV-9930', caseId: 'CASE-103', field: 'Expiry Date', img: 'exp.png', text: '12/2026', conf: 92, source: 'PaddleOCR' },
  { id: 'EV-9929', caseId: 'CASE-102', field: 'Mfg Address', img: 'mfg.png', text: 'Plot 12, Phase 4...', conf: 60, source: 'PaddleOCR' },
];

export default function EvidencePage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Evidence Library</h1>
          <p className="page-desc">Cryptographically hashed extraction clippings for legal auditability.</p>
        </div>
        <button className="btn btn-outline">Export Evidence Log</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {evidenceData.map(ev => (
          <div key={ev.id} className="panel" style={{ overflow: 'hidden' }}>
            <div style={{ height: '120px', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <div style={{ border: '2px dashed var(--border-focus)', padding: '10px', fontSize: '11px', textTransform: 'uppercase' }}>
                [ Image Crop: {ev.field} ]
              </div>
            </div>
            <div className="panel-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{ev.id}</span>
                <span style={{ fontSize: '12px', color: 'var(--accent-main)', fontWeight: 600 }}>{ev.caseId}</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {ev.field}
              </div>
              <div className="mono" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', background: 'var(--bg-base)', padding: '6px', borderRadius: '4px' }}>
                "{ev.text}"
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{ev.source}</span>
                <span style={{ color: ev.conf > 80 ? 'var(--success-text)' : 'var(--warning-text)' }}>{ev.conf}% Conf</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
