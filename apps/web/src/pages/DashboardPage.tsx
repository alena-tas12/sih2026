import React from 'react';

export default function DashboardPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Overview</h1>
          <p className="page-desc">System performance and inspection pipeline status</p>
        </div>
        <button className="btn btn-primary">Start New Inspection</button>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Total Cases (30d)</div>
          <div className="metric-val">12,408</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--success-text)' }}>+14% vs last month</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Pending Review</div>
          <div className="metric-val" style={{ color: 'var(--warning-text)' }}>245</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>Action required</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Auto-Compliant</div>
          <div className="metric-val">82.4%</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--success-text)' }}>Confidence &gt; 85%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">AI Contradictions</div>
          <div className="metric-val" style={{ color: 'var(--danger-text)' }}>1.2%</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>OCR vs VLM mismatch</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Inspections</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Product</th>
                <th>Status</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="mono">CASE-104</span></td>
                <td className="primary-cell">Premium Basmati Rice (5kg)</td>
                <td><span className="badge warning">Needs Review</span></td>
                <td>60%</td>
              </tr>
              <tr>
                <td><span className="mono">CASE-103</span></td>
                <td className="primary-cell">Sunrise Detergent (1kg)</td>
                <td><span className="badge success">Compliant</span></td>
                <td>98%</td>
              </tr>
              <tr>
                <td><span className="mono">CASE-102</span></td>
                <td className="primary-cell">FreshMilk (500ml)</td>
                <td><span className="badge danger">Non-Compliant</span></td>
                <td>99%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Activity Feed</h2>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-main)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Rule amendment published</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PC Rules 2011 (Amended 2026) active</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning-text)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Alena B. finalized CASE-104</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Marked "Manufacturer Address" as Corrected</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-text)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>System synced 400 new SKUs</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>From ERP integration</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
