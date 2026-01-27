// src/features/admins/components/AddAdminModal.tsx
"use client";

import { useState, useMemo } from "react";
import { X, Loader2, ShieldPlus, User, Mail, Lock, Phone } from "lucide-react";
import { adminService } from "../services/adminApi";
import { RegisterAdminRequest } from "../types";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePermissions: string[];
  onSuccess: () => void;
}

export default function AddAdminModal({
  isOpen,
  onClose,
  availablePermissions,
  onSuccess,
}: AddAdminModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<RegisterAdminRequest>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    permissions: [],
  });

  const groupedPermissions = useMemo(() => {
    return availablePermissions.reduce(
      (acc, perm) => {
        const [module, action] = perm.split(":");
        if (!acc[module]) acc[module] = [];
        acc[module].push(action);
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, [availablePermissions]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.registerAdmin(formData);
      onSuccess();
      onClose();
      setFormData({ name: "", email: "", password: "", phoneNumber: "", permissions: [] }); 
    } catch (error) {
      // Axios interceptor handles the toast notifications
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (perm: string) => {
    const [module, action] = perm.split(":");
    let currentPerms = [...formData.permissions];
    const isAdding = !currentPerms.includes(perm);

    if (isAdding) {
      // CASCADING ADDITION
      currentPerms.push(perm);
      if (action === "write") {
        if (!currentPerms.includes(`${module}:read`)) currentPerms.push(`${module}:read`);
      }
      if (action === "delete") {
        if (!currentPerms.includes(`${module}:read`)) currentPerms.push(`${module}:read`);
        if (!currentPerms.includes(`${module}:write`)) currentPerms.push(`${module}:write`);
      }
    } else {
      // CASCADING REMOVAL
      currentPerms = currentPerms.filter((p) => p !== perm);
      if (action === "read") {
        currentPerms = currentPerms.filter((p) => p !== `${module}:write` && p !== `${module}:delete`);
      }
      if (action === "write") {
        currentPerms = currentPerms.filter((p) => p !== `${module}:delete`);
      }
    }

    setFormData((prev) => ({ ...prev, permissions: [...new Set(currentPerms)] }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-white/20 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white"><ShieldPlus size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">New Administrator</h2>
              <p className="text-xs text-slate-500">Assign module-specific permissions with access hierarchy.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8 text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Input Fields */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input placeholder="Full Name" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input placeholder="Phone Number" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Module Access Control</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groupedPermissions).map(([module, actions]) => (
                <div key={module} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{module}</span>
                  <div className="flex gap-4">
                    {/* Fixed Sort: View -> Edit -> Delete */}
                    {["read", "write", "delete"]
                      .filter(action => actions.includes(action))
                      .map((action) => {
                        const permKey = `${module}:${action}`;
                        const accentColor = action === "read" ? "accent-blue-600" : action === "write" ? "accent-amber-500" : "accent-red-500";

                        return (
                          <label key={action} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <input type="checkbox" checked={formData.permissions.includes(permKey)} className={`w-5 h-5 rounded border-slate-300 ${accentColor} focus:ring-blue-500`} onChange={() => togglePermission(permKey)} />
                            <span className="text-[9px] font-bold text-slate-400 uppercase group-hover:text-slate-600">
                              {action === "read" ? "VIEW" : action === "write" ? "EDIT" : "DEL"}
                            </span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 font-semibold transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-2.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:bg-blue-300 flex items-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />}
              Create Administrator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}