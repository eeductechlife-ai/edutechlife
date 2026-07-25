#!/bin/bash
# Deploy Clerk Webhook a Supabase
# Uso: SUPABASE_ACCESS_TOKEN="sbp_xxx" bash scripts/deploy-clerk-webhook.sh

set -e
PROJECT_REF="srirrwpgswlnuqfgtule"

echo "=== Deploy clerk-webhook ==="
echo "Project: $PROJECT_REF"

npx supabase functions deploy clerk-webhook \
  --project-ref "$PROJECT_REF"

echo ""
echo "✅ Deployed!"
echo ""
echo "Next steps:"
echo "1. Set secrets in https://supabase.com/dashboard/project/$PROJECT_REF/settings/secrets"
echo "   - CLERK_WEBHOOK_SECRET"
echo "   - CLERK_SECRET_KEY"
echo ""
echo "2. Configure Clerk Dashboard → Webhooks → Add Endpoint:"
echo "   URL: https://$PROJECT_REF.supabase.co/functions/v1/clerk-webhook"
echo "   Events: user.created, user.updated, user.verified"
