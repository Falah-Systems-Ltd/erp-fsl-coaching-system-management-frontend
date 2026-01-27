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
      "/auth/admins",
      {
        params: { status }, // Axios automatically handles the ?status= query
      },
    );
    return response.data.data;
  },

  registerAdmin: async (data: RegisterAdminRequest) => {
    return apiClient.post("/auth/register-admin", data);
  },

  updateAdmin: async (adminId: number, data: UpdateAdminRequest) => {
    return apiClient.put(`/auth/admin/${adminId}`, data);
  },

  softDeleteAdmin: async (adminId: number) => {
    return apiClient.delete(`/auth/admin/${adminId}`);
  },

  permanentDeleteAdmin: async (adminId: number) => {
    return apiClient.delete(`/auth/admin/${adminId}/permanent`);
  },

  restoreAdmin: async (adminId: number) => {
    return apiClient.post(`/auth/admin/${adminId}/restore`);
  },
};
