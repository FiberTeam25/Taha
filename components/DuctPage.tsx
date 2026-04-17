import React, { useState } from 'react';
import { AppData, DuctRecord, WorkStatus, DuctType } from '../types';
import { addDuct, updateDuct, deleteDuct, getProjectRecords } from '../store';
import RecordModal, { FormGrid, Field, SelectField, TextArea, StatusBadge } from './RecordModal';
import PageHeader from './PageHeader';

interface Props {
  data: AppData;
  onUpdate: (updater: (prev: AppData) => AppData) => void;
}

type FormData = Omit<DuctRecord, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;

const emptyForm = (): FormData => ({
  date: new Date().toISOString().split('T')[0],
  technician: '',
  zone: '',
  notes: '',
  status: 'planned',
  ductType: 'HDPE',
  size: '',
  quantity: 1,
  length: 0,
  color: '',
  route: '',
  subducts: 0,
  trenchingRefId: '',
});

export default function DuctPage({ data, onUpdate }: Props) {
  const pid = data.activeProjectId!;
  const records = getProjectRecords(data.ducts, pid);
  const trenchingRecs = getProjectRecords(data.trenching, pid);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<DuctRecord | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());

  const set = (field: keyof FormData, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const openNew = () => { setForm(emptyForm()); setEditing(null); setModal(true); };
  const openEdit = (r: DuctRecord) => {
    const { id, projectId, createdAt, updatedAt, ...rest } = r;
    setForm(rest);
    setEditing(r);
    setModal(true);
  };

  const handleSave = () => {
    if (!form.size.trim()) return alert('Duct size is required');
    if (editing) {
      onUpdate(prev => updateDuct(prev, editing.id, { ...form, projectId: pid }));
    } else {
      onUpdate(prev => addDuct(prev, { ...form, projectId: pid }));
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    onUpdate(prev => deleteDuct(prev, id));
  };

  const totalLength = records.reduce((s, r) => s + (r.length || 0), 0);
  const completed = records.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Duct Laying Records"
        stats={[
          { label: 'Total Records', value: records.length },
          { label: 'Total Length', value: `${totalLength.toLocaleString()} m` },
          { label: 'Completed', value: `${completed}/${records.length}` },
        ]}
        onAdd={openNew}
        addLabel="Add Duct Record"
      />

      {records.length === 0 ? (
        <EmptyState onAdd={openNew} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Zone', 'Type', 'Size', 'Qty', 'Length (m)', 'Sub-ducts', 'Route', 'Colour', 'Technician', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{r.date}</td>
                    <td className="px-4 py-3 text-gray-600">{r.zone || '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.ductType}</td>
                    <td className="px-4 py-3 text-gray-600">{r.size}</td>
                    <td className="px-4 py-3 text-gray-800">{r.quantity}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.length}</td>
                    <td className="px-4 py-3 text-gray-600">{r.subducts || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[120px] truncate">{r.route || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.color || '—'}</td>
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
          title={editing ? 'Edit Duct Record' : 'New Duct Record'}
          onClose={() => setModal(false)}
          onSave={handleSave}
        >
          <FormGrid>
            <SelectField
              label="Duct Type"
              value={form.ductType}
              onChange={v => set('ductType', v as DuctType)}
              options={[
                { value: 'HDPE', label: 'HDPE' },
                { value: 'PVC', label: 'PVC' },
                { value: 'microduct', label: 'Microduct' },
                { value: 'duct-bundle', label: 'Duct Bundle' },
                { value: 'silicon-core', label: 'Silicon Core' },
              ]}
            />
            <Field label="Size (e.g. 40/33mm)" value={form.size} onChange={v => set('size', v)} required />
            <Field label="Quantity (no. of ducts)" value={form.quantity} onChange={v => set('quantity', Number(v))} type="number" />
            <Field label="Length (m)" value={form.length} onChange={v => set('length', Number(v))} type="number" />
            <Field label="Sub-ducts" value={form.subducts} onChange={v => set('subducts', Number(v))} type="number" />
            <Field label="Colour" value={form.color} onChange={v => set('color', v)} />
            <Field label="Route / Description" value={form.route} onChange={v => set('route', v)} />
            <Field label="Zone / Area" value={form.zone} onChange={v => set('zone', v)} />
            <Field label="Date" value={form.date} onChange={v => set('date', v)} type="date" />
            <Field label="Technician" value={form.technician} onChange={v => set('technician', v)} />
            <SelectField
              label="Linked Trench Segment"
              value={form.trenchingRefId}
              onChange={v => set('trenchingRefId', v)}
              options={[
                { value: '', label: '— None —' },
                ...trenchingRecs.map(t => ({ value: t.id, label: t.segmentId })),
              ]}
            />
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
      <p className="text-gray-400 mb-4">No duct laying records yet.</p>
      <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
        Add First Record
      </button>
    </div>
  );
}
