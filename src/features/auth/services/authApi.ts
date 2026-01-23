// src/features/auth/services/authApi.ts
import apiClient from "@/lib/axios";
import { AuthCredentials, LoginResponse } from "../types";

export const authService = {
  login: async (credentials: AuthCredentials) => {
    // According to your screenshot, the endpoint is /api/auth/login
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  }
};