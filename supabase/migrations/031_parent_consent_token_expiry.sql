-- Add token_created_at field to parent_consents for 24-hour token expiration tracking
-- This enables the parental consent verification system to validate tokens and expire old ones

ALTER TABLE parent_consents ADD COLUMN token_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for token expiration queries (find expired tokens)
CREATE INDEX idx_parent_consents_token_created ON parent_consents(token_created_at);

-- Create index for finding pending tokens that need expiration check
CREATE INDEX idx_parent_consents_pending_tokens ON parent_consents(verification_status, token_created_at)
  WHERE verification_status = 'pending';

-- Update existing pending tokens to have token_created_at = consent_timestamp (assumes they were just created)
UPDATE parent_consents
SET token_created_at = consent_timestamp
WHERE verification_status = 'pending' AND token_created_at IS NULL;

-- Add comment explaining the field
COMMENT ON COLUMN parent_consents.token_created_at IS 'Timestamp when the verification token was created. Used to enforce 24-hour token expiration for security.';
