"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  userName: string | null;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  permissions: [],
  userName: null,
  userRole: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Added missing state variables
  const [permissions, setPermissions] = useState<string[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      // 2. Retrieve extra user data from localStorage
      const savedName = localStorage.getItem("userName");
      const savedRole = localStorage.getItem("userRole");
      const savedPerms = localStorage.getItem("permissions");

      if (token) {
        setIsAuthenticated(true);
        setUserName(savedName);
        setUserRole(savedRole);
        
        // Ensure permissions are parsed correctly from JSON string
        try {
          setPermissions(savedPerms ? JSON.parse(savedPerms) : []);
        } catch {
          setPermissions([]);
        }

        if (pathname === "/login") {
          router.push("/");
        }
      } else {
        setIsAuthenticated(false);
        setUserName(null);
        setUserRole(null);
        setPermissions([]);
        
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  return (
    // 3. Pass all required properties into the value prop
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        permissions, 
        userName, 
        userRole 
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