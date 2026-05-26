const { Router } = require('express');
const { chat, chatStream, validateMessages } = require('../services/deepseek');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

function checkApiKey(req, res) {
  if (!DEEPSEEK_API_KEY) {
    res.status(500).json({ error: 'API key not configured on server' });
    return false;
  }
  return true;
}

router.post('/', async (req, res) => {
  const { messages, prompt, systemPrompt, isJson, temperature, maxTokens, model } = req.body;

  let msgs = messages;
  if (!msgs && prompt) {
    msgs = [
      { role: 'system', content: systemPrompt || '' },
      { role: 'user', content: prompt }
    ];
  }

  const validationError = validateMessages(msgs);
  if (validationError) return res.status(400).json({ error: validationError });
  if (!checkApiKey(req, res)) return;

  try {
    const data = await chat(DEEPSEEK_API_KEY, { messages: msgs, isJson, temperature, maxTokens, model });
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from API' });

    console.log(`[DeepSeek] Response time: ${Date.now() - new Date().getTime()}ms`);
    res.json({ result: text });
  } catch (e) {
    console.error('Error calling DeepSeek API:', e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/stream', async (req, res) => {
  const { messages, prompt, systemPrompt, isJson, temperature, maxTokens, model } = req.body;

  let msgs = messages;
  if (!msgs && prompt) {
    msgs = [
      { role: 'system', content: systemPrompt || '' },
      { role: 'user', content: prompt }
    ];
  }

  const validationError = validateMessages(msgs);
  if (validationError) return res.status(400).json({ error: validationError });
  if (!checkApiKey(req, res)) return;

  try {
    const response = await chatStream(DEEPSEEK_API_KEY, { messages: msgs, isJson, temperature, maxTokens, model });

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
            } catch (e) { /* skip parse errors for incomplete chunks */ }
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

module.exports = router;
