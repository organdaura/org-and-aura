"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Calendar, RefreshCw, Briefcase, FileText, Download } from "lucide-react";

interface CareerItem {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  physicalAddress: string;
  topSkills: string;
  department: string;
  roleType: string;
  resumeUrl: string | null;
  resumeFilename: string | null;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export default function AdminCareerPage() {
  const [applications, setApplications] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/career");
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (e) {
      console.error("Failed to load applications", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/career", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
        );
      }
    } catch (e) {
      console.error("Failed to update status", e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest-900">
            Talent &amp; Career Applications
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700">
            Review candidates applying for hardware, embedded, and operational roles.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchApplications}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-forest-700 bg-white border border-cream-300 hover:bg-cream-50 px-3 py-1.5 rounded-lg shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="card-organic p-12 text-center text-xs text-charcoal-600">
          Loading talent applications from PostgreSQL...
        </div>
      ) : applications.length === 0 ? (
        <div className="card-organic p-12 text-center text-xs text-charcoal-600">
          No career applications submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const dateStr = new Date(app.createdAt).toLocaleString();
            return (
              <div
                key={app.id}
                className="card-organic p-5 sm:p-6 bg-white space-y-4 text-left transition-shadow hover:shadow-organic"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-charcoal-900">
                        {app.fullName}
                      </h2>
                      <span className="text-[11px] font-semibold text-forest-700 bg-forest-50 border border-forest-200 px-2 py-0.5 rounded-full">
                        {app.department}
                      </span>
                      <span className="text-[11px] text-charcoal-600 bg-cream-200 px-2 py-0.5 rounded-full">
                        {app.roleType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-charcoal-600 mt-1 flex-wrap">
                      <a href={`mailto:${app.email}`} className="text-forest-600 underline">
                        {app.email}
                      </a>
                      <span>&bull;</span>
                      <span>{app.mobileNumber}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-charcoal-500">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label htmlFor={`career-status-${app.id}`} className="text-[11px] font-semibold text-charcoal-600">
                      Status:
                    </label>
                    <select
                      id={`career-status-${app.id}`}
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                        app.status === "PENDING"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : app.status === "REVIEWED"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : app.status === "ACCEPTED"
                          ? "bg-forest-50 text-forest-800 border-forest-300"
                          : "bg-red-50 text-red-800 border-red-300"
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWED">REVIEWED</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-charcoal-800">
                  <div className="p-3 bg-cream-50/60 rounded-xl border border-cream-200">
                    <strong className="text-charcoal-900 block mb-1">Top Skills:</strong>
                    <p>{app.topSkills}</p>
                  </div>
                  <div className="p-3 bg-cream-50/60 rounded-xl border border-cream-200">
                    <strong className="text-charcoal-900 block mb-1">Address:</strong>
                    <p>{app.physicalAddress}</p>
                  </div>
                </div>

                {/* Candidate Resume Document */}
                <div className="pt-1">
                  {app.resumeUrl ? (
                    <div className="flex items-center justify-between p-3 bg-forest-50/70 border border-forest-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-forest-900 truncate">
                        <FileText className="w-4 h-4 text-forest-700 shrink-0" />
                        <span className="font-semibold truncate">
                          {app.resumeFilename || "Candidate_Resume.pdf"}
                        </span>
                      </div>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Resume</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-500 flex items-center gap-2 italic">
                      <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>No resume document attached by candidate.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
