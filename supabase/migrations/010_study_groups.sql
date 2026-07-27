-- Study Groups: Collaborative learning groups for IALab
-- Students can create, join, and participate in study groups per module

-- 1. Study Groups
CREATE TABLE IF NOT EXISTS study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  module_id INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  max_members INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_groups_module ON study_groups(module_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_active ON study_groups(is_active);

-- 2. Study Group Members
CREATE TABLE IF NOT EXISTS study_group_members (
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'creator')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_study_group_members_user ON study_group_members(user_id);

-- 3. Study Group Sessions (study sessions with goals and duration)
CREATE TABLE IF NOT EXISTS study_group_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  started_by TEXT NOT NULL,
  goal TEXT DEFAULT '',
  duration_minutes INTEGER DEFAULT 25,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_study_group_sessions_group ON study_group_sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_sessions_active ON study_group_sessions(is_active);

-- 4. RLS Policies
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_sessions ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read
CREATE POLICY "study_groups_read_all" ON study_groups FOR SELECT USING (true);
CREATE POLICY "study_group_members_read_all" ON study_group_members FOR SELECT USING (true);
CREATE POLICY "study_group_sessions_read_all" ON study_group_sessions FOR SELECT USING (true);

-- Users can create groups
CREATE POLICY "study_groups_insert" ON study_groups FOR INSERT WITH CHECK (true);

-- Creators can update their groups
CREATE POLICY "study_groups_update_own" ON study_groups FOR UPDATE USING (created_by = current_user);

-- Users can join/leave (insert/delete membership)
CREATE POLICY "study_group_members_insert" ON study_group_members FOR INSERT WITH CHECK (true);
CREATE POLICY "study_group_members_delete_own" ON study_group_members FOR DELETE USING (user_id = current_user);

-- Sessions: any member can start
CREATE POLICY "study_group_sessions_insert" ON study_group_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "study_group_sessions_update_own" ON study_group_sessions FOR UPDATE USING (started_by = current_user);

-- 5. Function to auto-update last_active on members
CREATE OR REPLACE FUNCTION update_study_group_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE study_group_members
  SET last_active = now()
  WHERE user_id = NEW.started_by AND group_id = NEW.group_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_study_group_activity ON study_group_sessions;
CREATE TRIGGER trg_update_study_group_activity
  AFTER INSERT ON study_group_sessions
  FOR EACH ROW EXECUTE FUNCTION update_study_group_activity();
