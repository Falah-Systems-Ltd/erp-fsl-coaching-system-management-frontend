// src/features/students/components/AddStudentModal.tsx
"use client";

import { useState } from "react";
import { 
  X, 
  Loader2, 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Calendar, 
  Users 
} from "lucide-react";
import { studentService } from "../services/studentApi";
import { CreateStudentRequest, Gender } from "../types";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onSuccess,
}: AddStudentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    guardianName: "",
    guardianPhone: "",
    dateOfBirth: "",
    gender: "MALE",
    address: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentService.registerStudent(formData);
      onSuccess();
      onClose();
      setFormData({
        name: "", email: "", password: "", phoneNumber: "",
        guardianName: "", guardianPhone: "", dateOfBirth: "",
        gender: "MALE", address: "",
      });
    } catch (error) {
      // Global Axios interceptor handles toasts
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-white/20 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white"><UserPlus size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Register New Student</h2>
              <p className="text-xs text-slate-500">Create an account and linked student profile.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8 text-slate-900">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 tracking-tight">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input placeholder="Student's Name" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="email" placeholder="student@example.com" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="password" placeholder="Min 6 characters" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input placeholder="+880 1..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 tracking-tight">Personal Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Guardian Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input placeholder="Guardian Full Name" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.guardianName} onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Guardian Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input placeholder="Guardian Contact" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.guardianPhone} onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="date" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none" required value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</label>
                <div className="flex gap-4">
                  {(["MALE", "FEMALE", "OTHER"] as Gender[]).map((g) => (
                    <button key={g} type="button" onClick={() => setFormData({ ...formData, gender: g })} className={`flex-1 py-3 rounded-2xl text-xs font-bold border transition-all ${formData.gender === g ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 text-slate-300" size={18} />
                  <textarea placeholder="Present address..." rows={2} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-2.5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:bg-blue-300 flex items-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />} Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}