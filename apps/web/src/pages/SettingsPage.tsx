import React from 'react';

export default function SettingsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-desc">Configuration for the Genesis Compliance Engine</p>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: '4px', fontWeight: 500, color: 'var(--text-primary)' }}>Inspection Engine</div>
          <div style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Organization</div>
          <div style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>AI & Vision</div>
          <div style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Integrations</div>
        </div>

        <div className="panel" style={{ alignSelf: 'start' }}>
          <div className="panel-header">
            <h2 className="panel-title">Inspection Engine Thresholds</h2>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Auto-Approve Threshold (%)
              </label>
              <input type="number" defaultValue={85} style={{ 
                background: 'var(--bg-base)', border: '1px solid var(--border-focus)', color: 'var(--text-primary)',
                padding: '10px 14px', borderRadius: '4px', width: '120px', fontSize: '14px' 
              }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Extractions strictly above this confidence level are marked COMPLIANT automatically.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Require Human Review Threshold (%)
              </label>
              <input type="number" defaultValue={60} style={{ 
                background: 'var(--bg-base)', border: '1px solid var(--border-focus)', color: 'var(--text-primary)',
                padding: '10px 14px', borderRadius: '4px', width: '120px', fontSize: '14px' 
              }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Extractions below this confidence level always trigger the NEEDS_REVIEW state.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-main)' }} />
                Halt on Contradiction
              </label>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', paddingLeft: '22px' }}>
                If OCR and Vision-Language Model pathways disagree, immediately halt for human review regardless of confidence scores.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
