// src/components/shared/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { MENU_STRUCTURE } from "@/config/menu-config";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { permissions, userRole } = useAuth();

  const hasAccess = (perm: string) => userRole === "SUPER_ADMIN" || permissions.includes(perm);

  return (
    <aside className={`${isCollapsed ? "w-20" : "w-72"} bg-white border-r border-slate-200 h-screen flex flex-col transition-all duration-300 shadow-sm`}>
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
        {!isCollapsed && <span className="font-bold text-xl text-blue-600">Kepler BD</span>}
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500">
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-8">
        {MENU_STRUCTURE.map((group) => {
          const visibleItems = group.items.filter(item => hasAccess(item.permission));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.section} className="px-4">
              {!isCollapsed && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                  {group.section}
                </p>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`flex items-center p-3 rounded-xl transition-all group ${
                        isActive 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {!isCollapsed && (
                        <span className="ml-3 font-medium text-sm">{item.title}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}