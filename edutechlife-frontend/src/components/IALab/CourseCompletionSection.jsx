import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

const COURSE_NAME = 'Introducción a la I.A Generativa';
const TOTAL_MODULES = 5;

const CourseCompletionSection = ({ hasCertificate, courseProgress, onViewCertificate }) => {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();

  if (!hasCertificate) {
    return null;
  }

  const requirements = [
    { label: t('course_completion.module_completed'), done: true, current: `${TOTAL_MODULES}/${TOTAL_MODULES}` },
    { label: t('course_completion.progress_80'), done: true, current: `${Math.max(Math.round(courseProgress), 80)}%` },
    { label: t('course_completion.cert_obtained'), done: true, current: t('course_completion.yes') }
  ];

  return (
    <div className="px-1 w-full">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate p-5 shadow-lg">
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
        
        {/* Icono de celebración animado */}
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={prefersReducedMotion ? {} : { type: 'spring', stiffness: 200, damping: 10 }}
          className="flex justify-center mb-4"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Icon name="fa-trophy" className="text-[#FFD166] text-2xl" />
          </div>
        </motion.div>

        {/* Mensaje de felicitación */}
        <div className="text-center relative z-10">
          <h3 className="text-sm font-bold text-white mb-1.5 tracking-wide">
            {t('course_completion.title')}
          </h3>
          <p className="text-xs text-white/85 leading-relaxed mb-4">
            {t('course_completion.message', { name: COURSE_NAME })}
          </p>

          {/* Checklist de logros */}
          <div className="space-y-1.5 mb-4 text-left">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Icon name="fa-check-circle" className="text-[#FFD166] text-xs flex-shrink-0" />
                <span className="text-[10px] text-white/90 flex-1">{req.label}</span>
                <span className="text-[10px] font-semibold text-white">{req.current}</span>
              </div>
            ))}
          </div>

          {/* Botón Ver Certificado */}
          <motion.button
            whileHover={prefersReducedMotion ? {} : { boxShadow: '0 0 20px rgba(255,209,102,0.3)' }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            onClick={onViewCertificate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-xl text-petroleum font-bold text-xs shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Icon name="fa-award" className="text-sm" />
            {t('course_completion.view_cert')}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CourseCompletionSection;
