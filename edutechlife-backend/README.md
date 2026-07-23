# EdutechLife Backend

Express.js API server for the EdutechLife platform.

## Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Auth:** Clerk JWT verification
- **Database:** Supabase (PostgreSQL)
- **AI:** DeepSeek API
- **Payments:** Stripe
- **Deploy:** Render / Vercel

## Quick Start

```bash
cp .env.example .env
# Fill in env vars: Clerk, Supabase, DeepSeek, Stripe
npm install
npm run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm test` | Run vitest |
| `npm run test:coverage` | With coverage |
| `npm run lint` | ESLint |

## Project Structure

```
src/
├── app.js           # Express app (middleware, routes, CORS, helmet)
├── index.js         # Entry point
├── routes/          # health, chat, ialab, smartboard, voice, tts, stripe
├── middleware/      # auth, rateLimiter, sanitize, errorHandler, stripeWebhook
├── services/        # stripe, deepseek, avatarService
├── controllers/     # Route handlers
├── db/              # Database utilities
├── data/            # Static data (plans, modules)
└── docs/            # Swagger config
```

## API Endpoints

| Route | Auth | Description |
|-------|------|-------------|
| `GET /api/health` | No | Health check |
| `POST /api/chat` | No | DeepSeek AI chat |
| `GET /api/ialab/*` | Yes | IALab content & progress |
| `GET /api/smartboard/*` | Yes | SmartBoard data & progress |
| `POST /api/stripe/*` | Varies | Stripe checkout & webhook |
| `POST /api/voice` | No | Voice processing |
| `POST /api/tts` | No | Text-to-speech |
