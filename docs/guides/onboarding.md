# Onboarding Guide

## Prerrequisitos

- Node.js >= 18
- npm >= 9
- Una cuenta de [Clerk](https://clerk.com)
- Una cuenta de [Supabase](https://supabase.com)
- Una API key de [DeepSeek](https://platform.deepseek.com)

## Setup

### 1. Clonar

```bash
git clone <repo-url>
cd edutechlife
```

### 2. Backend

```bash
cd edutechlife-backend
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm run dev     # http://localhost:3001
npm test        # 173 tests
```

### 3. Frontend

```bash
cd edutechlife-frontend
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm run dev     # http://localhost:5173
npm run build   # Producción
```

## Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| CLERK_SECRET_KEY | Sí | Secret key de Clerk |
| CLERK_PUBLISHABLE_KEY | Sí | Publishable key de Clerk |
| SUPABASE_URL | Sí | URL del proyecto Supabase |
| SUPABASE_ANON_KEY | Sí | Anon key de Supabase |
| DEEPSEEK_API_KEY | Sí | API key de DeepSeek |
| STRIPE_SECRET_KEY | No | Secret key de Stripe |
| REPLICATE_API_TOKEN | No | Token de Replicate AI |
| LOG_LEVEL | No | debug | info | warn | error |

## Tests

```bash
cd edutechlife-backend
npm test                 # Todos (173 tests)
npm run test:coverage    # Con cobertura (70% threshold)
npm run test:watch       # Modo watch
```

## Comandos Útiles

```bash
# Backend
npm run lint              # ESLint + security plugin
npm run lint:fix          # Auto-fix

# Frontend
npx vite build            # Build producción
npx vite preview          # Preview de build
```

## Deploy

Ver `docs/deployment/DEPLOYMENT.md` para CI/CD y deploy.
