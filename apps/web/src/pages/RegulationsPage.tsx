import React from 'react';

export default function RegulationsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Regulatory Knowledge Base</h1>
          <p className="page-desc">Version-controlled Legal Metrology & FSSAI temporal rules.</p>
        </div>
        <button className="btn btn-primary">+ Add Amendment</button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Active Rules Database</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Description</th>
              <th>Req Type</th>
              <th>Effective From</th>
              <th>Effective To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="mono">PC-2011-6-1-a</span></td>
              <td className="primary-cell">Maximum Retail Price (MRP) Declaration</td>
              <td><span className="badge neutral">PRESENCE</span></td>
              <td>01 Jan 2011</td>
              <td style={{ color: 'var(--text-muted)' }}>None</td>
              <td><span className="badge success">Active</span></td>
            </tr>
            <tr>
              <td><span className="mono">PC-2011-6-1-b</span></td>
              <td className="primary-cell">Net Quantity Declaration (Numeric)</td>
              <td><span className="badge neutral">NUMERIC</span></td>
              <td>01 Jan 2011</td>
              <td style={{ color: 'var(--text-muted)' }}>None</td>
              <td><span className="badge success">Active</span></td>
            </tr>
            <tr>
              <td><span className="mono">PC-2023-AMND-1</span></td>
              <td className="primary-cell">Unit Sale Price (USP) Formatting</td>
              <td><span className="badge neutral">FORMAT</span></td>
              <td>01 Apr 2024</td>
              <td style={{ color: 'var(--text-muted)' }}>None</td>
              <td><span className="badge success">Active</span></td>
            </tr>
            <tr style={{ opacity: 0.5 }}>
              <td><span className="mono">PC-2009-OLD-1</span></td>
              <td className="primary-cell">Legacy Packaging Standard</td>
              <td><span className="badge neutral">FORMAT</span></td>
              <td>01 Jan 2009</td>
              <td>31 Dec 2010</td>
              <td><span className="badge neutral">Superseded</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
