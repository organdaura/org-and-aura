"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  LogOut,
  HelpCircle,
  Briefcase,
  ExternalLink,
  Loader2,
  Clock,
  Shield,
  FileText,
} from "lucide-react";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SupportItem {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface CareerItem {
  id: string;
  roleType: string;
  department: string;
  topSkills: string;
  resumeFilename?: string | null;
  resumeUrl?: string | null;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [supportRequests, setSupportRequests] = useState<SupportItem[]>([]);
  const [careerApplications, setCareerApplications] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<"inquiries" | "applications">("inquiries");

  useEffect(() => {
    async function loadActivity() {
      try {
        const res = await fetch("/api/user/activity");
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        if (data.success) {
          setProfile(data.data.user);
          setSupportRequests(data.data.supportRequests || []);
          setCareerApplications(data.data.careerApplications || []);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to load user activity:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadActivity();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
        <p className="text-xs sm:text-sm text-charcoal-700 font-medium">Loading member dashboard...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-full min-h-screen py-8 sm:py-12 relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-5xl" />

      <div className="w-full max-w-4xl px-4 sm:px-6 space-y-8">
        {/* Profile Card Header */}
        <div className="card-organic p-6 sm:p-8 bg-white/95 shadow-organic-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-700 font-serif font-bold text-2xl flex items-center justify-center shadow-inner">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-forest-900">
                  {profile.name}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
                  {profile.role === "ADMIN" ? "Administrator" : "Member"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-charcoal-600 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-forest-600" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-forest-600" />
                  Verified Account
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {profile.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex-1 sm:flex-none text-xs font-semibold px-4 py-2 bg-charcoal-900 text-white rounded-xl hover:bg-black transition-colors text-center"
              >
                Admin Area
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 bg-cream-100 hover:bg-cream-200 text-charcoal-800 rounded-xl transition-colors border border-cream-300"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin text-charcoal-600" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Activity & Inquiries Section */}
        <div className="card-organic p-6 sm:p-8 bg-white/95 shadow-organic-md space-y-6">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("inquiries")}
                className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === "inquiries"
                    ? "border-forest-600 text-forest-900 font-bold"
                    : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Support Inquiries ({supportRequests.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("applications")}
                className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === "applications"
                    ? "border-forest-600 text-forest-900 font-bold"
                    : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Career Applications ({careerApplications.length})</span>
              </button>
            </div>

            <Link
              href={activeTab === "inquiries" ? "/support" : "/career"}
              className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1"
            >
              <span>{activeTab === "inquiries" ? "+ New Inquiry" : "+ Submit Application"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeTab === "inquiries" ? (
            <div>
              {supportRequests.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <HelpCircle className="w-8 h-8 text-cream-400 mx-auto" />
                  <p className="text-sm font-semibold text-charcoal-700">No support inquiries found</p>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                    Have questions regarding the SanDi technology or a hospital pilot? We are here to help.
                  </p>
                  <Link
                    href="/support"
                    className="inline-block mt-2 text-xs font-semibold px-4 py-2 bg-forest-600 text-white rounded-full hover:bg-forest-700 transition-colors"
                  >
                    Open Support Request
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {supportRequests.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-bold text-xs sm:text-sm text-charcoal-900">
                          {item.subject}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              item.status === "RESOLVED"
                                ? "bg-green-100 text-green-800"
                                : item.status === "IN_PROGRESS"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-[11px] text-charcoal-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-charcoal-700 line-clamp-2">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {careerApplications.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Briefcase className="w-8 h-8 text-cream-400 mx-auto" />
                  <p className="text-sm font-semibold text-charcoal-700">No career applications found</p>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                    Explore open roles and apply to join our mission in sanitary waste innovation.
                  </p>
                  <Link
                    href="/career"
                    className="inline-block mt-2 text-xs font-semibold px-4 py-2 bg-forest-600 text-white rounded-full hover:bg-forest-700 transition-colors"
                  >
                    View Open Roles & Apply
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {careerApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-bold text-xs sm:text-sm text-charcoal-900">
                          {app.department} — {app.roleType}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              app.status === "ACCEPTED"
                                ? "bg-green-100 text-green-800"
                                : app.status === "REVIEWED"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {app.status}
                          </span>
                          <span className="text-[11px] text-charcoal-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-charcoal-700">
                        <span className="font-semibold">Top Skills:</span> {app.topSkills}
                      </p>
                      {app.resumeFilename && (
                        <p className="text-[11px] text-forest-700 flex items-center gap-1.5 pt-1">
                          <FileText className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                          <span className="font-medium">Attached Resume:</span>
                          <span className="truncate">{app.resumeFilename}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-5xl" />
    </div>
  );
}
