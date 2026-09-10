import React, { useState, useEffect, useMemo } from 'react';

export default function EvidencePage() {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [evidenceData, setEvidenceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/evidence')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvidenceData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredEvidence = useMemo(() => {
    return evidenceData.filter(ev => {
      const matchesSearch = (ev.id || '').toLowerCase().includes(search.toLowerCase()) || 
                            (ev.inspectionId || '').toLowerCase().includes(search.toLowerCase()) ||
                            (ev.type || '').toLowerCase().includes(search.toLowerCase());
      
      const matchesSource = sourceFilter === 'All Sources' || ev.type === sourceFilter;
      
      return matchesSearch && matchesSource;
    });
  }, [search, sourceFilter, evidenceData]);

  if (loading) return <div className="content" style={{ color: 'var(--dim)' }}>Loading evidence library...</div>;

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
            placeholder="Search ID, Case, or Type..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option>All Sources</option>
            <option>OCR</option>
            <option>VLM</option>
            <option>CAMERA</option>
          </select>
        </div>
      </div>

      {evidenceData.length === 0 ? (
        <div className="panel">
          <div className="panel-body" style={{ textAlign: 'center', padding: '48px', color: 'var(--dim)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>No evidence recorded yet</div>
            <div style={{ fontSize: '13px' }}>Run an inspection and upload package images to populate the evidence library.</div>
          </div>
        </div>
      ) : (
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
                [ Evidence: {ev.type || 'Image'} ]
              </div>
              <div className="panel-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>{ev.id}</span>
                  <span className="tag green">{ev.type || 'IMAGE'}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Uploaded {ev.uploadedAt ? new Date(ev.uploadedAt).toLocaleString() : '—'}</div>
                <div style={{ marginTop: '16px', fontSize: '11px' }}>
                  Linked to: <a href={`/cases/${ev.inspectionId}`} style={{ color: 'var(--text)', textDecoration: 'underline' }}>{ev.inspectionId}</a>
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
      )}
    </section>
  );
}
