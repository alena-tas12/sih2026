import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import RegulationsPage from './pages/RegulationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

import EvidencePage from './pages/EvidencePage';
import AuditLogPage from './pages/AuditLogPage';
import InspectionsPage from './pages/InspectionsPage';
import CaseReviewPage from './pages/CaseReviewPage';
import ProductsPage from './pages/ProductsPage';
import ScanPage from './pages/ScanPage';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Topbar />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inspections" element={<InspectionsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/cases/:id" element={<CaseReviewPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/regulations" element={<RegulationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
