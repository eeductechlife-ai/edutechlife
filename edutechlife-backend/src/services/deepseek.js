const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

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

async function chatStream(apiKey, body) {
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
  return response;
}

module.exports = { chat, chatStream, validateMessages, buildPayload, fetchWithRetry };
