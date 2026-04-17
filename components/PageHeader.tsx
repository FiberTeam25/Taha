import React from 'react';

interface Stat {
  label: string;
  value: string | number;
}

interface Props {
  title: string;
  stats: Stat[];
  onAdd: () => void;
  addLabel: string;
}

export default function PageHeader({ title, stats, onAdd, addLabel }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-4 flex-wrap">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-200 px-4 py-2">
            <div className="text-lg font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {addLabel}
      </button>
    </div>
  );
}
