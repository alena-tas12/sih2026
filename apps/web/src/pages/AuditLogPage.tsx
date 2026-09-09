import React, { useState, useMemo } from 'react';

const auditData = [
  { ts: '2026-09-09 14:32:01', actor: 'Alena B', type: 'CASE_OVERRIDE', actorType: 'Human', desc: 'Manually approved "Net Quantity" field despite OCR contradiction.', ref: 'CASE-2026-0104' },
  { ts: '2026-09-09 14:30:15', actor: 'SYSTEM (OCR)', type: 'EXTRACTION_HALT', actorType: 'System', desc: 'Contradiction detected between PaddleOCR and Donut VLM.', ref: 'CASE-2026-0104' },
  { ts: '2026-09-09 10:15:00', actor: 'SYSTEM (CRON)', type: 'RULE_SYNC', actorType: 'System', desc: 'Updated local Legal Metrology ruleset from upstream master.', ref: 'SYNC-992' },
  { ts: '2026-09-08 19:42:11', actor: 'Alena B', type: 'POLICY_UPDATE', actorType: 'Human', desc: 'Changed Auto-Approve Threshold from 80% to 85%.', ref: 'CFG-SET' },
];

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('All Event Types');

  const filteredData = useMemo(() => {
    return auditData.filter(log => {
      const matchesSearch = log.desc.toLowerCase().includes(search.toLowerCase()) || 
                            log.actor.toLowerCase().includes(search.toLowerCase()) ||
                            log.ref.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = eventType === 'All Event Types' ||
                          (eventType === 'Human Action' && log.actorType === 'Human') ||
                          (eventType === 'System Action' && log.actorType === 'System') ||
                          (eventType === 'Rule Update' && log.type.includes('RULE'));
      return matchesSearch && matchesType;
    });
  }, [search, eventType]);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Timestamp,Actor,Event Type,Description,Reference"]
      .concat(filteredData.map(l => `"${l.ts}","${l.actor}","${l.type}","${l.desc}","${l.ref}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">System</div>
          <h1>Audit Log</h1>
          <p className="subtitle">Immutable chronological ledger of system and human actions.</p>
        </div>
        <button className="outline" onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="panel bottom">
        <div className="panel-head" style={{ gap: '16px' }}>
          <input 
            type="text" 
            className="search" 
            placeholder="Search events or users..." 
            style={{ flex: 1, maxWidth: 'none' }} 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={eventType} onChange={e => setEventType(e.target.value)}>
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
              {filteredData.map((log, i) => (
                <tr key={i}>
                  <td className="mono" style={{ color: 'var(--dim)' }}>{log.ts}</td>
                  <td><span className={`tag ${log.actorType === 'Human' ? 'amber' : ''}`}>{log.actor}</span></td>
                  <td>{log.type}</td>
                  <td>{log.desc}</td>
                  <td className="mono"><a href={`/cases/${log.ref}`} style={{ color: 'var(--text)', textDecoration: 'underline' }}>{log.ref}</a></td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--dim)' }}>
                    No audit records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
