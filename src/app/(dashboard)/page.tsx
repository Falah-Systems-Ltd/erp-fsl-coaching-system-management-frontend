// src/app/(dashboard)/page.tsx
"use client";

import { useState } from "react";

export default function DashboardPage() {
  // Use a "Lazy Initializer" function to set the state only once on load
  const [userName] = useState(() => {
    // This runs only once when the component is first created
    if (typeof window !== "undefined") {
      return localStorage.getItem("userName") || "User";
    }
    return "User";
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, <span className="text-blue-600">{userName}</span>! 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Here is what&apos;s happening in your coaching center today.
        </p>
      </div>

      {/* Example Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Students</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,284</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Today&apos;s Attendance</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">92%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending Fees</p>
          <p className="text-2xl font-bold text-red-600 mt-1">৳ 45,000</p>
        </div>
      </div>
    </div>
  );
}