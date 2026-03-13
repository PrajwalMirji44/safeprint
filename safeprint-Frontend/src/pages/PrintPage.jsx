import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import { Printer, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';
import PdfCanvasViewer from '../components/PdfCanvasViewer';

const PrintPage = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printResult, setPrintResult] = useState(null); // null | 'success' | 'error'
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewContentType, setPreviewContentType] = useState('');

  const handleFetchPreview = async () => {
    if (!code.trim()) {
      setStatus('Please enter a code.');
      return;
    }

    try {
      setStatus('Fetching preview...');
      setPrintResult(null);
      // Verify code exists first
      const response = await axios.get(`${API_BASE_URL}/download/${code}`);
      
      setPreviewUrl(`${API_BASE_URL}/download/${code}`);
      setPreviewContentType(response.headers['content-type'] || 'application/pdf');
      setStatus('✅ Preview loaded. Ready to print.');
    } catch (error) {
      console.error(error);
      setStatus('❌ Invalid code or file has been deleted.');
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      setPrintResult(null);
      setStatus('Sending to printer...');
      await axios.post(`${API_BASE_URL}/print/${code}`);
      setStatus('✅ Document sent to printer & deleted from server.');
      setPrintResult('success');
      setPreviewUrl('');
      setCode('');
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to print. Please try again.';
      setStatus(`❌ ${msg}`);
      setPrintResult('error');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleScan = (result, error) => {
    if (!!result) {
      const scannedText = result?.text || '';
      const extractedCode = scannedText.split('/').pop();
      setCode(extractedCode);
      setStatus('');
      setPrintResult(null);
      setShowScanner(false);
      // Auto-fetch preview on scan
      setTimeout(() => handleFetchPreview(), 100);
    }
    if (!!error) console.warn(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-indigo-300 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-2 text-indigo-700">Print Section</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter or scan the unique code to securely print the file.
        </p>

        {!previewUrl ? (
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter unique code"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center text-xl font-mono uppercase"
              value={code}
              onChange={(e) => { setCode(e.target.value); setPrintResult(null); setStatus(''); }}
            />

            {status && (
              <div className={`mb-4 flex items-center justify-center gap-2 text-sm p-3 rounded-lg ${
                printResult === 'error' ? 'bg-red-100 text-red-700' : 'bg-indigo-50 text-indigo-700'
              }`}>
                {status}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleFetchPreview}
                disabled={!code || isPrinting}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300"
              >
                View Document Preview
              </button>

              <button
                onClick={() => setShowScanner(!showScanner)}
                className="w-full bg-gray-200 text-indigo-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                {showScanner ? 'Close Scanner' : 'Scan QR Code'}
              </button>
            </div>

            {showScanner && (
              <div className="mt-4 border-2 border-indigo-100 rounded-lg overflow-hidden">
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={handleScan}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className={`w-full flex items-center justify-center gap-2 text-sm p-3 rounded-lg ${
              printResult === 'success' ? 'bg-green-100 text-green-700' :
              printResult === 'error'   ? 'bg-red-100 text-red-700' :
              'bg-indigo-50 text-indigo-700'
            }`}>
              {isPrinting && <Loader2 className="w-4 h-4 animate-spin" />}
              {status}
            </div>

            <div className="w-full h-[600px] bg-gray-100 rounded-xl overflow-hidden border-4 border-indigo-200 shadow-inner relative">
              {previewContentType.includes('image') ? (
                <img src={previewUrl} alt="Secure Preview" className="w-full h-full object-contain" />
              ) : (
                <PdfCanvasViewer url={previewUrl} />
              )}
            </div>

            <div className="w-full flex flex-col gap-3 max-w-md">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                {isPrinting
                  ? <><Loader2 className="w-6 h-6 animate-spin" /> Printing...</>
                  : <><Printer className="w-6 h-6" /> Print Document Now</>}
              </button>
              
              <button
                onClick={() => { setPreviewUrl(''); setStatus(''); }}
                className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-8">
          🔒 For your security, the document is permanently deleted from our servers immediately after printing.
        </p>
      </div>
    </div>
  );
};

export default PrintPage;
