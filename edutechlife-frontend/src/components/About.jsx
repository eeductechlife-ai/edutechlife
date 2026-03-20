import { useState, useEffect, useRef } from 'react';

const images = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800',
];

export default function About() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 lg:py-32" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #F0F8FF 50%, #ffffff 100%)' }}>
      <div className="max-w-7xl mx-auto px-5%">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={images[current]}
                alt="Equipo Edutechlife"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004B63]/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-[#B2D8E5]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                  <i className="fa-solid fa-heart text-white text-lg"></i>
                </div>
                <div>
                  <p className="font-bold text-[#004B63] text-lg">+10 Años</p>
                  <p className="text-sm text-[#4A4A4A]">de Experiencia</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-[#66CCCC]/10 blur-2xl" />
            <div className="absolute -bottom-8 left-1/4 w-32 h-32 rounded-full bg-[#4DA8C4]/10 blur-3xl" />
          </div>

          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-0.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#4DA8C4]">
                Sobre Nosotros
              </span>
            </div>

            <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-black text-[#004B63] mb-6 leading-tight">
              El Factor <span className="text-gradient-corporate">Humano</span>
            </h2>

            <div className="w-16 h-1 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded mb-8" />

            <p className="text-[#4A4A4A] text-lg leading-relaxed mb-6">
              En Edutechlife creemos que la tecnología es una herramienta, pero el ser humano es el protagonista. 
              Nuestro equipo multidisciplinario de psicólogos educativos, pedagogos y expertos en IA trabaja 
              incansablemente para crear experiencias de aprendizaje que transforman vidas.
            </p>

            <p className="text-[#4A4A4A] leading-relaxed mb-8">
              Cada niño, adolescente o profesional que pasa por nuestros programas recibe un acompañamiento 
              personalizado. No somos una plataforma más de educación online; somos un ecosistema de 
              aprendizaje vivo donde la metodología VAK y la inteligencia artificial se unen para 
              potenciar el potencial único de cada estudiante.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: 'fa-users', label: 'Comunidad Activa', value: '+15,000' },
                { icon: 'fa-graduation-cap', label: 'Estudiantes', value: '6,000+' },
                { icon: 'fa-chalkboard-teacher', label: 'Docentes', value: '200+' },
                { icon: 'fa-globe-americas', label: 'Alcance', value: 'Nacional' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F8FA] flex items-center justify-center text-[#4DA8C4]">
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <div>
                    <p className="font-bold text-[#004B63]">{stat.value}</p>
                    <p className="text-xs text-[#4A4A4A]">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#B2D8E5]/20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#66CCCC]/10 blur-3xl translate-x-1/3 translate-y-1/3" />
    </section>
  );
}
