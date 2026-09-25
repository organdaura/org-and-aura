"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Mail, Lock, User } from "lucide-react";
import BotanicalFrame from "@/components/ui/BotanicalFrame";
import { GoogleAuthModal } from "@/components/auth/GoogleAuthModal";

export default function SignupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"google" | "email">("google");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/google/status");
      const data = await res.json();
      if (data.configured) {
        window.location.href = "/api/auth/google/login";
        return;
      }
      setGoogleModalOpen(true);
    } catch {
      setGoogleModalOpen(true);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to create account");
      }

      // Success! Redirect to member dashboard
      router.push("/account");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    setGoogleModalOpen(false);
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center min-h-[75vh]">
      <BotanicalFrame position="top" className="w-full max-w-4xl" />

      <div className="w-full max-w-md px-4 py-8">
        <div className="card-organic p-6 sm:p-8 bg-white/95 shadow-organic-lg text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-700">
              Join Org and Aura for a sustainable future.
            </p>
          </div>

          <div className="space-y-5">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2 text-xs text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Tab Selector */}
            <div className="flex border-b border-cream-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("google")}
                className={`flex-1 pb-2 transition-colors ${
                  activeTab === "google"
                    ? "text-forest-700 border-b-2 border-forest-600 font-bold"
                    : "text-charcoal-600 hover:text-forest-600"
                }`}
              >
                One-Click Google
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("email")}
                className={`flex-1 pb-2 transition-colors ${
                  activeTab === "email"
                    ? "text-forest-700 border-b-2 border-forest-600 font-bold"
                    : "text-charcoal-600 hover:text-forest-600"
                }`}
              >
                Direct Email
              </button>
            </div>

            {activeTab === "google" ? (
              <div className="py-4 space-y-4">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-cream-300 bg-white hover:bg-cream-50 text-charcoal-800 text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:opacity-70"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-forest-600" />
                      <span>Connecting to Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-charcoal-600">
                  Instant real registration linked with Google authentication
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSignup} className="space-y-3.5 text-left pt-2">
                <div className="space-y-1">
                  <label
                    htmlFor="signup-name"
                    className="block text-xs font-semibold text-charcoal-800"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-50/60 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signup-email"
                    className="block text-xs font-semibold text-charcoal-800"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-50/60 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signup-password"
                    className="block text-xs font-semibold text-charcoal-800"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                    <input
                      id="signup-password"
                      type="password"
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-50/60 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-forest-600 hover:bg-forest-700 disabled:bg-forest-400 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 mt-3 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            )}

            <p className="text-xs text-charcoal-600 pt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-forest-700 hover:text-forest-900 underline underline-offset-2"
              >
                Log in here
              </Link>
            </p>

            <p className="text-[10px] sm:text-xs text-charcoal-600 leading-relaxed pt-1">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-4xl" />

      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
      />
    </div>
  );
}
