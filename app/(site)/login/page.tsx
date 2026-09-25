"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import BotanicalFrame from "@/components/ui/BotanicalFrame";
import { GoogleAuthModal } from "@/components/auth/GoogleAuthModal";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      const errorMap: Record<string, string> = {
        oauth_denied: "Google access was denied or cancelled.",
        missing_code: "Google did not return an authorization code.",
        invalid_state: "Security verification failed. Please try logging in again.",
        no_email_provided: "Your Google account did not share a primary email.",
        oauth_exchange_failed: "Failed to verify credentials with Google. Please retry.",
        oauth_init_failed: "Unable to start Google sign-in. Check your connection.",
      };
      setErrorMsg(errorMap[err] || "Authentication with Google failed.");
    }
  }, [searchParams]);

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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Invalid credentials.");
      }

      router.push("/account");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication error");
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
    <>
      <div className="w-full max-w-md px-4 py-8">
        <div className="card-organic p-6 sm:p-8 bg-white/95 shadow-organic-lg text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-700">
              Log in to access your member dashboard and inquiries.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2 text-xs text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-cream-300 bg-white hover:bg-cream-50 text-charcoal-800 text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:opacity-70"
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

            <div className="relative flex items-center justify-center">
              <div className="border-t border-cream-300 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                Or with email
              </span>
              <div className="border-t border-cream-300 w-full" />
            </div>

            {/* Email / Password Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    id="login-email"
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
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-50/60 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-forest-600 hover:bg-forest-700 disabled:bg-forest-400 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 mt-4 focus:outline-none focus:ring-2 focus:ring-forest-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>

            <p className="text-xs text-charcoal-600 pt-3">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="font-bold text-forest-700 hover:text-forest-900 underline underline-offset-2"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full relative flex flex-col items-center justify-center min-h-[75vh]">
      <BotanicalFrame position="top" className="w-full max-w-4xl" />

      <Suspense
        fallback={
          <div className="w-full max-w-md px-4 py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      <BotanicalFrame position="bottom" className="w-full max-w-4xl" />
    </div>
  );
}
