import React, { useState, useRef } from 'react';
import CertificatePreview from './components/CertificatePreview';
import InputForm from './components/InputForm';
import MagicBar from './components/MagicBar';
import { CertificateData, CertificateTheme } from './types';
import { Printer, Download, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

const INITIAL_DATA: CertificateData = {
  companyName: "STE",
  recipientName: "Employee Name",
  title: "CERTIFICATE",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  issuerName: "Country Manager",
  issuerTitle: "Project Director",
  signatureText: "Sarah Connor",
  theme: CertificateTheme.SMART_WAVE,
  logoWidth: 139,
  logoTop: 4,
  logoLeft: 46,
  logoOpacity: 100,
  recipientFont: 'sans',
};

const App: React.FC = () => {
  const [data, setData] = useState<CertificateData>(INITIAL_DATA);
  const printRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Attempt to handle cross-origin images if any
        backgroundColor: '#ffffff',
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `certificate-${data.recipientName.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export image.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">CertiGen AI</span>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleDownloadPNG}
               disabled={isExporting}
               className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
             >
               {isExporting ? <span className="animate-spin">⌛</span> : <ImageIcon className="w-4 h-4" />}
               Download PNG
             </button>
             <button 
               onClick={handlePrint}
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
             >
               <Printer className="w-4 h-4" /> Print / PDF
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 no-print">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Controls */}
          <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6">
            <div>
               <h2 className="text-lg font-bold text-slate-800 mb-2">AI Magic Fill</h2>
               <p className="text-sm text-slate-500 mb-4">Type a description and let AI fill in the details for you.</p>
               <MagicBar currentData={data} onUpdate={setData} />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Certificate Details</h2>
              <InputForm data={data} onChange={setData} />
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 p-4 lg:p-12 flex flex-col items-center justify-start overflow-hidden relative">
             <div className="mb-4 flex items-center gap-2 text-slate-400 text-sm font-medium z-10">
               <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Preview
             </div>
             
             {/* 
               Preview Container:
               We scale this using CSS transform to fit in the UI.
               The base size is 1123px x 794px (A4 Landscape at ~96 DPI).
             */}
             <div className="relative shadow-2xl origin-top-left transform scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] 2xl:scale-100 transition-all duration-300">
               <CertificatePreview data={data} />
             </div>
          </div>
        </div>
      </main>

      {/* Print View - Hidden normally, shown when printing */}
      <div className="print-only hidden">
         <CertificatePreview ref={printRef} data={data} />
      </div>

      {/* Export View - Off-screen container for high-res PNG capture */}
      <div style={{ position: 'fixed', top: 0, left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <CertificatePreview ref={exportRef} data={data} />
      </div>

    </div>
  );
};

export default App;