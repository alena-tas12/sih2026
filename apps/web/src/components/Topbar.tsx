import React from 'react';

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <span>Genesis</span>
        <span>/</span>
        <span className="current">Workspace</span>
      </div>
      <div className="topbar-actions">
        <button className="command-palette-btn">
          Search cases, regulations, evidence... <kbd>⌘K</kbd>
        </button>
        <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '16px' }}>
          <span style={{ cursor: 'pointer' }}>🔔</span>
          <span style={{ cursor: 'pointer' }}>⚙</span>
        </div>
      </div>
    </header>
  );
}
