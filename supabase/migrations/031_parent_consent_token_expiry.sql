-- Add token_created_at field to parent_consents for 24-hour token expiration tracking
-- Idempotent: if parent_consents table doesn't exist (not yet in prod), this is a no-op
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'parent_consents') THEN
    -- Add column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'parent_consents' AND column_name = 'token_created_at') THEN
      ALTER TABLE parent_consents ADD COLUMN token_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_parent_consents_token_created ON parent_consents(token_created_at);
    CREATE INDEX IF NOT EXISTS idx_parent_consents_pending_tokens ON parent_consents(verification_status, token_created_at) WHERE verification_status = 'pending';

    -- Update existing records
    UPDATE parent_consents SET token_created_at = consent_timestamp WHERE verification_status = 'pending' AND token_created_at IS NULL;

    -- Add comment
    COMMENT ON COLUMN parent_consents.token_created_at IS 'Timestamp when verification token was created (24-hour expiration).';
  END IF;
END
$$;
