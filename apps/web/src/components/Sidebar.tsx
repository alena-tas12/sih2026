import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark">G</div>
        <div>
          <strong>Genesis Compliance</strong>
          <small>OPEN SOURCE · v1.2.0</small>
        </div>
      </div>
      <div className="workspace">
        <span>Workspace</span>
        Genesis Operations
      </div>
      <nav className="nav">
        <div className="nav-label">Workspace</div>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <span className="ico">⌂</span>Overview
        </NavLink>
        <NavLink to="/inspections" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="ico">◈</span>Inspections
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="ico">📦</span>Product Intel
        </NavLink>
        <NavLink to="/cases" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="ico">▤</span>Cases
        </NavLink>
        <NavLink to="/evidence" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="ico">▧</span>Evidence Library
        </NavLink>
        
        <div className="nav-label" style={{ marginTop: '22px' }}>System</div>
        <NavLink to="/regulations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="ico">§</span>Regulations
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="ico">⌁</span>Analytics
        </NavLink>
        <NavLink to="/audit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="ico">◷</span>Audit Log
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="ico">⚙</span>Settings
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <a className="oss" href="https://github.com/alena-tas12/sih2026" target="_blank" rel="noreferrer">
          <span>◉</span> GitHub Repository ↗
        </a>
        <a className="oss" href="#">
          <span>?</span> Documentation
        </a>
        <div className="user">
          <div className="avatar">AB</div>
          <div>
            Alena B
            <small>Inspector · Online</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
