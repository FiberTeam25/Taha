import React, { useState } from 'react';
import { AppData, SplicingRecord, WorkStatus, SplicingMethod } from '../types';
import { addSplicing, updateSplicing, deleteSplicing, getProjectRecords } from '../store';
import RecordModal, { FormGrid, Field, SelectField, TextArea, StatusBadge } from './RecordModal';
import PageHeader from './PageHeader';

interface Props {
  data: AppData;
  onUpdate: (updater: (prev: AppData) => AppData) => void;
}

type FormData = Omit<SplicingRecord, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;

const emptyForm = (): FormData => ({
  date: new Date().toISOString().split('T')[0],
  technician: '',
  zone: '',
  notes: '',
  status: 'planned',
  boxRefId: '',
  splicingMethod: 'fusion',
  fiberCount: 0,
  trayNumber: '',
  cableA: '',
  cableB: '',
  averageAttenuation: 0,
  maxAttenuation: 0,
  splicingMachine: '',
  otdrTested: false,
});

export default function SplicingPage({ data, onUpdate }: Props) {
  const pid = data.activeProjectId!;
  const records = getProjectRecords(data.splicing, pid);
  const boxRecs = getProjectRecords(data.boxes, pid);
  const cableRecs = getProjectRecords(data.cables, pid);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<SplicingRecord | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());

  const set = (field: keyof FormData, value: string | number | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const openNew = () => { setForm(emptyForm()); setEditing(null); setModal(true); };
  const openEdit = (r: SplicingRecord) => {
    const { id, projectId, createdAt, updatedAt, ...rest } = r;
    setForm(rest);
    setEditing(r);
    setModal(true);
  };

  const handleSave = () => {
    if (!form.cableA.trim()) return alert('Cable A is required');
    if (editing) {
      onUpdate(prev => updateSplicing(prev, editing.id, { ...form, projectId: pid }));
    } else {
      onUpdate(prev => addSplicing(prev, { ...form, projectId: pid }));
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    onUpdate(prev => deleteSplicing(prev, id));
  };

  const totalFibres = records.reduce((s, r) => s + (r.fiberCount || 0), 0);
  const completed = records.filter(r => r.status === 'completed').length;
  const otdrTested = records.filter(r => r.otdrTested).length;

  const boxLabel = (id: string) => {
    const b = boxRecs.find(b => b.id === id);
    return b ? `${b.boxType.toUpperCase()} – ${b.location}` : id;
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Splicing Records"
        stats={[
          { label: 'Total Records', value: records.length },
          { label: 'Total Fibres Spliced', value: totalFibres },
          { label: 'OTDR Tested', value: `${otdrTested}/${records.length}` },
        ]}
        onAdd={openNew}
        addLabel="Add Splice Record"
      />

      {records.length === 0 ? (
        <EmptyState onAdd={openNew} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Zone', 'Box / Closure', 'Tray', 'Cable A', 'Cable B', 'Method', 'Fibres', 'Avg Loss (dB)', 'Max Loss (dB)', 'Machine', 'OTDR', 'Technician', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{r.date}</td>
                    <td className="px-4 py-3 text-gray-600">{r.zone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{r.boxRefId ? boxLabel(r.boxRefId) : '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.trayNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.cableA}</td>
                    <td className="px-4 py-3 text-gray-600">{r.cableB || '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 capitalize">{r.splicingMethod}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.fiberCount}</td>
                    <td className={`px-4 py-3 font-medium ${r.averageAttenuation > 0.1 ? 'text-orange-600' : 'text-green-600'}`}>
                      {r.averageAttenuation > 0 ? r.averageAttenuation.toFixed(3) : '—'}
                    </td>
                    <td className={`px-4 py-3 font-medium ${r.maxAttenuation > 0.2 ? 'text-red-600' : 'text-gray-600'}`}>
                      {r.maxAttenuation > 0 ? r.maxAttenuation.toFixed(3) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.splicingMachine || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${r.otdrTested ? 'text-green-600' : 'text-gray-400'}`}>
                        {r.otdrTested ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.technician || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(r)} className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(r.id)} className="text-xs text-red-500 hover:underline">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <RecordModal
          title={editing ? 'Edit Splice Record' : 'New Splice Record'}
          onClose={() => setModal(false)}
          onSave={handleSave}
        >
          <FormGrid>
            <SelectField
              label="Box / Closure"
              value={form.boxRefId}
              onChange={v => set('boxRefId', v)}
              options={[
                { value: '', label: '— Select box —' },
                ...boxRecs.map(b => ({ value: b.id, label: `${b.boxType.toUpperCase()} – ${b.location}` })),
              ]}
            />
            <Field label="Tray Number" value={form.trayNumber} onChange={v => set('trayNumber', v)} />
            <Field label="Cable A" value={form.cableA} onChange={v => set('cableA', v)} required />
            <Field label="Cable B" value={form.cableB} onChange={v => set('cableB', v)} />
            <SelectField
              label="Splicing Method"
              value={form.splicingMethod}
              onChange={v => set('splicingMethod', v as SplicingMethod)}
              options={[
                { value: 'fusion', label: 'Fusion Splicing' },
                { value: 'mechanical', label: 'Mechanical Splice' },
              ]}
            />
            <Field label="Fibre Count" value={form.fiberCount} onChange={v => set('fiberCount', Number(v))} type="number" />
            <Field label="Avg Attenuation (dB)" value={form.averageAttenuation} onChange={v => set('averageAttenuation', Number(v))} type="number" />
            <Field label="Max Attenuation (dB)" value={form.maxAttenuation} onChange={v => set('maxAttenuation', Number(v))} type="number" />
            <Field label="Splicing Machine" value={form.splicingMachine} onChange={v => set('splicingMachine', v)} />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">OTDR Tested</label>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={form.otdrTested}
                  onChange={e => set('otdrTested', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">OTDR test completed</span>
              </label>
            </div>
            <Field label="Zone / Area" value={form.zone} onChange={v => set('zone', v)} />
            <Field label="Date" value={form.date} onChange={v => set('date', v)} type="date" />
            <Field label="Technician" value={form.technician} onChange={v => set('technician', v)} />
            <SelectField
              label="Status"
              value={form.status}
              onChange={v => set('status', v as WorkStatus)}
              options={[
                { value: 'planned', label: 'Planned' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'defect', label: 'Defect' },
              ]}
            />
            <TextArea label="Notes" value={form.notes} onChange={v => set('notes', v)} />
          </FormGrid>
        </RecordModal>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <p className="text-gray-400 mb-4">No splicing records yet.</p>
      <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
        Add First Record
      </button>
    </div>
  );
}
