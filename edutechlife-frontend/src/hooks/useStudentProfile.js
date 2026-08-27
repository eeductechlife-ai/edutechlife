import { useMemo } from "react";
import { useSmartBoardKidsSafe } from "../context/SmartBoardKidsContext";

/**
 * Unified SmartBoard 3.0 student profile.
 *
 * Composes data already loaded in SmartBoardKidsContext — no extra DB calls.
 * Safe to call outside SmartBoardKidsProvider (returns { profile: null, isReady: false }).
 *
 * @returns {{ profile: StudentProfile, isReady: boolean }}
 */
export function useStudentProfile() {
  const ctx = useSmartBoardKidsSafe();

  const profile = useMemo(() => {
    if (!ctx) return null;
    const {
      studentAge,
      gradeLevel,
      countryCode,
      schoolName,
      vakResult,
      totalPoints,
      streak,
      studentMoodHistory,
      academicTopics,
      subjects,
      subjectsWithGrades,
      studentGrades,
      sessions,
      totalActiveMinutes,
      missions,
      daniMemory,
      conversationCount,
      subscriptionTier,
      dataLoaded,
    } = ctx;

    if (!dataLoaded) return null;

    // ── Identity ──────────────────────────────────────────────
    const identity = {
      age: studentAge ?? null,
      grade: gradeLevel ?? null,
      school: schoolName || null,
      country: countryCode || "CO",
    };

    // ── Academic ──────────────────────────────────────────────
    const gradesWithScore = (subjectsWithGrades || subjects || []).map((s) => ({
      subject: s.subject || s.name,
      label: s.label || s.name,
      grade: s.grade ?? null,
      progress: s.progress ?? 0,
      color: s.color,
    }));

    const subjectsWithScore = gradesWithScore.filter((s) => s.grade !== null);
    const avgGrade = subjectsWithScore.length
      ? subjectsWithScore.reduce((sum, s) => sum + Number(s.grade), 0) /
        subjectsWithScore.length
      : null;

    const strengths = subjectsWithScore
      .filter((s) => Number(s.grade) >= 4.0)
      .map((s) => s.label || s.subject);

    const weaknesses = subjectsWithScore
      .filter((s) => Number(s.grade) < 3.5)
      .map((s) => s.label || s.subject);

    const academic = {
      subjects: gradesWithScore,
      averageGrade: avgGrade ? Math.round(avgGrade * 10) / 10 : null,
      strengths,
      weaknesses,
      rawGrades: studentGrades || [],
    };

    // ── Preferences ──────────────────────────────────────────
    const vakDominant = vakResult
      ? Object.entries(vakResult).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : null;

    const preferences = {
      vak: vakResult || null,
      vakDominant,
      communicationStyle:
        daniMemory?.studentProfile?.communicationStyle ?? null,
      interests: daniMemory?.studentProfile?.interests ?? [],
      formats: vakDominant
        ? ({
            visual: ["videos", "gráficas"],
            auditory: ["podcasts", "explicaciones"],
            kinesthetic: ["retos", "práctica"],
          }[vakDominant] ?? [])
        : [],
    };

    // ── Behavior ─────────────────────────────────────────────
    const recentSessions = (sessions || []).slice(-14);
    const activeDays = new Set(recentSessions.map((s) => s.date?.slice(0, 10)))
      .size;
    const avgDuration = recentSessions.length
      ? Math.round(
          recentSessions.reduce((sum, s) => sum + (s.duration ?? 0), 0) /
            recentSessions.length,
        )
      : 0;

    const lastSession = recentSessions.length
      ? recentSessions[recentSessions.length - 1]
      : null;

    const completedMissions = (missions || []).filter(
      (m) => m.completed,
    ).length;
    const totalMissions = (missions || []).length;

    const behavior = {
      activeDaysLast14: activeDays,
      avgSessionMinutes: avgDuration,
      totalActiveMinutes: totalActiveMinutes || 0,
      lastSessionDate: lastSession?.date ?? null,
      consistency:
        totalMissions > 0
          ? Math.round((completedMissions / totalMissions) * 100)
          : 0,
      conversationCount: conversationCount || 0,
    };

    // ── Goals ────────────────────────────────────────────────
    const goals = {
      academic: daniMemory?.studentProfile?.goals ?? [],
      habits: [],
      skills: [],
    };

    // ── Current state ────────────────────────────────────────
    const level = getLevelFromPoints(totalPoints || 0);
    const recentMoods = (studentMoodHistory || []).slice(-7).map((m) => m.mood);
    const dominantMood = recentMoods.length
      ? getMostFrequent(recentMoods)
      : null;

    const state = {
      totalPoints: totalPoints || 0,
      level,
      streak: streak?.current || 0,
      bestStreak: streak?.longest || 0,
      recentTopics: (academicTopics || []).slice(-5),
      dominantMood,
      subscriptionTier: subscriptionTier || "basic",
      risks: detectRisks({
        activeDays,
        streak: streak?.current || 0,
        weaknesses,
      }),
    };

    return { identity, academic, preferences, behavior, goals, state };
  }, [ctx]);

  return {
    profile,
    isReady: profile !== null,
  };
}

// ── Helpers ──────────────────────────────────────────────────

function getLevelFromPoints(points) {
  if (points >= 5000)
    return { name: "Maestro", tier: 5, next: null, nextAt: null };
  if (points >= 2500)
    return { name: "Experto", tier: 4, next: "Maestro", nextAt: 5000 };
  if (points >= 1000)
    return { name: "Avanzado", tier: 3, next: "Experto", nextAt: 2500 };
  if (points >= 500)
    return { name: "Intermedio", tier: 2, next: "Avanzado", nextAt: 1000 };
  return { name: "Principiante", tier: 1, next: "Intermedio", nextAt: 500 };
}

function getMostFrequent(arr) {
  const freq = {};
  arr.forEach((v) => {
    freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

function detectRisks({ activeDays, streak, weaknesses }) {
  const risks = [];
  if (activeDays < 3)
    risks.push({
      type: "low_activity",
      severity: "medium",
      label: "Poca actividad reciente",
    });
  if (streak === 0)
    risks.push({ type: "streak_broken", severity: "low", label: "Racha rota" });
  if (weaknesses.length >= 2)
    risks.push({
      type: "multiple_weak_subjects",
      severity: "medium",
      label: `Materias por reforzar: ${weaknesses.slice(0, 2).join(", ")}`,
    });
  return risks;
}
