import { useCallback, useEffect, useState } from "react";

const hasUserActivation = () =>
  typeof navigator !== "undefined" &&
  Boolean(navigator.userActivation?.hasBeenActive);

// click/touchend/keydown sí cuentan como gesto en iOS Safari (touchstart no).
const GESTURES = ["pointerup", "click", "touchend", "keydown"];

/**
 * Voz de MAX y Dani: activa por defecto al entrar a cada slide.
 * Los navegadores (sobre todo móviles) bloquean el audio sin una interacción
 * previa: la voz queda "en espera" hasta el primer toque/clic/tecla. En ese
 * gesto se activa el sonido del video en curso y se "desbloquean" los demás
 * videos del Hero, para que MAX y Dani hablen solos al llegar a su slide.
 */
export const useHeroVoice = (rootRef) => {
  const [voiceOn, setVoiceOn] = useState(true);
  const [unlocked, setUnlocked] = useState(hasUserActivation);

  useEffect(() => {
    if (unlocked) return undefined;
    const unlock = () => {
      rootRef.current?.querySelectorAll("video").forEach((v) => {
        if (!v.paused) {
          v.muted = false;
          return;
        }
        try {
          v.play?.()
            ?.then?.(() => v.pause())
            ?.catch?.(() => {});
        } catch {
          /* jsdom / navegadores sin media */
        }
      });
      setUnlocked(true);
    };
    const opts = { capture: true, passive: true };
    GESTURES.forEach((ev) => window.addEventListener(ev, unlock, opts));
    return () =>
      GESTURES.forEach((ev) => window.removeEventListener(ev, unlock, opts));
  }, [unlocked, rootRef]);

  const toggleVoice = useCallback(() => {
    if (!unlocked) {
      setUnlocked(true);
      setVoiceOn(true);
      return;
    }
    setVoiceOn((v) => !v);
  }, [unlocked]);

  // El navegador rechazó el audio: esperar la próxima interacción.
  const onAudioBlocked = useCallback(() => setUnlocked(false), []);

  return {
    muted: !(voiceOn && unlocked),
    waitingForGesture: voiceOn && !unlocked,
    toggleVoice,
    onAudioBlocked,
  };
};
