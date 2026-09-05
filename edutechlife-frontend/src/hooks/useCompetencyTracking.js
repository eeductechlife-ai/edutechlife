import { useCallback } from "react";
import { useSmartBoardKids } from "../context/SmartBoardKidsContext";
import { track } from "../lib/analytics";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function postMastery(studentId, entries) {
  const token = sessionStorage.getItem("auth_token") || "";
  const res = await fetch(`${API_BASE_URL}/api/smartboard/adaptive/mastery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ studentId, entries }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Hook that components use to report activity completion to the Learning Graph.
 *
 * Usage:
 *   const { trackActivity } = useCompetencyTracking();
 *   await trackActivity({ subject: "matematicas", score: 0.85 });
 *
 * @returns {{ trackActivity, getCompetencyIds }}
 */
export function useCompetencyTracking() {
  const { gradeLevel, countryCode, supabaseQueries } = useSmartBoardKids();
  const studentDbId = supabaseQueries?.studentData?.data?.id ?? null;

  /**
   * Map subject + grade to competency IDs (client-side, no network call needed).
   * Mirrors the server-side getCompetencyIdsForSubject logic.
   */
  const getCompetencyIds = useCallback(
    (subject) => {
      const grade = parseInt(gradeLevel, 10) || 1;
      const RANGE =
        grade <= 3
          ? "1-3"
          : grade <= 5
            ? "4-5"
            : grade <= 7
              ? "6-7"
              : grade <= 9
                ? "8-9"
                : "10-11";
      const cc = (countryCode || "CO").toLowerCase();
      return [0, 1, 2, 3].map((i) => `${cc}_${subject}_${RANGE}_${i}`);
    },
    [gradeLevel, countryCode],
  );

  /**
   * Report activity completion for one or more competencies.
   *
   * @param {object} opts
   * @param {string} opts.subject      - e.g. 'matematicas'
   * @param {number} opts.score        - 0.0 to 1.0
   * @param {string} [opts.studentId]  - override; otherwise read from context
   * @param {string[]} [opts.competencyIds] - if omitted, derived from subject+grade
   */
  const trackActivity = useCallback(
    async ({ subject, score, studentId, competencyIds }) => {
      const sid = studentId ?? studentDbId;
      if (!sid || !subject || score === undefined) return;

      const ids = competencyIds ?? getCompetencyIds(subject);
      const entries = ids
        .filter(Boolean)
        .map((competencyId) => ({ competencyId, score }));

      try {
        await postMastery(sid, entries);
        track("competency_updated", {
          subject,
          score: Math.round(score * 100),
        });
      } catch {
        // Non-blocking — tracking failure must never break activity flow
      }
    },
    [getCompetencyIds, studentDbId],
  );

  return { trackActivity, getCompetencyIds };
}
