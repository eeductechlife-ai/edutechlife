-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'IF') THEN
    -- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'parent_dani_conversations') THEN
    -- ============================================================================
    -- Migration 038 — Parent-Dani AI Chat System
--
    -- Enables parents to chat with Dani (the AI tutor) about their child's progress.
--
    -- Features:
    --   - parent_dani_conversations: Chat history with context
    --   - conversation_messages: Individual messages (parent/dani)
    --   - conversation_summaries: AI-generated insights from chats
    --   - RLS: Parents see only their linked students' conversations
    --   - Context-aware responses (student progress, achievements, risks)
    --   - Message pagination & archival for long-term storage
    -- ============================================================================

BEGIN;

    -- Parent-Dani conversations (Per-student chat sessions)
CREATE TABLE IF NOT EXISTS parent_dani_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id TEXT NOT NULL,
  student_user_id TEXT NOT NULL,
  title TEXT,
  topic VARCHAR(50), -- 'progress', 'concerns', 'achievements', 'learning_plan'
  status VARCHAR(20) DEFAULT 'active', -- active, archived, resolved
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,
  summary TEXT,
  ai_recommendations JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_conversation_parent FOREIGN KEY (parent_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_conversation_student FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_conversation_link FOREIGN KEY (parent_user_id, student_user_id)
    REFERENCES parent_student_links(parent_user_id, student_user_id) ON DELETE CASCADE
);

    -- Individual messages in conversations
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES parent_dani_conversations(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL, -- 'parent', 'dani'
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, recommendation, insight, action
  context_data JSONB DEFAULT '{}'::JSONB, -- { studentProgress, recentAchievements, ... }
  sentiment VARCHAR(20), -- positive, neutral, negative, concern
  keywords TEXT[], -- Extracted topics for organization
  is_processed BOOLEAN DEFAULT false,
  processing_metadata JSONB DEFAULT '{}'::JSONB, -- { tokenCount, responseTime, ... }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

    -- Conversation summaries (Extracted insights)
CREATE TABLE IF NOT EXISTS conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL UNIQUE REFERENCES parent_dani_conversations(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  key_topics TEXT[],
  parent_concerns TEXT[],
  ai_recommendations TEXT[],
  action_items JSONB DEFAULT '[]'::JSONB, -- { description, dueDate, priority, ... }
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

    -- Dani response templates (For consistency & fast responses)
CREATE TABLE IF NOT EXISTS dani_response_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key VARCHAR(100) UNIQUE NOT NULL,
  template_text TEXT NOT NULL,
  category VARCHAR(50), -- 'achievement', 'concern', 'guidance', 'progress'
  placeholders TEXT[], -- { studentName, metric, value, ... }
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

    -- Message attachments (For sharing resources, reports, etc.)
CREATE TABLE IF NOT EXISTS conversation_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES conversation_messages(id) ON DELETE CASCADE,
  attachment_type VARCHAR(50), -- 'report', 'resource', 'achievement', 'image'
  attachment_url TEXT NOT NULL,
  attachment_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

    -- Create indexes for query performance
CREATE INDEX idx_conversations_parent ON parent_dani_conversations(parent_user_id);
CREATE INDEX idx_conversations_student ON parent_dani_conversations(student_user_id);
CREATE INDEX idx_conversations_status ON parent_dani_conversations(status);
CREATE INDEX idx_conversations_created ON parent_dani_conversations(created_at DESC);
CREATE INDEX idx_conversations_last_message ON parent_dani_conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON conversation_messages(conversation_id);
CREATE INDEX idx_messages_sender ON conversation_messages(sender);
CREATE INDEX idx_messages_created ON conversation_messages(created_at DESC);
CREATE INDEX idx_messages_keywords ON conversation_messages USING GIN(keywords);
CREATE INDEX idx_summaries_conversation ON conversation_summaries(conversation_id);
CREATE INDEX idx_templates_key ON dani_response_templates(template_key);
CREATE INDEX idx_attachments_message ON conversation_attachments(message_id);

    -- Enable RLS
ALTER TABLE parent_dani_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dani_response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_attachments ENABLE ROW LEVEL SECURITY;

    -- RLS Policies: Parents see only their conversations
CREATE POLICY "conversations_parent_only" ON parent_dani_conversations
  FOR SELECT USING (parent_user_id = auth.uid()::TEXT);

CREATE POLICY "conversations_parent_insert" ON parent_dani_conversations
  FOR INSERT WITH CHECK (parent_user_id = auth.uid()::TEXT);

CREATE POLICY "conversations_parent_update" ON parent_dani_conversations
  FOR UPDATE USING (parent_user_id = auth.uid()::TEXT);

CREATE POLICY "messages_parent_conversation_only" ON conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_dani_conversations pdc
      WHERE pdc.id = conversation_id AND pdc.parent_user_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "messages_parent_insert" ON conversation_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM parent_dani_conversations pdc
      WHERE pdc.id = conversation_id AND pdc.parent_user_id = auth.uid()::TEXT
    ) AND sender = 'parent'
  );

CREATE POLICY "summaries_parent_only" ON conversation_summaries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_dani_conversations pdc
      WHERE pdc.id = conversation_id AND pdc.parent_user_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "templates_readable" ON dani_response_templates FOR SELECT USING (true);

CREATE POLICY "attachments_message_owner" ON conversation_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_messages cm
      JOIN parent_dani_conversations pdc ON pdc.id = cm.conversation_id
      WHERE cm.id = message_id AND pdc.parent_user_id = auth.uid()::TEXT
    )
  );

    -- Seed response templates (Quick-start for Dani responses)
INSERT INTO dani_response_templates (template_key, template_text, category, placeholders)
VALUES
  ('achievement_unlock', 'Qué emocionante, {studentName}! Acaba de desbloquear el logro "{achievement}". Continúa así! 🎉', 'achievement', ARRAY['studentName', 'achievement']),
  ('streak_milestone', '{studentName} mantiene una racha de {days} días! Esto demuestra dedicación constante. Excelente trabajo!', 'achievement', ARRAY['studentName', 'days']),
  ('performance_decline', 'Noté que {studentName} ha tenido menor actividad estas últimas dos semanas. Me gustaría ayudarle a retomar el ritmo.', 'concern', ARRAY['studentName']),
  ('encouragement', 'Recuerda que el aprendizaje es un viaje, no una carrera. {studentName} está progresando bien!', 'guidance', ARRAY['studentName']),
  ('learning_style', 'Según la prueba VAK, {studentName} aprende mejor de manera {style}. Podríamos buscar recursos que se adapten a su estilo.', 'guidance', ARRAY['studentName', 'style'])
ON CONFLICT (template_key) DO NOTHING;

    -- Function to auto-archive old conversations (30+ days inactive)
CREATE OR REPLACE FUNCTION archive_old_conversations()
RETURNS TABLE(archived_count INTEGER) AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  UPDATE parent_dani_conversations
  SET status = 'archived', updated_at = NOW()
  WHERE status = 'active' AND last_message_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN QUERY SELECT v_count;
END;
$$ LANGUAGE plpgsql;

    -- Function to generate conversation summaries
CREATE OR REPLACE FUNCTION generate_conversation_summary(conv_id UUID)
RETURNS UUID AS $$
DECLARE
  v_summary_id UUID;
  v_messages TEXT;
  v_topics TEXT[];
BEGIN
  -- Aggregate messages for summary
  SELECT ARRAY_AGG(message ORDER BY created_at),
         ARRAY_AGG(DISTINCT unnest(keywords)) FILTER (WHERE keywords IS NOT NULL)
  INTO v_messages, v_topics
  FROM conversation_messages
  WHERE conversation_id = conv_id;

  -- Insert or update summary
  INSERT INTO conversation_summaries (conversation_id, summary_text, key_topics)
  VALUES (conv_id, ARRAY_TO_STRING(v_messages, ' '), COALESCE(v_topics, ARRAY[]::TEXT[]))
  ON CONFLICT (conversation_id) DO UPDATE
  SET summary_text = EXCLUDED.summary_text, key_topics = EXCLUDED.key_topics, generated_at = NOW()
  RETURNING id INTO v_summary_id;

  RETURN v_summary_id;
END;
$$ LANGUAGE plpgsql;

COMMIT;
  END IF;
END
$$;
  END IF;
END
$$;
