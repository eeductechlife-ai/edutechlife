import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/react';
import { Icon } from '../../utils/iconMapping.jsx';

const IALabProLandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  const handleStartCourse = (route = '/ialab') => {
    if (isSignedIn) {
      navigate(route);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const courses = [
    {
      id: 'curso-ia-generativa',
      title: 'Introducción a la I.A Generativa',
      description: 'Curso completo de 5 módulos diseñado para dominar la inteligencia artificial generativa y sus aplicaciones prácticas.',
      module: '5 MÓDULOS',
      duration: '10h',
      lessons: '3 lecciones por módulo',
      hasCertificate: true,
      isPractical: true,
      route: '/ialab',
      icon: 'fa-brain'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004B63] via-[#00334A] to-[#0A1628]">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#4DA8C4]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#66CCCC]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#004B63]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-[#4DA8C4]/20 backdrop-blur-sm border border-[#4DA8C4]/30 rounded-full"
            >
              <Icon name="fa-flask" className="w-4 h-4 text-[#4DA8C4]" />
              <span className="text-sm font-semibold text-[#4DA8C4] tracking-wide">Laboratorio de Innovación Educativa</span>
            </motion.div>

            {/* Main Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              IA Lab{' '}
              <span className="bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent">
                Pro
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-body text-lg md:text-xl text-[#B2D8E5] max-w-3xl mx-auto mb-4 leading-relaxed">
              Un laboratorio para la transmisión del conocimiento donde aprenderás y desarrollarás habilidades que te servirán para interactuar y trabajar en la nueva era digital.
            </p>

            <p className="font-body text-base text-[#4DA8C4]/80 max-w-2xl mx-auto mb-10">
              Domina la Inteligencia Artificial Generativa y transforma tu futuro profesional con herramientas de vanguardia.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isSignedIn ? (
                <button
                  onClick={() => handleStartCourse('/ialab')}
                  className="group px-8 py-3.5 bg-gradient-to-r from-[#004B63] via-[#4DA8C4] to-[#66CCCC] text-white font-semibold rounded-xl shadow-[0_4px_15px_rgba(0,75,99,0.3)] hover:shadow-[0_8px_25px_rgba(0,75,99,0.4)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Comenzar Curso</span>
                  <Icon name="fa-arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login?returnTo=/ialab')}
                  className="group px-8 py-3.5 bg-gradient-to-r from-[#004B63] via-[#4DA8C4] to-[#66CCCC] text-white font-semibold rounded-xl shadow-[0_4px_15px_rgba(0,75,99,0.3)] hover:shadow-[0_8px_25px_rgba(0,75,99,0.4)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Comenzar Curso</span>
                  <Icon name="fa-arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <button
                onClick={() => navigate('/')}
                className="px-8 py-3.5 border-2 border-[#4DA8C4]/50 text-[#4DA8C4] font-semibold rounded-xl hover:bg-[#4DA8C4]/10 transition-all duration-300 flex items-center gap-2"
              >
                <Icon name="fa-arrow-left" className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* COURSES GRID SECTION */}
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
              Cursos Disponibles
            </h2>
            <p className="font-body text-lg text-[#4DA8C4] max-w-2xl mx-auto">
              Explora nuestro catálogo de cursos y comienza a transformar tu futuro profesional
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                variants={fadeInUp}
                className="group relative bg-white border-2 border-[#004B63]/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,75,99,0.12)] hover:shadow-[0_12px_40px_rgba(0,75,99,0.18)] hover:border-[#4DA8C4]/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-[#004B63] via-[#00334A] to-[#0A1628] flex items-center justify-center overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-8 w-24 h-24 bg-[#4DA8C4]/30 rounded-full blur-2xl" />
                    <div className="absolute bottom-4 right-8 w-32 h-32 bg-[#66CCCC]/30 rounded-full blur-2xl" />
                  </div>

                  {/* Module badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#4DA8C4]/90 backdrop-blur-sm rounded-lg">
                    <span className="text-xs font-bold text-white">{course.module}</span>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="flex items-center gap-1.5">
                      <Icon name="fa-clock" className="w-3.5 h-3.5 text-[#4DA8C4]" />
                      <span className="text-xs font-semibold text-white">{course.duration}</span>
                    </div>
                  </div>

                  {/* Center icon */}
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-[#4DA8C4]/50 group-hover:scale-110 group-hover:bg-[#4DA8C4]/20 transition-all duration-300">
                      <Icon name={course.icon} className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white px-4 leading-tight">
                      {course.title}
                    </h3>
                  </div>
                </div>

                {/* Course Footer */}
                <div className="p-6">
                  {/* Description */}
                  <p className="font-body text-sm text-[#64748B] mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Badges */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Icon name="fa-book-open" className="w-4 h-4 text-[#4DA8C4]" />
                      <span className="text-xs font-medium text-[#004B63]">{course.lessons}</span>
                    </div>
                    {course.hasCertificate && (
                      <div className="flex items-center gap-1.5">
                        <Icon name="fa-trophy" className="w-4 h-4 text-[#4DA8C4]" />
                        <span className="text-xs font-medium text-[#004B63]">Certificado</span>
                      </div>
                    )}
                    {course.isPractical && (
                      <div className="flex items-center gap-1.5">
                        <Icon name="fa-flask" className="w-4 h-4 text-[#4DA8C4]" />
                        <span className="text-xs font-medium text-[#004B63]">Práctico</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {isSignedIn ? (
                    <button
                      onClick={() => handleStartCourse(course.route)}
                      className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold rounded-xl hover:from-[#4DA8C4] hover:to-[#66CCCC] shadow-[0_4px_15px_rgba(0,75,99,0.3)] hover:shadow-[0_8px_25px_rgba(0,75,99,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Comenzar Ahora</span>
                      <Icon name="fa-arrow-right" className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login?returnTo=/ialab')}
                      className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold rounded-xl hover:from-[#4DA8C4] hover:to-[#66CCCC] shadow-[0_4px_15px_rgba(0,75,99,0.3)] hover:shadow-[0_8px_25px_rgba(0,75,99,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Comenzar Ahora</span>
                      <Icon name="fa-arrow-right" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COURSE PREVIEW SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#F0F9FF]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#004B63] mb-4">
              Curso Destacado
            </h2>
            <p className="font-body text-lg text-[#4DA8C4] max-w-2xl mx-auto">
              Comienza tu viaje en el mundo de la Inteligencia Artificial con nuestro curso completo
            </p>
          </motion.div>

          {/* Course Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative bg-white border-2 border-[#004B63]/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,75,99,0.12)] hover:shadow-[0_12px_40px_rgba(0,75,99,0.18)] transition-all duration-300 group">
              {/* Video Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-[#004B63] via-[#00334A] to-[#0A1628] flex items-center justify-center overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-8 w-24 h-24 bg-[#4DA8C4]/30 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 right-8 w-32 h-32 bg-[#66CCCC]/30 rounded-full blur-2xl" />
                </div>

                {/* Course badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#4DA8C4]/90 backdrop-blur-sm rounded-lg">
                  <span className="text-xs font-bold text-white">5 MÓDULOS</span>
                </div>

                {/* Duration badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-center gap-1.5">
                    <Icon name="fa-clock" className="w-3.5 h-3.5 text-[#4DA8C4]" />
                    <span className="text-xs font-semibold text-white">10h</span>
                  </div>
                </div>

                {/* Center content */}
                <div className="relative text-center">
                  {/* Play button */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-[#4DA8C4]/50 group-hover:scale-110 group-hover:bg-[#4DA8C4]/20 transition-all duration-300">
                    <Icon name="fa-play" className="w-6 h-6 text-white ml-1" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">
                    Introducción a la I.A Generativa
                  </h3>
                  <p className="font-body text-sm text-[#4DA8C4]">
                    Curso completo con certificación
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="fa-book-open" className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="text-sm font-medium text-[#004B63]">5 módulos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="fa-trophy" className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="text-sm font-medium text-[#004B63]">Certificado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="fa-graduation-cap" className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="text-sm font-medium text-[#004B63]">Práctico</span>
                  </div>
                </div>

                {/* CTA Button */}
                {isSignedIn ? (
                  <button
                    onClick={() => handleStartCourse('/ialab')}
                    className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold rounded-xl hover:from-[#4DA8C4] hover:to-[#66CCCC] shadow-[0_4px_15px_rgba(0,75,99,0.3)] hover:shadow-[0_8px_25px_rgba(0,75,99,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Comenzar Ahora</span>
                    <Icon name="fa-arrow-right" className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login?returnTo=/ialab')}
                    className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold rounded-xl hover:from-[#4DA8C4] hover:to-[#66CCCC] shadow-[0_4px_15px_rgba(0,75,99,0.3)] hover:shadow-[0_8px_25px_rgba(0,75,99,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Comenzar Ahora</span>
                    <Icon name="fa-arrow-right" className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#004B63] via-[#00334A] to-[#0A1628] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-64 h-64 bg-[#4DA8C4]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#66CCCC]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para Transformar tu Futuro?
            </h2>
            <p className="font-body text-lg text-[#B2D8E5] mb-10 max-w-2xl mx-auto">
              Únete a IA Lab Pro y descubre cómo la Inteligencia Artificial puede potenciar tus habilidades y abrirte nuevas oportunidades profesionales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isSignedIn ? (
                <button
                  onClick={() => handleStartCourse('/ialab')}
                  className="group px-10 py-4 bg-white text-[#004B63] font-bold rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Acceder a IA Lab Pro</span>
                  <Icon name="fa-arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login?returnTo=/ialab')}
                  className="group px-10 py-4 bg-white text-[#004B63] font-bold rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Comenzar Ahora</span>
                  <Icon name="fa-arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default IALabProLandingPage;
