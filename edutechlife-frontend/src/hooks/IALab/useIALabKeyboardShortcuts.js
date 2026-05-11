import { useEffect } from 'react';
import { useIALabStore } from '../../store/ialabStore';

const useIALabKeyboardShortcuts = (onAction) => {
  useEffect(() => {
    const handler = (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if (isInput) return;

      if (e.key >= '1' && e.key <= '5' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        useIALabStore.getState().setActiveMod(parseInt(e.key));
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'e':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            onAction?.('OPEN_EVALUATION');
          }
          break;
        case 'r':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('ialab:openTopic'));
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onAction]);
};

export default useIALabKeyboardShortcuts;
