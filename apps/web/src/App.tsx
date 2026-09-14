import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import RegulationsPage from './pages/RegulationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import EvidencePage from './pages/EvidencePage';
import AuditLogPage from './pages/AuditLogPage';
import InspectionsPage from './pages/InspectionsPage';
import CaseReviewPage from './pages/CaseReviewPage';
import ProductsPage from './pages/ProductsPage';
import ScanPage from './pages/ScanPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import './App.css';

// Layout for the authenticated app
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Topbar />
        {children}
      </main>
    </div>
  );
}

// Protected Route wrapper
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem('genesis_auth') != null;
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* App Routes - Protected */}
        <Route path="/app" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/inspections" element={<RequireAuth><InspectionsPage /></RequireAuth>} />
        <Route path="/products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
        <Route path="/scan" element={<RequireAuth><ScanPage /></RequireAuth>} />
        <Route path="/cases" element={<RequireAuth><CasesPage /></RequireAuth>} />
        <Route path="/cases/:id" element={<RequireAuth><CaseReviewPage /></RequireAuth>} />
        <Route path="/evidence" element={<RequireAuth><EvidencePage /></RequireAuth>} />
        <Route path="/regulations" element={<RequireAuth><RegulationsPage /></RequireAuth>} />
        <Route path="/analytics" element={<RequireAuth><AnalyticsPage /></RequireAuth>} />
        <Route path="/audit" element={<RequireAuth><AuditLogPage /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
      </Routes>
    </Router>
  );
}
