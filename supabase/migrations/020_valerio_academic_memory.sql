-- Valerio Academic Memory Table
-- Stores detailed learning analytics for personalized coaching

CREATE TABLE IF NOT EXISTS valerio_academic_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  module_id INT NOT NULL,
  session_date TIMESTAMPTZ DEFAULT now(),

  -- Academic Content
  topics_covered TEXT[] DEFAULT ARRAY[]::TEXT[],
  questions_asked TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Diagnostic Data
  weak_areas TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Progress Metrics
  progress_percentage FLOAT DEFAULT 0,

  -- Recommendations
  recommended_next_steps TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Emotional/Engagement State
  student_sentiment TEXT DEFAULT 'neutral', -- 'frustrated' | 'confused' | 'confident' | 'engaged' | 'neutral'

  -- Context References
  lesson_id INT,
  challenge_id INT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Indexes for common queries
  CONSTRAINT valid_sentiment CHECK (student_sentiment IN ('frustrated', 'confused', 'confident', 'engaged', 'neutral'))
);

-- Enable Row Level Security
ALTER TABLE valerio_academic_memory ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_valerio_academic_user_date
  ON valerio_academic_memory(user_id, session_date DESC);

CREATE INDEX IF NOT EXISTS idx_valerio_academic_user_module
  ON valerio_academic_memory(user_id, module_id);

CREATE INDEX IF NOT EXISTS idx_valerio_academic_module_date
  ON valerio_academic_memory(module_id, session_date DESC);

-- RLS Policy: Users can only see their own academic memory
CREATE POLICY "Users see own academic memory"
  ON valerio_academic_memory
  FOR ALL
  USING (
    auth.uid()::text = user_id
    OR auth.role() = 'authenticated' AND user_id = auth.uid()::text
  )
  WITH CHECK (
    auth.uid()::text = user_id
    OR auth.role() = 'authenticated' AND user_id = auth.uid()::text
  );

-- RLS Policy: Service role can insert/update for any user
CREATE POLICY "Service role full access"
  ON valerio_academic_memory
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE valerio_academic_memory IS 'Academic memory system for Valerio coaching bot. Tracks learning patterns, weak areas, sentiment, and progress for personalized recommendations.';
COMMENT ON COLUMN valerio_academic_memory.student_sentiment IS 'Emotional state: frustrated (needs motivation), confused (needs clarity), confident (going well), engaged (very motivated), neutral (normal)';
