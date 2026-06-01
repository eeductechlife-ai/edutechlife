export interface UserProgressRow {
  user_id: string;
  module_id: number;
  activity_type: string | null;
  resource_id: string | null;
  is_completed: boolean;
  completed_lessons: Record<string, unknown>;
  score: number | null;
  last_lesson_id: string | null;
  resources_viewed: number | null;
  total_resources: number | null;
  module_score: number | null;
  community_comment: boolean | null;
  gamification_data: Record<string, unknown> | null;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  total_learning_hours: number | null;
  created_at: string;
  updated_at: string;
}

export interface CertificateRow {
  id: string;
  user_id: string;
  module_id: number;
  overall_score: number | null;
  certificate_url: string | null;
  issued_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface ForumPostRow {
  id: string;
  user_id: string;
  content: string;
  tags: string[];
  upvotes: number;
  is_verified: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumVoteRow {
  id: string;
  post_id: string;
  user_id: string;
  vote_type: string;
  created_at: string;
}

export interface ForumCommentRow {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ForumProfileRow {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  reputation: number;
  created_at: string;
}

export interface ForumNotificationRow {
  id: string;
  user_id: string;
  type: string;
  post_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface UserVideoProgressRow {
  user_id: string;
  module_id: number;
  video_id: string;
  watched_seconds: number | null;
  completed: boolean;
  updated_at: string;
}

export interface UserInfographicProgressRow {
  user_id: string;
  infographic_id: string;
  module_id: number;
  viewed: boolean;
  updated_at: string;
}

export interface UserActivityRow {
  user_id: string;
  module_id: number;
  activity_id: string;
  completed: boolean;
  score: number | null;
  submission: Record<string, unknown> | null;
  submitted_at: string | null;
  updated_at: string;
}

export interface UserExamRow {
  user_id: string;
  module_id: number;
  exam_id: string;
  score: number;
  max_score: number | null;
  passed: boolean;
  answers: Record<string, unknown> | null;
  submitted_at: string;
  completed_at: string | null;
}

export interface UserPreferenceRow {
  user_id: string;
  preferences: Record<string, unknown>;
  updated_at: string;
}

export interface ActivityLogRow {
  id: string;
  user_id: string;
  activity_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ModuleContentRow {
  id: string;
  module_id: number;
  title: string;
  content: string;
  order_index: number;
}

export interface ModuleLessonRow {
  id: string;
  module_id: number;
  lesson_id: string;
  title: string;
  content: string;
  order_index: number;
}

export interface ModuleTopicRow {
  id: string;
  module_id: number;
  topic_id: string;
  title: string;
  content: string;
  order_index: number;
}

export interface ModuleResourceRow {
  id: string;
  module_id: number;
  resource_id: string;
  title: string;
  type: string;
  url: string | null;
  order_index: number;
}

export interface QuizQuestionRow {
  id: string;
  module_id: number;
  question: string;
  options: Record<string, unknown>;
  correct_answer: string;
  order_index: number;
}

export interface StudyNoteRow {
  id: string;
  user_id: string;
  resource_id: string;
  note_content: string;
  created_at: string;
  updated_at: string;
}

export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};
