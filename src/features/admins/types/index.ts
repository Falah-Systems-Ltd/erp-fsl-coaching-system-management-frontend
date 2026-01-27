// src/features/admins/types/index.ts
export interface Admin {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  addedBy: string;
  createdAt: string;
  isActive: boolean;
  permissions: string[];
}

export interface AdminListResponse {
  availablePermissions: string[];
  admins: Admin[];
}

export interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  permissions: string[];
}

export interface UpdateAdminRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface Preset {
  id: number;
  name: string;
  permissions: string[];
}

export interface CreatePresetRequest {
  name: string;
  permissions: string[];
}

export interface UpdatePresetRequest {
  name?: string;
  permissions?: string[];
}
