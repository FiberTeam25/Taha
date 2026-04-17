export type WorkStatus = 'planned' | 'in-progress' | 'completed' | 'defect';
export type SoilType = 'asphalt' | 'concrete' | 'soil' | 'rock' | 'mixed';
export type TrenchMethod = 'open-cut' | 'directional-drilling' | 'micro-trenching' | 'pipe-jacking';
export type DuctType = 'HDPE' | 'PVC' | 'microduct' | 'duct-bundle' | 'silicon-core';
export type CableType = 'G.652D' | 'G.657A1' | 'G.657A2' | 'ribbon' | 'loose-tube' | 'tight-buffer';
export type BoxType = 'NAP' | 'splice-closure' | 'FDH' | 'ODF' | 'POP' | 'street-cabinet' | 'pole-box' | 'FTB';
export type MountType = 'aerial' | 'underground' | 'wall-mounted' | 'pole' | 'pedestal' | 'handhole';
export type SplicingMethod = 'fusion' | 'mechanical';
export type InstallMethod = 'blown' | 'pulled' | 'direct-buried' | 'lashed';
export type View = 'dashboard' | 'project' | 'trenching' | 'ducts' | 'cables' | 'boxes' | 'splicing' | 'reports';

export interface Project {
  id: string;
  name: string;
  client: string;
  contractor: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  projectManager: string;
  supervisor: string;
  createdAt: string;
}

export interface BaseRecord {
  id: string;
  projectId: string;
  date: string;
  technician: string;
  zone: string;
  notes: string;
  status: WorkStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TrenchingRecord extends BaseRecord {
  segmentId: string;
  startPoint: string;
  endPoint: string;
  length: number;
  depth: number;
  width: number;
  soilType: SoilType;
  method: TrenchMethod;
  backfillType: string;
  reinstatementType: string;
}

export interface DuctRecord extends BaseRecord {
  ductType: DuctType;
  size: string;
  quantity: number;
  length: number;
  color: string;
  route: string;
  subducts: number;
  trenchingRefId: string;
}

export interface FibreCableRecord extends BaseRecord {
  cableType: CableType;
  fiberCount: number;
  cableLength: number;
  route: string;
  ductRefId: string;
  drumNumber: string;
  manufacturer: string;
  installMethod: InstallMethod;
  endPointA: string;
  endPointB: string;
}

export interface BoxRecord extends BaseRecord {
  boxType: BoxType;
  model: string;
  serialNumber: string;
  location: string;
  mountType: MountType;
  portCount: number;
  usedPorts: number;
  cableEntries: number;
  ipRating: string;
  poleNumber: string;
}

export interface SplicingRecord extends BaseRecord {
  boxRefId: string;
  splicingMethod: SplicingMethod;
  fiberCount: number;
  trayNumber: string;
  cableA: string;
  cableB: string;
  averageAttenuation: number;
  maxAttenuation: number;
  splicingMachine: string;
  otdrTested: boolean;
}

export interface AppData {
  projects: Project[];
  activeProjectId: string | null;
  trenching: TrenchingRecord[];
  ducts: DuctRecord[];
  cables: FibreCableRecord[];
  boxes: BoxRecord[];
  splicing: SplicingRecord[];
}

export const STATUS_COLORS: Record<WorkStatus, string> = {
  planned: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  defect: 'bg-red-100 text-red-700',
};

export const STATUS_LABELS: Record<WorkStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  completed: 'Completed',
  defect: 'Defect',
};
