import { useState, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const LEVEL_THRESHOLDS = [
  { label: "Explorador", min: 0, max: 0.3, color: "#94A3B8", emoji: "🔭" },
  { label: "Aprendiz", min: 0.3, max: 0.5, color: "#60A5FA", emoji: "📚" },
  { label: "Practicante", min: 0.5, max: 0.7, color: "#34D399", emoji: "⚡" },
  { label: "Experto", min: 0.7, max: 1.01, color: "#FBBF24", emoji: "🏆" },
];

export function getMasteryLevel(score) {
  return (
    LEVEL_THRESHOLDS.find((l) => score >= l.min && score < l.max) ||
    LEVEL_THRESHOLDS[0]
  );
}

const SUBJECT_LABELS = {
  matematicas: "Matemáticas",
  lenguaje: "Lenguaje",
  ciencias_naturales: "Ciencias Naturales",
  ciencias_sociales: "Ciencias Sociales",
  ingles: "Inglés",
  tecnologia: "Tecnología",
};

function subjectFromId(id) {
  const parts = id.split("_");
  return parts.length >= 2 ? parts.slice(1, -2).join("_") : null;
}

function getToken() {
  try {
    return sessionStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
}

/**
 * Fetches and formats the student's Skill Passport data.
 * Aggregates mastery by subject and formats for SkillPassport UI.
 */
export function useSkillPassport() {
  const [passport, setPassport] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPassport = useCallback(async (studentId) => {
    if (!studentId) return;
    setLoading(true);
    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [masteryRes, badgesRes] = await Promise.allSettled([
        fetch(
          `${API_BASE_URL}/api/smartboard/adaptive/mastery?studentId=${studentId}`,
          { headers },
        ),
        fetch(
          `${API_BASE_URL}/api/smartboard/gamification/badges?studentId=${studentId}`,
          { headers },
        ),
      ]);

      if (masteryRes.status === "fulfilled" && masteryRes.value.ok) {
        const data = await masteryRes.value.json();
        const rows = data.mastery || [];

        // Aggregate by subject
        const bySubject = {};
        for (const row of rows) {
          const subj = subjectFromId(row.competency_id);
          if (!subj) continue;
          if (!bySubject[subj])
            bySubject[subj] = { sum: 0, count: 0, lastUpdated: null };
          bySubject[subj].sum += row.mastery_level;
          bySubject[subj].count++;
          if (
            !bySubject[subj].lastUpdated ||
            row.last_practiced_at > bySubject[subj].lastUpdated
          ) {
            bySubject[subj].lastUpdated = row.last_practiced_at;
          }
        }

        const formatted = Object.entries(bySubject)
          .map(([subj, { sum, count, lastUpdated }]) => {
            const avgMastery = sum / count;
            const level = getMasteryLevel(avgMastery);
            return {
              subject: subj,
              label: SUBJECT_LABELS[subj] || subj,
              mastery: avgMastery,
              masteryPercent: Math.round(avgMastery * 100),
              level,
              lastUpdated,
            };
          })
          .sort((a, b) => b.mastery - a.mastery);

        setPassport(formatted);
      }

      if (badgesRes.status === "fulfilled" && badgesRes.value.ok) {
        const data = await badgesRes.value.json();
        setBadges(data.badges || []);
      }
    } catch {
      // Non-blocking
    } finally {
      setLoading(false);
    }
  }, []);

  return { passport, badges, loading, fetchPassport };
}
