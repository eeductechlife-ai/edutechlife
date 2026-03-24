import { useState, useEffect, useRef } from 'react';
import { Icon } from '../utils/iconMapping.jsx';

const plans = [
    {
        id: 'basico',
        name: 'Estudiante',
        price: '99.000',
        period: 'mes',
        description: 'Para individuos que quieren transformar su aprendizaje personal.',
        features: [
            'Diagnóstico VAK completo',
            'Análisis de perfil de aprendizaje',
            'Plan de estudio personalizado',
            'Acceso a contenido STEAM',
            'Chat con Valerio (50 msgs/mes)',
            'Certificado de finalización',
        ],
        notIncluded: [
            'Proyectos de impacto nacional',
            'Consultoría B2B',
            'API de agentes personalizados',
        ],
        popular: false,
        color: '#4DA8C4',
    },
    {
        id: 'profesional',
        name: 'Educador',
        price: '199.000',
        period: 'mes',
        description: 'Para docentes y educadores que revolucionan su aula.',
        features: [
            'Todo lo de Estudiante',
            'SmartBoard con análisis de IA',
            'Creación de contenidos VAK',
            'Hasta 100 estudiantes',
            'Chat con Valerio (ilimitado)',
            'Reportes de progreso',
            'Certificaciones IBM/Coursera',
            'Soporte prioritario',
        ],
        notIncluded: [
            'Consultoría B2B',
        ],
        popular: true,
        color: '#66CCCC',
    },
    {
        id: 'institucional',
        name: 'Institución',
        price: '499.000',
        period: 'mes',
        description: 'Para colegios, universidades y empresas.',
        features: [
            'Todo lo de Educador',
            'Usuarios ilimitados',
            'API de agentes personalizados',
            'Proyectos de impacto nacional',
            'Consultoría B2B incluida',
            'Dashboard administrativo',
            'Integración con sistemas existentes',
            'Gerente de cuenta dedicado',
            'SLA de respuesta 24/7',
        ],
        notIncluded: [],
        popular: false,
        color: '#004B63',
    },
];

const faqs = [
    {
        question:             '¿Cómo funciona el Diagnóstico VAK?',
            answer: 'El Diagnóstico VAK evalúa tus preferencias de aprendizaje en tres canales: Visual (imágenes y gráficos), Auditivo (sonidos y verbalizaciones) y Kinestésico (experiencias prácticas). Completarlo toma aproximadamente 15 minutos y te proporciona un perfil detallado con recomendaciones personalizadas.',
    },
    {
        question: '¿Qué es el método STEAM?',
        answer: 'STEAM es un enfoque educativo que integra cinco disciplinas: Ciencia, Tecnología, Ingeniería, Artes y Matemáticas. En Edutechlife, aplicamos STEAM con metodologías VAK para crear experiencias de aprendizaje que se adaptan a cada estudiante.',
    },
    {
        question: '¿Puedo cancelar en cualquier momento?',
        answer: 'Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. No hay permanencia mínima ni costos de cancelación. Si cancelas, mantienes acceso hasta el final del período pagado.',
    },
    {
        question: '¿Las certificaciones son reconocidas internacionalmente?',
        answer: 'Sí, emitimos certificaciones en colaboración con IBM y Coursera que son reconocidas internacionalmente. Además, como operadores oficiales SenaTIC, nuestras certificaciones tienen validez oficial en Colombia.',
    },
    {
        question: '¿Cómo funciona el coaching con Valerio?',
        answer: 'Valerio es tu coach virtual basado en IA, entrenado con metodologías socráticas y pedagógicas. Puede responder preguntas sobre学习方法, analizar documentos, crear planes de estudio y guiarte a través de tu proceso de aprendizaje.',
    },
    {
        question: '¿Ofrecen descuentos para grupos o instituciones??',
        answer: 'Sí, tenemos planes especiales para grupos de 10+ personas y descuentos institucionales para colegios y universidades. Contáctanos para una cotización personalizada.',
    },
];

const Pricing = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [openFaq, setOpenFaq] = useState(null);
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
        <section
            ref={sectionRef}
            className="py-24 px-5% relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
            }}
        >
            {/* Pricing Section */}
            <div className="max-w-7xl mx-auto mb-24">
                {/* Header */}
                <div
                    className={`text-center mb-12 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                        <span className="font-mono text-xs font-normal uppercase tracking-[0.3em] text-[#4DA8C4]">
                            Planes y Precios
                        </span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#4DA8C4]" />
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004B63] tracking-tight mb-4">
                        Elige Tu Camino Hacia
                        <span className="block mt-2" style={{
                            background: 'linear-gradient(135deg, #4DA8C4 0%, #66CCCC 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            La Excelencia
                        </span>
                    </h2>

                    <p className="text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto mb-8">
                        Desde estudiantes individuales hasta instituciones completas, tenemos el plan perfecto para ti.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-4 p-1 bg-white rounded-full border border-[rgba(0,75,99,0.12)]">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-6 py-2 rounded-full font-montserrat font-normal text-sm transition-all ${
                                billingPeriod === 'monthly'
                                    ? 'bg-[#4DA8C4] text-white'
                                    : 'text-[#64748B] hover:text-[#004B63]'
                            }`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setBillingPeriod('annual')}
                            className={`px-6 py-2 rounded-full font-montserrat font-normal text-sm transition-all ${
                                billingPeriod === 'annual'
                                    ? 'bg-[#4DA8C4] text-white'
                                    : 'text-[#64748B] hover:text-[#004B63]'
                            }`}
                        >
                            Anual
                            <span className="ml-2 text-xs bg-[#10B981] text-white px-2 py-0.5 rounded-full">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div
                            key={plan.id}
                            className={`relative transition-all duration-700 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            {plan.popular && (
                                <div
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-mono font-bold uppercase tracking-wider z-10"
                                    style={{ background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)' }}
                                >
                                    Más Popular
                                </div>
                            )}

                            <div
                                className={`relative h-full bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                                    plan.popular
                                        ? 'border-[#4DA8C4] shadow-xl'
                                        : 'border-[rgba(0,75,99,0.08)] hover:border-[rgba(77,168,196,0.3)]'
                                }`}
                            >
                                {/* Plan Header */}
                                <div className="text-center mb-8">
                                    <h3
                                        className="font-montserrat text-xl font-normal mb-2"
                                        style={{ color: plan.color }}
                                    >
                                        {plan.name}
                                    </h3>
                                    <p className="text-base text-slate-600 mb-6">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-[#64748B] text-lg">$</span>
                                        <span
                                            className="font-montserrat text-4xl font-black text-[#004B63]"
                                        >
                                            {billingPeriod === 'annual'
                                                ? Math.floor(Number(plan.price) * 0.8).toLocaleString()
                                                : Number(plan.price).toLocaleString()}
                                        </span>
                                        <span className="text-[#64748B] text-sm">/{plan.period}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, fi) => (
                                        <li key={fi} className="flex items-start gap-3">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                                style={{ background: `${plan.color}20` }}
                                            >
                                                <Icon
                                                    name="fa-check"
                                                    className="text-xs"
                                                    style={{ color: plan.color }}
                                                />
                                            </div>
                                            <span className="text-[#4A4A4A] text-sm">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.notIncluded.map((feature, fi) => (
                                        <li key={fi} className="flex items-start gap-3 opacity-40">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#F1F5F9]">
                                                <Icon name="fa-xmark" className="text-xs text-[#64748B]" />
                                            </div>
                                            <span className="text-[#64748B] text-sm line-through">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    className={`w-full py-4 rounded-xl font-montserrat font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                                        plan.popular
                                            ? 'text-white shadow-lg hover:shadow-xl'
                                            : 'text-white hover:shadow-lg'
                                    }`}
                                    style={{
                                        background: plan.popular
                                            ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`
                                            : plan.color,
                                    }}
                                >
                                    Comenzar Ahora
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto">
                <div
                    className={`text-center mb-12 transition-all duration-1000 delay-200 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <h3 className="font-montserrat text-3xl font-black text-[#004B63] mb-2">
                        Preguntas Frecuentes
                    </h3>
                    <p className="text-base text-slate-600">
                        Resolvemos tus dudas más comunes
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`bg-white rounded-2xl border border-[rgba(0,75,99,0.08)] overflow-hidden transition-all duration-300 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                            style={{ transitionDelay: `${300 + i * 100}ms` }}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                            >
                                <span className="font-montserrat font-normal text-[#004B63] pr-4">
                                    {faq.question}
                                </span>
                                <Icon
                                    name="fa-chevron-down"
                                    className={`text-sm text-[#4DA8C4] transition-transform duration-300 ${
                                        openFaq === i ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    openFaq === i ? 'max-h-48' : 'max-h-0'
                                }`}
                            >
                                <p className="px-6 pb-5 text-[#64748B] leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-12">
                    <p className="text-[#64748B] mb-4">
                        ¿No encontraste lo que buscabas?
                    </p>
                    <a
                        href="#contacto"
                        className="inline-flex items-center gap-2 text-[#4DA8C4] font-montserrat font-normal hover:underline"
                    >
                        <Icon name="fa-envelope" />
                        Contáctanos directamente
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
