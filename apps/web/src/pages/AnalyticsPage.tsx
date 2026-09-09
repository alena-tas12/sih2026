import React from 'react';

export default function AnalyticsPage() {
  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">System intelligence</div>
          <h1>Compliance analytics</h1>
          <p className="subtitle">Understand inspection throughput, model agreement, and review workload.</p>
        </div>
        <div className="filters">
          <select><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select>
          <button className="outline">Export report ↗</button>
        </div>
      </div>
      <div className="metrics">
        <div className="metric"><div className="metric-label">Total inspections</div><div className="metric-value">1,248</div><div className="metric-foot"><span className="up">↑ 12.4%</span> vs previous period</div></div>
        <div className="metric"><div className="metric-label">Auto-compliant rate</div><div className="metric-value">78.5%</div><div className="metric-foot"><span className="up">↑ 4.8%</span> decision confidence</div></div>
        <div className="metric"><div className="metric-label">Human reviews</div><div className="metric-value">215</div><div className="metric-foot"><span className="warn">17.2%</span> of all inspections</div></div>
        <div className="metric"><div className="metric-label">AI contradictions</div><div className="metric-value">42</div><div className="metric-foot"><span className="bad">3.4%</span> halted for verification</div></div>
      </div>
      <div className="grid">
        <section className="panel">
          <div className="panel-head"><div><div className="panel-title">Inspection volume</div><div className="panel-note">Processed cases by week</div></div><div className="panel-note">1,248 total</div></div>
          <div className="panel-body">
            <div className="chart">
              <div className="bars">
                <div className="bar-col"><div className="bar" style={{height:'34%'}}></div><span className="bar-label">W1</span></div>
                <div className="bar-col"><div className="bar" style={{height:'48%'}}></div><span className="bar-label">W2</span></div>
                <div className="bar-col"><div className="bar" style={{height:'43%'}}></div><span className="bar-label">W3</span></div>
                <div className="bar-col"><div className="bar" style={{height:'61%'}}></div><span className="bar-label">W4</span></div>
                <div className="bar-col"><div className="bar" style={{height:'57%'}}></div><span className="bar-label">W5</span></div>
                <div className="bar-col"><div className="bar" style={{height:'76%'}}></div><span className="bar-label">W6</span></div>
                <div className="bar-col"><div className="bar" style={{height:'70%'}}></div><span className="bar-label">W7</span></div>
                <div className="bar-col"><div className="bar" style={{height:'91%'}}></div><span className="bar-label">W8</span></div>
              </div>
              <div className="legend"><span><i className="dot"></i>Completed inspections</span><span><i className="dot gray"></i>Review queue</span></div>
            </div>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><div><div className="panel-title">Review triggers</div><div className="panel-note">Why cases need attention</div></div><div className="panel-note">Top sources</div></div>
          <div className="panel-body">
            <div className="list">
              <div className="row"><div className="row-main"><div className="row-title">Manufacturer address</div><div className="row-sub">OCR low confidence</div><div className="progress"><i style={{width:'45%'}}></i></div></div><div className="percent">45%</div></div>
              <div className="row"><div className="row-main"><div className="row-title">Expiry date</div><div className="row-sub">Format variability</div><div className="progress"><i style={{width:'28%'}}></i></div></div><div className="percent">28%</div></div>
              <div className="row"><div className="row-main"><div className="row-title">Net quantity</div><div className="row-sub">Unit normalization</div><div className="progress"><i style={{width:'12%'}}></i></div></div><div className="percent">12%</div></div>
              <div className="row"><div className="row-main"><div className="row-title">MRP declaration</div><div className="row-sub">Image obstruction</div><div className="progress"><i style={{width:'9%'}}></i></div></div><div className="percent">9%</div></div>
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
            <div className="progress" style={{height:'9px'}}><i style={{width:'85%',background:'var(--green)'}}></i></div>
            <p style={{color:'var(--muted)',fontSize:'12px',margin:'16px 0 0'}}>Conflicting values are halted and routed to human review instead of silently becoming legal decisions.</p>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><div><div className="panel-title">Recent system activity</div><div className="panel-note">Latest events</div></div><button className="outline" style={{height:'28px',padding:'0 9px'}}>View all</button></div>
          <div className="panel-body">
            <div className="list">
              <div className="row"><div className="row-main"><div className="row-title">CASE-2026-0104 finalized</div><div className="row-sub">Net quantity and MRP approved</div></div><span className="tag green">Approved</span></div>
              <div className="row"><div className="row-main"><div className="row-title">CASE-2026-0103 requires review</div><div className="row-sub">Contradictory expiry date</div></div><span className="tag amber">Review</span></div>
              <div className="row"><div className="row-main"><div className="row-title">Regulation version updated</div><div className="row-sub">PC Rules 2011 · v3</div></div><span className="tag">System</span></div>
            </div>
          </div>
        </section>
      </div>
      <section className="panel bottom">
        <div className="panel-head"><div><div className="panel-title">Recent inspections</div><div className="panel-note">Latest cases processed by the workspace</div></div><button className="outline" style={{height:'30px'}}>Open cases</button></div>
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
