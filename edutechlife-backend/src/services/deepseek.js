const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_TIMEOUT = 30000;

async function fetchWithRetry(url, options, retries = 3) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT);
  const finalOptions = { ...options, signal: controller.signal };

  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, finalOptions);
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      let body;
      try { body = await response.json(); } catch {}
      const err = new Error(body?.error?.message || `HTTP ${response.status}`);
      err.status = response.status;
      err.body = body;
      // Client errors (4xx) should not be retried
      if (response.status >= 400 && response.status < 500) throw err;
      lastError = err;
      throw err;
    } catch (e) {
      clearTimeout(timeoutId);
      lastError = e;
      if (e.name === 'AbortError') throw new Error('DeepSeek request timed out');
      if (e.status >= 400 && e.status < 500) throw e;
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw lastError;
}

function buildPayload({ messages, prompt, systemPrompt, isJson, temperature, maxTokens, model, stream = false }) {
  let msgs = messages;
  if (!msgs && prompt) {
    msgs = [
      { role: 'system', content: systemPrompt || '' },
      { role: 'user', content: prompt }
    ];
  }
  const payload = {
    model: model || 'deepseek-chat',
    messages: msgs,
    temperature: temperature ?? 0.7,
    max_tokens: maxTokens || 800,
    stream
  };
  if (isJson) payload.response_format = { type: 'json_object' };
  return payload;
}

function validateMessages(messages) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return 'Messages array is required and must be non-empty';
  }
  for (const msg of messages) {
    if (!msg.role || typeof msg.content !== 'string') {
      return 'Each message must have role and content (string)';
    }
  }
  return null;
}

async function chat(apiKey, body) {
  const payload = buildPayload({ ...body, stream: false });
  return fetchWithRetry(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
}

async function chatStream(apiKey, body, onChunk) {
  const payload = buildPayload({ ...body, stream: true });
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) onChunk(content);
        } catch { /* skip malformed SSE frames */ }
      }
    }
  }
}

module.exports = { chat, chatStream, validateMessages, buildPayload, fetchWithRetry };
