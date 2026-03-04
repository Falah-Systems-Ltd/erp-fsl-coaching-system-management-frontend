// src/features/teachers/components/EditTeacherModal.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Trash2, 
  Save 
} from "lucide-react";
import { teacherService } from "../services/teacherApi";
import { Teacher, UpdateTeacherRequest } from "../types";
import { toast } from "sonner";

interface EditTeacherModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditTeacherModal({ 
  teacher, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditTeacherModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateTeacherRequest>({
    name: teacher.name, 
    phoneNumber: teacher.phoneNumber, 
    designation: teacher.designation, 
    subject: teacher.subject, 
    address: teacher.address
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ 
        name: teacher.name, 
        phoneNumber: teacher.phoneNumber, 
        designation: teacher.designation, 
        subject: teacher.subject, 
        address: teacher.address 
      });
    }
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try { 
      await teacherService.updateTeacher(teacher.id, formData); 
      toast.success("Teacher profile updated successfully!"); 
      onSuccess(); 
      onClose(); 
    } catch (error) {
      console.error("Failed to update teacher" + error);
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async () => {
    if(!confirm("Are you sure you want to permanently delete this teacher profile?")) return;
    setLoading(true);
    try { 
      await teacherService.deleteTeacher(teacher.id); 
      toast.success("Teacher deleted successfully!"); 
      onSuccess(); 
      onClose(); 
    } catch (error) {
      // Handled by interceptor
      console.error("Failed to delete teacher" + error);
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-white/20">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Teacher Profile</h2>
            <p className="text-xs text-purple-600 font-bold uppercase tracking-widest">TCH-{teacher.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpdate} className="overflow-y-auto p-8 space-y-8 text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Core Account</h3>
               
               {/* Read Only Email */}
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email (Read Only)</label>
                 <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 text-sm italic">
                   <Mail size={16} /> {teacher.email}
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                 <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input required className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                 <div className="relative">
                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input required className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                 </div>
               </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Professional Details</h3>
               
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Designation</label>
                 <div className="relative">
                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input required className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Assigned Subject</label>
                 <div className="relative">
                   <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input required className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
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

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
             <button type="button" onClick={handleDelete} className="px-6 py-2.5 rounded-2xl text-red-500 hover:bg-red-50 font-bold flex items-center gap-2 transition-all">
               <Trash2 size={18} /> Delete Profile
             </button>
             <div className="flex gap-3">
               <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold transition-colors">
                 Cancel
               </button>
               <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-2.5 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center gap-2 active:scale-95 transition-all disabled:bg-blue-300">
                 {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
               </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}