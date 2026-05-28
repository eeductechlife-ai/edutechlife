import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import FloatingParticles from './FloatingParticles';
import MagneticButton from './MagneticButton';
import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../i18n/I18nProvider';

const useAnimatedCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [start, target, duration]);
  return count;
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const childVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 15 } },
};

const VAQ_STYLES = [
  { key: 'visual', icon: 'fa-eye', title: 'Visual', color: '#4DA8C4', description: 'Aprende mejor viendo: imágenes, videos, mapas mentales y diagramas. Su cerebro procesa la información a través del canal visual con alta retención.', traits: ['Mapas mentales', 'Videos educativos', 'Esquemas de color', 'Flashcards con imágenes'] },
  { key: 'auditivo', icon: 'fa-headphones', title: 'Auditivo', color: '#66CCCC', description: 'Aprende mejor escuchando: podcasts, debates, explicaciones en voz alta. Retiene información a través de conversaciones y audio.', traits: ['Podcasts educativos', 'Debates guiados', 'Audiolibros', 'Grabaciones de clase'] },
  { key: 'kinestesico', icon: 'fa-hand-pointer', title: 'Kinestésico', color: '#FF6B9D', description: 'Aprende mejor haciendo: experimentos, movimiento, proyectos manuales. Necesita tocar y experimentar para comprender.', traits: ['Experimentos prácticos', 'Juegos de rol', 'Pausas activas', 'Proyectos manuales'] },
];

const PRICING_PLANS = [
  { name: 'Básico', price: '$30.000', period: '/mes', popular: false, features: ['Diagnóstico VAK completo', 'Plan de estudio personalizado', 'Acceso a recursos académicos', 'Sistema de puntos y recompensas', 'Reportes semanales', 'Coach virtual Dani', 'Soporte por email'] },
  { name: 'Premium', price: '$50.000', period: '/mes', popular: true, features: ['Todo lo del plan Básico', 'Coach humano dedicado', 'Reportes en tiempo real', 'Actividades avanzadas', 'Talleres de tecnología', 'Sesiones mensuales con experto', 'Prioridad en soporte', 'Certificados de logro'] },
];

const TESTIMONIALS = [
  { name: 'Ana Lucía Romero', role: 'Mamá de Santiago, 10 años', rating: 5, text: 'Al principio me daba miedo que mi hijo pasara más tiempo en pantallas, pero SmartBoard es diferente. Dani lo guía paso a paso, y en dos meses sus notas en matemáticas pasaron de 3.5 a 4.8. Lo mejor es que ya no tengo que rogarle para que estudie — él solito abre la plataforma.' },
  { name: 'Carlos Rodríguez', role: 'Papá de Valentina, 12 años', rating: 5, text: 'El diagnóstico VAK nos cambió la perspectiva. Descubrimos que Valentina es kinestésica — toda su vida le dijeron que era distraída, pero en realidad necesita aprender haciendo. Con SmartBoard, sus trabajos de ciencias son los mejores de la clase y hasta ayudó a sus compañeros con un experimento.' },
  { name: 'Laura Méndez', role: 'Mamá de Mateo, 8 años', rating: 5, text: 'Trabajo hasta tarde y siempre vivía angustiada por las tareas de Mateo. SmartBoard me dio tranquilidad. Recibo un reporte cada semana con su avance, y si algo preocupa a su coach, me llega una alerta al celular. Ya no llego a casa con miedo de revisar la mochila.' },
  { name: 'Fernando Morales', role: 'Papá de Camila, 14 años', rating: 5, text: 'Camila estaba perdiendo el interés en el colegio, típico de la edad. Desde que usa SmartBoard su motivación cambió por completo. Habla con Dani sobre tecnología, y el sistema de puntos la mantiene enfocada en sus metas. Hasta pidió hacer cursos de programación por su cuenta.' },
  { name: 'Patricia Vega', role: 'Mamá de Tomás y Lucía, 9 y 11 años', rating: 5, text: 'Tener dos hijos en edad escolar era una locura: tareas distintas, horarios, materias, exámenes. SmartBoard los tiene a ambos organizados con su propio plan de estudio. Yo solo recibo los reportes y veo cómo avanzan cada uno a su ritmo. Mi nivel de estrés se redujo drásticamente.' },
];

const BENEFICIOS_HIJO = [
  { icon: 'fa-brain', title: 'Plan personalizado', desc: 'Creamos una ruta de aprendizaje única basada en su estilo VAK. Cada actividad está diseñada para cómo él o ella aprende mejor.' },
  { icon: 'fa-laptop-code', title: 'Habilidades tecnológicas', desc: 'Desarrolla competencias digitales reales mientras estudia: pensamiento computacional, IA generativa y creatividad digital.' },
  { icon: 'fa-star', title: 'Puntos y recompensas', desc: 'Cada actividad completada le da puntos que puede canjear por premios reales. La motivación se convierte en un juego.' },
  { icon: 'fa-robot', title: 'Coach virtual Dani', desc: 'Un tutor con IA disponible 24/7 que lo guía, responde sus preguntas y lo anima en cada paso.' },
  { icon: 'fa-user-graduate', title: 'Coach humano experto', desc: 'Un profesional real que supervisa su progreso y ajusta su plan según su evolución académica y emocional.' },
  { icon: 'fa-book-open', title: 'Recursos premium', desc: 'Acceso ilimitado a guías, videos, ejercicios interactivos y materiales seleccionados por expertos en educación.' },
];

const TRANQUILIDAD = [
  { icon: 'fa-chart-line', title: 'Reportes en tiempo real', desc: '¿Está conectado? ¿Cuánto estudió hoy? ¿En qué tema va? Recibe datos actualizados al instante desde tu celular.' },
  { icon: 'fa-clock', title: 'Recupera tu tiempo', desc: 'No más horas ayudando con tareas que no entiendes. Nuestros coaches se encargan del proceso académico.' },
  { icon: 'fa-shield-halved', title: 'Tu hijo en buenas manos', desc: 'Profesionales supervisan su progreso. Tú recibes alertas solo cuando es necesario tu apoyo.' },
  { icon: 'fa-face-smile', title: 'Adiós al estrés escolar', desc: 'Se acabaron las discusiones por las tareas. Tu hijo estudia motivado y recuperas la armonía en casa.' },
];

const PASOS = [
  { step: '01', icon: 'fa-user-plus', title: 'Registro', desc: 'Creas una cuenta en 2 minutos. Solo necesitas sus datos básicos y elegir tu plan.' },
  { step: '02', icon: 'fa-chart-bar', title: 'Diagnóstico VAK', desc: 'Tu hijo hace un test interactivo de 10 preguntas. En 3 minutos sabemos cómo aprende.' },
  { step: '03', icon: 'fa-route', title: 'Plan personalizado', desc: 'Nuestra IA crea una ruta de aprendizaje a su medida con actividades, horarios y recursos según su estilo.' },
  { step: '04', icon: 'fa-rocket', title: 'Aprendizaje activo', desc: 'Tu hijo empieza a estudiar con Dani y nuestros coaches. Tú recibes reportes de su progreso.' },
];

const FAQ_ITEMS = [
  { q: '¿Desde qué edad pueden usar SmartBoard?', a: 'SmartBoard está diseñado para niños entre 8 y 16 años. Nuestro sistema adapta el contenido y las actividades según la edad y el estilo de aprendizaje de cada estudiante.' },
  { q: '¿Necesito estar presente mientras mi hijo estudia?', a: 'No. SmartBoard está diseñado para que tu hijo aprenda de forma autónoma con el acompañamiento de Dani (coach virtual) y nuestro equipo de coaches humanos. Tú recibes reportes periódicos de su progreso.' },
  { q: '¿Cómo funciona el diagnóstico VAK?', a: 'El diagnóstico VAK es un test interactivo de 10 preguntas que identifica el estilo de aprendizaje predominante de tu hijo: Visual, Auditivo o Kinestésico. A partir de los resultados, creamos un plan de estudio totalmente personalizado.' },
  { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. No hay permanencia forzada. Puedes cancelar tu suscripción cuando quieras sin penalización.' },
];

const SmartBoardLandingInfo = ({ onBack, onNavigate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });

  const handleCta = useCallback(() => {
    if (onNavigate) onNavigate('/sign-up/smartboard');
    else navigate('/sign-up/smartboard');
  }, [onNavigate, navigate]);

  const statStart = heroInView;
  const countStudents = useAnimatedCounter(2500, 1800, statStart);
  const countImprovement = useAnimatedCounter(94, 2000, statStart);
  const countHours = useAnimatedCounter(12000, 2200, statStart);

  return (
    <div className="w-full bg-white overflow-hidden">
      {onBack && (
        <button
          onClick={() => onBack()}
          aria-label={t('smartboard.back')}
          className="fixed top-6 left-6 z-50 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-petroleum/10 shadow-premium flex items-center justify-center text-petroleum hover:bg-petroleum hover:text-white transition-all duration-300"
        >
          <Icon name="fa-arrow-left" className="text-xs" />
        </button>
      )}

      <section ref={heroRef} className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#F0F9FF] to-white">
        <FloatingParticles count={30} className="z-0" />
        <div className="absolute top-[15%] left-[5%] w-56 h-56 bg-primary-light/8 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[25%] right-[5%] w-64 h-64 bg-mint/8 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-[50%] left-[40%] w-48 h-48 bg-petroleum/5 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="badge-clay inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-petroleum/5 border border-petroleum/10 mb-6"
            >
              <Icon name="fa-flask-vial" className="text-petroleum text-xs" aria-hidden="true" />
              <span className="text-[11px] font-semibold text-petroleum uppercase tracking-wider">{t('smartboard.landing_badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-petroleum tracking-tight leading-[1.05] mb-4 max-w-4xl"
            >
              {t('smartboard.landing_hero_line1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-corporate to-petroleum pr-1">{t('smartboard.landing_hero_line2')}</span>
              <br />
              {t('smartboard.landing_hero_line3')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl mb-6"
            >
              {t('smartboard.landing_hero_desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-6"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-petroleum">+{countStudents.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">{t('smartboard.landing_stat_students')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-primary-light">{countImprovement}%</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">{t('smartboard.landing_stat_improvement')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-mint">+{countHours.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">{t('smartboard.landing_stat_hours')}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <MagneticButton
                onClick={handleCta}
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-7 sm:px-10 py-3.5 rounded-full text-sm sm:text-base font-bold bg-primary-light text-white shadow-lg hover:bg-petroleum hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-sweep skew-x-[-20deg]" />
                <span className="text-white relative z-10 font-semibold">{t('smartboard.landing_cta_try')}</span>
                <Icon name="fa-arrow-right" className="text-white/90 relative z-10" aria-hidden="true" />
              </MagneticButton>
              <MagneticButton
                onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center justify-center gap-2.5 px-7 sm:px-10 py-3.5 rounded-full text-sm sm:text-base font-bold bg-transparent border-2 border-petroleum text-petroleum hover:bg-petroleum hover:text-white transition-all duration-300"
              >
                <Icon name="fa-play-circle" className="text-petroleum group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                <span className="font-semibold">{t('smartboard.landing_cta_how')}</span>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-white py-12 lg:py-16">
        <div className="absolute top-[30%] right-[10%] w-48 h-48 bg-mint/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] left-[5%] w-44 h-44 bg-primary-light/6 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <span className="badge-clay inline-block px-3.5 py-1 rounded-full bg-mint/10 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3">
              {t('smartboard.landing_what_badge')}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
              {t('smartboard.landing_what_title_line1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum pr-1">{t('smartboard.landing_what_title_line2')}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('smartboard.landing_what_desc1') }} />
              <p className="text-sm text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('smartboard.landing_what_desc2') }} />
              <div className="flex flex-wrap gap-2 pt-1">
                {[t('smartboard.landing_tag_adaptive_ai'), t('smartboard.landing_tag_real_coaches'), t('smartboard.landing_tag_scientific_vak'), t('smartboard.landing_tag_live_reports')].map((tag) => (
                  <span key={tag} className="badge-clay px-4 py-2 rounded-full bg-petroleum/5 text-petroleum text-sm font-semibold border border-petroleum/10">{tag}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative group flex flex-col"
            >
              <div className="rounded-2xl bg-petroleum/5 border border-petroleum/10 overflow-hidden relative shadow-premium-lg">
                <div className="aspect-video w-full bg-petroleum-dark/10 flex items-center justify-center">
                  <video
                    className="w-full h-full object-contain"
                    src="/smarboard.mov"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                  />
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-[11px] font-bold text-petroleum flex items-center gap-1.5 pointer-events-none shadow-premium">
                  <Icon name="fa-flask-vial" className="text-[10px]" aria-hidden="true" />
                  SmartBoard
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-petroleum/80 backdrop-blur-sm text-[11px] font-medium text-white/90 flex items-center gap-1.5 pointer-events-none">
                  <Icon name="fa-play" className="text-[9px]" aria-hidden="true" />
                  Video demo
                </div>
              </div>
              <div className="mt-4 card-clay-white bg-white rounded-xl shadow-premium border border-petroleum/10 p-3 self-end">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Icon name="fa-check-circle" className="text-success text-sm" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-petroleum">{t('smartboard.landing_kids_count')}</p>
                    <p className="text-[11px] text-slate-500">{t('smartboard.landing_kids_learning')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-gradient-to-b from-petroleum/3 to-white py-12 lg:py-16">
        <FloatingParticles count={12} className="z-0" />
        <div className="absolute top-[10%] right-[15%] w-40 h-40 bg-primary-light/10 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <span className="badge-clay inline-block px-3.5 py-1 rounded-full bg-[#FFD166]/20 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3">
              {t('smartboard.landing_vak_badge')}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight mb-3">
              {t('smartboard.landing_vak_title')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint pr-1">{t('smartboard.landing_vak_title_highlight')}</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
              {t('smartboard.landing_vak_desc')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5"
          >
            {VAQ_STYLES.map((style) => (
              <motion.div
                key={style.key}
                variants={cardVariants}
                animate={{
                  y: [0, -5, 0],
                  transition: { duration: 3.5 + VAQ_STYLES.indexOf(style) * 0.3, delay: VAQ_STYLES.indexOf(style) * 0.2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="group relative card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium hover:shadow-premium-lg transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(135deg, ${style.color}, ${style.color}88)` }} aria-hidden="true" />
                <div className="p-5 lg:p-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, ${style.color}15, ${style.color}08)` }}>
                    <Icon name={style.icon} className="text-xl" style={{ color: style.color }} aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-petroleum mb-2">{style.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{style.description}</p>
                  <div className="space-y-1.5">
                    {style.traits.map((trait) => (
                      <div key={trait} className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: style.color }} aria-hidden="true" />
                        <span>{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-white py-12 lg:py-16">
        <div className="absolute top-[20%] left-[5%] w-56 h-56 bg-primary-light/6 rounded-full blur-[80px]" />
        <div className="absolute bottom-[10%] right-[10%] w-48 h-48 bg-mint/6 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <span className="badge-clay inline-block px-3.5 py-1 rounded-full bg-primary-light/10 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3">
              {t('smartboard.landing_benefits_badge')}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
              {t('smartboard.landing_benefits_title_line1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum pr-1">{t('smartboard.landing_benefits_title_line2')}</span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {BENEFICIOS_HIJO.map((item) => (
              <motion.div
                key={item.title}
                variants={childVariant}
                className="group relative card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium hover:shadow-premium-lg transition-all duration-300 p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petroleum/10 to-primary-light/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={item.icon} className="text-base text-petroleum" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-petroleum mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-gradient-to-b from-petroleum to-petroleum-dark py-12 lg:py-16">
        <div className="absolute top-[10%] right-[10%] w-56 h-56 bg-primary-light/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-48 h-48 bg-mint/10 rounded-full blur-[80px]" />
        <FloatingParticles count={15} className="z-0" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <span className="badge-clay inline-block px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold uppercase tracking-widest mb-3">
              {t('smartboard.landing_tranquility_badge')}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
              {t('smartboard.landing_tranquility_title_line1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint pr-1">{t('smartboard.landing_tranquility_title_line2')}</span>
            </h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-2xl mx-auto">
              {t('smartboard.landing_tranquility_desc')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {TRANQUILIDAD.map((item) => (
              <motion.div
                key={item.title}
                variants={childVariant}
                className="group relative card-clay bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/12 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light/30 to-mint/20 flex items-center justify-center mb-3">
                  <Icon name={item.icon} className="text-base text-mint" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3">
              <Icon name="fa-quote-left" className="text-primary-light text-sm flex-shrink-0" aria-hidden="true" />
              <p className="text-white/80 text-xs italic max-w-lg">
                {t('smartboard.landing_quote')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="como-funciona" className="relative w-full overflow-hidden bg-white py-12 lg:py-16 scroll-mt-20">
        <div className="absolute top-[30%] left-[10%] w-44 h-44 bg-primary-light/6 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-mint/6 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <span className="badge-clay inline-block px-3.5 py-1 rounded-full bg-mint/10 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3">
              {t('smartboard.landing_how_badge')}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
              {t('smartboard.landing_how_title_line1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum pr-1">{t('smartboard.landing_how_title_line2')}</span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {PASOS.map((item, index) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                animate={{
                  y: [0, -6, 0],
                  transition: { duration: 3.5 + index * 0.3, delay: index * 0.2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="circle-clay w-16 h-16 rounded-2xl bg-gradient-to-br from-petroleum to-primary-light flex items-center justify-center shadow-premium shadow-petroleum/15 mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border-2 border-petroleum flex items-center justify-center">
                    <span className="text-[9px] font-black text-petroleum">{item.step}</span>
                  </div>
                  <Icon name={item.icon} className="text-white text-lg" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-petroleum mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8"
          >
            <MagneticButton
              onClick={handleCta}
              aria-label="Empezar ahora con SmartBoard"
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3 rounded-full text-sm sm:text-base font-bold bg-petroleum text-white shadow-xl hover:bg-petroleum-dark hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-sweep skew-x-[-20deg]" />
              <span className="relative z-10 font-semibold">{t('smartboard.landing_cta_start')}</span>
              <Icon name="fa-arrow-right" className="text-white/90 relative z-10" aria-hidden="true" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-gradient-to-b from-bg-light to-white py-12 lg:py-16">
        <div className="absolute top-[15%] right-[15%] w-56 h-56 bg-mint/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-[10%] left-[10%] w-44 h-44 bg-primary-light/6 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <span className="badge-clay inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD166]/20 text-petroleum text-xs font-bold uppercase tracking-widest mb-3">
              {t('smartboard.landing_pricing_badge')}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight mb-3">
              {t('smartboard.landing_pricing_title_line1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum pr-1">{t('smartboard.landing_pricing_title_line2')}</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
              {t('smartboard.landing_pricing_desc')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {PRICING_PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                variants={childVariant}
                className={`relative rounded-2xl border-2 p-8 lg:p-10 flex flex-col ${
                  plan.popular
                    ? 'border-petroleum shadow-2xl shadow-petroleum/10 scale-[1.02] card-clay-dark'
                    : 'bg-white border-slate-200/60 shadow-premium hover:border-primary-light/40 card-clay-white'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-petroleum to-primary-light text-white text-xs font-bold uppercase tracking-wider shadow-premium-lg whitespace-nowrap">
                    {t('smartboard.landing_pricing_popular')}
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className={`text-xl lg:text-2xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-petroleum'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-4xl lg:text-5xl font-black ${plan.popular ? 'text-white' : 'text-petroleum'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-slate-400'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'bg-white/15' : 'bg-success/10'
                      }`}>
                        <Icon name="fa-check" className={`text-[10px] ${plan.popular ? 'text-white' : 'text-success'}`} aria-hidden="true" />
                      </div>
                      <span className={`text-sm leading-snug ${plan.popular ? 'text-white/80' : 'text-slate-600'}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
                <MagneticButton
                  onClick={handleCta}
                  aria-label={`Elegir plan ${plan.name}`}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-white text-petroleum shadow-premium-lg hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-petroleum/5 text-petroleum hover:bg-petroleum/10'
                  }`}
                >
                  <span>{t('smartboard.landing_pricing_choose', { name: plan.name })}</span>
                  <Icon name="fa-arrow-right" className="text-xs" aria-hidden="true" />
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-white py-12 lg:py-16">
        <div className="absolute top-[20%] left-[5%] w-48 h-48 bg-primary-light/6 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[10%] w-44 h-44 bg-mint/6 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <span className="badge-clay inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-light/10 text-petroleum text-xs font-bold uppercase tracking-widest mb-3">
              {t('smartboard.landing_testimonials_badge')}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
              {t('smartboard.landing_testimonials_title_line1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum pr-1">{t('smartboard.landing_testimonials_title_line2')}</span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="overflow-hidden py-4"
            >
              <motion.div variants={childVariant} className="flex gap-5">
                <div
                  className="flex gap-5"
                  style={{
                    animation: isPaused ? 'none' : 'testimonialMarquee 50s linear infinite',
                  }}
                >
                  {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => {
                    const avatarGradients = [
                      'from-petroleum to-primary-light',
                      'from-primary-light to-mint',
                      'from-mint to-corporate',
                      'from-petroleum-dark to-petroleum',
                      'from-corporate to-petroleum',
                    ];
                    const avatarBg = avatarGradients[idx % avatarGradients.length];
                    return (
                      <div
                        key={`${t.name}-${idx}`}
                        className="card-clay-white bg-white rounded-2xl border border-slate-200/60 shadow-premium p-6 flex-shrink-0 flex flex-col"
                        style={{ width: '380px' }}
                      >
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: t.rating || 5 }).map((_, j) => (
                            <Icon key={j} name="fa-star" className="text-[#FFD166] text-[11px]" aria-hidden="true" />
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                          &ldquo;{t.text}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarBg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {t.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-petroleum truncate">{t.name}</p>
                            <p className="text-xs text-slate-500 truncate">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <style>{`
          @keyframes testimonialMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>

      <section className="relative w-full overflow-hidden bg-gradient-to-br from-petroleum via-petroleum-darker to-petroleum-dark py-14 lg:py-20">
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-primary-light/12 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-56 h-56 bg-mint/8 rounded-full blur-[100px]" />
        <FloatingParticles count={20} className="z-0" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
              {t('smartboard.landing_cta_final_title_line1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint pr-1">{t('smartboard.landing_cta_final_title_line2')}</span>
            </h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-xl mx-auto mb-6">
              {t('smartboard.landing_cta_final_desc')}
            </p>
            <MagneticButton
              onClick={handleCta}
              aria-label="Probar SmartBoard ahora"
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3 rounded-full text-sm sm:text-base font-bold bg-primary-light text-white shadow-xl hover:bg-mint hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-sweep skew-x-[-20deg]" />
              <span className="relative z-10 font-semibold">{t('smartboard.landing_cta_final_btn')}</span>
              <Icon name="fa-arrow-right" className="text-white/90 relative z-10" aria-hidden="true" />
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-black text-white text-center mb-6">
              {t('smartboard.landing_faq_title')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint">{t('smartboard.landing_faq_title_highlight')}</span>
            </h3>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div key={item.q} className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left"
                    id={`faq-question-${i}`}
                    aria-expanded={activeFaq === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-xs font-semibold text-white">{item.q}</span>
                    <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <Icon name="fa-chevron-down" className="text-white/60 text-[10px]" aria-hidden="true" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        role="region"
                        aria-labelledby={`faq-question-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-white/70 leading-relaxed px-5 pb-3">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SmartBoardLandingInfo;
