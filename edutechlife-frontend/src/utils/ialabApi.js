// API Client específico para IALab
// Usa los endpoints especializados del backend para el curso IALab

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const IALAB_TIMEOUT = 15000; // 15 segundos timeout para IALab

// Función auxiliar para fetch con timeout
async function fetchWithTimeout(url, options, timeout = IALAB_TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (e) {
        clearTimeout(id);
        if (e.name === 'AbortError') {
            throw new Error('Tiempo de espera agotado. El servidor está tardando demasiado en responder.');
        }
        throw e;
    }
}

// Función para generar MasterPrompts usando el endpoint especializado de IALab
export async function generateMasterPrompt(prompt, templateType = 'general') {
    const url = `${API_BASE_URL}/api/ialab/prompts`;
    
    // Validación básica
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        throw new Error('El prompt no puede estar vacío');
    }
    
    if (prompt.length > 2000) {
        throw new Error('El prompt es demasiado largo (máximo 2000 caracteres)');
    }
    
    const payload = {
        prompt: prompt.trim(),
        templateType
    };
    
    console.log('📤 IALab API request:', { templateType, promptLength: prompt.length });
    
    try {
        const data = await fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        // Validar respuesta
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (!data.masterPrompt || !data.feedback) {
            throw new Error('Respuesta inválida del servidor');
        }
        
        console.log('✅ IALab API response:', {
            templateType,
            difficulty: data.difficulty,
            estimatedTokens: data.estimatedTokens
        });
        
        return data;
        
    } catch (error) {
        console.error('❌ Error en generateMasterPrompt:', error);
        
        // Respuesta de fallback
        return {
            masterPrompt: `Como experto en ${templateType}, genera un prompt claro y específico para: "${prompt}". Incluye contexto relevante, formato de respuesta esperado y ejemplos si es necesario.`,
            feedback: `Tu prompt original es un buen punto de partida. Para mejorarlo: 1) Añade más contexto específico, 2) Define el formato de respuesta esperado, 3) Incluye ejemplos si es relevante.`,
            difficulty: 'intermediate',
            estimatedTokens: 180,
            optimizationTips: [
                'Añade contexto específico sobre el objetivo',
                'Define claramente el formato de respuesta',
                'Incluye ejemplos o restricciones si son necesarias'
            ],
            templateType,
            originalPrompt: prompt,
            timestamp: new Date().toISOString(),
            note: 'Fallback response due to API error'
        };
    }
}

// Función para guardar progreso del curso
export async function saveProgress(userData) {
    const { userId, moduleId, completed = false, score = 0 } = userData;
    
    if (!userId) {
        throw new Error('userId es requerido');
    }
    
    if (!moduleId || moduleId < 1 || moduleId > 5) {
        throw new Error('moduleId debe ser un número entre 1 y 5');
    }
    
    const url = `${API_BASE_URL}/api/ialab/progress`;
    const payload = {
        userId,
        moduleId,
        completed,
        score,
        timestamp: new Date().toISOString()
    };
    
    try {
        const data = await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        return data;
        
    } catch (error) {
        console.error('Error saving progress to server:', error);
        
        // Fallback: guardar en localStorage
        const localProgress = getLocalProgress(userId);
        localProgress.modules[moduleId] = {
            moduleId,
            completed,
            score,
            timestamp: new Date().toISOString()
        };
        
        // Recalcular métricas
        const moduleEntries = Object.values(localProgress.modules);
        localProgress.completedModules = moduleEntries.filter(m => m.completed).length;
        localProgress.overallProgress = Math.round((localProgress.completedModules / 5) * 100);
        localProgress.totalScore = moduleEntries.reduce((sum, m) => sum + (m.score || 0), 0);
        localProgress.lastUpdated = new Date().toISOString();
        
        saveLocalProgress(userId, localProgress);
        
        return {
            success: true,
            progress: localProgress,
            message: 'Progress saved locally (server unavailable)'
        };
    }
}

// Función para obtener progreso del curso
export async function getProgress(userId) {
    if (!userId) {
        throw new Error('userId es requerido');
    }
    
    const url = `${API_BASE_URL}/api/ialab/progress/${userId}`;
    
    try {
        const data = await fetchWithTimeout(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        return data;
        
    } catch (error) {
        console.error('Error getting progress from server:', error);
        
        // Fallback: obtener de localStorage
        return getLocalProgress(userId);
    }
}

// Función para obtener contenido de un módulo
export async function getModuleContent(moduleId) {
    if (!moduleId || moduleId < 1 || moduleId > 5) {
        throw new Error('moduleId debe ser un número entre 1 y 5');
    }
    
    const url = `${API_BASE_URL}/api/ialab/modules/${moduleId}`;
    
    try {
        const data = await fetchWithTimeout(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        return data;
        
    } catch (error) {
        console.error('Error getting module content:', error);
        
        // Datos de fallback
        const fallbackModules = {
            1: {
                id: 1,
                title: 'Ingeniería de Prompts',
                description: 'Domina el arte de comunicarte con la IA a nivel experto.',
                duration: '4h 30min',
                level: 'Avanzado',
                topics: ['Mastery Framework', 'Contexto Dinámico', 'Zero-Shot Prompting', 'Chain-of-Thought'],
                challenge: 'Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.',
                videoUrl: null,
                materials: [],
                note: 'Contenido no disponible temporalmente'
            },
            2: {
                id: 2,
                title: 'Potencia ChatGPT',
                description: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.',
                duration: '5h 00min',
                level: 'Avanzado',
                topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'],
                challenge: 'Estructura un GPT para análisis de mercados cuánticos.',
                videoUrl: null,
                materials: [],
                note: 'Contenido no disponible temporalmente'
            },
            3: {
                id: 3,
                title: 'Rastreo Profundo',
                description: 'Técnicas de investigación profunda con IA para resultados de élite.',
                duration: '3h 45min',
                level: 'Intermedio',
                topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'],
                challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.',
                videoUrl: null,
                materials: [],
                note: 'Contenido no disponible temporalmente'
            },
            4: {
                id: 4,
                title: 'Inmersión NotebookLM',
                description: 'Convierte cualquier documento en conocimiento accionable con IA.',
                duration: '4h 00min',
                level: 'Intermedio',
                topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'],
                challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.',
                videoUrl: null,
                materials: [],
                note: 'Contenido no disponible temporalmente'
            },
            5: {
                id: 5,
                title: 'Proyecto Disruptivo',
                description: 'Aplica todo lo aprendido en un proyecto de impacto real.',
                duration: '6h 00min',
                level: 'Experto',
                topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'],
                challenge: 'Propón una automatización integral para una industria local de alto nivel.',
                videoUrl: null,
                materials: [],
                note: 'Contenido no disponible temporalmente'
            }
        };
        
        return fallbackModules[moduleId] || fallbackModules[1];
    }
}

// Función para obtener todos los módulos
export async function getAllModules() {
    const url = `${API_BASE_URL}/api/ialab/modules`;
    
    try {
        const data = await fetchWithTimeout(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        return data;
        
    } catch (error) {
        console.error('Error getting all modules:', error);
        
        // Fallback
        return [
            { id: 1, title: 'Ingeniería de Prompts', description: 'Domina el arte de comunicarte con la IA a nivel experto.', level: 'Avanzado' },
            { id: 2, title: 'Potencia ChatGPT', description: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.', level: 'Avanzado' },
            { id: 3, title: 'Rastreo Profundo', description: 'Técnicas de investigación profunda con IA para resultados de élite.', level: 'Intermedio' },
            { id: 4, title: 'Inmersión NotebookLM', description: 'Convierte cualquier documento en conocimiento accionable con IA.', level: 'Intermedio' },
            { id: 5, title: 'Proyecto Disruptivo', description: 'Aplica todo lo aprendido en un proyecto de impacto real.', level: 'Experto' }
        ];
    }
}

// ==================== FUNCIONES DE LOCALSTORAGE (FALLBACK) ====================

const LOCAL_STORAGE_KEY = 'ialab-progress';

function getLocalProgress(userId) {
    try {
        const allProgress = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
        return allProgress[userId] || {
            userId,
            modules: {},
            overallProgress: 0,
            totalScore: 0,
            completedModules: 0,
            lastUpdated: null,
            achievements: []
        };
    } catch (error) {
        console.error('Error reading local progress:', error);
        return {
            userId,
            modules: {},
            overallProgress: 0,
            totalScore: 0,
            completedModules: 0,
            lastUpdated: null,
            achievements: []
        };
    }
}

function saveLocalProgress(userId, progress) {
    try {
        const allProgress = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
        allProgress[userId] = progress;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
        return true;
    } catch (error) {
        console.error('Error saving local progress:', error);
        return false;
    }
}

// Función para generar un userId único si no existe
export function getOrCreateUserId() {
    let userId = localStorage.getItem('ialab-user-id');
    
    if (!userId) {
        // Generar ID único
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ialab-user-id', userId);
    }
    
    return userId;
}

// Función para guardar prompt en historial local
export function savePromptToHistory(prompt, result) {
    try {
        const history = JSON.parse(localStorage.getItem('ialab-prompt-history') || '[]');
        
        history.unshift({
            id: Date.now(),
            prompt,
            result,
            timestamp: new Date().toISOString(),
            templateType: result.templateType || 'general'
        });
        
        // Mantener solo los últimos 50 prompts
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('ialab-prompt-history', JSON.stringify(history));
        return true;
    } catch (error) {
        console.error('Error saving prompt history:', error);
        return false;
    }
}

// Función para obtener historial de prompts
export function getPromptHistory() {
    try {
        return JSON.parse(localStorage.getItem('ialab-prompt-history') || '[]');
    } catch (error) {
        console.error('Error reading prompt history:', error);
        return [];
    }
}

// Función para limpiar historial de prompts
export function clearPromptHistory() {
    try {
        localStorage.removeItem('ialab-prompt-history');
        return true;
    } catch (error) {
        console.error('Error clearing prompt history:', error);
        return false;
    }
}