import React, { forwardRef } from 'react';
import { CertificateData, CertificateTheme } from '../types';
import { Award, Medal, Star } from 'lucide-react';

interface Props {
  data: CertificateData;
}

const CertificatePreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  
  // Helper to determine recipient font class and size adjustment
  const getRecipientStyle = () => {
    const font = data.recipientFont || 'sans';
    switch (font) {
      case 'script':
        return { className: 'font-script', sizeClass: 'text-8xl' };
      case 'serif':
        return { className: 'font-serif', sizeClass: 'text-7xl' };
      case 'display':
        return { className: 'font-display', sizeClass: 'text-6xl tracking-widest' };
      case 'sans':
      default:
        return { className: 'font-sans font-bold', sizeClass: 'text-7xl tracking-tight' };
    }
  };

  const recipientStyle = getRecipientStyle();

  // Classic Theme Component
  const ClassicTheme = () => (
    <div className="w-full h-full bg-white relative p-8 flex flex-col items-center justify-between border-[20px] border-double border-gold-600 shadow-2xl overflow-hidden text-center text-slate-800">
      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-gold-600 rounded-tl-3xl opacity-50"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-gold-600 rounded-tr-3xl opacity-50"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-gold-600 rounded-bl-3xl opacity-50"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-gold-600 rounded-br-3xl opacity-50"></div>

      {/* Header */}
      <div className="mt-8 z-10 w-full">
        {data.companyName && (
          <div className="font-display font-bold text-lg text-slate-500 tracking-widest uppercase mb-4">
            {data.companyName}
          </div>
        )}
        <Award className="w-16 h-16 text-gold-600 mx-auto mb-4" />
        <h1 className="font-display text-5xl uppercase tracking-widest text-slate-900 font-bold">{data.title}</h1>
        <p className="font-serif italic text-xl mt-4 text-slate-600">This certificate is proudly presented to</p>
      </div>

      {/* Recipient */}
      <div className="z-10 w-full py-4">
        <h2 className={`${recipientStyle.className} ${recipientStyle.sizeClass} text-gold-700 px-4 py-2 border-b-2 border-slate-100 inline-block min-w-[50%]`}>
          {data.recipientName || "Recipient Name"}
        </h2>
      </div>

      {/* Description */}
      <div className="max-w-3xl z-10">
        <p className="font-serif text-lg leading-relaxed text-slate-700">
          {data.description || "For outstanding performance and dedication."}
        </p>
      </div>

      {/* Footer */}
      <div className="w-full flex justify-around items-end mt-12 mb-8 z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-48 border-b-2 border-slate-800 mb-2"></div>
          <p className="font-display font-bold text-sm uppercase">{data.date}</p>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Date</p>
        </div>

        {/* Seal */}
        <div className="relative group">
          <div className="w-32 h-32 bg-gold-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-gold-300 ring-4 ring-gold-600 ring-opacity-50">
            <Medal className="w-16 h-16 drop-shadow-md" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
           <div className="w-48 border-b-2 border-slate-800 mb-2 font-script text-3xl text-center pb-1">
             {data.signatureText || "Signature"}
           </div>
          <p className="font-display font-bold text-sm uppercase">{data.issuerName}</p>
          <p className="text-xs text-slate-500 uppercase tracking-widest">{data.issuerTitle}</p>
        </div>
      </div>
      
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
         <Award className="w-96 h-96" />
      </div>
    </div>
  );

  // Modern Theme Component
  const ModernTheme = () => (
    <div className="w-full h-full bg-slate-900 relative p-0 flex flex-row overflow-hidden text-white">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gold-500 h-full flex flex-col justify-center items-center p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
        <div className="z-10 text-center border-4 border-white p-8 w-full">
           <Star className="w-20 h-20 text-white mx-auto mb-6" />
           {data.companyName && (
             <div className="font-sans font-bold text-xl uppercase tracking-widest mb-6 border-b border-white/50 pb-4">
               {data.companyName}
             </div>
           )}
           <h1 className="font-sans font-black text-4xl uppercase tracking-tighter leading-none">
             Certificate<br/>of<br/>Excellence
           </h1>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 h-full p-12 flex flex-col justify-center relative bg-slate-50 text-slate-900">
         <div className="flex-1 flex flex-col justify-center">
            <h3 className="uppercase tracking-[0.2em] text-gold-600 font-bold text-sm mb-4">Presented To</h3>
            <h2 className={`${recipientStyle.className} ${recipientStyle.sizeClass} text-slate-900 mb-6`}>{data.recipientName || "Recipient Name"}</h2>
            
            <h3 className="uppercase tracking-[0.2em] text-gold-600 font-bold text-sm mb-4">For</h3>
            <h1 className="font-serif text-3xl text-slate-800 font-bold mb-4">{data.title}</h1>
            <p className="text-slate-600 leading-relaxed max-w-md">{data.description}</p>
         </div>

         <div className="flex justify-between items-end border-t border-slate-200 pt-8">
            <div>
              <p className="text-slate-900 font-bold">{data.date}</p>
              <p className="text-xs text-slate-500 uppercase">Date</p>
            </div>
            <div className="text-right">
              <div className="font-script text-2xl text-slate-800">{data.signatureText}</div>
              <p className="text-slate-900 font-bold">{data.issuerName}</p>
              <p className="text-xs text-slate-500 uppercase">{data.issuerTitle}</p>
            </div>
         </div>
      </div>
    </div>
  );

  // Minimal Theme Component
  const MinimalTheme = () => (
    <div className="w-full h-full bg-white relative p-16 flex flex-col justify-center items-start text-left border border-slate-200">
      <div className="w-full border-b-4 border-black mb-12 pb-4 flex justify-between items-end">
        <div>
           {data.companyName && (
              <p className="font-sans font-bold text-sm uppercase tracking-widest text-slate-500 mb-2">{data.companyName}</p>
           )}
           <h1 className="font-sans font-bold text-5xl tracking-tight text-black">{data.title}</h1>
        </div>
        <Award className="w-12 h-12 text-black" />
      </div>

      <div className="mb-12">
        <p className="font-sans text-slate-500 text-lg mb-2">Presented to</p>
        <h2 className={`${recipientStyle.className} ${recipientStyle.sizeClass} text-black font-light`}>{data.recipientName || "Recipient Name"}</h2>
      </div>

      <div className="mb-16 max-w-2xl">
        <p className="font-sans text-xl leading-relaxed text-slate-800">
          {data.description}
        </p>
      </div>

      <div className="flex gap-16 mt-auto">
        <div>
          <div className="h-12 flex items-end font-script text-2xl border-b border-slate-300 min-w-[200px] mb-2">{data.signatureText}</div>
          <p className="font-sans font-bold text-sm">{data.issuerName}</p>
          <p className="font-sans text-xs text-slate-500">{data.issuerTitle}</p>
        </div>
        <div>
          <div className="h-12 flex items-end border-b border-slate-300 min-w-[150px] mb-2">{data.date}</div>
          <p className="font-sans font-bold text-sm">Date</p>
        </div>
      </div>
    </div>
  );

  // Smart Wave Theme Component
  const SmartWaveTheme = () => (
    <div className="w-full h-full bg-white relative flex overflow-hidden">
      {/* Outer Border */}
      <div className="absolute inset-6 border-[3px] border-[#003366] z-20 pointer-events-none"></div>

      {/* SVG Wave Graphic - Left Side */}
      <div className="absolute top-0 left-0 w-[45%] h-full z-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 500 800" preserveAspectRatio="none">
          <defs>
             <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                {/* Matches the lighter cyan logo part */}
                <stop offset="0%" style={{stopColor:'#00a2e8', stopOpacity:1}} /> 
                <stop offset="100%" style={{stopColor:'#008bc5', stopOpacity:1}} />
             </linearGradient>
             <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                {/* Matches the darker navy logo part */}
                <stop offset="0%" style={{stopColor:'#004b8d', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#003366', stopOpacity:1}} />
             </linearGradient>
             <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
               <feDropShadow dx="4" dy="4" stdDeviation="4" floodOpacity="0.3"/>
             </filter>
          </defs>
          
          {/* Top segment - Ribbon start */}
          <path 
            d="M0 0 L220 0 C280 0 320 80 250 180 C210 240 100 220 100 220 L0 180 Z" 
            fill="url(#waveGradient1)" 
          />
          
          {/* Middle dark connector (fold) */}
          <path 
             d="M100 220 L250 180 L220 400 L80 440 Z"
             fill="#002244"
             opacity="0.9"
          />

          {/* Large bottom swoosh */}
          <path 
             d="M80 440 L220 400 C300 380 400 600 300 800 L0 800 Z"
             fill="url(#waveGradient2)"
             filter="url(#dropShadow)"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-30 w-full h-full flex flex-col px-16 py-12">
        
        {/* Logo Area */}
        {/* We keep this in the DOM but make it invisible if a custom logo is loaded, 
            so the layout spacing remains identical but the text doesn't overlap the custom logo. */}
        <div className={`flex justify-center mb-8 pl-20 ${data.logoImage ? 'invisible' : ''}`}>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10">
                {/* Custom S Logo */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                   <path d="M20 20 H70 L55 50 H20 L35 20 Z" fill="#00a2e8" />
                   <path d="M80 80 H30 L45 50 H80 L65 80 Z" fill="#003366" />
                </svg>
             </div>
             <div>
                <h2 className="font-sans font-extrabold text-4xl text-[#003366] tracking-widest uppercase leading-none">
                  {data.companyName || "SMART"}
                </h2>
             </div>
           </div>
        </div>

        {/* Title */}
        <div className="text-center mt-4 mb-8 pl-10">
           <h1 className="font-sans font-bold text-6xl text-[#003366] uppercase tracking-wide mb-2">{data.title}</h1>
           <p className="font-serif italic text-3xl text-[#003366] font-bold">of appreciation</p>
        </div>

        {/* Presented To */}
        <div className="text-center mb-6 pl-10">
           <p className="font-sans text-xs tracking-[0.25em] text-slate-500 uppercase font-semibold">
             This certificate is proudly presented to
           </p>
        </div>

        {/* Recipient Name */}
        <div className="text-center mb-8 pl-10 relative">
           <h2 className={`${recipientStyle.className} ${recipientStyle.sizeClass} text-[#003366] drop-shadow-sm p-4`}>
             {data.recipientName}
           </h2>
        </div>

        {/* Description Body */}
        <div className="text-center max-w-3xl mx-auto mb-12 pl-10">
           <p className="font-sans text-slate-600 leading-relaxed text-lg">
             {data.description}
           </p>
           {/* Date embedded below description slightly */}
           <p className="mt-6 text-slate-500 font-medium italic">Given on {data.date}</p>
        </div>

        {/* Footer / Signatures */}
        <div className="mt-auto flex justify-around items-end pl-20 pr-10 pb-8">
           {/* Left Signature Line */}
           <div className="flex flex-col items-center">
              <div className="w-64 border-b border-slate-800 mb-2"></div>
              <p className="font-sans font-bold text-slate-800 uppercase text-sm tracking-wider">{data.issuerName}</p>
           </div>
           
           {/* Right Signature Line */}
           <div className="flex flex-col items-center">
              {/* Fake signature graphic if text provided, or use the font */}
              <div className="font-script text-3xl text-[#003366] mb-[-10px] transform -rotate-2">{data.signatureText}</div>
              <div className="w-64 border-b border-slate-800 mb-2 mt-4"></div>
              <p className="font-sans font-bold text-slate-800 uppercase text-sm tracking-wider">{data.issuerTitle}</p>
           </div>
        </div>

      </div>
    </div>
  );

  // White Theme Component (NEW)
  const WhiteTheme = () => (
    <div className="w-full h-full bg-white relative p-16 flex flex-col items-center text-center border-[1px] border-slate-200">
       <div className="w-full h-full border-4 border-slate-800 flex flex-col items-center justify-center p-12">
          {data.companyName && (
             <div className="font-sans font-bold text-xl uppercase tracking-[0.3em] text-slate-400 mb-8">
               {data.companyName}
             </div>
          )}
          <h1 className="font-serif text-6xl text-slate-900 mb-6">{data.title}</h1>
          <div className="w-24 h-1 bg-slate-900 mb-8"></div>
          
          <p className="font-sans text-lg text-slate-500 uppercase tracking-widest mb-4">Presented to</p>
          <h2 className={`${recipientStyle.className} ${recipientStyle.sizeClass} text-slate-900 mb-8`}>
            {data.recipientName}
          </h2>

          <p className="font-serif text-xl text-slate-600 max-w-2xl leading-relaxed mb-12">
            {data.description}
          </p>

          <div className="w-full flex justify-between items-end px-20 mt-auto">
             <div className="text-center">
                <p className="font-sans font-bold text-slate-900 mb-2">{data.date}</p>
                <div className="w-48 h-[1px] bg-slate-300 mx-auto mb-2"></div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Date</p>
             </div>
             
             <div className="text-center">
                <div className="font-script text-3xl text-slate-900 mb-2">{data.signatureText}</div>
                <div className="w-48 h-[1px] bg-slate-300 mx-auto mb-2"></div>
                <p className="font-sans font-bold text-sm uppercase text-slate-900">{data.issuerName}</p>
                <p className="text-xs uppercase tracking-widest text-slate-400">{data.issuerTitle}</p>
             </div>
          </div>
       </div>
    </div>
  );

  // Silk Ribbon Theme Component (NEW)
  const SilkRibbonTheme = () => (
    <div className="w-full h-full bg-white relative flex flex-col overflow-hidden">
      {/* Top Ribbon */}
      <div className="h-4 bg-[#003366] w-full"></div>
      <div className="h-24 bg-[#00a2e8] w-full relative flex items-center justify-center shadow-md">
         <h1 className="text-white font-sans font-black text-5xl uppercase tracking-widest drop-shadow-md">
           {data.title}
         </h1>
      </div>
      <div className="h-2 bg-[#003366] w-full mb-12"></div>

      <div className="flex-1 flex flex-col items-center px-16 text-center">
         {data.companyName && (
           <div className="font-sans font-bold text-2xl text-[#003366] mb-8 flex items-center gap-2">
             <Award className="w-8 h-8" />
             {data.companyName}
           </div>
         )}

         <p className="font-serif italic text-2xl text-slate-500 mb-6">This is to certify that</p>
         
         <div className="relative mb-8">
            <h2 className={`${recipientStyle.className} ${recipientStyle.sizeClass} text-[#003366] border-b-4 border-[#00a2e8] pb-2 px-8`}>
              {data.recipientName}
            </h2>
         </div>

         <p className="font-sans text-lg text-slate-600 max-w-3xl leading-relaxed mb-12">
           {data.description}
         </p>

         <div className="w-full flex justify-around mt-auto mb-16">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-[#00a2e8] rounded-full flex items-center justify-center text-white mb-4">
                 <Star className="w-8 h-8 fill-current" />
               </div>
               <p className="font-bold text-[#003366]">{data.date}</p>
            </div>

            <div className="flex flex-col items-center justify-end">
               <div className="font-script text-4xl text-[#003366] mb-2">{data.signatureText}</div>
               <div className="w-64 border-b-2 border-[#00a2e8] mb-2"></div>
               <p className="font-bold text-[#003366] uppercase text-sm">{data.issuerName}</p>
               <p className="text-xs text-slate-500 uppercase tracking-widest">{data.issuerTitle}</p>
            </div>
         </div>
      </div>
      
      {/* Bottom accent */}
      <div className="h-4 bg-[#003366] w-full mt-auto"></div>
    </div>
  );

  return (
    <div ref={ref} className="w-[1123px] h-[794px] bg-white shadow-2xl overflow-hidden relative">
       {data.theme === CertificateTheme.CLASSIC && <ClassicTheme />}
       {data.theme === CertificateTheme.MODERN && <ModernTheme />}
       {data.theme === CertificateTheme.MINIMAL && <MinimalTheme />}
       {data.theme === CertificateTheme.SMART_WAVE && <SmartWaveTheme />}
       {data.theme === CertificateTheme.WHITE && <WhiteTheme />}
       {data.theme === CertificateTheme.SILK_RIBBON && <SilkRibbonTheme />}
       
       {/* User Uploaded Logo Layer */}
       {data.logoImage && (
         <img 
           src={data.logoImage} 
           alt="Certificate Logo" 
           className="absolute z-50 pointer-events-none select-none"
           style={{
             width: `${data.logoWidth}px`,
             top: `${data.logoTop}%`,
             left: `${data.logoLeft}%`,
             opacity: (data.logoOpacity ?? 100) / 100,
           }}
         />
       )}
    </div>
  );
});

CertificatePreview.displayName = 'CertificatePreview';

export default CertificatePreview;