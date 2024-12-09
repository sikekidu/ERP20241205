export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: 'operational' | 'maintenance' | 'repair' | 'idle';
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  specifications: Record<string, string>;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  supplier: string;
  location: string;
  lastRestocked: string;
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  compatibility: string[];
  quantity: number;
  minimumStock: number;
  supplier: string;
  location: string;
  lastUsed: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: string;
  type: 'routine' | 'repair' | 'emergency';
  description: string;
  technician: string;
  partsUsed: Array<{
    partId: string;
    quantity: number;
  }>;
  status: 'scheduled' | 'in-progress' | 'completed';
}