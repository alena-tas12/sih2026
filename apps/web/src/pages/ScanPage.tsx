import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

import { useNavigate } from 'react-router-dom';

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startScan() {
    if (!videoRef.current) return;
    setLoading(true);
    // request permission first to provide clearer errors
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      // stop this temporary stream — decodeFromVideoDevice will open its own stream
      stream.getTracks().forEach((t) => t.stop());
    } catch (err: any) {
      setLoading(false);
      const name = err && err.name ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        alert('Camera permission denied. Please enable camera permissions for the app/browser.');
      } else {
        alert('Unable to access camera: ' + (err && err.message ? err.message : String(err)));
      }
      return;
    }

    // create reader
    readerRef.current = new BrowserMultiFormatReader();
    try {
      readerRef.current.decodeFromVideoDevice(undefined, videoRef.current, async (res: any, err: any) => {
        if (res) {
          const code = res.getText();
          setResult(code);
          stopScan();
          await handleFoundCode(code);
        }
      });
      setScanning(true);
    } catch (e) {
      console.error('startScan error', e);
      alert('Scanning failed: ' + (e && (e as any).message ? (e as any).message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleFoundCode(code: string) {
    // Try to look up product; if found, navigate to inspection flow
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(code)}`);
      if (res.ok) {
        navigate('/inspections?gtin=' + encodeURIComponent(code));
      } else {
        alert('Product not found in Master Database. Scanned code: ' + code);
      }
    } catch (e) {
      alert('Failed to connect to backend API. Scanned code: ' + code);
    }
  }

  function stopScan() {
    if (readerRef.current) {
      try {
        readerRef.current.reset();
      } catch (e) {
        // ignore
      }
      readerRef.current = null;
    }
    setScanning(false);
  }

  async function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const reader = new BrowserMultiFormatReader();
    try {
      const res = await reader.decodeFromImageUrl(url);
      if (res) {
        const code = res.getText();
        setResult(code);
        await handleFoundCode(code);
      } else {
        alert('No barcode found in the uploaded image.');
      }
    } catch (err) {
      console.warn('No barcode found in image');
      alert('No barcode found in the uploaded image.');
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Scan</h2>
      <div className="mt-3">
        <div>
          <video ref={videoRef} style={{ width: '100%', maxWidth: 480 }} />
        </div>
        <div className="mt-2">
          {!scanning ? (
            <button onClick={startScan} className="btn-primary" disabled={loading}>{loading ? 'Requesting camera…' : 'Start scan'}</button>
          ) : (
            <button onClick={stopScan} className="btn-secondary">Stop scan</button>
          )}
        </div>
        <div className="mt-4">
          <label className="block mb-2">Or upload an image with a barcode</label>
          <input type="file" accept="image/*" onChange={onImageFile} />
        </div>
        {result && (
          <div className="mt-4">
            <h3 className="font-medium">Result</h3>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
