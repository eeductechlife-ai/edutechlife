-- Add token_created_at field to parent_consents for 24-hour token expiration tracking
-- This enables the parental consent verification system to validate tokens and expire old ones
-- Idempotent: only applies if parent_consents table exists

DO $$
BEGIN
  -- Only add column if table exists and column doesn't exist
  IF EXISTS (
    SELECT FROM information_schema.tables WHERE table_name = 'parent_consents'
  ) THEN
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'parent_consents' AND column_name = 'token_created_at'
    ) THEN
      ALTER TABLE parent_consents ADD COLUMN token_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
  END IF;
END
$$;

-- Create index for token expiration queries (find expired tokens) — only if table exists
CREATE INDEX IF NOT EXISTS idx_parent_consents_token_created ON parent_consents(token_created_at);

-- Create index for finding pending tokens that need expiration check — only if table exists
CREATE INDEX IF NOT EXISTS idx_parent_consents_pending_tokens ON parent_consents(verification_status, token_created_at)
  WHERE verification_status = 'pending';

-- Update existing pending tokens to have token_created_at = consent_timestamp (assumes they were just created)
-- Only if table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables WHERE table_name = 'parent_consents'
  ) THEN
    UPDATE parent_consents
    SET token_created_at = consent_timestamp
    WHERE verification_status = 'pending' AND token_created_at IS NULL;
  END IF;
END
$$;

-- Add comment explaining the field — only if table and column exist
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'parent_consents' AND column_name = 'token_created_at'
  ) THEN
    COMMENT ON COLUMN parent_consents.token_created_at IS 'Timestamp when the verification token was created. Used to enforce 24-hour token expiration for security.';
  END IF;
END
$$;
