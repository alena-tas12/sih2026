import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-mark">G</div>
        <div className="workspace-select">
          Genesis Compliance
          <span className="version">v1.2.0-OSS</span>
        </div>
      </div>
      
      <div className="nav-group">
        <div className="nav-label">Workspace</div>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          ◱ Overview
        </NavLink>
        <NavLink to="/inspections" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          ◎ Inspections
        </NavLink>
        <NavLink to="/cases" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          ☰ Cases
        </NavLink>
        <NavLink to="/evidence" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          ▤ Evidence Library
        </NavLink>
      </div>

      <div className="nav-group">
        <div className="nav-label">System</div>
        <NavLink to="/regulations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          § Regulations
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          📈 Analytics
        </NavLink>
        <NavLink to="/audit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          ⌚ Audit Log
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          ⚙ Settings
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <a href="https://github.com/genesis/compliance" className="footer-link">
          <span></span> GitHub Repository
        </a>
        <a href="#" className="footer-link">
          <span>📖</span> Documentation
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', marginTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>AB</div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>alena@genesis.io</span>
        </div>
      </div>
    </aside>
  );
}
