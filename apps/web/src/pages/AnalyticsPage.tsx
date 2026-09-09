import React from 'react';

export default function AnalyticsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Analytics</h1>
          <p className="page-desc">System performance, anomaly detection, and extraction metrics.</p>
        </div>
        <button className="btn btn-outline">Last 30 Days</button>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Total Scans</div>
          <div className="metric-val">1,248</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Auto-Compliant Rate</div>
          <div className="metric-val" style={{ color: 'var(--success-text)' }}>78.5%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Human Reviews</div>
          <div className="metric-val" style={{ color: 'var(--warning-text)' }}>215</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">AI Contradictions</div>
          <div className="metric-val" style={{ color: 'var(--danger-text)' }}>42</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Top Ambiguity Sources (Human Review Triggers)</h2>
          </div>
          <div className="panel-body">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Manufacturer Address</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>OCR Low Confidence</div>
                </div>
                <div style={{ fontWeight: 600 }}>45%</div>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Expiry Date</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Format Variability</div>
                </div>
                <div style={{ fontWeight: 600 }}>28%</div>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Net Quantity</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Unit Confusion</div>
                </div>
                <div style={{ fontWeight: 600 }}>12%</div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Dual-Modal Agreement</h2>
          </div>
          <div className="panel-body">
             <div style={{ display: 'flex', height: '32px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
               <div style={{ width: '85%', background: 'var(--success-border)', border: '1px solid var(--success-text)', display: 'flex', alignItems: 'center', paddingLeft: '12px', color: 'var(--success-text)', fontSize: '12px', fontWeight: 'bold' }}>85% Agreement</div>
               <div style={{ width: '15%', background: 'var(--danger-border)', border: '1px solid var(--danger-text)', borderLeft: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger-text)', fontSize: '12px', fontWeight: 'bold' }}>15% Conflict</div>
             </div>
             <p style={{ color: 'var(--text-secondary)' }}>
               In 15% of scans, the OCR and Vision-Language Model pathways extracted contradictory values, safely triggering a deterministic halt for human review instead of silently failing.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
