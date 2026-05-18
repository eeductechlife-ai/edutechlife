import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingParticles from './FloatingParticles';
import MagneticButton from './MagneticButton';
import { Icon } from '../utils/iconMapping.jsx';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

const staggerChildren = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-50px' },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  },
};

const childVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const VAQ_STYLES = [
  {
    key: 'visual',
    icon: 'fa-eye',
    title: 'Visual',
    color: '#4DA8C4',
    description: 'Aprende mejor viendo: imágenes, videos, mapas mentales y diagramas. Su cerebro procesa la información a través del canal visual con alta retención.',
    traits: ['Mapas mentales', 'Videos educativos', 'Esquemas de color', 'Flashcards con imágenes'],
  },
  {
    key: 'auditivo',
    icon: 'fa-headphones',
    title: 'Auditivo',
    color: '#66CCCC',
    description: 'Aprende mejor escuchando: podcasts, debates, explicaciones en voz alta. Retiene información a través de conversaciones y audio.',
    traits: ['Podcasts educativos', 'Debates guiados', 'Audiolibros', 'Grabaciones de clase'],
  },
  {
    key: 'kinestesico',
    icon: 'fa-hand-pointer',
    title: 'Kinestésico',
    color: '#FF6B9D',
    description: 'Aprende mejor haciendo: experimentos, movimiento, proyectos manuales. Necesita tocar y experimentar para comprender.',
    traits: ['Experimentos prácticos', 'Juegos de rol', 'Pausas activas', 'Proyectos manuales'],
  },
];

const PRICING_PLANS = [
  {
    name: 'Básico',
    price: '$30.000',
    period: '/mes',
    popular: false,
    color: '#4DA8C4',
    features: [
      'Diagnóstico VAK completo',
      'Plan de estudio personalizado',
      'Acceso a recursos académicos',
      'Sistema de puntos y recompensas',
      'Reportes semanales',
      'Coach virtual Dani',
      'Soporte por email',
    ],
  },
  {
    name: 'Premium',
    price: '$50.000',
    period: '/mes',
    popular: true,
    color: '#004B63',
    features: [
      'Todo lo del plan Básico',
      'Coach humano dedicado',
      'Reportes en tiempo real',
      'Actividades avanzadas',
      'Talleres de tecnología',
      'Sesiones mensuales con experto',
      'Prioridad en soporte',
      'Certificados de logro',
    ],
  },
];

const TESTIMONIALS = [
  {
    name: 'María Gómez',
    role: 'Mamá de Santiago, 10 años',
    text: 'SmartBoard me devolvió la tranquilidad. Ya no tengo que pelear con mi hijo para que estudie. Dani lo mantiene motivado y yo recibo reportes de su progreso sin estrés.',
    rating: 5,
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Papá de Valentina, 12 años',
    text: 'El diagnóstico VAK fue revelador. Descubrimos que Valentina es kinestésica y ahora sus notas mejoraron porque estudia como realmente aprende. Los coaches son increíbles.',
    rating: 5,
  },
  {
    name: 'Laura Méndez',
    role: 'Mamá de Mateo, 8 años',
    text: 'Como mamá ocupada, SmartBoard es mi mejor aliado. Sé que Mateo está aprendiendo con expertos y yo recibo alertas si necesita refuerzo. Vale cada peso.',
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: '¿Desde qué edad pueden usar SmartBoard?',
    a: 'SmartBoard está diseñado para niños entre 8 y 16 años. Nuestro sistema adapta el contenido y las actividades según la edad y el estilo de aprendizaje de cada estudiante.',
  },
  {
    q: '¿Necesito estar presente mientras mi hijo estudia?',
    a: 'No. SmartBoard está diseñado para que tu hijo aprenda de forma autónoma con el acompañamiento de Dani (coach virtual) y nuestro equipo de coaches humanos. Tú recibes reportes periódicos de su progreso.',
  },
  {
    q: '¿Cómo funciona el diagnóstico VAK?',
    a: 'El diagnóstico VAK es un test interactivo de 10 preguntas que identifica el estilo de aprendizaje predominante de tu hijo: Visual, Auditivo o Kinestésico. A partir de los resultados, creamos un plan de estudio totalmente personalizado.',
  },
  {
    q: '¿Puedo cancelar en cualquier momento?',
    a: 'Sí. No hay permanencia forzada. Puedes cancelar tu suscripción cuando quieras sin penalización.',
  },
];

const SmartBoardLandingInfo = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({ students: 0, improvement: 0, hours: 0 });

  useEffect(() => {
    const targets = { students: 2500, improvement: 94, hours: 12000 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        students: Math.round(targets.students * eased),
        improvement: Math.round(targets.improvement * eased),
        hours: Math.round(targets.hours * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleCta = () => navigate('/sign-up/smartboard');

  return (
    <div className="w-full bg-white overflow-hidden" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
      {/* ========================================== */}
      {/* SECCIÓN 1: HERO */}
      {/* ========================================== */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#F0F9FF] to-white">
        <FloatingParticles count={40} className="z-0" />

        {/* Ambient Orbs */}
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-[#4DA8C4]/8 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-[#66CCCC]/8 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[50%] left-[40%] w-64 h-64 bg-[#004B63]/5 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004B63]/5 border border-[#004B63]/10 mb-8"
            >
              <Icon name="fa-flask-vial" className="text-[#004B63] text-sm" />
              <span className="text-xs font-semibold text-[#004B63] uppercase tracking-wider">Plataforma Educativa Inteligente</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#004B63] tracking-tight leading-[1.05] mb-6 max-w-5xl"
            >
              La plataforma que
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] via-[#00BCD4] to-[#004B63]">
                transforma la educación
              </span>
              <br />
              de tu hijo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mb-10"
            >
              Descubrimos cómo aprende, diseñamos un plan a su medida, lo acompañamos con coaches expertos y te entregamos reportes en tiempo real. 
              Tú recuperas tu tranquilidad mientras nosotros nos encargamos de su éxito académico.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex flex-wrap justify-center gap-8 sm:gap-14 mb-10"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#004B63]">+{animatedStats.students.toLocaleString()}</div>
                <div className="text-xs text-[#64748B] uppercase tracking-widest mt-1">Estudiantes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#4DA8C4]">{animatedStats.improvement}%</div>
                <div className="text-xs text-[#64748B] uppercase tracking-widest mt-1">Mejora académica</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#66CCCC]">+{animatedStats.hours.toLocaleString()}</div>
                <div className="text-xs text-[#64748B] uppercase tracking-widest mt-1">Horas ahorradas a padres</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MagneticButton
                onClick={handleCta}
                className="group relative overflow-hidden flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold bg-[#4DA8C4] text-white shadow-lg hover:bg-[#004B63] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite] skew-x-[-20deg]" />
                <span className="text-white relative z-10 font-semibold">Quiero probarlo ahora</span>
                <Icon name="fa-arrow-right" className="text-white/90 relative z-10" />
              </MagneticButton>

              <MagneticButton
                onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold bg-transparent border-2 border-[#004B63] text-[#004B63] hover:bg-[#004B63] hover:text-white transition-all duration-300"
              >
                <Icon name="fa-play-circle" className="text-[#004B63] group-hover:text-white transition-colors duration-300" />
                <span className="font-semibold">¿Cómo funciona?</span>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECCIÓN 2: ¿QUÉ ES SMARTBOARD? */}
      {/* ========================================== */}
      <section className="relative w-full overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-[30%] right-[10%] w-64 h-64 bg-[#66CCCC]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[5%] w-56 h-56 bg-[#4DA8C4]/6 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#66CCCC]/10 text-[#004B63] text-xs font-bold uppercase tracking-widest mb-4">
              ¿Qué es SmartBoard?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] leading-tight mb-6">
              Mucho más que una
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">
                plataforma educativa
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
                SmartBoard es una plataforma educativa inteligente que combina <strong className="text-[#004B63]">inteligencia artificial</strong>,{' '}
                <strong className="text-[#004B63]">diagnóstico de estilos de aprendizaje (VAK)</strong> y{' '}
                <strong className="text-[#004B63]">coaches humanos expertos</strong> para crear una experiencia de aprendizaje única para cada niño.
              </p>
              <p className="text-base text-[#64748B] leading-relaxed">
                No somos una plataforma genérica de videos o ejercicios repetitivos. Identificamos{' '}
                <strong className="text-[#004B63]">cómo aprende realmente tu hijo</strong> — si es visual, auditivo o kinestésico — y diseñamos un plan de estudio que se adapta a su cerebro, no al revés.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {['IA Adaptativa', 'Coaches Reales', 'VAK Científico', 'Reportes en Vivo'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full bg-[#004B63]/5 text-[#004B63] text-xs font-semibold border border-[#004B63]/10">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#004B63]/5 to-[#4DA8C4]/5 border border-[#004B63]/10 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#4DA8C4] flex items-center justify-center shadow-lg shadow-[#004B63]/20">
                    <Icon name="fa-flask-vial" className="text-white text-3xl" />
                  </div>
                  <p className="text-lg font-bold text-[#004B63] mb-2">SmartBoard</p>
                  <p className="text-sm text-[#64748B]">Educación personalizada con IA</p>
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl border border-[#004B63]/10 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                    <Icon name="fa-check-circle" className="text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#004B63]">+2.500 niños</p>
                    <p className="text-xs text-[#64748B]">ya están aprendiendo</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECCIÓN 3: DIAGNÓSTICO VAK */}
      {/* ========================================== */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#004B63]/3 to-white py-20 lg:py-28">
        <FloatingParticles count={15} className="z-0" />
        <div className="absolute top-[10%] right-[15%] w-48 h-48 bg-[#4DA8C4]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD166]/20 text-[#004B63] text-xs font-bold uppercase tracking-widest mb-4">
              Primero entendemos cómo aprende
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] leading-tight mb-6">
              Diagnóstico
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"> VAK</span>
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed max-w-2xl mx-auto">
              El modelo VAK — Visual, Auditivo y Kinestésico — es un método científicamente respaldado que identifica el canal sensorial dominante de cada niño. Así sabemos exactamente cómo potenciar su aprendizaje desde el primer día.
            </p>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {VAQ_STYLES.map((style) => (
              <motion.div
                key={style.key}
                variants={childVariant}
                className="group relative bg-white rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(135deg, ${style.color}, ${style.color}88)` }} />
                <div className="p-6 lg:p-8">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `linear-gradient(135deg, ${style.color}15, ${style.color}08)` }}
                  >
                    <Icon name={style.icon} className="text-2xl" style={{ color: style.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#004B63] mb-3">{style.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-5">{style.description}</p>
                  <div className="space-y-2">
                    {style.traits.map((trait) => (
                      <div key={trait} className="flex items-center gap-2 text-xs text-[#64748B]">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: style.color }} />
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECCIÓN 4: BENEFICIOS PARA TU HIJO */}
      {/* ========================================== */}
      <section className="relative w-full overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-[#4DA8C4]/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-[#66CCCC]/6 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#4DA8C4]/10 text-[#004B63] text-xs font-bold uppercase tracking-widest mb-4">
              Beneficios para tu hijo
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] leading-tight mb-6">
              Una experiencia que
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">
                lo motiva a aprender
              </span>
            </h2>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: 'fa-brain',
                title: 'Plan personalizado',
                desc: 'Creamos una ruta de aprendizaje única basada en su estilo VAK. Nada genérico: cada actividad está diseñada para cómo él o ella aprende mejor.',
              },
              {
                icon: 'fa-laptop-code',
                title: 'Habilidades tecnológicas',
                desc: 'Desarrolla competencias digitales reales mientras estudia: manejo de herramientas, pensamiento computacional, IA generativa y creatividad digital.',
              },
              {
                icon: 'fa-star',
                title: 'Puntos y recompensas',
                desc: 'Cada actividad completada le da puntos que puede canjear por premios reales. La motivación se convierte en un juego que lo mantiene enganchado.',
              },
              {
                icon: 'fa-robot',
                title: 'Coach virtual Dani',
                desc: 'Un tutor con IA disponible 24/7 que lo guía, responde sus preguntas y lo anima en cada paso. Nunca se sentirá solo estudiando.',
              },
              {
                icon: 'fa-user-graduate',
                title: 'Coach humano experto',
                desc: 'Un profesional real que supervisa su progreso, ajusta su plan y está pendiente de su evolución académica y emocional.',
              },
              {
                icon: 'fa-book-open',
                title: 'Recursos premium',
                desc: 'Acceso ilimitado a guías, videos, ejercicios interactivos y materiales seleccionados por expertos en educación para potenciar su conocimiento.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={childVariant}
                className="group relative bg-white rounded-2xl border border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300 p-6 lg:p-7"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004B63]/10 to-[#4DA8C4]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={item.icon} className="text-xl text-[#004B63]" />
                </div>
                <h3 className="text-lg font-bold text-[#004B63] mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECCIÓN 5: TRANQUILIDAD PARA TI (PADRES) */}
      {/* ========================================== */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#004B63] to-[#0A3550] py-20 lg:py-28">
        <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-[#4DA8C4]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-64 h-64 bg-[#66CCCC]/10 rounded-full blur-[100px]" />
        <FloatingParticles count={20} className="z-0" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-bold uppercase tracking-widest mb-4">
              Tranquilidad para ti
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Porque tu tiempo
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                también es valioso
              </span>
            </h2>
            <p className="text-base text-white/70 leading-relaxed max-w-2xl mx-auto">
              Sabemos que eres un padre ocupado. Que quieres lo mejor para tu hijo pero no siempre tienes el tiempo o el conocimiento para ayudarlo con sus estudios. SmartBoard existe para eso.
            </p>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: 'fa-chart-line',
                title: 'Reportes en tiempo real',
                desc: '¿Está conectado? ¿Cuánto tiempo estudió hoy? ¿En qué tema va? Recibe datos actualizados al instante desde tu celular.',
              },
              {
                icon: 'fa-clock',
                title: 'Recupera tu tiempo',
                desc: 'No más horas ayudando con tareas que no entiendes. Nuestros coaches se encargan del proceso académico completo.',
              },
              {
                icon: 'fa-shield-halved',
                title: 'Tu hijo en buenas manos',
                desc: 'Profesionales en educación supervisan su progreso. Tú recibes alertas solo cuando es necesario tu apoyo.',
              },
              {
                icon: 'fa-face-smile',
                title: 'Adiós al estrés escolar',
                desc: 'Se acabaron las discusiones por las tareas. Tu hijo estudia motivado y tú recuperas la armonía en casa.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={childVariant}
                className="group relative bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/12 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DA8C4]/30 to-[#66CCCC]/20 flex items-center justify-center mb-4">
                  <Icon name={item.icon} className="text-xl text-[#66CCCC]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
              <Icon name="fa-quote-left" className="text-[#4DA8C4] text-lg" />
              <p className="text-white/80 text-sm italic max-w-lg">
                Muchos padres no tienen el conocimiento para ayudar a sus hijos con el proceso académico. Para eso estamos nosotros: para quitarte esa carga y asegurarnos de que tu hijo reciba la mejor educación posible.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECCIÓN 6: ¿CÓMO FUNCIONA? */}
      {/* ========================================== */}
      <section id="como-funciona" className="relative w-full overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-[30%] left-[10%] w-56 h-56 bg-[#4DA8C4]/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-60 h-60 bg-[#66CCCC]/6 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#66CCCC]/10 text-[#004B63] text-xs font-bold uppercase tracking-widest mb-4">
              ¿Cómo funciona?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] leading-tight mb-6">
              Cuatro pasos para
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">
                transformar su educación
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#4DA8C4]/30 via-[#004B63]/30 to-[#66CCCC]/30 -translate-y-1/2" />

            <motion.div
              {...staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { step: '01', icon: 'fa-user-plus', title: 'Registro', desc: 'Creas una cuenta para tu hijo en 2 minutos. Solo necesitas sus datos básicos y elegir tu plan.' },
                { step: '02', icon: 'fa-chart-bar', title: 'Diagnóstico VAK', desc: 'Tu hijo hace un test interactivo de 10 preguntas. En 3 minutos sabemos exactamente cómo aprende.' },
                { step: '03', icon: 'fa-route', title: 'Plan personalizado', desc: 'Nuestra IA crea una ruta de aprendizaje a su medida: actividades, horarios y recursos según su estilo.' },
                { step: '04', icon: 'fa-rocket', title: 'Aprendizaje activo', desc: 'Tu hijo empieza a estudiar con Dani y nuestros coaches. Tú recibes reportes de su progreso sin hacer nada.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={childVariant}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#4DA8C4] flex items-center justify-center shadow-lg shadow-[#004B63]/15 mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-[#004B63] flex items-center justify-center">
                      <span className="text-[10px] font-black text-[#004B63]">{item.step}</span>
                    </div>
                    <Icon name={item.icon} className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-[#004B63] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed max-w-[220px]">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-14"
          >
            <MagneticButton
              onClick={handleCta}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 rounded-full text-base sm:text-lg font-bold bg-[#004B63] text-white shadow-xl hover:bg-[#00334A] hover:-translate-y-1 transition-all duration-300"
            >
              <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite] skew-x-[-20deg]" />
              <span className="relative z-10 font-semibold">Empezar ahora</span>
              <Icon name="fa-arrow-right" className="text-white/90 relative z-10" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECCIÓN 7: PRECIOS */}
      {/* ========================================== */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white py-20 lg:py-28">
        <div className="absolute top-[15%] right-[15%] w-72 h-72 bg-[#66CCCC]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-56 h-56 bg-[#4DA8C4]/6 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD166]/20 text-[#004B63] text-xs font-bold uppercase tracking-widest mb-4">
              Planes y precios
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] leading-tight mb-6">
              Invierte en el futuro
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">
                de tu hijo
              </span>
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed max-w-xl mx-auto">
              Elige el plan que mejor se adapte a las necesidades de tu hijo. Sin contratos forzados, cancela cuando quieras.
            </p>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
          >
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={i}
                variants={childVariant}
                className={`relative bg-white rounded-2xl border-2 p-8 lg:p-10 ${
                  plan.popular
                    ? 'border-[#004B63] shadow-2xl shadow-[#004B63]/10 scale-[1.02]'
                    : 'border-slate-200/60 shadow-lg hover:border-[#4DA8C4]/40'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    Más popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-[#004B63] mb-1">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl lg:text-5xl font-black text-[#004B63]">{plan.price}</span>
                    <span className="text-sm text-[#64748B]">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="fa-check" className="text-[#10B981] text-[10px]" />
                      </div>
                      <span className="text-sm text-[#64748B] leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

                <MagneticButton
                  onClick={handleCta}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-[#004B63]/5 text-[#004B63] hover:bg-[#004B63]/10'
                  }`}
                >
                  <span>Elegir {plan.name}</span>
                  <Icon name="fa-arrow-right" className="text-sm" />
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECCIÓN 8: TESTIMONIOS */}
      {/* ========================================== */}
      <section className="relative w-full overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute top-[20%] left-[5%] w-64 h-64 bg-[#4DA8C4]/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-56 h-56 bg-[#66CCCC]/6 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#4DA8C4]/10 text-[#004B63] text-xs font-bold uppercase tracking-widest mb-4">
              Testimonios reales
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] leading-tight mb-6">
              Lo que dicen
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">
                los padres
              </span>
            </h2>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                variants={childVariant}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-6 lg:p-8 relative"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Icon key={j} name="fa-star" className="text-[#FFD166] text-sm" />
                  ))}
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004B63] to-[#4DA8C4] flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#004B63]">{t.name}</p>
                    <p className="text-xs text-[#64748B]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECCIÓN 9: CTA FINAL + FAQ */}
      {/* ========================================== */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#004B63] via-[#00374A] to-[#0A3550] py-20 lg:py-28">
        <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-[#4DA8C4]/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-72 h-72 bg-[#66CCCC]/8 rounded-full blur-[120px]" />
        <FloatingParticles count={25} className="z-0" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          {/* CTA Final */}
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Dale a tu hijo
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                la ventaja que merece
              </span>
            </h2>
            <p className="text-base text-white/70 leading-relaxed max-w-xl mx-auto mb-10">
              No dejes que la falta de tiempo o conocimiento limite el potencial de tu hijo. SmartBoard está aquí para encargarse de todo mientras tú ves los resultados.
            </p>
            <MagneticButton
              onClick={handleCta}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 rounded-full text-base sm:text-lg font-bold bg-[#4DA8C4] text-white shadow-xl hover:bg-[#66CCCC] hover:-translate-y-1 transition-all duration-300"
            >
              <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite] skew-x-[-20deg]" />
              <span className="relative z-10 font-semibold">Probar SmartBoard ahora</span>
              <Icon name="fa-arrow-right" className="text-white/90 relative z-10" />
            </MagneticButton>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-black text-white text-center mb-10">
              Preguntas
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"> frecuentes</span>
            </h3>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-white">{item.q}</span>
                    <Icon
                      name={activeFaq === i ? 'fa-chevron-up' : 'fa-chevron-down'}
                      className={`text-white/60 text-xs transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeFaq === i ? 'max-h-48 pb-4' : 'max-h-0'
                    }`}
                  >
                    <p className="text-sm text-white/70 leading-relaxed px-6">{item.a}</p>
                  </div>
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
