import { useEffect, useRef } from "react";
import { useNotification } from "../context/NotificationContext";
import { useSmartBoardKids } from "../context/SmartBoardKidsContext";
import { useAuthIdentity } from "./useAuthIdentity";
import { track } from "../lib/analytics";
import { EVENTS } from "../lib/analyticsEvents";

/**
 * SmartBoard NotificationEngine — domain triggers for the student (brief §42).
 *
 * Fires at most one notification per type per day (anti-spam, §42) using a
 * localStorage day-stamp key. Reuses the existing NotificationContext
 * (Supabase + localStorage fallback), never a parallel store.
 *
 * Triggers:
 *   - mission_ready   → "Tu misión de hoy está lista." (an incomplete mission exists)
 *   - reinforcement   → "SmartBoard detectó una oportunidad de refuerzo."
 *                       (a graded subject is below the reinforcement threshold)
 */

const REINFORCE_THRESHOLD = 3.5; // Colombian scale 1.0–5.0

function alreadyFiredToday(key) {
  try {
    return localStorage.getItem(key) === new Date().toDateString();
  } catch {
    return false;
  }
}

function stampToday(key) {
  try {
    localStorage.setItem(key, new Date().toDateString());
  } catch {
    /* quota — non-blocking */
  }
}

export function useSmartBoardNotifications() {
  const { createNotification, preferences } = useNotification();
  const { dataLoaded, missions, subjectsWithGrades } = useSmartBoardKids();
  const { userId } = useAuthIdentity();
  // Per-key in-flight guard so we never double-fire while a create is awaiting,
  // but still retry across renders until it genuinely succeeds.
  const inFlight = useRef({});

  useEffect(() => {
    // Gate on userId: createNotification no-ops without it, so wait until auth is ready.
    if (!dataLoaded || !userId) return;
    if (preferences && preferences.reminders === false) return;

    const fireOnce = async (key, hasStamp, buildPayload, onSuccess) => {
      if (!hasStamp || alreadyFiredToday(key) || inFlight.current[key]) return;
      inFlight.current[key] = true;
      try {
        const created = await createNotification(buildPayload());
        if (created) {
          stampToday(key);
          onSuccess?.();
        }
      } finally {
        inFlight.current[key] = false;
      }
    };

    // 1. Daily mission ready
    const hasOpenMission = (missions || []).some((m) => !m.completed);
    fireOnce("sb_notif_mission_ready", hasOpenMission, () => ({
      type: "smartboard_mission",
      title: "🎯 Tu misión de hoy está lista",
      message: "Tienes una misión pendiente. ¡Complétala para sumar puntos!",
      metadata: { tab: "misiones" },
    }));

    // 2. Reinforcement opportunity — lowest graded subject below threshold
    const weak = (subjectsWithGrades || [])
      .filter(
        (s) =>
          typeof s.gradeScore === "number" &&
          s.gradeScore > 0 &&
          s.gradeScore < REINFORCE_THRESHOLD,
      )
      .sort((a, b) => a.gradeScore - b.gradeScore);
    const target = weak[0];
    fireOnce(
      "sb_notif_reinforcement",
      !!target,
      () => ({
        type: "smartboard_reinforcement",
        title: "💡 Oportunidad de refuerzo",
        message: `SmartBoard detectó que ${target.name} (${target.gradeScore.toFixed(1)}/5) necesita atención. Practica 10 min hoy.`,
        metadata: { tab: "oral", subject: target.id },
      }),
      () =>
        track(EVENTS.ALERT_GENERATED, {
          source: "reinforcement",
          subject: target.id,
        }),
    );
  }, [
    userId,
    dataLoaded,
    missions,
    subjectsWithGrades,
    createNotification,
    preferences,
  ]);
}
