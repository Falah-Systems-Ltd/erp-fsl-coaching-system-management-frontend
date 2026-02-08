// src/features/admins/services/presetService.ts
import apiClient from "@/lib/axios";
import { CreatePresetRequest, UpdatePresetRequest } from "../types";

export const presetService = {
  getPresets: async () => {
    const response = await apiClient.get("/admin/permission-presets");
    return response.data.data;
  },

  createPreset: async (data: CreatePresetRequest) => {
    return apiClient.post("/admin/permission-presets", data);
  },

  updatePreset: async (id: number, data: UpdatePresetRequest) => {
    return apiClient.patch(`/admin/permission-presets/${id}`, data);
  },

  deletePreset: async (id: number) => {
    return apiClient.delete(`/admin/permission-presets/${id}`);
  },
};
