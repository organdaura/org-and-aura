"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

interface CaptchaProps {
  onCaptchaChange: (token: string, answer: string) => void;
  error?: string;
}

export function Captcha({ onCaptchaChange, error }: CaptchaProps) {
  const [question, setQuestion] = useState<string>("Loading security check...");
  const [token, setToken] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNewChallenge = async (resetAnswer: boolean = false) => {
    try {
      setLoading(true);
      const res = await fetch("/api/captcha");
      const data = await res.json();
      if (data.question && data.token) {
        setQuestion(data.question);
        setToken(data.token);
        if (resetAnswer) {
          setUserAnswer("");
          onCaptchaChange(data.token, "");
        } else {
          setUserAnswer((prev) => {
            if (prev) {
              onCaptchaChange(data.token, prev);
              return prev;
            }
            onCaptchaChange(data.token, "");
            return "";
          });
        }
      }
    } catch (e) {
      console.error("Failed to load captcha", e);
      setQuestion("Security Check: What is 5 + 3?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/captcha");
        const data = await res.json();
        if (active && data.question && data.token) {
          setQuestion(data.question);
          setToken(data.token);
          onCaptchaChange(data.token, "");
        }
      } catch (e) {
        if (active) {
          console.error("Failed to load captcha", e);
          setQuestion("Security Check: What is 5 + 3?");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchChallenge();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);
    onCaptchaChange(token, val);
  };

  return (
    <div className="bg-cream-50 border border-cream-300 rounded-xl p-3.5 mt-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-700">
          <ShieldCheck className="w-4 h-4 text-forest-600" />
          <span>Bot Protection</span>
        </div>
        <button
          type="button"
          onClick={() => fetchNewChallenge(true)}
          disabled={loading}
          className="text-xs text-forest-600 hover:text-forest-800 flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-forest-500 rounded px-1.5 py-0.5"
          title="Get new question"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          <span>New code</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor="captcha-answer-input"
          className="text-xs font-medium text-charcoal-800 shrink-0 select-none bg-cream-200 px-2.5 py-2 rounded-lg border border-cream-300/80"
        >
          {question}
        </label>
        <input
          id="captcha-answer-input"
          type="text"
          value={userAnswer}
          onChange={handleChange}
          placeholder="Answer"
          className="w-24 text-center px-3 py-2 text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
          required
          autoComplete="off"
        />
      </div>

      {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

export default Captcha;
