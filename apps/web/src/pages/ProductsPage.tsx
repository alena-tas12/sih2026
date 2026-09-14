import React, { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [product, setProduct] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const targetGtin = searchParams.get('gtin') || '8901030985223';
    
    const fetchData = async () => {
      try {
        const [prodRes, histRes, invRes] = await Promise.all([
          fetch(`/api/products/${targetGtin}`),
          fetch(`/api/products/${targetGtin}/inspections`),
          fetch(`/api/products/${targetGtin}/inventory`),
        ]);
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProduct(prodData);
        }
        if (histRes.ok) {
          const histData = await histRes.json();
          setHistory(histData);
        }
        if (invRes.ok) {
          const invData = await invRes.json();
          setInventory(invData);
        }
      } catch (e) {
        console.error('Failed to load API data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get('name') as string;
    const gtin = product.gtin;
    const token = localStorage.getItem('genesis_token');
    
    try {
      await fetch(`/api/products/${gtin}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newName })
      });
      
      setProduct({ ...product, name: newName });
      setShowEditor(false);
    } catch (e) {
      alert('Failed to update product master.');
    }
  };

  if (loading) return <div className="content" style={{ color: 'var(--dim)' }}>Loading Product Master...</div>;
  if (!product) return <div className="content" style={{ color: 'var(--red)' }}>Product not found or failed to connect to API backend.</div>;

  // Field aliases: handle both snake_case from DB and camelCase
  const mrp = product.standard_mrp ?? product.mrp;
  const netQty = product.net_quantity ?? product.netQuantity;
  const mfgAddress = product.manufacturer_address ?? product.manufacturerAddress;

  const isCandidate = product.verified === 0;

  return (
    <section className="content">
      {showEditor && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="panel" style={{ width: '450px', background: 'var(--bg)' }}>
            <div className="panel-head">
              <h2 className="panel-title">Edit Product Master</h2>
              <button className="icon-btn" style={{ border: 'none' }} onClick={() => setShowEditor(false)}>X</button>
            </div>
            <form onSubmit={handleSaveProduct} className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={{ fontSize: '11px', color: 'var(--dim)' }}>GTIN</label><input type="text" className="search" style={{ width: '100%' }} defaultValue={product.gtin} readOnly /></div>
              <div><label style={{ fontSize: '11px', color: 'var(--dim)' }}>Product Name</label><input name="name" type="text" className="search" style={{ width: '100%' }} defaultValue={product.name} /></div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
                <button type="button" className="outline" style={{ flex: 1 }} onClick={() => setShowEditor(false)}>Cancel</button>
                <button type="submit" className="primary" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="header">
        <div>
          <div className="eyebrow">Product Intelligence</div>
          <h1>{product.name}</h1>
          <p className="subtitle">
            Master catalog identity and cross-location history
            {isCandidate && (
              <span style={{ marginLeft: '12px', padding: '2px 8px', background: 'var(--amber)', color: '#000', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                ⚠ CANDIDATE — Unverified External Data
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="outline" onClick={handleSync}>{isSyncing ? 'Syncing...' : 'Sync from ERP'}</button>
          <button className="primary" onClick={() => setShowEditor(true)}>Edit Master</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        
        {/* Left: Product Master */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="panel" style={{ alignSelf: 'start' }}>
            <div className="panel-head">
              <h2 className="panel-title">Master Identity</h2>
              <span style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--line)', borderRadius: '4px', color: isCandidate ? 'var(--amber)' : 'var(--dim)' }}>
                {isCandidate ? 'CANDIDATE' : 'VERIFIED'}
              </span>
            </div>

            {/* Product Image */}
            {product.image_url && (
              <div style={{ padding: '0 16px' }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid var(--line)', objectFit: 'cover', maxHeight: '200px' }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
                {product.image_source && (
                  <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--muted)' }}>
                    <span>Photo: </span>
                    {product.image_source_url
                      ? <a href={product.image_source_url} target="_blank" rel="noreferrer" style={{ color: 'var(--dim)', textDecoration: 'underline' }}>{product.image_source}</a>
                      : <span>{product.image_source}</span>
                    }
                    {product.image_license && <span> · {product.image_license}</span>}
                  </div>
                )}
              </div>
            )}

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
                  <div style={{ color: 'var(--text)' }}>{netQty || '—'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>Standard MRP</div>
                  <div style={{ color: 'var(--text)' }}>{mrp ? `₹${mrp}` : '—'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>Manufacturer Address</div>
                  <div style={{ color: 'var(--text)' }}>{mfgAddress || '—'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>Data Source</div>
                  <div style={{ color: 'var(--text)', fontFamily: 'monospace', fontSize: '12px' }}>{product.source || 'GENESIS_MASTER'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Inventory at Locations */}
          <div className="panel" style={{ alignSelf: 'start' }}>
            <div className="panel-head">
              <h2 className="panel-title">Physical Inventory</h2>
            </div>
            <div className="panel-body">
              {inventory.length === 0 ? (
                <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
                  No recorded inventory at any location.<br />
                  <span style={{ fontSize: '11px' }}>This product exists in the catalogue but no stock data has been filed.</span>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ textAlign: 'left', paddingBottom: '8px' }}>Location</th>
                      <th style={{ textAlign: 'right', paddingBottom: '8px' }}>Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((inv: any, i: number) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                        <td style={{ padding: '8px 0' }}>{inv.location_name || inv.location_id}</td>
                        <td style={{ textAlign: 'right', padding: '8px 0', fontFamily: 'monospace' }}>{inv.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right: History Timeline */}
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Cross-Location Inspection Timeline</h2>
          </div>
          <div className="panel-body" style={{ position: 'relative', paddingLeft: '32px' }}>
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
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Product registered in Genesis</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Source: {product.source || 'GENESIS_MASTER'}</div>
            </div>

            {history.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No inspections recorded for this product yet.</div>
            ) : history.map((insp: any, i: number) => (
              <div key={i} style={{ position: 'relative', marginBottom: '32px' }}>
                <div style={{ 
                  position: 'absolute', left: '-27px', top: '2px', 
                  width: '20px', height: '20px', borderRadius: '50%', 
                  background: 'var(--bg)', border: `1px solid ${insp.status === 'COMPLIANT' ? 'var(--line)' : 'var(--amber)'}`,
                  color: insp.status === 'COMPLIANT' ? 'var(--dim)' : 'var(--amber)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 600
                }}>{insp.status === 'COMPLIANT' ? '✓' : '!'}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{new Date(insp.created_at || insp.date).toLocaleString()}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                  {insp.status === 'COMPLIANT' ? 'Identity & Declaration Match' : insp.status === 'REVIEW_REQUIRED' ? 'Discrepancy Detected — Review Required' : insp.status || 'Inspection Recorded'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                  Location: {insp.location_id || 'Unknown'} · ID: <span className="mono">{insp.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
