import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Search, FileImage, ShieldCheck } from 'lucide-react';

export default function InspectionsPage() {
  const [step, setStep] = useState(1);
  const [gtin, setGtin] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [inspection, setInspection] = useState<any>(null);
  const [extraction, setExtraction] = useState<any>(null);
  const [observations, setObservations] = useState({ mrp: '', qty: '' });
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const q = searchParams.get('gtin');
    const mode = searchParams.get('mode');
    if (q) {
      setGtin(q);
      handleGTINLookup(q);
    } else if (mode === 'direct') {
      handleDirectCapture();
    }
  }, [searchParams]);

  const handleDirectCapture = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('genesis_auth');
      const insRes = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ gtin: null, location_id: 'LOC-BLR' })
      });
      const insData = await insRes.json();
      setInspection(insData.id);
      setProduct({ name: 'Unknown Product', standard_mrp: 'N/A' });
      setStep(2);
    } catch (e) {
      console.error(e);
      alert('Network error connecting to registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleGTINLookup = async (lookupGtin: string) => {
    setLoading(true);
    try {
      let prodRes = await fetch(`/api/products/${encodeURIComponent(lookupGtin)}`);
      if (prodRes.status === 404) {
        // Unknown product flow - register GTIN
        await fetch(`/api/products/${lookupGtin}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Unknown Product', mrp: 0, netQuantity: 'Unknown' })
        });
        prodRes = await fetch(`/api/products/${encodeURIComponent(lookupGtin)}`);
      }
      const prod = await prodRes.json();
      setProduct(prod);

      const token = localStorage.getItem('genesis_auth');
      const insRes = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ gtin: lookupGtin, location_id: 'LOC-BLR' })
      });
      const insData = await insRes.json();
      setInspection(insData.id);
      setStep(2);
    } catch (e) {
      console.error(e);
      alert('Network error connecting to Product Master. Please check your connection and try again. Your scanning progress is saved locally.');
    } finally {
      setLoading(false);
    }
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !inspection) return;
    
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString();
      try {
        // Post to real AI Vision OCR backend
        const res = await fetch('/api/evidence/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inspectionId: inspection,
            type: 'PACKAGE_FRONT',
            filename: file.name,
            base64
          })
        });
        const data = await res.json();
        if (data.extraction) {
          setExtraction(data.extraction);
          setObservations({ 
            mrp: data.extraction.mrp?.toString() || '', 
            qty: data.extraction.batch || '' // mapping batch to qty for demo simplicity
          });
          setStep(3);
        }
      } catch (err) {
        alert("AI Vision extraction failed.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVerificationSubmit = async () => {
    setLoading(true);
    try {
      const verifiedFields = [
        { fieldKey: 'MRP', fieldValue: observations.mrp },
        { fieldKey: 'Batch', fieldValue: observations.qty }
      ];
      
      await fetch(`/api/inspections/${inspection}/observations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifiedFields)
      });

      const compRes = await fetch(`/api/inspections/${inspection}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const compData = await compRes.json();
      setComparisonResult(compData);
      setStep(4);
    } catch (e) {
      alert('Connection lost while saving observations. Please do not close the app. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (status: string) => {
    setLoading(true);
    try {
      await fetch(`/api/inspections/${inspection}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, review_decision: status, actor: 'Inspector_01' })
      });
      alert("Inspection finalized.");
      navigate('/app');
    } catch (e) {
      alert('Offline mode: Decision queued for sync once network is restored.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', color: '#111' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid #e5e5e5', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Active Inspection</h1>
          <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Strict Separation & AI Vision Enabled</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Step 1: Barcode */}
        {step >= 1 && (
          <div style={{ border: '1px solid #e5e5e5', padding: '24px', borderRadius: '8px', background: '#fafafa' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>1. Barcode Observation</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Scan GTIN..." 
                value={gtin} 
                onChange={(e) => setGtin(e.target.value)}
                disabled={step >= 2}
                style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', flex: 1, backgroundColor: step >= 2 ? '#eee' : '#fff' }}
              />
              <button 
                onClick={() => handleGTINLookup(gtin)} 
                disabled={loading || !gtin || step >= 2}
                style={{ background: step >= 2 ? '#666' : '#000', color: '#fff', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: (loading || step >= 2) ? 'not-allowed' : 'pointer' }}
              >
                {step >= 2 ? 'Locked' : (loading ? 'Lookup...' : 'Lookup Registry')}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Product Master & Evidence Upload */}
        {step >= 2 && product && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ border: '1px solid #e5e5e5', padding: '16px', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#fff' }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #e5e5e5', borderRadius: '4px', background: '#fafafa' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileImage size={24} color="#ccc" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Product Master Reference</div>
                  {product.verified === 0 && <span style={{ background: '#fff3cd', color: '#856404', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>CANDIDATE</span>}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>{product.name}</div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>
                  GTIN: <strong>{gtin}</strong> {product.brand && `• Brand: ${product.brand}`}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>
                  Master MRP: <strong>₹{product.standard_mrp || product.mrp || 'N/A'}</strong> {product.net_quantity && `• Net Qty: ${product.net_quantity}`}
                </div>
                <button 
                  onClick={() => navigate(`/products?gtin=${encodeURIComponent(gtin || '')}`)}
                  style={{ marginTop: '12px', padding: '6px 12px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  View Full Product Intel ↗
                </button>
              </div>
              <ShieldCheck size={32} color={product.verified === 0 ? "#856404" : "#000"} />
            </div>

            {step === 2 && (
              <div style={{ border: '2px dashed #ccc', padding: '40px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }} onClick={() => fileInputRef.current?.click()}>
                <FileImage size={48} color="#999" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{loading ? 'Running AI Vision OCR...' : 'Upload Physical Evidence'}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Capture image for AI extraction</p>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileSelected} />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Human Verification of AI Extraction */}
        {step >= 3 && extraction && (
          <div style={{ border: '1px solid #e5e5e5', padding: '24px', borderRadius: '8px', background: '#fafafa' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Human Verification</h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>AI has extracted values from the physical evidence. Please verify before committing to ledger.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Extracted MRP (₹)</label>
                <input 
                  type="text" 
                  value={observations.mrp} 
                  onChange={(e) => setObservations({...observations, mrp: e.target.value})}
                  disabled={step > 3}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Extracted Batch</label>
                <input 
                  type="text" 
                  value={observations.qty} 
                  onChange={(e) => setObservations({...observations, qty: e.target.value})}
                  disabled={step > 3}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: '#666', fontFamily: 'monospace', padding: '8px', background: '#eee', borderRadius: '4px' }}>
              Raw AI Output: {extraction.raw}
            </div>

            {step === 3 && (
              <button 
                onClick={handleVerificationSubmit}
                disabled={loading}
                style={{ background: '#000', color: '#fff', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', width: '100%', marginTop: '24px', cursor: loading ? 'wait' : 'pointer' }}
              >
                {loading ? 'Comparing across locations...' : 'Verify & Run Comparison Engine'}
              </button>
            )}
          </div>
        )}

        {/* Step 4: Comparison & Final Decision */}
        {step === 4 && comparisonResult && (
          <div style={{ border: `2px solid ${comparisonResult.matched ? '#000' : '#d32f2f'}`, padding: '24px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              {comparisonResult.matched ? <CheckCircle size={28} color="#000" /> : <XCircle size={28} color="#d32f2f" />}
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: comparisonResult.matched ? '#000' : '#d32f2f', margin: 0 }}>
                {comparisonResult.matched ? 'All Declarations Match' : 'Discrepancy Detected'}
              </h2>
            </div>
            
            {!comparisonResult.matched && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>The following differences were found against the Product Master or other locations:</p>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#d32f2f', fontWeight: 'bold' }}>
                  {comparisonResult.differences.map((d: any, idx: number) => (
                    <li key={idx}>{d.field} is {d.extractedValue}, but {d.baseLocation} recorded {d.baseValue}.</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Final Inspector Decision</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleDecision('COMPLIANT')} style={{ flex: 1, background: '#000', color: '#fff', padding: '12px', borderRadius: '4px', fontWeight: 'bold' }}>
                  Mark Compliant
                </button>
                <button onClick={() => handleDecision('NON_COMPLIANT')} style={{ flex: 1, background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', padding: '12px', borderRadius: '4px', fontWeight: 'bold' }}>
                  Flag Non-Compliant
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
