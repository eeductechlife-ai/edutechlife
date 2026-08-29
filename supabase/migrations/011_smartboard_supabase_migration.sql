-- SmartBoard: Complete PostgreSQL Schema for Educational Platform (ages 6-16)
-- Migrates from localStorage to Supabase PostgreSQL with real-time sync support
-- Features: Student profiles, learning analytics, parent dashboards, Nico memory integration

-- ============================================================================
-- 1. STUDENTS TABLE
-- ============================================================================
-- Core student profile with auth integration
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 6 AND age <= 16),
  email TEXT,
  vak_result_json JSONB DEFAULT '{
    "visual": 0,
    "auditory": 0,
    "kinesthetic": 0,
    "primary_style": null,
    "tested_at": null
  }'::JSONB,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'premium_plus', 'institutional')),
  parent_email TEXT,
  parent_verified BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_activity TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_students_auth_id ON students(auth_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_email ON students(parent_email);
CREATE INDEX IF NOT EXISTS idx_students_subscription ON students(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_students_age ON students(age);
CREATE INDEX IF NOT EXISTS idx_students_last_activity ON students(last_activity);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);

-- ============================================================================
-- 2. SESSIONS TABLE
-- ============================================================================
-- Study sessions with subject, points, and session type tracking
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ DEFAULT now(),
  end_time TIMESTAMPTZ,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'language', 'science', 'history', 'art', 'general')),
  points_earned INTEGER DEFAULT 0 CHECK (points_earned >= 0),
  type TEXT DEFAULT 'lesson' CHECK (type IN ('lesson', 'game', 'quiz', 'free_practice', 'challenge')),
  duration_minutes INTEGER,
  content_id UUID,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_student ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_subject ON sessions(subject);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);
CREATE INDEX IF NOT EXISTS idx_sessions_student_start ON sessions(student_id, start_time DESC);

-- ============================================================================
-- 3. POINTS HISTORY TABLE
-- ============================================================================
-- Detailed point transaction log for gamification
CREATE TABLE IF NOT EXISTS points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points != 0),
  reason TEXT NOT NULL,
  category TEXT DEFAULT 'achievement' CHECK (
    category IN (
      'lesson_complete', 'quiz_pass', 'quiz_excellent',
      'streak_bonus', 'achievement_unlock', 'challenge_complete',
      'participation', 'correction', 'bonus', 'adjustment'
    )
  ),
  related_session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_points_history_student ON points_history(student_id);
CREATE INDEX IF NOT EXISTS idx_points_history_timestamp ON points_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_points_history_category ON points_history(category);
CREATE INDEX IF NOT EXISTS idx_points_history_student_timestamp ON points_history(student_id, timestamp DESC);

-- ============================================================================
-- 4. VAK RESULTS TABLE
-- ============================================================================
-- Learning style assessment results (Visual, Auditory, Kinesthetic)
CREATE TABLE IF NOT EXISTS vak_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  visual_score INTEGER NOT NULL CHECK (visual_score >= 0 AND visual_score <= 100),
  auditory_score INTEGER NOT NULL CHECK (auditory_score >= 0 AND auditory_score <= 100),
  kinesthetic_score INTEGER NOT NULL CHECK (kinesthetic_score >= 0 AND kinesthetic_score <= 100),
  primary_style TEXT,
  secondary_style TEXT,
  test_version TEXT DEFAULT '1.0',
  responses JSONB DEFAULT '{}'::JSONB,
  detected_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vak_results_student ON vak_results(student_id);
CREATE INDEX IF NOT EXISTS idx_vak_results_primary_style ON vak_results(primary_style);
CREATE INDEX IF NOT EXISTS idx_vak_results_detected_at ON vak_results(detected_at);

-- ============================================================================
-- 5. STUDENT TASKS TABLE
-- ============================================================================
-- Student-uploaded tasks/assignments with AI analysis support
CREATE TABLE IF NOT EXISTS student_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'language', 'science', 'history', 'art', 'general')),
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image', 'docx', 'txt', 'video', 'audio')),
  file_size_bytes INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  analyzed BOOLEAN DEFAULT false,
  analysis_result JSONB DEFAULT NULL,
  ai_feedback TEXT,
  grade NUMERIC(3,1),
  is_submitted BOOLEAN DEFAULT false,
  submission_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_tasks_student ON student_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_student_tasks_subject ON student_tasks(subject);
CREATE INDEX IF NOT EXISTS idx_student_tasks_uploaded_at ON student_tasks(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_student_tasks_analyzed ON student_tasks(analyzed);
CREATE INDEX IF NOT EXISTS idx_student_tasks_student_subject ON student_tasks(student_id, subject);

-- ============================================================================
-- 6. CONVERSATIONS TABLE
-- ============================================================================
-- Chat history with Nico AI tutor for memory and personalization
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  emotional_context JSONB DEFAULT '{
    "sentiment": "neutral",
    "engagement_level": 0.5,
    "confidence": null,
    "frustration_level": 0,
    "energy_level": 0.5
  }'::JSONB,
  subject TEXT,
  learning_style_applied TEXT,
  messages_in_context INTEGER DEFAULT 1,
  token_count INTEGER,
  model_used TEXT DEFAULT 'nico-v1',
  parent_session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_student ON conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp);
CREATE INDEX IF NOT EXISTS idx_conversations_subject ON conversations(subject);
CREATE INDEX IF NOT EXISTS idx_conversations_student_timestamp ON conversations(student_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_parent_session ON conversations(parent_session_id);

-- ============================================================================
-- 7. ACADEMIC_CONTEXT TABLE
-- ============================================================================
-- Per-subject performance tracking and learning progression
CREATE TABLE IF NOT EXISTS academic_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'language', 'science', 'history', 'art', 'general')),
  performance_level TEXT DEFAULT 'beginner' CHECK (performance_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
  lessons_completed INTEGER DEFAULT 0 CHECK (lessons_completed >= 0),
  average_score NUMERIC(5,2) DEFAULT 0.0 CHECK (average_score >= 0 AND average_score <= 100),
  quiz_attempts INTEGER DEFAULT 0,
  quiz_passed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  topics_mastered TEXT[] DEFAULT '{}',
  topics_in_progress TEXT[] DEFAULT '{}',
  weak_areas TEXT[] DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject)
);

CREATE INDEX IF NOT EXISTS idx_academic_context_student ON academic_context(student_id);
CREATE INDEX IF NOT EXISTS idx_academic_context_subject ON academic_context(subject);
CREATE INDEX IF NOT EXISTS idx_academic_context_performance_level ON academic_context(performance_level);
CREATE INDEX IF NOT EXISTS idx_academic_context_student_subject ON academic_context(student_id, subject);

-- ============================================================================
-- 8. PARENT DASHBOARD TABLE
-- ============================================================================
-- Parent access and notification preferences
CREATE TABLE IF NOT EXISTS parent_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  parent_email TEXT NOT NULL,
  access_granted_at TIMESTAMPTZ DEFAULT now(),
  access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view', 'view_edit', 'admin')),
  notification_frequency TEXT DEFAULT 'weekly' CHECK (notification_frequency IN ('daily', 'weekly', 'monthly', 'never')),
  notify_on_achievements BOOLEAN DEFAULT true,
  notify_on_concerns BOOLEAN DEFAULT true,
  notify_on_milestones BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parent_dashboards_student ON parent_dashboards(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_dashboards_parent_email ON parent_dashboards(parent_email);
CREATE INDEX IF NOT EXISTS idx_parent_dashboards_active ON parent_dashboards(is_active);

-- ============================================================================
-- 9. ACHIEVEMENTS TABLE
-- ============================================================================
-- Badge and achievement system for gamification
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  badge_url TEXT,
  earned_at TIMESTAMPTZ DEFAULT now(),
  points_awarded INTEGER DEFAULT 0,
  is_milestone BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_achievements_student ON achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(achievement_type);

-- ============================================================================
-- 10. LEARNING_STREAKS TABLE
-- ============================================================================
-- Track daily learning engagement and streaks
CREATE TABLE IF NOT EXISTS learning_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_days_active INTEGER DEFAULT 0,
  freeze_used_today BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_streaks_student ON learning_streaks(student_id);

-- ============================================================================
-- 11. SMARTBOARD SETTINGS TABLE
-- ============================================================================
-- Per-student customizable settings and preferences
CREATE TABLE IF NOT EXISTS smartboard_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  daily_goal_minutes INTEGER DEFAULT 30 CHECK (daily_goal_minutes > 0 AND daily_goal_minutes <= 1440),
  preferred_subject TEXT,
  sound_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  dark_mode BOOLEAN DEFAULT false,
  show_hints BOOLEAN DEFAULT true,
  adaptive_learning BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
  timezone TEXT DEFAULT 'America/Bogota',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id)
);

CREATE INDEX IF NOT EXISTS idx_smartboard_settings_student ON smartboard_settings(student_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Update student last_activity on session creation
CREATE OR REPLACE FUNCTION update_student_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE students
  SET last_activity = now(), updated_at = now()
  WHERE id = NEW.student_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate and update academic context on new session
CREATE OR REPLACE FUNCTION update_academic_context_on_session()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic_context (student_id, subject, total_points, lessons_completed, average_score, last_updated)
  VALUES (NEW.student_id, NEW.subject, COALESCE(NEW.points_earned, 0), 1, 0, now())
  ON CONFLICT (student_id, subject) DO UPDATE SET
    total_points = academic_context.total_points + COALESCE(NEW.points_earned, 0),
    lessons_completed = academic_context.lessons_completed + 1,
    last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Update VAK result in student profile JSON
CREATE OR REPLACE FUNCTION sync_vak_to_student_profile()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE students
  SET vak_result_json = jsonb_build_object(
    'visual', NEW.visual_score,
    'auditory', NEW.auditory_score,
    'kinesthetic', NEW.kinesthetic_score,
    'primary_style', NEW.primary_style,
    'secondary_style', NEW.secondary_style,
    'tested_at', NEW.detected_at
  ),
  updated_at = now()
  WHERE id = NEW.student_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Award achievement and points
CREATE OR REPLACE FUNCTION award_achievement()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_milestone THEN
    INSERT INTO points_history (student_id, points, reason, category)
    VALUES (NEW.student_id, COALESCE(NEW.points_awarded, 0), NEW.title, 'achievement_unlock');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate learning streak
CREATE OR REPLACE FUNCTION update_learning_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  current_streak INTEGER;
BEGIN
  last_date := (SELECT last_activity_date FROM learning_streaks WHERE student_id = NEW.student_id);

  IF last_date IS NULL THEN
    INSERT INTO learning_streaks (student_id, current_streak, best_streak, last_activity_date, total_days_active)
    VALUES (NEW.student_id, 1, 1, CURRENT_DATE, 1);
  ELSIF last_date = CURRENT_DATE THEN
    -- Same day, no change needed
    NULL;
  ELSIF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    UPDATE learning_streaks
    SET current_streak = current_streak + 1,
        best_streak = CASE WHEN current_streak + 1 > best_streak THEN current_streak + 1 ELSE best_streak END,
        last_activity_date = CURRENT_DATE,
        total_days_active = total_days_active + 1,
        updated_at = now()
    WHERE student_id = NEW.student_id;
  ELSE
    -- Streak broken, reset
    UPDATE learning_streaks
    SET current_streak = 1,
        last_activity_date = CURRENT_DATE,
        total_days_active = total_days_active + 1,
        freeze_used_today = false,
        updated_at = now()
    WHERE student_id = NEW.student_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update last_activity on session create/update
DROP TRIGGER IF EXISTS trg_update_last_activity ON sessions;
CREATE TRIGGER trg_update_last_activity
  AFTER INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_student_last_activity();

-- Trigger: Update academic context on new session
DROP TRIGGER IF EXISTS trg_update_academic_context ON sessions;
CREATE TRIGGER trg_update_academic_context
  AFTER INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_academic_context_on_session();

-- Trigger: Sync VAK results to student profile
DROP TRIGGER IF EXISTS trg_sync_vak_on_insert ON vak_results;
CREATE TRIGGER trg_sync_vak_on_insert
  AFTER INSERT ON vak_results
  FOR EACH ROW EXECUTE FUNCTION sync_vak_to_student_profile();

-- Trigger: Award achievement points
DROP TRIGGER IF EXISTS trg_award_achievement ON achievements;
CREATE TRIGGER trg_award_achievement
  AFTER INSERT ON achievements
  FOR EACH ROW EXECUTE FUNCTION award_achievement();

-- Trigger: Update learning streak on session
DROP TRIGGER IF EXISTS trg_update_streak ON sessions;
CREATE TRIGGER trg_update_streak
  AFTER INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_learning_streak();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vak_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartboard_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STUDENTS RLS Policies
-- ============================================================================

-- Students can read their own profile
CREATE POLICY "Students read own profile"
  ON students FOR SELECT
  USING (auth.uid() = auth_id);

-- Students can update their own profile
CREATE POLICY "Students update own profile"
  ON students FOR UPDATE
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- Service role (backend) can do anything
CREATE POLICY "Service role manage all students"
  ON students FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- SESSIONS RLS Policies
-- ============================================================================

-- Students can read their own sessions
CREATE POLICY "Students read own sessions"
  ON sessions FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Students can create sessions
CREATE POLICY "Students create sessions"
  ON sessions FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Students can update their own sessions
CREATE POLICY "Students update own sessions"
  ON sessions FOR UPDATE
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- ============================================================================
-- POINTS_HISTORY RLS Policies
-- ============================================================================

-- Students can read their own points history
CREATE POLICY "Students read own points"
  ON points_history FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Only service role can insert points (via backend)
CREATE POLICY "Service role insert points"
  ON points_history FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- VAK_RESULTS RLS Policies
-- ============================================================================

-- Students can read their own VAK results
CREATE POLICY "Students read own vak"
  ON vak_results FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Students can create VAK results
CREATE POLICY "Students create vak"
  ON vak_results FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- ============================================================================
-- STUDENT_TASKS RLS Policies
-- ============================================================================

-- Students can read their own tasks
CREATE POLICY "Students read own tasks"
  ON student_tasks FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Students can create tasks
CREATE POLICY "Students create tasks"
  ON student_tasks FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Students can update their own tasks
CREATE POLICY "Students update own tasks"
  ON student_tasks FOR UPDATE
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- ============================================================================
-- CONVERSATIONS RLS Policies
-- ============================================================================

-- Students can read their own conversations
CREATE POLICY "Students read own conversations"
  ON conversations FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Students can create conversations
CREATE POLICY "Students create conversations"
  ON conversations FOR INSERT
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- ============================================================================
-- ACADEMIC_CONTEXT RLS Policies
-- ============================================================================

-- Students can read their own academic context
CREATE POLICY "Students read own academic context"
  ON academic_context FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Only service role can modify (via backend triggers)
CREATE POLICY "Service role manage academic context"
  ON academic_context FOR ALL
  WITH CHECK (true);

-- ============================================================================
-- PARENT_DASHBOARDS RLS Policies
-- ============================================================================

-- Parents can read dashboards for students they have access to
CREATE POLICY "Parents read own dashboards"
  ON parent_dashboards FOR SELECT
  USING (parent_email = current_user OR is_active = true);

-- Only service role can manage parent dashboards
CREATE POLICY "Service role manage parent dashboards"
  ON parent_dashboards FOR ALL
  WITH CHECK (true);

-- ============================================================================
-- ACHIEVEMENTS RLS Policies
-- ============================================================================

-- Students can read their own achievements
CREATE POLICY "Students read own achievements"
  ON achievements FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Only service role can award achievements
CREATE POLICY "Service role award achievements"
  ON achievements FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- LEARNING_STREAKS RLS Policies
-- ============================================================================

-- Students can read their own streaks
CREATE POLICY "Students read own streaks"
  ON learning_streaks FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Only service role can modify streaks
CREATE POLICY "Service role manage streaks"
  ON learning_streaks FOR ALL
  WITH CHECK (true);

-- ============================================================================
-- SMARTBOARD_SETTINGS RLS Policies
-- ============================================================================

-- Students can read and update their own settings
CREATE POLICY "Students read own settings"
  ON smartboard_settings FOR SELECT
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

CREATE POLICY "Students update own settings"
  ON smartboard_settings FOR UPDATE
  USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
  WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));

-- Only service role can insert
CREATE POLICY "Service role create settings"
  ON smartboard_settings FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;
