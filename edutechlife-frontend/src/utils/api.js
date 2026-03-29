const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://edutechlife-backend.onrender.com';

const TIMEOUT_MS = 10000; // 10 segundos timeout

async function fetchWithTimeout(url, options, timeout = TIMEOUT_MS) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (e) {
        clearTimeout(id);
        if (e.name === 'AbortError') {
            throw new Error('Tiempo de espera agotado. Por favor, intenta de nuevo.');
        }
        throw e;
    }
}

async function fetchWithRetry(url, options, retries = 2) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchWithTimeout(url, options, 10000);
        } catch (e) {
            if (i === retries - 1) throw e;
            const delays = [1000, 2000];
            await new Promise(r => setTimeout(r, delays[i]));
        }
    }
}

export async function callDeepseek(p, systemPrompt, isJson = false) {
    const url = `${API_BASE_URL}/api/chat`;
    
    // Prompt optimizado para velocidad y claridad
    const safeSystemPrompt = `Eres NICO, asistente de EdutechLife. Responde de forma clara y concisa.
    - Saluda brevemente si es primera vez
    - Explica servicios educativos de forma simple: VAK (estilos de aprendizaje), STEM, tutorías, bienestar
    - Pregunta nombre si no lo sabes
    - Si hay interés, captura: nombre, teléfono, interés principal
    - Ofrece clase gratuita si hay interés
    - Sé natural en español, respuestas cortas pero completas`;
    
    const payload = { 
        prompt: p, 
        systemPrompt: safeSystemPrompt, 
        isJson 
    };

    // Log mínimo para velocidad
    console.log('📤 API request:', p.substring(0, 50) + '...');

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout
        
        const response = await fetch(url, { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }, 
            body: JSON.stringify(payload),
            mode: 'cors',
            credentials: 'omit',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            // Respuesta rápida de error
            console.warn('⚠️ API error:', response.status);
            return `Lo siento, hubo un problema técnico. ¿Podrías repetir tu pregunta o contactarnos por WhatsApp?`;
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.warn('⚠️ API data error:', data.error);
            return `Entiendo tu pregunta. Como asistente de EdutechLife, puedo ayudarte con información sobre nuestros servicios educativos. ¿En qué te puedo asistir?`;
        }
        
        const result = isJson ? JSON.parse(data.result.replace(/```json|```/g, '').trim()) : data.result;
        
        // Simplificar respuesta si es muy larga
        if (!isJson && result.length > 500) {
            return result.substring(0, 500) + '... ¿Te gustaría más detalles sobre algún servicio específico?';
        }
        
        return result;
    } catch (e) { 
        console.warn('⚠️ API connection error:', e.message);
        // Respuesta de respaldo rápida
        return `¡Hola! Soy Nico de EdutechLife. Ofrecemos servicios educativos como VAK, STEM, tutorías y bienestar. ¿En qué puedo ayudarte hoy?`; 
    }
}

export async function callDeepseekStream(p, systemPrompt, isJson = false, onChunk) {
    const url = `${API_BASE_URL}/api/chat/stream`;
    const payload = { 
        prompt: p, 
        systemPrompt, 
        isJson 
    };

    return new Promise((resolve, reject) => {
        fetch(url, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullText = '';

            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        if (isJson) {
                            try {
                                const parsed = JSON.parse(fullText.replace(/```json|```/g, '').trim());
                                resolve(parsed);
                            } catch (e) {
                                resolve({ error: true, message: 'Failed to parse JSON' });
                            }
                        } else {
                            resolve(fullText);
                        }
                        return;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.chunk) {
                                    fullText += parsed.chunk;
                                    if (onChunk) onChunk(parsed.chunk);
                                }
                            } catch (e) {
                                // Skip parsing errors
                            }
                        }
                    }
                    
                    read();
                });
            }

            read();
        })
        .catch(err => {
            reject(err);
        });
    });
}


