import React from 'react';

export default function AuditLogPage() {
  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">System</div>
          <h1>Audit Log</h1>
          <p className="subtitle">Immutable chronological ledger of system and human actions.</p>
        </div>
        <button className="outline">Export CSV</button>
      </div>

      <div className="panel bottom">
        <div className="panel-head" style={{ gap: '16px' }}>
          <input type="text" className="search" placeholder="Search events or users..." style={{ flex: 1, maxWidth: 'none' }} />
          <select>
            <option>All Event Types</option>
            <option>Human Action</option>
            <option>System Action</option>
            <option>Rule Update</option>
          </select>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Event Type</th>
                <th>Description</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono" style={{ color: 'var(--dim)' }}>2026-09-09 14:32:01</td>
                <td><span className="tag amber">Alena B</span></td>
                <td>CASE_OVERRIDE</td>
                <td>Manually approved "Net Quantity" field despite OCR contradiction.</td>
                <td className="mono"><a href="#" style={{ color: 'var(--accent)' }}>CASE-2026-0104</a></td>
              </tr>
              <tr>
                <td className="mono" style={{ color: 'var(--dim)' }}>2026-09-09 14:30:15</td>
                <td><span className="tag">SYSTEM (OCR)</span></td>
                <td>EXTRACTION_HALT</td>
                <td>Contradiction detected between PaddleOCR and Donut VLM.</td>
                <td className="mono"><a href="#" style={{ color: 'var(--accent)' }}>CASE-2026-0104</a></td>
              </tr>
              <tr>
                <td className="mono" style={{ color: 'var(--dim)' }}>2026-09-09 10:15:00</td>
                <td><span className="tag">SYSTEM (CRON)</span></td>
                <td>RULE_SYNC</td>
                <td>Updated local Legal Metrology ruleset from upstream master.</td>
                <td className="mono"><a href="#" style={{ color: 'var(--accent)' }}>SYNC-992</a></td>
              </tr>
              <tr>
                <td className="mono" style={{ color: 'var(--dim)' }}>2026-09-08 19:42:11</td>
                <td><span className="tag amber">Alena B</span></td>
                <td>POLICY_UPDATE</td>
                <td>Changed Auto-Approve Threshold from 80% to 85%.</td>
                <td className="mono"><a href="#" style={{ color: 'var(--accent)' }}>CFG-SET</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
