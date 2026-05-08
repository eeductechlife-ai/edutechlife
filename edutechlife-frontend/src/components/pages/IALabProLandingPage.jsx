import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/react';
import { Icon } from '../../utils/iconMapping.jsx';
import NicoModern from '../Nico/NicoModern';

const IALabProLandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');

  const { scrollYProgress, scrollY } = useScroll();

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

  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    let ticking = false;
    const handleMouse = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

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
      status: 'active',
      rating: 4.8,
      students: '2,500+',
      features: ['Proyectos reales', 'Certificado IA', 'Soporte 24/7'],
      progress: 60
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
      status: 'coming-soon',
      rating: 4.9,
      students: '1,200+',
      features: ['Prompts complejos', 'APIs avanzadas', 'Automatización'],
      progress: 0
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
      status: 'coming-soon',
      rating: 4.7,
      students: '3,100+',
      features: ['Automatización', 'Plantillas GPT', 'Workflows'],
      progress: 0
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
      status: 'coming-soon',
      rating: 4.6,
      students: '890+',
      features: ['Zapier + IA', 'APIs sin código', 'Flujos multi-paso'],
      progress: 0
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
      status: 'coming-soon',
      rating: 4.9,
      students: '650+',
      features: ['APIs OpenAI', 'Frontend + IA', 'Despliegue'],
      progress: 0
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
      status: 'coming-soon',
      rating: 4.5,
      students: '1,800+',
      features: ['Contenido IA', 'SEO inteligente', 'Analítica'],
      progress: 0
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
      status: 'coming-soon',
      rating: 4.8,
      students: '950+',
      features: ['Deep Research', 'Podcasts IA', 'Fuentes'],
      progress: 0
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
      status: 'coming-soon',
      rating: 4.7,
      students: '1,400+',
      features: ['Planes clase IA', 'Evaluación IA', 'Personalización'],
      progress: 0
    },
  ];

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  const stats = [
    { icon: 'fa-brain', value: '8+', label: 'Cursos' },
    { icon: 'fa-clock', value: '200h+', label: 'Contenido' },
    { icon: 'fa-trophy', value: 'Certificados', label: 'Profesionales' },
    { icon: 'fa-headset', value: '24/7', label: 'Soporte' }
  ];

  const benefits = [
    { icon: 'fa-brain', title: '8+ Cursos', desc: 'Más de 200h de contenido con certificación profesional al completar cada curso' },
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
      bg: 'from-[#2A5F73] via-[#1E6B7A] to-[#154F5E]',
      badge: 'bg-white/20 backdrop-blur-sm text-white',
      badgeText: 'Próximamente',
      buttonText: 'Notificarme',
      buttonClass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
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

  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 7 },
    { size: 3, x: '85%', y: '15%', delay: 1.5, duration: 9 },
    { size: 5, x: '50%', y: '70%', delay: 0.8, duration: 8 },
    { size: 3, x: '25%', y: '80%', delay: 2, duration: 6 },
    { size: 4, x: '70%', y: '60%', delay: 0.5, duration: 10 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#66CCCC] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-[#004B63] via-[#007A94] to-[#004064] min-h-screen flex items-center"
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300334A' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Parallax Blobs with mouse tracking */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0,75,99,0.25) 0%, transparent 70%)',
            x: useTransform(scrollY, [0, 500], [0, -50]),
            y: mousePos.y * -30,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0,51,74,0.2) 0%, transparent 70%)',
            x: useTransform(scrollY, [0, 500], [0, 50]),
            y: mousePos.y * -20,
          }}
        />

        {/* Floating Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#00334A]/25"
            style={{ width: p.size * 2, height: p.size * 2, left: p.x, top: p.y }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        <div           className="relative w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-3 md:gap-4"
          >
            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-none text-center"
            >
              <span className="text-white">I.A Lab </span>
              <motion.span
                className="bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent"
                animate={{ textShadow: [
                  '0 0 20px rgba(77,168,196,0.2)',
                  '0 0 40px rgba(77,168,196,0.5)',
                  '0 0 20px rgba(77,168,196,0.2)'
                ]}}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Pro
              </motion.span>
            </motion.h1>

            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full"
            >
              <Icon name="fa-flask" className="w-4 h-4 text-[#00334A]" />
              <span className="text-sm font-semibold text-white tracking-wide">Laboratorio de Innovación Educativa</span>
            </motion.div>

            {/* TABLET — Hiperrealista con tracking 3D */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl relative"
            >
              {/* Contenedor con tracking de mouse para efecto parallax 3D */}
              <div
                className="relative w-full"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1200px',
                  willChange: 'transform',
                  transform: `rotateX(${(mousePos.y - 0.5) * -12}deg) rotateY(${(mousePos.x - 0.5) * 12}deg) scale(${1 + Math.abs(mousePos.x - 0.5) * 0.04})`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -18, 0, -10, 0],
                    scale: [1, 1.005, 0.998, 1],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glow pulsante detrás — más grande e intenso */}
                  <motion.div
                    className="absolute -inset-32 md:-inset-48 rounded-[100px]"
                    style={{ background: 'radial-gradient(circle, rgba(77,168,196,0.35) 0%, rgba(102,204,204,0.12) 30%, rgba(0,188,212,0.04) 60%, transparent 80%)' }}
                    animate={{ scale: [1, 1.2, 0.95, 1], opacity: [0.4, 1, 0.6, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Anillo tecnológico sutil — solo 1 */}
                  <motion.div
                    className="absolute -top-12 -left-12 w-48 h-48 rounded-full border border-[#4DA8C4]/10"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15], rotate: [0, 360] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Puntos flotantes sutiles — fuera del screen */}
                  {[1,2,3,4,5,6,7,8].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-[#00334A]/25"
                      style={{
                        width: i % 2 === 0 ? 3 : 2,
                        height: i % 2 === 0 ? 3 : 2,
                        left: `${5 + i * 11}%`,
                        top: `${i * 12 % 80}%`,
                      }}
                      animate={{ y: [0, -30 - i * 5, 0], opacity: [0.1, 0.5, 0.1] }}
                      transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                    />
                  ))}

                  {/* iPad Frame — Hiperrealista premium */}
                  <div className="relative group" style={{
                    padding: '14px',
                    borderRadius: '48px',
                    background: 'linear-gradient(165deg, #3E3E46 0%, #2E2E36 15%, #22222A 40%, #18181E 50%, #1E1E26 60%, #282830 75%, #3A3A42 85%, #42424A 100%)',
                    boxShadow: `
                      0 60px 150px rgba(0,0,0,0.7),
                      0 30px 60px rgba(0,0,0,0.5),
                      0 0 0 1px rgba(255,255,255,0.06),
                      inset 0 2px 0 rgba(255,255,255,0.12),
                      inset 0 -2px 0 rgba(0,0,0,0.4),
                      inset 0 5px 30px rgba(0,0,0,0.2)
                    `,
                  }}>
                    {/* Chamfered edge 3D — bisel completo */}
                    <div className="absolute inset-[4px] rounded-[44px] pointer-events-none z-50"
                      style={{ boxShadow: 'inset 0 1.5px 1px rgba(255,255,255,0.08), inset 0 -1.5px 1px rgba(0,0,0,0.2), inset 1.5px 0 0.5px rgba(255,255,255,0.03), inset -1.5px 0 0.5px rgba(0,0,0,0.1)' }}
                    />

                    {/* Light catch superior */}
                    <div className="absolute top-[4px] left-[18%] right-[18%] h-[1px] rounded-full pointer-events-none z-50"
                      style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%, transparent 100%)' }}
                    />

                    {/* Light catch lateral derecho */}
                    <div className="absolute right-[4px] top-[20%] bottom-[20%] w-[1px] rounded-full pointer-events-none z-50"
                      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }}
                    />

                    {/* Shimmer animado en el borde del frame */}
                    <div className="absolute inset-0 rounded-[48px] z-50 pointer-events-none overflow-hidden">
                      <motion.div
                        className="absolute inset-0 rounded-[48px]"
                        style={{
                          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.06) 44%, transparent 50%)',
                          backgroundSize: '200% 100%',
                        }}
                        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>

                    {/* Screen — con efecto de profundidad y bezel interno */}
                    <div className="relative rounded-[26px] overflow-hidden"
                      style={{
                        background: '#000',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 3px 12px rgba(0,0,0,0.6)',
                      }}
                    >
                      {/* Black border adhesive (gap between frame and glass) */}
                      <div className="absolute inset-[2px] rounded-[24px] z-15 pointer-events-none"
                        style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.8)' }}
                      />

                      {/* Iridescent animated overlay */}
                      <motion.div
                        className="absolute inset-0 rounded-[26px] z-20 pointer-events-none"
                        animate={{ background: [
                          'linear-gradient(135deg, rgba(77,168,196,0.18) 0%, transparent 40%, rgba(102,204,204,0.12) 60%, transparent 100%)',
                          'linear-gradient(135deg, rgba(102,204,204,0.15) 0%, transparent 40%, rgba(77,168,196,0.18) 60%, transparent 100%)',
                          'linear-gradient(135deg, rgba(0,188,212,0.12) 0%, transparent 40%, rgba(102,204,204,0.15) 60%, transparent 100%)',
                          'linear-gradient(135deg, rgba(77,168,196,0.18) 0%, transparent 40%, rgba(102,204,204,0.12) 60%, transparent 100%)',
                        ]}}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/45 via-transparent to-transparent z-10 pointer-events-none" />
                      {/* Scanner barrido — más visible */}
                      <motion.div
                        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#4DA8C4]/40 to-transparent z-20 pointer-events-none"
                        animate={{ top: ['-10%', '110%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      {/* Screen particles — más puntos */}
                      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                        {[1,2,3,4,5,6,7,8].map((i) => (
                          <motion.div key={i} className="absolute rounded-full bg-[#00334A]/20"
                            style={{
                              width: i % 3 === 0 ? 1.5 : 1,
                              height: i % 3 === 0 ? 1.5 : 1,
                              left: `${8 + i * 10.5}%`,
                              top: `${15 + (i * 11) % 70}%`,
                            }}
                            animate={{ y: [0, -25 - i * 3, 0], opacity: [0, 0.6, 0] }}
                            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                      {/* Hover shine effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)' }}
                      />
                      <div className="absolute inset-0 rounded-[26px] z-10 pointer-events-none"
                        style={{ boxShadow: 'inset 0 0 50px rgba(77,168,196,0.08), 0 0 30px rgba(77,168,196,0.05)' }}
                      />

                      {/* Indicador DEMO */}
                      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md border border-white/10">
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Demo</span>
                      </div>

                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-auto block"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'translateZ(0)',
                          WebkitTransform: 'translateZ(0)',
                          imageRendering: 'auto',
                        }}
                      >
                        <source src="/dashboard.mp4" type="video/mp4" />
                        <source src="/dashboard.mov" type="video/quicktime" />
                      </video>

                      {/* Glass reflection capa doble */}
                      <div className="absolute inset-0 z-25 pointer-events-none"
                        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 20%, transparent 65%, rgba(100,170,240,0.025) 100%)' }}
                      />
                      <div className="absolute inset-0 z-24 pointer-events-none"
                        style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.08) 100%)' }}
                      />
                    </div>

                    {/* Front-facing camera mejorada */}
                    <div className="absolute top-[26px] left-1/2 -translate-x-1/2 z-55">
                      <div className="w-[8px] h-[8px] rounded-full relative"
                        style={{
                          background: 'radial-gradient(circle at 38% 35%, #1E1E30 0%, #0A0A12 60%, #000 100%)',
                          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.08), 0 0 3px rgba(0,0,0,0.8), inset 0 0 1px rgba(255,255,255,0.05)',
                        }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full mx-auto mt-[1.5px]"
                          style={{ background: '#0E0E1A', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.05)' }}
                        />
                        {/* Lens flare sutil */}
                        <div className="absolute -top-[1px] -left-[1px] w-[3px] h-[2px] rounded-full"
                          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 100%)' }}
                        />
                      </div>
                    </div>

                    {/* Ambient occlusion shadow debajo del iPad */}
                    <div className="absolute -bottom-2 left-[5%] right-[5%] h-4 rounded-full pointer-events-none z-0"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)',
                        filter: 'blur(4px)',
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* TRUST BAR */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-4 md:mt-5"
            >
              <div className="flex flex-wrap justify-center items-center gap-5 md:gap-6 text-white text-sm md:text-base">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex -space-x-1.5">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-[#00334A] border-2 border-[#00334A]/50 flex items-center justify-center text-[9px] font-bold text-white">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span><strong className="text-white">4.200+</strong> <span className="text-white font-semibold">estudiantes</span></span>
                </div>
                <div className="h-7 w-px bg-white/10" />
                <div className="flex items-center gap-1 text-amber-400">
                  {[1,2,3,4,5].map((s) => (
                    <Icon key={s} name="fa-star" className="w-4 h-4" />
                  ))}
                  <span className="text-white ml-1.5"><strong className="text-white">4.8</strong></span>
                </div>
                <div className="h-7 w-px bg-white/10" />
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Icon name="fa-shield-check" className="w-4 h-4" />
                  <span className="text-white">Certificado profesional</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Smooth transition from hero to benefits */}
      <div className="h-6 bg-gradient-to-b from-[#004064] to-white" />

      {/* BENEFITS SECTION */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-[#F0F7FA] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #004B63 1px, transparent 1px), radial-gradient(circle at 75% 75%, #00BCD4 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
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
            <p className="font-body text-lg text-[#475569] max-w-2xl mx-auto">
              Una plataforma diseñada para tu éxito en la era de la inteligencia artificial
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-6 bg-white border border-[#004B63]/5 rounded-xl hover:border-[#4DA8C4]/30 hover:shadow-[0_0_30px_rgba(0,75,99,0.08)] transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute top-0 left-0 w-1 h-[25%] bg-gradient-to-b from-[#004B63] to-[#00BCD4] group-hover:h-full transition-all duration-500"
                />
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Icon name={benefit.icon} className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-display text-lg font-bold text-[#004B63] mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COURSES CATALOG */}
      <section id="cursos" className="py-16 md:py-24 bg-white">
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

          {/* Course Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
            >
              {filteredCourses.map((course, index) => {
                const config = statusConfig[course.status];
                const fullStars = Math.floor(course.rating);
                return (
                  <motion.div
                    key={course.id}
                    variants={fadeInUp}
                    className="group relative bg-white border border-[#004B63]/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                    whileHover={{ y: -6, scale: 1.015 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* Animated border gradient on hover */}
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

                    {/* Thumbnail Section */}
                    <div className={`relative h-44 bg-gradient-to-br ${config.bg} p-5 flex flex-col justify-between`}>
                      <div className="absolute inset-0 opacity-15">
                        <motion.div
                          className="absolute top-4 right-10 w-24 h-24 rounded-full blur-3xl"
                          style={{ background: 'rgba(0,188,212,0.3)' }}
                          animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </div>

                      {/* Top Row: Badge + Duration */}
                      <div className="flex items-start justify-between relative z-10">
                        <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
                          {config.badgeText}
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
                          <Icon name="fa-clock" className="w-3 h-3 text-[#4DA8C4]" />
                          <span className="text-[11px] font-semibold text-white">{course.duration}</span>
                        </div>
                      </div>

                      {/* Center: Icon + Title */}
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

                      {/* Social Proof overlay on thumbnail */}
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
                        <span>{course.students} est.</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Features */}
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

                      {/* Meta Row */}
                      <div className="flex items-center gap-3 mb-3 text-xs text-[#004B63]">
                        <span className="flex items-center gap-1">
                          <Icon name="fa-book-open" className="w-3 h-3 text-[#4DA8C4]" />
                          {course.modules} módulos
                        </span>
                        {course.hasCertificate && (
                          <span className="flex items-center gap-1">
                            <Icon name="fa-check-circle" className="w-3 h-3 text-emerald-500" />
                            Certificado
                          </span>
                        )}
                        <span className="ml-auto px-2 py-0.5 bg-[#4DA8C4]/10 rounded text-[10px] font-bold text-[#004B63] uppercase tracking-wider">
                          {course.level}
                        </span>
                      </div>

                      {/* Progress Bar (only for active courses) */}
                      {course.status === 'active' && course.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                            <span>Progreso</span>
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

                      {/* CTA Button */}
                      <motion.button
                        whileHover={config.disabled ? {} : { scale: 1.02 }}
                        whileTap={config.disabled ? {} : { scale: 0.98 }}
                        disabled={config.disabled}
                        onClick={() => !config.disabled && (isSignedIn ? navigate(course.route) : navigate('/login?returnTo=/ialab'))}
                        className={`w-full py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden mt-auto ${config.buttonClass}`}
                      >
                        {config.disabled ? (
                          <>
                            <Icon name="fa-bell" className="w-4 h-4 relative" />
                            <span className="relative">{config.buttonText}</span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <span className="relative">{config.buttonText}</span>
                            <motion.span
                              className="relative"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Icon name="fa-arrow-right" className="w-4 h-4" />
                            </motion.span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <NicoModern />
    </div>
  );
};

export default IALabProLandingPage;
