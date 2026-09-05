/**
 * AdminLogin Page
 * Admin/content creator login with email + password via Supabase
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupabaseClient } from "../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Sign in with Supabase
      const supabase = createSupabaseClient();
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!session || !session.access_token) {
        throw new Error("No session returned from authentication");
      }

      // 2. Store token in sessionStorage
      sessionStorage.setItem("auth_token", session.access_token);

      // 3. Verify admin status by calling backend endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/api/admin/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        sessionStorage.removeItem("auth_token");
        throw new Error("User is not authorized as admin or content creator");
      }

      const adminData = await response.json();

      // 4. Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("[AdminLogin] Error:", err.message);
      setError(err.message || "Login failed");
      sessionStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004B63] to-[#0077B6] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#004B63] mb-2">
              Admin Portal
            </h1>
            <p className="text-sm text-[#64748B]">
              Sign in to manage content and settings
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1E293B] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1E293B] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-2.5 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-[#004B63] to-[#0077B6] hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-xs text-[#94A3B8] text-center mt-6">
            Contact your administrator if you don't have access
          </p>
        </div>
      </div>
    </div>
  );
}
