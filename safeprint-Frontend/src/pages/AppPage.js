import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AppPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // IMPORTANT: Replace with your actual backend URL if different
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Upload failed. Please try again.');
      }

      const result = await response.json();
      navigate(`/print/${result.code}`);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Upload File for Secure Printing
        </h1>
        <div className="flex flex-col items-center">
          <label
            htmlFor="file-upload"
            className="w-full cursor-pointer bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 text-center transition-colors"
          >
            {file ? file.name : 'Choose a file'}
          </label>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-4 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Get Print Link'}
          </button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default AppPage;