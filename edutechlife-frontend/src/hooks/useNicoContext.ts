import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export interface NicoContextData {
  studentName: string;
  studentAge: number;
  primarySubject: string;
  performanceLevel: string;
  totalPoints: number;
  lessonsCompleted: number;
  learningStyle: string; // VAK result
  recentTopics: string[];
  weakAreas: string[];
  streak: number;
}

interface AcademicRecord {
  subject: string;
  performance_level: string;
  total_points: number;
  lessons_completed: number;
  average_score: number;
  topics_mastered: string[];
  topics_in_progress: string[];
  weak_areas: string[];
}

interface StudentRecord {
  id: string;
  name: string;
  age: number;
  vak_result_json?: {
    primary_style?: string;
  };
}

interface StreakRecord {
  current_streak: number;
}

/**
 * Hook to load and cache student's academic context for Nico personalization
 * Fetches: student data, academic context per subject, VAK results, streak
 */
export const useNicoContext = (): {
  context: NicoContextData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const { user } = useAuth();
  const [context, setContext] = useState<NicoContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNicoContext = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch student data
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("id, name, age, vak_result_json")
        .eq("auth_id", user.id)
        .single();

      if (studentError) throw studentError;

      const student = studentData as StudentRecord;

      // Fetch academic context for all subjects
      const { data: academicData, error: academicError } = await supabase
        .from("academic_context")
        .select("*")
        .eq("student_id", student.id)
        .order("total_points", { ascending: false });

      if (academicError) throw academicError;

      const academics = (academicData || []) as AcademicRecord[];

      // Calculate aggregate stats
      const totalPoints = academics.reduce((sum, a) => sum + a.total_points, 0);
      const lessonsCompleted = academics.reduce(
        (sum, a) => sum + a.lessons_completed,
        0,
      );

      // Find primary subject (highest points)
      const primarySubject =
        academics.length > 0 ? academics[0].subject : "general";
      const primaryAcademic = academics.find(
        (a) => a.subject === primarySubject,
      );

      // Collect weak areas and topics
      const allWeakAreas = academics
        .flatMap((a) => a.weak_areas || [])
        .filter((item, index, self) => self.indexOf(item) === index)
        .slice(0, 5);

      const recentTopics = academics
        .flatMap((a) => a.topics_in_progress || [])
        .filter((item, index, self) => self.indexOf(item) === index)
        .slice(0, 5);

      // Get learning style from VAK result
      const learningStyle =
        student.vak_result_json?.primary_style || "multi-modal";

      // Fetch learning streak
      const { data: streakData, error: streakError } = await supabase
        .from("learning_streaks")
        .select("current_streak")
        .eq("student_id", student.id)
        .maybeSingle();

      const streak = (streakData as StreakRecord | null)?.current_streak || 0;

      // Compile context
      const nicoContext: NicoContextData = {
        studentName: student.name,
        studentAge: student.age,
        primarySubject,
        performanceLevel: primaryAcademic?.performance_level || "beginner",
        totalPoints,
        lessonsCompleted,
        learningStyle,
        recentTopics,
        weakAreas: allWeakAreas,
        streak,
      };

      setContext(nicoContext);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load academic context";
      console.error("[useNicoContext] Error:", message);
      setError(message);
      setContext(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNicoContext();
  }, [user?.id]);

  return {
    context,
    isLoading,
    error,
    refetch: fetchNicoContext,
  };
};

/**
 * Generate a contextual system prompt for Nico based on student's academic data
 */
export const buildNicoSystemPrompt = (
  context: NicoContextData | null,
): string => {
  const basePath = `Eres Nico, asistente de IA personalizado de EdutechLife. Tu objetivo es:
1. Ayudar al estudiante con dudas académicas
2. Motivar y celebrar logros
3. Adaptar tu lenguaje al nivel del estudiante
4. Sugerir recursos y práctica basada en áreas débiles`;

  if (!context) {
    return basePath;
  }

  const contextualPath = `
CONTEXTO DEL ESTUDIANTE:
- Nombre: ${context.studentName}
- Edad: ${context.studentAge} años
- Nivel de desempeño: ${context.performanceLevel}
- Puntos totales: ${context.totalPoints}
- Lecciones completadas: ${context.lessonsCompleted}
- Racha actual: ${context.streak} días
- Estilo de aprendizaje: ${context.learningStyle}
- Tema principal: ${context.primarySubject}

ÁREAS A REFORZAR:
${
  context.weakAreas.length > 0
    ? context.weakAreas.map((area) => `- ${area}`).join("\n")
    : "- El estudiante va muy bien en todas las áreas"
}

TEMAS EN PROGRESO:
${
  context.recentTopics.length > 0
    ? context.recentTopics.map((topic) => `- ${topic}`).join("\n")
    : "- El estudiante no tiene temas en progreso"
}

ESTRATEGIA DE CONVERSACIÓN:
- Usa el nombre del estudiante cuando sea apropiado
- Adapta la complejidad a su nivel de desempeño (${context.performanceLevel})
- Si pregunta sobre "${context.primarySubject}", ofrece ejemplos prácticos
- Celebra su racha de ${context.streak} días
- Sugiere práctica en: ${context.weakAreas.slice(0, 2).join(", ") || "temas en revisión"}`;

  return basePath + contextualPath;
};
