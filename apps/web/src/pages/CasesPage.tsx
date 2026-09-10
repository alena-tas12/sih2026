import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CasesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [casesData, setCasesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inspections')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCasesData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCases = useMemo(() => {
    return casesData.filter(c => {
      const productName = c.productName || '';
      const orgName = c.orgName || '';
      const id = c.id || '';
      
      const matchesSearch = id.toLowerCase().includes(search.toLowerCase()) || 
                            productName.toLowerCase().includes(search.toLowerCase()) ||
                            orgName.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = filterStatus === 'All Statuses' ||
                            (filterStatus === 'Compliant' && c.status === 'COMPLIANT') ||
                            (filterStatus === 'Needs Review' && c.status === 'REVIEW_REQUIRED') ||
                            (filterStatus === 'Non-Compliant' && c.status === 'NON_COMPLIANT');

      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus, casesData]);

  if (loading) return <div className="content" style={{ color: 'var(--dim)' }}>Loading cases from backend...</div>;

  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1>Inspection Cases</h1>
          <p className="subtitle">Complete audit log of all processed compliance scans.</p>
        </div>
        <button className="primary" onClick={() => navigate('/inspections')}>New inspection</button>
      </div>

      <div className="panel bottom">
        <div className="panel-head" style={{ gap: '16px' }}>
          <input 
            type="text" 
            className="search" 
            placeholder="Search cases by ID or Product..." 
            style={{ flex: 1, maxWidth: 'none' }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All Statuses</option>
            <option>Compliant</option>
            <option>Needs Review</option>
            <option>Non-Compliant</option>
          </select>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Product</th>
                <th>Organization</th>
                <th>Date</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map(c => {
                const statusMap: Record<string, string> = {
                  COMPLIANT: 'green',
                  NON_COMPLIANT: 'danger',
                  REVIEW_REQUIRED: 'amber'
                };
                return (
                  <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} style={{ cursor: 'pointer' }}>
                    <td><span className="mono">{c.id}</span></td>
                    <td className="primary-cell">{c.productName || c.gtin}</td>
                    <td>{c.orgName || '—'}</td>
                    <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`tag ${statusMap[c.status] || ''}`}>{(c.status || '').replace('_', ' ')}</span>
                    </td>
                    <td>{c.location || '—'}</td>
                  </tr>
                );
              })}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--dim)' }}>
                    {casesData.length === 0 ? 'No inspections recorded yet. Run your first inspection to see cases here.' : 'No cases match your filters.'}
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
