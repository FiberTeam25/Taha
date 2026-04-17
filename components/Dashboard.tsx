import React from 'react';
import { AppData, View, WorkStatus } from '../types';
import { getProjectRecords } from '../store';

interface Props {
  data: AppData;
  onNavigate: (v: View) => void;
}

function StatCard({ label, value, sub, color, onClick }: {
  label: string; value: number | string; sub?: string; color: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-1 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

function statusCount(records: { status: WorkStatus }[], status: WorkStatus) {
  return records.filter(r => r.status === status).length;
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
    </div>
  );
}

export default function Dashboard({ data, onNavigate }: Props) {
  const pid = data.activeProjectId;
  const project = data.projects.find(p => p.id === pid);

  const trenching = pid ? getProjectRecords(data.trenching, pid) : data.trenching;
  const ducts = pid ? getProjectRecords(data.ducts, pid) : data.ducts;
  const cables = pid ? getProjectRecords(data.cables, pid) : data.cables;
  const boxes = pid ? getProjectRecords(data.boxes, pid) : data.boxes;
  const splicing = pid ? getProjectRecords(data.splicing, pid) : data.splicing;

  const totalTrenchLength = trenching.reduce((s, r) => s + (r.length || 0), 0);
  const totalDuctLength = ducts.reduce((s, r) => s + (r.length || 0), 0);
  const totalCableLength = cables.reduce((s, r) => s + (r.cableLength || 0), 0);
  const totalSplices = splicing.reduce((s, r) => s + (r.fiberCount || 0), 0);

  const sections = [
    { key: 'trenching' as View, label: 'Trenching', records: trenching, unit: `${totalTrenchLength.toLocaleString()} m` },
    { key: 'ducts' as View, label: 'Duct Laying', records: ducts, unit: `${totalDuctLength.toLocaleString()} m` },
    { key: 'cables' as View, label: 'Fibre Cables', records: cables, unit: `${totalCableLength.toLocaleString()} m` },
    { key: 'boxes' as View, label: 'Boxes & Closures', records: boxes, unit: `${boxes.length} units` },
    { key: 'splicing' as View, label: 'Splicing', records: splicing, unit: `${totalSplices} fibres` },
  ];

  return (
    <div className="space-y-6">
      {/* Project banner */}
      {project ? (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{project.name}</h2>
              <p className="text-blue-200 text-sm mt-0.5">{project.location}</p>
              <div className="flex gap-4 mt-3 text-sm">
                <span><span className="text-blue-300">Client:</span> {project.client || '—'}</span>
                <span><span className="text-blue-300">PM:</span> {project.projectManager || '—'}</span>
                <span><span className="text-blue-300">Start:</span> {project.startDate || '—'}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('project')}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              Edit Project
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <p className="text-yellow-800 font-medium">No active project. <button onClick={() => onNavigate('project')} className="underline">Create or select a project</button> to begin.</p>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Trench Length" value={`${totalTrenchLength.toLocaleString()}m`} sub={`${trenching.length} segments`} color="text-orange-600" onClick={() => onNavigate('trenching')} />
        <StatCard label="Duct Length" value={`${totalDuctLength.toLocaleString()}m`} sub={`${ducts.length} records`} color="text-purple-600" onClick={() => onNavigate('ducts')} />
        <StatCard label="Cable Length" value={`${totalCableLength.toLocaleString()}m`} sub={`${cables.length} runs`} color="text-blue-600" onClick={() => onNavigate('cables')} />
        <StatCard label="Boxes Installed" value={boxes.length} sub={`${splicing.length} splice records`} color="text-green-600" onClick={() => onNavigate('boxes')} />
      </div>

      {/* Progress by section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Work Progress</h3>
        <div className="space-y-4">
          {sections.map(sec => {
            const completed = statusCount(sec.records, 'completed');
            const total = sec.records.length;
            return (
              <div key={sec.key} className="grid grid-cols-[140px_1fr_60px_80px] items-center gap-4">
                <button onClick={() => onNavigate(sec.key)} className="text-sm font-medium text-blue-600 hover:underline text-left">
                  {sec.label}
                </button>
                <ProgressBar completed={completed} total={total} />
                <span className="text-xs text-gray-500 text-right">{completed}/{total}</span>
                <span className="text-xs text-gray-400 text-right">{sec.unit}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(sec => (
          <div key={sec.key} className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-medium text-gray-700 mb-3 text-sm">{sec.label} — Status</h4>
            <div className="grid grid-cols-4 gap-2">
              {(['planned', 'in-progress', 'completed', 'defect'] as WorkStatus[]).map(st => (
                <div key={st} className="text-center">
                  <div className={`text-lg font-bold ${
                    st === 'completed' ? 'text-green-600' :
                    st === 'in-progress' ? 'text-blue-600' :
                    st === 'defect' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {statusCount(sec.records, st)}
                  </div>
                  <div className="text-xs text-gray-400 capitalize leading-tight">{st.replace('-', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
