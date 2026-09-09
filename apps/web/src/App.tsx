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

// Placeholder components for new pages
const CaseReviewPage = () => <div className="page-content">Case Review workspace</div>;
const InspectionsPage = () => <div className="page-content">Inspections step workflow</div>;
const EvidencePage = () => <div className="page-content">Evidence library grid</div>;
const AuditLogPage = () => <div className="page-content">Audit Log chronological table</div>;

export default function App() {
  return (
    <Router>
      <div className="app-shell">
        <Sidebar />
        <div className="main-wrapper">
          <Topbar />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inspections" element={<InspectionsPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/cases/:id" element={<CaseReviewPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/regulations" element={<RegulationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
