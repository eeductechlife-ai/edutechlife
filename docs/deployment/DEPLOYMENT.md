# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- DeepSeek API key from https://platform.deepseek.com/

## Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Root Directory:** `edutechlife-backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variable:
   - **Key:** `DEEPSEEK_API_KEY`
   - **Value:** Your DeepSeek API key
5. Deploy

Your backend URL will be: `https://edutechlife-backend.onrender.com`

## Frontend Deployment (Vercel)

1. Update `vercel.json` with your backend URL:
   ```json
   "destination": "https://your-backend-url.onrender.com/api/:path*"
   ```

2. Create a new project on Vercel
3. Connect your GitHub repository
4. Set the following:
   - **Root Directory:** `edutechlife-frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable (optional, for local development override):
   - **Key:** `VITE_API_URL`
   - **Value:** Your backend URL (e.g., `https://your-backend.onrender.com`)
6. Deploy

## Local Development

### Backend
```bash
cd edutechlife-backend
cp .env.example .env
# Edit .env and add your DEEPSEEK_API_KEY
npm install
npm start
```

### Frontend
```bash
cd edutechlife-frontend
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:3001
npm install
npm run dev
```

## Testing the Deployment

1. Open your Vercel frontend URL
2. Navigate to the AI Lab section
3. Test the chat functionality
4. Complete a VAK test and generate a certificate
