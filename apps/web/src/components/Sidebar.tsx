import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileCheck, ScanLine, PackageSearch, Briefcase, FileImage, FileText, BarChart3, Activity, Settings, Globe, HelpCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('genesis_auth');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark">G</div>
        <div>
          <strong>Genesis Compliance</strong>
          <small>OPEN SOURCE v1.2.0</small>
        </div>
      </div>
      <div className="workspace">
        <span>Workspace</span>
        Genesis Operations
      </div>
      <nav className="nav">
        <div className="nav-label">Workspace</div>
        <NavLink to="/app" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={18} className="mr-2 opacity-70" />Overview
        </NavLink>
        <NavLink to="/inspections" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileCheck size={18} className="mr-2 opacity-70" />Inspections
        </NavLink>
        <NavLink to="/scan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ScanLine size={18} className="mr-2 opacity-70" />Scan
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PackageSearch size={18} className="mr-2 opacity-70" />Product Intel
        </NavLink>
        <NavLink to="/cases" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Briefcase size={18} className="mr-2 opacity-70" />Cases
        </NavLink>
        <NavLink to="/evidence" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileImage size={18} className="mr-2 opacity-70" />Evidence Library
        </NavLink>
        
        <div className="nav-label" style={{ marginTop: '22px' }}>System</div>
        <NavLink to="/regulations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={18} className="mr-2 opacity-70" />Regulations
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart3 size={18} className="mr-2 opacity-70" />Analytics
        </NavLink>
        <NavLink to="/audit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={18} className="mr-2 opacity-70" />Audit Log
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={18} className="mr-2 opacity-70" />Settings
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <a className="oss" href="https://github.com/alena-tas12/sih2026" target="_blank" rel="noreferrer">
          <Globe size={16} className="mr-2" /> GitHub Repository
        </a>
        <a className="oss" href="#">
          <HelpCircle size={16} className="mr-2" /> Documentation
        </a>
        <div className="user flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">AB</div>
            <div>
              Alena B
              <small>Inspector Online</small>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
