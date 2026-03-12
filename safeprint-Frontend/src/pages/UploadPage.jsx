import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';


const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Uploading...');
      const res = await axios.post('http://localhost:5000/upload', formData);
      setCode(res.data.code);
      setDownloadUrl(`http://localhost:5000/download/${res.data.code}`);
      setStatus('✅ File uploaded successfully.');
    } catch (err) {
      console.error(err);
      setStatus('❌ Something went wrong during upload.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-purple-700">SafePrint - Upload File</h1>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Upload & Generate Code
        </button>

        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}

        {code && (
          <div className="mt-6">
            <p className="font-medium text-gray-800">🔐 Your Unique Code:</p>
            <div className="text-lg font-bold text-purple-700 mt-1 mb-3">{code}</div>
            <QRCodeCanvas value={downloadUrl} size={180} />

            <p className="text-xs text-gray-400 mt-2">Scan QR to print file</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
