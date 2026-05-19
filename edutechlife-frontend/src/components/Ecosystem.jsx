import { memo, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';

let lottieInstance = null;

const loadLottie = async () => {
  if (!lottieInstance) {
    const lottieModule = await import('lottie-web/build/player/esm/lottie.min.js');
    lottieInstance = lottieModule.default;
  }
  return lottieInstance;
};

const brainAnimation = {
  v: "5.7.4", fr: 30, ip: 0, op: 60, w: 100, h: 100, nm: "Brain", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "Circle", sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
      p: { a: 0, k: [50, 50, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [80, 80] }, nm: "Ellipse" }, { ty: "st", c: { a: 0, k: [0.302, 0.659, 0.769, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 }, lc: 2, lj: 1, nm: "Stroke" }]
  }]
};

const awardAnimation = {
  v: "5.7.4", fr: 30, ip: 0, op: 60, w: 100, h: 100, nm: "Award", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "Star", sr: 1,
    ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [50, 50, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 0, s: [100, 100, 100] }, { i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 30, s: [120, 120, 100] }, { t: 60, s: [100, 100, 100] }] }
    },
    ao: 0,
    shapes: [{ ty: "sr", p: { a: 0, k: [0, 0] }, or: { a: 0, k: 35 }, ir: { a: 0, k: 15 }, pt: { a: 0, k: 5 }, r: { a: 0, k: 0 }, nm: "Star" }, { ty: "fl", c: { a: 0, k: [1, 0.82, 0.388, 1] }, o: { a: 0, k: 100 }, nm: "Fill" }]
  }]
};

const handshakeAnimation = {
  v: "5.7.4", fr: 30, ip: 0, op: 60, w: 100, h: 100, nm: "Handshake", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "Pulse", sr: 1,
    ks: {
      o: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [100] }, { t: 60, s: [0] }] },
      r: { a: 0, k: 0 }, p: { a: 0, k: [50, 50, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 0, s: [100, 100, 100] }, { t: 60, s: [150, 150, 100] }] }
    },
    ao: 0,
    shapes: [{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [60, 60] }, nm: "Ellipse" }, { ty: "st", c: { a: 0, k: [0.302, 0.659, 0.769, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 2, lj: 1, nm: "Stroke" }]
  }]
};

const CardWithLottie = ({ children, animationData, onMouseEnter, onMouseLeave }) => {
  const animationContainer = useRef(null);
  const animationInstance = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const initAnimation = async () => {
      try {
        const lottie = await loadLottie();
        if (mounted && animationContainer.current && !animationInstance.current) {
          animationInstance.current = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            animationData: animationData
          });
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
      }
    };
    initAnimation();
    return () => {
      mounted = false;
      if (animationInstance.current) {
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, [animationData]);

  const handleMouseEnter = (e) => {
    if (animationInstance.current) animationInstance.current.play();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    if (animationInstance.current) animationInstance.current.pause();
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="w-14 h-14 mb-4" ref={animationContainer} />
      {children}
    </div>
  );
};

const TiltCard = ({ children, pilar, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);
  const requestRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(() => {
      x.set(mouseX / width - 0.5);
      y.set(mouseY / height - 0.5);
    });
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); setIsHovered(false); };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-full rounded-3xl"
    >
      <motion.div className="group relative h-full rounded-3xl p-8 text-left cursor-pointer transition-all duration-300 bg-white card-clay">
        <div style={{ transform: "translateZ(30px)", transition: "transform 0.3s ease-out" }} className="relative z-10 w-full h-full flex flex-col">
          {typeof children === 'function' ? children(isHovered) : children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Ecosystem = memo(() => {
  const sectionRef = useRef(null);

  const pilares = [
    {
      id: 'neuroentorno', icon: 'fa-brain', title: 'NeuroEntornos Escolares', subtitle: 'Pilar 1',
      desc: 'Diagnóstico VAK, IA Lab con Valerio, SmartBoard y herramientas neuropedagógicas.',
      stats: [{ num: '6,000+', label: 'Estudiantes' }, { num: '98%', label: 'Efectividad' }],
      onNavigate: () => window.location.href = '/neuroentorno'
    },
    {
      id: 'ialab', icon: 'fa-robot', title: 'Laboratorio IA', subtitle: 'Certificación Profesional',
      desc: 'Aprende inteligencia artificial, crea prompts y obtén tu certificación.',
      stats: [{ num: '5', label: 'Módulos' }, { num: '100%', label: 'Online' }],
      onNavigate: () => window.location.href = '/ialab'
    },
    {
      id: 'consultoria', icon: 'fa-handshake', title: 'Consultoría B2B y Automatización', subtitle: 'Pilar 3',
      desc: 'Transformación digital, agentes IA personalizados y ROI garantizado.',
      stats: [{ num: '100+', label: 'Instituciones' }, { num: '3x', label: 'ROI Promedio' }],
      onNavigate: () => window.location.href = '/consultoria'
    }
  ];

  return (
    <section id="ecosystem" ref={sectionRef} className="relative w-full overflow-hidden bg-bg-light">
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-primary-light/5 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-mint/5 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />

      <div className="absolute top-[15%] right-[20%] w-3 h-3 bg-primary-light/40 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" />
      <div className="absolute top-[40%] left-[10%] w-2 h-2 bg-mint/50 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-[20%] right-[15%] w-4 h-4 bg-[#FFD166]/30 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-petroleum tracking-tighter mb-4">
            Ecosistema{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum pr-1">
              Interconectado
            </span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Accede a herramientas estructuradas para potenciar la educación mediante la sinergia de neuro-ciencia e inteligencia artificial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { bg: 'from-primary-light/20', border: 'border-primary-light/30', anim: brainAnimation, img: '/images/eco-neuro.webp', title: 'Neuro-Entorno Educativo', desc: 'Acompañamiento integral basado en metodologías VAK y STEAM. Docentes con maestría analizan procesos psicológicos y académicos para potenciar cada estilo de aprendizaje con herramientas de IA personalizadas.', delay: 0.1 },
            { bg: 'from-mint/20', border: 'border-mint/30', anim: awardAnimation, img: '/images/eco-nacional.webp', title: 'Proyectos de Impacto Nacional', desc: 'Operadores oficiales SenaTIC. Certificamos a más de 6,000 estudiantes con respaldo internacional de IBM y Coursera. Maestros que forman maestros: más de 200 docentes colombianos transformados en líderes digitales.', delay: 0.2 },
            { bg: 'from-[#FFD166]/20', border: 'border-[#FFD166]/30', anim: handshakeAnimation, img: '/images/edutech-carrusel-6.webp', title: 'Consultoría B2B y Automatización', desc: 'Transformamos organizaciones educativas y empresas con metodología STEAM aplicada. Agentes de IA personalizados y capacitación de alto nivel que generan productividad real desde el primer mes de implementación.', delay: 0.3 }
          ].map((card, i) => (
            <motion.div
              key={i}
              className="group card-clay-white overflow-hidden cursor-pointer relative"
              onClick={() => {}}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
            >
              <div className={`absolute inset-0 rounded-[20px] border-2 border-transparent group-hover:${card.border} transition-all duration-500 card-glow`} />
              <div className="h-56 w-full overflow-hidden relative rounded-t-[20px]">
                <div className={`absolute inset-0 bg-gradient-to-t ${card.bg} to-transparent z-10`} />
                <img src={card.img} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-6 relative z-10">
                <CardWithLottie animationData={card.anim}>
                  <h3 className="text-xl font-bold text-petroleum mt-6 mb-4 group-hover:text-primary-light transition-colors duration-300">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.desc}</p>
                </CardWithLottie>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
