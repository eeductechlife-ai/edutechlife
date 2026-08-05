import { useState, useEffect, useCallback } from "react";

// Hook específico para SmartBoard student profile (age, VAK, school, grade)
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
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "https://edutechlife-backend.onrender.com"}/api/smartboard/student-profile`,
        { headers: { Authorization: `Bearer ${authToken}` } },
      );

      if (!res.ok) {
        if (res.status === 404) {
          setProfile(null);
        } else {
          throw new Error(`Error ${res.status}`);
        }
        return;
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
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "https://edutechlife-backend.onrender.com"}/api/smartboard/student-profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(updates),
          },
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Error ${res.status}`);
        }

        const data = await res.json();
        setProfile(data.profile);
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

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
};
