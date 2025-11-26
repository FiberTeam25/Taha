import React from 'react';
import { CertificateData, CertificateTheme } from '../types';
import { Palette, User, Calendar, PenTool, Type, Briefcase, Image as ImageIcon, Upload, X, Building2 } from 'lucide-react';

interface Props {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
}

const InputForm: React.FC<Props> = ({ data, onChange }) => {
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

  const removeLogo = () => {
    onChange({ ...data, logoImage: undefined });
  };

  const handleSliderChange = (name: keyof CertificateData, value: number) => {
    onChange({ ...data, [name]: value });
  };

  const themes = [
    { id: CertificateTheme.SMART_WAVE, name: 'Smart Wave' },
    { id: CertificateTheme.CLASSIC, name: 'Classic Gold' },
    { id: CertificateTheme.MODERN, name: 'Modern Dark' },
    { id: CertificateTheme.MINIMAL, name: 'Clean Minimal' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Theme Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Palette className="w-4 h-4" /> Theme Style
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onChange({ ...data, theme: theme.id })}
              className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                data.theme === theme.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {theme.name}
            </button>
          ))}
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

        <div>
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

        {!data.logoImage ? (
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
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg">
               <img src={data.logoImage} alt="Preview" className="w-10 h-10 object-contain" />
               <span className="text-xs text-slate-500 truncate flex-1">Logo Uploaded</span>
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
                  min="50" 
                  max="500" 
                  value={data.logoWidth} 
                  onChange={(e) => handleSliderChange('logoWidth', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                   <label className="text-xs font-bold uppercase text-slate-500">Position X (Left)</label>
                   <span className="text-xs text-slate-400">{data.logoLeft}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={data.logoLeft} 
                  onChange={(e) => handleSliderChange('logoLeft', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                   <label className="text-xs font-bold uppercase text-slate-500">Position Y (Top)</label>
                   <span className="text-xs text-slate-400">{data.logoTop}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
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