import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    num: '01',
    title: 'Diagnóstico',
    subtitle: 'Evaluación VAK',
    desc: 'Identificamos tu estilo de aprendizaje predominante (Visual, Auditivo o Kinestésico) mediante nuestra evaluación conversar con Valerio.',
    icon: 'fa-magnifying-glass-chart',
    color: '#4DA8C4',
  },
  {
    num: '02',
    title: 'Ruta',
    subtitle: 'Plan Personalizado',
    desc: 'Creamos una ruta de aprendizaje única basada en tu perfil, objetivos y preferencias de estudio.',
    icon: 'fa-route',
    color: '#66CCCC',
  },
  {
    num: '03',
    title: 'Ejecución',
    subtitle: 'Aprendizaje Activo',
    desc: 'Implementamos metodologías STEAM y herramientas de IA adaptadas a tu estilo de aprendizaje.',
    icon: 'fa-rocket',
    color: '#B2D8E5',
  },
  {
    num: '04',
    title: 'Certificación',
    subtitle: 'Validación Internacional',
    desc: 'Obtén certificaciones reconocidas internacionalmente de IBM, Coursera y organismos colombianos.',
    icon: 'fa-certificate',
    color: '#004B63',
  },
];

export default function ProcessSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-12 md:py-20 overflow-hidden px-4 md:px-8 lg:px-5%" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-0.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#4DA8C4]">
              Metodología
            </span>
            <span className="w-8 h-0.5 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] mb-4">
            Así Funciona
          </h2>
          <p className="text-[#4A4A4A] text-base md:text-lg max-w-2xl mx-auto px-4">
            Un proceso estructurado en 4 etapas para garantizar tu transformación educativa
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-[4.5rem] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-[#B2D8E5] to-transparent hidden lg:block" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="process-card relative bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[rgba(0,194,224,0.12)] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white"
                      style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                    >
                      <span className="font-mono text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mt-4 transition-all duration-300 group-hover:scale-110" style={{ background: `${step.color}15` }}>
                    <i className={`fa-solid ${step.icon} text-2xl`} style={{ color: step.color }} />
                  </div>

                  <span className="font-mono text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: step.color }}>
                    {step.subtitle}
                  </span>
                  
                  <h3 className="font-display text-xl font-bold text-[#004B63] mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-[#4A4A4A] text-sm leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${step.color}40, ${step.color})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button className="btn-primary inline-flex items-center gap-2">
            <span>Comenzar con Valerio</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-[#66CCCC]/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#4DA8C4]/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
    </section>
  );
}
