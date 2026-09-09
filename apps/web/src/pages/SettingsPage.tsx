import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('engine');
  
  const [autoApprove, setAutoApprove] = useState(85);
  const [humanReview, setHumanReview] = useState(60);
  const [haltContradiction, setHaltContradiction] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.autoApprove !== undefined) setAutoApprove(data.autoApprove);
        if (data.humanReview !== undefined) setHumanReview(data.humanReview);
        if (data.haltContradiction !== undefined) setHaltContradiction(data.haltContradiction);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoApprove, humanReview, haltContradiction })
      });
      alert(`Settings successfully saved!`);
    } catch (e) {
      alert('Failed to save settings to database.');
    }
  };

  if (loading) return <div className="content" style={{ color: 'var(--dim)' }}>Loading settings from DB...</div>;

  const getTabStyle = (tab: string) => ({
    padding: '8px 12px',
    borderRadius: '7px',
    cursor: 'pointer',
    background: activeTab === tab ? 'var(--panel2)' : 'transparent',
    fontWeight: activeTab === tab ? 500 : 400,
    color: activeTab === tab ? 'var(--text)' : 'var(--muted)',
  });

  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">System</div>
          <h1>Settings</h1>
          <p className="subtitle">Configuration for the Genesis Compliance Engine</p>
        </div>
        <button className="primary" onClick={handleSave}>Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={getTabStyle('engine')} onClick={() => setActiveTab('engine')}>Inspection Engine</div>
          <div style={getTabStyle('org')} onClick={() => setActiveTab('org')}>Organization Profile</div>
          <div style={getTabStyle('models')} onClick={() => setActiveTab('models')}>AI & Vision Models</div>
          <div style={getTabStyle('api')} onClick={() => setActiveTab('api')}>API Integrations</div>
        </div>

        <div className="panel" style={{ alignSelf: 'start' }}>
          {activeTab === 'engine' && (
            <>
              <div className="panel-head">
                <h2 className="panel-title">Inspection Engine Thresholds</h2>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                    Auto-Approve Threshold (%)
                  </label>
                  <input 
                    type="number" 
                    value={autoApprove}
                    onChange={e => setAutoApprove(Number(e.target.value))}
                    style={{ background: 'var(--bg)', border: '1px solid var(--line2)', color: 'var(--text)', padding: '10px 14px', borderRadius: '7px', width: '120px', fontSize: '14px', outline: 'none' }} 
                  />
                  <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px' }}>Extractions strictly above this confidence level are marked COMPLIANT automatically.</p>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--line)' }} />
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                    Require Human Review Threshold (%)
                  </label>
                  <input 
                    type="number" 
                    value={humanReview}
                    onChange={e => setHumanReview(Number(e.target.value))}
                    style={{ background: 'var(--bg)', border: '1px solid var(--line2)', color: 'var(--text)', padding: '10px 14px', borderRadius: '7px', width: '120px', fontSize: '14px', outline: 'none' }} 
                  />
                  <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px' }}>Extractions below this confidence level always trigger the NEEDS_REVIEW state.</p>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--line)' }} />
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text)' }}>
                    <input 
                      type="checkbox" 
                      checked={haltContradiction}
                      onChange={e => setHaltContradiction(e.target.checked)}
                      style={{ accentColor: 'var(--text)', width: '16px', height: '16px' }} 
                    />
                    Halt on Contradiction
                  </label>
                  <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px', paddingLeft: '24px' }}>
                    If OCR and Vision-Language Model pathways disagree, immediately halt for human review regardless of confidence scores.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'org' && (
            <>
              <div className="panel-head">
                <h2 className="panel-title">Organization Profile</h2>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Workspace Name</label>
                  <input type="text" className="search" style={{ width: '100%', maxWidth: '400px' }} defaultValue="Genesis Operations" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Legal Metrology Node ID</label>
                  <input type="text" className="search" style={{ width: '100%', maxWidth: '400px' }} defaultValue="NODE-IND-TN-04" disabled />
                  <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px' }}>Immutable identifier registered with the central grid.</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Regional Jurisdiction</label>
                  <select style={{ width: '100%', maxWidth: '400px', height: '36px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--line2)', borderRadius: '7px', padding: '0 12px' }}>
                    <option>Tamil Nadu</option>
                    <option>Karnataka</option>
                    <option>Maharashtra</option>
                    <option>Delhi NCR</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'models' && (
            <>
              <div className="panel-head">
                <h2 className="panel-title">AI & Vision Models</h2>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Primary OCR Engine</label>
                  <select style={{ width: '100%', maxWidth: '400px', height: '36px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--line2)', borderRadius: '7px', padding: '0 12px' }}>
                    <option>PaddleOCR v4 (Default)</option>
                    <option>Tesseract 5</option>
                    <option>Google Cloud Vision</option>
                  </select>
                  <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px' }}>Used for bounding box text extraction.</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Secondary OCR-Free Vision Model</label>
                  <select style={{ width: '100%', maxWidth: '400px', height: '36px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--line2)', borderRadius: '7px', padding: '0 12px' }}>
                    <option>Donut VLM (Default)</option>
                    <option>Qwen-VL</option>
                    <option>LLaVA</option>
                  </select>
                  <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px' }}>Used for layout-agnostic JSON structured extraction.</p>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text)' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--text)', width: '16px', height: '16px' }} />
                    Enable Active Learning Telemetry
                  </label>
                  <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px', paddingLeft: '24px' }}>
                    Automatically push human-overridden cases to the dataset queue for future model fine-tuning.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'api' && (
            <>
              <div className="panel-head">
                <h2 className="panel-title">API Integrations</h2>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Central Master Database URL</label>
                  <input type="text" className="search" style={{ width: '100%', maxWidth: '400px' }} defaultValue="https://master.lm-grid.gov.in/api/v1/sync" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Cross-Location Verification Endpoint</label>
                  <input type="text" className="search" style={{ width: '100%', maxWidth: '400px' }} defaultValue="https://nodes.genesis-network.local/verify" />
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--line)' }} />
                <div>
                  <h3 style={{ fontSize: '14px', margin: '0 0 12px 0' }}>Generate Access Token</h3>
                  <p style={{ fontSize: '12px', color: 'var(--dim)', marginBottom: '12px' }}>Create an API token to allow external ERP systems to push Product Master data to this node.</p>
                  <button className="outline">Generate New Token</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
