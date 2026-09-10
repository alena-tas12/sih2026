import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => setData(data))
      .catch(() => {
        // Set safe defaults so the page renders instead of crashing
        setData({
          metrics: { productsTracked: 0, crossLocationMatches: 0, declarationDifferences: 0, pendingVerification: 0 },
          crossLocationAlerts: [],
          recentActivity: []
        });
      });
  }, []);

  if (!data) return <div className="content" style={{ color: 'var(--dim)' }}>Loading Live Dashboard...</div>;

  const metrics = data.metrics || {};
  const alerts = data.crossLocationAlerts || [];
  const activity = data.recentActivity || [];

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
          <div className="metric-value">{metrics.productsTracked || 0}</div>
          <div className="metric-foot">Unique GTINs in Database</div>
        </div>
        <div className="metric">
          <div className="metric-label">Cross-Location Matches</div>
          <div className="metric-value">{metrics.crossLocationMatches || 0}</div>
          <div className="metric-foot">Consistent across all nodes</div>
        </div>
        <div className="metric">
          <div className="metric-label">Declaration Differences</div>
          <div className="metric-value" style={{ color: 'var(--amber)' }}>{metrics.declarationDifferences || 0}</div>
          <div className="metric-foot">Mismatches flagged</div>
        </div>
        <div className="metric">
          <div className="metric-label">Pending Verification</div>
          <div className="metric-value" style={{ color: 'var(--amber)' }}>{metrics.pendingVerification || 0}</div>
          <div className="metric-foot">Human review required</div>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Cross-Location Alerts</h2>
            <span className="tag amber">{alerts.length} Active Alerts</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>GTIN / Barcode</th>
                <th>Status</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert: any) => (
                <tr key={alert.id}>
                  <td className="primary-cell">{alert.productName}</td>
                  <td><span className="mono">{alert.gtin}</span></td>
                  <td>{alert.status}</td>
                  <td>{alert.location}</td>
                  <td><button className="outline" style={{ height: '26px', fontSize: '11px' }} onClick={() => navigate(`/products?gtin=${alert.gtin}`)}>Review</button></td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--dim)' }}>
                    No active cross-location alerts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Recent Activity</h2>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activity.map((act: any) => (
              <div key={act.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ 
                  width: 8, height: 8, borderRadius: '50%', marginTop: 6,
                  background: act.action === 'SYSTEM_INIT' ? 'var(--dim)' : 'var(--amber)' 
                }}></div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text)' }}>
                    {act.action}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{act.details} - {act.timestamp}</div>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <div style={{ color: 'var(--dim)' }}>No recent activity.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
