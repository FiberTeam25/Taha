import React, { useState } from 'react';
import { AppData, Project, View } from '../types';
import { createProject, updateProject, deleteProject, generateId } from '../store';

interface Props {
  data: AppData;
  onUpdate: (updater: (prev: AppData) => AppData) => void;
  onNavigate: (v: View) => void;
}

const emptyForm = (): Omit<Project, 'id' | 'createdAt'> => ({
  name: '',
  client: '',
  contractor: '',
  startDate: '',
  endDate: '',
  location: '',
  description: '',
  projectManager: '',
  supervisor: '',
});

export default function ProjectForm({ data, onUpdate, onNavigate }: Props) {
  const [form, setForm] = useState<Omit<Project, 'id' | 'createdAt'>>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const set = (field: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleEdit = (project: Project) => {
    const { id, createdAt, ...rest } = project;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const handleNew = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      onUpdate(prev => updateProject(prev, editingId, form));
    } else {
      onUpdate(prev => createProject(prev, form));
    }
    setShowForm(false);
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this project and all its records?')) return;
    onUpdate(prev => deleteProject(prev, id));
  };

  const handleActivate = (id: string) => {
    onUpdate(prev => ({ ...prev, activeProjectId: id }));
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
        >
          + New Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">{editingId ? 'Edit Project' : 'New Project'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Project Name *" value={form.name} onChange={v => set('name', v)} />
            <Field label="Client" value={form.client} onChange={v => set('client', v)} />
            <Field label="Contractor" value={form.contractor} onChange={v => set('contractor', v)} />
            <Field label="Location" value={form.location} onChange={v => set('location', v)} />
            <Field label="Project Manager" value={form.projectManager} onChange={v => set('projectManager', v)} />
            <Field label="Supervisor" value={form.supervisor} onChange={v => set('supervisor', v)} />
            <Field label="Start Date" value={form.startDate} onChange={v => set('startDate', v)} type="date" />
            <Field label="End Date" value={form.endDate} onChange={v => set('endDate', v)} type="date" />
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
            >
              Save Project
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Project list */}
      {data.projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <p>No projects yet. Create your first project to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.projects.map(p => (
            <div
              key={p.id}
              className={`bg-white rounded-xl border p-5 flex items-start justify-between transition-colors ${
                data.activeProjectId === p.id ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  {data.activeProjectId === p.id && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 space-y-0.5">
                  {p.location && <p>{p.location}</p>}
                  <div className="flex gap-4 flex-wrap">
                    {p.client && <span>Client: {p.client}</span>}
                    {p.contractor && <span>Contractor: {p.contractor}</span>}
                    {p.startDate && <span>Start: {p.startDate}</span>}
                    {p.projectManager && <span>PM: {p.projectManager}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                {data.activeProjectId !== p.id && (
                  <button
                    onClick={() => handleActivate(p.id)}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
