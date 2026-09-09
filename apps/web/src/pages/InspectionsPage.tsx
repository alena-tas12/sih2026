import React, { useState } from 'react';

export default function InspectionsPage() {
  const [step, setStep] = useState(1);
  const proceed = (next: number) => setStep(next);

  return (
    <section className="content" style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 120px)' }}>
      
      {/* Sidebar Workflow Tracker */}
      <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid var(--line)', paddingRight: '24px' }}>
        <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '24px' }}>Workflow</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { id: 1, label: '01 Capture Evidence' },
            { id: 2, label: '02 Identify Product' },
            { id: 3, label: '03 Cross-Compare' },
            { id: 4, label: '04 Rule Verification' },
            { id: 5, label: '05 Human Decision' }
          ].map(s => (
            <div key={s.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              color: step >= s.id ? 'var(--text)' : 'var(--dim)',
              fontWeight: step === s.id ? 600 : 400,
              cursor: 'pointer'
            }} onClick={() => proceed(s.id)}>
              <div style={{ 
                width: 8, height: 8, borderRadius: '50%', 
                background: step === s.id ? '#fff' : step > s.id ? '#888' : 'transparent',
                border: step > s.id ? 'none' : '1px solid var(--line2)'
              }}></div>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '16px' }}>
        
        <div className="header">
          <div>
            <div className="eyebrow">New Inspection / Bangalore Hub</div>
            <h1>ABC Foods · Premium Basmati Rice</h1>
          </div>
          <button className="primary" onClick={() => proceed(step < 5 ? step + 1 : 5)}>Save & Next</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Product Identity */}
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">Product Identity (Barcode)</h2>
            </div>
            <div className="panel-body" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '120px', background: 'var(--bg)', border: '1px dashed var(--line2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 [Barcode Scan]
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>GTIN / EAN</div>
                <div className="mono" style={{ fontSize: '20px', color: 'var(--text)', marginBottom: '8px' }}>8901030985223</div>
                <span className="tag green">Matched product across 4 locations</span>
              </div>
            </div>
          </div>

          {/* Evidence vs Record Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">Package Evidence (OCR)</h2>
              </div>
              <div className="panel-body">
                <div style={{ height: '160px', background: 'var(--bg)', border: '1px solid var(--line)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dim)' }}>[ Live Image / Bounding Boxes ]</div>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--muted)' }}>MRP</span><span className="mono">₹160.00</span>
                  <span style={{ color: 'var(--muted)' }}>Net Qty</span><span className="mono">500 g</span>
                  <span style={{ color: 'var(--muted)' }}>Mfg</span><span className="mono">ABC Foods</span>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">Product Master Record</h2>
              </div>
              <div className="panel-body">
                <div style={{ height: '160px', background: 'var(--bg)', border: '1px solid var(--line)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dim)' }}>[ Reference Image ]</div>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--muted)' }}>MRP</span><span className="mono">₹150.00</span>
                  <span style={{ color: 'var(--muted)' }}>Net Qty</span><span className="mono">500 g</span>
                  <span style={{ color: 'var(--muted)' }}>Mfg</span><span className="mono">ABC Foods</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Location Comparison */}
          <div className="panel" style={{ borderColor: 'var(--amber)' }}>
            <div className="panel-head" style={{ borderBottomColor: 'var(--amber)' }}>
              <h2 className="panel-title" style={{ color: 'var(--amber)' }}>Cross-Location Comparison</h2>
            </div>
            <table className="table">
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
                  <td><span className="tag green">Match</span></td>
                </tr>
                <tr>
                  <td>Chennai</td>
                  <td className="mono">₹150</td>
                  <td className="mono">500 g</td>
                  <td><span className="tag green">Match</span></td>
                </tr>
                <tr style={{ background: 'var(--panel2)' }}>
                  <td>Bangalore (Current)</td>
                  <td className="mono" style={{ color: 'var(--amber)', fontWeight: 600 }}>₹160</td>
                  <td className="mono">500 g</td>
                  <td><span className="tag amber">Difference</span></td>
                </tr>
              </tbody>
            </table>
            <div className="panel-body">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--amber)' }}>MRP differs from 2 locations</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>A declaration difference was detected. Human review required.</div>
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button className="outline">View Evidence</button>
                <button className="primary">Review Difference</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
