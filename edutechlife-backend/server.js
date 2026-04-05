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

    const startTime = Date.now();

    const payload = { 
        model: 'deepseek-chat', 
        messages: [
            { role: 'system', content: systemPrompt }, 
            { role: 'user', content: prompt }
        ], 
        temperature: 0.5, 
        max_tokens: 500,
        stream: false
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

        const elapsed = Date.now() - startTime;
        console.log(`[DeepSeek] Response time: ${elapsed}ms | Tokens: ~${text.split(' ').length}`);

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

// ==================== IALAB ENDPOINTS ====================

// Endpoint para generación de prompts específicos de IALab
app.post('/api/ialab/prompts', async (req, res) => {
    const { prompt, templateType = 'general' } = req.body;
    
    // Input validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }
    if (prompt.length > 2000) {
        return res.status(400).json({ error: 'Prompt too long (max 2000 characters for IALab)' });
    }
    
    if (!DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: 'API key not configured on server' });
    }

    // Prompt especializado para IALab
    const ialabSystemPrompt = `Eres el Arquitecto de Prompts élite de Edutechlife IALab.
Especializado en ingeniería de prompts avanzada con más de 10 años de experiencia.

TEMPLATE TYPE: ${templateType}

Genera un MasterPrompt profesional que cumpla con estos criterios:
1. CLARIDAD: Sea específico y sin ambigüedades
2. CONTEXTO: Incluya contexto relevante para la tarea
3. FORMATO: Defina el formato de respuesta esperado (JSON, markdown, texto plano, etc.)
4. RESTRICCIONES: Establezca límites claros si son necesarios
5. OPTIMIZACIÓN: Sea optimizado para modelos de lenguaje modernos
6. EJEMPLOS: Incluya ejemplos si el template type lo requiere

Template types disponibles:
- marketing: Para copywriting, anuncios, campañas
- code: Para generación de código, debugging, documentación
- analysis: Para análisis de datos, reportes, insights
- creative: Para contenido creativo, historias, ideas
- education: Para material educativo, explicaciones, tutoriales
- general: Para casos generales de ingeniería de prompts

IMPORTANTE: Devuelve SOLO un objeto JSON válido con esta estructura exacta:
{
  "masterPrompt": "string (el prompt generado, 100-500 caracteres)",
  "feedback": "string (feedback constructivo sobre el prompt original, 50-200 caracteres)",
  "difficulty": "string (beginner, intermediate, o advanced)",
  "estimatedTokens": number (estimación de tokens del prompt generado),
  "optimizationTips": "string[] (array con 2-3 tips de optimización)"
}`;

    const startTime = Date.now();
    
    const payload = { 
        model: 'deepseek-chat', 
        messages: [
            { role: 'system', content: ialabSystemPrompt }, 
            { role: 'user', content: `Genera un MasterPrompt para: "${prompt}"` }
        ], 
        temperature: process.env.IALAB_TEMPERATURE || 0.7, 
        max_tokens: process.env.IALAB_MAX_TOKENS || 800,
        stream: false,
        response_format: { type: 'json_object' }
    };

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

        // Parsear el JSON devuelto por la API
        let parsedResult;
        try {
            parsedResult = JSON.parse(text);
            
            // Validar estructura básica
            if (!parsedResult.masterPrompt || !parsedResult.feedback) {
                throw new Error('Invalid response structure from AI');
            }
            
            // Añadir metadata
            parsedResult.templateType = templateType;
            parsedResult.originalPrompt = prompt;
            parsedResult.timestamp = new Date().toISOString();
            parsedResult.responseTime = Date.now() - startTime;
            
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            // Fallback response
            parsedResult = {
                masterPrompt: `Como experto en ${templateType}, genera un prompt claro y específico para: ${prompt}. Incluye contexto, formato esperado y ejemplos si es necesario.`,
                feedback: `Tu prompt original es un buen punto de partida. Sugiero hacerlo más específico añadiendo contexto y formato de respuesta.`,
                difficulty: 'intermediate',
                estimatedTokens: 150,
                optimizationTips: ['Añade más contexto específico', 'Define el formato de respuesta esperado', 'Incluye ejemplos si es relevante'],
                templateType,
                originalPrompt: prompt,
                timestamp: new Date().toISOString(),
                responseTime: Date.now() - startTime,
                note: 'Fallback response due to parsing error'
            };
        }

        const elapsed = Date.now() - startTime;
        console.log(`[IALab Prompts] Generated prompt for template: ${templateType} | Time: ${elapsed}ms`);

        res.json(parsedResult);
    } catch (e) {
        console.error('Error in IALab prompts endpoint:', e);
        res.status(500).json({ 
            error: e.message,
            fallback: {
                masterPrompt: `Genera un prompt profesional para: ${prompt}. Sé específico con el contexto y formato de respuesta.`,
                feedback: 'Error en la generación. Revisa tu prompt e intenta de nuevo.',
                difficulty: 'beginner',
                templateType
            }
        });
    }
});

// Endpoint para guardar y recuperar progreso del curso IALab
const progressStore = new Map(); // Simple in-memory store for development

app.post('/api/ialab/progress', async (req, res) => {
    const { userId, moduleId, completed, score, timestamp } = req.body;
    
    // Input validation
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'userId is required and must be a string' });
    }
    if (!moduleId || typeof moduleId !== 'number' || moduleId < 1 || moduleId > 5) {
        return res.status(400).json({ error: 'moduleId must be a number between 1 and 5' });
    }
    
    try {
        // Obtener progreso existente o crear nuevo
        let userProgress = progressStore.get(userId) || {
            userId,
            modules: {},
            overallProgress: 0,
            totalScore: 0,
            completedModules: 0,
            lastUpdated: new Date().toISOString(),
            achievements: []
        };
        
        // Actualizar módulo específico
        userProgress.modules[moduleId] = {
            moduleId,
            completed: completed || false,
            score: score || 0,
            timestamp: timestamp || new Date().toISOString()
        };
        
        // Recalcular métricas generales
        const moduleEntries = Object.values(userProgress.modules);
        userProgress.completedModules = moduleEntries.filter(m => m.completed).length;
        userProgress.overallProgress = Math.round((userProgress.completedModules / 5) * 100);
        userProgress.totalScore = moduleEntries.reduce((sum, m) => sum + (m.score || 0), 0);
        userProgress.lastUpdated = new Date().toISOString();
        
        // Añadir logros si corresponde
        if (completed && !userProgress.achievements.includes(`module_${moduleId}_complete`)) {
            userProgress.achievements.push(`module_${moduleId}_complete`);
        }
        if (score >= 4 && !userProgress.achievements.includes(`module_${moduleId}_excellent`)) {
            userProgress.achievements.push(`module_${moduleId}_excellent`);
        }
        if (userProgress.completedModules === 5 && !userProgress.achievements.includes('course_complete')) {
            userProgress.achievements.push('course_complete');
        }
        
        // Guardar en store
        progressStore.set(userId, userProgress);
        
        console.log(`[IALab Progress] Updated progress for user: ${userId}, module: ${moduleId}, completed: ${completed}, score: ${score}`);
        
        res.json({
            success: true,
            progress: userProgress,
            message: 'Progress saved successfully'
        });
        
    } catch (e) {
        console.error('Error saving IALab progress:', e);
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/ialab/progress/:userId', async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    
    try {
        const userProgress = progressStore.get(userId);
        
        if (!userProgress) {
            return res.json({
                userId,
                modules: {},
                overallProgress: 0,
                totalScore: 0,
                completedModules: 0,
                lastUpdated: null,
                achievements: [],
                message: 'No progress found for this user'
            });
        }
        
        res.json(userProgress);
        
    } catch (e) {
        console.error('Error retrieving IALab progress:', e);
        res.status(500).json({ error: e.message });
    }
});

// Endpoint para obtener contenido de módulos IALab
app.get('/api/ialab/modules/:id', async (req, res) => {
    const { id } = req.params;
    const moduleId = parseInt(id);
    
    if (isNaN(moduleId) || moduleId < 1 || moduleId > 5) {
        return res.status(400).json({ error: 'Module ID must be a number between 1 and 5' });
    }
    
    // Datos de módulos (en producción esto vendría de una base de datos)
    const modulesData = {
        1: {
            id: 1,
            title: 'Ingeniería de Prompts',
            description: 'Domina el arte de comunicarte con la IA a nivel experto.',
            duration: '4h 30min',
            level: 'Avanzado',
            videos: 12,
            projects: 3,
            topics: ['Mastery Framework', 'Contexto Dinámico', 'Zero-Shot Prompting', 'Chain-of-Thought'],
            challenge: 'Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
            materials: [
                { name: 'Guía de Ingeniería de Prompts', type: 'pdf', url: '/materials/modulo1-guia.pdf' },
                { name: 'Template MasterPrompt', type: 'md', url: '/materials/modulo1-template.md' },
                { name: 'Ejercicios Prácticos', type: 'pdf', url: '/materials/modulo1-ejercicios.pdf' }
            ],
            resources: [
                { title: 'Documentación Oficial', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
                { title: 'Curso Avanzado', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/' }
            ]
        },
        2: {
            id: 2,
            title: 'Potencia ChatGPT',
            description: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.',
            duration: '5h 00min',
            level: 'Avanzado',
            videos: 15,
            projects: 4,
            topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'],
            challenge: 'Estructura un GPT para análisis de mercados cuánticos.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            materials: [
                { name: 'Guía ChatGPT Avanzado', type: 'pdf', url: '/materials/modulo2-guia.pdf' },
                { name: 'Template GPTs', type: 'json', url: '/materials/modulo2-template.json' }
            ]
        },
        3: {
            id: 3,
            title: 'Rastreo Profundo',
            description: 'Técnicas de investigación profunda con IA para resultados de élite.',
            duration: '3h 45min',
            level: 'Intermedio',
            videos: 10,
            projects: 2,
            topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'],
            challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            materials: [
                { name: 'Guía de Investigación IA', type: 'pdf', url: '/materials/modulo3-guia.pdf' }
            ]
        },
        4: {
            id: 4,
            title: 'Inmersión NotebookLM',
            description: 'Convierte cualquier documento en conocimiento accionable con IA.',
            duration: '4h 00min',
            level: 'Intermedio',
            videos: 8,
            projects: 3,
            topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'],
            challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            materials: [
                { name: 'Guía NotebookLM', type: 'pdf', url: '/materials/modulo4-guia.pdf' },
                { name: 'Template Podcast', type: 'md', url: '/materials/modulo4-template.md' }
            ]
        },
        5: {
            id: 5,
            title: 'Proyecto Disruptivo',
            description: 'Aplica todo lo aprendido en un proyecto de impacto real.',
            duration: '6h 00min',
            level: 'Experto',
            videos: 6,
            projects: 5,
            topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'],
            challenge: 'Propón una automatización integral para una industria local de alto nivel.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            materials: [
                { name: 'Plantilla Proyecto Final', type: 'pdf', url: '/materials/modulo5-plantilla.pdf' },
                { name: 'Guía Pitch Deck', type: 'pptx', url: '/materials/modulo5-pitch.pptx' }
            ]
        }
    };
    
    const module = modulesData[moduleId];
    if (!module) {
        return res.status(404).json({ error: 'Module not found' });
    }
    
    res.json(module);
});

// Endpoint para obtener todos los módulos
app.get('/api/ialab/modules', async (req, res) => {
    res.json([
        { id: 1, title: 'Ingeniería de Prompts', description: 'Domina el arte de comunicarte con la IA a nivel experto.', level: 'Avanzado' },
        { id: 2, title: 'Potencia ChatGPT', description: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.', level: 'Avanzado' },
        { id: 3, title: 'Rastreo Profundo', description: 'Técnicas de investigación profunda con IA para resultados de élite.', level: 'Intermedio' },
        { id: 4, title: 'Inmersión NotebookLM', description: 'Convierte cualquier documento en conocimiento accionable con IA.', level: 'Intermedio' },
        { id: 5, title: 'Proyecto Disruptivo', description: 'Aplica todo lo aprendido en un proyecto de impacto real.', level: 'Experto' }
    ]);
});

// ============================================
// ENDPOINTS PARA GESTIÓN DE RECURSOS IALAB
// ============================================

// Endpoint para guardar templates de prompts
app.post('/api/ialab/templates', async (req, res) => {
    try {
        const { userId, templateName, templateData, category, difficulty } = req.body;
        
        if (!userId || !templateName || !templateData) {
            return res.status(400).json({ 
                error: 'Missing required fields: userId, templateName, templateData' 
            });
        }
        
        // En un sistema real, aquí guardaríamos en una base de datos
        // Por ahora, simulamos el guardado
        const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const savedTemplate = {
            id: templateId,
            userId,
            name: templateName,
            data: templateData,
            category: category || 'general',
            difficulty: difficulty || 'intermediate',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 0
        };
        
        console.log(`[IALab Templates] Saved template: ${templateName} for user: ${userId}`);
        
        res.status(201).json({
            success: true,
            message: 'Template saved successfully',
            template: savedTemplate
        });
        
    } catch (error) {
        console.error('Error saving IALab template:', error);
        res.status(500).json({ 
            error: 'Failed to save template',
            details: error.message 
        });
    }
});

// Endpoint para obtener templates de un usuario
app.get('/api/ialab/templates/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { category, difficulty } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        // Templates de ejemplo (en un sistema real, se obtendrían de la base de datos)
        const exampleTemplates = [
            {
                id: 'template_1',
                userId,
                name: 'Análisis de Mercado IA',
                data: {
                    blocks: [
                        { type: 'role', content: 'Eres un analista de mercado especializado en tecnologías emergentes' },
                        { type: 'context', content: 'El usuario necesita analizar el mercado de soluciones de IA para educación' },
                        { type: 'task', content: 'Proporciona un análisis detallado de tendencias, competidores y oportunidades' }
                    ]
                },
                category: 'business',
                difficulty: 'intermediate',
                createdAt: '2024-01-15T10:30:00Z',
                updatedAt: '2024-01-15T10:30:00Z',
                usageCount: 42
            },
            {
                id: 'template_2',
                userId,
                name: 'Generador de Contenido Educativo',
                data: {
                    blocks: [
                        { type: 'role', content: 'Eres un creador de contenido educativo experto' },
                        { type: 'tone', content: 'Usa un tono claro, profesional y accesible' },
                        { type: 'task', content: 'Genera contenido educativo sobre [tema] para [audiencia]' }
                    ]
                },
                category: 'content',
                difficulty: 'beginner',
                createdAt: '2024-01-20T14:45:00Z',
                updatedAt: '2024-01-20T14:45:00Z',
                usageCount: 78
            }
        ];
        
        // Filtrar por categoría y dificultad si se especifican
        let filteredTemplates = exampleTemplates;
        
        if (category && category !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.category === category);
        }
        
        if (difficulty && difficulty !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.difficulty === difficulty);
        }
        
        console.log(`[IALab Templates] Retrieved ${filteredTemplates.length} templates for user: ${userId}`);
        
        res.json({
            success: true,
            templates: filteredTemplates,
            total: filteredTemplates.length
        });
        
    } catch (error) {
        console.error('Error retrieving IALab templates:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve templates',
            details: error.message 
        });
    }
});

// Endpoint para actualizar un template
app.put('/api/ialab/templates/:templateId', async (req, res) => {
    try {
        const { templateId } = req.params;
        const { templateName, templateData, category, difficulty } = req.body;
        
        if (!templateId) {
            return res.status(400).json({ error: 'Template ID is required' });
        }
        
        // En un sistema real, actualizaríamos en la base de datos
        console.log(`[IALab Templates] Updated template: ${templateId}, new name: ${templateName}`);
        
        res.json({
            success: true,
            message: 'Template updated successfully',
            template: {
                id: templateId,
                name: templateName || 'Updated Template',
                data: templateData || {},
                category: category || 'general',
                difficulty: difficulty || 'intermediate',
                updatedAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Error updating IALab template:', error);
        res.status(500).json({ 
            error: 'Failed to update template',
            details: error.message 
        });
    }
});

// Endpoint para eliminar un template
app.delete('/api/ialab/templates/:templateId', async (req, res) => {
    try {
        const { templateId } = req.params;
        
        if (!templateId) {
            return res.status(400).json({ error: 'Template ID is required' });
        }
        
        // En un sistema real, eliminaríamos de la base de datos
        console.log(`[IALab Templates] Deleted template: ${templateId}`);
        
        res.json({
            success: true,
            message: 'Template deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting IALab template:', error);
        res.status(500).json({ 
            error: 'Failed to delete template',
            details: error.message 
        });
    }
});

// Endpoint para evaluar prompts automáticamente
app.post('/api/ialab/evaluate-prompt', async (req, res) => {
    try {
        const { prompt, criteria } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required for evaluation' });
        }
        
        const evaluationCriteria = criteria || {
            clarity: 'Clarity and specificity',
            structure: 'Logical structure',
            completeness: 'Completeness of information',
            tone: 'Appropriate tone for audience',
            actionability: 'Clear actionable requests'
        };
        
        // Simular evaluación con IA (en un sistema real, usaríamos el modelo de IA)
        const promptLength = prompt.length;
        const wordCount = prompt.split(/\s+/).length;
        const hasRole = prompt.toLowerCase().includes('eres') || prompt.toLowerCase().includes('you are');
        const hasTask = prompt.toLowerCase().includes('tarea') || prompt.toLowerCase().includes('task');
        const hasConstraints = prompt.toLowerCase().includes('evita') || prompt.toLowerCase().includes('avoid');
        
        const scores = {
            clarity: Math.min(10, Math.floor(wordCount / 50) + (hasRole ? 3 : 0)),
            structure: Math.min(10, (hasRole && hasTask && hasConstraints) ? 9 : 6),
            completeness: Math.min(10, Math.floor(promptLength / 200)),
            tone: 8, // Valor por defecto
            actionability: hasTask ? 9 : 5
        };
        
        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
        
        const feedback = [];
        if (wordCount < 50) feedback.push('Considera agregar más detalles al prompt');
        if (!hasRole) feedback.push('Agrega un rol específico para el asistente de IA');
        if (!hasTask) feedback.push('Define claramente la tarea principal');
        if (!hasConstraints) feedback.push('Considera agregar restricciones para mejores resultados');
        
        console.log(`[IALab Evaluation] Evaluated prompt of ${wordCount} words, score: ${totalScore.toFixed(1)}/10`);
        
        res.json({
            success: true,
            evaluation: {
                scores,
                totalScore: totalScore.toFixed(1),
                metrics: {
                    length: promptLength,
                    wordCount,
                    hasRole,
                    hasTask,
                    hasConstraints
                },
                feedback,
                grade: totalScore >= 8 ? 'Excelente' : totalScore >= 6 ? 'Bueno' : 'Necesita mejora',
                suggestions: [
                    'Usa un rol específico para el asistente',
                    'Define la tarea principal claramente',
                    'Incluye ejemplos concretos cuando sea posible',
                    'Especifica el formato de respuesta deseado'
                ]
            }
        });
        
    } catch (error) {
        console.error('Error evaluating prompt:', error);
        res.status(500).json({ 
            error: 'Failed to evaluate prompt',
            details: error.message 
        });
    }
});

// Endpoint para obtener recursos del curso IALab
app.get('/api/ialab/resources', async (req, res) => {
    try {
        const { moduleId, resourceType } = req.query;
        
        // Recursos de ejemplo organizados por módulo
        const resources = {
            module1: [
                { id: 'res1_m1', name: 'Guía de Prompt Engineering', type: 'pdf', url: '/ialab-resources/templates/module1/masterprompt-template.md' },
                { id: 'res2_m1', name: 'Template MasterPrompt', type: 'template', url: '/ialab-resources/templates/module1/masterprompt-template.md' },
                { id: 'res3_m1', name: 'Infografía Módulo 1', type: 'infographic', url: '/ialab-resources/infographics/module1-infographic.html' }
            ],
            module2: [
                { id: 'res1_m2', name: 'Configuración GPTs', type: 'json', url: '/ialab-resources/templates/module2/gpt-config-template.json' },
                { id: 'res2_m2', name: 'Guía ChatGPT Avanzado', type: 'guide', url: '/ialab-resources/templates/module2/chatgpt-workflow-guide.md' },
                { id: 'res3_m2', name: 'Infografía Módulo 2', type: 'infographic', url: '/ialab-resources/infographics/module2-infographic.html' }
            ],
            module3: [
                { id: 'res1_m3', name: 'Template Investigación', type: 'html', url: '/ialab-resources/templates/module3/research-template.html' },
                { id: 'res2_m3', name: 'Metodología Deep Research', type: 'guide', url: '/ialab-resources/templates/module3/deep-research-methodology.md' },
                { id: 'res3_m3', name: 'Infografía Módulo 3', type: 'infographic', url: '/ialab-resources/infographics/module3-infographic.html' }
            ],
            module4: [
                { id: 'res1_m4', name: 'Workflow NotebookLM', type: 'guide', url: '/ialab-resources/templates/module4/notebooklm-workflow.md' },
                { id: 'res2_m4', name: 'Template Podcast', type: 'template', url: '/ialab-resources/templates/module4/podcast-template.md' },
                { id: 'res3_m4', name: 'Infografía Módulo 4', type: 'infographic', url: '/ialab-resources/infographics/module4-infographic.html' }
            ],
            module5: [
                { id: 'res1_m5', name: 'Template Proyecto Final', type: 'template', url: '/ialab-resources/templates/module5/final-project-template.md' },
                { id: 'res2_m5', name: 'Plantilla Pitch Deck', type: 'template', url: '/ialab-resources/templates/module5/pitch-deck-template.md' },
                { id: 'res3_m5', name: 'Infografía Módulo 5', type: 'infographic', url: '/ialab-resources/infographics/module5-infographic.html' }
            ]
        };
        
        let filteredResources = [];
        
        if (moduleId && resources[moduleId]) {
            filteredResources = resources[moduleId];
        } else {
            // Devolver todos los recursos si no se especifica módulo
            Object.values(resources).forEach(moduleResources => {
                filteredResources.push(...moduleResources);
            });
        }
        
        // Filtrar por tipo de recurso si se especifica
        if (resourceType && resourceType !== 'all') {
            filteredResources = filteredResources.filter(res => res.type === resourceType);
        }
        
        console.log(`[IALab Resources] Retrieved ${filteredResources.length} resources`);
        
        res.json({
            success: true,
            resources: filteredResources,
            total: filteredResources.length,
            modules: Object.keys(resources)
        });
        
    } catch (error) {
        console.error('Error retrieving IALab resources:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve resources',
            details: error.message 
        });
    }
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
