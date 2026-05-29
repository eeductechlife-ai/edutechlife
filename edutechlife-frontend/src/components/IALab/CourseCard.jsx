import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../utils/iconMapping.jsx';
import { statusConfig } from './data/landingPageData';
import { fadeInUp } from './constants/landingAnimations';
import ErrorBoundary from '../../components/forum/ErrorBoundary';
import { useTranslation } from '../../i18n/I18nProvider';

const CourseCard = ({ course, isSignedIn }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const config = statusConfig[course.status];
  const fullStars = Math.floor(course.rating);
  const badgeLabels = {
    active: t('ialab.course_card.status_active'),
    'coming-soon': t('ialab.course_card.status_coming_soon'),
    new: t('ialab.course_card.status_new'),
  };
  const getButtonText = (status, signedIn) => {
    const map = {
      active: signedIn ? t('ialab.course_card.btn_start') : t('ialab.course_card.btn_enroll'),
      'coming-soon': t('ialab.course_card.btn_explore'),
      new: t('ialab.course_card.btn_start'),
    };
    return map[status] || t('ialab.course_card.btn_start');
  };

  return (
    <ErrorBoundary>
    <motion.div
      variants={fadeInUp}
      className="group relative bg-white border border-petroleum/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-fit"
      whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.015 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          padding: '2px',
          background: 'linear-gradient(135deg, #004B63, #00BCD4, #66CCCC, #004B63)',
          backgroundSize: '300% 300%',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className={`relative h-44 bg-gradient-to-br ${config.bg} p-5 flex flex-col justify-between`}>
        <div className="absolute inset-0 opacity-15">
          <motion.div
            className="absolute top-4 right-10 w-24 h-24 rounded-full blur-3xl"
            style={{ background: 'rgba(0,188,212,0.3)' }}
            animate={shouldReduceMotion ? {} : { x: [0, 15, 0], y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className={`px-2.5 py-1 rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${config.badge}`}>
            {badgeLabels[course.status]}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
            <Icon name="fa-clock" className="w-3 h-3 text-primary-light" />
            <span className="text-[11px] md:text-xs font-semibold text-white">{course.duration}</span>
          </div>
        </div>

        <div className="relative z-10">
          <motion.div
            className="w-11 h-11 mb-2.5 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20"
            whileHover={shouldReduceMotion ? {} : { scale: 1.15, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Icon name={course.icon} className="w-5 h-5 text-white" />
          </motion.div>
          <h3 className="font-display text-base font-bold text-white leading-tight line-clamp-2">
            {course.title}
          </h3>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/70 text-[11px] md:text-xs">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <Icon
                key={s}
                name="fa-star"
                className={`w-3 h-3 ${s <= fullStars ? 'text-amber-400' : 'text-white/20'}`}
              />
            ))}
          </div>
          <span className="font-semibold text-white text-xs">{course.rating}</span>
          <span className="text-white/50">•</span>
          <span>{t('ialab.course_card.students', { count: course.students })}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {course.features.map((f, i) => (
            <span key={i} className="px-2 py-0.5 bg-petroleum/5 text-petroleum text-[10px] md:text-xs font-semibold rounded-md border border-petroleum/10">
              {f}
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-3 mb-3 text-xs text-petroleum">
          <span className="flex items-center gap-1">
            <Icon name="fa-book-open" className="w-3 h-3 text-primary-light" />
            {t('ialab.course_card.modules', { count: course.modules })}
          </span>
          {course.hasCertificate && (
            <span className="flex items-center gap-1">
              <Icon name="fa-check-circle" className="w-3 h-3 text-emerald-500" />
              {t('ialab.course_card.certificate')}
            </span>
          )}
          <span className="ml-auto px-2 py-0.5 bg-primary-light/10 rounded text-[10px] md:text-xs font-bold text-petroleum uppercase tracking-wider">
            {course.level}
          </span>
        </div>

        {course.status === 'active' && course.progress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] md:text-xs text-slate-500 mb-1">
              <span>{t('ialab.course_card.progress')}</span>
              <span className="font-semibold text-petroleum">{course.progress}%</span>
            </div>
            <div className="h-1.5 bg-petroleum/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${course.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
          onClick={() => isSignedIn ? navigate(course.route) : navigate('/login?returnTo=/ialab')}
          className={`w-full py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden mt-auto ${config.buttonClass}`}
        >
          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <span className="relative">{getButtonText(course.status, isSignedIn)}</span>
          {!shouldReduceMotion && (
          <motion.span
            className="relative"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Icon name="fa-arrow-right" className="w-4 h-4" />
          </motion.span>
          )}
          {shouldReduceMotion && (
            <span className="relative">
              <Icon name="fa-arrow-right" className="w-4 h-4" />
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
    </ErrorBoundary>
  );
};

export default CourseCard;
