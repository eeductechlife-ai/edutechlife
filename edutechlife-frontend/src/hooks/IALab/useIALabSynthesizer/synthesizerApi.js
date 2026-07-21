import { API_BASE_URL } from "../../../config/api";
import {
  DEEPSEEK_ENDPOINT,
  DEEPSEEK_MODEL,
  DEEPSEEK_TEMPERATURE,
  DEEPSEEK_MAX_TOKENS,
  getSystemPrompt,
} from "./synthesizerConfig";

export async function callDeepSeekApi(userIdea, signal) {
  const response = await fetch(`${API_BASE_URL}${DEEPSEEK_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(userIdea),
        },
      ],
      temperature: DEEPSEEK_TEMPERATURE,
      max_tokens: DEEPSEEK_MAX_TOKENS,
      isJson: true,
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (!data.result) {
    throw new Error("Respuesta de API inv\u00e1lida");
  }

  return JSON.parse(data.result);
}
