// src/app/(dashboard)/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shadow-xl">
        <div className="p-6 text-white text-xl font-bold border-b border-slate-800">
          Coaching ERP
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className={`block p-3 rounded-lg ${pathname === "/" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}>
            Dashboard
          </Link>
          <Link href="/attendance" className={`block p-3 rounded-lg ${pathname === "/attendance" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}>
            Attendance
          </Link>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <span className="font-semibold text-slate-700">Management Panel</span>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}