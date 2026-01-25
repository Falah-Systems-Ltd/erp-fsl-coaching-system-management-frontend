// src/app/(dashboard)/admins/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { adminService } from "@/features/admins/services/adminApi";
import {
  Admin,
  AdminListResponse,
  UpdateAdminRequest,
} from "@/features/admins/types";
import AddAdminModal from "@/features/admins/components/AddAdminModal";
import {
  Loader2,
  Check,
  X,
  UserPlus,
  ShieldCheck,
  Search,
  MoreVertical,
  UserMinus,
  Ban,
  Edit3,
  RotateCcw,
  Trash2,
} from "lucide-react";

type FilterStatus = "active" | "blocked" | "deleted";

export default function AdminsPage() {
  const [data, setData] = useState<AdminListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("active");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateAdminRequest>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdmins(statusFilter);
      setData(res);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const groupedPermissions = useMemo(() => {
    return (
      data?.availablePermissions.reduce(
        (acc, perm) => {
          const [module, action] = perm.split(":");
          if (!acc[module]) acc[module] = [];
          acc[module].push(action);
          return acc;
        },
        {} as Record<string, string[]>,
      ) || {}
    );
  }, [data?.availablePermissions]);

  const filteredAdmins = useMemo(() => {
    return (
      data?.admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || []
    );
  }, [data, searchQuery]);

  // Restored Toggle Permission Logic
  const togglePermission = (perm: string) => {
    const current = editForm.permissions || [];
    const updated = current.includes(perm)
      ? current.filter((p) => p !== perm)
      : [...current, perm];
    setEditForm({ ...editForm, permissions: updated });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await adminService.updateAdmin(editingId, editForm);
      setEditingId(null);
      await loadAdmins();
    } catch (error) {
      alert("Update failed");
    }
  };

  const handleAction = async (id: number, action: string) => {
    try {
      if (action === "block")
        await adminService.updateAdmin(id, { isActive: false });
      if (action === "activate")
        await adminService.updateAdmin(id, { isActive: true });
      if (action === "restore") await adminService.restoreAdmin(id);
      if (action === "soft-delete") await adminService.softDeleteAdmin(id);
      if (action === "hard-delete") {
        if (confirm("Permanently delete this admin?"))
          await adminService.permanentDeleteAdmin(id);
        else return;
      }
      await loadAdmins();
      setActiveMenuId(null);
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div className="space-y-6 pb-40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Administrators</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
            {(["active", "blocked", "deleted"] as FilterStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${statusFilter === status ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {status}
                </button>
              ),
            )}
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm bg-white"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            <UserPlus size={18} /> Add Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse min-w-[1000px] overflow-visible">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-xs font-bold text-slate-500 uppercase sticky left-0 bg-slate-50 z-20 border-r border-slate-50">
                  Admin Profile
                </th>
                {Object.entries(groupedPermissions).map(([module, actions]) => (
                  <th
                    key={module}
                    className="p-4 text-center border-l border-slate-100"
                  >
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                      {module}
                    </span>
                    <div className="flex justify-center gap-3 mt-2 font-bold text-slate-400 text-[8px]">
                      {actions.map((a) => (
                        <span key={a}>{a[0].toUpperCase()}</span>
                      ))}
                    </div>
                  </th>
                ))}
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right sticky right-0 bg-slate-50 z-20 border-l border-slate-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAdmins.map((admin, index) => {
                const isLastRow =
                  filteredAdmins.length > 2 &&
                  index >= filteredAdmins.length - 2;
                const isEditing = editingId === admin.id;

                return (
                  <tr
                    key={admin.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="p-5 sticky left-0 bg-white z-10 border-r border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                          {admin.name[0]}
                        </div>
                        <div>
                          {isEditing ? (
                            <input
                              className="border border-blue-200 p-1 rounded text-xs w-32"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <>
                              <div className="font-bold text-slate-900 text-sm">
                                {admin.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {admin.email}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {Object.entries(groupedPermissions).map(
                      ([module, actions]) => (
                        <td
                          key={module}
                          className="p-4 border-l border-slate-50"
                        >
                          <div className="flex justify-center gap-3">
                            {actions.map((action) => {
                              const permKey = `${module}:${action}`;
                              const isChecked = isEditing
                                ? editForm.permissions?.includes(permKey)
                                : admin.permissions.includes(permKey);

                              // 1. Define colors for View Mode (text color)
                              const color =
                                action === "read"
                                  ? "text-blue-600"
                                  : action === "write"
                                    ? "text-amber-500"
                                    : "text-red-500";

                              // 2. Define colors for Edit Mode (checkbox accent color) [Fix applies here]
                              const accentColor =
                                action === "read"
                                  ? "accent-blue-600"
                                  : action === "write"
                                    ? "accent-amber-500"
                                    : "accent-red-500";

                              return isEditing ? (
                                // Edit Mode: Native Checkbox with dynamic accent color
                                <input
                                  key={action}
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(permKey)}
                                  // Use dynamic accentColor here instead of hardcoded accent-blue-600
                                  className={`w-5 h-5 rounded ${accentColor} cursor-pointer transition-transform active:scale-95`}
                                />
                              ) : (
                                // View Mode: Styled Indicator
                                <div
                                  key={action}
                                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${isChecked ? `${color} border-current bg-current/10` : "border-slate-200"}`}
                                >
                                  {isChecked && (
                                    <Check size={12} strokeWidth={4} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      ),
                    )}

                    <td className="p-5 text-right sticky right-0 bg-white z-10 border-l border-slate-50 overflow-visible">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:bg-green-50 p-1 rounded"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(
                                activeMenuId === admin.id ? null : admin.id,
                              );
                            }}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                          >
                            <MoreVertical size={20} />
                          </button>
                          {activeMenuId === admin.id && (
                            <div
                              className={`absolute right-0 w-48 bg-white border border-slate-100 rounded-xl shadow-2xl z-[100] p-1 text-left animate-in fade-in slide-in-from-top-2 ${isLastRow ? "bottom-full mb-2" : "top-full mt-2"}`}
                            >
                              {statusFilter === "deleted" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAction(admin.id, "restore")
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-50 rounded-lg"
                                  >
                                    <RotateCcw size={14} /> Restore Admin
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction(admin.id, "hard-delete")
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 size={14} /> Delete Permanently
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingId(admin.id);
                                      setEditForm({
                                        ...admin,
                                        permissions: [...admin.permissions],
                                      });
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
                                  >
                                    <Edit3 size={14} /> Edit Permissions
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction(
                                        admin.id,
                                        admin.isActive ? "block" : "activate",
                                      )
                                    }
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg ${admin.isActive ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"}`}
                                  >
                                    <Ban size={14} />{" "}
                                    {admin.isActive
                                      ? "Block Admin"
                                      : "Make Active"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction(admin.id, "soft-delete")
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <UserMinus size={14} /> Move to Deleted
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {data && (
        <AddAdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          availablePermissions={data.availablePermissions}
          onSuccess={loadAdmins}
        />
      )}
    </div>
  );
}
