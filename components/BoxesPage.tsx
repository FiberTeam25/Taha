import React, { useState } from 'react';
import { AppData, BoxRecord, WorkStatus, BoxType, MountType } from '../types';
import { addBox, updateBox, deleteBox, getProjectRecords } from '../store';
import RecordModal, { FormGrid, Field, SelectField, TextArea, StatusBadge } from './RecordModal';
import PageHeader from './PageHeader';

interface Props {
  data: AppData;
  onUpdate: (updater: (prev: AppData) => AppData) => void;
}

type FormData = Omit<BoxRecord, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;

const emptyForm = (): FormData => ({
  date: new Date().toISOString().split('T')[0],
  technician: '',
  zone: '',
  notes: '',
  status: 'planned',
  boxType: 'splice-closure',
  model: '',
  serialNumber: '',
  location: '',
  mountType: 'underground',
  portCount: 0,
  usedPorts: 0,
  cableEntries: 0,
  ipRating: 'IP68',
  poleNumber: '',
});

const BOX_TYPE_LABELS: Record<BoxType, string> = {
  NAP: 'NAP (Network Access Point)',
  'splice-closure': 'Splice Closure',
  FDH: 'FDH (Fibre Distribution Hub)',
  ODF: 'ODF (Optical Distribution Frame)',
  POP: 'POP (Point of Presence)',
  'street-cabinet': 'Street Cabinet',
  'pole-box': 'Pole Box',
  FTB: 'FTB (Fibre Termination Box)',
};

export default function BoxesPage({ data, onUpdate }: Props) {
  const pid = data.activeProjectId!;
  const records = getProjectRecords(data.boxes, pid);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<BoxRecord | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());

  const set = (field: keyof FormData, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const openNew = () => { setForm(emptyForm()); setEditing(null); setModal(true); };
  const openEdit = (r: BoxRecord) => {
    const { id, projectId, createdAt, updatedAt, ...rest } = r;
    setForm(rest);
    setEditing(r);
    setModal(true);
  };

  const handleSave = () => {
    if (!form.location.trim()) return alert('Location is required');
    if (editing) {
      onUpdate(prev => updateBox(prev, editing.id, { ...form, projectId: pid }));
    } else {
      onUpdate(prev => addBox(prev, { ...form, projectId: pid }));
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    onUpdate(prev => deleteBox(prev, id));
  };

  const completed = records.filter(r => r.status === 'completed').length;
  const totalPorts = records.reduce((s, r) => s + (r.portCount || 0), 0);
  const usedPorts = records.reduce((s, r) => s + (r.usedPorts || 0), 0);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Boxes & Closures"
        stats={[
          { label: 'Total Units', value: records.length },
          { label: 'Ports (used/total)', value: `${usedPorts}/${totalPorts}` },
          { label: 'Installed', value: `${completed}/${records.length}` },
        ]}
        onAdd={openNew}
        addLabel="Add Box / Closure"
      />

      {records.length === 0 ? (
        <EmptyState onAdd={openNew} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Type', 'Model', 'Serial No.', 'Location', 'Pole No.', 'Mount', 'Ports', 'Used', 'Entries', 'IP', 'Zone', 'Technician', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{r.date}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800 whitespace-nowrap">{r.boxType.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.model || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.serialNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[120px] truncate">{r.location}</td>
                    <td className="px-4 py-3 text-gray-600">{r.poleNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{r.mountType}</td>
                    <td className="px-4 py-3 text-gray-800">{r.portCount}</td>
                    <td className="px-4 py-3 text-gray-600">{r.usedPorts}</td>
                    <td className="px-4 py-3 text-gray-600">{r.cableEntries}</td>
                    <td className="px-4 py-3 text-gray-600">{r.ipRating}</td>
                    <td className="px-4 py-3 text-gray-600">{r.zone || '—'}</td>
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
          title={editing ? 'Edit Box / Closure' : 'New Box / Closure'}
          onClose={() => setModal(false)}
          onSave={handleSave}
        >
          <FormGrid>
            <SelectField
              label="Box Type"
              value={form.boxType}
              onChange={v => set('boxType', v as BoxType)}
              options={Object.entries(BOX_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <Field label="Model" value={form.model} onChange={v => set('model', v)} />
            <Field label="Serial Number" value={form.serialNumber} onChange={v => set('serialNumber', v)} />
            <Field label="Location / Address" value={form.location} onChange={v => set('location', v)} required />
            <Field label="Pole Number" value={form.poleNumber} onChange={v => set('poleNumber', v)} />
            <SelectField
              label="Mount Type"
              value={form.mountType}
              onChange={v => set('mountType', v as MountType)}
              options={[
                { value: 'underground', label: 'Underground / Handhole' },
                { value: 'aerial', label: 'Aerial' },
                { value: 'pole', label: 'Pole Mounted' },
                { value: 'wall-mounted', label: 'Wall Mounted' },
                { value: 'pedestal', label: 'Pedestal' },
                { value: 'handhole', label: 'Handhole / Manhole' },
              ]}
            />
            <Field label="Total Ports / Splitters" value={form.portCount} onChange={v => set('portCount', Number(v))} type="number" />
            <Field label="Used Ports" value={form.usedPorts} onChange={v => set('usedPorts', Number(v))} type="number" />
            <Field label="Cable Entries" value={form.cableEntries} onChange={v => set('cableEntries', Number(v))} type="number" />
            <Field label="IP Rating" value={form.ipRating} onChange={v => set('ipRating', v)} />
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
      <p className="text-gray-400 mb-4">No box / closure records yet.</p>
      <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
        Add First Record
      </button>
    </div>
  );
}
