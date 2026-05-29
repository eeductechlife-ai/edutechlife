import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/react';
import { Icon } from '../../utils/iconMapping.jsx';
import { categories, courses } from './data/landingPageData';
import { fadeInUp, staggerContainer } from './constants/landingAnimations';
import CourseCard from './CourseCard';
import { useTranslation } from '../../i18n/I18nProvider';

const CourseCatalog = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const { isSignedIn } = useAuth();

  const categoryLabels = {
    all: t('ialab.course_catalog.category_all'),
    'ia-generativa': t('ialab.course_catalog.category_generativa'),
    automatizaciones: t('ialab.course_catalog.category_automatizaciones'),
    productividad: t('ialab.course_catalog.category_productividad'),
    desarrollo: t('ialab.course_catalog.category_desarrollo'),
  };

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  return (
    <section id="cursos" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-petroleum mb-4">
            {t('ialab.course_catalog.title')}
          </h2>
          <p className="font-body text-lg text-slate-600 max-w-2xl mx-auto">
            {t('ialab.course_catalog.subtitle')}
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
                  : 'bg-slate-100 text-slate-600 hover:bg-petroleum/10 hover:text-petroleum'
              }`}
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-petroleum rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon name={category.icon} className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{categoryLabels[category.id]}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
          >
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} isSignedIn={isSignedIn} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CourseCatalog;
