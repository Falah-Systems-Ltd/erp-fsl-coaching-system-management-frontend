"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth , MenuSection, MenuItem} from "@/features/auth/context/AuthContext"; 

import { 
  LayoutDashboard, 
  Shield, 
  UserCog, 
  Users,
  UserCheck, 
  GraduationCap,
  ClipboardCheck, 
  BookOpen,
  FileText,
  DollarSign,
  BarChart,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LucideIcon 
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

// 2. Map the exact string your Spring Boot backend sends to the Lucide component
const IconMap: Record<string, LucideIcon> = {
  LayoutDashboard: LayoutDashboard,
  Shield: Shield,
  UserCog: UserCog,
  Users: Users,
  UserCheck: UserCheck,
  GraduationCap: GraduationCap,
  ClipboardCheck: ClipboardCheck,
  BookOpen: BookOpen,
  FileText: FileText,
  DollarSign: DollarSign,
  BarChart: BarChart,
  Award: Award,
  Calendar: Calendar,
};

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  
  // 3. Pull the dynamic menu array directly from your Auth Context
  const { menu } = useAuth(); 

  // Fallback while loading or if menu is missing
  if (!menu || menu.length === 0) {
    return null; // Or a loading skeleton
  }

  return (
    <aside className={`
      ${isCollapsed ? "w-20" : "w-72"} 
      bg-white border-r border-slate-200 h-screen flex flex-col transition-all duration-300 ease-in-out z-50
    `}>
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <GraduationCap size={20} />
          </div>
          {!isCollapsed && <span className="font-black text-xl tracking-tighter uppercase">KEPLER</span>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-8 no-scrollbar">
        {/* 4. Map directly over the backend array. No filtering needed! */}
        {menu.map((group: MenuSection) => (
            <div key={group.section} className="px-4">
              {!isCollapsed && (
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">
                  {group.section}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item: MenuItem) => {
                  
                  // Match backend string to icon, default to LayoutDashboard if mismatch
                  const Icon = IconMap[item.icon] || LayoutDashboard; 
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`
                        flex items-center p-3 rounded-2xl transition-all group relative
                        ${isActive 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                      `}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      {!isCollapsed && (
                        <span className={`ml-3 text-sm ${isActive ? "font-bold" : "font-semibold"}`}>
                          {item.title}
                        </span>
                      )}
                      {isCollapsed && isActive && (
                        <div className="absolute right-0 w-1 h-6 bg-white rounded-l-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
      
      {/* Sidebar Footer Support Card */}
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
          <div className="bg-blue-600 rounded-2xl p-4 text-white space-y-1 shadow-inner relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 bg-white/10 w-20 h-20 rounded-full blur-2xl" />
             <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Support</p>
             <p className="text-[10px] leading-relaxed">Need help with Kepler? Check our guides.</p>
          </div>
        </div>
      )}
    </aside>
  );
}