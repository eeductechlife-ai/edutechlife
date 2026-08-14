import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL as API_BASE } from "../config/api";

// Hook específico para SmartBoard student profile (name, age, VAK, school, grade, avatar)
export const useStudentProfileSmartBoard = (authToken) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!authToken) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/smartboard/student-profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setProfile(data);
    } catch (e) {
      setError(e.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const updateProfile = useCallback(
    async (updates) => {
      if (!authToken) {
        setError("No autenticado");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/smartboard/student-profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Error ${res.status}`);
        }

        const data = await res.json();
        setProfile(data.profile);

        if (data.profile?.name) {
          localStorage.setItem("student_name", data.profile.name);
        }
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

  const uploadAvatar = useCallback(
    async (dataUrl) => {
      if (!authToken) {
        setError("No autenticado");
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
              Authorization: `Bearer ${authToken}`,
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
    if (!authToken) {
      setError("No autenticado");
      return false;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/smartboard/student-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
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
