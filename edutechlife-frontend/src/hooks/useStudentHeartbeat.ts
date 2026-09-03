import { useEffect, useRef, useCallback } from "react";
import { useAuthIdentity } from "./useAuthIdentity";
import { API_BASE_URL } from "../config/api";

/**
 * useStudentHeartbeat - Auto-send heartbeat to track student activity
 *
 * Features:
 * - Auto-sends heartbeat every 60-90 seconds (randomized to avoid thundering herd)
 * - Retries on network error with exponential backoff (max 3 retries)
 * - Pauses when browser tab is hidden (page visibility API)
 * - Resumes when tab regains focus
 * - Graceful error handling: logs warnings but never blocks UI
 * - Cleans up timers/listeners on unmount
 *
 * @param {string} studentId - The student ID to send heartbeat for
 * @param {number} [interval=75000] - Base interval in ms (60-90s recommended)
 * @returns {void}
 */
export const useStudentHeartbeat = (
  studentId: string | null,
  interval: number = 75000,
) => {
  const { token, isSignedIn } = useAuthIdentity();
  const heartbeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabVisibleRef = useRef<boolean>(true);
  const failureCountRef = useRef<number>(0);
  const lastHeartbeatRef = useRef<number>(0);

  // Random jitter: 60-90 seconds
  const getNextInterval = useCallback(() => {
    return interval + Math.random() * 30000 - 15000;
  }, [interval]);

  // Exponential backoff: 1s, 2s, 4s
  const getRetryDelay = useCallback((attemptNumber: number) => {
    return Math.min(1000 * Math.pow(2, attemptNumber), 4000);
  }, []);

  // Send heartbeat to backend
  const sendHeartbeat = useCallback(
    async (retryCount = 0) => {
      if (!studentId || !token || !isSignedIn) {
        return;
      }

      try {
        const now = Date.now();

        // Rate limit: never send more than once per 30 seconds
        if (
          lastHeartbeatRef.current &&
          now - lastHeartbeatRef.current < 30000
        ) {
          return;
        }

        lastHeartbeatRef.current = now;

        const response = await fetch(
          `${API_BASE_URL}/api/smartboard/heartbeat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              studentId,
              timestamp: now,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Heartbeat failed: ${response.status}`);
        }

        const data = await response.json();

        // Reset retry counter on success
        failureCountRef.current = 0;

        // Log server time for drift detection (optional)
        if (data.serverTime) {
          const drift = Math.abs(now - new Date(data.serverTime).getTime());
          if (drift > 5000) {
            console.warn(
              `[HEARTBEAT] Time drift detected: ${drift}ms. Consider syncing.`,
            );
          }
        }
      } catch (error) {
        failureCountRef.current++;

        const errorMsg = error instanceof Error ? error.message : String(error);
        console.warn(
          `[HEARTBEAT] Send failed (attempt ${failureCountRef.current}): ${errorMsg}`,
        );

        // Retry with exponential backoff (max 3 retries)
        if (retryCount < 3) {
          const delay = getRetryDelay(retryCount);
          retryTimerRef.current = setTimeout(() => {
            sendHeartbeat(retryCount + 1);
          }, delay);
        } else {
          console.warn(
            "[HEARTBEAT] Max retries exceeded. Will retry on next scheduled interval.",
          );
          failureCountRef.current = 0; // Reset for next cycle
        }
      }
    },
    [studentId, token, isSignedIn, getRetryDelay],
  );

  // Manual trigger: send heartbeat immediately (for user actions like login/focus)
  const triggerHeartbeat = useCallback(() => {
    sendHeartbeat(0);
  }, [sendHeartbeat]);

  // Schedule next heartbeat
  const scheduleNextHeartbeat = useCallback(() => {
    // Cancel existing timers
    if (heartbeatTimerRef.current) {
      clearTimeout(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    // Only schedule if tab is visible, signed in, and have credentials
    if (!tabVisibleRef.current || !studentId || !token || !isSignedIn) {
      return;
    }

    const nextInterval = getNextInterval();
    heartbeatTimerRef.current = setTimeout(() => {
      sendHeartbeat(0);
      scheduleNextHeartbeat(); // Schedule next one
    }, nextInterval);
  }, [studentId, token, isSignedIn, getNextInterval, sendHeartbeat]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      tabVisibleRef.current = isVisible;

      if (isVisible) {
        // Tab became visible: resume heartbeats
        console.debug("[HEARTBEAT] Tab visible, resuming heartbeats");
        sendHeartbeat(0);
        scheduleNextHeartbeat();
      } else {
        // Tab became hidden: pause heartbeats
        console.debug("[HEARTBEAT] Tab hidden, pausing heartbeats");
        if (heartbeatTimerRef.current) {
          clearTimeout(heartbeatTimerRef.current);
          heartbeatTimerRef.current = null;
        }
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sendHeartbeat, scheduleNextHeartbeat]);

  // Handle focus/blur events (supplement to visibilitychange)
  useEffect(() => {
    const handleFocus = () => {
      if (tabVisibleRef.current) {
        console.debug("[HEARTBEAT] Window focused");
        triggerHeartbeat();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [triggerHeartbeat]);

  // Main effect: setup and teardown heartbeat schedule
  useEffect(() => {
    if (!studentId || !token || !isSignedIn) {
      // Clean up if signed out
      if (heartbeatTimerRef.current) {
        clearTimeout(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      return;
    }

    console.debug(
      `[HEARTBEAT] Starting heartbeat for student: ${studentId}, interval: ${interval}ms`,
    );

    // Send first heartbeat immediately
    sendHeartbeat(0);

    // Schedule subsequent heartbeats
    scheduleNextHeartbeat();

    // Cleanup on unmount or when dependencies change
    return () => {
      console.debug("[HEARTBEAT] Cleaning up heartbeat timers");
      if (heartbeatTimerRef.current) {
        clearTimeout(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [
    studentId,
    token,
    isSignedIn,
    interval,
    sendHeartbeat,
    scheduleNextHeartbeat,
  ]);

  // Expose trigger for manual use if needed
  return { triggerHeartbeat };
};

export default useStudentHeartbeat;
