import React, { useState, useMemo } from 'react';

const evidenceData = [
  { id: 'EV-99182A', field: 'Net Quantity', value: '500 g', source: 'OCR (PaddleOCR)', conf: 98, caseId: 'CASE-2026-0104' },
  { id: 'EV-99282B', field: 'MRP', value: '₹160.00', source: 'Vision (Donut VLM)', conf: 82, caseId: 'CASE-2026-0104' },
  { id: 'EV-99382C', field: 'Mfg Date', value: '12/08/2026', source: 'OCR (PaddleOCR)', conf: 95, caseId: 'CASE-2026-0103' },
  { id: 'EV-99482D', field: 'Manufacturer', value: 'ABC Foods', source: 'Vision (Donut VLM)', conf: 88, caseId: 'CASE-2026-0104' },
  { id: 'EV-99582E', field: 'Batch No.', value: 'BX-9102', source: 'OCR (PaddleOCR)', conf: 99, caseId: 'CASE-2026-0102' },
  { id: 'EV-99682F', field: 'Net Quantity', value: '1 kg', source: 'Vision (Donut VLM)', conf: 91, caseId: 'CASE-2026-0103' }
];

export default function EvidencePage() {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All Sources');

  const filteredEvidence = useMemo(() => {
    return evidenceData.filter(ev => {
      const matchesSearch = ev.id.toLowerCase().includes(search.toLowerCase()) || 
                            ev.caseId.toLowerCase().includes(search.toLowerCase()) ||
                            ev.field.toLowerCase().includes(search.toLowerCase());
      
      const matchesSource = sourceFilter === 'All Sources' || ev.source === sourceFilter;
      
      return matchesSearch && matchesSource;
    });
  }, [search, sourceFilter]);

  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1>Evidence Library</h1>
          <p className="subtitle">Cryptographic evidence crops extracted by the vision pipeline.</p>
        </div>
        <div className="filters">
          <input 
            className="search" 
            placeholder="Search ID, Case, or Field..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option>All Sources</option>
            <option>OCR (PaddleOCR)</option>
            <option>Vision (Donut VLM)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredEvidence.map(ev => (
          <div key={ev.id} className="panel">
            <div style={{ 
              height: '140px', 
              background: '#0a0a0a', 
              borderBottom: '1px solid var(--line)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--dim)'
            }}>
              [ Image Crop: {ev.field} ]
            </div>
            <div className="panel-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>{ev.id}</span>
                <span className={`tag ${ev.conf > 90 ? 'green' : 'amber'}`}>{ev.conf}% Conf</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{ev.field}: {ev.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Extracted via {ev.source}</div>
              <div style={{ marginTop: '16px', fontSize: '11px' }}>
                Linked to: <a href={`/cases/${ev.caseId}`} style={{ color: 'var(--text)', textDecoration: 'underline' }}>{ev.caseId}</a>
              </div>
            </div>
          </div>
        ))}
        {filteredEvidence.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--dim)' }}>
            No evidence matches your search criteria.
          </div>
        )}
      </div>
    </section>
  );
}
