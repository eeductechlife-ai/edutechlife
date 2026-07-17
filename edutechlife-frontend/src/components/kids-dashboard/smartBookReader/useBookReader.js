import { useState, useCallback } from "react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { extractDocumentText } from "../../../utils/documentParser";
import { callDeepseek } from "../../../utils/api";

export function useBookReader() {
  const {
    darkMode,
    smartBookHistory: history,
    setSmartBookHistory: setHistory,
  } = useSmartBoardKids();
  const [mode, setMode] = useState("input");
  const [text, setText] = useState("");
  const [step, setStep] = useState(0);
  const [book, setBook] = useState(null);
  const [view, setView] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setMode("input");
    setText("");
    setBook(null);
    setError(null);
  }, []);

  const process = useCallback(async (input) => {
    setMode("processing");
    setStep(0);
    setError(null);
    try {
      if (typeof input !== "string") {
        setStep(0);
        input = await extractDocumentText(input);
      }
      setStep(1);
      const messages = [
        {
          role: "system",
          content:
            'Eres un asistente educativo que analiza textos y los organiza en formato de "libro inteligente". Responde SIEMPRE en formato JSON válido.',
        },
        {
          role: "user",
          content: `Analiza el siguiente texto y organízalo en un "libro inteligente" con: título, resumen (2-3 oraciones), conceptos clave (array de strings), secciones (array de {titulo, contenido}).\n\nTexto:\n${input.substring(0, 4000)}`,
        },
      ];
      setStep(2);
      const r = await callDeepseek(messages, {
        temperature: 0.3,
        maxTokens: 1500,
        isJson: true,
      });
      const b = {
        id: Date.now(),
        title: r.title || "Libro Inteligente",
        summary: r.summary || "",
        keyConcepts: r.keyConcepts || [],
        sections: r.sections || [],
        createdAt: new Date().toISOString(),
      };
      setBook(b);
      setHistory((prev) => [b, ...prev].slice(-20));
      setMode("result");
    } catch (err) {
      setError(err.message || "Error al procesar");
      setMode("input");
    }
  }, []);

  return { darkMode, mode, text, setText, step, book, view, setView, error, process, history, reset };
}
