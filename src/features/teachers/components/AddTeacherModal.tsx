// src/features/teachers/components/AddTeacherModal.tsx
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
  Briefcase, 
  BookOpen 
} from "lucide-react";
import { teacherService } from "../services/teacherApi";
import { CreateTeacherRequest, Gender } from "../types";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTeacherModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: AddTeacherModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTeacherRequest>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    designation: "",
    subject: "",
    gender: "MALE",
    address: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await teacherService.createTeacher(formData);
      onSuccess();
      onClose();
      setFormData({ 
        name: "", 
        email: "", 
        password: "", 
        phoneNumber: "", 
        designation: "", 
        subject: "", 
        gender: "MALE", 
        address: "" 
      });
    } catch (error) {
        console.error("Failed to create teacher" + error);
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
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add New Teacher</h2>
              <p className="text-xs text-slate-500">Create staff account and profile.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8 text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Account Fields */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Account Details</h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required placeholder="e.g. John Doe" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required type="email" placeholder="john@school.com" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required type="password" placeholder="Min 8 characters" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Right Column: Professional Fields */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Professional Profile</h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required placeholder="e.g. Senior Lecturer" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Subject</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required placeholder="e.g. Mathematics" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required placeholder="+880 1..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                </div>
              </div>
            </div>
            
            {/* Full Width Fields */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Gender</label>
                 <div className="flex gap-4">
                   {(["MALE", "FEMALE", "OTHER"] as Gender[]).map(g => (
                     <button type="button" key={g} onClick={() => setFormData({...formData, gender: g})} className={`flex-1 py-3.5 rounded-2xl text-xs font-bold border transition-all ${formData.gender === g ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                       {g}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Residential Address</label>
                 <div className="relative">
                   <MapPin className="absolute left-3 top-4 text-slate-300" size={18} />
                   <textarea required rows={2} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                 </div>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-2.5 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 disabled:bg-blue-300 flex items-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />} Save Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}