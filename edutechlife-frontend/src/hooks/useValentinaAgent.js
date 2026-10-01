import { useState, useEffect, useCallback, useRef } from "react";
import { speakAsValentina as valSpeak, stopSpeech } from "../utils/speech";
import { VALENTINA_MESSAGES } from "../utils/valentinaMessages";

/**
 * Hook de la voz de Valeria, la guía de aprendizaje con IA del ADN de
 * Aprendizaje. Lee las preguntas y el resultado; nunca bloquea la pantalla.
 */
export default function useValentinaAgent(options = {}) {
  const { studentAge = 12, enabled = true } = options;

  const [valentinaMode, setValentinaMode] = useState(enabled);
  const [isValentinaSpeaking, setIsValentinaSpeaking] = useState(false);
  const [valeriaExpression, setValeriaExpression] = useState("neutral");
  const [volume, setVolume] = useState(1.0);

  const isMountedRef = useRef(true);
  const speakingPromiseRef = useRef(null);
  const speakingRef = useRef(false); // evita closures viejos en speakAsValentina

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Sincronizar con el interruptor de voz de la pantalla.
  useEffect(() => {
    setValentinaMode(enabled);
  }, [enabled]);

  const speakAsValentina = useCallback(
    async (text) => {
      if (!text || !isMountedRef.current || !valentinaMode) return;

      // Si ya está hablando, esperar a que termine.
      if (speakingRef.current) {
        try {
          await speakingPromiseRef.current;
        } catch {
          // Ignorar errores de promesas anteriores
        }
      }

      speakingPromiseRef.current = new Promise((resolve) => {
        (async () => {
          try {
            speakingRef.current = true;
            setIsValentinaSpeaking(true);

            await new Promise((resolveSpeech) => {
              valSpeak(text, parseInt(studentAge) || 12, () => {
                resolveSpeech();
              });
            });
          } catch (error) {
            console.warn("Error al hablar como Valeria:", error);
          } finally {
            if (isMountedRef.current) {
              speakingRef.current = false;
              setIsValentinaSpeaking(false);
            }
            resolve();
          }
        })();
      });

      await speakingPromiseRef.current;
    },
    [valentinaMode, studentAge],
  );

  const stopSpeaking = useCallback(() => {
    stopSpeech();
    setIsValentinaSpeaking(false);
    speakingPromiseRef.current = null;
  }, []);

  const setValeriaVolume = useCallback((v) => {
    setVolume(Math.max(0, Math.min(1, v)));
  }, []);

  const readQuestionWithOptions = useCallback(
    async (questionText, questionOptions, currentNum, total) => {
      if (!isMountedRef.current || !valentinaMode) return;

      setValeriaExpression("thinking");
      await speakAsValentina(
        VALENTINA_MESSAGES.all.readQuestion(
          currentNum,
          total,
          questionText,
          questionOptions,
        ),
      );
      setValeriaExpression("neutral");
    },
    [speakAsValentina, valentinaMode],
  );

  return {
    valentinaMode,
    isValentinaSpeaking,
    valeriaExpression,
    volume,
    setValeriaVolume,
    speakAsValentina,
    stopSpeaking,
    readQuestionWithOptions,
  };
}
