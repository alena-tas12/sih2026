import React from 'react';

export default function SettingsPage() {
  return (
    <section className="content">
      <div className="header">
        <div>
          <div className="eyebrow">System</div>
          <h1>Settings</h1>
          <p className="subtitle">Configuration for the Genesis Compliance Engine</p>
        </div>
        <button className="primary">Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '8px 12px', background: 'var(--panel2)', borderRadius: '7px', fontWeight: 500, color: 'var(--text)' }}>Inspection Engine</div>
          <div style={{ padding: '8px 12px', color: 'var(--muted)', cursor: 'pointer' }}>Organization Profile</div>
          <div style={{ padding: '8px 12px', color: 'var(--muted)', cursor: 'pointer' }}>AI & Vision Models</div>
          <div style={{ padding: '8px 12px', color: 'var(--muted)', cursor: 'pointer' }}>API Integrations</div>
        </div>

        <div className="panel" style={{ alignSelf: 'start' }}>
          <div className="panel-head">
            <h2 className="panel-title">Inspection Engine Thresholds</h2>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Auto-Approve Threshold (%)
              </label>
              <input type="number" defaultValue={85} style={{ 
                background: 'var(--bg)', border: '1px solid var(--line2)', color: 'var(--text)',
                padding: '10px 14px', borderRadius: '7px', width: '120px', fontSize: '14px', outline: 'none' 
              }} />
              <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px' }}>
                Extractions strictly above this confidence level are marked COMPLIANT automatically.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--line)' }} />

            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Require Human Review Threshold (%)
              </label>
              <input type="number" defaultValue={60} style={{ 
                background: 'var(--bg)', border: '1px solid var(--line2)', color: 'var(--text)',
                padding: '10px 14px', borderRadius: '7px', width: '120px', fontSize: '14px', outline: 'none' 
              }} />
              <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px' }}>
                Extractions below this confidence level always trigger the NEEDS_REVIEW state.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--line)' }} />

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text)' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                Halt on Contradiction
              </label>
              <p style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '6px', paddingLeft: '24px' }}>
                If OCR and Vision-Language Model pathways disagree, immediately halt for human review regardless of confidence scores.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
