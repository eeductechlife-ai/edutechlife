import { useEffect, useRef, useCallback } from "react";
import { supabase } from "../../../../lib/supabase";

export function useEvaluationDraft({
  isOpen,
  userId,
  moduleId,
  responses,
  onSubmitComplete,
}) {
  const saveDraftTimerRef = useRef(null);
  const hasRestoredDraftRef = useRef(false);

  const restoreDraft = useCallback(async () => {
    if (!userId || !moduleId) return;
    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("completed_lessons")
        .eq("user_id", userId)
        .eq("module_id", moduleId)
        .eq("activity_type", "challenge_draft")
        .is("resource_id", null)
        .maybeSingle();
      if (error) throw error;
      if (data?.completed_lessons) {
        const draft = data.completed_lessons;
        return {
          ej1: draft.ej1,
          ej2: draft.ej2,
          ej3: draft.ej3,
          ej4: draft.ej4,
        };
      }
    } catch (err) {
      console.warn("Error restaurando borrador:", err);
    }
    return null;
  }, [userId, moduleId]);

  const clearDraft = useCallback(async () => {
    if (!userId || !moduleId) return;
    try {
      await supabase
        .from("user_progress")
        .delete()
        .eq("user_id", userId)
        .eq("module_id", moduleId)
        .eq("activity_type", "challenge_draft")
        .is("resource_id", null);
    } catch (err) {
      console.warn("Error limpiando borrador:", err);
    }
  }, [userId, moduleId]);

  useEffect(() => {
    if (isOpen && userId && moduleId && !hasRestoredDraftRef.current) {
      hasRestoredDraftRef.current = true;
      const restore = async () => {
        const draft = await restoreDraft();
        if (draft && typeof onSubmitComplete === "function") {
          if (draft.ej1) onSubmitComplete("ej1", draft.ej1);
          if (draft.ej2) onSubmitComplete("ej2", draft.ej2);
          if (draft.ej3) onSubmitComplete("ej3", draft.ej3);
          if (draft.ej4) onSubmitComplete("ej4", draft.ej4);
        }
      };
      restore();
    }
  }, [isOpen, userId, moduleId, restoreDraft, onSubmitComplete]);

  useEffect(() => {
    if (!isOpen || !userId || !moduleId) return;
    const hasContent =
      responses.ej1 || responses.ej2 || responses.ej3 || responses.ej4;
    if (!hasContent) return;

    if (saveDraftTimerRef.current) {
      clearTimeout(saveDraftTimerRef.current);
    }

    saveDraftTimerRef.current = setTimeout(async () => {
      try {
        await supabase
          .from("user_progress")
          .upsert(
            {
              user_id: userId,
              module_id: moduleId,
              activity_type: "challenge_draft",
              resource_id: null,
              completed_lessons: { ...responses },
              is_completed: false,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id,module_id,activity_type,resource_id",
            },
          )
          .select("*");
      } catch (err) {
        console.warn("Error auto-guardando borrador:", err);
      }
    }, 1500);

    return () => {
      if (saveDraftTimerRef.current) {
        clearTimeout(saveDraftTimerRef.current);
      }
    };
  }, [responses, isOpen, userId, moduleId]);

  const resetDraftFlags = useCallback(() => {
    hasRestoredDraftRef.current = false;
  }, []);

  return { clearDraft, resetDraftFlags };
}
