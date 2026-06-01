import { useState, useEffect, useCallback } from 'react';
import { useIALabStore } from '../../../../store/ialabStore';
import useScreenshotProtection from '../../../../hooks/IALab/useScreenshotProtection';
import { useTranslation } from '../../../../i18n/I18nProvider';

export function useQuizSecurity({ isVisible, showScoreResult, MAX_SECURITY_WARNINGS, onSecurityMaxOut }) {
  const { t } = useTranslation();

  const securityWarningCount = useIALabStore(s => s.securityWarningCount);
  const setSecurityWarningCount = useIALabStore(s => s.setSecurityWarningCount);
  const showSecurityMessage = useIALabStore(s => s.showSecurityMessage);
  const securityMessage = useIALabStore(s => s.securityMessage);

  const [securityAlert, setSecurityAlert] = useState(null);
  const [printWarning, setPrintWarning] = useState(null);

  const { showOverlay } = useScreenshotProtection(isVisible && !showScoreResult, {
    onMaxViolations: () => {
      setSecurityAlert({
        message: t('ialab.quiz.max_violations'), level: 3,
        onClose: () => { setSecurityAlert(null); onSecurityMaxOut?.(); },
      });
    },
    maxViolations: 3,
  });

  const preventDefaultEvent = useCallback((e) => e.preventDefault(), []);

  useEffect(() => {
    if (!isVisible || showScoreResult) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = (securityWarningCount || 0) + 1;
        setSecurityWarningCount(newCount);
        if (newCount >= MAX_SECURITY_WARNINGS) {
          setSecurityAlert({
            message: t('ialab.quiz.security_warning_3'), level: 3,
            onClose: () => { setSecurityAlert(null); onSecurityMaxOut?.(); },
          });
        } else {
          const warningKey = newCount === 1 ? 'ialab.quiz.security_warning_1' : 'ialab.quiz.security_warning_2';
          setSecurityAlert({ message: t(warningKey), level: newCount, onClose: () => setSecurityAlert(null) });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isVisible, showScoreResult, securityWarningCount, MAX_SECURITY_WARNINGS, t]);

  useEffect(() => {
    if (!isVisible || showScoreResult) return;
    const handleKeyDown = (e) => {
      if (e.shiftKey) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const tag = document.activeElement?.tagName?.toLowerCase();
      const role = document.activeElement?.role;
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space') {
        if (tag !== 'button' && tag !== 'input' && role !== 'button') {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      if (e.key === 'Enter') {
        if (tag !== 'button' && tag !== 'input' && tag !== 'textarea' && role !== 'button') {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, showScoreResult]);

  useEffect(() => {
    if (!isVisible || showScoreResult) return;
    const handleBeforePrint = () => {
      setPrintWarning(t('ialab.quiz.security_print'));
      setTimeout(() => setPrintWarning(null), 4000);
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, [isVisible, showScoreResult, t]);

  return {
    securityAlert, setSecurityAlert,
    printWarning, setPrintWarning,
    showSecurityMessage, securityMessage,
    showOverlay,
    preventDefaultEvent,
  };
}
