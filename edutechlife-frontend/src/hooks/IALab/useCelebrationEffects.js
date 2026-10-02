import { useEffect, useRef } from "react";
import { useIALabStore } from "../../store/ialabStore";
import { fireConfetti, speakTextConversational } from "../../utils/speech";
import {
  CONFETTI_PARTICLE_COUNT,
  CONFETTI_SPREAD,
  CELEBRATION_DURATION,
  CERTIFICATE_DELAY,
} from "../../components/IALab/constants/IALabConfig";
import { useTranslation } from "../../i18n/I18nProvider";

export function useCelebrationEffects(activeMod, handleGlobalAction) {
  const { t } = useTranslation();
  const prevFullyApproved = useRef(false);
  const prevCourseCompleted = useRef(false);
  const prevResourcesCompleted = useRef(null); // null = not yet initialized
  const fullyApproved = useIALabStore((s) =>
    s.isModuleFullyApproved(activeMod),
  );
  const courseCompleted = useIALabStore((s) => s.isCourseCompleted());
  const moduleProgress = useIALabStore((s) => s.moduleProgress);

  // Celebración al completar CONTENIDO (recursos) — antes del examen
  useEffect(() => {
    const resourcesDone = !!moduleProgress[activeMod]?.resourcesCompleted;
    const examDone = !!moduleProgress[activeMod]?.exam;
    // Solo celebrar al momento exacto de completar recursos, no si el examen ya fue hecho
    if (prevResourcesCompleted.current === null) {
      prevResourcesCompleted.current = resourcesDone;
      return;
    }
    if (resourcesDone && !prevResourcesCompleted.current && !examDone) {
      fireConfetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#00BCD4", "#10B981", "#FFD166"],
      });
      handleGlobalAction("CONTENT_COMPLETED");
    }
    prevResourcesCompleted.current = resourcesDone;
  }, [activeMod, moduleProgress, handleGlobalAction]);

  useEffect(() => {
    if (fullyApproved && !prevFullyApproved.current) {
      fireConfetti({
        particleCount: CONFETTI_PARTICLE_COUNT,
        spread: CONFETTI_SPREAD,
        origin: { y: 0.6 },
        colors: ["#004B63", "#00BCD4", "#FFD166", "#10B981"],
      });
      speakTextConversational(t("ialab.speech.module_passed"), "max");
    }
    prevFullyApproved.current = fullyApproved;
  }, [fullyApproved, t]);

  useEffect(() => {
    if (courseCompleted && !prevCourseCompleted.current) {
      // La celebración y la apertura del modal de certificado deben ocurrir una
      // sola vez. Sin esta marca, en cada visita tras completar el curso el
      // modal "Mis Certificados" se abría solo, porque prevCourseCompleted
      // arranca en false en cada montaje.
      let alreadyCelebrated = false;
      try {
        const scope = localStorage.getItem("user_email") || "anon";
        const key = `ialab_course_celebration_${scope}`;
        alreadyCelebrated = localStorage.getItem(key) === "1";
        if (!alreadyCelebrated) localStorage.setItem(key, "1");
      } catch {
        /* storage no disponible: se comporta como antes */
      }
      if (alreadyCelebrated) {
        prevCourseCompleted.current = courseCompleted;
        return;
      }
      const end = Date.now() + CELEBRATION_DURATION;
      const frame = () => {
        fireConfetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.5 },
          colors: ["#004B63", "#00BCD4", "#FFD166", "#10B981", "#EF4444"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
      speakTextConversational(t("ialab.speech.course_completed"), "max");
      setTimeout(
        () => handleGlobalAction("OPEN_CERTIFICATE"),
        CERTIFICATE_DELAY,
      );
    }
    prevCourseCompleted.current = courseCompleted;
  }, [courseCompleted, t, handleGlobalAction]);
}
