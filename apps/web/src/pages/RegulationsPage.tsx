import React from 'react';

export default function RegulationsPage() {
  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">System</div>
          <h1>Regulatory Knowledge Base</h1>
          <p className="subtitle">Temporal rule engine mapping legal text to deterministic logic constraints.</p>
        </div>
        <div className="filters">
          <input className="search" placeholder="Search rules or laws..." />
          <button className="primary">+ Add Rule</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        
        {/* Rules Table */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Active Constraint Rules</div>
            <span className="tag green">Live</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Rule ID</th>
                  <th>Legal Reference</th>
                  <th>Field</th>
                  <th>Constraint Logic</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">RULE-PC-01</td>
                  <td className="primary-cell">PC Rules 2011, Sec 6(1)(a)</td>
                  <td>Net Quantity</td>
                  <td className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>{`value > 0 AND unit IN ('g','kg','ml','L')`}</td>
                  <td><span className="tag green">Active</span></td>
                </tr>
                <tr>
                  <td className="mono">RULE-PC-02</td>
                  <td className="primary-cell">PC Rules 2011, Sec 6(1)(e)</td>
                  <td>MRP</td>
                  <td className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>{`format MATCHES '^Rs\\.\\s?\\d+(\\.\\d{1,2})?$'`}</td>
                  <td><span className="tag green">Active</span></td>
                </tr>
                <tr>
                  <td className="mono">RULE-PC-03</td>
                  <td className="primary-cell">PC Rules 2011, Sec 6(1)(b)</td>
                  <td>Mfg Address</td>
                  <td className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>{`EXISTS(value) AND length(value) > 10`}</td>
                  <td><span className="tag green">Active</span></td>
                </tr>
                <tr>
                  <td className="mono">RULE-FSSAI-04</td>
                  <td className="primary-cell">FSSAI Packaging Regs</td>
                  <td>Veg/Non-Veg Logo</td>
                  <td className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>{`DETECT_LOGO(type='veg_or_nonveg', conf > 80)`}</td>
                  <td><span className="tag amber">Draft</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rule Editor Info */}
        <div className="panel" style={{ alignSelf: 'start' }}>
          <div className="panel-head">
            <h2 className="panel-title">Temporal Context</h2>
          </div>
          <div className="panel-body">
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
              The engine evaluates rules based on the package's date of manufacture. 
              Changes to the legal code are versioned temporally.
            </p>
            <div className="list">
              <div className="row">
                <div className="row-main">
                  <div className="row-title">PC Rules 2011 (v3)</div>
                  <div className="row-sub">Effective: 01 Jan 2025</div>
                </div>
                <span className="tag green">Active</span>
              </div>
              <div className="row">
                <div className="row-main">
                  <div className="row-title">PC Rules 2011 (v2)</div>
                  <div className="row-sub">Ended: 31 Dec 2024</div>
                </div>
                <span className="tag">Archive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
