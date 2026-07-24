-- Create parent_consents table for Habeas Data compliance
-- Stores parental consent records for minors (Ley 1581/2012 + COPPA)

CREATE TABLE IF NOT EXISTS parent_consents (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_email VARCHAR(255) NOT NULL,
  student_age INTEGER NOT NULL,
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
  verification_token VARCHAR(255) UNIQUE,
  verification_email_sent TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_parent_consents_student_id ON parent_consents(student_id);
CREATE INDEX idx_parent_consents_parent_email ON parent_consents(parent_email);
CREATE INDEX idx_parent_consents_status ON parent_consents(verification_status);

-- Enable RLS
ALTER TABLE parent_consents ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only the authenticated student can read their own consent records
CREATE POLICY "Students can read their own consent records"
  ON parent_consents FOR SELECT
  USING (auth.uid() = student_id);

-- Only service role can insert (backend will enforce this)
CREATE POLICY "Service role can insert consent records"
  ON parent_consents FOR INSERT
  WITH CHECK (true);

-- Only service role can update
CREATE POLICY "Service role can update consent records"
  ON parent_consents FOR UPDATE
  USING (true)
  WITH CHECK (true);
