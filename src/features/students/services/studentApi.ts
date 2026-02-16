// src/features/students/services/studentApi.ts
import apiClient from "@/lib/axios";
import { 
  Student, 
  CreateStudentRequest, 
  UpdateStudentRequest 
} from "../types";

export const studentService = {
  getStudents: async () => {
    const response = await apiClient.get<{ data: Student[] }>("/admin-students");
    return response.data.data;
  },

  registerStudent: async (data: CreateStudentRequest) => {
    return apiClient.post("/admin-students", data);
  },

  updateStudent: async (id: number, data: UpdateStudentRequest) => {
    return apiClient.put(`/admin-students/${id}`, data);
  },

  deleteStudent: async (id: number) => {
    return apiClient.delete(`/admin-students/${id}`);
  }
};