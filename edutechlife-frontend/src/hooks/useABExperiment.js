import { useEffect, useState } from "react";
import { useTranslation } from "../i18n/I18nProvider";

const EXPERIMENT_ID = "smartboard-copy-v1";
const VARIANTS = {
  CONTROL: "control",
  TREATMENT: "treatment",
};

export const useABExperiment = () => {
  const [variant, setVariant] = useState(null);
  const { locale } = useTranslation();

  useEffect(() => {
    // Get or create variant assignment (stored in localStorage)
    const storageKey = `experiment_${EXPERIMENT_ID}_variant`;
    let assignedVariant = localStorage.getItem(storageKey);

    if (!assignedVariant) {
      // 50/50 split
      assignedVariant =
        Math.random() < 0.5 ? VARIANTS.CONTROL : VARIANTS.TREATMENT;
      localStorage.setItem(storageKey, assignedVariant);

      // Track experiment assignment
      trackEvent("experiment_assigned", {
        experiment_id: EXPERIMENT_ID,
        variant: assignedVariant,
        locale,
        timestamp: new Date().toISOString(),
      });
    }

    setVariant(assignedVariant);
  }, [locale]);

  return {
    variant,
    isControl: variant === VARIANTS.CONTROL,
    isTreatment: variant === VARIANTS.TREATMENT,
    experimentId: EXPERIMENT_ID,
  };
};

export const trackEvent = (eventName, data = {}) => {
  try {
    if (window.gtag) {
      window.gtag("event", eventName, data);
    }
    console.log(`[Analytics] ${eventName}`, data);
  } catch (error) {
    console.error("Analytics error:", error);
  }
};

export const trackConversion = (conversionType, metadata = {}) => {
  const storageKey = `experiment_${EXPERIMENT_ID}_variant`;
  const variant = localStorage.getItem(storageKey) || "unknown";

  trackEvent("conversion", {
    experiment_id: EXPERIMENT_ID,
    variant,
    conversion_type: conversionType, // signup, demo, contact
    ...metadata,
    timestamp: new Date().toISOString(),
  });
};
