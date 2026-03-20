const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

export async function callDeepseekDirect(p, systemPrompt, isJson = false) {
    const url = 'https://api.deepseek.com/chat/completions';
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    
    if (!apiKey) {
        console.error('DeepSeek API key not configured');
        return isJson ? { error: true, message: 'API key not configured' } : 'Error: API key no configurada';
    }

    const payload = { 
        model: 'deepseek-chat', 
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: p }], 
        temperature: 0.75, 
        max_tokens: 1200 
    };
    if (isJson) payload.response_format = { type: 'json_object' };

    try {
        const data = await fetchWithRetry(url, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, 
            body: JSON.stringify(payload) 
        });
        
        if (data.error) throw new Error(data.error.message);
        const text = data.choices?.[0]?.message?.content;
        if (!text) return isJson ? { error: true } : 'Sin respuesta.';
        return isJson ? JSON.parse(text.replace(/```json|```/g, '').trim()) : text;
    } catch (e) { 
        return isJson ? { error: true, message: e.message } : `Error: ${e.message}`; 
    }
}
