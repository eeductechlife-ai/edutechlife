/**
 * AdminRoute Component
 * Protected route wrapper that checks admin authentication
 * Redirects non-admins to home page, shows loading spinner while verifying
 */

import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export function AdminRoute({ children }) {
  const { isLoading, isAdmin, user } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004B63] to-[#0077B6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
          <p className="text-white text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.warn(
      "[AdminRoute] User is not admin. User:",
      user ? user.role : "None",
    );
    return <Navigate to="/" replace />;
  }

  return children;
}
