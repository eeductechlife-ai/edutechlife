import { useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";

const LS_KEY = (studentId) => `dani_memory_${studentId}`;

/**
 * Persists Dani's structured memory to Supabase `dani_memory` table.
 * Falls back to localStorage when offline or when DB write fails.
 *
 * @param {string|null} studentId - Supabase student UUID (from `students` table)
 * @returns {{ loadMemory, saveMemory }}
 */
export function useDaniMemory(studentId) {
  const pendingSaveRef = useRef(null);

  const loadMemory = useCallback(async () => {
    if (!studentId) return _loadFromLS(studentId);

    try {
      const { data, error } = await supabase
        .from("dani_memory")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const memory = _rowToMemory(data);
        _saveToLS(studentId, memory);
        return memory;
      }
    } catch {
      // offline or table not yet migrated — fall through to localStorage
    }

    return _loadFromLS(studentId);
  }, [studentId]);

  const saveMemory = useCallback(
    async (memory) => {
      _saveToLS(studentId, memory);

      if (!studentId) return;

      // Debounce DB writes — wait 2s of inactivity before writing
      if (pendingSaveRef.current) clearTimeout(pendingSaveRef.current);
      pendingSaveRef.current = setTimeout(async () => {
        try {
          const row = _memoryToRow(studentId, memory);
          await supabase.from("dani_memory").upsert(row, {
            onConflict: "student_id",
            ignoreDuplicates: false,
          });
        } catch {
          // DB write failed — localStorage fallback already saved above
        }
      }, 2000);
    },
    [studentId],
  );

  return { loadMemory, saveMemory };
}

// ── Serialization helpers ────────────────────────────────────

function _rowToMemory(row) {
  return {
    conversations: [],
    studentProfile: {
      communicationStyle: row.communication_style || null,
      strengths: row.strengths || [],
      challenges: row.weaknesses || [],
      interests: row.interests || [],
    },
    pendingTopics: (row.pending_topics || []).map((t) =>
      typeof t === "string"
        ? { topic: t, count: 1, lastSeen: row.last_updated }
        : t,
    ),
    interactionCount: 0,
    lastSessionSummary: null,
    frequentErrors: row.frequent_errors || [],
    lastMood: row.last_mood || null,
  };
}

function _memoryToRow(studentId, memory) {
  return {
    student_id: studentId,
    communication_style: memory.studentProfile?.communicationStyle || null,
    strengths: (memory.studentProfile?.strengths || []).slice(-20),
    weaknesses: (memory.studentProfile?.challenges || []).slice(-20),
    interests: (memory.studentProfile?.interests || []).slice(-20),
    pending_topics: (memory.pendingTopics || [])
      .slice(-30)
      .map((t) => (typeof t === "string" ? t : t.topic)),
    frequent_errors: (memory.frequentErrors || []).slice(-20),
    last_mood: memory.lastMood || null,
    last_updated: new Date().toISOString(),
  };
}

function _loadFromLS(studentId) {
  if (!studentId) return null;
  try {
    const raw = localStorage.getItem(LS_KEY(studentId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function _saveToLS(studentId, memory) {
  if (!studentId) return;
  try {
    localStorage.setItem(LS_KEY(studentId), JSON.stringify(memory));
  } catch {
    // localStorage quota exceeded — silently skip
  }
}
