import React from 'react';
import { useNavigate } from 'react-router-dom';

const casesData = [
  { id: 'CASE-2026-0104', product: 'Premium Basmati Rice (5 kg)', org: 'ABC Foods', date: '09 Sep 2026', status: 'REVIEW_REQUIRED', compliant: 2, review: 1, total: 3 },
  { id: 'CASE-2026-0103', product: 'Sunrise Detergent (1 kg)', org: 'Sunrise LLC', date: '08 Sep 2026', status: 'COMPLIANT', compliant: 4, review: 0, total: 4 },
  { id: 'CASE-2026-0102', product: 'FreshMilk Toned Milk (500 ml)', org: 'DairyCorp', date: '07 Sep 2026', status: 'NON_COMPLIANT', compliant: 2, review: 0, total: 5 },
  { id: 'CASE-2026-0101', product: 'QuickBite Instant Noodles (70 g)', org: 'QuickBite', date: '07 Sep 2026', status: 'COMPLIANT', compliant: 5, review: 0, total: 5 },
  { id: 'CASE-2026-0100', product: 'PureGold Cooking Oil (1 L)', org: 'PureGold', date: '06 Sep 2026', status: 'REVIEW_REQUIRED', compliant: 3, review: 2, total: 5 },
];

export default function CasesPage() {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inspection Cases</h1>
          <p className="page-desc">Complete audit log of all processed compliance scans.</p>
        </div>
        <button className="btn btn-primary">+ New Inspection</button>
      </div>

      <div className="panel">
        <div className="panel-header" style={{ display: 'flex', gap: '16px' }}>
          <input type="text" placeholder="Search cases..." style={{ flex: 1, background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '4px', fontSize: '13px' }} />
          <select style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '4px', fontSize: '13px' }}>
            <option>All Statuses</option>
            <option>Compliant</option>
            <option>Needs Review</option>
            <option>Non-Compliant</option>
          </select>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Product</th>
              <th>Organization</th>
              <th>Date</th>
              <th>Status</th>
              <th>Fields</th>
            </tr>
          </thead>
          <tbody>
            {casesData.map(c => {
              const statusMap: Record<string, string> = {
                COMPLIANT: 'success',
                NON_COMPLIANT: 'danger',
                REVIEW_REQUIRED: 'warning'
              };
              return (
                <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} style={{ cursor: 'pointer' }}>
                  <td><span className="mono">{c.id}</span></td>
                  <td className="primary-cell">{c.product}</td>
                  <td>{c.org}</td>
                  <td>{c.date}</td>
                  <td>
                    <span className={`badge ${statusMap[c.status]}`}>{c.status.replace('_', ' ')}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>{c.compliant}</span>
                    {c.review > 0 && <span style={{ color: 'var(--warning-text)', fontWeight: 600 }}> +{c.review}</span>}
                    <span style={{ color: 'var(--text-muted)' }}> / {c.total}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
