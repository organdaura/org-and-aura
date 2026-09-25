"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";

const NAV_LINKS = [
  { name: "HOME", href: "/" },
  { name: "PRODUCT", href: "/product" },
  { name: "GALLERY", href: "/gallery" },
  { name: "BLOG", href: "/blog" },
  { name: "OUR TEAM", href: "/team" },
  { name: "CAREER", href: "/career" },
];

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth session on navigation
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-cream-100/95 backdrop-blur-md shadow-sm border-b border-cream-200"
          : "bg-cream-100/90 backdrop-blur-sm border-b border-cream-200/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo Branding */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-forest-500 rounded-lg p-1"
          >
            <div className="relative w-28 sm:w-36 h-8 sm:h-10">
              <Image
                src="/assets/branding/logo.png"
                alt="Org & Aura"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center space-x-6 xl:space-x-8"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[11px] lg:text-xs font-semibold tracking-wider transition-colors py-1 ${
                    active
                      ? "text-forest-700 font-bold"
                      : "text-charcoal-700 hover:text-forest-600"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-forest-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Area: Login, Sign Up, Account & Support */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {currentUser ? (
              <>
                <Link
                  href="/account"
                  className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-3 sm:px-3.5 py-1.5 rounded-full transition-all border ${
                    pathname === "/account"
                      ? "border-forest-600 bg-forest-100 text-forest-800"
                      : "border-forest-300/80 hover:border-forest-600 text-forest-900 bg-white/80 hover:bg-white"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-forest-600" />
                  <span className="hidden sm:inline">{currentUser.name.split(" ")[0]}</span>
                  <span className="sm:hidden">Account</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1.5 text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200 rounded-full transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                {/* Login Button next to Sign Up */}
                <Link
                  href="/login"
                  className={`text-[11px] sm:text-xs font-medium px-2.5 sm:px-3.5 py-1.5 rounded-full transition-all ${
                    pathname === "/login"
                      ? "text-forest-800 font-bold underline underline-offset-4"
                      : "text-charcoal-700 hover:text-forest-700 hover:bg-cream-200/60"
                  }`}
                >
                  Login
                </Link>

                {/* Sign Up Button */}
                <Link
                  href="/signup"
                  className={`text-[11px] sm:text-xs font-medium px-3 sm:px-4 py-1.5 rounded-full transition-all border ${
                    pathname === "/signup"
                      ? "border-forest-600 bg-forest-100 text-forest-800"
                      : "border-charcoal-700/60 hover:border-charcoal-900 text-charcoal-800 bg-white/60 hover:bg-white"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Support CTA */}
            <Link
              href="/support"
              className={`text-[11px] sm:text-xs font-medium px-3 sm:px-4 py-1.5 rounded-full transition-all shadow-sm ${
                pathname === "/support"
                  ? "bg-forest-700 text-white ring-2 ring-forest-500"
                  : "bg-forest-500 hover:bg-forest-600 text-white"
              }`}
            >
              Support
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-charcoal-700 hover:bg-cream-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile horizontal scroll bar matching recording */}
        <div className="lg:hidden flex items-center gap-4 overflow-x-auto py-2 no-scrollbar border-t border-cream-200/50 text-[11px] font-semibold tracking-wider text-charcoal-700 whitespace-nowrap">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-1 py-0.5 transition-colors ${
                  active ? "text-forest-700 font-bold" : "hover:text-forest-600"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-forest-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-50 border-b border-cream-300 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-forest-100 text-forest-800 font-bold"
                    : "text-charcoal-800 hover:bg-cream-200"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-cream-200 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-forest-100 text-forest-900"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Account ({currentUser.name})</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-700 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 px-3 rounded-xl border border-cream-300 bg-white text-charcoal-800 text-xs font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 text-center py-2 px-3 rounded-xl bg-forest-600 text-white text-xs font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
