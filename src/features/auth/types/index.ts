// src/features/auth/types/index.ts

// src/features/auth/types/index.ts

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    id: number;
    token: string;
    email: string;
    name: string;
    role: string;
    message: string;
  };
  success: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}