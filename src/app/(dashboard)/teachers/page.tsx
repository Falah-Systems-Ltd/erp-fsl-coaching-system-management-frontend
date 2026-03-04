"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { teacherService } from "@/features/teachers/services/teacherApi";
import { Teacher } from "@/features/teachers/types";
import AddTeacherModal from "@/features/teachers/components/AddTeacherModal"; 
import EditTeacherModal from "@/features/teachers/components/EditTeacherModal";

import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Briefcase, 
  BookOpen, 
  MapPin,
} from "lucide-react";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teacherService.getTeachers(); //
      setTeachers(data);
    } catch (error) {
      console.error("Failed to fetch teachers" + error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teachers, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Academic Staff</h1>
          <p className="text-sm text-slate-500">Manage teachers, lecturers, and department heads.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              placeholder="Search by name, subject..."
              className="pl-9 pr-4 h-10 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-80 text-sm bg-white shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-5 h-10 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <UserPlus size={18} /> Add Teacher
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-5">Teacher Profile</th>
                <th className="p-5">Designation & Subject</th>
                <th className="p-5">Contact Details</th>
                <th className="p-5">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-medium">Loading Staff Data...</td></tr>
              ) : filteredTeachers.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-medium">No teachers found.</td></tr>
              ) : filteredTeachers.map((teacher) => (
                <tr 
                  key={teacher.id} 
                  onClick={() => setSelectedTeacher(teacher)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-all group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{teacher.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: TCH-{teacher.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                        <Briefcase size={14} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
                        {teacher.designation}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                        <BookOpen size={10} /> {teacher.subject}
                      </div>
                    </div>
                  </td>

                  <td className="p-5 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <Mail size={12} className="text-blue-500" /> {teacher.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <Phone size={12} className="text-green-500" /> {teacher.phoneNumber}
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="flex items-start gap-2 max-w-[250px]">
                      <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {teacher.address}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddTeacherModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={loadTeachers} 
      />

      {selectedTeacher && (
        <EditTeacherModal
          teacher={selectedTeacher}
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onSuccess={loadTeachers}
        />
      )}
    </div>
  );
}