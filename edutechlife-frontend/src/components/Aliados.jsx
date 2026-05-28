import { memo, useState, useRef } from 'react';
import { GraduationCap, Globe, Building2, Search, Cloud, Award, FlaskConical, Laptop, Cpu, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n/I18nProvider';

const Aliados = memo(() => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const marqueeRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    const aliados = [
        { id: 1, name: 'SENA', category: t('aliados.category_sena'), icon: GraduationCap, color: '#004B63' },
        { id: 2, name: 'UNESCO', category: t('aliados.category_unesco'), icon: Globe, color: '#4DA8C4' },
        { id: 3, name: 'Ministerio', category: t('aliados.category_ministerio'), icon: Building2, color: '#66CCCC' },
        { id: 4, name: 'Google', category: t('aliados.category_google'), icon: Search, color: '#004B63' },
        { id: 5, name: 'Microsoft', category: t('aliados.category_microsoft'), icon: Cloud, color: '#4DA8C4' },
        { id: 6, name: 'AWS', category: t('aliados.category_aws'), icon: Cloud, color: '#66CCCC' },
        { id: 7, name: 'ICETEX', category: t('aliados.category_icetex'), icon: Award, color: '#004B63' },
        { id: 8, name: 'Colciencias', category: t('aliados.category_colciencias'), icon: FlaskConical, color: '#4DA8C4' },
        { id: 9, name: 'Apple', category: t('aliados.category_apple'), icon: Laptop, color: '#66CCCC' },
        { id: 10, name: 'IBM', category: t('aliados.category_ibm'), icon: Cpu, color: '#004B63' },
        { id: 11, name: 'Coursera', category: t('aliados.category_coursera'), icon: Sparkles, color: '#4DA8C4' },
        { id: 12, name: 'Steam', category: t('aliados.category_steam'), icon: Cpu, color: '#66CCCC' },
    ];

    const duplicatedAliados = [...aliados, ...aliados, ...aliados];

    return (
        <section id="aliados" ref={sectionRef} className="relative w-full py-12 lg:py-16 overflow-hidden bg-bg-light">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(77,168,196,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_50%,rgba(0,75,99,0.05)_0%,transparent_50%)]" />
            
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #004B63 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-primary-light" />
                        <span className="text-sm font-bold text-primary-light uppercase tracking-widest block mb-2">
                            {t('aliados.badge')}
                        </span>
                        <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-primary-light" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-petroleum tracking-tighter mb-3">
                        {t('aliados.title_before')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum">
                            {t('aliados.title_highlight')}
                        </span>
                    </h2>
                </div>

                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-bg-light to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-bg-light to-transparent pointer-events-none" />

                    <div 
                        ref={marqueeRef}
                        className="overflow-hidden"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div 
                            className="flex gap-4 py-2"
                            style={{
                                animation: isPaused ? 'none' : 'marquee 40s linear infinite',
                            }}
                        >
                            {duplicatedAliados.map((aliado, index) => (
                                <div 
                                    key={`${aliado.id}-${index}`}
                                    className="group flex-shrink-0 badge-clay bg-white/60 backdrop-blur-md p-2.5 flex items-center gap-2.5"
                                    style={{ minWidth: '190px' }}
                                >
                                    <div 
                                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm"
                                        style={{
                                            background: `linear-gradient(135deg, ${aliado.color}20, ${aliado.color}10)`,
                                            border: `1px solid ${aliado.color}30`
                                        }}
                                    >
                                        <aliado.icon 
                                            className="text-base transition-all duration-300 group-hover:scale-110" 
                                            style={{ color: aliado.color }}
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <span className="font-bold text-petroleum group-hover:text-primary-light transition-colors duration-300">{aliado.name}</span>
                                        <span className="font-mono text-xs tracking-widest text-gray-600 uppercase">
                                            {aliado.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}</style>
        </section>
    );
});

Aliados.displayName = 'Aliados';

export default Aliados;
