import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL as API_BASE } from "../config/api";

const getToken = (authToken) =>
  (typeof window !== "undefined" && sessionStorage.getItem("auth_token")) ||
  authToken ||
  null;

/** Build a minimal profile from localStorage when the API is unavailable. */
const getLocalFallbackProfile = () => {
  try {
    const name = localStorage.getItem("student_name") || "";
    const age = localStorage.getItem("student_age");
    const grade = localStorage.getItem("student_grade") || "";
    if (!name && !grade) return null;
    return {
      name,
      age: age ? Number(age) : null,
      grade,
      vakStyle: null,
      school: null,
      avatarUrl: null,
    };
  } catch {
    return null;
  }
};

export const useStudentProfileSmartBoard = (authToken) => {
  const [profile, setProfile] = useState(() => getLocalFallbackProfile());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    const token = getToken(authToken);
    if (!token) {
      // No token — use local fallback, don't show error
      setProfile(getLocalFallbackProfile());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/smartboard/student-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setProfile(data);
      // Keep localStorage in sync so other components (e.g. OralExamSimulator) can read without prop drilling
      if (data?.name) localStorage.setItem("student_name", data.name);
      if (data?.age != null)
        localStorage.setItem("student_age", String(data.age));
      if (data?.grade) localStorage.setItem("student_grade", data.grade);
    } catch (e) {
      // API failed (expired token, network error) — show local data silently
      const fallback = getLocalFallbackProfile();
      setProfile(fallback);
      // Only propagate error if there's truly nothing to show
      if (!fallback) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Returns { ok: true } on success or { ok: false, message: string } on failure
  const updateProfile = useCallback(
    async (updates) => {
      const token = getToken(authToken);

      if (!token) {
        const msg = "Sesión no encontrada. Por favor, recarga la página.";
        setError(msg);
        return { ok: false, message: msg };
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/smartboard/student-profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Error ${res.status}`);
        }

        const data = await res.json();
        setProfile(data.profile);

        if (data.profile?.name)
          localStorage.setItem("student_name", data.profile.name);
        if (data.profile?.age != null)
          localStorage.setItem("student_age", String(data.profile.age));
        if (data.profile?.grade)
          localStorage.setItem("student_grade", data.profile.grade);
        return { ok: true };
      } catch (e) {
        setError(e.message);
        return { ok: false, message: e.message };
      } finally {
        setLoading(false);
      }
    },
    [authToken],
  );

  const uploadAvatar = useCallback(
    async (dataUrl) => {
      const token = getToken(authToken);
      if (!token) {
        setError("Sesión no encontrada. Por favor, recarga la página.");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_BASE}/api/smartboard/student-profile/avatar`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ dataUrl }),
          },
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Error ${res.status}`);
        }

        const data = await res.json();
        setProfile((prev) => ({ ...(prev || {}), avatarUrl: data.avatarUrl }));
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authToken],
  );

  const removeAvatar = useCallback(async () => {
    const token = getToken(authToken);
    if (!token) {
      setError("Sesión no encontrada. Por favor, recarga la página.");
      return false;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/smartboard/student-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarUrl: null }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }

      setProfile((prev) => ({ ...(prev || {}), avatarUrl: null }));
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    refetch: fetchProfile,
  };
};
