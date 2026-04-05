import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValerioAvatar from './ValerioAvatar';
import DiagnosticoVAK from './DiagnosticoVAK/DiagnosticoVAK';
import { callDeepseek } from '../utils/api';
import FloatingParticles from './FloatingParticles';
import MagneticButton from './MagneticButton';
import SplitTextReveal from './SplitTextReveal';

const contentByStyle = {
    visual: {
        title: "Estilo Visual",
        icon: "fa-eye",
        color: "#4DA8C4",
        strategies: [
            "Usa mapas mentales y diagramas de colores",
            "Graba videos o screencasts de tus clases",
            "Utiliza tarjetas con imágenes y palabras clave",
            "Resalta con colores diferentes según importancia",
            "Crea infografías para resumir temas",
        ],
        tools: ["Canva", "Miro", "Notion", "Genially"],
    },
    auditory: {
        title: "Estilo Auditivo",
        icon: "fa-ear-listen",
        color: "#66CCCC",
        strategies: [
            "Graba tus explicaciones y escúchalas después",
            "Participa en debates y discusiones",
            "Usa podcasts educativos mientras haces otras tareas",
            "Explica los temas en voz alta a alguien",
            "Utiliza música instrumental mientras estudias",
        ],
        tools: ["Audacity", "Spotify", "YouTube", "Podcasts"],
    },
    kinesthetic: {
        title: "Estilo Kinestésico",
        icon: "fa-hand",
        color: "#004B63",
        strategies: [
            "Toma notas a mano, no en laptop",
            "Usa fichas físicas para memorizar",
            "Incluye pausas activas y movimiento",
            "Simula situaciones reales de aplicación",
            "Usa modelos 3D o réplicas físicas",
        ],
        tools: ["Anki", "Quizlet", "Tinkercad", "Figma"],
    },
};

const testimoniosVAK = [
    {
        nombre: 'María Elena Gómez',
        rol: 'Docente I.E. San José - Bogotá',
        texto: 'Gracias a la metodología VAK y el test del Neuro-Entorno pude transformar mis clases. Ahora llegan a estudiantes que antes no conectaban con el contenido. Mis resultados en pruebas Saber mejoraron un 35%.',
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
        perfil: 'Auditivo',
        resultado: '+35% desempeño'
    },
    {
        nombre: 'Carlos Andrés Ríos',
        rol: 'Estudiante - Medellín',
        texto: 'El Diagnóstico VAK me reveló que soy kinestésico. Nunca lo había considerado, pero ahora estudio de forma completamente diferente y mis calificaciones subieron notablemente.',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        perfil: 'Kinestésico',
        resultado: '+2 puntos GPA'
    },
    {
        nombre: 'Laura Patricia Vega',
        rol: 'Rectora I.E. Normal Superior - Cali',
        texto: 'Implementamos el programa en toda la institución. Los docentes ahora comprenden cómo aprenden sus estudiantes y adaptan sus metodologías. Es revolucionario.',
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
        perfil: 'Visual',
        resultado: '200+ docentes'
    },
    {
        nombre: 'Juan Sebastián Martínez',
        rol: 'Estudiante Universidad Nacional',
        texto: 'Como estudiante universitario, el coaching con Valerio me ayudó a organizar mi tiempo y descubrir que soy un aprendiz multimodal. Las estrategias personalizadas marcaron la diferencia.',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        perfil: 'Multimodal',
        resultado: 'Graduación honrosa'
    },
];

const NeuroEntorno = ({ onBack, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [testResult, setTestResult] = useState(null);
    const [coachQ, setCoachQ] = useState('');
    const [coachMsg, setCoachMsg] = useState('');
    const [coachLoad, setCoachLoad] = useState(false);
    const [avatarState, setAvatarState] = useState('idle');
    const [showDiagnostico, setShowDiagnostico] = useState(false);

    const handleNeuroEntornoNavigate = (view) => {
        if (view === 'neuroentorno') {
            setActiveTab('diagnostico');
            setShowDiagnostico(false);
            window.scrollTo(0, 0);
        } else if (onNavigate) {
            onNavigate(view);
        }
    };
    const [fullDiagnostico, setFullDiagnostico] = useState(false);

    const askCoach = async () => {
        if (!coachQ.trim()) return;
        setCoachLoad(true);
        setAvatarState('thinking');
        
        try {
            const prompt = `Estudiante pregunta sobre Neuro-Entorno y aprendizaje VAK: ${coachQ}
Eres Valerio, mentor educativo experto en neuroeducación y metodologías VAK de Edutechlife. Responde de forma empática, práctica y con ejemplos específicos.`;
            const r = await callDeepseek(prompt, 'Eres un mentor educativo cálido y experto.', false);
            setCoachMsg(r);
            setAvatarState('speaking');
            setTimeout(() => setAvatarState('idle'), 3000);
        } catch (e) {
            console.error('Error asking coach:', e);
        }
        
        setCoachLoad(false);
    };

    const features = [
        { icon: 'fa-brain', title: 'Diagnóstico VAK Automatizado', desc: '10 preguntas científico-pedagógicas que determinan tu perfil de aprendizaje' },
        { icon: 'fa-user-check', title: 'Perfil Personalizado', desc: 'Análisis profundo con porcentajes de cada estilo de aprendizaje' },
        { icon: 'fa-book-open', title: 'Contenido Adaptado', desc: 'Recursos educativos diseñados para tu perfil específico' },
        { icon: 'fa-chart-line', title: 'Seguimiento Neuro', desc: 'Métricas de progreso basadas en indicadores neurocognitivos' },
    ];

    return (
        <div className="pillar-page">
            {/* ==================== HERO PREMIUM NEUROENTORNO ==================== */}
            <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#B2D8E5] via-[#E8F4F8] to-[#B2D8E5]">
                
                {/* Premium Back Button - Top Left of Hero with Dynamic Effects */}
                <motion.button
                    onClick={onBack}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                        transition: { 
                            type: "spring", 
                            stiffness: 200, 
                            damping: 15 
                        }
                    }}
                    whileHover={{ 
                        x: 5, 
                        scale: 1.05, 
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 10px 30px rgba(0, 75, 99, 0.25)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group absolute top-8 left-8 flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 backdrop-blur-xl border-2 border-[#004B63] text-[#004B63] font-bold hover:border-[#4DA8C4] transition-all duration-500 z-30 shadow-premium-lg hover:shadow-premium-xl"
                >
                    {/* Animated Arrow */}
                    <motion.div
                        animate={{ x: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="relative"
                    >
                        <i className="fa-solid fa-arrow-left text-lg group-hover:text-xl transition-all duration-500" />
                        <div className="absolute -inset-1 bg-[#4DA8C4]/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                    
                    {/* Animated Text */}
                    <motion.span
                        className="relative overflow-hidden"
                    >
                        <span className="relative z-10">Volver</span>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#4DA8C4]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </motion.span>
                    
                    {/* Hover Sparkles */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4DA8C4] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[sparkle_1s_ease-in-out]" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#66CCCC] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[sparkle_1s_ease-in-out]" style={{ animationDelay: '0.3s' }} />
                </motion.button>
                {/* Floating Particles Background */}
                <FloatingParticles count={35} className="z-0" colors={['#004B63', '#2D7A94', '#0B2A3A']} />
                
                {/* Ambient Elements - Premium Glow Effects */}
                <div className="absolute top-[10%] left-[5%] w-4 h-4 bg-[#004B63]/30 rounded-full animate-[float-3d_8s_ease-in-out_infinite] blur-sm" style={{ animationDelay: '-2s' }} />
                <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-[#2D7A94]/25 rounded-full animate-[float-3d_10s_ease-in-out_infinite] blur-sm" style={{ animationDelay: '-1s' }} />
                <div className="absolute bottom-[25%] left-[10%] w-5 h-5 bg-[#0B2A3A]/20 rounded-full animate-[float-3d_12s_ease-in-out_infinite] blur-sm" style={{ animationDelay: '-3s' }} />
                <div className="absolute top-[15%] right-[10%] w-4 h-4 bg-[#004B63]/30 rounded-full animate-[float-3d_9s_ease-in-out_infinite] blur-sm" />
                <div className="absolute top-[35%] right-[5%] w-3 h-3 bg-[#2D7A94]/25 rounded-full animate-[float-3d_11s_ease-in-out_infinite] blur-sm" />
                <div className="absolute bottom-[30%] right-[15%] w-5 h-5 bg-[#0B2A3A]/20 rounded-full animate-[float-3d_13s_ease-in-out_infinite] blur-sm" />
                
                {/* Center Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-radial from-[#004B63]/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
                
                {/* Main Content Container */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    
                    {/* Two Column Premium Layout */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center w-full">
                        
                        {/* ===== LEFT COLUMN: Premium Diagnosis Card ===== */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="flex-1 max-w-lg w-full"
                        >
                            <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/30 rounded-2xl p-4 shadow-premium-md">
                                {/* Premium Animated Badge - REALÍZALO GRÁTIS */}
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-4 bg-gradient-to-r from-[#004B63] via-[#2D7A94] to-[#004B63] text-white shadow-premium-lg border border-[#4DA8C4]/50 cursor-pointer"
                                >
                                    {/* Animated Gift Icon */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                        className="relative"
                                    >
                                        <i className="fa-solid fa-gift text-sm text-[#66CCCC] group-hover:text-white transition-all duration-500" />
                                        <div className="absolute -inset-2 bg-[#66CCCC]/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </motion.div>
                                    
                                    {/* Animated Text */}
                                    <motion.span 
                                        className="text-sm font-bold uppercase tracking-[0.15em] text-white"
                                        whileHover={{ letterSpacing: "0.2em" }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        REALÍZALO GRÁTIS
                                    </motion.span>
                                    
                                    {/* Sparkle Effect */}
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#66CCCC] rounded-full animate-[sparkle_1s_ease-in-out]" />
                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-[sparkle_1s_ease-in-out]" style={{ animationDelay: '0.3s' }} />
                                </motion.div>
                                
                                {/* Premium Title - Unified Style */}
                                <motion.h2 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-2xl lg:text-3xl font-black text-[#004B63] mt-2 mb-4 font-montserrat tracking-tight leading-tight"
                                >
                                    Estilo de Aprendizaje VAK
                                </motion.h2>
                                
                                {/* Premium VAK Cards Grid - Enhanced with Dynamic Animations */}
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    {/* Visual Card - Premium Enhanced */}
                                    <motion.div 
                                        whileHover={{ y: -8, scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={{ 
                                            y: [0, -3, 0],
                                            transition: { 
                                                duration: 4, 
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                ease: "easeInOut"
                                            }
                                        }}
                                        className="group relative overflow-hidden rounded-xl p-4 text-center cursor-pointer shadow-premium-lg hover:shadow-premium-xl transition-all duration-500"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #004B63 0%, #2D7A94 100%)',
                                            boxShadow: '0 10px 25px rgba(0, 75, 99, 0.2)'
                                        }}
                                    >
                                        {/* Animated Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        {/* Premium Icon with Glow Effect */}
                                        <div className="relative mb-3">
                                            <div className="absolute inset-0 w-14 h-14 mx-auto bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                            <div className="relative w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30">
                                                <i className="fa-solid fa-eye text-white text-2xl group-hover:text-3xl transition-all duration-500" />
                                            </div>
                                        </div>
                                        
                                        <div className="text-white font-bold text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.2em] transition-all duration-500">VISUAL</div>
                                        <div className="text-white/70 text-xs font-medium mt-1">Ver para aprender</div>
                                        
                                        {/* Animated Border */}
                                        <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-500" />
                                    </motion.div>
                                    
                                    {/* Auditivo Card - Premium Enhanced */}
                                    <motion.div 
                                        whileHover={{ y: -8, scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={{ 
                                            y: [0, -3, 0],
                                            transition: { 
                                                duration: 4, 
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                ease: "easeInOut",
                                                delay: 0.5
                                            }
                                        }}
                                        className="group relative overflow-hidden rounded-xl p-4 text-center cursor-pointer shadow-premium-lg hover:shadow-premium-xl transition-all duration-500"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #2D7A94 0%, #004B63 100%)',
                                            boxShadow: '0 10px 25px rgba(45, 122, 148, 0.2)'
                                        }}
                                    >
                                        {/* Animated Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        {/* Premium Icon with Glow Effect */}
                                        <div className="relative mb-3">
                                            <div className="absolute inset-0 w-14 h-14 mx-auto bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                            <div className="relative w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30">
                                                <i className="fa-solid fa-ear-listen text-white text-2xl group-hover:text-3xl transition-all duration-500" />
                                            </div>
                                        </div>
                                        
                                        <div className="text-white font-bold text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.2em] transition-all duration-500">AUDITIVO</div>
                                        <div className="text-white/70 text-xs font-medium mt-1">Escuchar para comprender</div>
                                        
                                        {/* Animated Border */}
                                        <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-500" />
                                    </motion.div>
                                    
                                    {/* Kinestésico Card - Premium Enhanced */}
                                    <motion.div 
                                        whileHover={{ y: -8, scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={{ 
                                            y: [0, -3, 0],
                                            transition: { 
                                                duration: 4, 
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                ease: "easeInOut",
                                                delay: 1
                                            }
                                        }}
                                        className="group relative overflow-hidden rounded-xl p-4 text-center cursor-pointer shadow-premium-lg hover:shadow-premium-xl transition-all duration-500"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #0B2A3A 0%, #004B63 100%)',
                                            boxShadow: '0 10px 25px rgba(11, 42, 58, 0.2)'
                                        }}
                                    >
                                        {/* Animated Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        {/* Premium Icon with Glow Effect */}
                                        <div className="relative mb-3">
                                            <div className="absolute inset-0 w-14 h-14 mx-auto bg-gradient-to-r from-[#B2D8E5] to-[#66CCCC] rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                            <div className="relative w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30">
                                                <i className="fa-solid fa-hand text-white text-2xl group-hover:text-3xl transition-all duration-500" />
                                            </div>
                                        </div>
                                        
                                        <div className="text-white font-bold text-sm uppercase tracking-[0.15em] group-hover:tracking-[0.2em] transition-all duration-500">KINEST</div>
                                        <div className="text-white/70 text-xs font-medium mt-1">Hacer para internalizar</div>
                                        
                                        {/* Animated Border */}
                                        <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-500" />
                                    </motion.div>
                                </div>
                                
                                {/* Premium Magnetic Button - Dynamic Premium Effects */}
                                <MagneticButton 
                                    onClick={() => onNavigate('vak')}
                                    className="group relative overflow-hidden w-full flex items-center justify-center gap-3 px-8 py-3 rounded-full text-base font-bold mb-4 border-2 border-[#004B63] hover:border-[#4DA8C4] transition-all duration-500"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FDFF 50%, #E8F4F8 100%)',
                                        color: '#004B63',
                                        boxShadow: '0 8px 20px rgba(0, 75, 99, 0.15)'
                                    }}
                                >
                                    {/* Animated Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#4DA8C4]/0 via-[#4DA8C4]/10 to-[#66CCCC]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    
                                    {/* Button Content */}
                                    <motion.span 
                                        className="relative z-10 font-semibold"
                                        style={{ color: '#004B63' }}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        Comenzar Evaluación
                                    </motion.span>
                                    
                                    {/* Animated Arrow */}
                                    <motion.div
                                        className="relative z-10"
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                    >
                                        <i className="fa-solid fa-arrow-right text-sm" style={{ color: '#004B63' }} />
                                    </motion.div>
                                </MagneticButton>
                                
                                {/* Premium Animated Stats - Increased Size */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                    className="flex justify-center gap-6 flex-wrap"
                                >
                                    {/* Time Stat */}
                                    <motion.div 
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <i className="fa-solid fa-clock text-[#004B63] text-base" />
                                        <span className="text-[#004B63] font-bold text-sm">3 min</span>
                                    </motion.div>
                                    
                                    {/* Questions Stat */}
                                    <motion.div 
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                    >
                                        <i className="fa-solid fa-circle-question text-[#2D7A94] text-base" />
                                        <span className="text-[#004B63] font-bold text-sm">10 preguntas</span>
                                    </motion.div>
                                    
                                    {/* Personalization Stat */}
                                    <motion.div 
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                                    >
                                        <i className="fa-solid fa-bullseye text-[#0B2A3A] text-base" />
                                        <span className="text-[#004B63] font-bold text-sm">100% personal</span>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                        
                        {/* ===== RIGHT COLUMN: Premium VAK Information - Natural Text ===== */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex-1 max-w-lg w-full text-[#004B63]"
                        >
                            <div className="p-4">
                                {/* Premium Animated Title */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.2 }}
                                    className="mb-6"
                                >
                                    <h1 className="text-2xl lg:text-3xl font-black mb-3 font-montserrat tracking-tight leading-tight text-[#004B63]">
                                        <SplitTextReveal text="¿Qué es el método VAK?" />
                                    </h1>
                                    
                                    {/* Animated Underline */}
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "60%" }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-0.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
                                    />
                                </motion.div>
                                
                                {/* Premium Animated Description */}
                                <motion.p 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="text-base sm:text-lg leading-relaxed mb-6 font-medium text-[#0B2A3A]"
                                >
                                    VAK es un modelo neuropsicológico que identifica cómo procesa información cada persona de manera única.
                                </motion.p>
                                
                                {/* Premium List with Enhanced Animated Icons - Dynamic Premium Effects */}
                                <ul className="space-y-4 mb-6">
                                    <motion.li 
                                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        className="group flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-sm border border-white/30 hover:border-[#004B63]/30 transition-all duration-500"
                                    >
                                        {/* Premium Visual Icon with Dynamic Effects */}
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-[float-3d_6s_ease-in-out_infinite]" />
                                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-premium-lg group-hover:shadow-premium-xl transition-all duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
                                                <i className="fa-solid fa-eye text-white text-2xl group-hover:text-3xl group-hover:animate-[pulse_2s_ease-in-out_infinite] transition-all duration-500" />
                                            </div>
                                            {/* Floating Particles */}
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-[float-mini_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
                                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-[float-mini_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }} />
                                        </div>
                                        <div className="pt-1 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-base text-[#004B63] group-hover:text-[#0B2A3A] transition-colors duration-500">Visual:</span>
                                                <div className="w-1.5 h-1.5 bg-[#4DA8C4] rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </div>
                                            <p className="text-[#004B63]/90 text-sm leading-relaxed font-medium group-hover:text-[#004B63] transition-colors duration-500">
                                                Aprende mejor con imágenes, gráficos y contenido visual organizado
                                            </p>
                                        </div>
                                    </motion.li>
                                    
                                    <motion.li 
                                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        className="group flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-sm border border-white/30 hover:border-[#2D7A94]/30 transition-all duration-500"
                                    >
                                        {/* Premium Auditivo Icon with Dynamic Effects */}
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-[float-3d_7s_ease-in_out_infinite]" style={{ animationDelay: '0.5s' }} />
                                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-premium-lg group-hover:shadow-premium-xl transition-all duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
                                                <i className="fa-solid fa-ear-listen text-white text-2xl group-hover:text-3xl group-hover:animate-[bounce_2s_ease-in-out_infinite] transition-all duration-500" />
                                            </div>
                                            {/* Floating Particles */}
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-[float-mini_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
                                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-[float-mini_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }} />
                                        </div>
                                        <div className="pt-1 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-base text-[#004B63] group-hover:text-[#0B2A3A] transition-colors duration-500">Auditivo:</span>
                                                <div className="w-1.5 h-1.5 bg-[#66CCCC] rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '0.3s' }} />
                                            </div>
                                            <p className="text-[#004B63]/90 text-sm leading-relaxed font-medium group-hover:text-[#004B63] transition-colors duration-500">
                                                Aprende mejor con sonidos, explicaciones verbales y discusiones
                                            </p>
                                        </div>
                                    </motion.li>
                                    
                                    <motion.li 
                                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 100 }}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        className="group flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-sm border border-white/30 hover:border-[#0B2A3A]/30 transition-all duration-500"
                                    >
                                        {/* Premium Kinestésico Icon with Dynamic Effects */}
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-[#B2D8E5] to-[#66CCCC] rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
                                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-premium-lg group-hover:shadow-premium-xl transition-all duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
                                                <i className="fa-solid fa-hand text-white text-2xl group-hover:text-3xl group-hover:animate-[shake_2s_ease-in-out_infinite] transition-all duration-500" />
                                            </div>
                                            {/* Floating Particles */}
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-[float-mini_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
                                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-[float-mini_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }} />
                                        </div>
                                        <div className="pt-1 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-base text-[#004B63] group-hover:text-[#0B2A3A] transition-colors duration-500">Kinestésico:</span>
                                                <div className="w-1.5 h-1.5 bg-[#B2D8E5] rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '0.6s' }} />
                                            </div>
                                            <p className="text-[#004B63]/90 text-sm leading-relaxed font-medium group-hover:text-[#004B63] transition-colors duration-500">
                                                Aprende mejor con experiencias prácticas, movimiento y manipulación
                                            </p>
                                        </div>
                                    </motion.li>
                                </ul>
                                
                                {/* Premium Animated Callout */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
                                    className="pt-6 mt-6 border-t border-[#004B63]/20"
                                >
                                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-lg border border-white/30 shadow-premium-lg">
                                        {/* Animated Quote Marks */}
                                        <div className="absolute top-2 left-3 text-3xl text-[#4DA8C4]/30 font-serif">"</div>
                                        <div className="absolute bottom-2 right-3 text-3xl text-[#66CCCC]/30 font-serif">"</div>
                                        
                                        {/* Callout Text */}
                                        <p className="text-sm italic text-center font-medium text-[#0B2A3A] leading-relaxed px-4">
                                            <span className="font-semibold text-[#004B63]">Conocer tu estilo VAK</span> te permite estudiar de forma más eficiente y personalizada, optimizando tu proceso de aprendizaje.
                                        </p>
                                        
                                        {/* Animated Dots */}
                                        <div className="flex justify-center gap-2 mt-3">
                                            <div className="w-1.5 h-1.5 bg-[#4DA8C4] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
                                            <div className="w-1.5 h-1.5 bg-[#66CCCC] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-1.5 h-1.5 bg-[#B2D8E5] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="pillar-tabs">
                <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                    <i className="fa-solid fa-info-circle" />
                    Información
                </button>
                <button className={`tab-btn ${activeTab === 'testimonios' ? 'active' : ''}`} onClick={() => setActiveTab('testimonios')}>
                    <i className="fa-solid fa-comments" />
                    Testimonios
                </button>
            </div>

            <div className="pillar-content">
                {activeTab === 'diagnostico' && (
                    <DiagnosticoVAK onNavigate={handleNeuroEntornoNavigate} />
                )}

                {activeTab === 'info' && (
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon">
                                    <i className={`fa-solid ${f.icon}`} />
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'test' && (
                    <div className="vak-test-container">
                        {showDiagnostico ? (
                            <DiagnosticoVAK 
                                onNavigate={handleNeuroEntornoNavigate}
                            />
                        ) : (
                            <div className="vak-results-ready">
                                <p>Ya completaste el test. Ve a "Mi Perfil" para ver tus resultados.</p>
                                <button 
                                    onClick={() => setActiveTab('results')}
                                    className="px-6 py-3 rounded-full font-montserrat font-bold text-white"
                                    style={{ background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)' }}
                                >
                                    Ver Mi Perfil
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'results' && testResult && (
                    <div className="profile-results">
                        <div className="profile-main-card">
                            <div className="profile-type-badge" style={{ 
                                background: contentByStyle[testResult.perfil.toLowerCase()]?.color || '#4DA8C4' 
                            }}>
                                <i className={`fa-solid ${contentByStyle[testResult.perfil.toLowerCase()]?.icon || 'fa-brain'}`} />
                                <span>{testResult.perfil}</span>
                            </div>

                            <div className="profile-percentages">
                                <div className="percentage-bar">
                                    <span>Visual</span>
                                    <div className="bar-container">
                                        <div className="bar-fill" style={{ width: `${testResult.porcentajes?.visual || 0}%`, background: '#4DA8C4' }} />
                                    </div>
                                    <span className="percentage">{testResult.porcentajes?.visual || 0}%</span>
                                </div>
                                <div className="percentage-bar">
                                    <span>Auditivo</span>
                                    <div className="bar-container">
                                        <div className="bar-fill" style={{ width: `${testResult.porcentajes?.auditivo || 0}%`, background: '#66CCCC' }} />
                                    </div>
                                    <span className="percentage">{testResult.porcentajes?.auditivo || 0}%</span>
                                </div>
                                <div className="percentage-bar">
                                    <span>Kinestésico</span>
                                    <div className="bar-container">
                                        <div className="bar-fill" style={{ width: `${testResult.porcentajes?.kinestesico || 0}%`, background: '#004B63' }} />
                                    </div>
                                    <span className="percentage">{testResult.porcentajes?.kinestesico || 0}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-grid">
                            <div className="profile-card">
                                <h4><i className="fa-solid fa-star" style={{ color: '#10B981' }} /> Fortalezas</h4>
                                <ul>
                                    {testResult.fortalezas?.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                            <div className="profile-card">
                                <h4><i className="fa-solid fa-chart-line" style={{ color: '#F59E0B' }} /> Áreas de Mejora</h4>
                                <ul>
                                    {testResult.areasMejora?.map((a, i) => <li key={i}>{a}</li>)}
                                </ul>
                            </div>
                            <div className="profile-card full">
                                <h4><i className="fa-solid fa-lightbulb" style={{ color: '#4DA8C4' }} /> Estrategias de Estudio</h4>
                                <ul className="recommendations">
                                    {testResult.recomendaciones?.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'testimonios' && (
                    <div className="testimonios-vak-section">
                        <div className="testimonios-header-vak">
                            <h2>Historias de Transformación</h2>
                            <p>Descubre cómo la metodología VAK ha cambiado la forma de aprender de miles de estudiantes y docentes</p>
                        </div>
                        <div className="testimonios-vak-grid">
                            {testimoniosVAK.map((t, i) => (
                                <div key={i} className="testimonio-vak-card">
                                    <div className="testimonio-vak-header">
                                        <img src={t.img} alt={t.nombre} />
                                        <div className="testimonio-vak-info">
                                            <h4>{t.nombre}</h4>
                                            <span>{t.rol}</span>
                                        </div>
                                    </div>
                                    <p className="testimonio-vak-texto">"{t.texto}"</p>
                                    <div className="testimonio-vak-footer">
                                        <span className="perfil-badge">{t.perfil}</span>
                                        <span className="resultado-badge">
                                            <i className="fa-solid fa-arrow-trend-up" />
                                            {t.resultado}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="testimonios-cta">
                            <p>¿Listo para escribir tu propia historia de éxito?</p>
                            <button 
                                onClick={() => { setActiveTab('test'); setShowDiagnostico(true); }}
                                className="cta-testimonials"
                            >
                                <i className="fa-solid fa-rocket" />
                                Realizar Diagnóstico VAK
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .vak-test-container {
                    max-width: 700px;
                    margin: 0 auto;
                }
                .vak-test-card {
                    background: white;
                    border-radius: 2rem;
                    padding: 3rem;
                    border: 1px solid rgba(0,75,99,0.08);
                    box-shadow: 0 20px 50px rgba(0,75,99,0.1);
                }
                .vak-progress {
                    height: 8px;
                    background: rgba(0,75,99,0.08);
                    border-radius: 4px;
                    margin-bottom: 1.5rem;
                    overflow: hidden;
                }
                .vak-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #4DA8C4, #66CCCC);
                    border-radius: 4px;
                    transition: width 0.5s ease;
                }
                .vak-step-indicator {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.75rem;
                    color: #64748B;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                }
                .vak-question {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #004B63;
                    margin-bottom: 2rem;
                    line-height: 1.4;
                }
                .vak-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .vak-option {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem;
                    background: white;
                    border: 2px solid rgba(0,75,99,0.08);
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                }
                .vak-option:hover {
                    border-color: var(--option-color);
                    transform: translateX(8px);
                    box-shadow: 0 4px 20px rgba(0,75,99,0.1);
                }
                .vak-option-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    flex-shrink: 0;
                }
                .vak-option span {
                    font-size: 0.95rem;
                    color: #4A4A4A;
                    line-height: 1.5;
                }
                .vak-analyzing {
                    text-align: center;
                    padding: 2rem;
                }
                .vak-analyzing p {
                    margin-top: 1rem;
                    color: #64748B;
                }
                .vak-results-ready {
                    text-align: center;
                    padding: 3rem;
                    background: white;
                    border-radius: 2rem;
                }
                .vak-results-ready p {
                    margin-bottom: 1.5rem;
                    color: #64748B;
                }
                .profile-results {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .profile-main-card {
                    background: white;
                    border-radius: 2rem;
                    padding: 3rem;
                    text-align: center;
                    margin-bottom: 2rem;
                    border: 1px solid rgba(0,75,99,0.08);
                    box-shadow: 0 20px 50px rgba(0,75,99,0.1);
                }
                .profile-type-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 2rem;
                    border-radius: 100px;
                    color: white;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1.25rem;
                    font-weight: 800;
                    margin-bottom: 2rem;
                }
                .profile-percentages {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    max-width: 400px;
                    margin: 0 auto;
                }
                .percentage-bar {
                    display: grid;
                    grid-template-columns: 100px 1fr 50px;
                    align-items: center;
                    gap: 1rem;
                }
                .percentage-bar span:first-child {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #64748B;
                }
                .bar-container {
                    height: 12px;
                    background: rgba(0,75,99,0.08);
                    border-radius: 6px;
                    overflow: hidden;
                }
                .bar-fill {
                    height: 100%;
                    border-radius: 6px;
                    transition: width 1s ease;
                }
                .percentage {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                    color: #004B63;
                }
                
                /* Testimonios VAK Section */
                .testimonios-vak-section {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .testimonios-header-vak {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }
                .testimonios-header-vak h2 {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 2rem;
                    font-weight: 800;
                    color: #004B63;
                    margin-bottom: 0.75rem;
                }
                .testimonios-header-vak p {
                    color: #64748B;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .testimonios-vak-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .testimonio-vak-card {
                    background: white;
                    border: 1px solid rgba(0,75,99,0.08);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                }
                .testimonio-vak-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 15px 35px rgba(0,75,99,0.12);
                }
                .testimonio-vak-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .testimonio-vak-header img {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .testimonio-vak-info h4 {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #004B63;
                    margin-bottom: 0.25rem;
                }
                .testimonio-vak-info span {
                    font-size: 0.8rem;
                    color: #64748B;
                }
                .testimonio-vak-texto {
                    font-size: 0.9rem;
                    line-height: 1.7;
                    color: #4A4A4A;
                    font-style: italic;
                    margin-bottom: 1.25rem;
                }
                .testimonio-vak-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .perfil-badge {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.7rem;
                    font-weight: 600;
                    padding: 0.4rem 0.75rem;
                    background: linear-gradient(135deg, rgba(77, 168, 196, 0.15), rgba(102, 204, 204, 0.1));
                    color: #4DA8C4;
                    border-radius: 100px;
                    text-transform: uppercase;
                }
                .resultado-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.7rem;
                    font-weight: 600;
                    padding: 0.4rem 0.75rem;
                    background: rgba(16, 185, 129, 0.1);
                    color: #059669;
                    border-radius: 100px;
                }
                .resultado-badge i {
                    font-size: 0.65rem;
                }
                .testimonios-cta {
                    text-align: center;
                    padding: 2.5rem;
                    background: linear-gradient(135deg, #004B63, #0B2A3A);
                    border-radius: 1.5rem;
                }
                .testimonios-cta p {
                    color: rgba(255,255,255,0.9);
                    margin-bottom: 1.25rem;
                    font-size: 1.1rem;
                }
                .cta-testimonials {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #4DA8C4, #66CCCC);
                    border: none;
                    border-radius: 100px;
                    color: white;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                 .cta-testimonials:hover {
                     transform: translateY(-3px);
                     box-shadow: 0 10px 30px rgba(77, 168, 196, 0.4);
                 }
                 .smartboard-container {
                     max-width: 1000px;
                     margin: 0 auto;
                 }
                  .smartboard-container > div {
                      border-radius: 1.5rem;
                      overflow: hidden;
                      box-shadow: 0 20px 60px rgba(0, 75, 99, 0.15);
                  }
                  
                  /* Premium Hero Custom Styles */
                  .bg-gradient-radial {
                      background-image: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
                  }
                  
                  @keyframes particle-float-3d {
                      0%, 100% {
                          transform: translate(0, 0) scale(1) translateZ(0);
                          opacity: 0.3;
                      }
                      25% {
                          transform: translate(-10px, -15px) scale(1.1) translateZ(10px);
                          opacity: 0.5;
                      }
                      50% {
                          transform: translate(5px, -25px) scale(1.05) translateZ(5px);
                          opacity: 0.4;
                      }
                      75% {
                          transform: translate(15px, -10px) scale(1.15) translateZ(15px);
                          opacity: 0.6;
                      }
                  }
                  
                  /* Premium Glass Effects */
                  .backdrop-blur-glass {
                      backdrop-filter: blur(12px) saturate(180%);
                      -webkit-backdrop-filter: blur(12px) saturate(180%);
                  }
                  
                  .bg-glass {
                      background: rgba(255, 255, 255, 0.08);
                  }
                  
                  .border-glass {
                      border: 1px solid rgba(255, 255, 255, 0.15);
                  }
                  
                  .shadow-premium {
                      box-shadow: 0 25px 50px -12px rgba(0, 75, 99, 0.25), 
                                  0 0 0 1px rgba(255, 255, 255, 0.1);
                  }
                  
                  .shadow-premium-lg {
                      box-shadow: 0 35px 60px -15px rgba(0, 75, 99, 0.3),
                                  0 0 0 1px rgba(255, 255, 255, 0.15),
                                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
                  }
                  
                  .shadow-glass-accent {
                      box-shadow: 0 8px 32px rgba(77, 168, 196, 0.2),
                                  0 0 0 1px rgba(77, 168, 196, 0.1);
                  }
                  
                  /* Premium Pulse Animation */
                  @keyframes premium-pulse {
                      0%, 100% {
                          box-shadow: 0 25px 50px -12px rgba(0, 75, 99, 0.25), 
                                      0 0 0 1px rgba(255, 255, 255, 0.1);
                          transform: scale(1);
                      }
                      50% {
                          box-shadow: 0 35px 60px -15px rgba(0, 75, 99, 0.3),
                                      0 0 0 1px rgba(255, 255, 255, 0.15),
                                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
                          transform: scale(1.005);
                      }
                  }
                  
                  .animate-premium-pulse {
                      animation: premium-pulse 3s ease-in-out infinite;
                  }
              `}</style>
        </div>
    );
};

export default NeuroEntorno;
