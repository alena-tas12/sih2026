import React from 'react';

export default function ProductsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Intelligence</h1>
          <p className="page-desc">Master catalog and cross-location history</p>
        </div>
        <div className="breadcrumbs" style={{ marginTop: '8px' }}>
          <span>Products</span> <span>/</span> <span className="current">8901030985223</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        
        {/* Left: Product Master */}
        <div className="panel" style={{ alignSelf: 'start' }}>
          <div className="panel-header">
            <h2 className="panel-title">Product Identity</h2>
          </div>
          <div className="panel-body">
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Premium Basmati Rice</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>ABC Foods</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>GTIN / Barcode</div>
                <div className="mono" style={{ color: 'var(--text-primary)' }}>8901030985223</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Default Pack Size</div>
                <div style={{ color: 'var(--text-primary)' }}>500 g</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Manufacturer</div>
                <div style={{ color: 'var(--text-primary)' }}>ABC Foods India Pvt Ltd.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: History Timeline */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Cross-Location Inspection Timeline</h2>
          </div>
          <div className="panel-body" style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Timeline Line */}
            <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border-subtle)' }}></div>
            
            {[
              { date: 'Today, 14:30', title: 'Human Review Requested', desc: 'Case CASE-105 marked for manual review.', icon: '⚠️', color: 'var(--warning-text)' },
              { date: 'Today, 14:25', title: 'Difference Detected', desc: 'Bangalore Hub reported MRP ₹160 (Mismatch from Master).', icon: '⚡', color: 'var(--danger-text)' },
              { date: 'Sep 08, 09:15', title: 'Identity & Declaration Match', desc: 'Chennai Hub scanned product. MRP ₹150 / 500g matched.', icon: '✓', color: 'var(--success-text)' },
              { date: 'Sep 05, 11:00', title: 'Identity & Declaration Match', desc: 'Coimbatore Hub scanned product. MRP ₹150 / 500g matched.', icon: '✓', color: 'var(--success-text)' },
              { date: 'Sep 01, 00:00', title: 'Product Master Created', desc: 'Synced from central ERP via API.', icon: '📦', color: 'var(--accent-main)' },
            ].map((event, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '32px' }}>
                <div style={{ 
                  position: 'absolute', left: '-27px', top: '2px', 
                  width: '20px', height: '20px', borderRadius: '50%', 
                  background: 'var(--bg-base)', border: `2px solid ${event.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px'
                }}>{event.icon}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{event.date}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{event.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{event.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
