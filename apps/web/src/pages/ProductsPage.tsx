import React, { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [product, setProduct] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const gtin = '8901030985223'; // Hardcoded for prototype demonstration

  useEffect(() => {
    // Read GTIN from URL query param, default to 8901030985223 if missing
    const searchParams = new URLSearchParams(window.location.search);
    const targetGtin = searchParams.get('gtin') || '8901030985223';
    
    const fetchData = async () => {
      try {
        const [prodRes, histRes] = await Promise.all([
          fetch(`http://localhost:3000/api/products/${targetGtin}`),
          fetch(`http://localhost:3000/api/products/${targetGtin}/inspections`)
        ]);
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProduct(prodData);
        }
        
        if (histRes.ok) {
          const histData = await histRes.json();
          setHistory(histData);
        }
      } catch (e) {
        console.error('Failed to load API data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="content" style={{ color: 'var(--dim)' }}>Loading Product Master...</div>;
  if (!product) return <div className="content" style={{ color: 'var(--red)' }}>Failed to connect to API Backend.</div>;

  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">Product Intelligence</div>
          <h1>{product.name}</h1>
          <p className="subtitle">Master catalog identity and cross-location history</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="outline" onClick={() => alert('Mock: ERP synchronization initiated. GTIN records will update in the background.')}>Sync from ERP</button>
          <button className="primary" onClick={() => alert('Mock: Opening product master editor modal...')}>Edit Master</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        
        {/* Left: Product Master */}
        <div className="panel" style={{ alignSelf: 'start' }}>
          <div className="panel-head">
            <h2 className="panel-title">Master Identity</h2>
          </div>
          <div className="panel-body">
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{product.brand}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>{product.vendor}</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>GTIN / Barcode</div>
                <div className="mono" style={{ color: 'var(--text)' }}>{product.gtin}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>Registered Pack Size</div>
                <div style={{ color: 'var(--text)' }}>{product.netQuantity}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>Registered MRP</div>
                <div style={{ color: 'var(--text)' }}>₹{product.mrp}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>Manufacturer Address</div>
                <div style={{ color: 'var(--text)' }}>{product.manufacturerAddress}</div>
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
            
            <div style={{ position: 'relative', marginBottom: '32px' }}>
              <div style={{ 
                position: 'absolute', left: '-27px', top: '2px', 
                width: '20px', height: '20px', borderRadius: '50%', 
                background: 'var(--bg)', border: `1px solid var(--line)`,
                color: 'var(--dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 600
              }}>+</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Master Created</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Product Master Synced</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Synced from central ERP via API.</div>
            </div>

            {history.map((insp, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '32px' }}>
                <div style={{ 
                  position: 'absolute', left: '-27px', top: '2px', 
                  width: '20px', height: '20px', borderRadius: '50%', 
                  background: 'var(--bg)', border: `1px solid ${insp.status === 'COMPLIANT' ? 'var(--line)' : 'var(--amber)'}`,
                  color: insp.status === 'COMPLIANT' ? 'var(--dim)' : 'var(--amber)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 600
                }}>{insp.status === 'COMPLIANT' ? 'V' : '!'}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{new Date(insp.date).toLocaleString()}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{insp.status === 'COMPLIANT' ? 'Identity & Declaration Match' : 'Difference Detected'}</div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                  {insp.location} scanned product. 
                  {insp.status === 'COMPLIANT' 
                    ? ` MRP ₹${insp.extractedMrp} / ${insp.extractedQty} matched.`
                    : ` Reported MRP ₹${insp.extractedMrp} (Mismatch from Master).`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
