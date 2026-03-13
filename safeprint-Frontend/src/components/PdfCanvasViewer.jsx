import React, { useEffect, useRef, useState } from 'react';

const PdfCanvasViewer = ({ url }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load PDF.js from CDN if not already loaded
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
          script.async = true;
          document.body.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load PDF.js'));
          });
        }

        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

        // Fetch PDF and render
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        
        if (!isMounted) return;

        const page = await pdf.getPage(1); // Render first page
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error('PDF Render Error:', err);
        if (isMounted) {
          setError('Failed to render preview.');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-800 rounded-lg overflow-auto no-scrollbar py-4"
         onContextMenu={(e) => e.preventDefault()} // Disable right-click
    >
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Rendering secure preview...</p>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {/* The Canvas */}
      <canvas 
        ref={canvasRef} 
        className={`shadow-2xl max-w-full ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
        style={{ pointerEvents: 'none' }} // Prevent interaction with canvas
      />

      {/* Security Overlay - Prevents touch-hold/drag on mobile */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ 
            userSelect: 'none', 
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none' 
        }} 
      />
    </div>
  );
};

export default PdfCanvasViewer;
