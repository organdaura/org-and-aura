"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Calendar,
  RefreshCw,
  CheckCircle2,
  Clock,
  Save,
  MessageSquare,
  AlertCircle,
  FileText,
} from "lucide-react";

interface SupportItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  adminNotes: string | null;
  createdAt: string;
}

export default function AdminSupportPage() {
  const [requests, setRequests] = useState<SupportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/support");
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
        const initialNotes: Record<string, string> = {};
        data.data.forEach((r: SupportItem) => {
          initialNotes[r.id] = r.adminNotes || "";
        });
        setNotesState(initialNotes);
      }
    } catch (e) {
      console.error("Failed to load requests", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdate = async (id: string, newStatus?: string, newNotes?: string) => {
    setUpdatingId(id);
    setSavedAlert(null);

    const payload: { id: string; status?: string; adminNotes?: string } = { id };
    if (newStatus !== undefined) payload.status = newStatus;
    if (newNotes !== undefined) payload.adminNotes = newNotes;

    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: (newStatus || r.status) as any,
                  adminNotes: newNotes !== undefined ? newNotes : r.adminNotes,
                }
              : r
          )
        );
        setSavedAlert(`Ticket updated successfully.`);
        setTimeout(() => setSavedAlert(null), 3000);
      }
    } catch (e) {
      console.error("Failed to update support request", e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-forest-700" />
            Support &amp; Institutional Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Manage incoming facility inquiries, pilot requests, and log internal triage notes.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchRequests}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 bg-white border border-forest-200 hover:bg-forest-50 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedAlert}</span>
        </div>
      )}

      {loading ? (
        <div className="card-organic p-12 text-center text-xs text-charcoal-600">
          Loading support inquiries from PostgreSQL...
        </div>
      ) : requests.length === 0 ? (
        <div className="card-organic p-12 text-center text-xs text-charcoal-600">
          No support requests recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const dateStr = new Date(req.createdAt).toLocaleString();
            const currentNote = notesState[req.id] ?? (req.adminNotes || "");
            const isSaving = updatingId === req.id;

            return (
              <div
                key={req.id}
                className="card-organic p-5 sm:p-6 bg-white space-y-4 text-left transition-shadow hover:shadow-organic border border-forest-100"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-3">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-forest-900">
                      {req.subject}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-charcoal-600 mt-1 flex-wrap">
                      <span className="font-semibold text-forest-800">{req.name}</span>
                      <span>&bull;</span>
                      <a href={`mailto:${req.email}`} className="text-forest-600 underline">
                        {req.email}
                      </a>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-charcoal-500">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                    </div>
                  </div>

                  {/* Status Picker */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-charcoal-600">Status:</span>
                    <select
                      value={req.status}
                      disabled={isSaving}
                      onChange={(e) => handleUpdate(req.id, e.target.value, currentNote)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-forest-500 transition-colors ${
                        req.status === "NEW"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : req.status === "IN_PROGRESS"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : "bg-emerald-50 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                </div>

                {/* Customer Message Body */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-forest-800 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-forest-600" />
                    Customer Message:
                  </span>
                  <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed whitespace-pre-wrap bg-cream-50/70 p-3.5 rounded-xl border border-cream-200">
                    {req.message}
                  </p>
                </div>

                {/* Combined Quick-Triage: Internal Admin Notes & Fast Actions */}
                <div className="pt-2 border-t border-forest-100/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-forest-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-forest-700" />
                      Internal Admin Notes &amp; Action Log
                    </span>
                    {req.adminNotes && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                        Notes Recorded
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={2}
                    value={currentNote}
                    onChange={(e) =>
                      setNotesState((prev) => ({ ...prev, [req.id]: e.target.value }))
                    }
                    placeholder="Record pilot machine model, installation dates, contact notes, or resolution steps..."
                    className="w-full p-2.5 text-xs text-forest-950 bg-forest-50/30 border border-forest-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 placeholder:text-forest-400"
                  />

                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleUpdate(req.id, undefined, currentNote)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-forest-800 hover:bg-forest-900 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save Note</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSaving || req.status === "IN_PROGRESS"}
                        onClick={() => handleUpdate(req.id, "IN_PROGRESS", currentNote)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Mark In Progress</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSaving || req.status === "RESOLVED"}
                        onClick={() => handleUpdate(req.id, "RESOLVED", currentNote)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolve Ticket</span>
                      </button>
                    </div>

                    {isSaving && (
                      <span className="text-[11px] text-forest-600 animate-pulse">
                        Saving changes...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
