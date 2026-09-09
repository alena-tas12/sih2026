import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1>Compliance Operations Center</h1>
          <p className="subtitle">Cross-location product verification and compliance tracking</p>
        </div>
        <button className="primary" onClick={() => navigate('/inspections')}>Scan & Verify Product</button>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Products Tracked</div>
          <div className="metric-value">4,892</div>
          <div className="metric-foot">Unique GTINs</div>
        </div>
        <div className="metric">
          <div className="metric-label">Cross-Location Matches</div>
          <div className="metric-value">92.4%</div>
          <div className="metric-foot">Consistent across all nodes</div>
        </div>
        <div className="metric">
          <div className="metric-label">Declaration Differences</div>
          <div className="metric-value" style={{ color: 'var(--amber)' }}>143</div>
          <div className="metric-foot">Mismatches detected</div>
        </div>
        <div className="metric">
          <div className="metric-label">Pending Verification</div>
          <div className="metric-value" style={{ color: 'var(--amber)' }}>28</div>
          <div className="metric-foot">Human review required</div>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Cross-Location Alerts</h2>
            <span className="tag amber">3 Active Alerts</span>
          </div>
          <table className="table">
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
                <td><button className="outline" style={{ height: '26px', fontSize: '11px' }} onClick={() => navigate('/products')}>Review</button></td>
              </tr>
              <tr>
                <td className="primary-cell">Sunrise Detergent (1kg)</td>
                <td><span className="mono">890439001122</span></td>
                <td>Net Qty (1kg vs 900g)</td>
                <td>Mumbai, Pune</td>
                <td><button className="outline" style={{ height: '26px', fontSize: '11px' }} onClick={() => navigate('/products')}>Review</button></td>
              </tr>
              <tr>
                <td className="primary-cell">FreshMilk (500ml)</td>
                <td><span className="mono">890112349911</span></td>
                <td>Mfg Date Missing</td>
                <td>Delhi (Hub 4)</td>
                <td><button className="outline" style={{ height: '26px', fontSize: '11px' }} onClick={() => navigate('/products')}>Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Recent Activity</h2>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text)' }}>Difference detected: MRP</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>GTIN 8901030985223 scanned at Bangalore</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dim)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text)' }}>Identity Match: 45 SKUs</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Batch scan at Coimbatore Hub</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid var(--text)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text)' }}>Product Master Synced</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Updated 1,200 GTIN records from ERP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
