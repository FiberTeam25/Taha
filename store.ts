import {
  AppData,
  Project,
  TrenchingRecord,
  DuctRecord,
  FibreCableRecord,
  BoxRecord,
  SplicingRecord,
} from './types';

const STORAGE_KEY = 'ftth_data_v1';

const defaultData: AppData = {
  projects: [],
  activeProjectId: null,
  trenching: [],
  ducts: [],
  cables: [],
  boxes: [],
  splicing: [],
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function now(): string {
  return new Date().toISOString();
}

// Project CRUD
export function createProject(data: AppData, project: Omit<Project, 'id' | 'createdAt'>): AppData {
  const newProject: Project = { ...project, id: generateId(), createdAt: now() };
  return { ...data, projects: [...data.projects, newProject], activeProjectId: newProject.id };
}

export function updateProject(data: AppData, id: string, updates: Partial<Project>): AppData {
  return {
    ...data,
    projects: data.projects.map(p => (p.id === id ? { ...p, ...updates } : p)),
  };
}

export function deleteProject(data: AppData, id: string): AppData {
  return {
    ...data,
    projects: data.projects.filter(p => p.id !== id),
    activeProjectId: data.activeProjectId === id ? null : data.activeProjectId,
    trenching: data.trenching.filter(r => r.projectId !== id),
    ducts: data.ducts.filter(r => r.projectId !== id),
    cables: data.cables.filter(r => r.projectId !== id),
    boxes: data.boxes.filter(r => r.projectId !== id),
    splicing: data.splicing.filter(r => r.projectId !== id),
  };
}

// Trenching CRUD
export function addTrenching(data: AppData, record: Omit<TrenchingRecord, 'id' | 'createdAt' | 'updatedAt'>): AppData {
  const r: TrenchingRecord = { ...record, id: generateId(), createdAt: now(), updatedAt: now() };
  return { ...data, trenching: [...data.trenching, r] };
}

export function updateTrenching(data: AppData, id: string, updates: Partial<TrenchingRecord>): AppData {
  return {
    ...data,
    trenching: data.trenching.map(r => (r.id === id ? { ...r, ...updates, updatedAt: now() } : r)),
  };
}

export function deleteTrenching(data: AppData, id: string): AppData {
  return { ...data, trenching: data.trenching.filter(r => r.id !== id) };
}

// Duct CRUD
export function addDuct(data: AppData, record: Omit<DuctRecord, 'id' | 'createdAt' | 'updatedAt'>): AppData {
  const r: DuctRecord = { ...record, id: generateId(), createdAt: now(), updatedAt: now() };
  return { ...data, ducts: [...data.ducts, r] };
}

export function updateDuct(data: AppData, id: string, updates: Partial<DuctRecord>): AppData {
  return {
    ...data,
    ducts: data.ducts.map(r => (r.id === id ? { ...r, ...updates, updatedAt: now() } : r)),
  };
}

export function deleteDuct(data: AppData, id: string): AppData {
  return { ...data, ducts: data.ducts.filter(r => r.id !== id) };
}

// Cable CRUD
export function addCable(data: AppData, record: Omit<FibreCableRecord, 'id' | 'createdAt' | 'updatedAt'>): AppData {
  const r: FibreCableRecord = { ...record, id: generateId(), createdAt: now(), updatedAt: now() };
  return { ...data, cables: [...data.cables, r] };
}

export function updateCable(data: AppData, id: string, updates: Partial<FibreCableRecord>): AppData {
  return {
    ...data,
    cables: data.cables.map(r => (r.id === id ? { ...r, ...updates, updatedAt: now() } : r)),
  };
}

export function deleteCable(data: AppData, id: string): AppData {
  return { ...data, cables: data.cables.filter(r => r.id !== id) };
}

// Box CRUD
export function addBox(data: AppData, record: Omit<BoxRecord, 'id' | 'createdAt' | 'updatedAt'>): AppData {
  const r: BoxRecord = { ...record, id: generateId(), createdAt: now(), updatedAt: now() };
  return { ...data, boxes: [...data.boxes, r] };
}

export function updateBox(data: AppData, id: string, updates: Partial<BoxRecord>): AppData {
  return {
    ...data,
    boxes: data.boxes.map(r => (r.id === id ? { ...r, ...updates, updatedAt: now() } : r)),
  };
}

export function deleteBox(data: AppData, id: string): AppData {
  return { ...data, boxes: data.boxes.filter(r => r.id !== id) };
}

// Splicing CRUD
export function addSplicing(data: AppData, record: Omit<SplicingRecord, 'id' | 'createdAt' | 'updatedAt'>): AppData {
  const r: SplicingRecord = { ...record, id: generateId(), createdAt: now(), updatedAt: now() };
  return { ...data, splicing: [...data.splicing, r] };
}

export function updateSplicing(data: AppData, id: string, updates: Partial<SplicingRecord>): AppData {
  return {
    ...data,
    splicing: data.splicing.map(r => (r.id === id ? { ...r, ...updates, updatedAt: now() } : r)),
  };
}

export function deleteSplicing(data: AppData, id: string): AppData {
  return { ...data, splicing: data.splicing.filter(r => r.id !== id) };
}

export function getProjectRecords<T extends { projectId: string }>(records: T[], projectId: string): T[] {
  return records.filter(r => r.projectId === projectId);
}
