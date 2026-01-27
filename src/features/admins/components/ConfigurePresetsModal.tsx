// src/features/admins/components/ConfigurePresetsModal.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  X,
  Loader2,
  Save,
  Trash2,
  Plus,
  ShieldCheck,
  Settings2,
} from "lucide-react";
import { adminService } from "../services/adminApi";
import { toast } from "sonner"; // For consistent 2026 ERP feedback
import { presetService } from "../services/presetApi";
import { CreatePresetRequest } from "../types";

interface Preset {
  id: number;
  name: string;
  permissions: string[];
}

interface ConfigurePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePermissions: string[];
}

export default function ConfigurePresetsModal({
  isOpen,
  onClose,
  availablePermissions,
}: ConfigurePresetsModalProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Partial<Preset> | null>(
    null,
  );

  // Fetch presets when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPresets();
    }
  }, [isOpen]);

  const loadPresets = async () => {
    try {
      const data = await presetService.getPresets();
      setPresets(data);
    } catch (error) {
      console.error("Failed to load presets");
    }
  };

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

  const togglePermission = (perm: string) => {
    if (!selectedPreset) return;
    const [module, action] = perm.split(":");
    let currentPerms = [...(selectedPreset.permissions || [])];
    const isAdding = !currentPerms.includes(perm);

    // Cascading Logic - Same as AddAdminModal for consistency
    if (isAdding) {
      currentPerms.push(perm);
      if (action === "write") {
        if (!currentPerms.includes(`${module}:read`))
          currentPerms.push(`${module}:read`);
      }
      if (action === "delete") {
        if (!currentPerms.includes(`${module}:read`))
          currentPerms.push(`${module}:read`);
        if (!currentPerms.includes(`${module}:write`))
          currentPerms.push(`${module}:write`);
      }
    } else {
      currentPerms = currentPerms.filter((p) => p !== perm);
      if (action === "read") {
        currentPerms = currentPerms.filter(
          (p) => p !== `${module}:write` && p !== `${module}:delete`,
        );
      }
      if (action === "write") {
        currentPerms = currentPerms.filter((p) => p !== `${module}:delete`);
      }
    }
    setSelectedPreset({
      ...selectedPreset,
      permissions: [...new Set(currentPerms)],
    });
  };

  const handleSave = async () => {
    // 1. Validation check
    if (
      !selectedPreset?.name ||
      !selectedPreset.permissions ||
      selectedPreset.permissions.length === 0
    ) {
      toast.error("Please provide a name and at least one permission.");
      return;
    }

    setLoading(true);
    try {
      if (selectedPreset.id) {
        // Update existing preset
        await presetService.updatePreset(selectedPreset.id, {
          name: selectedPreset.name,
          permissions: selectedPreset.permissions,
        });
        toast.success("Preset updated successfully");
      } else {
        // Create new preset - explicitly casting to the correct Request type
        const newPreset: CreatePresetRequest = {
          name: selectedPreset.name,
          permissions: selectedPreset.permissions,
        };

        await presetService.createPreset(newPreset);
        toast.success("New preset created");
      }

      setSelectedPreset(null);
      loadPresets();
    } catch (error) {
      // Error handling is managed by the Axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this preset?")) return;
    try {
      await presetService.deletePreset(id);
      toast.success("Preset removed");
      setSelectedPreset(null);
      loadPresets();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col border border-white/20">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Settings2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Permission Presets
              </h2>
              <p className="text-xs text-slate-500">
                Create reusable role templates for your team.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar: Existing Presets List */}
          <div className="w-1/3 border-r bg-slate-50/30 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => setSelectedPreset({ name: "", permissions: [] })}
              className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all font-bold text-xs"
            >
              <Plus size={16} /> New Preset
            </button>
            <div className="space-y-1 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">
                Saved Presets
              </span>
              {presets.map((p) => (
                <div key={p.id} className="group relative">
                  <button
                    onClick={() => setSelectedPreset(p)}
                    className={`w-full text-left p-4 rounded-2xl transition-all ${selectedPreset?.id === p.id ? "bg-blue-600 text-white shadow-lg" : "hover:bg-white text-slate-700 hover:shadow-sm"}`}
                  >
                    <div className="font-bold text-sm">{p.name}</div>
                    <div
                      className={`text-[10px] ${selectedPreset?.id === p.id ? "text-blue-100" : "text-slate-400"}`}
                    >
                      {p.permissions.length} Permissions
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Workspace: Editing Area */}
          <div className="flex-1 overflow-y-auto bg-white p-8">
            {selectedPreset ? (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                    Preset Name
                  </label>
                  <input
                    placeholder="e.g., Accountant, Teacher"
                    value={selectedPreset.name}
                    onChange={(e) =>
                      setSelectedPreset({
                        ...selectedPreset,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-600" />
                    Configure Access
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(groupedPermissions).map(
                      ([module, actions]) => (
                        <div
                          key={module}
                          className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3"
                        >
                          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                            {module}
                          </span>
                          <div className="flex gap-4">
                            {["read", "write", "delete"]
                              .filter((action) => actions.includes(action))
                              .map((action) => {
                                const permKey = `${module}:${action}`;
                                const accentColor =
                                  action === "read"
                                    ? "accent-blue-600"
                                    : action === "write"
                                      ? "accent-amber-500"
                                      : "accent-red-500";
                                return (
                                  <label
                                    key={action}
                                    className="flex flex-col items-center gap-1 cursor-pointer group"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedPreset.permissions?.includes(
                                        permKey,
                                      )}
                                      className={`w-5 h-5 rounded border-slate-300 ${accentColor}`}
                                      onChange={() => togglePermission(permKey)}
                                    />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                                      {action[0]}
                                    </span>
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95 disabled:bg-blue-300"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    {selectedPreset.id ? "Update Preset" : "Save Preset"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold">
                    No Preset Selected
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Select an existing role or create a new one to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
