import React, { useState, useCallback } from 'react';
import { AppData, View } from './types';
import { loadData, saveData } from './store';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProjectForm from './components/ProjectForm';
import TrenchingPage from './components/TrenchingPage';
import DuctPage from './components/DuctPage';
import CablePage from './components/CablePage';
import BoxesPage from './components/BoxesPage';
import SplicingPage from './components/SplicingPage';
import ReportsPage from './components/ReportsPage';

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [view, setView] = useState<View>('dashboard');

  const update = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const activeProject = data.projects.find(p => p.id === data.activeProjectId) ?? null;

  const renderView = () => {
    if (!data.activeProjectId && view !== 'project') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-24">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Project Selected</h2>
          <p className="text-gray-500 mb-6">Create or select a project to start collecting FTTH network data.</p>
          <button
            onClick={() => setView('project')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Project
          </button>
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard data={data} onNavigate={setView} />;
      case 'project':
        return <ProjectForm data={data} onUpdate={update} onNavigate={setView} />;
      case 'trenching':
        return <TrenchingPage data={data} onUpdate={update} />;
      case 'ducts':
        return <DuctPage data={data} onUpdate={update} />;
      case 'cables':
        return <CablePage data={data} onUpdate={update} />;
      case 'boxes':
        return <BoxesPage data={data} onUpdate={update} />;
      case 'splicing':
        return <SplicingPage data={data} onUpdate={update} />;
      case 'reports':
        return <ReportsPage data={data} />;
      default:
        return null;
    }
  };

  return (
    <Layout
      view={view}
      onNavigate={setView}
      activeProject={activeProject}
      data={data}
      onUpdate={update}
    >
      {renderView()}
    </Layout>
  );
}
