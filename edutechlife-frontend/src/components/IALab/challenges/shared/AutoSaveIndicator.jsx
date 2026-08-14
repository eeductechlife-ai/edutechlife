import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../../i18n/I18nProvider";

const AutoSaveIndicator = ({ response }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("saved");
  const prevRef = useRef(response);
  const timerRef = useRef(null);

  useEffect(() => {
    if (response !== prevRef.current) {
      prevRef.current = response;
      setStatus("saving");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStatus("saved");
      }, 400);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [response]);

  return (
    <div className="flex items-center gap-1.5">
      <AnimatePresence mode="wait">
        {status === "saving" ? (
          <motion.span
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-amber-500 dark:text-amber-400 flex items-center gap-1"
          >
            <Icon name="fa-spinner" className="text-[10px] animate-spin" />
            {t("ialab.challenge.shared.auto_save_saving")}
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
            {t("ialab.challenge.shared.auto_save_saved")}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

AutoSaveIndicator.propTypes = {
  response: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default AutoSaveIndicator;
