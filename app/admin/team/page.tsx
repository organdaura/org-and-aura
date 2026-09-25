"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  UserCheck,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: "FOUNDER" | "TEAM" | "MENTOR";
  imageRef: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  FOUNDER: "Founder",
  TEAM: "Core Team",
  MENTOR: "Mentor / Advisor",
};

const TYPE_COLORS: Record<string, string> = {
  FOUNDER: "bg-amber-100 text-amber-800 border-amber-200",
  TEAM: "bg-emerald-100 text-emerald-800 border-emerald-200",
  MENTOR: "bg-blue-100 text-blue-800 border-blue-200",
};

const PRESET_AVATARS = [
  "/assets/team/founder-1.svg",
  "/assets/team/founder-2.svg",
  "/assets/team/team-1.svg",
  "/assets/team/team-2.svg",
  "/assets/team/mentor-1.svg",
  "/assets/team/mentor-2.svg",
];

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "FOUNDER" | "TEAM" | "MENTOR">("ALL");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formType, setFormType] = useState<"FOUNDER" | "TEAM" | "MENTOR">("TEAM");
  const [formImageRef, setFormImageRef] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formPublished, setFormPublished] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const json = await res.json();
      if (json.success) {
        setMembers(json.data);
      }
    } catch (e) {
      console.error("Failed to load members:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setFormName("");
    setFormRole("");
    setFormType(activeTab === "ALL" ? "TEAM" : activeTab);
    setFormImageRef("");
    setFormDisplayOrder(members.length);
    setFormPublished(true);
    setFeedback(null);
    setModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormType(member.type);
    setFormImageRef(member.imageRef || "");
    setFormDisplayOrder(member.displayOrder);
    setFormPublished(member.published);
    setFeedback(null);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Upload failed.");
      }

      setFormImageRef(json.url);
      setFeedback({ type: "success", text: "Image uploaded successfully!" });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to upload file." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingMember) {
        // PATCH
        const res = await fetch("/api/admin/team", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMember.id,
            name: formName,
            role: formRole,
            type: formType,
            imageRef: formImageRef || null,
            displayOrder: Number(formDisplayOrder),
            published: formPublished,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Failed to update member.");
        }

        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? json.data : m))
        );
      } else {
        // POST
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            role: formRole,
            type: formType,
            imageRef: formImageRef || null,
            displayOrder: Number(formDisplayOrder),
            published: formPublished,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Failed to create member.");
        }

        setMembers((prev) => [...prev, json.data]);
      }

      setModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublished = async (member: TeamMember) => {
    const newPublished = !member.published;
    try {
      // Optimistic update
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, published: newPublished } : m))
      );

      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: member.id,
          published: newPublished,
        }),
      });

      if (!res.ok) {
        // Revert on error
        fetchMembers();
      }
    } catch (e) {
      console.error("Toggle published failed:", e);
      fetchMembers();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const filteredMembers = members.filter((m) => {
    if (activeTab === "ALL") return true;
    return m.type === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-forest-700" />
            Team & Mentors Management
          </h1>
          <p className="text-sm text-forest-600 mt-1">
            Manage founders, core team members, and advisory mentors displayed on the public Team page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMembers}
            disabled={loading}
            className="p-2 bg-white border border-forest-200 text-forest-700 hover:bg-forest-50 rounded-xl transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-forest-200 pb-2">
        {(["ALL", "FOUNDER", "TEAM", "MENTOR"] as const).map((tab) => {
          const count =
            tab === "ALL"
              ? members.length
              : members.filter((m) => m.type === tab).length;

          const label =
            tab === "ALL"
              ? "All Members"
              : tab === "FOUNDER"
              ? "Founders"
              : tab === "TEAM"
              ? "Core Team"
              : "Mentors";

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-forest-800 text-white shadow-sm"
                  : "text-forest-700 hover:bg-forest-100/70"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-forest-600">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-sm">Loading team roster...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-forest-200 p-8">
          <p className="text-forest-600 font-medium">No members found in this category.</p>
          <button
            onClick={openCreateModal}
            className="mt-3 text-sm text-forest-800 font-semibold hover:underline"
          >
            + Add first member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                member.published ? "border-forest-100" : "border-zinc-200 opacity-75 bg-zinc-50/70"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-cream-100 border border-cream-200 shrink-0">
                  <Image
                    src={member.imageRef || "/assets/team/founder-1.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        TYPE_COLORS[member.type] || "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {TYPE_LABELS[member.type]}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600">
                      Order: #{member.displayOrder}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-forest-900 truncate mt-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-forest-600 truncate">{member.role}</p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-4 pt-3 border-t border-forest-100/70 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTogglePublished(member)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    member.published
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                  title={member.published ? "Click to hide from public site" : "Click to publish on site"}
                >
                  {member.published ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1.5 text-forest-700 hover:text-forest-900 hover:bg-forest-50 rounded-lg transition-colors"
                    title="Edit details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-forest-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <h2 className="text-base font-bold text-forest-900">
                {editingMember ? "Edit Team Member" : "Add New Team Member"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-forest-400 hover:text-forest-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Jane Doe"
                  className="w-full px-3 py-2 text-xs border border-forest-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="e.g. Co-Founder & CTO"
                  className="w-full px-3 py-2 text-xs border border-forest-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Member Group *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-forest-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                  >
                    <option value="FOUNDER">Our Founders</option>
                    <option value="TEAM">Core Team</option>
                    <option value="MENTOR">Our Mentors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Display Order (#)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 text-xs border border-forest-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                  />
                </div>
              </div>

              {/* Direct Image Upload Section */}
              <div className="space-y-2 pt-2 border-t border-forest-100">
                <label className="block text-xs font-semibold text-forest-800">
                  Profile Photo / Avatar
                </label>

                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-cream-100 border border-forest-200 shrink-0">
                    <Image
                      src={formImageRef || "/assets/team/founder-1.svg"}
                      alt="Avatar Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="team-photo-file-input"
                    />

                    <label
                      htmlFor="team-photo-file-input"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-forest-300 bg-forest-50 hover:bg-forest-100 text-forest-800 cursor-pointer transition-colors ${
                        uploading ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {uploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{uploading ? "Uploading..." : "Upload Photo (JPG/PNG/WEBP)"}</span>
                    </label>

                    <p className="text-[11px] text-forest-600">
                      Or paste an asset path / image URL below:
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  value={formImageRef}
                  onChange={(e) => setFormImageRef(e.target.value)}
                  placeholder="/assets/team/founder-1.svg or /uploads/photo.jpg"
                  className="w-full px-3 py-1.5 text-xs border border-forest-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                />

                {/* Preset Avatars quick pick */}
                <div className="pt-1">
                  <span className="text-[10px] text-forest-600 font-medium">Quick Preset Avatars:</span>
                  <div className="flex items-center gap-1.5 mt-1 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setFormImageRef(preset)}
                        className={`relative w-8 h-8 rounded-lg overflow-hidden border transition-all ${
                          formImageRef === preset
                            ? "border-forest-800 ring-2 ring-forest-600"
                            : "border-forest-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={preset} alt="preset" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="form-published"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="rounded text-forest-700 focus:ring-forest-600"
                />
                <label htmlFor="form-published" className="text-xs font-semibold text-forest-800">
                  Published (visible on public website)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-forest-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-forest-700 hover:bg-forest-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingMember ? "Save Changes" : "Create Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
