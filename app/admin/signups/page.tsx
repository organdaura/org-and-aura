"use client";

import React, { useState, useEffect } from "react";
import { Users, Calendar, RefreshCw } from "lucide-react";

interface SignupItem {
  id: string;
  email: string;
  name: string | null;
  provider: string;
  status: string;
  createdAt: string;
}

export default function AdminSignupsPage() {
  const [signups, setSignups] = useState<SignupItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/signups");
      const data = await res.json();
      if (data.success) {
        setSignups(data.data);
      }
    } catch (e) {
      console.error("Failed to load signups", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignups();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest-900">
            Registered Community Members
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700">
            Users who created accounts or joined the sustainability network.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSignups}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-forest-700 bg-white border border-cream-300 hover:bg-cream-50 px-3 py-1.5 rounded-lg shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="card-organic p-12 text-center text-xs text-charcoal-600">
          Loading member records from PostgreSQL...
        </div>
      ) : signups.length === 0 ? (
        <div className="card-organic p-12 text-center text-xs text-charcoal-600">
          No signups registered yet.
        </div>
      ) : (
        <div className="card-organic bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50/80 text-charcoal-800 border-b border-cream-200">
                <tr>
                  <th className="p-3.5 font-bold">Email</th>
                  <th className="p-3.5 font-bold">Name</th>
                  <th className="p-3.5 font-bold">Provider</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {signups.map((s) => (
                  <tr key={s.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-3.5 font-medium text-forest-800">{s.email}</td>
                    <td className="p-3.5 text-charcoal-700">{s.name || "—"}</td>
                    <td className="p-3.5">
                      <span className="bg-cream-200 text-charcoal-800 px-2 py-0.5 rounded-md font-mono text-[10px]">
                        {s.provider}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-charcoal-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
