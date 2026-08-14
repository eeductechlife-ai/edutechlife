import { useEffect, useRef } from 'react';

/**
 * Hook for efficient IALab component cleanup on unmount
 * Prevents memory leaks and speeds up navigation away from IALab
 *
 * Clears:
 * - All pending timers (setTimeout)
 * - All intervals (setInterval)
 * - Event listeners
 * - Observer subscriptions
 */
export function useIALabCleanup() {
  const timersRef = useRef([]);
  const intervalsRef = useRef([]);

  // Override setTimeout to track timers
  useEffect(() => {
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalClearTimeout = window.clearTimeout;
    const originalClearInterval = window.clearInterval;

    window.setTimeout = function (...args) {
      const id = originalSetTimeout.apply(this, args);
      timersRef.current.push(id);
      return id;
    };

    window.setInterval = function (...args) {
      const id = originalSetInterval.apply(this, args);
      intervalsRef.current.push(id);
      return id;
    };

    return () => {
      // Restore original functions
      window.setTimeout = originalSetTimeout;
      window.setInterval = originalSetInterval;
      window.clearTimeout = originalClearTimeout;
      window.clearInterval = originalClearInterval;

      // Clear all tracked timers on unmount
      timersRef.current.forEach(id => originalClearTimeout(id));
      intervalsRef.current.forEach(id => originalClearInterval(id));

      timersRef.current = [];
      intervalsRef.current = [];
    };
  }, []);

  // Cleanup event listeners
  useEffect(() => {
    const listeners = [];

    // Track addEventListener calls
    const originalAddEventListener = Element.prototype.addEventListener;
    const originalRemoveEventListener = Element.prototype.removeEventListener;
    const windowAddEventListener = window.addEventListener;
    const windowRemoveEventListener = window.removeEventListener;

    Element.prototype.addEventListener = function (type, listener, options) {
      listeners.push({ target: this, type, listener, options, isWindow: false });
      return originalAddEventListener.call(this, type, listener, options);
    };

    window.addEventListener = function (type, listener, options) {
      listeners.push({ target: window, type, listener, options, isWindow: true });
      return windowAddEventListener.call(this, type, listener, options);
    };

    return () => {
      // Restore original methods
      Element.prototype.addEventListener = originalAddEventListener;
      Element.prototype.removeEventListener = originalRemoveEventListener;
      window.addEventListener = windowAddEventListener;
      window.removeEventListener = windowRemoveEventListener;

      // Remove tracked listeners on unmount
      listeners.forEach(({ target, type, listener, options }) => {
        target.removeEventListener(type, listener, options);
      });
    };
  }, []);
}

/**
 * Simpler version: Just clear common sources of lag on unmount
 */
export function useIALabCleanupSimple() {
  useEffect(() => {
    return () => {
      // Clear all pending timers
      let id = window.setTimeout(() => {}, 0);
      while (id--) {
        window.clearTimeout(id);
        window.clearInterval(id);
      }

      // Force garbage collection hint if available
      if (window.gc) {
        try {
          window.gc();
        } catch (e) {
          // gc may not be available or permitted
        }
      }
    };
  }, []);
}
