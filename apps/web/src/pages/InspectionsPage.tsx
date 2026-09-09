import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InspectionsPage() {
  const [step, setStep] = useState(1);
  const [gtin, setGtin] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);
  const navigate = useNavigate();

  // Step 1: Scan Barcode
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gtin) return;
    try {
      const res = await fetch(`/api/products/${gtin}`);
      if (res.ok) {
        const prod = await res.json();
        setProduct(prod);
        // Fetch history for comparison
        const histRes = await fetch(`/api/products/${gtin}/inspections`);
        const hist = await histRes.json();
        setHistory(hist);
        setStep(2);
      } else {
        alert("Product not found in Master Database.");
      }
    } catch (e) {
      alert("Failed to connect to backend API.");
    }
  };

  // Step 2: Upload Package Evidence
  const handleUpload = () => {
    // Mocking the OCR pipeline extraction
    setExtractedData({
      mrp: '160.00', // Intentional mismatch from the 150.00 master to force review
      qty: '500 g'
    });
    setStep(3);
  };

  // Step 4: Submit Final Decision
  const handleDecision = async (decision: 'COMPLIANT' | 'NON_COMPLIANT' | 'REVIEW_REQUIRED') => {
    try {
      await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gtin,
          location: 'Bangalore Hub',
          extractedMrp: extractedData.mrp,
          extractedQty: extractedData.qty,
          status: decision
        })
      });
      // Redirect to product page to see the new cycle event
      navigate('/products?gtin=' + gtin);
    } catch (e) {
      alert('Failed to save inspection.');
    }
  };

  return (
    <section className="content" style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 120px)' }}>
      {/* Sidebar Workflow Tracker */}
      <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid var(--line)', paddingRight: '24px' }}>
        <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '24px' }}>Workflow</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { id: 1, label: '01 Identity (Barcode)' },
            { id: 2, label: '02 Extract Evidence' },
            { id: 3, label: '03 Cross-Compare' },
            { id: 4, label: '04 Final Decision' }
          ].map(s => (
            <div key={s.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              color: step >= s.id ? 'var(--text)' : 'var(--dim)',
              fontWeight: step === s.id ? 600 : 400
            }}>
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
            <h1>{product ? product.name : 'Unknown Product'}</h1>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {step === 1 && (
            <div className="panel">
              <div className="panel-head"><h2 className="panel-title">Scan Product Barcode</h2></div>
              <div className="panel-body">
                <form onSubmit={handleScan} style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    className="search" 
                    placeholder="Scan or enter GTIN (e.g. 8901030985223)" 
                    value={gtin} 
                    onChange={e => setGtin(e.target.value)}
                    style={{ width: '300px' }}
                    autoFocus
                  />
                  <button type="submit" className="primary">Lookup Product</button>
                </form>
              </div>
            </div>
          )}

          {step >= 2 && product && (
            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">Product Identity Confirmed</h2>
                <span className="tag green">Matched Master</span>
              </div>
              <div className="panel-body" style={{ display: 'flex', gap: '16px' }}>
                <div><span style={{color:'var(--muted)'}}>GTIN:</span> {product.gtin}</div>
                <div><span style={{color:'var(--muted)'}}>Expected MRP:</span> ₹{product.mrp}</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="panel">
              <div className="panel-head"><h2 className="panel-title">Package Evidence (OCR)</h2></div>
              <div className="panel-body">
                <div style={{ height: '160px', background: 'var(--bg)', border: '1px dashed var(--line2)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dim)', cursor: 'pointer' }} onClick={handleUpload}>
                  Click to simulate camera capture & OCR extraction...
                </div>
              </div>
            </div>
          )}

          {step >= 3 && extractedData && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="panel">
                <div className="panel-head"><h2 className="panel-title">Extracted Evidence</h2></div>
                <div className="panel-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--muted)' }}>MRP</span><span className="mono" style={{ color: 'var(--amber)', fontWeight: 'bold' }}>₹{extractedData.mrp}</span>
                    <span style={{ color: 'var(--muted)' }}>Net Qty</span><span className="mono">{extractedData.qty}</span>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head"><h2 className="panel-title">Product Master</h2></div>
                <div className="panel-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--muted)' }}>MRP</span><span className="mono">₹{product.mrp}</span>
                    <span style={{ color: 'var(--muted)' }}>Net Qty</span><span className="mono">{product.netQuantity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step >= 3 && (
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
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td>{h.location}</td>
                      <td className="mono">₹{h.extractedMrp}</td>
                      <td className="mono">{h.extractedQty}</td>
                      <td><span className={`tag ${h.status === 'COMPLIANT' ? 'green' : 'amber'}`}>{h.status}</span></td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--panel2)' }}>
                    <td>Bangalore (Current Scan)</td>
                    <td className="mono" style={{ color: 'var(--amber)', fontWeight: 600 }}>₹{extractedData.mrp}</td>
                    <td className="mono">{extractedData.qty}</td>
                    <td><span className="tag amber">Pending</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="panel-body">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--amber)' }}>MRP differs from previous locations</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>A declaration difference was detected against the master and {history.length} previous scans.</div>
                  </div>
                </div>
                {step === 3 && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <button className="primary" onClick={() => setStep(4)}>Proceed to Decision</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
             <div className="panel">
             <div className="panel-head"><h2 className="panel-title">Final Human Decision</h2></div>
             <div className="panel-body">
               <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>Select the final status for this inspection record. This will permanently update the product cycle history.</p>
               <div style={{ display: 'flex', gap: '12px' }}>
                 <button className="primary" style={{ background: '#1a4d2e', color: '#fff', borderColor: '#1a4d2e' }} onClick={() => handleDecision('COMPLIANT')}>Mark Compliant</button>
                 <button className="primary" style={{ background: '#5c2020', color: '#fff', borderColor: '#5c2020' }} onClick={() => handleDecision('NON_COMPLIANT')}>Flag Non-Compliant</button>
                 <button className="outline" onClick={() => handleDecision('REVIEW_REQUIRED')}>Escalate (Needs Review)</button>
               </div>
             </div>
           </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
