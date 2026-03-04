import apiClient from "@/lib/axios";
import { 
  Teacher, 
  CreateTeacherRequest, 
  UpdateTeacherRequest 
} from "../types";

export const teacherService = {
  getTeachers: async () => {
    // API returns { code: 200, data: [...], success: true }
    const response = await apiClient.get<{ data: Teacher[] }>("/admin/teachers");
    return response.data.data;
  },

  createTeacher: async (data: CreateTeacherRequest) => {
    return apiClient.post("/admin/teachers", data); //
  },

  updateTeacher: async (id: number, data: UpdateTeacherRequest) => {
    return apiClient.put(`/admin/teachers/${id}`, data); //
  },

  deleteTeacher: async (id: number) => {
    return apiClient.delete(`/admin/teachers/${id}`); //
  }
};