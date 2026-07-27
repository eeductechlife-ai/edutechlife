import { PROMPT_ANALIZAR_DOCUMENTO } from "../constants/prompts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://edutechlife-backend.onrender.com";

const TIMEOUT_MS = 60000; // 60 segundos timeout (Deepseek tarda en empezar)

async function fetchWithTimeout(url, options, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    clearTimeout(id);
    if (e.name === "AbortError") {
      throw new Error("Tiempo de espera agotado. Por favor, intenta de nuevo.");
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
      await new Promise((r) => setTimeout(r, delays[i]));
    }
  }
}

export async function callDeepseek(
  messagesOrPrompt,
  systemPromptOrOpts = null,
  legacyIsJson = false,
) {
  const url = `${API_BASE_URL}/api/chat`;

  let payload;

  // New format: callDeepseek([{role, content}], { isJson, temperature, maxTokens })
  if (Array.isArray(messagesOrPrompt)) {
    const messages = messagesOrPrompt;
    const opts =
      typeof systemPromptOrOpts === "object" && systemPromptOrOpts !== null
        ? systemPromptOrOpts
        : {};
    payload = {
      messages,
      isJson: opts.isJson ?? legacyIsJson,
      temperature: opts.temperature ?? 0.7,
      maxTokens: opts.maxTokens ?? 2000,
      model: opts.model,
    };
  } else {
    // Legacy format: callDeepseek(prompt, systemPrompt, isJson)
    const promptText = messagesOrPrompt;
    const systemPrompt =
      systemPromptOrOpts ||
      `Eres NICO, asistente de EdutechLife. Responde de forma clara y concisa.
    - Saluda brevemente si es primera vez
    - Explica servicios educativos de forma simple: VAK (estilos de aprendizaje), STEM, tutorías, bienestar
    - Pregunta nombre si no lo sabes
    - Si hay interés, captura: nombre, teléfono, interés principal
    - Ofrece clase gratuita si hay interés
    - Sé natural en español, respuestas cortas pero completas`;

    payload = {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: promptText },
      ],
      isJson: legacyIsJson,
      temperature: 0.5,
      maxTokens: 500,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () =>
        controller.abort(new DOMException("Timeout agotado", "TimeoutError")),
      30000,
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "API returned an error");
    }

    const result = payload.isJson
      ? JSON.parse(data.result.replace(/```json|```/g, "").trim())
      : data.result;

    // Simplificar respuesta si es muy larga (only legacy format)
    if (
      !Array.isArray(messagesOrPrompt) &&
      !payload.isJson &&
      result.length > 500
    ) {
      return (
        result.substring(0, 500) + "... ¿Te gustaría que profundice en algo?"
      );
    }

    return result;
  } catch (e) {
    if (e.name === "AbortError" || e.name === "TimeoutError") {
      console.warn("⚠️ API timeout:", e.message);
      throw new Error("El servidor no respondió a tiempo. Intenta de nuevo.");
    }
    console.warn("⚠️ API connection error:", e.message);
    throw e;
  }
}

export async function callDeepseekStream(
  messagesOrPrompt,
  systemPromptOrOpts = null,
  legacyIsJson = false,
  onChunk,
) {
  const url = `${API_BASE_URL}/api/chat/stream`;

  let payload;

  // New format: callDeepseekStream([{role, content}], opts, onChunk)
  if (Array.isArray(messagesOrPrompt)) {
    const messages = messagesOrPrompt;
    const opts =
      typeof systemPromptOrOpts === "object" && systemPromptOrOpts !== null
        ? systemPromptOrOpts
        : {};
    payload = {
      messages,
      isJson: opts.isJson ?? legacyIsJson,
      temperature: opts.temperature ?? 0.7,
      maxTokens: opts.maxTokens ?? 2000,
      model: opts.model,
    };
    // onChunk might be the third arg if opts was null
    const chunkCb =
      typeof systemPromptOrOpts === "function" ? systemPromptOrOpts : onChunk;
    return streamFetch(
      url,
      payload,
      chunkCb,
      opts.isJson ?? legacyIsJson,
      opts.signal,
    );
  } else {
    // Legacy format: callDeepseekStream(prompt, systemPrompt, isJson, onChunk)
    const promptText = messagesOrPrompt;
    const systemPrompt = systemPromptOrOpts || null;
    payload = {
      messages: [
        { role: "system", content: systemPrompt || "Eres un asistente útil." },
        { role: "user", content: promptText },
      ],
      isJson: legacyIsJson,
      temperature: 0.75,
      maxTokens: 1200,
    };
    return streamFetch(url, payload, onChunk, legacyIsJson);
  }
}

async function streamFetch(
  url,
  payload,
  onChunk,
  isJson,
  externalSignal,
  additionalHeaders = {},
) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(
        new Error("Timeout agotado: el servidor tardo demasiado en responder"),
      );
    }, 60000);

    if (externalSignal) {
      externalSignal.addEventListener("abort", () => {
        try {
          controller.abort(externalSignal.reason);
        } catch {}
      });
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...additionalHeaders },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        function read() {
          reader.read().then(({ done, value }) => {
            if (done) {
              if (isJson) {
                try {
                  const parsed = JSON.parse(
                    fullText.replace(/```json|```/g, "").trim(),
                  );
                  resolve(parsed);
                } catch (e) {
                  resolve({ error: true, message: "Failed to parse JSON" });
                }
              } else {
                resolve(fullText);
              }
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.chunk) {
                    fullText += parsed.chunk;
                    if (onChunk) onChunk(parsed.chunk);
                  } else if (parsed.crisisAlert) {
                    // Pass crisis alerts through onChunk with special marker
                    if (onChunk)
                      onChunk(
                        JSON.stringify({ __crisisAlert: parsed.crisisAlert }),
                      );
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
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          reject(
            new Error("El servidor no respondio a tiempo. Intenta de nuevo."),
          );
        } else {
          reject(err);
        }
      });
  });
}

export async function analyzeDocumentText(text, fileName, subject) {
  const messages = [
    { role: "system", content: PROMPT_ANALIZAR_DOCUMENTO },
    {
      role: "user",
      content: `Analiza el siguiente documento académico.\n\nNombre del archivo: ${fileName}\nMateria: ${subject || "No especificada"}\n\nContenido extraído:\n${text.substring(0, 4000)}`,
    },
  ];

  const result = await callDeepseek(messages, {
    temperature: 0.3,
    maxTokens: 1000,
    isJson: true,
  });

  return result;
}

/**
 * Dani chat with authentication + server-side safeguards
 * Uses /api/smartboard/chat/stream — requires Clerk token
 * @param {Array} messages - Chat history [{role, content}]
 * @param {Object} opts - Options {temperature, maxTokens, signal, token}
 * @param {Function} onChunk - Callback for streaming chunks
 */
export async function callDaniChatStream(messages, opts = {}, onChunk) {
  const url = `${API_BASE_URL}/api/smartboard/chat/stream`;

  let token = opts.token;

  if (!token) {
    // Try to get from Clerk if not provided
    if (typeof window !== "undefined" && window.__CLERK_AUTH_TOKEN) {
      token = window.__CLERK_AUTH_TOKEN;
    }
  }

  if (!token) {
    throw new Error("No auth token available — user must be logged in");
  }

  const payload = {
    messages,
    temperature: opts.temperature ?? 0.7,
    maxTokens: opts.maxTokens ?? 800,
    context: opts.context,
    socratic: opts.socratic ?? false,
    language: opts.language ?? "es",
  };

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return streamFetch(url, payload, onChunk, false, opts.signal, authHeaders);
}
