import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import {
  Inbox,
  Briefcase,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [supportCount, newSupportCount, careerCount, pendingCareerCount, signupsCount, blogCount] =
    await Promise.all([
      prisma.supportRequest.count(),
      prisma.supportRequest.count({ where: { status: "NEW" } }),
      prisma.careerApplication.count(),
      prisma.careerApplication.count({ where: { status: "PENDING" } }),
      prisma.signup.count(),
      prisma.blogPost.count(),
    ]);

  const recentSupport = await prisma.supportRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const recentCareer = await prisma.careerApplication.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
          Executive Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700">
          Monitor incoming institutional inquiries, talent applications, and platform activity.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Support Card */}
        <div className="card-organic p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-600">Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-charcoal-900">{supportCount}</div>
          <div className="flex items-center gap-1 text-[11px] text-forest-600 font-medium">
            <Clock className="w-3 h-3" />
            <span>{newSupportCount} new pending</span>
          </div>
        </div>

        {/* Career Applications */}
        <div className="card-organic p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-600">Applications</span>
            <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-charcoal-900">{careerCount}</div>
          <div className="flex items-center gap-1 text-[11px] text-forest-600 font-medium">
            <Clock className="w-3 h-3" />
            <span>{pendingCareerCount} unreviewed</span>
          </div>
        </div>

        {/* User Signups */}
        <div className="card-organic p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-600">Signups</span>
            <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-charcoal-900">{signupsCount}</div>
          <div className="flex items-center gap-1 text-[11px] text-forest-600 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Platform members</span>
          </div>
        </div>

        {/* Blog Articles */}
        <div className="card-organic p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-600">Articles</span>
            <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-charcoal-900">{blogCount}</div>
          <div className="flex items-center gap-1 text-[11px] text-forest-600 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Live published</span>
          </div>
        </div>
      </div>

      {/* Split Recent Inquiries & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Support Requests */}
        <div className="card-organic p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-forest-900">Recent Support Inquiries</h2>
            <Link
              href="/admin/support"
              className="text-xs text-forest-600 hover:text-forest-800 font-semibold flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSupport.length === 0 ? (
              <p className="text-xs text-charcoal-600">No support requests yet.</p>
            ) : (
              recentSupport.map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-cream-50/70 rounded-xl border border-cream-200 text-left space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal-900">{req.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === "NEW"
                          ? "bg-amber-100 text-amber-800"
                          : req.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-forest-100 text-forest-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-forest-800">{req.subject}</p>
                  <p className="text-[11px] text-charcoal-600 line-clamp-1">{req.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card-organic p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-forest-900">Recent Talent Applications</h2>
            <Link
              href="/admin/career"
              className="text-xs text-forest-600 hover:text-forest-800 font-semibold flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCareer.length === 0 ? (
              <p className="text-xs text-charcoal-600">No applications received yet.</p>
            ) : (
              recentCareer.map((app) => (
                <div
                  key={app.id}
                  className="p-3 bg-cream-50/70 rounded-xl border border-cream-200 text-left space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal-900">{app.fullName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : app.status === "ACCEPTED"
                          ? "bg-forest-100 text-forest-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-forest-800">
                    {app.department} &bull; {app.roleType}
                  </p>
                  <p className="text-[11px] text-charcoal-600 line-clamp-1">Skills: {app.topSkills}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
