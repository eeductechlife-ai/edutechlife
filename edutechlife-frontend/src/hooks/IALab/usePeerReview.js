import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { isFeatureEnabled } from "../../config/featureFlags";
import {
  DEFAULT_PEER_RUBRIC,
  computePeerScore,
  validatePeerScores,
} from "../../utils/peerRubric";

/**
 * Peer Review (Fase B) — asignaciones y envío de revisiones.
 *
 * Deshabilitado por defecto (FEATURE_FLAGS.PEER_REVIEW=false): el hook no hace
 * ninguna consulta y devuelve un estado vacío hasta que se habilite.
 */
export default function usePeerReview({ userId, moduleId } = {}) {
  const enabled = isFeatureEnabled("PEER_REVIEW");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!enabled || !userId || !supabase) return;
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("peer_assignments")
        .select("*")
        .eq("reviewer_id", userId)
        .eq("status", "pending");
      if (moduleId) query = query.eq("module_id", moduleId);
      const { data, error: qError } = await query;
      if (qError) throw qError;
      setAssignments(data || []);
    } catch (err) {
      setError(err?.message || "peer_review_error");
    } finally {
      setLoading(false);
    }
  }, [enabled, userId, moduleId]);

  useEffect(() => {
    load();
  }, [load]);

  const submitReview = useCallback(
    async (assignmentId, scores, feedback, criteria = DEFAULT_PEER_RUBRIC) => {
      if (!enabled || !userId || !supabase) {
        return { success: false, error: "peer_review_disabled" };
      }
      const validation = validatePeerScores(scores, criteria);
      if (!validation.valid) {
        return { success: false, error: "incomplete", missing: validation.missing };
      }
      try {
        const total = computePeerScore(scores, criteria);
        const { data, error: insError } = await supabase
          .from("peer_reviews")
          .insert({
            assignment_id: assignmentId,
            reviewer_id: userId,
            scores,
            feedback: feedback || "",
            total,
          })
          .select("*")
          .single();
        if (insError) throw insError;
        await supabase
          .from("peer_assignments")
          .update({ status: "submitted" })
          .eq("id", assignmentId)
          .eq("reviewer_id", userId);
        setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err?.message || "peer_review_error" };
      }
    },
    [enabled, userId],
  );

  return { enabled, assignments, loading, error, reload: load, submitReview };
}
