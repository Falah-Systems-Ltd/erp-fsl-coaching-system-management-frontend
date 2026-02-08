// src/app/(dashboard)/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/shared/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext"; // Import your hook
import { Bell, User, LogOut, Search, Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // 1. Destructure the dynamic user data from your context
  const { userRole, userName } = useAuth(); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-xs ml-2 w-48 text-slate-900" 
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-2" />
            
            <div className="flex items-center gap-3 pl-2">
              {/* 2. Dynamic Identity Section */}
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">
                  {userName || "User"} 
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                  {userRole?.replace("_", " ") || "Member"}
                </p>
              </div>

              <button className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm overflow-hidden">
                {/* 3. Optional: Show initials if no image */}
                <span className="text-xs font-bold">
                  {userName ? userName.charAt(0) : <User size={18} />}
                </span>
              </button>

              <button 
                onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}