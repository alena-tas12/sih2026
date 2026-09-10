import React, { useState, useEffect, useMemo } from 'react';

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('All Event Types');
  const [auditData, setAuditData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAuditData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    return auditData.filter(log => {
      const details = log.details || '';
      const actor = log.actor || '';
      const targetId = log.targetId || '';
      const action = log.action || '';
      
      const matchesSearch = details.toLowerCase().includes(search.toLowerCase()) || 
                            actor.toLowerCase().includes(search.toLowerCase()) ||
                            targetId.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = eventType === 'All Event Types' ||
                          (eventType === 'Human Action' && actor !== 'SYSTEM') ||
                          (eventType === 'System Action' && actor === 'SYSTEM') ||
                          (eventType === 'Rule Update' && action.includes('RULE'));
      return matchesSearch && matchesType;
    });
  }, [search, eventType, auditData]);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Timestamp,Actor,Event Type,Description,Reference"]
      .concat(filteredData.map(l => `"${l.timestamp}","${l.actor}","${l.action}","${l.details || ''}","${l.targetId || ''}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="content" style={{ color: 'var(--dim)' }}>Loading audit logs...</div>;

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
                  <td className="mono" style={{ color: 'var(--dim)' }}>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}</td>
                  <td><span className={`tag ${log.actor !== 'SYSTEM' ? 'amber' : ''}`}>{log.actor}</span></td>
                  <td>{log.action}</td>
                  <td>{log.details || '—'}</td>
                  <td className="mono">{log.targetId ? <a href={`/cases/${log.targetId}`} style={{ color: 'var(--text)', textDecoration: 'underline' }}>{log.targetId}</a> : '—'}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--dim)' }}>
                    {auditData.length === 0 ? 'No audit records yet. Actions will be recorded as you use the system.' : 'No audit records match your filters.'}
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
