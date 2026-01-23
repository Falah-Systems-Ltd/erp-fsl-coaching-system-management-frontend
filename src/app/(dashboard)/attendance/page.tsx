// src/app/(dashboard)/attendance/page.tsx
"use client";

import { useState } from "react";

export default function AttendancePage() {
  const [search, setSearch] = useState("");

  // Static dummy data for the table
  const dummyStudents = [
    { id: "S101", name: "Riad Hasan", batch: "Batch A", status: "Present" },
    { id: "S102", name: "Tajkia Sultana", batch: "Batch B", status: "Absent" },
    { id: "S103", name: "Ariful Islam", batch: "Batch A", status: "Late" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Student Attendance</h1>
        <p className="text-slate-500 mt-1">Manage daily presence for coaching batches.</p>
        
        {/* Search Bar - Dummy implementation */}
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            placeholder="Search by ID or Name..."
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95">
            Filter
          </button>
        </div>
      </div>

      {/* Static Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-sm font-semibold text-slate-600">Student ID</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Full Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Batch</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {dummyStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 text-sm text-slate-700 font-medium">{student.id}</td>
                <td className="p-4 text-sm text-slate-700">{student.name}</td>
                <td className="p-4 text-sm text-slate-500">{student.batch}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    student.status === "Present" ? "bg-green-100 text-green-700" : 
                    student.status === "Absent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  <button className="text-blue-600 hover:underline font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State message */}
        <div className="p-10 text-center text-slate-400 italic bg-slate-50/30">
          Showing dummy data. API integration is not yet connected.
        </div>
      </div>
    </div>
  );
}