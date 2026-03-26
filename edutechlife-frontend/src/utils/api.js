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
    const payload = { 
        prompt: p, 
        systemPrompt, 
        isJson 
    };

    try {
        const data = await fetchWithRetry(url, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        });
        
        if (data.error) throw new Error(data.message || data.error);
        return isJson ? JSON.parse(data.result.replace(/```json|```/g, '').trim()) : data.result;
    } catch (e) { 
        return isJson ? { error: true, message: e.message } : `Error: ${e.message}`; 
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


