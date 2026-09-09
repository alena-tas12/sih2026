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
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1>Inspection Cases</h1>
          <p className="subtitle">Complete audit log of all processed compliance scans.</p>
        </div>
        <button className="primary">New inspection</button>
      </div>

      <div className="panel bottom">
        <div className="panel-head" style={{ gap: '16px' }}>
          <input type="text" className="search" placeholder="Search cases by ID or Product..." style={{ flex: 1, maxWidth: 'none' }} />
          <select>
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
                <th>Fields</th>
              </tr>
            </thead>
            <tbody>
              {casesData.map(c => {
                const statusMap: Record<string, string> = {
                  COMPLIANT: 'green',
                  NON_COMPLIANT: 'danger',
                  REVIEW_REQUIRED: 'amber'
                };
                return (
                  <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} style={{ cursor: 'pointer' }}>
                    <td><span className="mono">{c.id}</span></td>
                    <td className="primary-cell">{c.product}</td>
                    <td>{c.org}</td>
                    <td>{c.date}</td>
                    <td>
                      <span className={`tag ${statusMap[c.status]}`}>{c.status.replace('_', ' ')}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--green)', fontWeight: 600 }}>{c.compliant}</span>
                      {c.review > 0 && <span style={{ color: 'var(--amber)', fontWeight: 600 }}> +{c.review}</span>}
                      <span style={{ color: 'var(--dim)' }}> / {c.total}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
