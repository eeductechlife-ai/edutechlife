import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import FloatingParticles from './FloatingParticles';
import { useTranslation } from '../../i18n/I18nProvider';

const Esencia = memo(() => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        const section = document.getElementById('esencia');
        if (section) observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const slides = [
        { image: '/images/edutech-carrusel-1.webp', title: t('esencia.slide_1_title') },
        { image: '/images/edutech-carrusel-2.webp', title: t('esencia.slide_2_title') },
        { image: '/images/edutech-carrusel-3.webp', title: t('esencia.slide_3_title') },
        { image: '/images/edutech-carrusel-5.webp', title: t('esencia.slide_4_title') },
        { image: '/images/edutech-carrusel-6.webp', title: t('esencia.slide_5_title') },
        { image: '/images/eco-neuro.webp', title: t('esencia.slide_6_title') },
        { image: '/images/eco-b2b.webp', title: t('esencia.slide_7_title') },
        { image: '/images/eco-nacional.webp', title: t('esencia.slide_8_title') }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const values = [
        { icon: 'fa-robot', text: t('esencia.value_1_title'), desc: t('esencia.value_1_desc') },
        { icon: 'fa-heart', text: t('esencia.value_2_title'), desc: t('esencia.value_2_desc') },
        { icon: 'fa-shield-check', text: t('esencia.value_3_title'), desc: t('esencia.value_3_desc') },
        { icon: 'fa-school', text: t('esencia.value_4_title'), desc: t('esencia.value_4_desc') }
    ];

    return (
        <section id="esencia" className="relative w-full overflow-hidden bg-white">
            <FloatingParticles count={15} className="z-0" />
            
            <div className="absolute top-0 right-[-5%] w-[400px] h-[400px] rounded-full bg-primary-light/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full bg-mint/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
            
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-petroleum tracking-tighter mb-4">
                        {t('esencia.title_before')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum">
                            {t('esencia.title_highlight')}
                        </span>
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        {t('esencia.subtitle')}
                    </p>
                </div>

                <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {values.map((value, index) => (
                            <div 
                                key={index}
                                className="group card-clay-white p-3 md:p-4 text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-petroleum/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary-light/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300" />
                                
                                <div className="relative z-10">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary-light/15 to-petroleum/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 mx-auto border border-primary-light/20">
                                        <Icon name={value.icon} className="text-lg md:text-xl text-petroleum group-hover:text-primary-light transition-colors duration-300" />
                                    </div>
                                    <h4 className="text-base md:text-lg font-semibold text-petroleum mb-1 transition-all duration-300">{value.text}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="space-y-5">
                        <div className="group bg-gradient-to-br from-petroleum to-primary-light rounded-xl p-5 text-white shadow-premium-lg hover:shadow-premium transition-all duration-500 hover:-translate-y-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icon name="fa-bullseye" className="text-lg" />
                                </div>
                                <div>
                                    <span className="text-xs font-normal text-primary-light uppercase tracking-widest block mb-1">{t('esencia.mission_badge')}</span>
                                    <h3 className="text-lg md:text-xl font-normal">{t('esencia.mission_title')}</h3>
                                </div>
                            </div>
                            <p className="text-sm text-white/90 leading-relaxed font-normal">
                                {t('esencia.mission_text')}
                            </p>
                            <div className="mt-4 pt-3 border-t border-white/20">
                                <div className="flex items-center gap-2 text-primary-light">
                                    <Icon name="fa-rocket" className="w-4 h-4" />
                                    <span className="font-normal text-xs">{t('esencia.mission_tagline')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="group card-clay-white p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-light to-petroleum flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icon name="fa-eye" className="text-lg text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-normal text-primary-light uppercase tracking-widest block mb-1">{t('esencia.vision_badge')}</span>
                                    <h3 className="text-lg md:text-xl font-normal text-petroleum">{t('esencia.vision_title')}</h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed font-normal">
                                {t('esencia.vision_text')}
                            </p>
                            <div className="mt-4 pt-3 border-t border-border-light">
                                <div className="flex items-center gap-2 text-primary-light">
                                    <Icon name="fa-globe" className="w-4 h-4" />
                                    <span className="font-normal text-xs text-petroleum">{t('esencia.vision_tagline')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="relative bg-petroleum rounded-2xl overflow-hidden shadow-premium-lg h-full min-h-[400px] lg:min-h-[460px]">
                            <div className="absolute inset-0">
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-1000 ${
                                            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                        }`}
                                    >
                                        <img 
                                            src={slide.image} 
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-petroleum via-petroleum/30 to-transparent" />
                                    </div>
                                ))}
                            </div>

                            <div className="absolute inset-0 flex flex-col justify-end p-8">
                                <div className="max-w-lg">
                                    <h3 className="text-xl md:text-2xl font-normal text-white">
                                        {slides[currentSlide].title}
                                    </h3>
                                </div>
                            </div>

                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <Icon name="fa-chevron-left" />
                            </button>
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <Icon name="fa-chevron-right" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

Esencia.displayName = 'Esencia';

export default Esencia;
