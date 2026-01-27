import apiClient from "@/lib/axios";
import { CreatePresetRequest, UpdatePresetRequest } from "../types";

export const presetService = {
  getPresets: async () => {
    const response = await apiClient.get("/auth/permission-presets");
    return response.data.data;
  },
  createPreset: async (data: CreatePresetRequest) => {
    return apiClient.post("/auth/permission-presets", data);
  },

  updatePreset: async (id: number, data: UpdatePresetRequest) => {
    return apiClient.patch(`/auth/permission-presets/${id}`, data);
  },
  deletePreset: async (id: number) => {
    return apiClient.delete(`/auth/permission-presets/${id}`);
  },
};
