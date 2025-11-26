import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { extractCertificateDetails } from '../services/geminiService';
import { CertificateData } from '../types';

interface Props {
  currentData: CertificateData;
  onUpdate: (data: CertificateData) => void;
}

const MagicBar: React.FC<Props> = ({ currentData, onUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const result = await extractCertificateDetails(prompt);
      onUpdate({
        ...currentData,
        recipientName: result.recipientName || currentData.recipientName,
        title: result.title || currentData.title,
        description: result.description || currentData.description,
        date: result.date || currentData.date,
        issuerName: result.issuerName || currentData.issuerName,
        issuerTitle: result.issuerTitle || currentData.issuerTitle,
      });
      setPrompt('');
    } catch (error) {
      console.error(error);
      alert("Failed to generate details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1 rounded-2xl shadow-lg mb-8">
      <form onSubmit={handleMagicGenerate} className="bg-white rounded-[14px] flex items-center p-2">
        <div className="pl-3 pr-2 text-purple-600">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your certificate... e.g., 'Award for Alice for winning the Science Fair on May 10th'"
          className="flex-1 border-none outline-none text-sm md:text-base px-2 py-2 text-slate-700 placeholder:text-slate-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MagicBar;
