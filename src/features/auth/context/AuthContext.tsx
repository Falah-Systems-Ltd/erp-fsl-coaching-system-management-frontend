"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// 1. Define the exact shapes of the data coming from your Spring Boot backend
export interface MenuItem {
  title: string;
  icon: string;
  href: string; 
}

export interface MenuSection {
  section: string;
  items: MenuItem[];
}

// 2. Add 'menu' to your Context Type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  userName: string | null;
  userRole: string | null;
  menu: MenuSection[]; 
}

// 3. Add default 'menu' to createContext
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  permissions: [],
  userName: null,
  userRole: null,
  menu: [], 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [permissions, setPermissions] = useState<string[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // 4. Add state for the menu
  const [menu, setMenu] = useState<MenuSection[]>([]); 

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      const savedName = localStorage.getItem("userName");
      const savedRole = localStorage.getItem("userRole");
      const savedPerms = localStorage.getItem("permissions");
      // 5. Retrieve the menu from localStorage
      const savedMenu = localStorage.getItem("menu"); 

      if (token) {
        setIsAuthenticated(true);
        setUserName(savedName);
        setUserRole(savedRole);
        
        // Parse permissions and menu safely
        try {
          setPermissions(savedPerms ? JSON.parse(savedPerms) : []);
          setMenu(savedMenu ? JSON.parse(savedMenu) : []);
        } catch {
          setPermissions([]);
          setMenu([]);
        }

        if (pathname === "/login") {
          router.push("/");
        }
      } else {
        setIsAuthenticated(false);
        setUserName(null);
        setUserRole(null);
        setPermissions([]);
        setMenu([]);
        
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  return (
    // 6. Provide the menu state to the rest of the app
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        permissions, 
        userName, 
        userRole,
        menu 
      }}
    >
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);