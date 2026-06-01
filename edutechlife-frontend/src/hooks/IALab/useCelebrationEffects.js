import { useEffect, useRef } from 'react';
import { useIALabStore } from '../../store/ialabStore';
import { fireConfetti, speakTextConversational } from '../../utils/speech';
import { CONFETTI_PARTICLE_COUNT, CONFETTI_SPREAD, CELEBRATION_DURATION, CERTIFICATE_DELAY } from '../../components/IALab/constants/IALabConfig';
import { useTranslation } from '../../i18n/I18nProvider';

export function useCelebrationEffects(activeMod, handleGlobalAction) {
  const { t } = useTranslation();
  const prevFullyApproved = useRef(false);
  const prevCourseCompleted = useRef(false);
  const fullyApproved = useIALabStore(s => s.isModuleFullyApproved(activeMod));
  const courseCompleted = useIALabStore(s => s.isCourseCompleted());

  useEffect(() => {
    if (fullyApproved && !prevFullyApproved.current) {
      fireConfetti({
        particleCount: CONFETTI_PARTICLE_COUNT,
        spread: CONFETTI_SPREAD,
        origin: { y: 0.6 },
        colors: ['#004B63', '#00BCD4', '#FFD166', '#10B981']
      });
      speakTextConversational(t('ialab.speech.module_passed'), 'valerio');
    }
    prevFullyApproved.current = fullyApproved;
  }, [fullyApproved, t]);

  useEffect(() => {
    if (courseCompleted && !prevCourseCompleted.current) {
      const end = Date.now() + CELEBRATION_DURATION;
      const frame = () => {
        fireConfetti({
          particleCount: 80, spread: 100, origin: { y: 0.5 },
          colors: ['#004B63', '#00BCD4', '#FFD166', '#10B981', '#EF4444']
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
      speakTextConversational(t('ialab.speech.course_completed'), 'valerio');
      setTimeout(() => handleGlobalAction('OPEN_CERTIFICATE'), CERTIFICATE_DELAY);
    }
    prevCourseCompleted.current = courseCompleted;
  }, [courseCompleted, t, handleGlobalAction]);
}
