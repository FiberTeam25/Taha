import React, { useState } from 'react';
import { View, AppData, Project } from '../types';

interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  requiresProject?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h7v7H3zM3 17h7v4H3zM13 3h8v10h-8zM13 17h8v4h-8z" />
      </svg>
    ),
  },
  {
    id: 'project',
    label: 'Projects',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'trenching',
    label: 'Trenching',
    requiresProject: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
    ),
  },
  {
    id: 'ducts',
    label: 'Duct Laying',
    requiresProject: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M4 6h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'cables',
    label: 'Fibre Cables',
    requiresProject: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'boxes',
    label: 'Boxes & Closures',
    requiresProject: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    id: 'splicing',
    label: 'Splicing',
    requiresProject: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports & Export',
    requiresProject: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

interface Props {
  view: View;
  onNavigate: (v: View) => void;
  activeProject: Project | null;
  data: AppData;
  onUpdate: (updater: (prev: AppData) => AppData) => void;
  children: React.ReactNode;
}

export default function Layout({ view, onNavigate, activeProject, data, onUpdate, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleProjectSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    onUpdate(prev => ({ ...prev, activeProjectId: id || null }));
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-200 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-700">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-sm font-bold leading-tight">FTTH Data</div>
              <div className="text-xs text-gray-400">Collection System</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className={`ml-auto p-1 rounded hover:bg-gray-700 transition-colors ${!sidebarOpen && 'hidden'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Project selector */}
        {sidebarOpen && data.projects.length > 0 && (
          <div className="px-3 py-3 border-b border-gray-700">
            <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Active Project</label>
            <select
              value={data.activeProjectId ?? ''}
              onChange={handleProjectSwitch}
              className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="">-- Select --</option>
              {data.projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const disabled = item.requiresProject && !data.activeProjectId;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => !disabled && onNavigate(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                  ${active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-3 flex items-center justify-center hover:bg-gray-700 transition-colors border-t border-gray-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {navItems.find(n => n.id === view)?.label ?? 'FTTH Data Collection'}
            </h1>
            {activeProject && (
              <p className="text-xs text-gray-500">{activeProject.name} &mdash; {activeProject.location}</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
              {data.projects.length} Project{data.projects.length !== 1 ? 's' : ''}
            </span>
            {activeProject && (
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded font-medium">Active</span>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
