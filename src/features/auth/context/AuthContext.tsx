"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext<{ isAuthenticated: boolean; isLoading: boolean }>({
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      // Logic: Check for your token in localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        // If not logged in and trying to access dashboard, redirect to login
        if (pathname !== "/login") {
          router.push("/login");
        }
      } else {
        setIsAuthenticated(true);
        // If logged in and trying to access login page, redirect to dashboard
        if (pathname === "/login") {
          router.push("/");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {/* While checking auth, show a simple loading spinner */}
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