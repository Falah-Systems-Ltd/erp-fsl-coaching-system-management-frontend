// src/app/(dashboard)/students/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { studentService } from "@/features/students/services/studentApi";
import { Student } from "@/features/students/types";
import AddStudentModal from "@/features/students/components/AddStudentModal"; 
import EditStudentModal from "@/features/students/components/EditStudentModal";
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  User as UserIcon,
  Users
} from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.guardianName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [students, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-black tracking-tight uppercase">Kepler Students</h1>
          <p className="text-sm text-slate-500">Manage directory and academic accounts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              placeholder="Search by name, email, or guardian..."
              className="pl-9 pr-4 h-10 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-80 text-sm bg-white shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-5 h-10 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <UserPlus size={18} /> Register Student
          </button>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1250px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-5">Student Info</th>
                <th className="p-5">Guardian Info</th>
                <th className="p-5">Contact Details</th>
                <th className="p-5">Birth & Gender</th>
                <th className="p-5">Residential Address</th>
                <th className="p-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-slate-400 font-medium">Loading Student Data...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-slate-400 font-medium">No students found.</td></tr>
              ) : filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  onClick={() => setSelectedStudent(student)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-all group"
                >
                  {/* Student Info */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: STU-{student.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Guardian Info */}
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                        <Users size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                        {student.guardianName || "N/A"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">{student.guardianPhone || "No Phone"}</div>
                    </div>
                  </td>

                  {/* Contact Details */}
                  <td className="p-5 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <Mail size={12} className="text-blue-500" /> {student.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <Phone size={12} className="text-green-500" /> {student.phoneNumber}
                    </div>
                  </td>

                  {/* Birth & Gender */}
                  <td className="p-5 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <Calendar size={12} className="text-amber-500" /> {student.dateOfBirth || "N/A"}
                    </div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{student.gender || "Gender Not Set"}</div>
                  </td>

                  {/* Address */}
                  <td className="p-5">
                    <div className="flex items-start gap-2 max-w-[220px]">
                      <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {student.address || "No address provided"}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${student.isActive ? 'bg-green-100 text-green-600 border-green-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={loadStudents} 
      />

      {/* Edit Student Modal */}
      {selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSuccess={loadStudents}
        />
      )}
    </div>
  );
}