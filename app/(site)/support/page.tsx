"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import BotanicalFrame from "@/components/ui/BotanicalFrame";
import Captcha from "@/components/forms/Captcha";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    captchaAnswer: "",
    captchaToken: "",
    website_honeypot: "", // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleCaptchaChange = (token: string, answer: string) => {
    setFormData((prev) => ({
      ...prev,
      captchaToken: token,
      captchaAnswer: answer,
    }));
    if (fieldErrors.captchaAnswer) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.captchaAnswer;
        return copy;
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error?.fields) {
          setFieldErrors(data.error.fields);
        }
        setErrorMsg(data.error?.message || "Please check your submission.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        captchaAnswer: "",
        captchaToken: "",
        website_honeypot: "",
      });
    } catch (err) {
      console.error("Support form submit error:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-4xl" />

      <div className="w-full max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-10">
        {/* Page Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-forest-800">
            Support &amp; Contact
          </h1>
          <p className="text-xs sm:text-sm text-forest-600 font-medium">
            We are here to assist your institution with zero-emission waste solutions.
          </p>
        </div>

        {/* Section 1: Contact Information Card matching video screenshot */}
        <div className="card-warm p-6 sm:p-8 text-center space-y-5 shadow-organic border-t-4 border-t-forest-600 max-w-xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-charcoal-900">
            Get in Touch with Org and Aura
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-charcoal-800">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-forest-600 shrink-0" />
              <span>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:organdaura@gmail.com"
                  className="text-forest-700 underline hover:text-forest-900"
                >
                  organdaura@gmail.com
                </a>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-forest-600 shrink-0" />
              <span>
                <strong>Phone:</strong> +91 9789052564, 9710440299
              </span>
            </div>

            <div className="flex items-start justify-center gap-2 max-w-md mx-auto">
              <MapPin className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
              <span className="text-center">
                <strong>Address:</strong> Startup Incubator, SRM Ramapuram, Bharathi Salai,
                Ramapuram,and Chennai 600089.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="mailto:organdaura@gmail.com"
              className="inline-block bg-forest-500 hover:bg-forest-600 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow"
            >
              Email Us Directly
            </a>
          </div>
        </div>

        {/* Section 2: Interactive Support Ticket Form with CAPTCHA */}
        <div className="card-organic p-6 sm:p-8 bg-white max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-forest-900">
              Submit an Inquiry or Support Request
            </h2>
            <p className="text-xs text-charcoal-600">
              Our engineering and operations teams will respond within 24 business hours.
            </p>
          </div>

          {success ? (
            <div className="bg-forest-50 border border-forest-200 rounded-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-forest-900">Request Received</h3>
                <p className="text-xs text-charcoal-700">
                  Your ticket has been recorded in our system. A confirmation email has been logged.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 bg-white border border-forest-300 px-4 py-2 rounded-full transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_honeypot}
                  onChange={handleChange}
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label
                  htmlFor="support-name"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Your Name
                </label>
                <input
                  id="support-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all ${
                    fieldErrors.name ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="support-email"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Email Address
                </label>
                <input
                  id="support-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@institution.org"
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

              {/* Subject */}
              <div className="space-y-1">
                <label
                  htmlFor="support-subject"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Subject / Category
                </label>
                <input
                  id="support-subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="e.g., SanDi Pilot Testing Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all ${
                    fieldErrors.subject ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                />
                {fieldErrors.subject && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label
                  htmlFor="support-message"
                  className="block text-xs font-semibold text-charcoal-800"
                >
                  Message
                </label>
                <textarea
                  id="support-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Provide details about your facility or questions..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-cream-50/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all resize-none ${
                    fieldErrors.message ? "border-red-500 bg-red-50/30" : "border-cream-300"
                  }`}
                />
                {fieldErrors.message && (
                  <p className="text-[11px] text-red-600 font-medium">{fieldErrors.message}</p>
                )}
              </div>

              {/* Bot Defense CAPTCHA */}
              <Captcha
                onCaptchaChange={handleCaptchaChange}
                error={fieldErrors.captchaAnswer}
              />

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-4xl" />
    </div>
  );
}
