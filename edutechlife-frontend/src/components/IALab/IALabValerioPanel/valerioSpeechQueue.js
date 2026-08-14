/**
 * valerioSpeechQueue
 * Cola de voz "voz primero, texto después" para MAX.
 *
 * Garantías de diseño (corrigen la carrera del watchdog que revelaba todo el
 * texto antes del audio y pisaba las llamadas TTS en vuelo):
 *  - El texto se revela SOLO cuando la frase empieza a sonar (onStart) o como
 *    último recurso por el watchdog de revelado.
 *  - La cola avanza SOLO cuando el audio real termina (onEnd). El watchdog
 *    NUNCA adelanta la cola ni cancela la voz en vuelo.
 *  - Cada llamada lleva un token: los callbacks obsoletos (de llamadas
 *    canceladas) se ignoran, así una voz nunca pisa a otra.
 *  - Al empezar una frase se precarga la siguiente (pipeline) para evitar
 *    huecos entre frases.
 */

const DEFAULT_WATCHDOG_MS = 12000;
const DEFAULT_DEAD_AUDIO_MS = 25000;

export const createSpeechQueue = ({
  speak,
  prefetch,
  reveal,
  onSpeak,
  onIdle,
  onFinalize,
  isStreamDone,
  watchdogMs = DEFAULT_WATCHDOG_MS,
  deadAudioMs = DEFAULT_DEAD_AUDIO_MS,
}) => {
  let queue = [];
  let playing = false;
  let callToken = 0;
  let watchdogTimer = null;
  let deadAudioTimer = null;
  let revealed = false;

  const clearTimers = () => {
    if (watchdogTimer) {
      clearTimeout(watchdogTimer);
      watchdogTimer = null;
    }
    if (deadAudioTimer) {
      clearTimeout(deadAudioTimer);
      deadAudioTimer = null;
    }
  };

  const finishDrain = () => {
    if (isStreamDone()) {
      onFinalize();
    } else {
      onIdle();
    }
  };

  const next = () => {
    if (playing || queue.length === 0) return;
    const text = queue.shift();
    revealed = false;
    playing = true;
    const token = ++callToken;

    watchdogTimer = setTimeout(() => {
      if (token !== callToken) return;
      watchdogTimer = null;
      if (!revealed) {
        revealed = true;
        reveal(text);
      }
    }, watchdogMs);

    deadAudioTimer = setTimeout(() => {
      if (token !== callToken) return;
      deadAudioTimer = null;
      callToken++;
      playing = false;
      if (queue.length > 0) {
        next();
      } else {
        finishDrain();
      }
    }, deadAudioMs);

    speak(
      text,
      () => {
        if (token !== callToken) return;
        clearTimers();
        playing = false;
        if (queue.length > 0) {
          next();
        } else {
          finishDrain();
        }
      },
      () => {
        if (token !== callToken) return;
        if (!revealed) {
          revealed = true;
          reveal(text);
        }
        const nextText = queue[0];
        if (nextText) {
          prefetch(nextText);
        }
        onSpeak();
      },
    );
  };

  const push = (sentences) => {
    const items = Array.isArray(sentences) ? sentences : [sentences];
    queue.push(...items.filter((s) => s && s.trim().length > 0));
    if (!playing) {
      next();
    }
  };

  const reset = () => {
    callToken++;
    clearTimers();
    queue = [];
    playing = false;
    revealed = false;
  };

  const pending = () => queue.length;

  const isPlaying = () => playing;

  return { push, reset, pending, isPlaying };
};
