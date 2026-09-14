import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon, CameraIcon, X } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    return () => { stopScan(); };
  }, []);

  async function startScan() {
    setLoading(true);
    
    if (isNative) {
      // Native ML Kit Barcode Scanner
      try {
        const { camera } = await BarcodeScanner.requestPermissions();
        if (camera !== 'granted' && camera !== 'limited') {
          alert('Camera permission denied.');
          setLoading(false);
          return;
        }

        // Hide web elements to show camera behind webview
        document.body.classList.add('barcode-scanner-active');
        setScanning(true);
        setLoading(false);

        const listener = await BarcodeScanner.addListener('barcodesScanned', async (result: any) => {
          if (result.barcodes && result.barcodes.length > 0) {
            const code = result.barcodes[0].displayValue;
            setResult(code);
            await stopScan();
            await handleFoundCode(code);
          }
        });

        await BarcodeScanner.startScan();
      } catch (e) {
        console.error('Native scan error', e);
        alert('Native scanning failed: ' + String(e));
        setScanning(false);
        setLoading(false);
      }
    } else {
      // Web Fallback with ZXing
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        stream.getTracks().forEach((t) => t.stop());
      } catch (err: any) {
        setLoading(false);
        alert('Camera permission denied. Please enable camera permissions.');
        return;
      }

      readerRef.current = new BrowserMultiFormatReader();
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        let selectedDeviceId = undefined;
        // Try to find the back/environment camera for mobile browsers
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment') ||
          device.label.toLowerCase().includes('rear')
        );
        
        if (backCamera) {
          selectedDeviceId = backCamera.deviceId;
        } else if (videoDevices.length > 0) {
          // Fallback to the last device which is often the back camera on mobile if not labeled
          selectedDeviceId = videoDevices[videoDevices.length - 1].deviceId;
        }

        readerRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, async (res: any, err: any) => {
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
        alert('Scanning failed.');
      } finally {
        setLoading(false);
      }
    }
  }

  async function stopScan() {
    if (isNative) {
      document.body.classList.remove('barcode-scanner-active');
      await BarcodeScanner.removeAllListeners();
      await BarcodeScanner.stopScan();
    } else {
      if (readerRef.current) {
        try { readerRef.current.reset(); } catch (e) {}
        readerRef.current = null;
      }
    }
    setScanning(false);
  }

  async function handleFoundCode(code: string) {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(code)}`);
      if (res.ok) {
        navigate('/inspections?gtin=' + encodeURIComponent(code));
      } else {
        alert('GTIN registered as unknown. Scanned code: ' + code);
        navigate('/inspections?gtin=' + encodeURIComponent(code));
      }
    } catch (e) {
      alert('Network error connecting to registry.');
    }
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
        alert('No barcode found in the uploaded image. Try again.');
      }
    } catch (err) {
      alert('No barcode found in the uploaded image.');
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const handleDirectEvidenceCapture = () => {
    navigate('/inspections?mode=direct');
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto text-gray-200 ${scanning && isNative ? 'opacity-0' : 'opacity-100'}`}>
      <h2 className="text-3xl font-extrabold text-white mb-8">Scan & Capture</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Live Barcode Scan */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <Camera size={32} className="text-black" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Live Barcode</h3>
          <p className="text-sm text-gray-400 mb-6 flex-grow">Scan a GTIN barcode directly using your device's camera to lookup the product master.</p>
          
          {!scanning ? (
            <button onClick={startScan} disabled={loading} className="w-full bg-white text-black py-2 rounded-md font-bold hover:bg-gray-200 transition-colors">
              {loading ? 'Starting...' : 'Start Camera'}
            </button>
          ) : (
            <button onClick={stopScan} className="w-full bg-red-600 text-white py-2 rounded-md font-bold hover:bg-red-700 transition-colors flex items-center justify-center">
              <X size={18} className="mr-2" /> Stop Camera
            </button>
          )}
        </div>

        {/* Card 2: Upload Barcode Image */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <ImageIcon size={32} className="text-black" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Upload Barcode</h3>
          <p className="text-sm text-gray-400 mb-6 flex-grow">Upload a picture of a barcode from your gallery to extract the GTIN.</p>
          
          <label className="w-full bg-white text-black py-2 rounded-md font-bold hover:bg-gray-200 transition-colors cursor-pointer block">
            Choose Image
            <input type="file" accept="image/*" className="hidden" onChange={onImageFile} />
          </label>
        </div>

        {/* Card 3: Direct Evidence Photo */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <CameraIcon size={32} className="text-black" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Photo Capture Only</h3>
          <p className="text-sm text-gray-400 mb-6 flex-grow">Skip barcode lookup entirely. Just snap a photo of the product for AI compliance extraction.</p>
          
          <button onClick={handleDirectEvidenceCapture} className="w-full bg-neutral-700 text-white py-2 rounded-md font-bold hover:bg-neutral-600 transition-colors">
            Start Direct Capture
          </button>
        </div>
      </div>

      {/* Video Preview Container (Web Fallback Only) */}
      {!isNative && (
        <div className={`mt-8 ${scanning ? 'block' : 'hidden'} flex flex-col items-center`}>
          <div className="relative border-4 border-white rounded-xl overflow-hidden w-full max-w-md shadow-2xl">
            <video ref={videoRef} className="w-full h-auto bg-black" />
            <div className="absolute inset-0 border-2 border-dashed border-red-500 m-8 pointer-events-none opacity-50"></div>
          </div>
          <p className="mt-4 text-gray-400 animate-pulse">Position barcode within the frame</p>
          <button 
            onClick={() => { stopScan(); handleFoundCode('717271883927'); }}
            className="mt-4 text-xs text-neutral-500 underline hover:text-white"
          >
            Having trouble focusing? Click to simulate successful scan
          </button>
        </div>
      )}

      {result && (
        <div className="mt-8 bg-neutral-900 p-4 rounded-md border border-neutral-800">
          <h3 className="font-bold text-white">Last Scanned GTIN:</h3>
          <p className="text-xl text-green-400 font-mono mt-1">{result}</p>
        </div>
      )}
    </div>
  );
}
