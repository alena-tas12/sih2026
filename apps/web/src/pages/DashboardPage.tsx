import React from 'react';

export default function DashboardPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Operations Center</h1>
          <p className="page-desc">Cross-location product verification and compliance tracking</p>
        </div>
        <button className="btn btn-primary">Scan & Verify Product</button>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Products Tracked</div>
          <div className="metric-val">4,892</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>Unique GTINs</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Cross-Location Matches</div>
          <div className="metric-val" style={{ color: 'var(--success-text)' }}>92.4%</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>Consistent across all nodes</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Declaration Differences</div>
          <div className="metric-val" style={{ color: 'var(--warning-text)' }}>143</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>Mismatches detected</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Pending Verification</div>
          <div className="metric-val" style={{ color: 'var(--danger-text)' }}>28</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>Human review required</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="panel-title">Cross-Location Alerts</h2>
            <span className="badge warning">3 Active Alerts</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>GTIN / Barcode</th>
                <th>Conflicting Field</th>
                <th>Locations Affected</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="primary-cell">Premium Basmati Rice (5kg)</td>
                <td><span className="mono">8901030985223</span></td>
                <td>MRP (₹150 vs ₹160)</td>
                <td>Bangalore, Chennai</td>
                <td><button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }}>Review</button></td>
              </tr>
              <tr>
                <td className="primary-cell">Sunrise Detergent (1kg)</td>
                <td><span className="mono">890439001122</span></td>
                <td>Net Qty (1kg vs 900g)</td>
                <td>Mumbai, Pune</td>
                <td><button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }}>Review</button></td>
              </tr>
              <tr>
                <td className="primary-cell">FreshMilk (500ml)</td>
                <td><span className="mono">890112349911</span></td>
                <td>Mfg Date Missing</td>
                <td>Delhi (Hub 4)</td>
                <td><button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }}>Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Activity</h2>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning-text)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Difference detected: MRP</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GTIN 8901030985223 scanned at Bangalore</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-text)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Identity Match: 45 SKUs</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Batch scan at Coimbatore Hub</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-main)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Product Master Synced</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Updated 1,200 GTIN records from ERP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
