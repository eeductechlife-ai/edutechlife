import { PROMPT_ANALIZAR_DOCUMENTO } from "../constants/prompts";
import { API_BASE_URL } from "../config/api";

const TIMEOUT_MS = 60000; // 60 segundos timeout (Deepseek tarda en empezar)

/**
 * JWT de Supabase guardado por useSupabaseAuth (clave auth_token en
 * localStorage). Se adjunta como Bearer para que el backend pueda
 * atribuir la llamada al usuario; el chat público sigue funcionando
 * sin sesión.
 */
function isJwtExpired(token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.exp ? payload.exp < Math.floor(Date.now() / 1000) : false;
  } catch {
    return false;
  }
}

function getAuthToken() {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem("auth_token");
    if (stored && !isJwtExpired(stored)) return stored;

    // Token expirado o ausente — buscar la sesión interna del SDK de Supabase
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("sb-") && key.endsWith("-auth-token")) {
        const parsed = JSON.parse(localStorage.getItem(key) || "{}");
        const fresh = parsed?.access_token;
        if (fresh && !isJwtExpired(fresh)) {
          sessionStorage.setItem("auth_token", fresh);
          return fresh;
        }
      }
    }
    return stored; // último recurso (puede estar expirado)
  } catch {
    return null;
  }
}

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

/**
 * Parseo tolerante de JSON generado por IA. DeepSeek a veces devuelve
 * JSON con comas finales, texto sobrante o truncado. Este parser intenta
 * reparar y extraer la estructura válida en lugar de fallar.
 */
function stripCodeFences(text) {
  return (text || "").replace(/```json|```/g, "").trim();
}

function extractBalancedJson(text) {
  const start = text.search(/[[{]/);
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "[" || ch === "{") depth++;
    else if (ch === "]" || ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return text.slice(start);
}

export function parseJsonResult(raw) {
  if (!raw || typeof raw !== "string") return null;

  const cleaned = stripCodeFences(raw).trim();
  if (!cleaned) return null;

  // Attempt 1: Direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // continue with repairs
  }

  // Attempt 2: Extract balanced JSON and remove trailing commas
  const extracted = extractBalancedJson(cleaned);
  if (extracted) {
    const candidates = [
      extracted,
      extracted.replace(/,\s*([\]}])/g, "$1"),
      extracted.replace(/,(\s*[}\]])/g, "$1"),
    ];

    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate);
      } catch {
        // try next candidate
      }
    }
  }

  // Attempt 3: Aggressive cleanup — remove any non-JSON prefix/suffix
  const start = cleaned.search(/[{[]/);
  if (start > 0) {
    const substr = cleaned.substring(start);
    try {
      return JSON.parse(substr);
    } catch {
      // continue
    }
  }

  // Attempt 4: Try to find last closing brace/bracket
  for (let i = cleaned.length - 1; i >= 0; i--) {
    if (cleaned[i] === "}" || cleaned[i] === "]") {
      const substr = cleaned.substring(start >= 0 ? start : 0, i + 1);
      try {
        return JSON.parse(substr);
      } catch {
        // continue
      }
    }
  }

  // Attempt 5: Repair truncated JSON by closing open brackets/braces
  const jsonStart = cleaned.search(/[{[]/);
  if (jsonStart !== -1) {
    const fragment = cleaned.substring(jsonStart);
    const stack = [];
    let repaired = "";
    let inStr = false;
    let esc = false;
    for (const ch of fragment) {
      repaired += ch;
      if (esc) {
        esc = false;
        continue;
      }
      if (ch === "\\" && inStr) {
        esc = true;
        continue;
      }
      if (ch === '"') {
        inStr = !inStr;
        continue;
      }
      if (inStr) continue;
      if (ch === "{") stack.push("}");
      else if (ch === "[") stack.push("]");
      else if ((ch === "}" || ch === "]") && stack.length) stack.pop();
    }
    // Strip trailing comma before closing
    repaired = repaired.replace(/,\s*$/, "");
    // Close all open structures
    while (stack.length) repaired += stack.pop();
    try {
      return JSON.parse(repaired);
    } catch {
      // give up
    }
  }

  return null;
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
        ...(getAuthToken()
          ? { Authorization: `Bearer ${getAuthToken()}` }
          : {}),
      },
      body: JSON.stringify(payload),
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const detail = body?.error?.message || body?.error || response.statusText;
      throw new Error(
        `API responded with status ${response.status}${detail ? `: ${detail}` : ""}`,
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "API returned an error");
    }

    const result = payload.isJson ? parseJsonResult(data.result) : data.result;

    if (payload.isJson && result === null) {
      console.warn(
        "[callDeepseek] JSON parse failed. Raw response:",
        (data.result || "").substring(0, 500),
      );
      const err = new Error("La respuesta de la IA no fue un JSON válido.");
      err.raw = data.result || "";
      throw err;
    }

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
/**
 * SmartBoard-specific AI call — routes through /api/smartboard/ai which enforces
 * requireAuth + requireVerifiedParentalConsent. Use this instead of callDeepseek()
 * for all AI calls made from within the SmartBoard kids dashboard.
 *
 * Si el backend desplegado aún no expone /api/smartboard/ai (404), hace fallback
 * a /api/smartboard/chat, que exige la misma autorización y consentimiento
 * parental y responde con la misma forma { result }.
 */
export async function callDeepseekSmartboard(messages, opts = {}) {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token — user must be logged in");

  const payload = {
    messages,
    isJson: opts.isJson ?? false,
    temperature: opts.temperature ?? 0.7,
    maxTokens: opts.maxTokens ?? 2000,
  };

  const attempt = async (url) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () =>
        controller.abort(new DOMException("Timeout agotado", "TimeoutError")),
      30000,
    );

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        mode: "cors",
        credentials: "omit",
        signal: controller.signal,
      });

      if (response.status === 404) {
        return { notFound: true };
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (
          response.status === 403 &&
          body?.error?.code === "PARENTAL_CONSENT_REQUIRED"
        ) {
          const err = new Error(
            "Se requiere consentimiento parental para usar esta función.",
          );
          err.code = "PARENTAL_CONSENT_REQUIRED";
          throw err;
        }
        if (
          response.status === 503 &&
          body?.error?.code === "CONSENT_CHECK_UNAVAILABLE"
        ) {
          const err = new Error(
            "No se pudo verificar el consentimiento. Intenta de nuevo.",
          );
          err.code = "CONSENT_CHECK_UNAVAILABLE";
          throw err;
        }
        const detail =
          body?.error?.message || body?.error || response.statusText;
        throw new Error(
          `API responded with status ${response.status}${detail ? `: ${detail}` : ""}`,
        );
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (opts.isJson) {
        const parsed = parseJsonResult(data.result);
        if (parsed === null) {
          const err = new Error("La respuesta de la IA no fue un JSON válido.");
          err.raw = data.result || "";
          throw err;
        }
        return { value: parsed };
      }

      return { value: data.result };
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    const primary = await attempt(`${API_BASE_URL}/api/smartboard/ai`);
    if (!primary.notFound) return primary.value;

    const fallback = await attempt(`${API_BASE_URL}/api/smartboard/chat`);
    if (fallback.notFound) {
      throw new Error(
        "El servidor no reconoce los endpoints de IA del SmartBoard.",
      );
    }
    return fallback.value;
  } catch (e) {
    if (e.name === "AbortError" || e.name === "TimeoutError") {
      throw new Error("El servidor no respondió a tiempo. Intenta de nuevo.");
    }
    throw e;
  }
}

/**
 * SmartBoard-specific AI call — routes through /api/smartboard/ai which enforces
 * requireAuth + requireVerifiedParentalConsent. Use this instead of callDeepseek()
 * for all AI calls made from within the SmartBoard kids dashboard.
 */
export async function callDeepseekSmartboard(messages, opts = {}) {
  const url = `${API_BASE_URL}/api/smartboard/ai`;
  const token = getAuthToken();
  if (!token) throw new Error("No auth token — user must be logged in");

  const payload = {
    messages,
    isJson: opts.isJson ?? false,
    temperature: opts.temperature ?? 0.7,
    maxTokens: opts.maxTokens ?? 2000,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new DOMException("Timeout agotado", "TimeoutError")),
    30000,
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const detail = body?.error || response.statusText;
      throw new Error(
        `API responded with status ${response.status}${detail ? `: ${detail}` : ""}`,
      );
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    if (opts.isJson) {
      const parsed = parseJsonResult(data.result);
      if (parsed === null) {
        const err = new Error("La respuesta de la IA no fue un JSON válido.");
        err.raw = data.result || "";
        throw err;
      }
      return parsed;
    }

    return data.result;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === "AbortError" || e.name === "TimeoutError") {
      throw new Error("El servidor no respondió a tiempo. Intenta de nuevo.");
    }
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
      getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
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
    return streamFetch(
      url,
      payload,
      onChunk,
      legacyIsJson,
      undefined,
      getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
    );
  }
}

function consumeSSEStream(response, onChunk, isJson) {
  return new Promise((resolve, reject) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    function read() {
      reader
        .read()
        .then(({ done, value }) => {
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
                } else if (parsed.error) {
                  // Backend stream error — propagate so callers can show a proper message
                  reject(new Error(`Stream error 500: ${parsed.error}`));
                  return;
                }
              } catch (e) {
                // Skip parsing errors (e.g. [DONE])
              }
            }
          }

          read();
        })
        .catch(reject);
    }

    read();
  });
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
        return consumeSSEStream(response, onChunk, isJson);
      })
      .then(resolve)
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
    token = getAuthToken();
  }

  if (!token) {
    throw new Error("No auth token available — user must be logged in");
  }

  const payload = {
    messages,
    temperature: opts.temperature ?? 0.7,
    maxTokens: opts.maxTokens ?? 800,
  };

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return streamFetch(url, payload, onChunk, false, opts.signal, authHeaders);
}

/**
 * Dani 2.0 — orchestrated chat endpoint.
 * Frontend sends minimal payload; backend builds full context from DB.
 * @param {{ message, studentId, socraticMode?, documentContext?, history? }} payload
 * @param {Object} opts - { token, signal }
 * @param {Function} onChunk - callback for each streamed chunk
 *
 * Si el backend desplegado aún no expone /api/smartboard/dani/chat (404), hace
 * fallback a /api/smartboard/chat/stream (misma seguridad requireAuth +
 * requireVerifiedParentalConsent y mismo formato { chunk }), convirtiendo el
 * payload mínimo del orquestador al formato { messages } legacy.
 */
export async function callDaniOrchestrator(payload, opts = {}, onChunk) {
  let token = opts.token;
  if (!token) {
    token = getAuthToken();
  }
  if (!token)
    throw new Error("No auth token available — user must be logged in");

  const authHeaders = { Authorization: `Bearer ${token}` };
  const primaryUrl = `${API_BASE_URL}/api/smartboard/dani/chat`;

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () =>
      controller.abort(
        new Error("Timeout agotado: el servidor tardo demasiado en responder"),
      ),
    60000,
  );

  let response;
  try {
    response = await fetch(primaryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("El servidor no respondio a tiempo. Intenta de nuevo.");
    }
    throw err;
  }
  clearTimeout(timeoutId);

  if (response.status === 404) {
    const messages = [
      ...(Array.isArray(payload.history) ? payload.history : []),
      { role: "user", content: payload.message },
    ];
    return streamFetch(
      `${API_BASE_URL}/api/smartboard/chat/stream`,
      { messages, context: payload.documentContext || undefined },
      onChunk,
      false,
      opts.signal,
      authHeaders,
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.error || response.statusText;
    throw new Error(
      `API responded with status ${response.status}${detail ? `: ${detail}` : ""}`,
    );
  }

  return consumeSSEStream(response, onChunk, false);
}
