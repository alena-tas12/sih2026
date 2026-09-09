import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const path = location.pathname === '/' ? 'Overview' : 
               location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);

  return (
    <header className="topbar">
      <div className="crumb">Genesis <span style={{ margin: '0 8px', color: '#444' }}>/</span> <b>{path}</b></div>
      <div className="top-actions">
        <input className="search" placeholder="Search cases, rules, evidence…" />
        <button className="icon-btn">⌘</button>
        <button className="icon-btn">◔</button>
        <button className="primary" onClick={() => navigate('/inspections')}>New inspection</button>
      </div>
    </header>
  );
}
