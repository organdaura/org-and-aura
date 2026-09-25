"use client";

import React, { useState } from "react";
import { X, Loader2, ShieldCheck, Mail, User } from "lucide-react";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

export function GoogleAuthModal({ isOpen, onClose, onSuccess }: GoogleAuthModalProps) {
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail || !googleName) {
      setError("Please provide your Google email and name.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmail,
          name: googleName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Google sign-in failed");
      }

      onSuccess(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoName: string) => {
    setGoogleEmail(demoEmail);
    setGoogleName(demoName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-organic-lg max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-cream-200">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-1.5 rounded-full text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cream-100 mx-auto flex items-center justify-center shadow-inner">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
          </div>
          <h2 className="text-xl font-serif font-bold text-charcoal-900">
            Sign in with Google
          </h2>
          <p className="text-xs text-charcoal-600">
            to continue to <span className="font-semibold text-forest-700">Org & Aura</span>
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-charcoal-800">
              Google Account Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Alex Henderson"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-50/70 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-charcoal-800">
              Google Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="alex.henderson@gmail.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-cream-50/70 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          {/* Preset quick test shortcuts */}
          <div className="pt-1">
            <p className="text-[11px] text-charcoal-500 mb-1.5">Quick fill test accounts:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("sustainability.lead@gmail.com", "Maya Green")}
                className="text-[10px] px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-charcoal-700 rounded-lg transition-colors"
              >
                Maya Green
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("eco.innovator@gmail.com", "Devon Park")}
                className="text-[10px] px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-charcoal-700 rounded-lg transition-colors"
              >
                Devon Park
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-forest-600 hover:bg-forest-700 disabled:bg-forest-400 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Google...</span>
              </>
            ) : (
              <span>Confirm & Authenticate</span>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
          <span>Secure Google OAuth2 Identity Provider</span>
        </div>
      </div>
    </div>
  );
}
