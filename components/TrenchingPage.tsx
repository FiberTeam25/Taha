import React, { useState } from 'react';
import { AppData, TrenchingRecord, WorkStatus, SoilType, TrenchMethod } from '../types';
import { addTrenching, updateTrenching, deleteTrenching, getProjectRecords } from '../store';
import RecordModal, { FormGrid, Field, SelectField, TextArea, StatusBadge } from './RecordModal';
import PageHeader from './PageHeader';

interface Props {
  data: AppData;
  onUpdate: (updater: (prev: AppData) => AppData) => void;
}

type FormData = Omit<TrenchingRecord, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;

const emptyForm = (projectId: string): FormData => ({
  date: new Date().toISOString().split('T')[0],
  technician: '',
  zone: '',
  notes: '',
  status: 'planned',
  segmentId: '',
  startPoint: '',
  endPoint: '',
  length: 0,
  depth: 600,
  width: 300,
  soilType: 'soil',
  method: 'open-cut',
  backfillType: '',
  reinstatementType: '',
});

export default function TrenchingPage({ data, onUpdate }: Props) {
  const pid = data.activeProjectId!;
  const records = getProjectRecords(data.trenching, pid);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<TrenchingRecord | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm(pid));

  const set = (field: keyof FormData, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const openNew = () => { setForm(emptyForm(pid)); setEditing(null); setModal(true); };
  const openEdit = (r: TrenchingRecord) => {
    const { id, projectId, createdAt, updatedAt, ...rest } = r;
    setForm(rest);
    setEditing(r);
    setModal(true);
  };

  const handleSave = () => {
    if (!form.segmentId.trim()) return alert('Segment ID is required');
    if (editing) {
      onUpdate(prev => updateTrenching(prev, editing.id, { ...form, projectId: pid }));
    } else {
      onUpdate(prev => addTrenching(prev, { ...form, projectId: pid }));
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    onUpdate(prev => deleteTrenching(prev, id));
  };

  const totalLength = records.reduce((s, r) => s + (r.length || 0), 0);
  const completed = records.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Trenching Records"
        stats={[
          { label: 'Total Segments', value: records.length },
          { label: 'Total Length', value: `${totalLength.toLocaleString()} m` },
          { label: 'Completed', value: `${completed}/${records.length}` },
        ]}
        onAdd={openNew}
        addLabel="Add Trench Segment"
      />

      {records.length === 0 ? (
        <EmptyState onAdd={openNew} label="trench segment" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Segment ID', 'Date', 'Zone', 'From → To', 'Length (m)', 'Depth (mm)', 'Method', 'Soil', 'Technician', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{r.segmentId}</td>
                    <td className="px-4 py-3 text-gray-600">{r.date}</td>
                    <td className="px-4 py-3 text-gray-600">{r.zone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.startPoint} → {r.endPoint}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{r.length}</td>
                    <td className="px-4 py-3 text-gray-600">{r.depth}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{r.method.replace(/-/g, ' ')}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{r.soilType}</td>
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
          title={editing ? 'Edit Trench Segment' : 'New Trench Segment'}
          onClose={() => setModal(false)}
          onSave={handleSave}
        >
          <FormGrid>
            <Field label="Segment ID" value={form.segmentId} onChange={v => set('segmentId', v)} required />
            <Field label="Date" value={form.date} onChange={v => set('date', v)} type="date" />
            <Field label="Start Point" value={form.startPoint} onChange={v => set('startPoint', v)} />
            <Field label="End Point" value={form.endPoint} onChange={v => set('endPoint', v)} />
            <Field label="Length (m)" value={form.length} onChange={v => set('length', Number(v))} type="number" />
            <Field label="Depth (mm)" value={form.depth} onChange={v => set('depth', Number(v))} type="number" />
            <Field label="Width (mm)" value={form.width} onChange={v => set('width', Number(v))} type="number" />
            <Field label="Zone / Area" value={form.zone} onChange={v => set('zone', v)} />
            <SelectField
              label="Soil Type"
              value={form.soilType}
              onChange={v => set('soilType', v as SoilType)}
              options={[
                { value: 'soil', label: 'Soil' },
                { value: 'asphalt', label: 'Asphalt' },
                { value: 'concrete', label: 'Concrete' },
                { value: 'rock', label: 'Rock' },
                { value: 'mixed', label: 'Mixed' },
              ]}
            />
            <SelectField
              label="Trench Method"
              value={form.method}
              onChange={v => set('method', v as TrenchMethod)}
              options={[
                { value: 'open-cut', label: 'Open Cut' },
                { value: 'directional-drilling', label: 'Directional Drilling (HDD)' },
                { value: 'micro-trenching', label: 'Micro-Trenching' },
                { value: 'pipe-jacking', label: 'Pipe Jacking' },
              ]}
            />
            <Field label="Backfill Type" value={form.backfillType} onChange={v => set('backfillType', v)} />
            <Field label="Reinstatement Type" value={form.reinstatementType} onChange={v => set('reinstatementType', v)} />
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

function EmptyState({ onAdd, label }: { onAdd: () => void; label: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <p className="text-gray-400 mb-4">No {label} records yet.</p>
      <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
        Add First Record
      </button>
    </div>
  );
}
