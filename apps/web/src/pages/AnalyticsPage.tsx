import React from 'react';

export default function AnalyticsPage() {
  const handleExport = () => {
    alert('Analytics report exported as CSV.');
  };

  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1>Cross-Location Analytics</h1>
          <p className="subtitle">Node-level compliance aggregation and temporal trends.</p>
        </div>
        <div className="filters">
          <select><option>All locations</option><option>Coimbatore Hub</option><option>Chennai Hub</option></select>
          <select><option>Last 30 Days</option><option>Last 7 Days</option><option>Year to Date</option></select>
          <button className="outline" onClick={handleExport}>Export report ⬇</button>
        </div>
      </div>
      
      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Compliance Rate</div>
          <div className="metric-value">94.2%</div>
          <div className="metric-foot"><span className="up">↗ 1.2%</span> vs last month</div>
        </div>
        <div className="metric">
          <div className="metric-label">Average Confidence</div>
          <div className="metric-value">91.8%</div>
          <div className="metric-foot"><span className="up">↗ 0.4%</span> across all scans</div>
        </div>
        <div className="metric">
          <div className="metric-label">Human Overrides</div>
          <div className="metric-value">34</div>
          <div className="metric-foot"><span className="bad">↗ 12</span> this week</div>
        </div>
        <div className="metric">
          <div className="metric-label">Active Contradictions</div>
          <div className="metric-value">12</div>
          <div className="metric-foot"><span className="warn">↗ 4</span> pending review</div>
        </div>
      </div>

      <div className="grid">
        <section className="panel">
          <div className="panel-head"><div><div className="panel-title">Inspection volume by region</div><div className="panel-note">Daily throughput across active hubs</div></div></div>
          <div className="panel-body">
            <div className="chart">
              <div className="bars">
                <div className="bar-col"><div className="bar" style={{height:'35%'}}></div><div className="bar alt" style={{height:'12%'}}></div><div className="bar-label">Mon</div></div>
                <div className="bar-col"><div className="bar" style={{height:'42%'}}></div><div className="bar alt" style={{height:'15%'}}></div><div className="bar-label">Tue</div></div>
                <div className="bar-col"><div className="bar" style={{height:'38%'}}></div><div className="bar alt" style={{height:'18%'}}></div><div className="bar-label">Wed</div></div>
                <div className="bar-col"><div className="bar" style={{height:'51%'}}></div><div className="bar alt" style={{height:'10%'}}></div><div className="bar-label">Thu</div></div>
                <div className="bar-col"><div className="bar" style={{height:'65%'}}></div><div className="bar alt" style={{height:'14%'}}></div><div className="bar-label">Fri</div></div>
                <div className="bar-col"><div className="bar" style={{height:'40%'}}></div><div className="bar alt" style={{height:'8%'}}></div><div className="bar-label">Sat</div></div>
                <div className="bar-col"><div className="bar" style={{height:'25%'}}></div><div className="bar alt" style={{height:'4%'}}></div><div className="bar-label">Sun</div></div>
              </div>
              <div className="legend"><div className="legend-item"><i className="dot"></i> Coimbatore Hub</div><div className="legend-item"><i className="dot gray"></i> Chennai Hub</div></div>
            </div>
          </div>
        </section>
      </div>
      <div className="grid bottom">
        <section className="panel">
          <div className="panel-head"><div><div className="panel-title">Dual-modal agreement</div><div className="panel-note">OCR and vision extraction comparison</div></div><span className="tag green">Stable</span></div>
          <div className="panel-body">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginBottom:'14px'}}>
              <div><div style={{fontSize:'36px',fontWeight:650,letterSpacing:'-.06em'}}>85%</div><div style={{color:'var(--muted)'}}>Agreement across evaluated fields</div></div>
              <div style={{textAlign:'right',color:'var(--dim)',fontSize:'11px'}}>15% conflict<br/>3.4% of all scans</div>
            </div>
            <div className="progress" style={{height:'9px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden'}}><div style={{width:'85%', height: '100%', background:'var(--green)'}}></div></div>
            <p style={{color:'var(--muted)',fontSize:'12px',margin:'16px 0 0'}}>Conflicting values are halted and routed to human review instead of silently becoming legal decisions.</p>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><div><div className="panel-title">Recent system activity</div><div className="panel-note">Latest events</div></div><a href="/audit"><button className="outline" style={{height:'28px',padding:'0 9px'}}>View all</button></a></div>
          <div className="panel-body">
            <div className="list">
              <div className="row"><div className="row-main"><div className="row-title">CASE-2026-0104 finalized</div><div className="row-sub">Net quantity and MRP approved</div></div><span className="tag green">Approved</span></div>
              <div className="row"><div className="row-main"><div className="row-title">CASE-2026-0103 requires review</div><div className="row-sub">Contradictory expiry date</div></div><span className="tag amber">Review</span></div>
              <div className="row"><div className="row-main"><div className="row-title">Regulation version updated</div><div className="row-sub">PC Rules 2011 - v3</div></div><span className="tag">System</span></div>
            </div>
          </div>
        </section>
      </div>
      <section className="panel bottom" style={{ marginTop: '24px' }}>
        <div className="panel-head"><div><div className="panel-title">Recent inspections</div><div className="panel-note">Latest cases processed by the workspace</div></div><a href="/cases"><button className="outline" style={{height:'30px'}}>Open cases</button></a></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Case ID</th><th>Product</th><th>Organization</th><th>Fields</th><th>Status</th><th>Updated</th></tr></thead>
            <tbody>
              <tr><td>CASE-2026-0104</td><td>Premium Basmati Rice · 5 kg</td><td>ABC Foods</td><td>3 / 3</td><td><span className="tag green">Compliant</span></td><td>2 min ago</td></tr>
              <tr><td>CASE-2026-0103</td><td>Instant Coffee · 200 g</td><td>Northstar Retail</td><td>4 / 5</td><td><span className="tag amber">Needs review</span></td><td>18 min ago</td></tr>
              <tr><td>CASE-2026-0102</td><td>Bath Soap · 100 g</td><td>Horizon Consumer</td><td>5 / 5</td><td><span className="tag green">Compliant</span></td><td>42 min ago</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
