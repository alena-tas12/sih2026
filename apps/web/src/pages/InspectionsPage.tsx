import React, { useState } from 'react';

export default function InspectionsPage() {
  const [step, setStep] = useState(1);
  
  const proceed = (next: number) => setStep(next);

  return (
    <div className="page-content" style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 120px)' }}>
      
      {/* Sidebar Workflow Tracker */}
      <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)', paddingRight: '24px' }}>
        <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '24px' }}>Inspection</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { id: 1, label: '01 Capture' },
            { id: 2, label: '02 Identify' },
            { id: 3, label: '03 Compare' },
            { id: 4, label: '04 Verify' },
            { id: 5, label: '05 Decide' }
          ].map(s => (
            <div key={s.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              color: step >= s.id ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: step === s.id ? 600 : 400,
              cursor: 'pointer'
            }} onClick={() => proceed(s.id)}>
              <div style={{ 
                width: 8, height: 8, borderRadius: '50%', 
                background: step === s.id ? 'var(--accent-main)' : step > s.id ? 'var(--success-text)' : 'var(--border-subtle)' 
              }}></div>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '16px' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>New Inspection / Bangalore Hub</div>
            <h2 className="page-title">ABC Foods · Premium Basmati Rice</h2>
          </div>
          <button className="btn btn-primary" onClick={() => proceed(step < 5 ? step + 1 : 5)}>Save & Next</button>
        </div>

        {/* Dynamic Step Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Product Identity */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Product Identity (Barcode)</h2>
            </div>
            <div className="panel-body" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '120px', background: 'var(--bg-base)', border: '1px dashed var(--border-focus)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 [Barcode Scan]
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GTIN / EAN</div>
                <div className="mono" style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>8901030985223</div>
                <span className="badge success">Matched product across 4 locations</span>
              </div>
            </div>
          </div>

          {/* Evidence vs Record Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Package Evidence (OCR)</h2>
              </div>
              <div className="panel-body">
                <div style={{ height: '160px', background: 'var(--bg-base)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>[ Live Image / Bounding Boxes ]</div>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>MRP</span><span className="mono">₹160.00</span>
                  <span style={{ color: 'var(--text-muted)' }}>Net Qty</span><span className="mono">500 g</span>
                  <span style={{ color: 'var(--text-muted)' }}>Mfg</span><span className="mono">ABC Foods</span>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Product Master Record</h2>
              </div>
              <div className="panel-body">
                <div style={{ height: '160px', background: 'var(--bg-base)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>[ Reference Image ]</div>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>MRP</span><span className="mono">₹150.00</span>
                  <span style={{ color: 'var(--text-muted)' }}>Net Qty</span><span className="mono">500 g</span>
                  <span style={{ color: 'var(--text-muted)' }}>Mfg</span><span className="mono">ABC Foods</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Location Comparison */}
          <div className="panel" style={{ border: '1px solid var(--warning-border)' }}>
            <div className="panel-header" style={{ background: 'var(--warning-bg)', borderBottom: '1px solid var(--warning-border)' }}>
              <h2 className="panel-title" style={{ color: 'var(--warning-text)' }}>Cross-Location Comparison</h2>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>MRP</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Coimbatore</td>
                  <td className="mono">₹150</td>
                  <td className="mono">500 g</td>
                  <td><span className="badge success">Match</span></td>
                </tr>
                <tr>
                  <td>Chennai</td>
                  <td className="mono">₹150</td>
                  <td className="mono">500 g</td>
                  <td><span className="badge success">Match</span></td>
                </tr>
                <tr style={{ background: 'var(--bg-elevated)' }}>
                  <td>Bangalore (Current)</td>
                  <td className="mono" style={{ color: 'var(--warning-text)', fontWeight: 600 }}>₹160</td>
                  <td className="mono">500 g</td>
                  <td><span className="badge warning">Difference</span></td>
                </tr>
              </tbody>
            </table>
            <div className="panel-body">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--warning-text)' }}>MRP differs from 2 locations</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>A difference was detected. Review the package evidence and applicable regulation before making a final decision.</div>
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline">View Evidence</button>
                <button className="btn btn-outline" style={{ borderColor: 'var(--accent-main)', color: 'var(--accent-main)' }}>Review Difference</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
