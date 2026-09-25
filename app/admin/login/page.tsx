"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Shield, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Invalid credentials");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card-organic p-8 bg-white/95 shadow-organic-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="relative w-36 h-10 mx-auto">
              <Image
                src="/assets/branding/logo.png"
                alt="Org & Aura"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-forest-700 bg-forest-50 py-1 px-3 rounded-full w-fit mx-auto">
              <Shield className="w-3.5 h-3.5" />
              <span>Administrative Portal</span>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-charcoal-800"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-600 absolute left-3 top-3" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="admin@organdaura.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-50/60 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-charcoal-800"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-600 absolute left-3 top-3" />
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-50/60 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 mt-2 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
