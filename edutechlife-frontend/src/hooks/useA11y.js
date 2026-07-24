import { useEffect, useState } from 'react';

/**
 * Custom accessibility hook for SmartBoard
 * Provides: reduced-motion detection, high-contrast mode, keyboard focus management
 */
export function useA11y() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Detect prefers-reduced-motion
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionMediaQuery.matches);

    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionMediaQuery.addEventListener('change', handleMotionChange);

    return () => motionMediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    // Detect prefers-color-scheme for dark mode
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(darkModeMediaQuery.matches);

    const handleDarkModeChange = (e) => setDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
  }, []);

  useEffect(() => {
    // Detect forced colors mode (Windows high contrast)
    const forcedColorsMediaQuery = window.matchMedia('(forced-colors: active)');
    setHighContrast(forcedColorsMediaQuery.matches);

    const handleForcedColorsChange = (e) => setHighContrast(e.matches);
    forcedColorsMediaQuery.addEventListener('change', handleForcedColorsChange);

    return () => forcedColorsMediaQuery.removeEventListener('change', handleForcedColorsChange);
  }, []);

  // Get motion-safe animation duration
  const getAnimationDuration = (normalDuration = 300) => {
    return reducedMotion ? 0 : normalDuration;
  };

  // Get motion-safe transition
  const getTransition = (normalTransition = 'all 0.3s ease') => {
    return reducedMotion ? 'none' : normalTransition;
  };

  // Get skip to main content function
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    reducedMotion,
    highContrast,
    darkMode,
    getAnimationDuration,
    getTransition,
    skipToMain,
  };
}

/**
 * Hook to announce messages to screen readers
 */
export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message, priority = 'polite') => {
    const region = document.querySelector(`[aria-live="${priority}"]`);
    if (region) {
      region.textContent = message;
    }
    setAnnouncement(message);
  };

  return { announce, announcement };
}

/**
 * Hook for keyboard focus management
 */
export function useFocusManagement() {
  const moveFocus = (direction = 'next') => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const focusedElement = document.activeElement;
    const focusedIndex = Array.from(focusableElements).indexOf(focusedElement);

    let nextIndex = focusedIndex;
    if (direction === 'next') {
      nextIndex = (focusedIndex + 1) % focusableElements.length;
    } else if (direction === 'prev') {
      nextIndex = focusedIndex === 0 ? focusableElements.length - 1 : focusedIndex - 1;
    }

    const nextElement = focusableElements[nextIndex];
    if (nextElement) {
      nextElement.focus();
    }
  };

  return { moveFocus };
}

/**
 * Accessibility class names builder
 */
export function getA11yClassNames(options = {}) {
  const {
    highContrast = false,
    darkMode = false,
    focusVisible = false,
  } = options;

  const classes = [];

  if (highContrast) {
    classes.push('high-contrast-mode');
  }

  if (darkMode) {
    classes.push('dark-mode');
  }

  if (focusVisible) {
    classes.push('focus-visible');
  }

  return classes.join(' ');
}

export default useA11y;
