import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08 }
  }
};

const IACourseGrid = ({ t, locale, navigate, isSignedIn, categories, courses, activeCategory, setActiveCategory, statusConfig }) => {
  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  return (
    <section id="cursos" className="pt-8 md:pt-12 pb-16 md:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#004B63] mb-4">
            {t('ialab.landing.catalog_title')}
          </h2>
          <p className="font-body text-lg text-[#475569] max-w-2xl mx-auto">
            {t('ialab.landing.catalog_subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'text-white'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#004B63]/10 hover:text-[#004B63]'
              }`}
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-[#004B63] rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon name={category.icon} className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{category.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
          >
            {filteredCourses.map((course, index) => {
              const config = statusConfig[course.status];
              const fullStars = Math.floor(course.rating);
              return (
                <motion.div
                  key={course.id}
                  variants={fadeInUp}
                  className="group relative bg-white border border-[#004B63]/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,75,99,0.06)] hover:shadow-[0_12px_40px_rgba(0,75,99,0.12)] transition-all duration-300 h-full flex flex-col"
                  whileHover={{ y: -6, scale: 1.015 }}
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
                        animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>

                    <div className="flex items-start justify-between relative z-10">
                      <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
                        {config.badgeText}
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
                        <Icon name="fa-clock" className="w-3 h-3 text-[#4DA8C4]" />
                        <span className="text-[11px] font-semibold text-white">{course.duration}</span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <motion.div
                        className="w-11 h-11 mb-2.5 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        <Icon name={course.icon} className="w-5 h-5 text-white" />
                      </motion.div>
                      <h3 className="font-display text-base font-bold text-white leading-tight line-clamp-2">
                        {course.title}
                      </h3>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-white/70 text-[11px]">
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
                      <span>{course.students} {t('ialab.landing.students_abbr')}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {course.features.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#004B63]/5 text-[#004B63] text-[10px] font-semibold rounded-md border border-[#004B63]/10">
                          {f}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-[#475569] mb-3 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-3 mb-3 text-xs text-[#004B63]">
                      <span className="flex items-center gap-1">
                        <Icon name="fa-book-open" className="w-3 h-3 text-[#4DA8C4]" />
                        {course.modules} {t('ialab.landing.modules_label')}
                      </span>
                      {course.hasCertificate && (
                        <span className="flex items-center gap-1">
                          <Icon name="fa-check-circle" className="w-3 h-3 text-emerald-500" />
                          {t('ialab.landing.certified_badge')}
                        </span>
                      )}
                      <span className="ml-auto px-2 py-0.5 bg-[#4DA8C4]/10 rounded text-[10px] font-bold text-[#004B63] uppercase tracking-wider">
                        {course.level}
                      </span>
                    </div>

                    {course.status === 'active' && course.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span>{t('ialab.landing.progress_label')}</span>
                          <span className="font-semibold text-[#004B63]">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#004B63]/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${course.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => isSignedIn ? navigate(course.route) : navigate('/login?returnTo=/ialab')}
                      className={`w-full py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden mt-auto ${config.buttonClass}`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <span className="relative">{config.buttonText(isSignedIn)}</span>
                      <motion.span
                        className="relative"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Icon name="fa-arrow-right" className="w-4 h-4" />
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default IACourseGrid;
