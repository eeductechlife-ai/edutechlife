import { useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useSmartBoardKids } from "../context/SmartBoardKidsContext";

export function useFeedbackLog() {
  const { supabaseQueries } = useSmartBoardKids();
  const studentDbId = supabaseQueries?.studentData?.data?.id ?? null;

  const logFeedback = useCallback(
    async ({ activity, emotion, score, context = {} }) => {
      if (!studentDbId) return;
      try {
        await supabase.from("feedback_log").insert({
          student_id: studentDbId,
          activity,
          emotion,
          score: score ?? null,
          context,
        });
      } catch {
        // Non-blocking — UI should never break on feedback failure
      }
    },
    [studentDbId],
  );

  return { logFeedback };
}
