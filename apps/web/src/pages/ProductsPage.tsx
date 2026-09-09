import React from 'react';

export default function ProductsPage() {
  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Product Intelligence</div>
          <h1>Premium Basmati Rice</h1>
          <p className="subtitle">Master catalog identity and cross-location history</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="outline">Sync from ERP</button>
          <button className="primary">Edit Master</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        
        {/* Left: Product Master */}
        <div className="panel" style={{ alignSelf: 'start' }}>
          <div className="panel-head">
            <h2 className="panel-title">Master Identity</h2>
          </div>
          <div className="panel-body">
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>ABC Foods</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>Verified FMCG Vendor</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>GTIN / Barcode</div>
                <div className="mono" style={{ color: 'var(--text)' }}>8901030985223</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>Registered Pack Size</div>
                <div style={{ color: 'var(--text)' }}>500 g</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>Manufacturer Address</div>
                <div style={{ color: 'var(--text)' }}>ABC Foods India Pvt Ltd.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: History Timeline */}
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Cross-Location Inspection Timeline</h2>
          </div>
          <div className="panel-body" style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Timeline Line */}
            <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', background: 'var(--line)' }}></div>
            
            {[
              { date: 'Today, 14:30', title: 'Human Review Requested', desc: 'Case CASE-105 marked for manual review.', icon: 'M', color: 'var(--text)' },
              { date: 'Today, 14:25', title: 'Difference Detected', desc: 'Bangalore Hub reported MRP ₹160 (Mismatch from Master).', icon: '!', color: 'var(--amber)' },
              { date: 'Sep 08, 09:15', title: 'Identity & Declaration Match', desc: 'Chennai Hub scanned product. MRP ₹150 / 500g matched.', icon: 'V', color: 'var(--dim)' },
              { date: 'Sep 05, 11:00', title: 'Identity & Declaration Match', desc: 'Coimbatore Hub scanned product. MRP ₹150 / 500g matched.', icon: 'V', color: 'var(--dim)' },
              { date: 'Sep 01, 00:00', title: 'Product Master Created', desc: 'Synced from central ERP via API.', icon: '+', color: 'var(--dim)' },
            ].map((event, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '32px' }}>
                <div style={{ 
                  position: 'absolute', left: '-27px', top: '2px', 
                  width: '20px', height: '20px', borderRadius: '50%', 
                  background: 'var(--bg)', border: `1px solid ${event.color === 'var(--text)' ? '#fff' : 'var(--line)'}`,
                  color: event.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 600
                }}>{event.icon}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{event.date}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{event.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>{event.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
