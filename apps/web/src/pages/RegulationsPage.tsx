import React, { useState, useEffect, useMemo } from 'react';

export default function RegulationsPage() {
  const [search, setSearch] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [rulesData, setRulesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/regulations')
      .then(res => res.json())
      .then(data => {
        setRulesData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredRules = useMemo(() => {
    return rulesData.filter(r => 
      r.id.toLowerCase().includes(search.toLowerCase()) || 
      r.ref.toLowerCase().includes(search.toLowerCase()) || 
      r.field.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, rulesData]);

  return (
    <section className="content">
      {/* Rule Editor Modal */}
      {showEditor && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="panel" style={{ width: '500px', background: 'var(--bg)' }}>
            <div className="panel-head">
              <h2 className="panel-title">Rule Engine Editor</h2>
              <button className="icon-btn" style={{ border: 'none' }} onClick={() => setShowEditor(false)}>X</button>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={{ fontSize: '11px', color: 'var(--dim)' }}>Legal Reference</label><input type="text" className="search" style={{ width: '100%' }} placeholder="e.g. PC Rules 2011" /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--dim)' }}>Target Extraction Field</label><input type="text" className="search" style={{ width: '100%' }} placeholder="e.g. Net Quantity" /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--dim)' }}>Deterministic Logic (AST)</label><textarea className="search" style={{ width: '100%', height: '80px', padding: '10px' }} placeholder="value > 0 AND unit IN ('g','kg')" /></div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
                <button className="outline" style={{ flex: 1 }} onClick={() => setShowEditor(false)}>Cancel</button>
                <button className="primary" style={{ flex: 1 }} onClick={() => setShowEditor(false)}>Compile & Save Rule</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <div>
          <div className="eyebrow">System</div>
          <h1>Regulatory Knowledge Base</h1>
          <p className="subtitle">Temporal rule engine mapping legal text to deterministic logic constraints.</p>
        </div>
        <div className="filters">
          <input 
            className="search" 
            placeholder="Search rules or laws..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="primary" onClick={() => setShowEditor(true)}>+ Add Rule</button>
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
            {loading ? <div style={{ padding: '20px', color: 'var(--dim)' }}>Loading dataset rules...</div> :
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
                {filteredRules.map(r => (
                  <tr key={r.id}>
                    <td className="mono" style={{ fontSize: '11px' }}>{r.id}</td>
                    <td className="primary-cell">
                      {r.ref}
                      {r.url && <div><a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: 'var(--accent)', textDecoration: 'underline' }}>Source Document</a></div>}
                    </td>
                    <td>{r.field}</td>
                    <td className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>{r.logic}</td>
                    <td><span className={`tag ${r.status === 'Active' ? 'green' : 'amber'}`}>{r.status}</span></td>
                  </tr>
                ))}
                {filteredRules.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--dim)' }}>
                      No rules match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>}
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
