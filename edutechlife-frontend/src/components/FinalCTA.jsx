import { useState, useEffect, useRef } from 'react';

const FinalCTA = ({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const sectionRef = useRef(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
            setTimeout(() => {
                setEmail('');
                setSubmitted(false);
            }, 3000);
        }
    };

    return (
        <section
            ref={sectionRef}
            className="relative py-24 px-5% overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #004B63 0%, #0B2A3A 50%, #0A1628 100%)',
            }}
        >
            {/* Background Elements */}
            <div className="absolute inset-0">
                {/* Grid */}
                <div className="grid-bg-3d" />
                
                {/* Orbs */}
                <div className="orb orb-primary" style={{ top: '10%', right: '20%', width: '500px', height: '500px' }} />
                <div className="orb orb-secondary" style={{ bottom: '10%', left: '10%', width: '400px', height: '400px' }} />
                
                {/* Particles */}
                <div className="particle-container">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 6}s`,
                                animationDuration: `${4 + Math.random() * 4}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                        background: 'rgba(77, 168, 196, 0.15)',
                        border: '1px solid rgba(77, 168, 196, 0.3)',
                    }}
                >
                    <div className="w-2 h-2 rounded-full bg-[#66CCCC] animate-pulse" />
                    <span className="font-mono text-xs font-semibold text-[#66CCCC] uppercase tracking-wider">
                        Acceso Abierto - Test VAK Gratuito
                    </span>
                </div>

                {/* Title */}
                <h2
                    className={`font-montserrat text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 transition-all duration-1000 delay-150 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    Transforma Tu Futuro
                    <span className="block mt-2" style={{
                        background: 'linear-gradient(135deg, #4DA8C4 0%, #66CCCC 50%, #B2D8E5 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Con Educación de Élite
                    </span>
                </h2>

                {/* Subtitle */}
                <p
                    className={`text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-1000 delay-300 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    Únete a más de 6,000 estudiantes que ya están revolucionando su aprendizaje con metodologías VAK, STEAM y la inteligencia artificial más avanzada del mercado.
                </p>

                {/* CTA Buttons */}
                <div
                    className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-450 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <button
                        onClick={() => onNavigate && onNavigate('neuroentorno')}
                        className="group relative px-8 py-4 rounded-full font-montserrat font-bold text-white overflow-hidden transition-all duration-300 hover:-translate-y-1"
                        style={{
                            background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)',
                            boxShadow: '0 8px 30px rgba(77, 168, 196, 0.4)',
                        }}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Realizar Test VAK Gratis
                            <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            }}
                        />
                    </button>

                    <button
                        onClick={() => onNavigate && onNavigate('consultoria')}
                        className="px-8 py-4 rounded-full font-montserrat font-bold text-white border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1"
                    >
                        Solicitar Consultoría
                    </button>
                </div>

                {/* Newsletter */}
                <div
                    className={`max-w-md mx-auto transition-all duration-1000 delay-600 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <p className="text-white/50 text-sm mb-4">
                        ¿Quieres estar al día con las últimas novedades?
                    </p>
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <div className="relative flex-1">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#4DA8C4] transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-4 rounded-full font-montserrat font-bold text-sm bg-white text-[#004B63] hover:bg-[#4DA8C4] hover:text-white transition-all duration-300"
                        >
                            {submitted ? (
                                <i className="fa-solid fa-check" />
                            ) : (
                                'Suscribirse'
                            )}
                        </button>
                    </form>
                    <p className="text-white/30 text-xs mt-3">
                        Respetamos tu privacidad. Sin spam, lo prometemos.
                    </p>
                </div>

                {/* Trust Badges */}
                <div
                    className={`flex flex-wrap justify-center gap-6 mt-12 pt-12 border-t border-white/10 transition-all duration-1000 delay-750 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    {[
                        { icon: 'fa-shield-halved', text: 'Pago Seguro' },
                        { icon: 'fa-certificate', text: 'Certificados IBM' },
                        { icon: 'fa-headset', text: 'Soporte 24/7' },
                        { icon: 'fa-users', text: '6,000+ Alumnos' },
                    ].map((badge, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 text-white/60"
                        >
                            <i className={`fa-solid ${badge.icon}`} />
                            <span className="text-sm font-medium">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
