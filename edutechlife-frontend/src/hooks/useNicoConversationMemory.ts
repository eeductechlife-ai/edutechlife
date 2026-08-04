import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export interface ConversationEntry {
  user_message: string;
  ai_response: string;
  subject?: string;
  emotional_context?: {
    sentiment?: string;
    engagement_level?: number;
    frustration_level?: number;
    energy_level?: number;
  };
  learning_style_applied?: string;
}

/**
 * Hook to save and retrieve Nico conversations from Supabase
 * Provides conversation persistence and memory for Nico personalization
 */
export const useNicoConversationMemory = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Save a single conversation exchange to Supabase
   */
  const saveConversation = useCallback(
    async (entry: ConversationEntry): Promise<void> => {
      if (!user?.id) {
        console.warn("[useNicoConversationMemory] No authenticated user");
        return;
      }

      try {
        setIsSaving(true);
        setError(null);

        // Get student ID from auth_id
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("id")
          .eq("auth_id", user.id)
          .single();

        if (studentError) throw studentError;

        // Insert conversation
        const { error: insertError } = await supabase
          .from("conversations")
          .insert({
            student_id: student.id,
            user_message: entry.user_message,
            ai_response: entry.ai_response,
            subject: entry.subject || null,
            emotional_context: entry.emotional_context || {
              sentiment: "neutral",
              engagement_level: 0.5,
              frustration_level: 0,
              energy_level: 0.5,
            },
            learning_style_applied: entry.learning_style_applied || null,
            messages_in_context: 1,
            model_used: "nico-v2",
            timestamp: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save conversation";
        console.error("[useNicoConversationMemory] Save error:", message);
        setError(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [user?.id],
  );

  /**
   * Fetch recent conversations for context
   */
  const fetchRecentConversations = useCallback(
    async (limit: number = 10): Promise<ConversationEntry[]> => {
      if (!user?.id) {
        return [];
      }

      try {
        // Get student ID
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("id")
          .eq("auth_id", user.id)
          .single();

        if (studentError) throw studentError;

        // Fetch recent conversations
        const { data: conversations, error: fetchError } = await supabase
          .from("conversations")
          .select(
            "user_message, ai_response, subject, emotional_context, learning_style_applied",
          )
          .eq("student_id", student.id)
          .order("timestamp", { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;

        return (conversations || []) as ConversationEntry[];
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch conversations";
        console.error("[useNicoConversationMemory] Fetch error:", message);
        return [];
      }
    },
    [user?.id],
  );

  /**
   * Build a context string from recent conversations for prompt injection
   */
  const buildConversationContext = useCallback(
    async (limit: number = 5): Promise<string> => {
      const conversations = await fetchRecentConversations(limit);

      if (conversations.length === 0) {
        return "";
      }

      const contextLines = conversations
        .slice(0, limit)
        .map(
          (conv, i) =>
            `[Conversación anterior ${i + 1}]
Estudiante: ${conv.user_message.substring(0, 100)}...
Nico: ${conv.ai_response.substring(0, 100)}...
${conv.subject ? `Tema: ${conv.subject}` : ""}`,
        )
        .join("\n\n");

      return `HISTORIAL RECIENTE DE CONVERSACIONES:
${contextLines}

Usa este contexto para mantener continuidad en la conversación y personalizar respuestas.`;
    },
    [fetchRecentConversations],
  );

  return {
    saveConversation,
    fetchRecentConversations,
    buildConversationContext,
    isSaving,
    error,
  };
};
