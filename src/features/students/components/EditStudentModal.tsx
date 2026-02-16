// src/features/students/components/EditStudentModal.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  X, Loader2, UserCircle2, User, Mail, Phone, MapPin, 
  Users, Save, Trash2, UserCheck, UserX, Calendar 
} from "lucide-react";
import { studentService } from "../services/studentApi";
import { Student, UpdateStudentRequest, Gender } from "../types";
import { toast } from "sonner";

interface EditStudentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditStudentModal({
  student,
  isOpen,
  onClose,
  onSuccess,
}: EditStudentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateStudentRequest>({
    name: student.name,
    email: student.email,
    phoneNumber: student.phoneNumber,
    guardianName: student.guardianName || "",
    guardianPhone: student.guardianPhone || "",
    address: student.address,
    isActive: student.isActive,
    dateOfBirth: student.dateOfBirth || "", // Added
    gender: student.gender || "MALE",        // Added
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: student.name,
        email: student.email,
        phoneNumber: student.phoneNumber,
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
        address: student.address,
        isActive: student.isActive,
        dateOfBirth: student.dateOfBirth || "",
        gender: student.gender || "MALE",
      });
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentService.updateStudent(student.id, formData);
      toast.success("Profile updated successfully");
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will deactivate the student account.")) return;
    setLoading(true);
    try {
      await studentService.deleteStudent(student.id);
      toast.success("Student deleted");
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-white/20">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white"><UserCircle2 size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Student Profile</h2>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">STU-{student.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${formData.isActive ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"}`}
            >
              {formData.isActive ? <UserCheck size={14} /> : <UserX size={14} />} {formData.isActive ? "ACTIVE" : "INACTIVE"}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="overflow-y-auto p-8 space-y-8 text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Account & Birth Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Core Account</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>
              
              {/* DATE OF BIRTH SECTION */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="date" className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                </div>
              </div>

              {/* GENDER SECTION */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Gender</label>
                <div className="flex gap-2">
                  {(["MALE", "FEMALE", "OTHER"] as Gender[]).map((g) => (
                    <button key={g} type="button" onClick={() => setFormData({ ...formData, gender: g })} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border transition-all ${formData.gender === g ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Guardian */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Contact & Guardian</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Student Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Guardian Name</label>
                  <input className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold" value={formData.guardianName} onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Guardian Phone</label>
                  <input className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold" value={formData.guardianPhone} onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 text-slate-300" size={18} />
                  <textarea rows={2} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none text-sm font-medium" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            <button type="button" onClick={handleDelete} className="px-6 py-2.5 rounded-2xl text-red-500 hover:bg-red-50 font-bold text-sm transition-all flex items-center gap-2"><Trash2 size={18} /> Delete Student</button>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold transition-colors text-sm">Cancel</button>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-2.5 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 disabled:bg-blue-300 flex items-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}