/**
 * useAdminAuth Hook
 * Verifies current user is authenticated and has admin role
 * Returns: { user, isAdmin, isLoading, error, logout }
 */

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "../lib/supabase";

export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  // Fetch current user from /api/admin/auth/me
  useEffect(() => {
    async function checkAdmin() {
      try {
        setIsLoading(true);
        setError(null);

        // Get token from session storage (set by login)
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Call backend endpoint
        const response = await fetch(`${API_BASE}/api/admin/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("auth_token");
            setUser(null);
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } else {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("[useAdminAuth] Error:", err.message);
        setError(err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, [API_BASE]);

  // Logout: clear token and state
  const logout = useCallback(async () => {
    try {
      // Clear Supabase session
      const sb = createSupabaseClient(sessionStorage.getItem("auth_token"));
      await sb.auth.signOut();
    } catch (err) {
      console.warn(
        "[useAdminAuth logout] Error signing out of Supabase:",
        err.message,
      );
    }

    sessionStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  return {
    user,
    isAdmin: user?.isAdmin || false,
    isContentCreator: user?.isContentCreator || false,
    isLoading,
    error,
    logout,
  };
}
