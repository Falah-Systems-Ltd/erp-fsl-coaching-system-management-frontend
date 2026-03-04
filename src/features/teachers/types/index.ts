export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Teacher {
  id: number;
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  subject: string;
  gender: Gender;
  address: string;
}

export interface CreateTeacherRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  designation: string;
  subject: string;
  gender: Gender;
  address: string;
}

export interface UpdateTeacherRequest {
  name?: string;
  phoneNumber?: string;
  designation?: string;
  subject?: string;
  address?: string;
}