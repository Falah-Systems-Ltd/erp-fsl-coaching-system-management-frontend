// src/features/auth/types/index.ts

export interface MenuItem {
  title: string;
  icon: string;
  href: string;
}

export interface MenuSection {
  section: string;
  items: MenuItem[];
}

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
    permissions: string[];
    menu: MenuSection[];
  };
  success: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}
