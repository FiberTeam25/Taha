import React, { useState } from 'react';
import { CertificateData, CertificateTheme } from '../types';
import { Palette, User, Calendar, PenTool, Type, Briefcase, Image as ImageIcon, Upload, X, Building2, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { generateCertificateLogo } from '../services/geminiService';
import CertificatePreview from './CertificatePreview';

interface Props {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
}

const InputForm: React.FC<Props> = ({ data, onChange }) => {
  const [genMode, setGenMode] = useState<'upload' | 'generate'>('upload');
  const [genPrompt, setGenPrompt] = useState('');
  const [genSize, setGenSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<CertificateTheme | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, logoImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateLogo = async () => {
    if (!genPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const base64Image = await generateCertificateLogo(genPrompt, genSize);
      onChange({ ...data, logoImage: base64Image });
    } catch (error) {
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeLogo = () => {
    onChange({ ...data, logoImage: undefined });
  };

  const handleSliderChange = (name: keyof CertificateData, value: number) => {
    onChange({ ...data, [name]: value });
  };

  const themes = [
    { 
      id: CertificateTheme.SMART_WAVE, 
      name: 'Smart Wave',
      colors: { primary: '#00a2e8', secondary: '#003366', accent: '#ffffff' }
    },
    { 
      id: CertificateTheme.CLASSIC, 
      name: 'Classic Gold',
      colors: { primary: '#d97706', secondary: '#1e293b', accent: '#fffbf0' }
    },
    { 
      id: CertificateTheme.MODERN, 
      name: 'Modern Dark',
      colors: { primary: '#f59e0b', secondary: '#0f172a', accent: '#ffffff' }
    },
    { 
      id: CertificateTheme.MINIMAL, 
      name: 'Clean Minimal',
      colors: { primary: '#334155', secondary: '#0f172a', accent: '#ffffff' }
    },
    { 
      id: CertificateTheme.WHITE, 
      name: 'Pure White',
      colors: { primary: '#1a202c', secondary: '#718096', accent: '#ffffff' }
    },
    { 
      id: CertificateTheme.SILK_RIBBON, 
      name: 'Silk Ribbon',
      colors: { primary: '#00a2e8', secondary: '#003366', accent: '#ffffff' }
    },
  ];

  const handleThemeChange = (themeId: CertificateTheme) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      onChange({
        ...data,
        theme: themeId,
        primaryColor: theme.colors.primary,
        secondaryColor: theme.colors.secondary,
        accentColor: theme.colors.accent,
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Theme Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Palette className="w-4 h-4" /> Theme Style
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 relative z-20">
          {themes.map((theme) => {
            const isHovered = hoveredTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                className={`relative px-2 py-2 rounded-lg text-xs font-medium transition-all text-center ${
                  data.theme === theme.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {/* Theme Preview Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[240px] h-[170px] bg-white rounded-lg shadow-2xl border-4 border-white z-50 overflow-hidden pointer-events-none ring-1 ring-black/10 animate-in fade-in zoom-in-95 duration-150 origin-bottom">
                     <div className="transform scale-[0.21] origin-top-left w-[1123px] h-[794px]">
                       <CertificatePreview data={{
                         ...data,
                         theme: theme.id,
                         primaryColor: theme.colors.primary,
                         secondaryColor: theme.colors.secondary,
                         accentColor: theme.colors.accent,
                       }} />
                     </div>
                     {/* Label */}
                     <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-bold uppercase tracking-wider backdrop-blur-sm">
                        Preview: {theme.name}
                     </div>
                  </div>
                )}
                {theme.name}
              </button>
            );
          })}
        </div>

        {/* Theme Colors */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 relative z-10">
           <div>
             <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Primary</label>
             <div className="flex items-center gap-2">
               <input 
                  type="color" 
                  name="primaryColor"
                  value={data.primaryColor || '#000000'}
                  onChange={handleChange}
                  className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
               />
               <span className="text-xs text-slate-400 font-mono">{data.primaryColor}</span>
             </div>
           </div>
           <div>
             <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Secondary</label>
             <div className="flex items-center gap-2">
               <input 
                  type="color" 
                  name="secondaryColor"
                  value={data.secondaryColor || '#000000'}
                  onChange={handleChange}
                  className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
               />
               <span className="text-xs text-slate-400 font-mono">{data.secondaryColor}</span>
             </div>
           </div>
           <div>
             <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Accent/Bg</label>
             <div className="flex items-center gap-2">
               <input 
                  type="color" 
                  name="accentColor"
                  value={data.accentColor || '#ffffff'}
                  onChange={handleChange}
                  className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
               />
               <span className="text-xs text-slate-400 font-mono">{data.accentColor}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Main Details */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
            <Building2 className="w-3 h-3" /> Company / Organization Name
          </label>
          <input
            type="text"
            name="companyName"
            value={data.companyName}
            onChange={handleChange}
            placeholder="e.g. Smart Corp"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
              <User className="w-3 h-3" /> Recipient Name
            </label>
            <input
              type="text"
              name="recipientName"
              value={data.recipientName}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="w-36">
             <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
               <Type className="w-3 h-3" /> Font
             </label>
             <select
               name="recipientFont"
               value={data.recipientFont || 'sans'}
               onChange={handleChange}
               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
             >
                <option value="sans">Arial (Sans)</option>
                <option value="script">Script</option>
                <option value="serif">Serif</option>
                <option value="display">Classic</option>
             </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
            <Type className="w-3 h-3" /> Certificate Title
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="e.g. Certificate of Completion"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
           <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
            <PenTool className="w-3 h-3" /> Description
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. For successfully completing the React Advanced Course..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>
      </div>

       {/* Logo Settings */}
       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ImageIcon className="w-4 h-4" /> Logo Settings
          </label>
          {data.logoImage && (
             <button onClick={removeLogo} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
               <X className="w-3 h-3" /> Remove
             </button>
          )}
        </div>
        
        {/* Toggle Mode */}
        {!data.logoImage && (
          <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
            <button 
              onClick={() => setGenMode('upload')}
              className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium py-1.5 rounded-md transition-all ${genMode === 'upload' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Upload className="w-3 h-3" /> Upload
            </button>
            <button 
              onClick={() => setGenMode('generate')}
              className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium py-1.5 rounded-md transition-all ${genMode === 'generate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Sparkles className="w-3 h-3" /> Generate AI
            </button>
          </div>
        )}

        {!data.logoImage ? (
          genMode === 'upload' ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
              <input 
                type="file" 
                accept="image/*"
                id="logo-upload"
                className="hidden" 
                onChange={handleLogoUpload}
              />
              <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-600 font-medium">Click to upload logo</span>
                <span className="text-xs text-slate-400 mt-1">PNG, JPG recommended</span>
              </label>
            </div>
          ) : (
             <div className="space-y-3 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                <div>
                   <label className="text-xs font-bold uppercase text-indigo-500 mb-1 block">Prompt</label>
                   <textarea
                      value={genPrompt}
                      onChange={(e) => setGenPrompt(e.target.value)}
                      placeholder="e.g. A golden lion emblem with a shield"
                      className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      rows={2}
                   />
                </div>
                <div className="flex gap-3">
                   <div className="flex-1">
                      <label className="text-xs font-bold uppercase text-indigo-500 mb-1 block">Size</label>
                      <select 
                        value={genSize} 
                        onChange={(e) => setGenSize(e.target.value as '1K' | '2K' | '4K')}
                        className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                         <option value="1K">1K (Standard)</option>
                         <option value="2K">2K (High Res)</option>
                         <option value="4K">4K (Ultra HD)</option>
                      </select>
                   </div>
                   <div className="flex items-end">
                      <button 
                        onClick={handleGenerateLogo}
                        disabled={isGenerating || !genPrompt}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate
                      </button>
                   </div>
                </div>
             </div>
          )
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg">
               <img src={data.logoImage} alt="Preview" className="w-10 h-10 object-contain" />
               <div className="flex-1 min-w-0">
                 <span className="text-xs text-slate-500 truncate block">Logo Active</span>
                 <button 
                   onClick={() => setGenMode(genMode === 'upload' ? 'generate' : 'upload') || removeLogo()} 
                   className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                 >
                   <RefreshCw className="w-3 h-3" /> Replace
                 </button>
               </div>
               <button onClick={removeLogo} className="p-1 hover:bg-slate-200 rounded">
                 <X className="w-4 h-4 text-slate-500" />
               </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                   <label className="text-xs font-bold uppercase text-slate-500">Size</label>
                   <span className="text-xs text-slate-400">{data.logoWidth}px</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="500"
                  step="1" 
                  value={data.logoWidth} 
                  onChange={(e) => handleSliderChange('logoWidth', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                   <label className="text-xs font-bold uppercase text-slate-500">Opacity</label>
                   <span className="text-xs text-slate-400">{data.logoOpacity ?? 100}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={data.logoOpacity ?? 100} 
                  onChange={(e) => handleSliderChange('logoOpacity', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                   <label className="text-xs font-bold uppercase text-slate-500">Position X (Left)</label>
                   <span className="text-xs text-slate-400">{Number(data.logoLeft).toFixed(1)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100"
                  step="0.1" 
                  value={data.logoLeft} 
                  onChange={(e) => handleSliderChange('logoLeft', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                   <label className="text-xs font-bold uppercase text-slate-500">Position Y (Top)</label>
                   <span className="text-xs text-slate-400">{Number(data.logoTop).toFixed(1)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100"
                  step="0.1" 
                  value={data.logoTop} 
                  onChange={(e) => handleSliderChange('logoTop', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
            <Calendar className="w-3 h-3" /> Date
          </label>
          <input
            type="text"
            name="date"
            value={data.date}
            onChange={handleChange}
            placeholder="e.g. October 2023"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
            <PenTool className="w-3 h-3" /> Signature Text
          </label>
          <input
            type="text"
            name="signatureText"
            value={data.signatureText}
            onChange={handleChange}
            placeholder="e.g. John Smith"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-script text-lg"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
            <Briefcase className="w-3 h-3" /> Issuer Name / Left Label
          </label>
          <input
            type="text"
            name="issuerName"
            value={data.issuerName}
            onChange={handleChange}
            placeholder="e.g. Tech Academy (or Country Manager)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-1">
             Issuer Title / Right Label
          </label>
          <input
            type="text"
            name="issuerTitle"
            value={data.issuerTitle}
            onChange={handleChange}
            placeholder="e.g. Director (or Project Director)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default InputForm;