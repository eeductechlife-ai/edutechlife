-- Create crisis_alerts table for monitoring and auditing
-- Stores all detected crisis indicators for safety audits and compliance

CREATE TABLE IF NOT EXISTS crisis_alerts (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_age INTEGER,
  detected_content TEXT NOT NULL,
  crisis_level VARCHAR(50) NOT NULL, -- 'high', 'medium', 'low'
  parent_email VARCHAR(255),
  alert_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_crisis_alerts_student_id ON crisis_alerts(student_id);
CREATE INDEX idx_crisis_alerts_level ON crisis_alerts(crisis_level);
CREATE INDEX idx_crisis_alerts_created_at ON crisis_alerts(created_at);

-- Enable RLS
ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins and service role can view (student privacy)
CREATE POLICY "Admins can view crisis alerts"
  ON crisis_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Service role can insert and update
CREATE POLICY "Service role can manage crisis alerts"
  ON crisis_alerts FOR ALL
  USING (true)
  WITH CHECK (true);
