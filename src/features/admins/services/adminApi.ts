// src/features/admins/services/adminApi.ts
import apiClient from "@/lib/axios";
import {
  AdminListResponse,
  UpdateAdminRequest,
  RegisterAdminRequest,
} from "../types";

export const adminService = {
  // Combined getter with status parameter
  getAdmins: async (status?: string) => {
    const response = await apiClient.get<{ data: AdminListResponse }>(
      "/admin", // Changed from /auth/admins
      {
        params: { status },
      },
    );
    return response.data.data;
  },

  registerAdmin: async (data: RegisterAdminRequest) => {
    return apiClient.post("/admin/register", data);
  },

  updateAdmin: async (adminId: number, data: UpdateAdminRequest) => {
    return apiClient.put(`/admin/${adminId}`, data); 
  },

  softDeleteAdmin: async (adminId: number) => {
    return apiClient.delete(`/admin/${adminId}`);
  },

  permanentDeleteAdmin: async (adminId: number) => {
    return apiClient.delete(`/admin/${adminId}/permanent`);
  },

  restoreAdmin: async (adminId: number) => {
    return apiClient.post(`/admin/${adminId}/restore`);
  },
};
