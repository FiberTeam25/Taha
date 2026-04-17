import React, { useState } from 'react';
import { AppData, FibreCableRecord, WorkStatus, CableType, InstallMethod } from '../types';
import { addCable, updateCable, deleteCable, getProjectRecords } from '../store';
import RecordModal, { FormGrid, Field, SelectField, TextArea, StatusBadge } from './RecordModal';
import PageHeader from './PageHeader';

interface Props {
  data: AppData;
  onUpdate: (updater: (prev: AppData) => AppData) => void;
}

type FormData = Omit<FibreCableRecord, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;

const emptyForm = (): FormData => ({
  date: new Date().toISOString().split('T')[0],
  technician: '',
  zone: '',
  notes: '',
  status: 'planned',
  cableType: 'G.652D',
  fiberCount: 48,
  cableLength: 0,
  route: '',
  ductRefId: '',
  drumNumber: '',
  manufacturer: '',
  installMethod: 'blown',
  endPointA: '',
  endPointB: '',
});

export default function CablePage({ data, onUpdate }: Props) {
  const pid = data.activeProjectId!;
  const records = getProjectRecords(data.cables, pid);
  const ductRecs = getProjectRecords(data.ducts, pid);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<FibreCableRecord | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());

  const set = (field: keyof FormData, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const openNew = () => { setForm(emptyForm()); setEditing(null); setModal(true); };
  const openEdit = (r: FibreCableRecord) => {
    const { id, projectId, createdAt, updatedAt, ...rest } = r;
    setForm(rest);
    setEditing(r);
    setModal(true);
  };

  const handleSave = () => {
    if (!form.endPointA.trim() && !form.endPointB.trim()) return alert('At least one endpoint is required');
    if (editing) {
      onUpdate(prev => updateCable(prev, editing.id, { ...form, projectId: pid }));
    } else {
      onUpdate(prev => addCable(prev, { ...form, projectId: pid }));
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    onUpdate(prev => deleteCable(prev, id));
  };

  const totalLength = records.reduce((s, r) => s + (r.cableLength || 0), 0);
  const completed = records.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Fibre Cable Records"
        stats={[
          { label: 'Total Runs', value: records.length },
          { label: 'Total Length', value: `${totalLength.toLocaleString()} m` },
          { label: 'Completed', value: `${completed}/${records.length}` },
        ]}
        onAdd={openNew}
        addLabel="Add Cable Run"
      />

      {records.length === 0 ? (
        <EmptyState onAdd={openNew} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Zone', 'Cable Type', 'Fibres', 'Length (m)', 'Drum No.', 'Method', 'From', 'To', 'Manufacturer', 'Technician', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{r.date}</td>
                    <td className="px-4 py-3 text-gray-600">{r.zone || '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.cableType}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{r.fiberCount}F</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.cableLength}</td>
                    <td className="px-4 py-3 text-gray-600">{r.drumNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{r.installMethod}</td>
                    <td className="px-4 py-3 text-gray-600">{r.endPointA || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.endPointB || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.manufacturer || '—'}</td>
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
          title={editing ? 'Edit Cable Run' : 'New Cable Run'}
          onClose={() => setModal(false)}
          onSave={handleSave}
        >
          <FormGrid>
            <SelectField
              label="Cable Type (ITU-T)"
              value={form.cableType}
              onChange={v => set('cableType', v as CableType)}
              options={[
                { value: 'G.652D', label: 'G.652D — Standard SMF' },
                { value: 'G.657A1', label: 'G.657A1 — Bend insensitive' },
                { value: 'G.657A2', label: 'G.657A2 — High bend insensitive' },
                { value: 'ribbon', label: 'Ribbon Cable' },
                { value: 'loose-tube', label: 'Loose Tube' },
                { value: 'tight-buffer', label: 'Tight Buffer' },
              ]}
            />
            <Field label="Fibre Count" value={form.fiberCount} onChange={v => set('fiberCount', Number(v))} type="number" />
            <Field label="Cable Length (m)" value={form.cableLength} onChange={v => set('cableLength', Number(v))} type="number" />
            <Field label="Drum Number" value={form.drumNumber} onChange={v => set('drumNumber', v)} />
            <Field label="End Point A" value={form.endPointA} onChange={v => set('endPointA', v)} />
            <Field label="End Point B" value={form.endPointB} onChange={v => set('endPointB', v)} />
            <Field label="Route Description" value={form.route} onChange={v => set('route', v)} />
            <Field label="Manufacturer" value={form.manufacturer} onChange={v => set('manufacturer', v)} />
            <SelectField
              label="Installation Method"
              value={form.installMethod}
              onChange={v => set('installMethod', v as InstallMethod)}
              options={[
                { value: 'blown', label: 'Blown (Air-jetting)' },
                { value: 'pulled', label: 'Pulled' },
                { value: 'direct-buried', label: 'Direct Buried' },
                { value: 'lashed', label: 'Lashed (Aerial)' },
              ]}
            />
            <SelectField
              label="Linked Duct"
              value={form.ductRefId}
              onChange={v => set('ductRefId', v)}
              options={[
                { value: '', label: '— None —' },
                ...ductRecs.map(d => ({ value: d.id, label: `${d.ductType} ${d.size} (${d.length}m)` })),
              ]}
            />
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
      <p className="text-gray-400 mb-4">No fibre cable records yet.</p>
      <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
        Add First Record
      </button>
    </div>
  );
}
