-- Make clerk_id nullable for native Supabase Auth
-- The system now uses Supabase Auth IDs instead of Clerk IDs

ALTER TABLE users
ALTER COLUMN clerk_id DROP NOT NULL;

-- Add comment explaining the change
COMMENT ON COLUMN users.clerk_id IS 'Legacy Clerk ID, nullable for native Supabase Auth users';
