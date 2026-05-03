import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/react';
import { Icon } from '../../utils/iconMapping.jsx';

const IALabProLandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const categories = [
    { id: 'all', label: 'Todos', icon: 'fa-bolt' },
    { id: 'ia-generativa', label: 'IA Generativa', icon: 'fa-brain' },
    { id: 'automatizaciones', label: 'Automatizaciones', icon: 'fa-robot' },
    { id: 'productividad', label: 'Productividad', icon: 'fa-chart-line' },
    { id: 'desarrollo', label: 'Desarrollo', icon: 'fa-code' },
  ];

  const courses = [
    {
      id: 'ia-generativa',
      title: 'Introducción a la I.A Generativa',
      description: 'Domina la inteligencia artificial generativa con prompts, APIs, DeepResearch y NotebookLM.',
      category: 'ia-generativa',
      modules: 5,
      duration: '10h',
      level: 'Principiante',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-brain',
      status: 'active'
    },
    {
      id: 'prompt-avanzado',
      title: 'Prompt Engineering Avanzado',
      description: 'Técnicas avanzadas de prompting para maximizar resultados con modelos de IA.',
      category: 'ia-generativa',
      modules: 4,
      duration: '8h',
      level: 'Intermedio',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-wand-magic-sparkles',
      status: 'coming-soon'
    },
    {
      id: 'chatgpt-productividad',
      title: 'ChatGPT para Productividad',
      description: 'Automatiza tareas diarias y aumenta tu productividad con ChatGPT avanzado.',
      category: 'productividad',
      modules: 4,
      duration: '6h',
      level: 'Principiante',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-rocket',
      status: 'coming-soon'
    },
    {
      id: 'automatizaciones-ia',
      title: 'Automatizaciones con IA',
      description: 'Crea flujos de trabajo automatizados usando herramientas de IA avanzadas.',
      category: 'automatizaciones',
      modules: 5,
      duration: '12h',
      level: 'Intermedio',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-cog',
      status: 'coming-soon'
    },
    {
      id: 'desarrollo-ia',
      title: 'Desarrollo de Apps con IA',
      description: 'Construye aplicaciones inteligentes integrando APIs de modelos de lenguaje.',
      category: 'desarrollo',
      modules: 6,
      duration: '15h',
      level: 'Avanzado',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-laptop-code',
      status: 'coming-soon'
    },
    {
      id: 'ia-marketing',
      title: 'IA para Marketing Digital',
      description: 'Genera contenido, campañas y estrategias de marketing con inteligencia artificial.',
      category: 'productividad',
      modules: 4,
      duration: '8h',
      level: 'Principiante',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-chart-pie',
      status: 'coming-soon'
    },
    {
      id: 'notebooklm-experto',
      title: 'NotebookLM Experto',
      description: 'Domina NotebookLM para investigación, análisis y generación de contenido.',
      category: 'ia-generativa',
      modules: 3,
      duration: '6h',
      level: 'Intermedio',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-book-open',
      status: 'coming-soon'
    },
    {
      id: 'ia-educacion',
      title: 'IA para Educadores',
      description: 'Herramientas de IA para crear contenido educativo personalizado y efectivo.',
      category: 'productividad',
      modules: 4,
      duration: '8h',
      level: 'Principiante',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-graduation-cap',
      status: 'coming-soon'
    },
    {
      id: 'deep-research',
      title: 'Deep Research con IA',
      description: 'Técnicas de investigación profunda asistida por inteligencia artificial generativa.',
      category: 'ia-generativa',
      modules: 3,
      duration: '5h',
      level: 'Intermedio',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-search',
      status: 'coming-soon'
    },
    {
      id: 'ia-imagenes',
      title: 'Generación de Imágenes con IA',
      description: 'Crea imágenes profesionales y arte digital con modelos de generación de imágenes.',
      category: 'desarrollo',
      modules: 4,
      duration: '8h',
      level: 'Principiante',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-palette',
      status: 'coming-soon'
    },
    {
      id: 'ia-video',
      title: 'Creación de Video con IA',
      description: 'Producción de videos profesionales usando herramientas de inteligencia artificial.',
      category: 'desarrollo',
      modules: 4,
      duration: '10h',
      level: 'Intermedio',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-video',
      status: 'coming-soon'
    },
    {
      id: 'ia-audio',
      title: 'Audio y Voz con IA',
      description: 'Generación de audio, podcast y clonación de voz con inteligencia artificial.',
      category: 'desarrollo',
      modules: 3,
      duration: '6h',
      level: 'Principiante',
      hasCertificate: true,
      route: '/ialab',
      icon: 'fa-microphone',
      status: 'coming-soon'
    },
  ];

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  const stats = [
    { icon: 'fa-brain', value: '20+', label: 'Cursos' },
    { icon: 'fa-clock', value: '200h+', label: 'Contenido' },
    { icon: 'fa-trophy', value: 'Certificados', label: 'Profesionales' },
    { icon: 'fa-headset', value: '24/7', label: 'Soporte' }
  ];

  const benefits = [
    { icon: 'fa-trophy', title: 'Certificación', desc: 'Obtén certificados profesionales al completar cada curso' },
    { icon: 'fa-headset', title: 'Soporte 24/7', desc: 'Asistencia personalizada cuando la necesites' },
    { icon: 'fa-flask', title: '100% Práctico', desc: 'Aprende haciendo con proyectos reales y ejercicios' },
    { icon: 'fa-users', title: 'Comunidad', desc: 'Conecta con otros estudiantes y profesionales de IA' }
  ];

  const statusConfig = {
    active: {
      bg: 'from-[#004B63] via-[#00334A] to-[#0A1628]',
      badge: 'bg-[#66CCCC] text-white',
      badgeText: 'Disponible',
      buttonText: isSignedIn ? 'Comenzar' : 'Inscríbete',
      buttonClass: 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white hover:from-[#4DA8C4] hover:to-[#66CCCC] shadow-md hover:shadow-lg',
      disabled: false
    },
    'coming-soon': {
      bg: 'from-[#475569] via-[#334155] to-[#1E293B]',
      badge: 'bg-white/20 backdrop-blur-sm text-white',
      badgeText: 'Próximamente',
      buttonText: 'Próximamente',
      buttonClass: 'bg-[#F1F5F9] text-[#64748B] cursor-not-allowed',
      disabled: true
    },
    new: {
      bg: 'from-[#004B63] via-[#4DA8C4] to-[#66CCCC]',
      badge: 'bg-[#4DA8C4] text-white',
      badgeText: 'Nuevo',
      buttonText: 'Comenzar',
      buttonClass: 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white hover:from-[#4DA8C4] hover:to-[#66CCCC] shadow-md hover:shadow-lg',
      disabled: false
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004B63] via-[#00334A] to-[#0A1628]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#4DA8C4]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#66CCCC]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#004B63]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full"
            >
              <Icon name="fa-flask" className="w-4 h-4 text-[#66CCCC]" />
              <span className="text-sm font-semibold text-white tracking-wide">Laboratorio de Innovación Educativa</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              IA Lab{' '}
              <span className="bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent">
                Pro
              </span>
            </h1>

            <p className="font-body text-lg md:text-xl text-[#B2D8E5] max-w-3xl mx-auto mb-4 leading-relaxed">
              Un laboratorio para la transmisión del conocimiento donde aprenderás y desarrollarás habilidades que te servirán para interactuar y trabajar en la nueva era digital.
            </p>

            <p className="font-body text-base text-white/70 max-w-2xl mx-auto mb-10">
              Domina la Inteligencia Artificial Generativa y transforma tu futuro profesional con herramientas de vanguardia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => isSignedIn ? navigate('/ialab') : navigate('/login?returnTo=/ialab')}
                className="group px-8 py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              >
                <span>{isSignedIn ? 'Acceder al Curso' : 'Comenzar Curso'}</span>
                <Icon name="fa-arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/60 transition-all duration-300 flex items-center gap-2"
              >
                <Icon name="fa-arrow-left" className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-12 bg-gradient-to-r from-[#004B63] via-[#00334A] to-[#004B63]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Icon name={stat.icon} className="w-8 h-8 text-[#66CCCC] mx-auto mb-2" />
                <div className="font-display text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[#B2D8E5]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COURSES CATALOG */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#004B63] mb-4">
              Catálogo de Cursos
            </h2>
            <p className="font-body text-lg text-[#475569] max-w-2xl mx-auto">
              Explora nuestro catálogo de cursos y comienza a transformar tu futuro profesional
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-[#004B63] text-white shadow-md'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#004B63]/10 hover:text-[#004B63]'
                }`}
              >
                <Icon name={category.icon} className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Course Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCourses.map((course, index) => {
              const config = statusConfig[course.status];
              return (
                <motion.div
                  key={course.id}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white border border-[#004B63]/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#4DA8C4]/30 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className={`relative h-40 bg-gradient-to-br ${config.bg} flex items-center justify-center`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-8 w-20 h-20 bg-[#4DA8C4]/30 rounded-full blur-2xl" />
                      <div className="absolute bottom-4 right-8 w-28 h-28 bg-[#66CCCC]/30 rounded-full blur-2xl" />
                    </div>

                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold ${config.badge}`}>
                      {config.badgeText}
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/20 flex items-center gap-1">
                      <Icon name="fa-clock" className="w-3 h-3 text-[#4DA8C4]" />
                      <span className="text-xs font-semibold text-white">{course.duration}</span>
                    </div>

                    <div className="relative text-center px-4">
                      <div className="w-12 h-12 mx-auto mb-2 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-[#4DA8C4]/50 group-hover:scale-110 transition-all">
                        <Icon name={course.icon} className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-display text-sm font-bold text-white leading-tight line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4">
                    <p className="text-sm text-[#475569] mb-3 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-[#004B63]">
                        <Icon name="fa-book-open" className="w-3.5 h-3.5 text-[#4DA8C4]" />
                        {course.modules} módulos
                      </span>
                      {course.hasCertificate && (
                        <span className="flex items-center gap-1 text-xs text-[#004B63]">
                          <Icon name="fa-trophy" className="w-3.5 h-3.5 text-[#4DA8C4]" />
                          Certificado
                        </span>
                      )}
                      <span className="ml-auto px-2 py-0.5 bg-[#4DA8C4]/10 rounded text-xs font-semibold text-[#004B63]">
                        {course.level}
                      </span>
                    </div>

                    <button
                      disabled={config.disabled}
                      onClick={() => !config.disabled && (isSignedIn ? navigate(course.route) : navigate('/login?returnTo=/ialab'))}
                      className={`w-full py-2.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${config.buttonClass}`}
                    >
                      {config.disabled ? (
                        <>
                          <Icon name="fa-lock" className="w-4 h-4" />
                          <span>Próximamente</span>
                        </>
                      ) : (
                        <>
                          <span>{config.buttonText}</span>
                          <Icon name="fa-arrow-right" className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#004B63] mb-4">
              ¿Por qué IA Lab Pro?
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              Una plataforma diseñada para tu éxito en la era de la inteligencia artificial
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white border border-[#004B63]/5 rounded-xl hover:border-[#4DA8C4]/20 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center mb-4">
                  <Icon name={benefit.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#004B63] mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IALabProLandingPage;
