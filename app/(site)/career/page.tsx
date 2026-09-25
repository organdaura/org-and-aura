"use client";

import React, { useState, useRef } from "react";
import { CheckCircle2, AlertCircle, Loader2, FileText, Upload, X, Paperclip } from "lucide-react";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

export default function CareerPage() {
  const RECRUITMENT_ACTIVE = false;

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    physicalAddress: "",
    topSkills: "",
    department: "",
    roleType: "",
    resumeUrl: "",
    resumeFilename: "",
    bot_trap: "", // Honeypot field
  });

  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error on edit
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeUploading(true);
    setResumeError(null);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/career/upload-resume", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to upload resume document.");
      }

      setFormData((prev) => ({
        ...prev,
        resumeUrl: json.url,
        resumeFilename: json.filename,
      }));
    } catch (err: any) {
      setResumeError(err.message || "Failed to upload resume.");
    } finally {
      setResumeUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveResume = () => {
    setFormData((prev) => ({
      ...prev,
      resumeUrl: "",
      resumeFilename: "",
    }));
    setResumeError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/career/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error?.fields) {
          setFieldErrors(data.error.fields);
        }
        setErrorMsg(data.error?.message || "Failed to submit application. Please check fields.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        physicalAddress: "",
        topSkills: "",
        department: "",
        roleType: "",
        resumeUrl: "",
        resumeFilename: "",
        bot_trap: "",
      });
    } catch (err) {
      console.error("Career application submit error:", err);
      setErrorMsg("Network error. Please verify your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-4xl" />

      <div className="w-full max-w-xl px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Main Application Card matching video layout */}
        <div className="card-organic p-6 sm:p-8 bg-white/95 border-t-4 border-t-forest-600 shadow-organic-lg">
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800">
              Join the Org and Aura Team
            </h1>
            <p className="text-xs sm:text-sm text-forest-600 font-medium">
              Innovating at the intersection of technology, design, and environmental sustainability.
            </p>
          </div>

          {!RECRUITMENT_ACTIVE && (
            <div className="mb-6 p-4 rounded-2xl bg-cream-100/90 border border-gold-300 text-forest-900 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-400 text-forest-950">
                  Applications Paused
                </span>
                <span className="text-xs font-bold text-forest-800">Current Cohort Full</span>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Thank you for your overwhelming interest in Org &amp; Aura! Applications for our current development cycle are currently closed. Please follow our mission and check back soon for future openings.
              </p>
            </div>
          )}

          {success ? (
            <div className="bg-forest-50 border border-forest-200 rounded-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-forest-900">
                  Application Submitted!
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-700">
                  Thank you for your interest in joining Org &amp; Aura. Our talent team will review your credentials and contact you shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="inline-block text-xs font-semibold text-forest-700 hover:text-forest-900 bg-white border border-forest-300 px-4 py-2 rounded-full transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="text-left">
              <fieldset disabled={!RECRUITMENT_ACTIVE} className="space-y-4 disabled:opacity-75">
              {/* Global Error Alert */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Honeypot field (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="bot_trap"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.bot_trap}
                  onChange={handleChange}
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Enter Your Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all ${
                    fieldErrors.fullName ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                />
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label
                  htmlFor="mobileNumber"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  placeholder="Enter Your Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all ${
                    fieldErrors.mobileNumber ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                />
                {fieldErrors.mobileNumber && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.mobileNumber}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter Your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all ${
                    fieldErrors.email ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Physical Address */}
              <div className="space-y-1">
                <label
                  htmlFor="physicalAddress"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Physical Address
                </label>
                <textarea
                  id="physicalAddress"
                  name="physicalAddress"
                  rows={2}
                  required
                  placeholder="Your Street, Area, City, Country"
                  value={formData.physicalAddress}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all resize-none ${
                    fieldErrors.physicalAddress ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                />
                {fieldErrors.physicalAddress && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.physicalAddress}</p>
                )}
              </div>

              {/* Your Top Skills */}
              <div className="space-y-1">
                <label
                  htmlFor="topSkills"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Your Top Skills
                </label>
                <input
                  id="topSkills"
                  name="topSkills"
                  type="text"
                  required
                  placeholder="e.g., Research, Marketing, Embedded C"
                  value={formData.topSkills}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all ${
                    fieldErrors.topSkills ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                />
                {fieldErrors.topSkills && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.topSkills}</p>
                )}
              </div>

              {/* Select Department */}
              <div className="space-y-1">
                <label
                  htmlFor="department"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Select Department
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all ${
                    fieldErrors.department ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                >
                  <option value="">-- Choose a Department --</option>
                  <option value="Hardware Engineering">Hardware Engineering</option>
                  <option value="Embedded Systems">Embedded Systems &amp; Firmware</option>
                  <option value="Biochemical Research">Biochemical &amp; Thermal Research</option>
                  <option value="Operations & Logistics">Operations &amp; Logistics</option>
                  <option value="Product Design">Product &amp; Industrial Design</option>
                  <option value="Sustainability & LCA">Sustainability &amp; Life Cycle Analysis</option>
                  <option value="Software & Telemetry">Software &amp; Cloud Telemetry</option>
                </select>
                {fieldErrors.department && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.department}</p>
                )}
              </div>

              {/* Role Type */}
              <div className="space-y-1">
                <label
                  htmlFor="roleType"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Role Type
                </label>
                <select
                  id="roleType"
                  name="roleType"
                  required
                  value={formData.roleType}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all ${
                    fieldErrors.roleType ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                >
                  <option value="">-- Choose Role Type --</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship / Co-op">Internship / Co-op</option>
                  <option value="Research Fellow">Research Fellow</option>
                </select>
                {fieldErrors.roleType && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.roleType}</p>
                )}
              </div>

              {/* Resume / CV Attachment */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-charcoal-800">
                  Resume / Curriculum Vitae (Optional)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume-upload-input"
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={handleResumeUpload}
                  className="hidden"
                />

                {formData.resumeUrl ? (
                  <div className="flex items-center justify-between p-3 bg-forest-50/70 border border-forest-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-forest-900 truncate">
                      <FileText className="w-4 h-4 text-forest-700 shrink-0" />
                      <span className="font-semibold truncate">{formData.resumeFilename || "Resume Attached"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove resume"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="resume-upload-input"
                    className={`flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-cream-300 hover:border-forest-400 bg-cream-50/50 hover:bg-forest-50/30 rounded-xl cursor-pointer transition-colors text-xs font-semibold text-forest-800 ${
                      resumeUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {resumeUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-forest-600" />
                        <span>Uploading document...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-forest-600" />
                        <span>Attach Resume (PDF, DOC, DOCX up to 10MB)</span>
                      </>
                    )}
                  </label>
                )}

                {resumeError && (
                  <p className="text-[11px] text-red-600 font-medium">{resumeError}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading || !RECRUITMENT_ACTIVE}
                  className="w-full py-3 px-6 bg-forest-500 hover:bg-forest-600 disabled:bg-charcoal-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : !RECRUITMENT_ACTIVE ? (
                    <span>Applications Currently Paused</span>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
              </fieldset>
            </form>
          )}
        </div>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-4xl" />
    </div>
  );
}
