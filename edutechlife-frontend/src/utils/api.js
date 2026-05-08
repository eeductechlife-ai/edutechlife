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

export async function callDeepseek(p, systemPrompt = null, isJson = false) {
    const url = `${API_BASE_URL}/api/chat`;
    
    const defaultPrompt = `Eres NICO, asistente de EdutechLife. Responde de forma clara y concisa.
    - Saluda brevemente si es primera vez
    - Explica servicios educativos de forma simple: VAK (estilos de aprendizaje), STEM, tutorías, bienestar
    - Pregunta nombre si no lo sabes
    - Si hay interés, captura: nombre, teléfono, interés principal
    - Ofrece clase gratuita si hay interés
    - Sé natural en español, respuestas cortas pero completas`;
    
    const prompt = systemPrompt || defaultPrompt;
    
    const payload = { 
        prompt: p, 
        systemPrompt: prompt, 
        isJson 
    };

    // Log mínimo para velocidad
    console.log('📤 API request:', p.substring(0, 50) + '...');

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
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
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'API returned an error');
        }
        
        const result = isJson ? JSON.parse(data.result.replace(/```json|```/g, '').trim()) : data.result;
        
        // Simplificar respuesta si es muy larga
        if (!isJson && result.length > 500) {
            return result.substring(0, 500) + '... ¿Te gustaría que profundice en algo?';
        }
        
        return result;
    } catch (e) { 
        console.warn('⚠️ API connection error:', e.message);
        throw e;
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


