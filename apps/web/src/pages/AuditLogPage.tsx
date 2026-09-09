import React from 'react';

const auditData = [
  { id: 'AUD-092', time: '2026-09-09 18:45:12', user: 'Alena B.', action: 'MANUAL_CORRECTION', details: 'Updated Manufacturer Address confidence 60% -> 100% (Manual verify)', case: 'CASE-104' },
  { id: 'AUD-091', time: '2026-09-09 18:42:05', user: 'System (Rule Engine)', action: 'RULE_EVALUATION', details: 'Applied PC Rules 2011 to CASE-104', case: 'CASE-104' },
  { id: 'AUD-090', time: '2026-09-09 18:41:50', user: 'System (Vision Worker)', action: 'EXTRACTION_COMPLETE', details: 'PaddleOCR + VLM completed extraction with 1 contradiction', case: 'CASE-104' },
  { id: 'AUD-089', time: '2026-09-09 18:41:02', user: 'Alena B.', action: 'INSPECTION_STARTED', details: 'Uploaded package image for ABC Foods Rice', case: 'CASE-104' },
];

export default function AuditLogPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Audit Log</h1>
          <p className="page-desc">Immutable chronological record of all system events and human interventions.</p>
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User / Service</th>
              <th>Action Type</th>
              <th>Details</th>
              <th>Ref</th>
            </tr>
          </thead>
          <tbody>
            {auditData.map(log => (
              <tr key={log.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{log.time}</td>
                <td className="primary-cell">{log.user}</td>
                <td><span className="badge neutral">{log.action}</span></td>
                <td>{log.details}</td>
                <td><span className="mono" style={{ color: 'var(--accent-main)' }}>{log.case}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
