import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import { speakTextConversational, stopSpeech } from "../../../utils/speech";
import { useTranslation } from "../../../i18n/I18nProvider";
import { cn } from "../../forum/forumDesignSystem";
import LessonObjectives from "../LessonObjectives";

const OVAIntro = ({
  icon = "fa-brain",
  badge,
  title,
  description,
  audioText,
  onStart,
  startLabel,
  objectives,
}) => {
  const { t, locale } = useTranslation();
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    if (audioText && !started) {
      speakTextConversational(audioText, "valerio", () =>
        setAudioPlaying(false),
      );
      setAudioPlaying(true);
    }
  }, []);

  const handleStart = () => {
    stopSpeech();
    setAudioPlaying(false);
    setStarted(true);
    if (onStart) onStart();
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-corporate font-semibold text-xs uppercase tracking-wider border border-cyan-200 dark:border-cyan-700 mb-6">
          <Icon name={icon} className="text-sm" />
          <span>{badge || t("ialab.ova.badge")}</span>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-lg shadow-corporate/20">
            <Icon name={icon} className="text-white text-2xl sm:text-3xl" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-petroleum dark:text-white mb-4 font-montserrat leading-tight"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-6 leading-relaxed"
          >
            {description}
          </motion.p>
        )}

        {objectives && objectives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="max-w-lg mx-auto mb-8 text-left"
          >
            <LessonObjectives objectives={objectives} variant="start" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={handleStart}
            aria-label={startLabel || t("ialab.ova.start")}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-corporate to-petroleum text-white font-bold text-sm shadow-lg shadow-corporate/25 hover:shadow-xl hover:shadow-corporate/30 hover:-translate-y-0.5 transition-all"
          >
            <span className="flex items-center gap-2">
              <Icon name="fa-play" className="text-sm" />
              {startLabel || t("ialab.ova.start")}
            </span>
          </button>

          {audioText && (
            <button
              onClick={() => {
                if (audioPlaying) {
                  stopSpeech();
                  setAudioPlaying(false);
                } else {
                  speakTextConversational(audioText, "valerio", () =>
                    setAudioPlaying(false),
                  );
                  setAudioPlaying(true);
                }
              }}
              aria-label={
                audioPlaying
                  ? t("ialab.voice_reader.stop")
                  : t("ialab.voice_reader.listen")
              }
              className={cn(
                "px-6 py-3 rounded-2xl font-semibold text-xs sm:text-sm transition-all border-2",
                audioPlaying
                  ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-corporate",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon
                  name={audioPlaying ? "fa-stop-circle" : "fa-volume-up"}
                  className="text-sm"
                />
                {audioPlaying
                  ? t("ialab.voice_reader.stop")
                  : t("ialab.voice_reader.listen")}
              </span>
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

OVAIntro.propTypes = {
  icon: PropTypes.string,
  badge: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  audioText: PropTypes.string,
  onStart: PropTypes.func,
  startLabel: PropTypes.string,
  objectives: PropTypes.arrayOf(PropTypes.string),
};

export default OVAIntro;
