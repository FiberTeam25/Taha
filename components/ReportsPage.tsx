import React from 'react';
import { AppData } from '../types';
import { getProjectRecords } from '../store';

interface Props {
  data: AppData;
}

function toCSV(headers: string[], rows: (string | number | boolean)[][]): string {
  const escape = (v: string | number | boolean) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  return [headers, ...rows].map(row => row.map(escape).join(',')).join('\n');
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage({ data }: Props) {
  const pid = data.activeProjectId;
  const project = data.projects.find(p => p.id === pid);

  const trenching = pid ? getProjectRecords(data.trenching, pid) : data.trenching;
  const ducts = pid ? getProjectRecords(data.ducts, pid) : data.ducts;
  const cables = pid ? getProjectRecords(data.cables, pid) : data.cables;
  const boxes = pid ? getProjectRecords(data.boxes, pid) : data.boxes;
  const splicing = pid ? getProjectRecords(data.splicing, pid) : data.splicing;

  const exportTrenching = () => {
    const csv = toCSV(
      ['Segment ID', 'Date', 'Zone', 'Start Point', 'End Point', 'Length (m)', 'Depth (mm)', 'Width (mm)', 'Soil Type', 'Method', 'Backfill', 'Reinstatement', 'Technician', 'Status', 'Notes'],
      trenching.map(r => [r.segmentId, r.date, r.zone, r.startPoint, r.endPoint, r.length, r.depth, r.width, r.soilType, r.method, r.backfillType, r.reinstatementType, r.technician, r.status, r.notes])
    );
    download(`trenching_${project?.name ?? 'export'}.csv`, csv);
  };

  const exportDucts = () => {
    const csv = toCSV(
      ['Date', 'Zone', 'Duct Type', 'Size', 'Quantity', 'Length (m)', 'Sub-ducts', 'Colour', 'Route', 'Technician', 'Status', 'Notes'],
      ducts.map(r => [r.date, r.zone, r.ductType, r.size, r.quantity, r.length, r.subducts, r.color, r.route, r.technician, r.status, r.notes])
    );
    download(`ducts_${project?.name ?? 'export'}.csv`, csv);
  };

  const exportCables = () => {
    const csv = toCSV(
      ['Date', 'Zone', 'Cable Type', 'Fibre Count', 'Length (m)', 'Drum No.', 'Manufacturer', 'Install Method', 'End Point A', 'End Point B', 'Route', 'Technician', 'Status', 'Notes'],
      cables.map(r => [r.date, r.zone, r.cableType, r.fiberCount, r.cableLength, r.drumNumber, r.manufacturer, r.installMethod, r.endPointA, r.endPointB, r.route, r.technician, r.status, r.notes])
    );
    download(`cables_${project?.name ?? 'export'}.csv`, csv);
  };

  const exportBoxes = () => {
    const csv = toCSV(
      ['Date', 'Zone', 'Box Type', 'Model', 'Serial No.', 'Location', 'Pole No.', 'Mount Type', 'Total Ports', 'Used Ports', 'Cable Entries', 'IP Rating', 'Technician', 'Status', 'Notes'],
      boxes.map(r => [r.date, r.zone, r.boxType, r.model, r.serialNumber, r.location, r.poleNumber, r.mountType, r.portCount, r.usedPorts, r.cableEntries, r.ipRating, r.technician, r.status, r.notes])
    );
    download(`boxes_${project?.name ?? 'export'}.csv`, csv);
  };

  const exportSplicing = () => {
    const csv = toCSV(
      ['Date', 'Zone', 'Box Ref', 'Tray', 'Cable A', 'Cable B', 'Method', 'Fibre Count', 'Avg Attenuation (dB)', 'Max Attenuation (dB)', 'Machine', 'OTDR Tested', 'Technician', 'Status', 'Notes'],
      splicing.map(r => {
        const box = boxes.find(b => b.id === r.boxRefId);
        return [r.date, r.zone, box ? `${box.boxType} – ${box.location}` : r.boxRefId, r.trayNumber, r.cableA, r.cableB, r.splicingMethod, r.fiberCount, r.averageAttenuation, r.maxAttenuation, r.splicingMachine, r.otdrTested ? 'Yes' : 'No', r.technician, r.status, r.notes];
      })
    );
    download(`splicing_${project?.name ?? 'export'}.csv`, csv);
  };

  const exportAll = () => {
    exportTrenching();
    exportDucts();
    exportCables();
    exportBoxes();
    exportSplicing();
  };

  const totalTrenchLength = trenching.reduce((s, r) => s + (r.length || 0), 0);
  const totalDuctLength = ducts.reduce((s, r) => s + (r.length || 0), 0);
  const totalCableLength = cables.reduce((s, r) => s + (r.cableLength || 0), 0);
  const totalSplices = splicing.reduce((s, r) => s + (r.fiberCount || 0), 0);
  const otdrPct = splicing.length ? Math.round((splicing.filter(s => s.otdrTested).length / splicing.length) * 100) : 0;

  const sections = [
    { label: 'Trenching', count: trenching.length, unit: `${totalTrenchLength.toLocaleString()} m`, completed: trenching.filter(r => r.status === 'completed').length, onExport: exportTrenching },
    { label: 'Duct Laying', count: ducts.length, unit: `${totalDuctLength.toLocaleString()} m`, completed: ducts.filter(r => r.status === 'completed').length, onExport: exportDucts },
    { label: 'Fibre Cables', count: cables.length, unit: `${totalCableLength.toLocaleString()} m`, completed: cables.filter(r => r.status === 'completed').length, onExport: exportCables },
    { label: 'Boxes & Closures', count: boxes.length, unit: `${boxes.length} units`, completed: boxes.filter(r => r.status === 'completed').length, onExport: exportBoxes },
    { label: 'Splicing', count: splicing.length, unit: `${totalSplices} fibres`, completed: splicing.filter(r => r.status === 'completed').length, onExport: exportSplicing },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Project Summary</h3>
          {project && <span className="text-sm text-gray-500">{project.name} — {project.location}</span>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <SummaryCard label="Trench Length" value={`${totalTrenchLength.toLocaleString()} m`} sub={`${trenching.length} segments`} />
          <SummaryCard label="Duct Length" value={`${totalDuctLength.toLocaleString()} m`} sub={`${ducts.length} records`} />
          <SummaryCard label="Cable Length" value={`${totalCableLength.toLocaleString()} m`} sub={`${cables.length} runs`} />
          <SummaryCard label="Boxes" value={boxes.length} sub={`${boxes.filter(b => b.status === 'completed').length} installed`} />
          <SummaryCard label="Fibres Spliced" value={totalSplices} sub={`OTDR: ${otdrPct}%`} />
        </div>
      </div>

      {/* Export by category */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Export Data (CSV)</h3>
          <button
            onClick={exportAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export All
          </button>
        </div>
        <div className="space-y-3">
          {sections.map(sec => (
            <div key={sec.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{sec.label}</div>
                  <div className="text-xs text-gray-500">{sec.count} records · {sec.unit} · {sec.completed}/{sec.count} completed</div>
                </div>
              </div>
              <button
                onClick={sec.onExport}
                disabled={sec.count === 0}
                className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CSV
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Splicing quality */}
      {splicing.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Splicing Quality Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {(splicing.reduce((s, r) => s + r.averageAttenuation, 0) / splicing.length || 0).toFixed(3)} dB
              </div>
              <div className="text-xs text-gray-500 mt-1">Overall Avg Attenuation</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${Math.max(...splicing.map(r => r.maxAttenuation)) > 0.2 ? 'text-red-600' : 'text-green-600'}`}>
                {splicing.length > 0 ? Math.max(...splicing.map(r => r.maxAttenuation)).toFixed(3) : '—'} dB
              </div>
              <div className="text-xs text-gray-500 mt-1">Worst Case Attenuation</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${otdrPct === 100 ? 'text-green-600' : otdrPct > 50 ? 'text-orange-600' : 'text-red-600'}`}>
                {otdrPct}%
              </div>
              <div className="text-xs text-gray-500 mt-1">OTDR Test Coverage</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-xs font-medium text-gray-600 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}
