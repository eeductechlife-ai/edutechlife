import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext"; // Or wherever auth comes from

// Type definitions
export interface StudentData {
  id: string;
  auth_id: string;
  name: string;
  age: number;
  email?: string;
  vak_result_json?: Record<string, any>;
  subscription_tier: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface PointsHistoryEntry {
  id: string;
  student_id: string;
  points: number;
  reason: string;
  category: string;
  timestamp: string;
}

export interface VAKResult {
  id: string;
  student_id: string;
  visual_score: number;
  auditory_score: number;
  kinesthetic_score: number;
  primary_style?: string;
  secondary_style?: string;
  detected_at: string;
}

export interface Session {
  id: string;
  student_id: string;
  start_time: string;
  end_time?: string;
  subject: string;
  points_earned: number;
  type: string;
  duration_minutes?: number;
  completion_percentage: number;
}

export interface AcademicContext {
  id: string;
  student_id: string;
  subject: string;
  performance_level: string;
  total_points: number;
  lessons_completed: number;
  average_score: number;
}

export interface Achievement {
  id: string;
  student_id: string;
  achievement_type: string;
  title: string;
  description?: string;
  badge_url?: string;
  earned_at: string;
  points_awarded: number;
  is_milestone: boolean;
}

export interface LearningStreak {
  id: string;
  student_id: string;
  current_streak: number;
  best_streak: number;
  last_activity_date?: string;
  total_days_active: number;
}

export interface SmartboardSettings {
  id: string;
  student_id: string;
  difficulty_level: string;
  daily_goal_minutes: number;
  preferred_subject?: string;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  dark_mode: boolean;
  show_hints: boolean;
  adaptive_learning: boolean;
  language: string;
}

// Query keys factory for better cache management
export const smartBoardQueryKeys = {
  all: ["smartboard"] as const,
  student: (studentId: string) =>
    [...smartBoardQueryKeys.all, "student", studentId] as const,
  pointsHistory: (studentId: string) =>
    [...smartBoardQueryKeys.all, "pointsHistory", studentId] as const,
  vakResults: (studentId: string) =>
    [...smartBoardQueryKeys.all, "vakResults", studentId] as const,
  sessions: (studentId: string) =>
    [...smartBoardQueryKeys.all, "sessions", studentId] as const,
  academicContext: (studentId: string) =>
    [...smartBoardQueryKeys.all, "academicContext", studentId] as const,
  achievements: (studentId: string) =>
    [...smartBoardQueryKeys.all, "achievements", studentId] as const,
  streaks: (studentId: string) =>
    [...smartBoardQueryKeys.all, "streaks", studentId] as const,
  settings: (studentId: string) =>
    [...smartBoardQueryKeys.all, "settings", studentId] as const,
};

// Hook: Fetch student data
export const useStudentData = (): UseQueryResult<StudentData> => {
  const { user } = useAuth();

  return useQuery({
    queryKey: smartBoardQueryKeys.student(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("auth_id", user.id)
        .single();

      if (error) throw error;
      return data as StudentData;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook: Fetch points history with real-time subscription
export const usePointsHistory = (): UseQueryResult<PointsHistoryEntry[]> => {
  const { user } = useAuth();

  return useQuery({
    queryKey: smartBoardQueryKeys.pointsHistory(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("points_history")
        .select("*")
        .eq("student_id", student.data.id)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as PointsHistoryEntry[];
    },
    enabled: !!user?.id,
  });
};

// Mutation: Add points
export const useAddPoints = (): UseMutationResult<
  PointsHistoryEntry,
  Error,
  { points: number; reason: string; category?: string }
> => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      points,
      reason,
      category = "bonus",
    }: {
      points: number;
      reason: string;
      category?: string;
    }) => {
      if (!user?.id) throw new Error("No authenticated user");

      // Fetch student ID
      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      // Insert points entry
      const { data, error } = await supabase
        .from("points_history")
        .insert({
          student_id: student.data.id,
          points,
          reason,
          category,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as PointsHistoryEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: smartBoardQueryKeys.pointsHistory(user?.id || ""),
      });
    },
  });
};

// Hook: Fetch VAK results
export const useVAKResult = (): UseQueryResult<VAKResult | null> => {
  const { user } = useAuth();

  return useQuery({
    queryKey: smartBoardQueryKeys.vakResults(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("vak_results")
        .select("*")
        .eq("student_id", student.data.id)
        .order("detected_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return (data as VAKResult) || null;
    },
    enabled: !!user?.id,
  });
};

// Mutation: Set VAK result
export const useSetVAKResult = (): UseMutationResult<
  VAKResult,
  Error,
  {
    visual_score: number;
    auditory_score: number;
    kinesthetic_score: number;
    responses?: Record<string, any>;
  }
> => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      visual_score,
      auditory_score,
      kinesthetic_score,
      responses,
    }: {
      visual_score: number;
      auditory_score: number;
      kinesthetic_score: number;
      responses?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      // Determine primary style
      const scores = {
        visual: visual_score,
        auditory: auditory_score,
        kinesthetic: kinesthetic_score,
      };
      const primary_style = Object.entries(scores).reduce((a, b) =>
        a[1] > b[1] ? a : b,
      )[0];

      const { data, error } = await supabase
        .from("vak_results")
        .insert({
          student_id: student.data.id,
          visual_score,
          auditory_score,
          kinesthetic_score,
          primary_style,
          responses: responses || {},
          detected_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as VAKResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: smartBoardQueryKeys.vakResults(user?.id || ""),
      });
    },
  });
};

// Mutation: Create session
export const useSessionCreate = (): UseMutationResult<
  Session,
  Error,
  { subject: string; type?: string; content_id?: string }
> => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subject,
      type = "lesson",
      content_id,
    }: {
      subject: string;
      type?: string;
      content_id?: string;
    }) => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("sessions")
        .insert({
          student_id: student.data.id,
          subject,
          type,
          content_id,
          start_time: new Date().toISOString(),
          points_earned: 0,
          completion_percentage: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: smartBoardQueryKeys.sessions(user?.id || ""),
      });
    },
  });
};

// Hook: Fetch academic context for all subjects
export const useAcademicContext = (): UseQueryResult<AcademicContext[]> => {
  const { user } = useAuth();

  return useQuery({
    queryKey: smartBoardQueryKeys.academicContext(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("academic_context")
        .select("*")
        .eq("student_id", student.data.id);

      if (error) throw error;
      return data as AcademicContext[];
    },
    enabled: !!user?.id,
  });
};

// Hook: Fetch achievements
export const useAchievements = (): UseQueryResult<Achievement[]> => {
  const { user } = useAuth();

  return useQuery({
    queryKey: smartBoardQueryKeys.achievements(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("student_id", student.data.id)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      return data as Achievement[];
    },
    enabled: !!user?.id,
  });
};

// Hook: Fetch learning streaks
export const useLearningStreaks = (): UseQueryResult<LearningStreak | null> => {
  const { user } = useAuth();

  return useQuery({
    queryKey: smartBoardQueryKeys.streaks(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("learning_streaks")
        .select("*")
        .eq("student_id", student.data.id)
        .maybeSingle();

      if (error) throw error;
      return (data as LearningStreak) || null;
    },
    enabled: !!user?.id,
  });
};

// Mutation: Upsert learning streak
export const useUpsertStreak = (): UseMutationResult<
  LearningStreak,
  Error,
  { current_streak: number; best_streak: number; last_activity_date: string }
> => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      current_streak,
      best_streak,
      last_activity_date,
    }: {
      current_streak: number;
      best_streak: number;
      last_activity_date: string;
    }) => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("learning_streaks")
        .upsert(
          {
            student_id: student.data.id,
            current_streak,
            best_streak,
            last_activity_date,
            total_days_active: current_streak,
          },
          { onConflict: "student_id" },
        )
        .select()
        .single();

      if (error) throw error;
      return data as LearningStreak;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: smartBoardQueryKeys.streaks(user?.id || ""),
      });
    },
  });
};

// Mutation: Sync achievement to DB
export const useSyncAchievement = (): UseMutationResult<
  Achievement,
  Error,
  {
    achievement_type: string;
    title: string;
    description: string;
    points_awarded?: number;
  }
> => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      achievement_type,
      title,
      description,
      points_awarded = 0,
    }: {
      achievement_type: string;
      title: string;
      description: string;
      points_awarded?: number;
    }) => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data: existing } = await supabase
        .from("achievements")
        .select("id")
        .eq("student_id", student.data.id)
        .eq("achievement_type", achievement_type)
        .maybeSingle();

      if (existing) return existing as Achievement;

      const { data, error } = await supabase
        .from("achievements")
        .insert({
          student_id: student.data.id,
          achievement_type,
          title,
          description,
          points_awarded,
          earned_at: new Date().toISOString(),
          is_milestone: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Achievement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: smartBoardQueryKeys.achievements(user?.id || ""),
      });
    },
  });
};

// Hook: Fetch smartboard settings
export const useSmartboardSettings =
  (): UseQueryResult<SmartboardSettings | null> => {
    const { user } = useAuth();

    return useQuery({
      queryKey: smartBoardQueryKeys.settings(user?.id || ""),
      queryFn: async () => {
        if (!user?.id) throw new Error("No authenticated user");

        const student = await supabase
          .from("students")
          .select("id")
          .eq("auth_id", user.id)
          .single();

        if (student.error) throw student.error;

        const { data, error } = await supabase
          .from("smartboard_settings")
          .select("*")
          .eq("student_id", student.data.id)
          .maybeSingle();

        if (error) throw error;
        return (data as SmartboardSettings) || null;
      },
      enabled: !!user?.id,
    });
  };

// Mutation: Update smartboard settings
export const useUpdateSettings = (): UseMutationResult<
  SmartboardSettings,
  Error,
  Partial<SmartboardSettings>
> => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<SmartboardSettings>) => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("smartboard_settings")
        .update(updates)
        .eq("student_id", student.data.id)
        .select()
        .single();

      if (error) throw error;
      return data as SmartboardSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: smartBoardQueryKeys.settings(user?.id || ""),
      });
    },
  });
};

// Helper: Calculate total points from points history
export const useTotalPoints = (): number => {
  const { data: pointsHistory } = usePointsHistory();
  return pointsHistory?.reduce((sum, entry) => sum + entry.points, 0) ?? 0;
};

// Helper: Get sessions for student
export const useSessionsData = (): UseQueryResult<Session[]> => {
  const { user } = useAuth();

  return useQuery({
    queryKey: smartBoardQueryKeys.sessions(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("No authenticated user");

      const student = await supabase
        .from("students")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (student.error) throw student.error;

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("student_id", student.data.id)
        .order("start_time", { ascending: false });

      if (error) throw error;
      return data as Session[];
    },
    enabled: !!user?.id,
  });
};
