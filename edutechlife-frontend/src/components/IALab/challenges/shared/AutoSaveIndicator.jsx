import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';

const AutoSaveIndicator = ({ response }) => {
  const [status, setStatus] = useState('saved');
  const prevRef = useRef(response);
  const timerRef = useRef(null);

  useEffect(() => {
    if (response !== prevRef.current) {
      prevRef.current = response;
      setStatus('saving');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStatus('saved');
      }, 400);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [response]);

  return (
    <div className="flex items-center gap-1.5">
      <AnimatePresence mode="wait">
        {status === 'saving' ? (
          <motion.span
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-amber-500 dark:text-amber-400 flex items-center gap-1"
          >
            <Icon name="fa-spinner" className="text-[10px] animate-spin" />
            Saving...
          </motion.span>
        ) : (
          <motion.span
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1"
          >
            <Icon name="fa-check" className="text-[10px]" />
            Saved
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoSaveIndicator;
