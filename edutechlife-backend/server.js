require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: function(origin, callback) {
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware CORS para todas las rutas
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
app.use(helmet());
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Validate environment variables
if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your_api_key_here') {
    console.warn('⚠️  WARNING: DEEPSEEK_API_KEY is not properly configured.');
    console.warn('   Please set a valid API key in the .env file.');
    console.warn('   Get your key from: https://platform.deepseek.com/');
}

async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            if (i === retries - 1) throw e;
            const delays = [1000, 2000, 4000];
            await new Promise(r => setTimeout(r, delays[i]));
        }
    }
}

app.post('/api/chat', async (req, res) => {
    const { prompt, systemPrompt, isJson } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }
    if (prompt.length > 5000) {
        return res.status(400).json({ error: 'Prompt too long (max 5000 characters)' });
    }
    if (systemPrompt && (typeof systemPrompt !== 'string' || systemPrompt.length > 2000)) {
        return res.status(400).json({ error: 'System prompt must be a string with max 2000 characters' });
    }

    if (!DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: 'API key not configured on server' });
    }

    const payload = { 
        model: 'deepseek-chat', 
        messages: [
            { role: 'system', content: systemPrompt }, 
            { role: 'user', content: prompt }
        ], 
        temperature: 0.75, 
        max_tokens: 1200 
    };
    
    if (isJson) payload.response_format = { type: 'json_object' };

    try {
        const data = await fetchWithRetry(DEEPSEEK_API_URL, { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}` 
            }, 
            body: JSON.stringify(payload) 
        });

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const text = data.choices?.[0]?.message?.content;
        if (!text) {
            return res.status(500).json({ error: 'No response from API' });
        }

        res.json({ result: text });
    } catch (e) {
        console.error('Error calling DeepSeek API:', e);
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/chat/stream', async (req, res) => {
    const { prompt, systemPrompt, isJson } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }
    if (prompt.length > 5000) {
        return res.status(400).json({ error: 'Prompt too long (max 5000 characters)' });
    }
    if (systemPrompt && (typeof systemPrompt !== 'string' || systemPrompt.length > 2000)) {
        return res.status(400).json({ error: 'System prompt must be a string with max 2000 characters' });
    }

    if (!DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: 'API key not configured on server' });
    }

    const payload = { 
        model: 'deepseek-chat', 
        messages: [
            { role: 'system', content: systemPrompt }, 
            { role: 'user', content: prompt }
        ], 
        temperature: 0.75, 
        max_tokens: 1200,
        stream: true
    };
    
    if (isJson) payload.response_format = { type: 'json_object' };

    try {
        const response = await fetch(DEEPSEEK_API_URL, { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}` 
            }, 
            body: JSON.stringify(payload) 
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const decoder = new TextDecoder();
        let buffer = '';

        try {
            for await (const chunk of response.body) {
                buffer += decoder.decode(chunk, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            res.write('data: [DONE]\n\n');
                            res.end();
                            return;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
                            }
                        } catch (e) {
                            // Skip parsing errors for incomplete chunks
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Stream processing error:', e);
        }
        
        res.end();
    } catch (e) {
        console.error('Error in streaming:', e);
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', apiKeyConfigured: !!DEEPSEEK_API_KEY });
});

// Ruta para obtener token de Google Cloud (para Gemini TTS)
app.get('/api/voice-token', async (req, res) => {
    // 1. Configuración de encabezados para saltar el CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Responder a la petición preflight de los navegadores
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        const { GoogleAuth } = require('google-auth-library');
        
        // 2. Limpieza de la llave privada (VITAL para evitar el 401)
        const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
        
        if (!process.env.GOOGLE_CLIENT_EMAIL || !privateKey) {
            return res.status(500).json({ error: 'Google credentials not configured' });
        }
        
        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: privateKey,
            }
        });
        
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        
        res.json({ access_token: token });
    } catch (error) {
        console.error('Error generating Google token:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Key configured: ${!!DEEPSEEK_API_KEY}`);
});
