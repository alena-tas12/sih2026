import React from 'react';

export default function EvidencePage() {
  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1>Evidence Library</h1>
          <p className="subtitle">Cryptographic evidence crops extracted by the vision pipeline.</p>
        </div>
        <div className="filters">
          <input className="search" placeholder="Search evidence ID..." />
          <select>
            <option>All Sources</option>
            <option>OCR (PaddleOCR)</option>
            <option>Vision (Donut VLM)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="panel">
            <div style={{ 
              height: '140px', 
              background: '#0a0a0a', 
              borderBottom: '1px solid var(--line)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--dim)'
            }}>
              [ Image Crop: Net Quantity ]
            </div>
            <div className="panel-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>EV-99{i}82A</span>
                <span className="tag green">98% Conf</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Net Quantity: 500 g</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Extracted via PaddleOCR</div>
              <div style={{ marginTop: '16px', fontSize: '11px' }}>
                Linked to: <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>CASE-2026-0104</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
