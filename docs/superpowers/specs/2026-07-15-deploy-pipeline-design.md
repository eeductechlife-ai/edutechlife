# Deploy Pipeline — Design Doc

## Stack
- **Frontend**: Vite+React → Vercel (static hosting)
- **Backend**: Node/Express → Render (existing, via Deploy Hook)
- **DB**: Supabase (existing, migrations via CLI)

## Architecture

```
git push main
    │
    ▼
┌─────────────────┐
│  migrate-db     │  supabase link + db push (sequential)
└──────┬──────────┘
       │ success
       ├──────────────────┐
       ▼                  ▼
┌─────────────────┐ ┌─────────────────┐
│ deploy-frontend │ │ deploy-backend  │  <-- parallel
│ (Vercel CLI)    │ │ (Render Hook)   │
└────────┬────────┘ └────────┬────────┘
         │                   │
         └──────┬────────────┘
                ▼
        ┌─────────────────┐
        │ smoke-test      │  curl health endpoints
        └─────────────────┘
```

## Jobs

### 1. migrate-db
- Checkout + setup Supabase CLI
- `supabase link --project-ref $PROJECT_ID`
- `supabase db push`
- Secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID`

### 2. deploy-frontend
- Checkout + setup Node 20
- `npm ci` + `npm run build` in `edutechlife-frontend`
- `npx vercel deploy --prod --token=$VERCEL_TOKEN`
- Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_FRONTEND`

### 3. deploy-backend
- `curl -X POST $RENDER_DEPLOY_HOOK`
- Render automáticamente clona, buildpea y despliega desde GitHub
- Secrets: `RENDER_DEPLOY_HOOK`

### 4. smoke-test
- `curl -f` a frontend URL y backend `/health`
- Verifica que todo responda 200

## Secrets requeridos en GitHub
| Secret | Propósito |
|--------|-----------|
| `VERCEL_TOKEN` | API token de Vercel |
| `VERCEL_ORG_ID` | ID del team/org en Vercel |
| `VERCEL_PROJECT_ID_FRONTEND` | Project ID del frontend en Vercel |
| `RENDER_DEPLOY_HOOK` | Deploy hook URL de Render |
| `SUPABASE_ACCESS_TOKEN` | PAT de Supabase |
| `SUPABASE_DB_PASSWORD` | Password de la DB |
| `SUPABASE_PROJECT_ID` | Project ref de Supabase |
