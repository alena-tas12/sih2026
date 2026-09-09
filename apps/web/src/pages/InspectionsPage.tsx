import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InspectionsPage() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'scanner'>('scanner');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const startScannerSequence = () => {
    setIsScanning(true);
    setLogs([]);
    
    // Simulating WebSocket Data Stream from Hardware/Camera
    setTimeout(() => addLog('🔌 Connecting to wss://genesis-worker.local:8080/stream...'), 500);
    setTimeout(() => addLog('🟢 WebSocket Connected. Initializing camera hardware...'), 1200);
    setTimeout(() => addLog('📷 Camera active. Waiting for barcode detection...'), 2000);
    
    setTimeout(() => {
      addLog('⚡ [BARCODE DETECTED] Format: EAN-13, Value: 8901030985223');
    }, 4500);
    
    setTimeout(() => {
      addLog('🗄️ [DATASET LOOKUP] Matched Product: Sunfeast Dark Fantasy (75g)');
      addLog('🧠 [VISION] Auto-capturing high-res frame for OCR extraction...');
    }, 5500);
    
    setTimeout(() => {
      addLog('📝 [OCR WORKER] Extracted Field: "Net Quantity: 75 g" (Conf: 98%)');
      addLog('📝 [OCR WORKER] Extracted Field: "MRP: Rs. 35.00" (Conf: 95%)');
      addLog('📝 [OCR WORKER] Extracted Field: "Mfg by: ITC Limited..." (Conf: 62%)');
    }, 7500);
    
    setTimeout(() => {
      addLog('⚖️ [RULE ENGINE] Evaluating evidence against PC Rules 2011...');
    }, 9000);
    
    setTimeout(() => {
      addLog('⚠️ [RESULT] Mfg Address confidence below threshold. Halting for Human Review.');
      addLog('📦 Creating CASE-2026-0105. Redirecting to workspace...');
    }, 10500);

    setTimeout(() => {
      navigate('/cases/CASE-2026-0105');
    }, 12500);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Inspection</h1>
          <p className="page-desc">Upload a package image or use the live barcode/OCR scanner.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('upload')}
        >
          Image Upload
        </button>
        <button 
          className={`btn ${activeTab === 'scanner' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('scanner')}
        >
          Live Hardware Scanner
        </button>
      </div>

      {activeTab === 'scanner' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Left: Camera Viewport */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Scanner Viewport</h2>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              <div style={{ 
                width: '100%', 
                aspectRatio: '4/3', 
                background: '#000', 
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!isScanning ? (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                    <div>Camera Offline</div>
                  </div>
                ) : (
                  <>
                    {/* Simulated Camera Feed / Scanner line */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '10%', bottom: '10%', left: '10%', right: '10%', 
                      border: '2px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '8px'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      width: '80%',
                      height: '2px',
                      background: 'var(--success-text)',
                      boxShadow: '0 0 8px var(--success-text)',
                      animation: 'scan 2s infinite linear'
                    }}></div>
                    <style>{`
                      @keyframes scan {
                        0% { top: 10%; }
                        50% { top: 90%; }
                        100% { top: 10%; }
                      }
                    `}</style>
                    <span style={{ position: 'absolute', bottom: '12px', left: '12px', color: '#fff', fontSize: '11px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
                      ● REC | 1080p | 30fps
                    </span>
                  </>
                )}
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '20px', padding: '12px' }}
                onClick={startScannerSequence}
                disabled={isScanning}
              >
                {isScanning ? 'Scanning in progress...' : 'Initialize Live Scanner'}
              </button>
            </div>
          </div>

          {/* Right: WebSocket Terminal */}
          <div className="panel">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="panel-title">WebSocket Data Stream</h2>
              <span className="badge" style={{ background: isScanning ? 'var(--success-bg)' : 'var(--bg-elevated)', color: isScanning ? 'var(--success-text)' : 'var(--text-muted)' }}>
                {isScanning ? '● CONNECTED' : '○ DISCONNECTED'}
              </span>
            </div>
            <div className="panel-body" style={{ 
              background: '#000', 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              color: '#10b981', 
              height: '380px', 
              overflowY: 'auto',
              border: 'none',
              padding: '16px'
            }}>
              {logs.length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>Waiting for connection...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} style={{ marginBottom: '8px', color: log.includes('RESULT') || log.includes('BARCODE') ? '#fff' : log.includes('ERROR') || log.includes('⚠️') ? 'var(--warning-text)' : '#10b981' }}>
                    {log}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="panel">
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Upload Package Images</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Drag and drop PNG, JPG, or PDF files here, or click to browse.</p>
            <button className="btn btn-primary">Select Files</button>
          </div>
        </div>
      )}
    </div>
  );
}
