// src/features/students/types/index.ts

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Student {
  id: number;
  userId: number | null;
  name: string;
  email: string;
  phoneNumber: string;
  guardianName: string | null;
  guardianPhone: string | null;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  isActive: boolean;
  teacherName?: string | null;
  teacherSubject?: string | null;
}

export interface CreateStudentRequest {
  email: string;
  password?: string;
  phoneNumber: string;
  name: string;
  guardianName: string;
  guardianPhone: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
}

export interface UpdateStudentRequest {
  email?: string;
  name?: string;
  phoneNumber?: string;
  guardianName?: string;
  guardianPhone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  isActive?: boolean;
}
