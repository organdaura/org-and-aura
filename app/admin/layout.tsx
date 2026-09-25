import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Users,
  FileText,
  UserCheck,
  ExternalLink,
  LogOut,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If viewing the login page, let it render directly
  // In App Router, we can check if user is logged in
  if (!user) {
    // If not logged in, allow rendering if on login page, otherwise let page component redirect
    return <div className="min-h-screen bg-cream-100">{children}</div>;
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Support Requests", href: "/admin/support", icon: Inbox },
    { name: "Career Applications", href: "/admin/career", icon: Briefcase },
    { name: "User Signups", href: "/admin/signups", icon: Users },
    { name: "Blog Articles", href: "/admin/blog", icon: FileText },
    { name: "Team & Mentors", href: "/admin/team", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream-100">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-[#243B2B] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-forest-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-32 h-8 brightness-0 invert">
              <Image
                src="/assets/branding/logo.png"
                alt="Org & Aura"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
          <span className="text-[10px] bg-forest-600 px-2 py-0.5 rounded font-mono uppercase">
            Admin
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-cream-100/80 hover:text-white hover:bg-forest-700/60 transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-forest-800 space-y-3">
          <div className="px-3 py-2 bg-forest-800/60 rounded-xl">
            <p className="text-xs font-semibold truncate text-white">{user.name}</p>
            <p className="text-[11px] text-cream-200/60 truncate">{user.email}</p>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-cream-200/70 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1 text-red-300 hover:text-red-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Dashboard Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-x-auto relative">
        {/* Subtle realistic foliage decoration in top right corner */}
        <div
          aria-hidden="true"
          className="absolute -top-1 -right-1 w-32 sm:w-44 md:w-52 pointer-events-none select-none opacity-40 mix-blend-multiply aspect-[15/22]"
        >
          <Image
            src="/assets/decorations/leaves-branch.png"
            alt=""
            fill
            sizes="(max-width: 768px) 128px, 208px"
            className="object-contain object-top"
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">{children}</div>
      </main>
    </div>
  );
}
