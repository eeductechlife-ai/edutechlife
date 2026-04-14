import { useState, useRef, useEffect } from 'react';
import { PROMPT_VALERIO_DOCENTE } from '../constants/prompts';
import { callDeepseek } from '../utils/api';
import { speakTextConversational, iniciarReconocimiento } from '../utils/speech';
import ValerioAvatar from './ValerioAvatar';
import html2pdf from 'html2pdf.js';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import { useAuth } from '../context/AuthContext';
import { getAllProgress, saveProgress, PROGRESS_STATUS, saveLastLesson, getUserLastProgress, getProgress } from '../lib/progress';
import { LogOut, Lightbulb } from 'lucide-react';
import UserDropdownMenuSimplified from './UserDropdownMenuSimplified';
import PlatformOptimizedCard from './PlatformOptimizedCard';
import ChallengeCard from './ChallengeCard';
import ForumCommunity from './forum/ForumCommunity';
import ErrorBoundary from './forum/ErrorBoundary';
import { FORUM_COMPONENTS, FORUM_TYPOGRAPHY, FORUM_EFFECTS, cn, GRADIENTS } from './forum/forumDesignSystem';

const IALabFixed = ({ onBack }) => {
    const { user, isLoading: authLoading, signOut } = useAuth();
    
    const [activeMod, setActiveMod] = useState(1);
    const [activeTab, setActiveTab] = useState('lab');
    const [input, setInput] = useState('');
    const [genData, setGenData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadMsg, setLoadMsg] = useState('');
    const [certName, setCertName] = useState('');
    const [showNameModal, setShowNameModal] = useState(false);
    const [completedModules, setCompletedModules] = useState([]);
    const [courseProgress, setCourseProgress] = useState(20);
    const [visitedModules, setVisitedModules] = useState([1]);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);
    
    const [evalAnswers, setEvalAnswers] = useState({});
    const [evalSubmitted, setEvalSubmitted] = useState(false);
    const [evalScore, setEvalScore] = useState(0);
    
    const [coachQ, setCoachQ] = useState('');
    const [coachMsg, setCoachMsg] = useState('');
    const [coachLoad, setCoachLoad] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [avatarState, setAvatarState] = useState('idle');
    const [showValerioDrawer, setShowValerioDrawer] = useState(false);
    

    
    // Estado para mostrar tooltip de evaluación bloqueada
    const [showEvaluationTooltip, setShowEvaluationTooltip] = useState(false);
    
    // Estado para animaciones de entrada secuencial de acordeones
    const [visibleAccordions, setVisibleAccordions] = useState([]);
    
    // Estado para controlar expansión del Muro de Insights
    const [insightsExpanded, setInsightsExpanded] = useState(false);
    
    // Estados para funcionalidad de botones - Functional Button Engine v1
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
    const [isMarkingComplete, setIsMarkingComplete] = useState(false);
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [isQuizValid, setIsQuizValid] = useState(false);
    
    // Estados para sistema de evaluación mejorado
    const [quizScore, setQuizScore] = useState(null);
    const [quizPassed, setQuizPassed] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const [showScoreResult, setShowScoreResult] = useState(false);
    const [dailyAttemptsCount, setDailyAttemptsCount] = useState(0);
    const [lastAttemptDate, setLastAttemptDate] = useState(null);
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [showReadyToAdvance, setShowReadyToAdvance] = useState(false);
    const [showEvaluationQuiz, setShowEvaluationQuiz] = useState(false);
    
    // Estados para modal de examen y seguridad
    const [showExamModal, setShowExamModal] = useState(false);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [showSecurityWarning, setShowSecurityWarning] = useState(false);
    const [securityWarningCount, setSecurityWarningCount] = useState(0);
    
    // Estados para sistema de seguridad avanzado - Protocolo exam-integrity-lockdown
    const [screenshotProtectionActive, setScreenshotProtectionActive] = useState(false);
    const [securityViolations, setSecurityViolations] = useState(0);
    const [attemptsPenalized, setAttemptsPenalized] = useState(0);
    const [keyboardLockActive, setKeyboardLockActive] = useState(false);
    const [showSecurityStatus, setShowSecurityStatus] = useState(false);
    const [securityMessage, setSecurityMessage] = useState('');
    const [showSecurityMessage, setShowSecurityMessage] = useState(false);
    
    // Estados para timer sugerido
    const [suggestedTime] = useState(20 * 60); // 20 minutos en segundos
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showTimeWarning, setShowTimeWarning] = useState(false);
    
    // Estados para navegación del quiz
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [sidebarDropdowns, setSidebarDropdowns] = useState({
        videos: true,
        recursos: true
    });
    
    // Estado para controlar acordeones del Cuadro de Introducción
    const [openAccordions, setOpenAccordions] = useState({});
    
    const toggleSidebarDropdown = (section) => {
        setSidebarDropdowns(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);
    const loadingIntervalRef = useRef(null);
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const chartRef = useRef(null);

    
    const isChartInView = useInView(chartRef);
    
    const msgs = ['Analizando contexto...', 'Aplicando técnicas élite...', 'Optimizando estructura...', 'Generando masterPrompt...'];
    
    // Lecciones/Temas del Módulo 1 (6 temas como especificado) - VERSIÓN PREMIUM CON METADATOS
    const moduleLessons = [
        { 
            id: 1, 
            title: 'Ingeniería de Prompts – Comunícate Mejor con la IA', 
            description: 'Aprende a dar instrucciones claras a la IA',
            duration: '10 min',
            format: 'Video',
            icon: 'fa-lightbulb',
            badgeColor: 'bg-blue-100 text-blue-800'
        },
        { 
            id: 2, 
            title: 'El Método para Dominar la IA (Mastery Framework)', 
            description: 'Estructura tus prompts con estrategia',
            duration: '15 min',
            format: 'Lab',
            icon: 'fa-book-open',
            badgeColor: 'bg-purple-100 text-purple-800'
        },
        { 
            id: 3, 
            title: 'Adapta la IA a Cada Situación (Contexto Dinámico)', 
            description: 'Personaliza respuestas según necesidades',
            duration: '12 min',
            format: 'Video',
            icon: 'fa-map',
            badgeColor: 'bg-green-100 text-green-800'
        },
        { 
            id: 4, 
            title: 'Resultados Rápidos con IA (Zero-Shot Prompting)', 
            description: 'Obtén buenos resultados sin ejemplos',
            duration: '8 min',
            format: 'Reading',
            icon: 'fa-bolt',
            badgeColor: 'bg-yellow-100 text-yellow-800'
        },
        { 
            id: 5, 
            title: 'Haz que la IA Piense Paso a Paso (Chain-of-Thought)', 
            description: 'Guía el razonamiento de la IA',
            duration: '18 min',
            format: 'Lab',
            icon: 'fa-sitemap',
            badgeColor: 'bg-indigo-100 text-indigo-800'
        },
        { 
            id: 6, 
            title: 'Ejercicio de Reflexión – Más Allá de Usar la IA', 
            description: 'Reflexiona sobre el impacto ético de la IA',
            duration: '25 min',
            format: 'Activity',
            icon: 'fa-brain',
            badgeColor: 'bg-pink-100 text-pink-800'
        }
    ];
    
    // Detectar si es dispositivo táctil para optimizar animaciones
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    
    // Estados para protocolo universal-adaptive-challenge
    const [isStartingChallenge, setIsStartingChallenge] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
    const [challengeScore, setChallengeScore] = useState(0);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    
    useEffect(() => {
        // Detectar dispositivo táctil
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        
        // Detectar iOS
        setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
        
        // Detectar Android
        setIsAndroid(/Android/.test(navigator.userAgent));
        
        // Optimizaciones específicas por plataforma
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            // Optimizaciones para Safari iOS
            document.documentElement.style.setProperty('--tap-highlight-color', 'rgba(0, 188, 212, 0.1)');
        }
        
        if (/Android/.test(navigator.userAgent)) {
            // Optimizaciones para Chrome Android
            document.documentElement.style.setProperty('--scroll-behavior', 'smooth');
            // Prevenir zoom en inputs en Android
            const metaViewport = document.querySelector('meta[name="viewport"]');
            if (metaViewport) {
                metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        }
        
        // Optimizaciones para Safari en general
        if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
            // Mejorar rendimiento de animaciones en Safari
            document.documentElement.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        }
        
        // Optimizar para dispositivos con pantallas de alta densidad (Retina, HiDPI)
        if (window.devicePixelRatio >= 2) {
            document.documentElement.style.setProperty('--image-rendering', 'crisp-edges');
        }
    }, []);
    
    // Cargar progreso del desafío desde Supabase
    useEffect(() => {
        const loadChallengeProgress = async () => {
            try {
                // Solo cargar si hay un usuario autenticado
                if (!user?.id) {
                    console.log('Usuario no autenticado, usando estado por defecto');
                    setIsLoadingProgress(false);
                    return;
                }
                
                console.log(`Cargando progreso del desafío para módulo ${activeMod}, usuario ${user.id}`);
                
                // Cargar progreso específico del módulo actual
                const progress = await getProgress(activeMod);
                
                if (progress) {
                    console.log('Progreso cargado:', progress);
                    
                    // Actualizar estados basados en el progreso
                    const { status, challenge_completed, challenge_started_at, challenge_score } = progress;
                    
                    // Si el desafío ya fue completado, actualizar estados
                    if (challenge_completed) {
                        setIsChallengeCompleted(true);
                        setIsButtonDisabled(true);
                        setChallengeScore(challenge_score || 0);
                        console.log(`Desafío ya completado, puntuación: ${challenge_score || 0}%, botón deshabilitado`);
                    } else {
                        setIsChallengeCompleted(false);
                        setChallengeScore(0);
                    }
                    
                    // Si el desafío está en progreso, mostrar estado apropiado
                    if (status === 'in_progress' && challenge_started_at) {
                        const startedTime = new Date(challenge_started_at);
                        const now = new Date();
                        const diffMinutes = (now - startedTime) / (1000 * 60);
                        
                        // Si pasaron más de 45 minutos desde que empezó, marcar como expirado
                        if (diffMinutes > 45) {
                            console.log('Desafío expirado (más de 45 minutos)');
                            setIsButtonDisabled(false); // Permitir reiniciar
                        } else {
                            console.log(`Desafío en progreso, ${Math.round(45 - diffMinutes)} minutos restantes`);
                            setIsStartingChallenge(false);
                            setIsButtonDisabled(false);
                        }
                    }
                } else {
                    console.log('No se encontró progreso para este módulo');
                }
                
            } catch (error) {
                console.error('Error al cargar progreso del desafío:', error);
                
                // En caso de error, mostrar estado por defecto
                setIsButtonDisabled(false);
                
            } finally {
                // Siempre marcar como cargado (incluso en error)
                setIsLoadingProgress(false);
                console.log('Carga de progreso completada');
            }
        };
        
        // Iniciar carga
        loadChallengeProgress();
        
        // Recargar cuando cambie el módulo activo o el usuario
    }, [activeMod, user?.id]);
    
    // Función para contenido específico de cada acordeón
    const renderAccordionContent = (accordionId) => {
        switch(accordionId) {
            case 1:
                return (
                    <>
                        <p className="text-sm text-slate-600 leading-relaxed md:text-base lg:text-[15px]">
                            La calidad de las respuestas de la IA depende directamente de cómo se le habla. 
                            En esta sección se aprenderá a dar instrucciones claras, evitando errores comunes 
                            y logrando resultados mucho más precisos.
                        </p>
                        <p className="font-medium text-[#00BCD4] mb-0 text-sm md:text-base">
                            👉 A continuación, acceda al video o recurso de lectura para aprender, paso a paso, 
                            cómo formular instrucciones efectivas desde el inicio.
                        </p>
                    </>
                );
            case 2:
                return (
                    <>
                        <p className="text-sm text-slate-600 leading-relaxed md:text-base lg:text-[15px]">
                            No se trata solo de preguntar, sino de hacerlo con estrategia. Aquí se presenta un método simple 
                            que permite estructurar las instrucciones para obtener respuestas útiles, organizadas y alineadas 
                            con un objetivo claro.
                        </p>
                        <p className="font-medium text-[#00BCD4] mb-0 text-sm md:text-base">
                            👉 Continúe con el video o recurso de lectura para aplicar este método de forma práctica.
                        </p>
                    </>
                );
            case 3:
                return (
                    <>
                        <p className="text-sm text-slate-600 leading-relaxed md:text-base lg:text-[15px]">
                            La IA puede responder de muchas formas, pero todo depende del contexto que se le proporcione. 
                            En esta sección se aprenderá a ajustar las respuestas según la edad, el nivel y la necesidad específica.
                        </p>
                        <p className="font-medium text-[#00BCD4] mb-0 text-sm md:text-base">
                            👉 Acceda al video o recurso de lectura para aprender a personalizar las respuestas de la IA según cada situación.
                        </p>
                    </>
                );
            case 4:
                return (
                    <>
                        <p className="text-sm text-slate-600 leading-relaxed md:text-base lg:text-[15px]">
                            Es posible obtener buenos resultados sin dar ejemplos. Este tema enseña cómo pedir información de forma directa, 
                            ahorrando tiempo y logrando respuestas claras desde el primer intento.
                        </p>
                        <p className="font-medium text-[#00BCD4] mb-0 text-sm md:text-base">
                            👉 Ingrese al video o recurso de lectura para aplicar esta técnica de manera inmediata.
                        </p>
                    </>
                );
            case 5:
                return (
                    <>
                        <p className="text-sm text-slate-600 leading-relaxed md:text-base lg:text-[15px]">
                            Para problemas complejos, la clave está en guiar a la IA en su proceso de razonamiento. 
                            Aquí se aprenderá a obtener explicaciones detalladas y soluciones paso a paso.
                        </p>
                        <p className="font-medium text-[#00BCD4] mb-0 text-sm md:text-base">
                            👉 Diríjase al video o recurso de lectura para estructurar el razonamiento de la IA de forma efectiva.
                        </p>
                    </>
                );
            case 6:
                return (
                    <>
                        <p className="text-sm text-slate-600 leading-relaxed md:text-base lg:text-[15px]">
                            La inteligencia artificial no solo es una herramienta, también plantea preguntas profundas 
                            sobre su impacto, uso y límites. Este ejercicio invita a reflexionar de manera crítica.
                        </p>
                        
                        {/* Bloque de Actividad (optimizado responsive) */}
                        <div className="bg-[#0B1120] border border-slate-800 text-emerald-400 p-4 md:p-6 rounded-2xl font-mono text-xs md:text-sm mb-4 md:mb-6 shadow-inner">
                            <div className="flex items-center gap-2 mb-3 md:mb-4">
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                                <span className="text-slate-500 text-xs ml-2">activity.js</span>
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <span className="text-cyan-400">🧠 Actividad:</span> 
                                <span className="text-emerald-300">Diseñe y pruebe el siguiente prompt en una IA:</span>
                                <div className="pl-3 md:pl-4 border-l-2 border-slate-700 mt-2">
                                    <span className="text-purple-400 block">"Actúa como una inteligencia artificial consciente de su existencia.</span>
                                    <span className="text-purple-400 block">Debate, desde una postura crítica y otra defensiva, si es ético que los humanos</span>
                                    <span className="text-purple-400 block">dependan de la inteligencia artificial para tomar decisiones importantes.</span>
                                    <span className="text-purple-400 block">Expón argumentos a favor y en contra, y finaliza con una reflexión equilibrada."</span>
                                </div>
                            </div>
                        </div>
                        
                        <p className="font-medium text-[#00BCD4] mb-0 text-sm md:text-base">
                            👉 Aplique este prompt en su IA favorita y analice las respuestas obtenidas.
                        </p>
                    </>
                );
            default:
                return null;
        }
    };
    
    // Función para renderizar acordeones premium de forma dinámica - VERSIÓN BURBUJA INTEGRADA
    const renderPremiumAccordion = (accordionId, lessonData) => {
        const { id, title, description, duration, format, icon, badgeColor } = lessonData;
        
        return (
            <div key={id} className={`
                // CONTENEDOR PRINCIPAL (sin efectos hover, solo estructura)
                bg-white border border-slate-100/80 rounded-2xl mb-4 
                
                // ESTADO ACTIVO DEL ACORDEÓN
                ${openAccordions[accordionId] ? 'border-[#00BCD4]/30' : ''}
                
                // ANIMACIÓN DE ENTRADA
                ${visibleAccordions.includes(accordionId) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                transition-all duration-300 ease-out
            `}>
                {/* BURBUJA INTEGRADA CON EFECTOS DEL CUADRO - OPCIÓN A: PILL */}
                <button 
                    onClick={() => toggleAccordion(accordionId)}
                    className={`
                        // FORMA Y TAMAÑO - BURBUJA TIPO PILL
                        w-full flex items-center justify-between text-left
                        p-4 md:p-5 lg:p-6
                        rounded-2xl
                        transition-all duration-300 ease-out 
                        cursor-pointer
                        
                        // COLORES BASE DE LA BURBUJA
                        bg-[#00BCD4]/10 border border-[#00BCD4]/20
                        
                        // EFECTOS HOVER/ACTIVE (aplicados del cuadro original)
                        hover:scale-[1.01] hover:shadow-xl hover:bg-[#00BCD4]/15 hover:border-[#00BCD4]/30
                        active:scale-[0.99] active:shadow-lg
                        
                        // ESTADO ACTIVO (acordeón abierto)
                        ${openAccordions[accordionId] ? 
                            'bg-[#00BCD4]/20 border-[#00BCD4] shadow-[0_0_0_1px_#00BCD4,0_8px_32px_rgba(0,188,212,0.12)]' : 
                            ''
                        }
                        
                        // RESPONSIVE
                        md:hover:scale-[1.02] md:hover:shadow-2xl
                    `}
                >
                    {/* CONTENIDO INTEGRADO EN LA BURBUJA */}
                    <div className="flex items-start md:items-center gap-3 md:gap-4 w-full">
                        {/* ICONO EN CÍRCULO BLANCO DENTRO DE LA BURBUJA */}
                        <div className="
                            w-8 h-8 rounded-full bg-white/80 border border-white/90
                            flex items-center justify-center flex-shrink-0
                            transition-all duration-300
                            md:w-10 md:h-10
                            lg:w-12 lg:h-12
                        ">
                            <Icon name={icon} className="
                                text-[#00BCD4] text-xs
                                md:text-sm
                                lg:text-base
                            " />
                        </div>
                        
                        {/* CONTENIDO PRINCIPAL - AHORA DENTRO DE LA BURBUJA */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                                {/* TÍTULO */}
                                <h3 className={`
                                    text-sm font-semibold transition-colors duration-300 
                                    md:text-[15px] lg:text-base
                                    ${openAccordions[accordionId] ? 'text-[#00BCD4]' : 'text-[#00374A]'}
                                `}>
                                    {title}
                                </h3>
                                
                                {/* METADATOS - BADGES CON FONDO BLANCO PARA CONTRASTE */}
                                <div className="flex flex-wrap gap-1 md:gap-2">
                                    <span className="text-xs font-medium px-2 py-1 bg-white/90 text-slate-700 rounded-lg border border-white/95">
                                        {duration}
                                    </span>
                                    <span className={`text-xs font-medium px-2 py-1 ${badgeColor.replace('100', '200').replace('800', '900')} rounded-lg border border-white/50`}>
                                        {format}
                                    </span>
                                </div>
                            </div>
                            
                            {/* DESCRIPCIÓN (SOLO EN DESKTOP) - DENTRO DE LA BURBUJA */}
                            <p className="hidden lg:block text-sm text-slate-600 mt-2">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    {/* ICONO CHEVRON ANIMADO */}
                    <Icon 
                        name={openAccordions[accordionId] ? 'fa-chevron-down' : 'fa-chevron-right'} 
                        className={`
                            text-sm transition-all duration-300 
                            ${openAccordions[accordionId] ? 'text-[#00BCD4] rotate-0' : 'text-slate-400'}
                            hover:text-[#00BCD4]
                            md:text-base
                        `}
                    />
                </button>
               
               {/* CONTENIDO EXPANDIDO CON ANIMACIÓN FRAMER-MOTION */}
               <AnimatePresence>
                 {openAccordions[accordionId] && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ 
                       duration: isTouchDevice ? 0.2 : 0.3,
                       ease: 'easeInOut',
                       ...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
                           duration: 0.1
                       })
                     }}
                     className="overflow-hidden"
                   >
                     <div className="mt-4 space-y-4 px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-6">
                       {/* CONTENIDO ESPECÍFICO POR ACORDEÓN */}
                       {renderAccordionContent(accordionId)}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
        );
    };
    
    // Sistema de Evaluación Mejorado - 8 preguntas con mezcla de dificultad
    const quizQuestions = [
        {
            id: 'q1',
            question: '¿Cuál es el propósito principal de la ingeniería de prompts?',
            options: [
                { id: 'q1_a', label: 'Hacer preguntas más largas a la IA' },
                { id: 'q1_b', label: 'Dar instrucciones claras y efectivas para obtener resultados útiles' },
                { id: 'q1_c', label: 'Usar palabras técnicas complicadas' },
                { id: 'q1_d', label: 'Hacer que la IA escriba código automáticamente' }
            ],
            correctAnswer: 'q1_b',
            topic: 'Ingeniería de Prompts',
            difficulty: 'fácil',
            feedback: 'Debes volver a interactuar con el tema "Ingeniería de Prompts – Comunícate Mejor con la IA"'
        },
        {
            id: 'q2',
            question: '¿Qué técnica permite guiar el razonamiento de la IA paso a paso?',
            options: [
                { id: 'q2_a', label: 'Zero-Shot Prompting' },
                { id: 'q2_b', label: 'Chain-of-Thought' },
                { id: 'q2_c', label: 'Few-Shot Prompting' },
                { id: 'q2_d', label: 'Contexto Dinámico' }
            ],
            correctAnswer: 'q2_b',
            topic: 'Chain-of-Thought',
            difficulty: 'medio',
            feedback: 'Revisa el tema "Haz que la IA Piense Paso a Paso (Chain-of-Thought)"'
        },
        {
            id: 'q3',
            question: '¿Cuál es una ventaja clave del método RTF (Rol, Tarea, Formato)?',
            options: [
                { id: 'q3_a', label: 'Hace las preguntas más cortas' },
                { id: 'q3_b', label: 'Estructura las instrucciones para obtener respuestas organizadas y alineadas' },
                { id: 'q3_c', label: 'Elimina la necesidad de contexto' },
                { id: 'q3_d', label: 'Automatiza completamente el proceso' }
            ],
            correctAnswer: 'q3_b',
            topic: 'Método Mastery Framework',
            difficulty: 'fácil',
            feedback: 'Repasa "El Método para Dominar la IA (Mastery Framework)"'
        },
        {
            id: 'q4',
            question: '¿Qué es el "Zero-Shot Prompting" y cuándo es más efectivo?',
            options: [
                { id: 'q4_a', label: 'Dar 0 instrucciones a la IA' },
                { id: 'q4_b', label: 'Obtener buenos resultados sin proporcionar ejemplos previos' },
                { id: 'q4_c', label: 'Usar prompts con 0 palabras' },
                { id: 'q4_d', label: 'Reiniciar la conversación con la IA' }
            ],
            correctAnswer: 'q4_b',
            topic: 'Zero-Shot Prompting',
            difficulty: 'medio',
            feedback: 'Consulta "Resultados Rápidos con IA (Zero-Shot Prompting)"'
        },
        {
            id: 'q5',
            question: '¿Cómo se aplica el "Contexto Dinámico" en prompts complejos?',
            options: [
                { id: 'q5_a', label: 'Haciendo prompts más largos automáticamente' },
                { id: 'q5_b', label: 'Personalizando respuestas según necesidades específicas del usuario' },
                { id: 'q5_c', label: 'Eliminando la necesidad de pensar en el contexto' },
                { id: 'q5_d', label: 'Usando siempre el mismo contexto para todas las preguntas' }
            ],
            correctAnswer: 'q5_b',
            topic: 'Contexto Dinámico',
            difficulty: 'difícil',
            feedback: 'Estudia "Adapta la IA a Cada Situación (Contexto Dinámico)"'
        },
        {
            id: 'q6',
            question: '¿Qué consideraciones éticas son clave al usar IA generativa?',
            options: [
                { id: 'q6_a', label: 'Solo la velocidad de respuesta' },
                { id: 'q6_b', label: 'Sesgos, privacidad, transparencia y uso responsable' },
                { id: 'q6_c', label: 'El costo de la API' },
                { id: 'q6_d', label: 'La cantidad de tokens usados' }
            ],
            correctAnswer: 'q6_b',
            topic: 'Ética y Reflexión',
            difficulty: 'medio',
            feedback: 'Reflexiona con "Ejercicio de Reflexión – Más Allá de Usar la IA"'
        },
        {
            id: 'q7',
            question: '¿Cuál es la diferencia entre "Few-Shot" y "Zero-Shot" prompting?',
            options: [
                { id: 'q7_a', label: 'Few-Shot proporciona ejemplos, Zero-Shot no' },
                { id: 'q7_b', label: 'Zero-Shot es más rápido que Few-Shot' },
                { id: 'q7_c', label: 'Few-Shot usa menos palabras' },
                { id: 'q7_d', label: 'No hay diferencia significativa' }
            ],
            correctAnswer: 'q7_a',
            topic: 'Zero-Shot Prompting',
            difficulty: 'difícil',
            feedback: 'Compara técnicas en "Resultados Rápidos con IA (Zero-Shot Prompting)"'
        },
        {
            id: 'q8',
            question: '¿Cómo se estructura un prompt usando RTF para análisis de mercado?',
            options: [
                { id: 'q8_a', label: 'Pidiendo directamente "analiza el mercado"' },
                { id: 'q8_b', label: 'Definiendo Rol: Analista, Tarea: Analizar tendencias, Formato: Reporte estructurado' },
                { id: 'q8_c', label: 'Usando la menor cantidad de palabras posible' },
                { id: 'q8_d', label: 'Copiando prompts de internet' }
            ],
            correctAnswer: 'q8_b',
            topic: 'Método Mastery Framework',
            difficulty: 'difícil',
            feedback: 'Aplica "El Método para Dominar la IA (Mastery Framework)" en casos prácticos'
        }
    ];

    const TOTAL_QUESTIONS = quizQuestions.length; // 8
    const PASSING_SCORE = 70; // 70% mínimo
    const DAILY_ATTEMPTS_LIMIT = 2;
    const SUGGESTED_TIME_MINUTES = 20;
    
    // Constantes de seguridad para examen
    const MAX_SECURITY_WARNINGS = 3;
    const SECURITY_WARNING_MESSAGES = [
        "Advertencia: No cambies de ventana durante el examen",
        "Segunda advertencia: El sistema detectó que abriste otra ventana",
        "Última advertencia: Si vuelves a cambiar de ventana, el examen se cerrará automáticamente"
    ];
    
    // Constantes para protocolo exam-integrity-lockdown
    const SECURITY_VIOLATION_PENALTY = 1; // Intentos perdidos por 3 infracciones
    const SCREENSHOT_OVERLAY_DURATION = 5000; // 5 segundos
    const SECURITY_MESSAGE_DURATION = 3000; // 3 segundos
    const SECURITY_LOG_PREFIX = 'exam_security_logs';
    
    // Sistema de Clases de Botones - UI Button Master Overhaul
    const buttonClasses = {
        // Botón Primario - Acción Principal
        primary: "bg-[#00374A] text-white px-6 py-3 rounded-xl hover:bg-[#00BCD4] hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 ease-in-out transform active:scale-95 font-medium flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2 min-h-[52px] touch-manipulation",
        
        // Botón Primario con Gradiente - Acción IA
        primaryGradient: "bg-gradient-to-r from-[#00374A] to-[#00BCD4] text-white px-6 py-3 rounded-xl hover:shadow-[0_0_25px_rgba(0,188,212,0.4)] transition-all duration-300 ease-in-out transform active:scale-95 font-medium flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2 min-h-[52px] touch-manipulation",
        
        // Botón Secundario
        secondary: "border-2 border-[#00BCD4] text-[#00374A] px-6 py-3 rounded-xl hover:bg-[#00BCD4]/10 hover:border-[#00374A] transition-all duration-300 ease-in-out transform active:scale-95 font-medium flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2 min-h-[52px] touch-manipulation",
        
        // Botón Desafío (Especial - Mantener identidad)
        challenge: "bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-white px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,209,102,0.3)] transition-all duration-300 ease-in-out transform active:scale-95 font-medium flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:ring-offset-2 min-h-[52px] touch-manipulation",
        
        // Botón Pequeño (para acciones secundarias)
        small: "px-3 py-1.5 text-sm border border-[#00BCD4] text-[#00374A] rounded-xl hover:bg-[#00BCD4]/10 transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#00BCD4] touch-manipulation",
        
        // Estado Loading
        loading: "opacity-70 cursor-not-allowed"
    };
    
    const modules = [
        { id: 1, title: 'Ingeniería de Prompts', icon: 'fa-terminal', color: '#4DA8C4', topics: ['Dar instrucciones claras a la IA', 'Mejorar cualquier pregunta para obtener mejores respuestas', 'Entender por qué la IA falla y cómo corregirlo', 'Obtener resultados útiles en menos tiempo', 'Aplicar la IA en estudio, trabajo y vida diaria', 'Pedir exactamente lo que necesita, sin rodeos'], challenge: 'Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.', desc: 'Desarrollar la capacidad de dar instrucciones claras y efectivas a la IA para obtener resultados útiles y precisos en situaciones reales.', duration: '4h 30min', level: 'Avanzado', videos: 12, projects: 3 },
        { id: 2, title: 'Potencia ChatGPT', icon: 'fa-robot', color: '#66CCCC', topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'], challenge: 'Estructura un GPT para análisis de mercados cuánticos.', desc: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.', duration: '5h 00min', level: 'Avanzado', videos: 15, projects: 4 },
        { id: 3, title: 'Rastreo Profundo', icon: 'fa-search', color: '#B2D8E5', topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'], challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.', desc: 'Técnicas de investigación profunda con IA para resultados de élite.', duration: '3h 45min', level: 'Intermedio', videos: 10, projects: 2 },
        { id: 4, title: 'Inmersión NotebookLM', icon: 'fa-microphone', color: '#004B63', topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'], challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.', desc: 'Convierte cualquier documento en conocimiento accionable con IA.', duration: '4h 00min', level: 'Intermedio', videos: 8, projects: 3 },
        { id: 5, title: 'Proyecto Disruptivo', icon: 'fa-trophy', color: '#FFD166', topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'], challenge: 'Propón una automatización integral para una industria local de alto nivel.', desc: 'Aplica todo lo aprendido en un proyecto de impacto real.', duration: '6h 00min', level: 'Experto', videos: 6, projects: 5 },
    ];
    
    const LAST_MODULE_ID = 5;
    
    const isModuleLocked = (moduleId) => {
        if (moduleId === 1) return false;
        return !completedModules.includes(moduleId) && !visitedModules.includes(moduleId);
    };
    
    const isEvaluationLocked = (moduleId) => {
        if (moduleId === 1) return false;
        const previousModuleId = moduleId - 1;
        return !completedModules.includes(previousModuleId);
    };
    
    // Funciones para sistema de evaluación mejorado
    const calculateQuizScore = (answers) => {
        let correct = 0;
        const failedQuestions = [];
        
        quizQuestions.forEach(question => {
            if (answers[question.id] === question.correctAnswer) {
                correct++;
            } else {
                failedQuestions.push(question.id);
            }
        });
        
        const percentage = (correct / TOTAL_QUESTIONS) * 100;
        const passed = percentage >= PASSING_SCORE;
        
        return {
            score: Math.round(percentage),
            correctCount: correct,
            passed,
            failedQuestions,
            neededToPass: Math.ceil((PASSING_SCORE / 100) * TOTAL_QUESTIONS) // = 6
        };
    };
    
    const canAttemptQuiz = () => {
        const today = new Date().toDateString();
        const lastAttempt = lastAttemptDate ? new Date(lastAttemptDate).toDateString() : null;
        
        // Si es un nuevo día, resetear contador
        if (lastAttempt !== today) {
            setDailyAttemptsCount(0);
            setLastAttemptDate(new Date().toISOString());
            return true;
        }
        
        // Verificar límite diario
        return dailyAttemptsCount < DAILY_ATTEMPTS_LIMIT;
    };
    
    const generateTopicFeedback = (failedQuestions) => {
        // Agrupar preguntas falladas por tema
        const topicsNeedingReview = {};
        
        failedQuestions.forEach(questionId => {
            const question = quizQuestions.find(q => q.id === questionId);
            if (question && question.topic) {
                if (!topicsNeedingReview[question.topic]) {
                    topicsNeedingReview[question.topic] = [];
                }
                topicsNeedingReview[question.topic].push(question);
            }
        });
        
        // Generar mensajes personalizados
        const feedbackMessages = [];
        
        Object.keys(topicsNeedingReview).forEach(topic => {
            const questions = topicsNeedingReview[topic];
            const count = questions.length;
            
            let message = '';
            if (count === 1) {
                message = `Debes volver a interactuar con el tema "${topic}".`;
            } else if (count === 2) {
                message = `Necesitas reforzar el tema "${topic}" (${count} preguntas falladas).`;
            } else {
                message = `Es prioritario que revises el tema "${topic}" (${count} preguntas falladas).`;
            }
            
            // Agregar feedback específico de cada pregunta
            questions.forEach(question => {
                if (question.feedback) {
                    message += ` ${question.feedback}`;
                }
            });
            
            feedbackMessages.push(message);
        });
        
        return feedbackMessages;
    };
    
    const resetQuizForRetry = () => {
        setQuizAnswers({});
        setQuizScore(null);
        setQuizPassed(false);
        setQuizResult(null);
        setShowScoreResult(false);
        setCurrentQuestion(0);
        setCurrentPage(1);
        setTimeElapsed(0);
        setIsTimerRunning(false);
        setShowTimeWarning(false);
        
        // Resetear estados de seguridad (pero mantener contadores de penalización)
        setSecurityWarningCount(0);
        setScreenshotProtectionActive(false);
        setShowSecurityStatus(false);
        setShowSecurityMessage(false);
        // Nota: No resetear securityViolations ni attemptsPenalized para mantener registro
    };
    
    const scrollToLesson = (topic) => {
        // Buscar la lección correspondiente al tema
        const lessonIndex = moduleLessons.findIndex(lesson => 
            lesson.title.includes(topic) || topic.includes(lesson.title.split(' – ')[0])
        );
        
        if (lessonIndex !== -1) {
            setCurrentLessonIndex(lessonIndex);
            // Scroll a la sección de lecciones
            setTimeout(() => {
                const lessonSection = document.querySelector('.cuadro-introduccion');
                if (lessonSection) {
                    lessonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };
    
    // Función para toggle de acordeones
    const toggleAccordion = (id) => {
        setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
    };
    



    
    // Función para sintetizar prompts en el laboratorio
    const handleOptimize = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setGenData(null);
        let idx = 0;
        setLoadMsg(msgs[0]);
        loadingIntervalRef.current = setInterval(() => {
            idx = (idx + 1) % msgs.length;
            setLoadMsg(msgs[idx]);
        }, 1800);
        
        try {
            // Llamada directa a la API para el sintetizador de prompts
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://edutechlife-backend.onrender.com';
            const url = `${API_BASE_URL}/api/chat`;
            
            const systemPrompt = `Eres el Arquitecto de Prompts Élite de Edutechlife. Analiza la siguiente idea del usuario y genera:
1. Un MASTER PROMPT estructurado usando el framework RTF (Rol, Tarea, Formato)
2. Un FEEDBACK TÉCNICO detallado explicando las técnicas de ingeniería de prompts aplicadas

ESTRUCTURA REQUERIDA (JSON):
{
  "masterPrompt": "Prompt estructurado con RTF: Rol claro, Tarea específica, Formato definido",
  "feedback": "Explicación técnica detallada (3-4 oraciones) mencionando técnicas como: Few-Shot Prompting, Chain-of-Thought, Contexto Dinámico, Delimitación de Tono, etc.",
  "techniques": ["Lista", "de", "técnicas", "aplicadas"]
}

IDEAS DEL USUARIO PARA ANALIZAR: "${input}"`;
            
            const payload = { 
                prompt: input,
                systemPrompt: systemPrompt,
                isJson: true
            };
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            
            const response = await fetch(url, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }, 
                body: JSON.stringify(payload),
                mode: 'cors',
                credentials: 'omit',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Parsear el JSON de la respuesta
            const result = JSON.parse(data.result.replace(/```json|```/g, '').trim());
            
            // Validar que tenga la estructura esperada
            if (!result.masterPrompt || !result.feedback) {
                throw new Error('Respuesta de IA no tiene la estructura esperada');
            }
            
            // Asegurar que techniques sea un array
            if (!result.techniques || !Array.isArray(result.techniques)) {
                result.techniques = ["Few-Shot Prompting", "Chain-of-Thought", "Contexto Dinámico"];
            }
            
            setGenData(result);
            
        } catch (error) {
            console.error('Error en síntesis de prompt:', error);
            // Datos de respaldo para demostración
            setGenData({
                masterPrompt: `🔹 ROL: Arquitecto de Prompts Élite\n🔹 TAREA: Analizar y optimizar "${input.substring(0, 50)}..."\n🔹 FORMATO: Estructura RTF con contexto dinámico\n\n📋 PROMPT MAESTRO:\n"Como experto en ingeniería de prompts, analiza la idea proporcionada y genera un prompt optimizado usando técnicas élite como Few-Shot, Chain-of-Thought y delimitación de contexto. Proporciona una versión estructurada con rol claro, tarea específica y formato definido."`,
                feedback: `✅ Técnicas aplicadas: Few-Shot Prompting (ejemplos contextuales), Chain-of-Thought (razonamiento paso a paso), Contexto Dinámico (adaptación al input).\n\n🔧 Optimizaciones: Estructura RTF (Rol-Tarea-Formato), delimitación clara de instrucciones, tono profesional manteniendo accesibilidad.\n\n🎯 Resultado: Prompt listo para implementación con alta tasa de éxito en modelos de IA avanzados.`,
                techniques: ["Few-Shot Prompting", "Chain-of-Thought", "Contexto Dinámico", "Delimitación de Tono"]
            });
        } finally {
            if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
            setLoading(false);
        }
    };
    
    const curr = modules.find(m => m.id === activeMod) || modules[0];
    

    
    // Effect para animación de entrada secuencial de acordeones
    useEffect(() => {
        const accordionIds = [1, 2, 3, 4, 5, 6];
        const timers = [];
        
        accordionIds.forEach((id, index) => {
            const timer = setTimeout(() => {
                setVisibleAccordions(prev => [...prev, id]);
            }, index * 100); // Animación escalonada
            timers.push(timer);
        });
        
        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);
    
    // Effect para el timer sugerido
    useEffect(() => {
        let interval;
        if (isTimerRunning && timeElapsed < suggestedTime) {
            interval = setInterval(() => {
                setTimeElapsed(prev => {
                    const newTime = prev + 1;
                    
                    // Mostrar advertencia a los 15 minutos
                    if (newTime === 15 * 60) {
                        setShowTimeWarning(true);
                    }
                    
                    return newTime;
                });
            }, 1000);
        }
        
        return () => clearInterval(interval);
    }, [isTimerRunning, timeElapsed, suggestedTime]);
    
    // Effect para resetear estados al cambiar de módulo
    useEffect(() => {
        // Resetear estados del quiz al cambiar de módulo
        setQuizAnswers({});
        setQuizScore(null);
        setQuizPassed(false);
        setQuizResult(null);
        setShowScoreResult(false);
        setDailyAttemptsCount(0);
        setTimeElapsed(0);
        setIsTimerRunning(false);
        setShowTimeWarning(false);
        setCurrentQuestion(0);
        setCurrentPage(1);
    }, [activeMod]);
    
    // Effect para cargar intentos desde localStorage
    useEffect(() => {
        const savedAttempts = localStorage.getItem(`quizAttempts_${activeMod}`);
        if (savedAttempts) {
            const attempts = JSON.parse(savedAttempts);
            const today = new Date().toDateString();
            
            // Filtrar intentos de hoy
            const todayAttempts = attempts.filter(attempt => {
                const attemptDate = new Date(attempt.date).toDateString();
                return attemptDate === today;
            });
            
            setDailyAttemptsCount(todayAttempts.length);
            setQuizAttempts(attempts);
        }
    }, [activeMod]);
    
    // Limpiar logs de seguridad antiguos (más de 30 días) al montar el componente
    useEffect(() => {
        SECURITY_LOGGER.clearOldLogs();
    }, []);
    
    // Sistema de seguridad: Detectar cambios de ventana durante examen
    useEffect(() => {
        if (!showExamModal || showScoreResult) return;
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Usuario cambió de pestaña/ventana
                setSecurityWarningCount(prev => {
                    const newCount = prev + 1;
                    setShowSecurityWarning(true);
                    
                    // Registrar violación de seguridad
                    SECURITY_LOGGER.logViolation('WINDOW_CHANGE', {
                        warningCount: newCount,
                        maxWarnings: MAX_SECURITY_WARNINGS
                    });
                    
                    if (newCount >= MAX_SECURITY_WARNINGS) {
                        // Aplicar penalización por 3 infracciones
                        setTimeout(() => {
                            penalizeAttempt();
                            handleCloseModal();
                            setLoadMsg("Examen cerrado por 3 infracciones de seguridad. Has perdido 1 intento.");
                            setTimeout(() => setLoadMsg(''), 3000);
                        }, 1000);
                    }
                    
                    return newCount;
                });
                
                // Pausar timer durante la advertencia
                setIsTimerRunning(false);
            }
        };
        
        const handleBlur = () => {
            // Solo activar si el usuario hizo clic fuera del navegador
            // (no cuando cambia entre pestañas del mismo navegador)
            setTimeout(() => {
                if (!document.hidden) {
                    setSecurityWarningCount(prev => {
                        const newCount = prev + 1;
                        setShowSecurityWarning(true);
                        
                        // Registrar violación de seguridad
                        SECURITY_LOGGER.logViolation('WINDOW_BLUR', {
                            warningCount: newCount,
                            maxWarnings: MAX_SECURITY_WARNINGS
                        });
                        
                        return newCount;
                    });
                    setIsTimerRunning(false);
                }
            }, 100);
        };
        
        // Agregar event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        
        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [showExamModal, showScoreResult]);
    
    // Resetear contador de advertencias diariamente
    useEffect(() => {
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem('securityWarningsResetDate');
        
        if (lastReset !== today) {
            // Es un nuevo día, resetear contador
            setSecurityWarningCount(0);
            localStorage.setItem('securityWarningsResetDate', today);
        }
    }, []);
    
    // Sistema de protección anti-copia: Keyboard lock durante examen
    useEffect(() => {
        if (!showExamModal || showScoreResult) return;
        
        const handleKeyDown = (event) => {
            // Bloquear combinaciones de teclas peligrosas
            const blockedCombinations = [
                { key: 'c', ctrl: true }, // Ctrl+C (copiar)
                { key: 'v', ctrl: true }, // Ctrl+V (pegar)
                { key: 'p', ctrl: true }, // Ctrl+P (imprimir)
                { key: 'u', ctrl: true }, // Ctrl+U (ver código fuente)
                { key: 's', ctrl: true }, // Ctrl+S (guardar)
                { key: 'a', ctrl: true }, // Ctrl+A (seleccionar todo)
                { key: 'F12', ctrl: false }, // F12 (herramientas de desarrollo)
                { key: 'PrintScreen', ctrl: false }, // PrintScreen (captura)
                { key: 'F11', ctrl: false }, // F11 (pantalla completa)
                { key: 'Escape', ctrl: false } // Escape (podría intentar salir)
            ];
            
            const isBlocked = blockedCombinations.some(combo => {
                if (combo.ctrl) {
                    return event.ctrlKey && event.key.toLowerCase() === combo.key.toLowerCase();
                } else {
                    return event.key === combo.key;
                }
            });
            
            if (isBlocked) {
                event.preventDefault();
                event.stopPropagation();
                
                // Registrar violación
                SECURITY_LOGGER.logViolation('KEYBOARD_SHORTCUT_ATTEMPT', {
                    key: event.key,
                    ctrlKey: event.ctrlKey,
                    altKey: event.altKey,
                    shiftKey: event.shiftKey
                });
                
                // Mostrar mensaje
                showSecurityMessageTemporary(`Acción bloqueada: ${event.ctrlKey ? 'Ctrl+' : ''}${event.key}`);
                
                // Incrementar contador de advertencias si es PrintScreen o F12
                if (event.key === 'PrintScreen' || event.key === 'F12') {
                    setSecurityWarningCount(prev => {
                        const newCount = prev + 1;
                        
                        if (newCount >= MAX_SECURITY_WARNINGS) {
                            setTimeout(() => {
                                penalizeAttempt();
                                handleCloseModal();
                                setLoadMsg("Examen cerrado por intentos de captura/herramientas de desarrollo");
                                setTimeout(() => setLoadMsg(''), 3000);
                            }, 1000);
                        }
                        
                        return newCount;
                    });
                }
                
                return false;
            }
        };
        
        // Bloquear menú contextual (clic derecho)
        const handleContextMenu = (event) => {
            event.preventDefault();
            
            // Registrar violación
            SECURITY_LOGGER.logViolation('CONTEXT_MENU_ATTEMPT', {
                x: event.clientX,
                y: event.clientY
            });
            
            showSecurityMessageTemporary('Menú contextual deshabilitado durante el examen');
            
            // Incrementar contador de advertencias
            setSecurityWarningCount(prev => {
                const newCount = prev + 1;
                
                if (newCount >= MAX_SECURITY_WARNINGS) {
                    setTimeout(() => {
                        penalizeAttempt();
                        handleCloseModal();
                        setLoadMsg("Examen cerrado por intentos de acceso al menú contextual");
                        setTimeout(() => setLoadMsg(''), 3000);
                    }, 1000);
                }
                
                return newCount;
            });
            
            return false;
        };
        
        // Agregar event listeners
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('contextmenu', handleContextMenu, true);
        
        // Activar keyboard lock
        setKeyboardLockActive(true);
        
        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('contextmenu', handleContextMenu, true);
            setKeyboardLockActive(false);
        };
    }, [showExamModal, showScoreResult]);
    
    // Sistema de protección anti-capturas: Detección de screenshots
    useEffect(() => {
        if (!showExamModal || showScoreResult) return;
        
        const handleScreenshotAttempt = (event) => {
            // Detectar PrintScreen (ya manejado en keyboard lock)
            // También podemos detectar intentos de captura de pantalla nativa
            if (event.key === 'PrintScreen') {
                // Mostrar overlay de protección
                setScreenshotProtectionActive(true);
                
                // Registrar violación
                SECURITY_LOGGER.logViolation('SCREENSHOT_ATTEMPT', {
                    method: 'PrintScreen',
                    timestamp: new Date().toISOString()
                });
                
                // Ocultar overlay después de 5 segundos
                setTimeout(() => {
                    setScreenshotProtectionActive(false);
                }, SCREENSHOT_OVERLAY_DURATION);
                
                showSecurityMessageTemporary('¡Protección anti-capturas activada!');
            }
        };
        
        // Agregar listener
        document.addEventListener('keydown', handleScreenshotAttempt, true);
        
        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleScreenshotAttempt, true);
            setScreenshotProtectionActive(false);
        };
    }, [showExamModal, showScoreResult]);
    
    // Manejador unificado de botones - Functional Button Engine v1
    // Función para manejar clics en desafíos con debounce y feedback universal
    const handleChallengeClick = async (actionType, data = {}) => {
        if (isButtonDisabled) {
            console.log('⏳ Botón deshabilitado temporalmente (debounce activo)');
            return;
        }
        
        setIsButtonDisabled(true);
        setIsStartingChallenge(true);
        
        try {
            await handleButtonClick(actionType, data);
        } catch (error) {
            console.error('❌ Error al procesar desafío:', error);
        } finally {
            // Re-enable después de 1 segundo (previene clics múltiples)
            setTimeout(() => {
                setIsButtonDisabled(false);
                setIsStartingChallenge(false);
            }, 1000);
        }
    };
    
    const handleButtonClick = async (actionType, data = {}) => {
        console.log(`[Button Engine] Acción: ${actionType}`, data);
        
        switch (actionType) {
            case 'NEXT_LESSON':
                if (currentLessonIndex < moduleLessons.length - 1) {
                    setCurrentLessonIndex(prev => prev + 1);
                    
                    // Guardar progreso en Supabase
                    try {
                        const lessonId = moduleLessons[currentLessonIndex + 1].id;
                        await saveProgress(
                            activeMod,
                            PROGRESS_STATUS.IN_PROGRESS,
                            { lesson_id: lessonId }
                        );
                        console.log(`Progreso guardado: Módulo ${activeMod}, Lección ${lessonId}`);
                    } catch (error) {
                        console.error('Error al guardar progreso:', error);
                    }
                }
                break;
                
            case 'PREV_LESSON':
                if (currentLessonIndex > 0) {
                    setCurrentLessonIndex(prev => prev - 1);
                }
                break;
                
            case 'COMPLETE_MODULE':
                setIsMarkingComplete(true);
                try {
                    // Marcar módulo como completado
                    await saveProgress(
                        activeMod,
                        PROGRESS_STATUS.COMPLETED,
                        { lesson_id: moduleLessons[moduleLessons.length - 1].id }
                    );
                    
                    // Actualizar estado local
                    if (!completedModules.includes(activeMod)) {
                        setCompletedModules(prev => [...prev, activeMod]);
                    }
                    
                    // Si no es el último módulo, desbloquear el siguiente
                    if (activeMod < LAST_MODULE_ID && !visitedModules.includes(activeMod + 1)) {
                        setVisitedModules(prev => [...prev, activeMod + 1]);
                    }
                    
                    console.log(`Módulo ${activeMod} marcado como completado`);
                } catch (error) {
                    console.error('Error al completar módulo:', error);
                } finally {
                    setIsMarkingComplete(false);
                }
                break;
                
            case 'UNLOCK_NEXT_MODULE':
                if (activeMod < 5) { // Asumiendo 5 módulos totales
                    const nextModule = activeMod + 1;
                    
                    // Desbloquear módulo siguiente
                    if (!visitedModules.includes(nextModule)) {
                        setVisitedModules(prev => [...prev, nextModule]);
                    }
                    
                    // Mostrar mensaje de éxito
                    setLoadMsg(`¡Módulo ${nextModule} desbloqueado!`);
                    setTimeout(() => setLoadMsg(''), 3000);
                    
                    // Cerrar modal de examen
                    setShowExamModal(false);
                    setShowEvaluationQuiz(false);
                    
                    // Navegar automáticamente al siguiente módulo
                    setActiveMod(nextModule);
                    
                    // Resetear quiz para nuevo módulo
                    resetQuizForRetry();
                    setSecurityWarningCount(0);
                }
                break;
                
            case 'OPEN_SYNTHESIZER':
                // GUARDAR PROGRESO EN SUPABASE AL INICIAR DESAFÍO
                try {
                    if (user?.id) {
                        const challengeData = {
                            challenge_started_at: new Date().toISOString(),
                            challenge_mode: data.mode || 'practice', // 'practice' o 'solution'
                            challenge_completed: false,
                            challenge_estimated_time: 45, // minutos
                            module_title: modules.find(m => m.id === activeMod)?.title || 'Desafío'
                        };
                        
                        await saveProgress(
                            activeMod,
                            PROGRESS_STATUS.IN_PROGRESS,
                            challengeData
                        );
                        
                        console.log('✅ Desafío iniciado - progreso guardado en Supabase:', challengeData);
                        
                        // Actualizar estado local
                        setIsChallengeCompleted(false);
                        setIsButtonDisabled(false); // Permitir interactuar mientras el desafío está en progreso
                    }
                } catch (error) {
                    console.error('❌ Error al guardar inicio de desafío:', error);
                }
                
                setIsSynthesizerOpen(true);
                break;
                
            case 'COMPLETE_CHALLENGE':
                // MARCAR DESAFÍO COMO COMPLETADO EN SUPABASE
                try {
                    if (user?.id) {
                        const challengeData = {
                            challenge_completed: true,
                            challenge_completed_at: new Date().toISOString(),
                            challenge_score: data.score || 100, // Puntuación opcional
                            status: PROGRESS_STATUS.COMPLETED
                        };
                        
                        await saveProgress(
                            activeMod,
                            PROGRESS_STATUS.COMPLETED,
                            challengeData
                        );
                        
                        console.log('✅ Desafío completado - progreso actualizado en Supabase:', challengeData);
                        
                        // Actualizar estado local
                        setIsChallengeCompleted(true);
                        setIsButtonDisabled(true);
                        setChallengeScore(data.score || 100);
                        
                        // Mostrar mensaje de éxito con puntuación
                        if (data.showMessage !== false) {
                            const score = data.score || 100;
                            const isApproved = score >= 70;
                            alert(`🎉 ¡Desafío completado con éxito! Puntuación: ${score}%${isApproved ? ' (Aprobado)' : ' (Reprobado - necesitas 70% para aprobar)'}. Tu progreso ha sido guardado.`);
                        }
                    }
                } catch (error) {
                    console.error('❌ Error al marcar desafío como completado:', error);
                }
                break;
                
            case 'CLOSE_SYNTHESIZER':
                setIsSynthesizerOpen(false);
                break;
                
            case 'SUBMIT_QUIZ':
                setIsSubmittingQuiz(true);
                try {
                    // Verificar límite diario
                    if (!canAttemptQuiz()) {
                        alert(`Has alcanzado el límite de ${DAILY_ATTEMPTS_LIMIT} intentos por día. Vuelve mañana.`);
                        break;
                    }
                    
                    // Validar que las 8 preguntas estén respondidas
                    const allAnswered = Object.keys(quizAnswers).length >= TOTAL_QUESTIONS;
                    if (!allAnswered) {
                        alert(`Por favor responde las ${TOTAL_QUESTIONS} preguntas antes de enviar.`);
                        break;
                    }
                    
                    // Calcular puntuación (8 preguntas)
                    const result = calculateQuizScore(quizAnswers);
                    setQuizResult(result);
                    setQuizScore(result.score);
                    setQuizPassed(result.passed);
                    setShowScoreResult(true);
                    
                    // Guardar resultado en Supabase
                    try {
                        const saveResult = await saveExamResult(
                            activeMod,
                            result.score,
                            100, // maxScore
                            quizAnswers
                        );
                        
                        if (saveResult.success) {
                            console.log('Resultado guardado en Supabase:', saveResult);
                        }
                    } catch (dbError) {
                        console.error('Error al guardar en Supabase:', dbError);
                        // Continuar aunque falle Supabase
                    }
                    
                    // Actualizar contador de intentos
                    setDailyAttemptsCount(prev => prev + 1);
                    setLastAttemptDate(new Date().toISOString());
                    
                    // Guardar intento en localStorage
                    const attempt = {
                        date: new Date().toISOString(),
                        score: result.score,
                        passed: result.passed,
                        answers: { ...quizAnswers },
                        moduleId: activeMod
                    };
                    
                    const savedAttempts = localStorage.getItem(`quizAttempts_${activeMod}`) || '[]';
                    const attempts = JSON.parse(savedAttempts);
                    attempts.push(attempt);
                    localStorage.setItem(`quizAttempts_${activeMod}`, JSON.stringify(attempts));
                    
                    // Agregar a historial de intentos
                    setQuizAttempts(prev => [...prev, attempt]);
                    
                    // Detener timer
                    setIsTimerRunning(false);
                    
                    // Scroll a resultados
                    setTimeout(() => {
                        const resultsElement = document.getElementById('quiz-results');
                        if (resultsElement) {
                            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 500);
                    
                } catch (error) {
                    console.error('Error al enviar quiz:', error);
                    alert('Error al procesar el quiz. Por favor intenta nuevamente.');
                } finally {
                    setIsSubmittingQuiz(false);
                }
                break;
                
            case 'UPDATE_QUIZ_ANSWER':
                setQuizAnswers(prev => ({
                    ...prev,
                    [data.questionId]: data.answer
                }));
                break;
                
            case 'OPEN_EVALUATION':
                if (isEvaluationLocked(activeMod)) {
                    setShowEvaluationTooltip(true);
                    setTimeout(() => setShowEvaluationTooltip(false), 3000);
                } else {
                    // Abrir modal de examen
                    setShowExamModal(true);
                    setShowEvaluationQuiz(true);
                    
                    // Iniciar timer sugerido
                    setIsTimerRunning(true);
                    
                    // Resetear contador de advertencias de seguridad
                    setSecurityWarningCount(0);
                    
                    // Si es un nuevo intento (no hay intentos previos o tiene intentos disponibles)
                    const latestAttempt = getLatestQuizAttempt();
                    if (!latestAttempt || dailyAttemptsCount < DAILY_ATTEMPTS_LIMIT) {
                        resetQuizForRetry();
                    }
                }
                break;
                
            case 'REVIEW_TOPIC':
                // Navegar al tema específico para revisión
                if (data.topic) {
                    scrollToLesson(data.topic);
                }
                break;
                
            case 'PRACTICE_EXERCISES':
                // Abrir ejercicios prácticos del tema
                console.log('Abrir ejercicios prácticos para:', data.topic);
                // Mostrar modal con ejercicios prácticos
                alert(`📝 **Ejercicios Prácticos: ${data.topic || 'Tema Actual'}**\n\n` +
                      `1. Crea 3 prompts diferentes para resolver el mismo problema\n` +
                      `2. Evalúa la efectividad de cada prompt\n` +
                      `3. Refina el mejor prompt basado en los resultados\n\n` +
                      `*La funcionalidad completa de ejercicios estará disponible próximamente.*`);
                break;
                
            case 'RESET_QUIZ':
                resetQuizForRetry();
                break;
                
            default:
                console.warn(`Acción no reconocida: ${actionType}`);
        }
    };
    
    // Función helper para obtener el último intento del quiz
    const getLatestQuizAttempt = () => {
        if (quizAttempts.length === 0) return null;
        return quizAttempts[quizAttempts.length - 1];
    };
    
    // ==================== SISTEMA DE LOGGING DE SEGURIDAD ====================
    
    // Logger de eventos de seguridad
    const SECURITY_LOGGER = {
        // Registrar una violación de seguridad
        logViolation: (type, details = {}) => {
            const logEntry = {
                id: Date.now(),
                type,
                timestamp: new Date().toISOString(),
                moduleId: activeMod,
                userId: user?.id || 'anonymous',
                details,
                violationCount: securityViolations + 1
            };
            
            // Obtener logs existentes
            const logKey = `${SECURITY_LOG_PREFIX}_${user?.id || 'anonymous'}_${new Date().toDateString()}`;
            const existingLogs = localStorage.getItem(logKey) || '[]';
            const logs = JSON.parse(existingLogs);
            
            // Agregar nuevo log
            logs.push(logEntry);
            
            // Guardar en localStorage (máximo 100 entradas por día)
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }
            
            localStorage.setItem(logKey, JSON.stringify(logs));
            
            // Incrementar contador de violaciones
            setSecurityViolations(prev => prev + 1);
            
            // Mostrar mensaje temporal
            showSecurityMessageTemporary(`Violación de seguridad: ${type}`);
            
            console.log(`[SECURITY] Violación registrada: ${type}`, logEntry);
            return logEntry;
        },
        
        // Obtener violaciones de hoy
        getViolationsToday: () => {
            const logKey = `${SECURITY_LOG_PREFIX}_${user?.id || 'anonymous'}_${new Date().toDateString()}`;
            const existingLogs = localStorage.getItem(logKey) || '[]';
            return JSON.parse(existingLogs);
        },
        
        // Obtener total de violaciones hoy
        getViolationCountToday: () => {
            return SECURITY_LOGGER.getViolationsToday().length;
        },
        
        // Limpiar logs antiguos (más de 30 días)
        clearOldLogs: () => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(SECURITY_LOG_PREFIX)) {
                    try {
                        const logs = JSON.parse(localStorage.getItem(key) || '[]');
                        if (logs.length > 0) {
                            const firstLogDate = new Date(logs[0].timestamp);
                            if (firstLogDate < thirtyDaysAgo) {
                                localStorage.removeItem(key);
                            }
                        }
                    } catch (error) {
                        console.error('Error al limpiar logs antiguos:', error);
                    }
                }
            }
        }
    };
    
    // Función para mostrar mensajes de seguridad temporales
    const showSecurityMessageTemporary = (message) => {
        setSecurityMessage(message);
        setShowSecurityMessage(true);
        
        setTimeout(() => {
            setShowSecurityMessage(false);
        }, SECURITY_MESSAGE_DURATION);
    };
    
    // Función para penalizar intento por violaciones de seguridad
    const penalizeAttempt = () => {
        if (dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT) {
            showSecurityMessageTemporary('Ya has alcanzado el límite de intentos diarios');
            return;
        }
        
        // Incrementar contador de intentos (penalización)
        setDailyAttemptsCount(prev => {
            const newCount = prev + SECURITY_VIOLATION_PENALTY;
            
            // Guardar en localStorage
            const today = new Date().toDateString();
            localStorage.setItem(`dailyAttempts_${activeMod}_${today}`, newCount.toString());
            
            return newCount;
        });
        
        setAttemptsPenalized(prev => prev + SECURITY_VIOLATION_PENALTY);
        
        // Registrar penalización
        SECURITY_LOGGER.logViolation('PENALTY_APPLIED', {
            violations: securityViolations,
            attemptsPenalized: SECURITY_VIOLATION_PENALTY,
            dailyAttemptsCount: dailyAttemptsCount + SECURITY_VIOLATION_PENALTY
        });
        
        showSecurityMessageTemporary(`¡Penalización! Has perdido ${SECURITY_VIOLATION_PENALTY} intento por infracciones de seguridad`);
    };
    
    // ==================== FIN SISTEMA DE LOGGING ====================
    
    // Función para manejar el cierre del modal de examen
    const handleCloseModal = () => {
        if (Object.keys(quizAnswers).length > 0 && !showScoreResult) {
            // Mostrar confirmación si hay respuestas sin enviar
            setShowExitConfirmation(true);
        } else {
            // Cerrar directamente si no hay progreso o ya envió
            setShowExamModal(false);
            setShowEvaluationQuiz(false);
            resetQuizForRetry(); // Limpiar respuestas
            
            // Limpiar estados de seguridad
            setSecurityWarningCount(0);
            setSecurityViolations(0);
            setScreenshotProtectionActive(false);
            setShowSecurityStatus(false);
            setShowSecurityMessage(false);
        }
    };
    
    // Función para formatear tiempo (minutos:segundos)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    return (
        <>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Encabezado Global */}
            <header className="w-full fixed top-0 left-0 z-[60] h-20 bg-gradient-to-r from-white via-white/98 to-white/95 backdrop-blur-xl border-b border-slate-100/80 px-10 flex items-center justify-between shadow-[0_8px_32px_rgba(0,55,74,0.08)]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00374A] via-[#00BCD4] to-[#4DA8C4] rounded-xl flex items-center justify-center shadow-sm">
                            <Icon name="fa-flask-vial" className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl text-[#00374A] tracking-tight">IA Lab Pro</h1>
                            <p className="text-sm text-slate-600 font-normal leading-relaxed">Hyper-Intelligence Certification</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 bg-cyan-50/40 backdrop-blur-md border border-cyan-100/50 text-cyan-700 rounded-full hover:bg-cyan-50/60 hover:scale-[1.02] hover:shadow-sm transition-all duration-500 ease-out">
                        <span className="text-sm font-semibold">{completedModules.length}/5 Módulos</span>
                    </div>
                    
                    {/* Dropdown de Perfil de Usuario - Componente Premium 100% Funcional */}
                    <UserDropdownMenuSimplified 
                        onNavigate={(view) => {
                            console.log('Navegando a:', view);
                            if (view === 'landing') {
                                onBack && onBack();
                            } else if (view === 'certificados') {
                                // Para certificados, mostrar información
                                alert('Sistema de certificados:\n\n• Certificado VAK Básico\n• Certificado VAK Avanzado\n• Certificado EdutechLife Pro\n\nLos certificados se generan automáticamente al completar cursos.');
                            }
                            // Para otras vistas, el componente maneja sus propios modales
                        }}
                    />
                </div>
            </header>

            {/* Contenedor de Layout */}
            <div ref={containerRef} className="flex flex-row items-start h-screen mt-20 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 relative font-open-sans overflow-hidden">
                {/* Sidebar Izquierdo - VERSIÓN SIMPLIFICADA */}
                <aside className="w-[20%] h-[calc(100vh-5rem)] border-r border-[#004B63]/10 bg-gradient-to-b from-white via-white/98 to-[#F8FAFC]/95 backdrop-blur-xl shadow-[0_12px_48px_rgba(0,75,99,0.12)] z-30 overflow-y-auto">
                    <div className="px-5 py-6 space-y-6">
                        {/* Progress Circle */}
                        <div className="flex flex-col items-center p-6 border border-slate-100/60 bg-white/90 shadow-[0_40px_80px_rgba(0,75,99,0.08)] rounded-3xl w-full backdrop-blur-sm">
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="#E2E8F0" strokeWidth="10" fill="none" className="stroke-slate-100" />
                                    <circle cx="64" cy="64" r="56" stroke="#00BCD4" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="351.858" strokeDashoffset={351.858 - (351.858 * Math.min(completedModules.length * 20, 100)) / 100} className="transition-all duration-700 ease-out" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#00374A]">{Math.min(completedModules.length * 20, 100)}%</div>
                                        <div className="text-xs text-slate-500 mt-1">Completado</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-[#00374A] mb-1">Progreso del Curso</h3>
                                <p className="text-sm text-slate-600">Avanza completando módulos</p>
                            </div>
                        </div>

                        {/* Espaciado entre secciones */}
                        <div className="mt-8"></div>

                        {/* Sección: Módulos del Curso */}
                        <div className="px-2 w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-[#004B63]">
                                    <Icon name="fa-layer-group" className="text-sm" />
                                </div>
                                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                    MÓDULOS DEL CURSO
                                </h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                            </div>
                            <div className="space-y-2">
                                {modules.map((mod) => (
                                    <button
                                        key={mod.id}
                                        onClick={() => !isModuleLocked(mod.id) && setActiveMod(mod.id)}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeMod === mod.id ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white' : 'hover:bg-[#004B63]/10'} focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1`}
                                        disabled={isModuleLocked(mod.id)}
                                        aria-label={`${isModuleLocked(mod.id) ? 'Módulo bloqueado: ' : ''}${mod.title}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activeMod === mod.id ? 'bg-white/20' : 'bg-[#004B63]/10'}`}>
                                            <Icon name={mod.icon} className={`${activeMod === mod.id ? 'text-white' : 'text-[#004B63]'} text-sm`} />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="font-semibold text-sm truncate font-body">{mod.title}</p>
                                            <p className={`text-xs ${activeMod === mod.id ? 'text-white/80' : 'text-[#64748B]'} font-body`}>
                                                {mod.duration}
                                            </p>
                                        </div>
                                        {isModuleLocked(mod.id) && (
                                            <Icon name="fa-lock" className="text-xs text-slate-400" />
                                        )}
                                        {!isModuleLocked(mod.id) && completedModules.includes(mod.id) && (
                                            <Icon name="fa-check" className="text-xs text-emerald-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                         {/* Sección: Videos del Módulo - Integrada al Sidebar */}
                         <div className="px-2 w-full">
                             <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                     <div className="text-[#004B63]">
                                         <Icon name="fa-video-camera" className="text-sm" />
                                     </div>
                                     <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                         VIDEOS DEL MÓDULO
                                     </h3>
                                     <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                                 </div>
                                 <Icon 
                                     name={sidebarDropdowns.videos ? "fa-chevron-up" : "fa-chevron-down"} 
                                     className="text-[#004B63] text-sm transition-transform duration-300 cursor-pointer hover:text-[#00BCD4]"
                                     onClick={() => toggleSidebarDropdown('videos')}
                                 />
                             </div>
                     
                             {sidebarDropdowns.videos && (
                                 <div className="space-y-3 animate-fadeIn">
                                     {/* Video 1: Mastery Framework */}
                                     <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-play" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Mastery Framework</p>
                                             <div className="flex items-center gap-3 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-body">Principiante</span>
                                                 <span className="text-xs text-[#64748B] font-body">12:45</span>
                                             </div>
                                         </div>
                                     </div>
                                     
                                     {/* Video 2: Contexto Dinámico */}
                                     <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-play" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Contexto Dinámico</p>
                                             <div className="flex items-center gap-3 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg font-body">Intermedio</span>
                                                 <span className="text-xs text-[#64748B] font-body">18:30</span>
                                             </div>
                                         </div>
                                     </div>
                                     
                                     {/* Video 3: Zero-Shot Prompting */}
                                     <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-play" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Zero-Shot Prompting</p>
                                             <div className="flex items-center gap-3 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-red-50 text-red-700 rounded-lg font-body">Avanzado</span>
                                                 <span className="text-xs text-[#64748B] font-body">22:15</span>
                                             </div>
                                         </div>
                                     </div>
                                  </div>
                                 )}
                              </div>

                          {/* Espaciado entre secciones */}
                          <div className="mt-8"></div>

                          {/* Sección: Recursos Descargables - Integrada al Sidebar */}
                         <div className="px-2 w-full">
                             <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                     <div className="text-[#004B63]">
                                         <Icon name="fa-clipboard" className="text-sm" />
                                     </div>
                                     <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                         RECURSOS DESCARGABLES
                                     </h3>
                                     <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                                 </div>
                                 <Icon 
                                     name={sidebarDropdowns.recursos ? "fa-chevron-up" : "fa-chevron-down"} 
                                     className="text-[#004B63] text-sm transition-transform duration-300 cursor-pointer hover:text-[#00BCD4]"
                                     onClick={() => toggleSidebarDropdown('recursos')}
                                 />
                             </div>
                     
                             {sidebarDropdowns.recursos && (
                                 <div className="space-y-3 animate-fadeIn">
                                     {/* Recurso 1: Plantilla MasterPrompt Pro */}
                                      <button 
                                          className="w-full flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 text-left group focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1"
                                          aria-label="Descargar Plantilla MasterPrompt Pro (PDF)"
                                      >
                                          <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                              <Icon name="fa-file-pdf" className="text-[#004B63] text-sm" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-[#334155] truncate font-body">Plantilla MasterPrompt Pro</p>
                                              <div className="flex items-center gap-2 mt-2">
                                                  <span className="text-xs font-medium px-3 py-1.5 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-lg font-body">PDF</span>
                                              </div>
                                          </div>
                                          <Icon name="fa-download" className="text-[#004B63] text-sm hover:text-[#00BCD4] transition-colors" />
                                      </button>
                                     
                                     {/* Recurso 2: Checklist de Evaluación */}
                                      <button 
                                          className="w-full flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 text-left group focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1"
                                          aria-label="Descargar Checklist de Evaluación (DOCX)"
                                      >
                                          <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                              <Icon name="fa-clipboard-check" className="text-[#004B63] text-sm" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-[#334155] truncate font-body">Checklist de Evaluación</p>
                                              <div className="flex items-center gap-2 mt-2">
                                                  <span className="text-xs font-medium px-3 py-1.5 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-lg font-body">DOCX</span>
                                              </div>
                                          </div>
                                          <Icon name="fa-download" className="text-[#004B63] text-sm hover:text-[#00BCD4] transition-colors" />
                                      </button>
                                     
                                     {/* Recurso 3: Templates JSON para APIs */}
                                      <button 
                                          className="w-full flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 text-left group focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1"
                                          aria-label="Descargar Templates JSON para APIs"
                                      >
                                          <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                              <Icon name="fa-code" className="text-[#004B63] text-sm" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-[#334155] truncate font-body">Templates JSON para APIs</p>
                                              <div className="flex items-center gap-2 mt-2">
                                                  <span className="text-xs font-medium px-3 py-1.5 bg-[#FFD166]/10 text-[#FFD166] rounded-lg font-body">JSON</span>
                                              </div>
                                          </div>
                                          <Icon name="fa-download" className="text-[#004B63] text-sm hover:text-[#00BCD4] transition-colors" />
                                       </button>
                                  </div>
                                  )}
                              </div>

                         {/* Sección: Detalles del Curso */}
                         <div className="px-2 w-full">
                             <div className="flex items-center gap-3 mb-4">
                                 <div className="text-[#004B63]">
                                     <Icon name="fa-info-circle" className="text-sm" />
                                 </div>
                                 <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                     DETALLES DEL CURSO
                                 </h3>
                                 <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                             </div>
                             <div className="space-y-3">
                                 <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                                             <Icon name="fa-clock" className="text-[#00BCD4] text-sm" />
                                         </div>
                                         <span className="text-sm font-medium text-[#64748B] font-body">Duración</span>
                                     </div>
                                     <span className="text-sm font-bold text-[#004B63] font-display">{curr?.duration}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                                             <Icon name="fa-signal" className="text-[#00BCD4] text-sm" />
                                         </div>
                                         <span className="text-sm font-medium text-[#64748B] font-body">Nivel</span>
                                     </div>
                                     <span className="text-sm font-bold text-[#004B63] font-display">{curr?.level}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                                             <Icon name="fa-play" className="text-[#00BCD4] text-sm" />
                                         </div>
                                         <span className="text-sm font-medium text-[#64748B] font-body">Videos</span>
                                     </div>
                                     <span className="text-sm font-bold text-[#004B63] font-display">{curr?.videos}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                                             <Icon name="fa-briefcase" className="text-[#00BCD4] text-sm" />
                                         </div>
                                         <span className="text-sm font-medium text-[#64748B] font-body">Proyectos</span>
                                     </div>
                                     <span className="text-sm font-bold text-[#004B63] font-display">{curr?.projects}</span>
                                 </div>
                              </div>
                         </div>
                      </div>
                  </aside>

                {/* Área de Contenido Principal */}
                <main className="w-[80%] ml-[20%] px-4 py-6 h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="space-y-8 w-full max-w-[calc(100%-1rem)] pb-10">
                        {/* Module Header */}
                        <div className="bg-gradient-to-br from-white via-white/95 to-[#F8FAFC] border border-[#E2E8F0]/50 shadow-[0_8px_40px_rgba(0,75,99,0.08)] rounded-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Icon name={curr.icon} className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{curr.title}</h2>
                                            <p className="text-white text-sm">{curr.desc}</p>
                                        </div>
                                    </div>
                                     <div className="flex items-center gap-3">
                                          <div className="flex items-center gap-3">
                                               <button 
                                                   className={`bg-white text-[#00374A] shadow-sm px-6 py-3 rounded-xl hover:bg-slate-50 transition-all duration-300 ease-in-out transform active:scale-95 font-medium flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2 ${isEvaluationLocked(activeMod) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                   disabled={isEvaluationLocked(activeMod)}
                                                   onClick={() => !isEvaluationLocked(activeMod) && handleButtonClick('OPEN_EVALUATION')}
                                                   aria-label={isEvaluationLocked(activeMod) ? "Evaluación bloqueada - Completa módulos anteriores" : "Tomar evaluación del módulo actual"}
                                               >
                                                   <Icon name="fa-clipboard-check" className={`${isEvaluationLocked(activeMod) ? 'text-slate-400' : 'text-[#00374A]'}`} />
                                                   {isEvaluationLocked(activeMod) ? (
                                                       <>
                                                           <Icon name="fa-lock" className="text-xs text-[#00374A]" />
                                                           Evaluación Bloqueada
                                                       </>
                                                   ) : getLatestQuizAttempt() ? (
                                                       'Volver a Intentar'
                                                   ) : (
                                                       'Tomar Evaluación'
                                                   )}
                                               </button>
                                              
                                              {/* Badge de porcentaje del último intento */}
                                              {!isEvaluationLocked(activeMod) && getLatestQuizAttempt() && (
                                                   <div className="relative group">
                                                       <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-white text-[#00374A] border-2 border-[#00BCD4]"
                                                           title={`Último intento: ${getLatestQuizAttempt().score}%`}>
                                                           {getLatestQuizAttempt().score}%
                                                       </div>
                                                      
                                                       {/* Tooltip */}
                                                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block z-50">
                                                           <div className="bg-[#00374A] text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                               Último intento: {getLatestQuizAttempt().score}%
                                                           </div>
                                                       </div>
                                                  </div>
                                              )}
                                          </div>
                                     </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-[#00374A] mb-3">Lo que aprenderás</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {curr.topics.map((topic, idx) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <Icon name="fa-check" className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-slate-700">{topic}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-[#00BCD4]/10 border-l-4 border-[#00BCD4] p-4 rounded-r-xl">
                                    <div className="flex items-start gap-3">
                                        <Icon name="fa-lightbulb" className="text-[#00BCD4] flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#00374A] mb-1">Desafío del Módulo</h4>
                                            <p className="text-sm text-[#00374A]">{curr.challenge}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cuadro de Introducción - Acordeón Interactivo SaaS Premium v4 */}
                        <div className="bg-white border border-slate-50 shadow-[0_40px_100px_rgba(0,0,0,0.06)] rounded-[28px] p-12 mb-8 w-full transition-all duration-500 ease-out hover:shadow-[0_50px_120px_rgba(0,0,0,0.08)]">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-[#00374A]">Ingeniería de Prompts: El Arte de Comunicarse con la IA</h2>
                                    <p className="text-xl font-medium text-slate-600 leading-relaxed max-w-3xl mb-4">Domina el arte de comunicarte con la I.A a nivel experto.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-xl">
                                        Lección {currentLessonIndex + 1} de {moduleLessons.length}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleButtonClick('PREV_LESSON')}
                                            disabled={currentLessonIndex === 0}
                                            className={`${buttonClasses.small} ${currentLessonIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            aria-label="Lección anterior"
                                        >
                                            <Icon name="fa-chevron-left" />
                                        </button>
                                        <button
                                            onClick={() => handleButtonClick('NEXT_LESSON')}
                                            disabled={currentLessonIndex === moduleLessons.length - 1}
                                            className={`${buttonClasses.small} ${currentLessonIndex === moduleLessons.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            aria-label="Siguiente lección"
                                        >
                                            <Icon name="fa-chevron-right" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Indicador de progreso de lección actual */}
                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#00374A]">
                                        {moduleLessons[currentLessonIndex]?.title}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {currentLessonIndex + 1}/{moduleLessons.length}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#00374A] to-[#00BCD4] transition-all duration-500 ease-out"
                                        style={{ width: `${((currentLessonIndex + 1) / moduleLessons.length) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">
                                    {moduleLessons[currentLessonIndex]?.description}
                                </p>
                            </div>
                            
                            {/* Cuadro de Introducción - Acordeones Premium SaaS v1.0 */}
                            <div className="space-y-4 md:space-y-6">
                                {moduleLessons.map((lesson, index) => (
                                    renderPremiumAccordion(index + 1, lesson)
                                ))}
                            </div>
                        </div>

                        {/* Contenedor Grid: Laboratorio y Comunidad - Dashboard de Dos Columnas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-10">
                              {/* Columna Izquierda: Desafío del Curso - COMPONENTE REUTILIZABLE PREMIUM */}
                                <ChallengeCard
                                   title="Desafío del Curso"
                                   description="Aplica lo aprendido en un reto práctico"
                                   challengeText={modules.find(m => m.id === activeMod)?.challenge || 'Crea un prompt para resolver un problema complejo de tu industria.'}
                                   estimatedTime="45 min"
                                   score={challengeScore}
                                   isLoading={isLoadingProgress}
                                   isCompleted={isChallengeCompleted}
                                   isStarting={isStartingChallenge}
                                   isDisabled={isButtonDisabled}
                                   onStartChallenge={() => handleChallengeClick('OPEN_SYNTHESIZER')}
                                   onViewSolution={() => handleChallengeClick('OPEN_SYNTHESIZER', { mode: 'solution' })}
                                   onReviewCompleted={() => {
                                       // TODO: Implementar navegación a "Mis Proyectos" cuando exista
                                       // Por ahora, mostrar modal con detalles del desafío completado
                                       const isApproved = challengeScore >= 70;
                                       const message = `📊 **Resumen del Desafío Completado**\n\n` +
                                                      `• **Puntuación:** ${challengeScore}%\n` +
                                                      `• **Estado:** ${isApproved ? '✅ Aprobado' : '⚠️ Reprobado (necesitas 70%)'}\n` +
                                                      `• **Módulo:** ${modules.find(m => m.id === activeMod)?.title || 'Desafío del Curso'}\n` +
                                                      `• **Fecha de completado:** ${new Date().toLocaleDateString()}\n\n` +
                                                      `*La funcionalidad de "Mis Proyectos" estará disponible próximamente.*`;
                                       
                                       alert(message);
                                   }}
                                   onRetryChallenge={async () => {
                                       if (confirm('¿Quieres realizar una versión avanzada de este desafío?\n\nTu puntuación anterior se conservará como referencia.')) {
                                           try {
                                               // Guardar historial del intento anterior
                                               if (user?.id && challengeScore > 0) {
                                                   const historyData = {
                                                       previous_score: challengeScore,
                                                       previous_completed_at: new Date().toISOString(),
                                                       retry_initiated_at: new Date().toISOString(),
                                                       is_advanced_version: true
                                                   };
                                                   
                                                   await saveProgress(
                                                       activeMod,
                                                       PROGRESS_STATUS.IN_PROGRESS,
                                                       historyData
                                                   );
                                               }
                                               
                                               // Reiniciar estados locales
                                               setIsChallengeCompleted(false);
                                               setIsButtonDisabled(false);
                                               setChallengeScore(0);
                                               
                                               console.log('Desafío avanzado iniciado - historial guardado');
                                               alert('🎯 Desafío avanzado iniciado. ¡Demuestra que puedes superar tu puntuación anterior!');
                                               
                                           } catch (error) {
                                               console.error('Error al iniciar desafío avanzado:', error);
                                               alert('⚠️ Error al iniciar el desafío avanzado. Intenta nuevamente.');
                                           }
                                       }
                                   }}
                                />

                              {/* Columna Derecha: Muro de Insights */}
                              <div className={`bg-white shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[28px] p-6 w-full transition-all duration-300 flex flex-col overflow-hidden
                                ${insightsExpanded 
                                  ? 'min-h-[500px] max-h-[calc(100vh-300px)]' 
                                  : 'h-[400px]'
                                }`}>
                                 <ErrorBoundary>
                                    <ForumCommunity 
                                      compact={!insightsExpanded}
                                      showHeader={insightsExpanded}
                                      showInput={true}
                                      showStats={insightsExpanded}
                                      limit={insightsExpanded ? 20 : 5}
                                    />
                                 </ErrorBoundary>
                                 
                                 {/* Botón de Expansión/Contracción */}
                                 <div className="text-center mt-6">
                                     <button 
                                         onClick={() => setInsightsExpanded(!insightsExpanded)}
                                         className="text-cyan-600 hover:text-[#00374A] font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mx-auto group focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded px-2 py-1"
                                         aria-label={insightsExpanded ? "Contraer muro de insights" : "Expandir para ver toda la conversación"}
                                     >
                                         {insightsExpanded ? (
                                             <>
                                                 <span>Contraer muro</span>
                                                 <Icon name="fa-chevron-up" className="text-xs group-hover:translate-y-[-2px] transition-transform duration-300" />
                                             </>
                                         ) : (
                                             <>
                                                 <span>Explorar toda la conversación</span>
                                                 <Icon name="fa-chevron-down" className="text-xs group-hover:translate-y-[2px] transition-transform duration-300 animate-bounce" />
                                             </>
                                         )}
                                     </button>
                                 </div>
                             </div>
                        </div>

                        {/* Sintetizador de Prompts Élite - Ahora arriba del grid */}
                        <div className={cn(
                            FORUM_COMPONENTS.CARD_GLASS,
                            "p-8 md:p-10 mb-8 w-full mt-10",
                            FORUM_EFFECTS.TRANSITION_ALL,
                            FORUM_EFFECTS.HOVER_SHADOW
                        )}>
                            <div className="mb-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                        GRADIENTS.PRIMARY,
                                        FORUM_EFFECTS.SHADOW_SM
                                    )}>
                                        <Icon name="fa-atom" className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            FORUM_TYPOGRAPHY.DISPLAY.LG,
                                            FORUM_TYPOGRAPHY.TEXT_PRIMARY
                                        )}>
                                            Sintetizador de Prompts Élite
                                        </h3>
                                        <p className={cn(
                                            FORUM_TYPOGRAPHY.BODY.SM,
                                            FORUM_TYPOGRAPHY.TEXT_LIGHT
                                        )}>
                                            Transforma ideas en MasterPrompts profesionales
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Describe tu idea o prompt base para optimización profesional..."
                                className={cn(
                                    FORUM_COMPONENTS.TEXTAREA_BASE,
                                    "mb-4",
                                    FORUM_TYPOGRAPHY.BODY.MD
                                )}
                                rows={4}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleOptimize(); } }}
                            />
                            
                            <button
                                onClick={handleOptimize}
                                disabled={loading}
                                className={cn(
                                    GRADIENTS.PRIMARY,
                                    "w-full px-6 py-3 rounded-xl",
                                    "text-white",
                                    FORUM_TYPOGRAPHY.MEDIUM,
                                    FORUM_EFFECTS.TRANSITION_ALL,
                                    FORUM_EFFECTS.HOVER_SCALE,
                                    "flex items-center justify-center gap-2",
                                    "focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2",
                                    "disabled:opacity-70 disabled:cursor-not-allowed",
                                    loading && "opacity-70 cursor-not-allowed"
                                )}
                                aria-label={loading ? `Procesando: ${loadMsg}` : "Sintetizar prompt maestro con IA"}
                            >
                                {loading ? (
                                    <>
                                        <div className={cn(
                                            "w-5 h-5 border-2 border-white border-t-transparent rounded-full",
                                            FORUM_EFFECTS.ANIMATION_SPIN
                                        )} />
                                        <span>{loadMsg}</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="fa-microchip" />
                                        <span>Sintetizar Prompt Maestro</span>
                                    </>
                                )}
                            </button>
                            
                            {genData && !loading && (
                                <div className="mt-6 space-y-4">
                                    {/* Caja de Resultado - Prompt Élite */}
                                    <div className={cn(
                                        FORUM_COMPONENTS.CARD_ACCENT,
                                        "font-mono p-6 relative",
                                        FORUM_EFFECTS.ANIMATION_FADE_IN
                                    )} style={{ animationDelay: '0.1s' }}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className={cn(
                                                FORUM_TYPOGRAPHY.BODY.XS,
                                                FORUM_TYPOGRAPHY.TEXT_LIGHT,
                                                "ml-2"
                                            )}>
                                                master-prompt.rtf
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "text-[14px] leading-relaxed whitespace-pre-wrap",
                                            "text-[#004B63]",  // Color específico solicitado
                                            FORUM_TYPOGRAPHY.BODY.MD
                                        )}>
                                            {genData.masterPrompt}
                                        </div>
                                        <button 
                                            onClick={() => navigator.clipboard.writeText(genData.masterPrompt)}
                                            className={cn(
                                                "absolute top-4 right-4 text-xs",
                                                "border border-[#00BCD4]/30 text-[#00BCD4]",
                                                "hover:bg-[#00BCD4]/10",
                                                "flex items-center gap-1 px-2 py-1 rounded",
                                                FORUM_EFFECTS.TRANSITION_ALL,
                                                "focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                                            )}
                                            aria-label="Copiar prompt maestro al portapapeles"
                                        >
                                            <Icon name="fa-copy" className="text-xs" /> Copiar
                                        </button>
                                    </div>
                                    
                                    {/* Caja de Retroalimentación Técnica */}
                                    <div className={cn(
                                        "bg-[#00BCD4]/5",  // Fondo cian con 5% de opacidad
                                        "border-l-4 border-[#00BCD4]",
                                        "p-6 rounded-r-xl",
                                        FORUM_EFFECTS.ANIMATION_FADE_IN
                                    )} style={{ animationDelay: '0.3s' }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon name="fa-lightbulb" className="text-[#00BCD4]" />
                                            <h4 className={cn(
                                                FORUM_TYPOGRAPHY.BODY.LG,
                                                FORUM_TYPOGRAPHY.SEMIBOLD,
                                                FORUM_TYPOGRAPHY.TEXT_PRIMARY
                                            )}>
                                                Análisis Técnico
                                            </h4>
                                        </div>
                                        <p className={cn(
                                            FORUM_TYPOGRAPHY.BODY.MD,
                                            "leading-relaxed mb-3",
                                            FORUM_TYPOGRAPHY.TEXT_SECONDARY
                                        )}>
                                            {genData.feedback}
                                        </p>
                                        
                                        {/* Técnicas Aplicadas */}
                                        {genData.techniques && (
                                            <div className="mt-4">
                                                <p className={cn(
                                                    FORUM_TYPOGRAPHY.BODY.SM,
                                                    FORUM_TYPOGRAPHY.MEDIUM,
                                                    FORUM_TYPOGRAPHY.TEXT_LIGHT,
                                                    "mb-2"
                                                )}>
                                                    Técnicas aplicadas:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {genData.techniques.map((tech, index) => (
                                                        <span key={index} className={cn(
                                                            FORUM_COMPONENTS.BADGE_SECONDARY
                                                        )}>
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                         </div>
                         
                          {/* Cuadro "¿Listo para avanzar?" - Muestra diferentes estados */}
                           {showReadyToAdvance && (
                               <div className="mt-10 pt-8 border-t border-slate-100">
                                   <div className="flex justify-between items-center">
                                       <div>
                                           <h3 className="text-lg font-bold text-[#00374A] mb-1">¿Listo para avanzar?</h3>
                                           <p className="text-sm text-slate-600">
                                               {showEvaluationQuiz 
                                                   ? "¡Excelente! Ahora responde el quiz de evaluación para validar tu aprendizaje."
                                                   : completedModules.includes(activeMod) 
                                                       ? "¡Ya completaste este módulo! Puedes continuar con el siguiente."
                                                       : "Marca este módulo como completado para desbloquear el siguiente nivel."}
                                           </p>
                                       </div>
                                       
                                       {/* Mostrar botón diferente según el estado */}
                                       {showEvaluationQuiz ? (
                                           // Cuando se muestra el quiz, mostrar botón para ir al quiz (ya está visible, pero por si acaso)
                                           <button
                                               onClick={() => {
                                                   const quizElement = document.getElementById('module-evaluation-quiz');
                                                   if (quizElement) {
                                                       quizElement.scrollIntoView({ 
                                                           behavior: 'smooth', 
                                                           block: 'start' 
                                                       });
                                                   }
                                               }}
                                               className={`${buttonClasses.primary}`}
                                               aria-label="Ir al quiz de evaluación"
                                           >
                                               <Icon name="fa-clipboard-check" />
                                               Ir al Quiz
                                           </button>
                                       ) : (
                                           // Cuando no hay quiz visible, mostrar botón para completar módulo
                                           <button
                                               onClick={() => handleButtonClick('COMPLETE_MODULE')}
                                               disabled={isMarkingComplete || completedModules.includes(activeMod) || !quizPassed}
                                               className={`${buttonClasses.primary} ${(isMarkingComplete || completedModules.includes(activeMod) || !quizPassed) ? buttonClasses.loading : ''}`}
                                               aria-label={!quizPassed ? "Debes aprobar el quiz primero" : completedModules.includes(activeMod) ? "Módulo ya completado" : "Marcar módulo como completado"}
                                           >
                                               {isMarkingComplete ? (
                                                   <>
                                                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                       Procesando...
                                                   </>
                                               ) : !quizPassed ? (
                                                   <>
                                                       <Icon name="fa-lock" />
                                                       Quiz No Aprobado
                                                   </>
                                               ) : completedModules.includes(activeMod) ? (
                                                   <>
                                                       <Icon name="fa-check-circle" />
                                                       Módulo Completado
                                                   </>
                                               ) : (
                                                   <>
                                                       <Icon name="fa-trophy" />
                                                       Completar Módulo
                                                   </>
                                               )}
                                           </button>
                                       )}
                                   </div>
                               </div>
                           )}
                          
                            {/* Quiz de evaluación del módulo - Sistema Mejorado (solo se muestra inline si NO hay modal abierto) */}
                            <div>
                                {showEvaluationQuiz && !showExamModal && (
                                    <div id="module-evaluation-quiz" className="mt-8 bg-gradient-to-br from-white to-[#F8FAFC] border border-slate-50 shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-[24px] p-8">
                              <div className="flex items-center gap-4 mb-6">
                                  <div className="w-10 h-10 bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-xl flex items-center justify-center">
                                      <Icon name="fa-clipboard-check" className="text-white" />
                                  </div>
                                  <div>
                                      <h3 className="text-xl font-bold text-[#00374A]">Evaluación del Módulo</h3>
                                      <p className="text-sm text-slate-600">Responde las 8 preguntas para validar tu aprendizaje (70% mínimo para aprobar)</p>
                                  </div>
                              </div>
                              
                              {/* Timer Sugerido */}
                              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                  <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                          <Icon name="fa-clock" className="text-blue-600" />
                                          <span className="text-sm font-medium text-blue-700">Tiempo sugerido</span>
                                          <span className="text-xs text-blue-500 px-2 py-1 bg-blue-100 rounded-full">
                                              Opcional
                                          </span>
                                      </div>
                                      <button
                                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                                          className="text-sm text-blue-600 hover:text-blue-800"
                                      >
                                          {isTimerRunning ? '⏸️ Pausar' : '▶️ Iniciar'} timer
                                      </button>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-blue-700">
                                              {Math.floor((suggestedTime - timeElapsed) / 60)}:{(suggestedTime - timeElapsed) % 60 < 10 ? '0' : ''}{(suggestedTime - timeElapsed) % 60}
                                          </div>
                                          <div className="text-xs text-blue-500 mt-1">Restante</div>
                                      </div>
                                      
                                      <div className="text-center">
                                          <div className="text-lg font-medium text-gray-700">
                                              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60 < 10 ? '0' : '')}{timeElapsed % 60}
                                          </div>
                                          <div className="text-xs text-gray-500">Transcurrido</div>
                                      </div>
                                      
                                      <div className="text-center">
                                          <div className="text-lg font-medium text-gray-700">{SUGGESTED_TIME_MINUTES}:00</div>
                                          <div className="text-xs text-gray-500">Total sugerido</div>
                                      </div>
                                  </div>
                                  
                                  {/* Barra de progreso del tiempo */}
                                  <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
                                      <div 
                                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000"
                                          style={{ width: `${(timeElapsed / suggestedTime) * 100}%` }}
                                      ></div>
                                  </div>
                                  
                                  {showTimeWarning && (
                                      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                          <p className="text-xs text-amber-700 flex items-center gap-1">
                                              <Icon name="fa-exclamation-triangle" />
                                              Llevas más de 15 minutos. Considera revisar tus respuestas.
                                          </p>
                                      </div>
                                  )}
                              </div>
                              
                              {/* Contador de intentos */}
                              <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                  <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                          <Icon name="fa-rotate-right" className="text-slate-600" />
                                          <span className="text-sm font-medium text-slate-700">Intentos diarios</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <span className="text-sm text-slate-600">
                                              {dailyAttemptsCount} / {DAILY_ATTEMPTS_LIMIT} usados hoy
                                          </span>
                                          {dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT && (
                                              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                                                  Límite alcanzado
                                              </span>
                                          )}
                                      </div>
                                  </div>
                                  
                                  {dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT && (
                                      <p className="text-xs text-slate-600 mt-2">
                                          <Icon name="fa-info-circle" className="inline mr-1" />
                                          Has agotado tus {DAILY_ATTEMPTS_LIMIT} intentos diarios. Vuelve mañana para intentar nuevamente.
                                      </p>
                                  )}
                              </div>
                              
                              {/* Navegación por preguntas */}
                              <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-4 mb-6 border-b">
                                  <div className="flex items-center justify-between">
                                      <div className="flex flex-wrap gap-2">
                                          {quizQuestions.map((question, index) => {
                                              const isAnswered = quizAnswers[question.id];
                                              const isCurrent = currentQuestion === index;
                                              
                                              return (
                                                  <button
                                                      key={question.id}
                                                      onClick={() => setCurrentQuestion(index)}
                                                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border transition-all relative ${
                                                          isCurrent 
                                                              ? 'bg-[#00BCD4] text-white border-[#00BCD4] ring-2 ring-[#00BCD4]/20' 
                                                              : isAnswered
                                                                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                                                      }`}
                                                      aria-label={`Pregunta ${index + 1}: ${isAnswered ? 'Respondida' : 'Sin responder'}`}
                                                  >
                                                      {index + 1}
                                                      {question.difficulty === 'difícil' && (
                                                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                                      )}
                                                  </button>
                                              );
                                          })}
                                      </div>
                                      
                                      <div className="text-sm text-slate-600">
                                          <span className="font-medium">{Object.keys(quizAnswers).length}/{TOTAL_QUESTIONS}</span> respondidas
                                      </div>
                                  </div>
                                  
                                  {/* Leyenda de dificultad */}
                                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                      <div className="flex items-center gap-1">
                                          <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-full"></div>
                                          <span>Respondida</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                          <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-full"></div>
                                          <span>Pendiente</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                          <span>Difícil</span>
                                      </div>
                                  </div>
                              </div>
                              
                              {/* Vista paginada - 4 preguntas por página */}
                              {currentPage === 1 && (
                                  <div className="space-y-6">
                                      {quizQuestions.slice(0, 4).map((question) => (
                                          <div key={question.id} id={`question-${question.id}`} className="bg-white border border-slate-100 rounded-xl p-5">
                                              <div className="flex items-center justify-between mb-3">
                                                  <h4 className="text-base font-semibold text-[#00374A]">
                                                      {question.id.replace('q', '')}. {question.question}
                                                  </h4>
                                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                                      question.difficulty === 'fácil' ? 'bg-emerald-100 text-emerald-700' :
                                                      question.difficulty === 'medio' ? 'bg-amber-100 text-amber-700' :
                                                      'bg-red-100 text-red-700'
                                                  }`}>
                                                      {question.difficulty}
                                                  </span>
                                              </div>
                                              <div className="space-y-2">
                                                  {question.options.map((option) => (
                                                      <label key={option.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                                                          <input
                                                              type="radio"
                                                              name={question.id}
                                                              value={option.id}
                                                              checked={quizAnswers[question.id] === option.id}
                                                              onChange={() => handleButtonClick('UPDATE_QUIZ_ANSWER', { 
                                                                  questionId: question.id, 
                                                                  answer: option.id 
                                                              })}
                                                              className="w-4 h-4 text-[#00BCD4] focus:ring-[#00BCD4]"
                                                          />
                                                          <span className="text-sm text-slate-700">{option.label}</span>
                                                      </label>
                                                  ))}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              )}

                              {currentPage === 2 && (
                                  <div className="space-y-6">
                                      {quizQuestions.slice(4, 8).map((question) => (
                                          <div key={question.id} id={`question-${question.id}`} className="bg-white border border-slate-100 rounded-xl p-5">
                                              <div className="flex items-center justify-between mb-3">
                                                  <h4 className="text-base font-semibold text-[#00374A]">
                                                      {question.id.replace('q', '')}. {question.question}
                                                  </h4>
                                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                                      question.difficulty === 'fácil' ? 'bg-emerald-100 text-emerald-700' :
                                                      question.difficulty === 'medio' ? 'bg-amber-100 text-amber-700' :
                                                      'bg-red-100 text-red-700'
                                                  }`}>
                                                      {question.difficulty}
                                                  </span>
                                              </div>
                                              <div className="space-y-2">
                                                  {question.options.map((option) => (
                                                      <label key={option.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                                                          <input
                                                              type="radio"
                                                              name={question.id}
                                                              value={option.id}
                                                              checked={quizAnswers[question.id] === option.id}
                                                              onChange={() => handleButtonClick('UPDATE_QUIZ_ANSWER', { 
                                                                  questionId: question.id, 
                                                                  answer: option.id 
                                                              })}
                                                              className="w-4 h-4 text-[#00BCD4] focus:ring-[#00BCD4]"
                                                          />
                                                          <span className="text-sm text-slate-700">{option.label}</span>
                                                      </label>
                                                  ))}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              )}

                              {/* Navegación entre páginas */}
                              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                                  <button
                                      onClick={() => setCurrentPage(1)}
                                      disabled={currentPage === 1}
                                      className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                  >
                                      ← Página 1 (1-4)
                                  </button>
                                  
                                  <div className="text-sm text-slate-600">
                                      Página {currentPage} de 2
                                  </div>
                                  
                                  <button
                                      onClick={() => setCurrentPage(2)}
                                      disabled={currentPage === 2}
                                      className={`px-4 py-2 rounded-lg ${currentPage === 2 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                  >
                                      Página 2 (5-8) →
                                  </button>
                              </div>
                              
                              {/* Sección de envío */}
                              <div className="mt-8 pt-6 border-t border-slate-100">
                                  <div className="flex justify-between items-center">
                                      <div>
                                          <p className="text-sm text-slate-600">
                                              {Object.keys(quizAnswers).length === TOTAL_QUESTIONS 
                                                  ? `¡Todas las ${TOTAL_QUESTIONS} preguntas respondidas!`
                                                  : `Respuestas: ${Object.keys(quizAnswers).length}/${TOTAL_QUESTIONS}`}
                                          </p>
                                          {Object.keys(quizAnswers).length === TOTAL_QUESTIONS && (
                                              <p className="text-sm text-emerald-600 font-medium mt-1">
                                                  ¡Listo para enviar! (Mínimo {PASSING_SCORE}% para aprobar)
                                              </p>
                                          )}
                                      </div>
                                      <button
                                          onClick={() => handleButtonClick('SUBMIT_QUIZ')}
                                          disabled={isSubmittingQuiz || Object.keys(quizAnswers).length < TOTAL_QUESTIONS || dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT}
                                          className={`${buttonClasses.primary} ${isSubmittingQuiz || Object.keys(quizAnswers).length < TOTAL_QUESTIONS || dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT ? buttonClasses.loading : ''}`}
                                          aria-label={Object.keys(quizAnswers).length < TOTAL_QUESTIONS ? `Completa las ${TOTAL_QUESTIONS} preguntas para enviar` : "Enviar evaluación"}
                                      >
                                          {isSubmittingQuiz ? (
                                              <>
                                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                  Enviando...
                                              </>
                                          ) : (
                                              <>
                                                  <Icon name="fa-paper-plane" />
                                                  Enviar Evaluación
                                              </>
                                          )}
                                      </button>
                                  </div>
                              </div>
                              
                              {/* Sección de resultados */}
                              {showScoreResult && quizResult && (
                                  <div id="quiz-results" className="mt-8 pt-6 border-t border-slate-100">
                                      <div className={`p-6 rounded-xl mb-4 ${quizPassed ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                                          <div className="flex items-center justify-between">
                                              <div>
                                                  <h4 className={`text-xl font-bold ${quizPassed ? 'text-emerald-800' : 'text-amber-800'}`}>
                                                      {quizPassed ? '🎉 ¡Felicidades! Has aprobado' : '📚 Necesitas reforzar conocimientos'}
                                                  </h4>
                                                  <p className={`text-sm ${quizPassed ? 'text-emerald-600' : 'text-amber-600'} mt-1`}>
                                                      {quizPassed 
                                                          ? `Lograste ${quizResult.correctCount}/${TOTAL_QUESTIONS} correctas (${quizScore}%)`
                                                          : `Obtuviste ${quizResult.correctCount}/${TOTAL_QUESTIONS} correctas. Necesitas ${quizResult.neededToPass} para aprobar.`
                                                      }
                                                  </p>
                                              </div>
                                              <div className={`px-4 py-2 rounded-full ${quizPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                  <span className="font-bold">{quizPassed ? 'APROBADO' : 'NO APROBADO'}</span>
                                              </div>
                                          </div>
                                          
                                          {/* Información de intentos */}
                                          <div className="mt-4 pt-4 border-t border-opacity-30">
                                              <div className="flex items-center justify-between text-sm">
                                                  <span className={quizPassed ? 'text-emerald-600' : 'text-amber-600'}>
                                                      Intentos hoy: {dailyAttemptsCount}/{DAILY_ATTEMPTS_LIMIT}
                                                  </span>
                                                  {!quizPassed && dailyAttemptsCount < DAILY_ATTEMPTS_LIMIT && (
                                                      <button
                                                          onClick={() => handleButtonClick('RESET_QUIZ')}
                                                          className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                                                      >
                                                          Reintentar ({DAILY_ATTEMPTS_LIMIT - dailyAttemptsCount} restantes)
                                                      </button>
                                                  )}
                                              </div>
                                          </div>
                                      </div>
                                      
                                      {/* Retroalimentación temática si no pasó */}
                                      {!quizPassed && quizResult.failedQuestions.length > 0 && (
                                          <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                                              <div className="flex items-center gap-3 mb-4">
                                                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                      <Icon name="fa-lightbulb" className="text-amber-600" />
                                                  </div>
                                                  <div>
                                                      <h4 className="text-lg font-bold text-amber-800">Plan de Mejora Personalizado</h4>
                                                      <p className="text-sm text-amber-600">Basado en tus respuestas incorrectas</p>
                                                  </div>
                                              </div>
                                              
                                              <div className="space-y-4">
                                                  {/* Temas a reforzar */}
                                                  <div>
                                                      <h5 className="font-medium text-amber-700 mb-2">Temas a reforzar:</h5>
                                                      <div className="space-y-2">
                                                          {generateTopicFeedback(quizResult.failedQuestions).map((feedback, index) => (
                                                              <div key={index} className="flex items-start gap-2 p-3 bg-white/50 rounded-lg">
                                                                  <Icon name="fa-book-open" className="text-amber-500 mt-0.5" />
                                                                  <p className="text-sm text-amber-800">{feedback}</p>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  </div>
                                                  
                                                  {/* Enlaces directos a lecciones */}
                                                  <div>
                                                      <h5 className="font-medium text-amber-700 mb-2">Enlaces directos:</h5>
                                                      <div className="flex flex-wrap gap-2">
                                                          {Array.from(new Set(quizResult.failedQuestions.map(qId => {
                                                              const question = quizQuestions.find(q => q.id === qId);
                                                              return question ? question.topic : null;
                                                          }).filter(Boolean))).map(topic => (
                                                              <button
                                                                  key={topic}
                                                                  onClick={() => scrollToLesson(topic)}
                                                                  className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200 transition-colors"
                                                              >
                                                                  {topic}
                                                              </button>
                                                          ))}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                               )}
                                    </div>
                                )}
                            </div>
                       </div>
                 </main>
            </div>

            {/* Valerio FAB */}
            {/* Modal de Examen - Pantalla Completa con Sidebar Simplificado */}
            {showExamModal && (
                <div 
                    className="fixed inset-0 z-[100] flex bg-white exam-protection-modal"
                    style={{
                        // Protección anti-selección de texto
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        
                        // Protección anti-arrastre de imágenes
                        WebkitUserDrag: 'none',
                        userDrag: 'none',
                        
                        // Protección anti-copia
                        WebkitTouchCallout: 'none'
                    }}
                >
                    {/* Sidebar Simplificado - Solo Módulos (20%) */}
                    <div className="w-1/5 border-r border-[#004B63]/10 bg-gradient-to-b from-white via-white/98 to-[#F8FAFC]/95 overflow-y-auto">
                        <div className="px-5 py-6 space-y-6">
                            {/* Título del Sidebar en Modal */}
                            <div className="px-2 w-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-[#004B63]">
                                        <Icon name="fa-layer-group" className="text-sm" />
                                    </div>
                                    <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                        MÓDULOS
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                                </div>
                                
                                {/* Lista de Módulos Simplificada */}
                                <div className="space-y-2">
                                    {modules.map((mod) => (
                                        <button
                                            key={mod.id}
                                            onClick={() => {
                                                // Mostrar mensaje si intenta cambiar de módulo durante examen
                                                if (Object.keys(quizAnswers).length > 0 && !showScoreResult) {
                                                    setLoadMsg("Termina el examen actual primero");
                                                    setTimeout(() => setLoadMsg(''), 3000);
                                                } else if (!isModuleLocked(mod.id)) {
                                                    // Permitir cambiar solo si no hay examen en progreso
                                                    setActiveMod(mod.id);
                                                    resetQuizForRetry();
                                                    setSecurityWarningCount(0);
                                                }
                                            }}
                                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeMod === mod.id ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white' : 'hover:bg-[#004B63]/10'} focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1`}
                                            disabled={isModuleLocked(mod.id) || (Object.keys(quizAnswers).length > 0 && !showScoreResult)}
                                            aria-label={`${isModuleLocked(mod.id) ? 'Módulo bloqueado: ' : ''}${mod.title}`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activeMod === mod.id ? 'bg-white/20' : 'bg-[#004B63]/10'}`}>
                                                <Icon name={mod.icon} className={`${activeMod === mod.id ? 'text-white' : 'text-[#004B63]'} text-sm`} />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="font-semibold text-sm truncate font-body">{mod.title}</p>
                                                <p className={`text-xs ${activeMod === mod.id ? 'text-white/80' : 'text-[#64748B]'} font-body`}>
                                                    {mod.duration}
                                                </p>
                                            </div>
                                            {isModuleLocked(mod.id) && (
                                                <Icon name="fa-lock" className="text-xs text-slate-400" />
                                            )}
                                            {!isModuleLocked(mod.id) && completedModules.includes(mod.id) && (
                                                <Icon name="fa-check" className="text-xs text-emerald-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Información del Módulo Actual */}
                            <div className="px-2 w-full mt-8">
                                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-600 mb-2">Examen actual:</p>
                                    <p className="text-sm font-semibold text-[#004B63]">
                                        Módulo {activeMod}: {modules.find(m => m.id === activeMod)?.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {Object.keys(quizAnswers).length}/{TOTAL_QUESTIONS} preguntas respondidas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contenido del Examen (80%) */}
                    <div className="w-4/5 flex flex-col">
                        {/* Header del Modal */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
                            <button 
                                onClick={handleCloseModal}
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
                            >
                                <Icon name="fa-arrow-left" className="text-sm" />
                                <span className="text-sm font-medium">Salir</span>
                            </button>
                            
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-[#00374A]">
                                    Evaluación - Módulo {activeMod}
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    {modules.find(m => m.id === activeMod)?.title}
                                </p>
                            </div>
                            
                            {/* Timer y Estado */}
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-[#00BCD4]">
                                        {formatTime(suggestedTime - timeElapsed)}
                                    </div>
                                    <div className="text-xs text-slate-500">Tiempo restante</div>
                                </div>
                                
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <span className="text-sm font-bold text-slate-700">
                                        {Object.keys(quizAnswers).length}/{TOTAL_QUESTIONS}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Contenido del Quiz */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Contenido completo del quiz - Mismo que inline pero sin el contenedor externo */}
                            <div className="bg-gradient-to-br from-white to-[#F8FAFC] border border-slate-50 shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-[24px] p-8">
                               <div className="flex items-center gap-4 mb-6">
                                   <div className="w-10 h-10 bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-xl flex items-center justify-center">
                                       <Icon name="fa-clipboard-check" className="text-white" />
                                   </div>
                                   <div>
                                       <h3 className="text-xl font-bold text-[#00374A]">Evaluación del Módulo</h3>
                                       <p className="text-sm text-slate-600">Responde las 8 preguntas para validar tu aprendizaje (70% mínimo para aprobar)</p>
                                   </div>
                               </div>
                               
                               {/* Timer Sugerido */}
                               <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                   <div className="flex items-center justify-between mb-2">
                                       <div className="flex items-center gap-2">
                                           <Icon name="fa-clock" className="text-blue-600" />
                                           <span className="text-sm font-medium text-blue-700">Tiempo sugerido</span>
                                           <span className="text-xs text-blue-500 px-2 py-1 bg-blue-100 rounded-full">
                                               Opcional
                                           </span>
                                       </div>
                                       <button
                                           onClick={() => setIsTimerRunning(!isTimerRunning)}
                                           className="text-sm text-blue-600 hover:text-blue-800"
                                       >
                                           {isTimerRunning ? '⏸️ Pausar' : '▶️ Iniciar'} timer
                                       </button>
                                   </div>
                                   
                                   <div className="flex items-center justify-between">
                                       <div className="text-center">
                                           <div className="text-2xl font-bold text-blue-700">
                                               {Math.floor((suggestedTime - timeElapsed) / 60)}:{(suggestedTime - timeElapsed) % 60 < 10 ? '0' : ''}{(suggestedTime - timeElapsed) % 60}
                                           </div>
                                           <div className="text-xs text-blue-500 mt-1">Restante</div>
                                       </div>
                                       
                                       <div className="text-center">
                                           <div className="text-lg font-medium text-gray-700">
                                               {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60 < 10 ? '0' : '')}{timeElapsed % 60}
                                           </div>
                                           <div className="text-xs text-gray-500">Transcurrido</div>
                                       </div>
                                       
                                       <div className="text-center">
                                           <div className="text-lg font-medium text-gray-700">{SUGGESTED_TIME_MINUTES}:00</div>
                                           <div className="text-xs text-gray-500">Total sugerido</div>
                                       </div>
                                   </div>
                                   
                                   {/* Barra de progreso del tiempo */}
                                   <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
                                       <div 
                                           className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000"
                                           style={{ width: `${(timeElapsed / suggestedTime) * 100}%` }}
                                       ></div>
                                   </div>
                                   
                                   {showTimeWarning && (
                                       <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                           <p className="text-xs text-amber-700 flex items-center gap-1">
                                               <Icon name="fa-exclamation-triangle" />
                                               Llevas más de 15 minutos. Considera revisar tus respuestas.
                                           </p>
                                       </div>
                                   )}
                               </div>
                               
                               {/* Contador de intentos */}
                               <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                   <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-2">
                                           <Icon name="fa-rotate-right" className="text-slate-600" />
                                           <span className="text-sm font-medium text-slate-700">Intentos diarios</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                           <span className="text-sm text-slate-600">
                                               {dailyAttemptsCount} / {DAILY_ATTEMPTS_LIMIT} usados hoy
                                           </span>
                                           {dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT && (
                                               <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                                                   Límite alcanzado
                                               </span>
                                           )}
                                       </div>
                                   </div>
                                   
                                   {dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT && (
                                       <p className="text-xs text-slate-600 mt-2">
                                           <Icon name="fa-info-circle" className="inline mr-1" />
                                           Has agotado tus {DAILY_ATTEMPTS_LIMIT} intentos diarios. Vuelve mañana para intentar nuevamente.
                                       </p>
                                   )}
                               </div>
                               
                               {/* Navegación por preguntas */}
                               <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-4 mb-6 border-b">
                                   <div className="flex items-center justify-between">
                                       <div className="flex flex-wrap gap-2">
                                           {quizQuestions.map((question, index) => {
                                               const isAnswered = quizAnswers[question.id];
                                               const isCurrent = currentQuestion === index;
                                               
                                               return (
                                                   <button
                                                       key={question.id}
                                                       onClick={() => setCurrentQuestion(index)}
                                                       className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border transition-all relative ${
                                                           isCurrent 
                                                               ? 'bg-[#00BCD4] text-white border-[#00BCD4] ring-2 ring-[#00BCD4]/20' 
                                                               : isAnswered
                                                                   ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                   : 'bg-slate-100 text-slate-600 border-slate-200'
                                                       }`}
                                                       aria-label={`Pregunta ${index + 1}: ${isAnswered ? 'Respondida' : 'Sin responder'}`}
                                                   >
                                                       {index + 1}
                                                       {question.difficulty === 'difícil' && (
                                                           <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                                       )}
                                                   </button>
                                               );
                                           })}
                                       </div>
                                       
                                       <div className="text-sm text-slate-600">
                                           <span className="font-medium">{Object.keys(quizAnswers).length}/{TOTAL_QUESTIONS}</span> respondidas
                                       </div>
                                   </div>
                                   
                                   {/* Leyenda de dificultad */}
                                   <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                       <div className="flex items-center gap-1">
                                           <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-full"></div>
                                           <span>Respondida</span>
                                       </div>
                                       <div className="flex items-center gap-1">
                                           <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-full"></div>
                                           <span>Pendiente</span>
                                       </div>
                                       <div className="flex items-center gap-1">
                                           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                           <span>Difícil</span>
                                       </div>
                                   </div>
                               </div>
                               
                               {/* Vista paginada - 4 preguntas por página */}
                               {currentPage === 1 && (
                                   <div className="space-y-6">
                                       {quizQuestions.slice(0, 4).map((question) => (
                                           <div key={question.id} id={`question-${question.id}`} className="bg-white border border-slate-100 rounded-xl p-5">
                                               <div className="flex items-center justify-between mb-3">
                                                   <h4 className="text-base font-semibold text-[#00374A]">
                                                       {question.id.replace('q', '')}. {question.question}
                                                   </h4>
                                                   <span className={`text-xs px-2 py-1 rounded-full ${
                                                       question.difficulty === 'fácil' ? 'bg-emerald-100 text-emerald-700' :
                                                       question.difficulty === 'medio' ? 'bg-amber-100 text-amber-700' :
                                                       'bg-red-100 text-red-700'
                                                   }`}>
                                                       {question.difficulty}
                                                   </span>
                                               </div>
                                               <div className="space-y-2">
                                                   {question.options.map((option) => (
                                                       <label key={option.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                                                           <input
                                                               type="radio"
                                                               name={question.id}
                                                               value={option.id}
                                                               checked={quizAnswers[question.id] === option.id}
                                                               onChange={() => handleButtonClick('UPDATE_QUIZ_ANSWER', { 
                                                                   questionId: question.id, 
                                                                   answer: option.id 
                                                               })}
                                                               className="w-4 h-4 text-[#00BCD4] focus:ring-[#00BCD4]"
                                                           />
                                                           <span className="text-sm text-slate-700">{option.label}</span>
                                                       </label>
                                                   ))}
                                               </div>
                                           </div>
                                       ))}
                                   </div>
                               )}

                               {currentPage === 2 && (
                                   <div className="space-y-6">
                                       {quizQuestions.slice(4, 8).map((question) => (
                                           <div key={question.id} id={`question-${question.id}`} className="bg-white border border-slate-100 rounded-xl p-5">
                                               <div className="flex items-center justify-between mb-3">
                                                   <h4 className="text-base font-semibold text-[#00374A]">
                                                       {question.id.replace('q', '')}. {question.question}
                                                   </h4>
                                                   <span className={`text-xs px-2 py-1 rounded-full ${
                                                       question.difficulty === 'fácil' ? 'bg-emerald-100 text-emerald-700' :
                                                       question.difficulty === 'medio' ? 'bg-amber-100 text-amber-700' :
                                                       'bg-red-100 text-red-700'
                                                   }`}>
                                                       {question.difficulty}
                                                   </span>
                                               </div>
                                               <div className="space-y-2">
                                                   {question.options.map((option) => (
                                                       <label key={option.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                                                           <input
                                                               type="radio"
                                                               name={question.id}
                                                               value={option.id}
                                                               checked={quizAnswers[question.id] === option.id}
                                                               onChange={() => handleButtonClick('UPDATE_QUIZ_ANSWER', { 
                                                                   questionId: question.id, 
                                                                   answer: option.id 
                                                               })}
                                                               className="w-4 h-4 text-[#00BCD4] focus:ring-[#00BCD4]"
                                                           />
                                                           <span className="text-sm text-slate-700">{option.label}</span>
                                                       </label>
                                                   ))}
                                               </div>
                                           </div>
                                       ))}
                                   </div>
                               )}

                               {/* Navegación entre páginas */}
                               <div className="flex justify-between items-center mt-8 pt-6 border-t">
                                   <button
                                       onClick={() => setCurrentPage(1)}
                                       disabled={currentPage === 1}
                                       className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                   >
                                       ← Página 1 (1-4)
                                   </button>
                                   
                                   <div className="text-sm text-slate-600">
                                       Página {currentPage} de 2
                                   </div>
                                   
                                   <button
                                       onClick={() => setCurrentPage(2)}
                                       disabled={currentPage === 2}
                                       className={`px-4 py-2 rounded-lg ${currentPage === 2 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                   >
                                       Página 2 (5-8) →
                                   </button>
                               </div>
                               
                               {/* Sección de envío */}
                               <div className="mt-8 pt-6 border-t border-slate-100">
                                   <div className="flex justify-between items-center">
                                       <div>
                                           <p className="text-sm text-slate-600">
                                               {Object.keys(quizAnswers).length === TOTAL_QUESTIONS 
                                                   ? `¡Todas las ${TOTAL_QUESTIONS} preguntas respondidas!`
                                                   : `Respuestas: ${Object.keys(quizAnswers).length}/${TOTAL_QUESTIONS}`}
                                           </p>
                                           {Object.keys(quizAnswers).length === TOTAL_QUESTIONS && (
                                               <p className="text-sm text-emerald-600 font-medium mt-1">
                                                   ¡Listo para enviar! (Mínimo {PASSING_SCORE}% para aprobar)
                                               </p>
                                           )}
                                       </div>
                                       <button
                                           onClick={() => handleButtonClick('SUBMIT_QUIZ')}
                                           disabled={isSubmittingQuiz || Object.keys(quizAnswers).length < TOTAL_QUESTIONS || dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT}
                                           className={`${buttonClasses.primary} ${isSubmittingQuiz || Object.keys(quizAnswers).length < TOTAL_QUESTIONS || dailyAttemptsCount >= DAILY_ATTEMPTS_LIMIT ? buttonClasses.loading : ''}`}
                                           aria-label={Object.keys(quizAnswers).length < TOTAL_QUESTIONS ? `Completa las ${TOTAL_QUESTIONS} preguntas para enviar` : "Enviar evaluación"}
                                       >
                                           {isSubmittingQuiz ? (
                                               <>
                                                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                   Enviando...
                                               </>
                                           ) : (
                                               <>
                                                   <Icon name="fa-paper-plane" />
                                                   Enviar Evaluación
                                               </>
                                           )}
                                       </button>
                                   </div>
                               </div>
                               
                               {/* Sección de resultados */}
                               {showScoreResult && quizResult && (
                                   <div id="quiz-results" className="mt-8 pt-6 border-t border-slate-100">
                                       <div className={`p-6 rounded-xl mb-4 ${quizPassed ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                                           <div className="flex items-center justify-between">
                                               <div>
                                                   <h4 className={`text-xl font-bold ${quizPassed ? 'text-emerald-800' : 'text-amber-800'}`}>
                                                       {quizPassed ? '🎉 ¡Felicidades! Has aprobado' : '📚 Necesitas reforzar conocimientos'}
                                                   </h4>
                                                   <p className={`text-sm ${quizPassed ? 'text-emerald-600' : 'text-amber-600'} mt-1`}>
                                                       {quizPassed 
                                                           ? `Lograste ${quizResult.correctCount}/${TOTAL_QUESTIONS} correctas (${quizScore}%)`
                                                           : `Obtuviste ${quizResult.correctCount}/${TOTAL_QUESTIONS} correctas. Necesitas ${quizResult.neededToPass} para aprobar.`
                                                       }
                                                   </p>
                                               </div>
                                               <div className={`px-4 py-2 rounded-full ${quizPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                   <span className="font-bold">{quizPassed ? 'APROBADO' : 'NO APROBADO'}</span>
                                               </div>
                                           </div>
                                           
                                           {/* Información de intentos */}
                                           <div className="mt-4 pt-4 border-t border-opacity-30">
                                               <div className="flex items-center justify-between text-sm">
                                                   <span className={quizPassed ? 'text-emerald-600' : 'text-amber-600'}>
                                                       Intentos hoy: {dailyAttemptsCount}/{DAILY_ATTEMPTS_LIMIT}
                                                   </span>
                                                   {!quizPassed && dailyAttemptsCount < DAILY_ATTEMPTS_LIMIT && (
                                                       <button
                                                           onClick={() => handleButtonClick('RESET_QUIZ')}
                                                           className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                                                       >
                                                           Reintentar ({DAILY_ATTEMPTS_LIMIT - dailyAttemptsCount} restantes)
                                                       </button>
                                                   )}
                                               </div>
                                           </div>
                                       </div>
                                       
                                       {/* Retroalimentación temática si no pasó */}
                                       {!quizPassed && quizResult.failedQuestions.length > 0 && (
                                           <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                                               <div className="flex items-center gap-3 mb-4">
                                                   <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                       <Icon name="fa-lightbulb" className="text-amber-600" />
                                                   </div>
                                                   <div>
                                                       <h4 className="text-lg font-bold text-amber-800">Plan de Mejora Personalizado</h4>
                                                       <p className="text-sm text-amber-600">Basado en tus respuestas incorrectas</p>
                                                   </div>
                                               </div>
                                               
                                               <div className="space-y-4">
                                                   {/* Temas a reforzar */}
                                                   <div>
                                                       <h5 className="font-medium text-amber-700 mb-2">Temas a reforzar:</h5>
                                                       <div className="space-y-2">
                                                           {generateTopicFeedback(quizResult.failedQuestions).map((feedback, index) => (
                                                                <div key={index} className="flex items-start gap-2 p-3 bg-white/50 rounded-lg">
                                                                    <Icon name="fa-book-open" className="text-amber-500 mt-0.5" />
                                                                    <p className="text-sm text-amber-800">{feedback}</p>
                                                                </div>
                                                           ))}
                                                       </div>
                                                   </div>
                                                   
                                                   {/* Enlaces directos a lecciones */}
                                                   <div>
                                                       <h5 className="font-medium text-amber-700 mb-2">Enlaces directos:</h5>
                                                       <div className="flex flex-wrap gap-2">
                                                           {Array.from(new Set(quizResult.failedQuestions.map(qId => {
                                                               const question = quizQuestions.find(q => q.id === qId);
                                                               return question ? question.topic : null;
                                                           }).filter(Boolean))).map(topic => (
                                                               <button
                                                                   key={topic}
                                                                   onClick={() => scrollToLesson(topic)}
                                                                   className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200 transition-colors"
                                                               >
                                                                   {topic}
                                                               </button>
                                                           ))}
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       )}
                                       
                                       {/* Botones Post-Examen Mejorados */}
                                       <div className="mt-8 pt-6 border-t border-slate-200">
                                           <div className="flex flex-col items-center gap-4">
                                               
                                               {quizPassed ? (
                                                   // BOTÓN SI APRUEBA - Desbloquear siguiente módulo
                                                   <div className="space-y-4 w-full">
                                                       <button
                                                           onClick={() => handleButtonClick('UNLOCK_NEXT_MODULE')}
                                                           className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-lg transition-all"
                                                       >
                                                           <div className="flex items-center justify-center gap-3">
                                                               <Icon name="fa-trophy" className="text-2xl" />
                                                               <span className="text-lg">🎉 ¡Felicidades! Ir al Módulo {activeMod + 1}</span>
                                                           </div>
                                                       </button>
                                                       
                                                       <p className="text-center text-sm text-emerald-600">
                                                           El candado del módulo {activeMod + 1} se desbloqueará automáticamente
                                                       </p>
                                                   </div>
                                               ) : dailyAttemptsCount < DAILY_ATTEMPTS_LIMIT ? (
                                                   // BOTÓN SI NO APRUEBA PERO TIENE INTENTOS
                                                   <button
                                                       onClick={() => handleButtonClick('RESET_QUIZ')}
                                                       className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 shadow-lg transition-all"
                                                   >
                                                       <div className="flex items-center justify-center gap-3">
                                                           <Icon name="fa-rotate-right" className="text-2xl" />
                                                           <span className="text-lg">🔄 Intentar Nuevamente ({DAILY_ATTEMPTS_LIMIT - dailyAttemptsCount} restantes)</span>
                                                       </div>
                                                   </button>
                                               ) : (
                                                   // MENSAJE SI NO TIENE INTENTOS
                                                   <div className="text-center p-6 bg-slate-100 rounded-xl border border-slate-200 w-full">
                                                       <Icon name="fa-clock" className="text-3xl text-slate-500 mb-3" />
                                                       <p className="text-slate-700 font-medium mb-2">
                                                           Límite de intentos alcanzado
                                                       </p>
                                                       <p className="text-slate-600 text-sm">
                                                           Vuelve mañana para intentar nuevamente
                                                       </p>
                                                   </div>
                                               )}
                                               
                                               {/* Botón para cerrar modal */}
                                               <button
                                                   onClick={() => setShowExamModal(false)}
                                                   className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                               >
                                                   Volver al contenido del módulo
                                               </button>
                                           </div>
                                       </div>
                                   </div>
                               )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal de Confirmación al Salir */}
            {showExitConfirmation && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <Icon name="fa-exclamation-triangle" className="text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">¿Salir del examen?</h3>
                        </div>
                        
                        <p className="text-slate-600 mb-6">
                            Tienes <span className="font-bold">{Object.keys(quizAnswers).length}</span> respuestas sin enviar.
                            Si sales ahora, perderás todo tu progreso.
                        </p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => {
                                    setShowExitConfirmation(false);
                                    resetQuizForRetry();
                                    setShowExamModal(false);
                                    setShowEvaluationQuiz(false);
                                    setSecurityWarningCount(0);
                                }}
                                className="flex-1 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Salir y perder progreso
                            </button>
                            <button 
                                onClick={() => setShowExitConfirmation(false)}
                                className="flex-1 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                            >
                                Continuar examen
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Overlay de Protección Anti-Capturas */}
            {screenshotProtectionActive && showExamModal && (
                <div className="fixed inset-0 z-[115] flex items-center justify-center bg-red-900/90 backdrop-blur-md">
                    <div className="text-center p-8 max-w-2xl">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                            <Icon name="fa-shield-alt" className="text-white text-4xl" />
                        </div>
                        
                        <h3 className="text-3xl font-bold text-white mb-4">
                            ¡PROTECCIÓN ANTI-CAPTURAS ACTIVADA!
                        </h3>
                        
                        <p className="text-xl text-white/90 mb-2">
                            Se detectó un intento de captura de pantalla
                        </p>
                        
                        <p className="text-white/80 mb-6">
                            El examen se protegerá automáticamente por {SCREENSHOT_OVERLAY_DURATION / 1000} segundos
                        </p>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                            <Icon name="fa-exclamation-triangle" className="text-white" />
                            <span className="text-white font-medium">
                                Infracción de seguridad registrada
                            </span>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal de Advertencia de Seguridad */}
            {showSecurityWarning && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <Icon name="fa-shield-exclamation" className="text-red-600 text-2xl" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                            {SECURITY_WARNING_MESSAGES[Math.min(securityWarningCount - 1, MAX_SECURITY_WARNINGS - 1)]}
                        </h3>
                        
                        <p className="text-slate-600 mb-2">
                            Advertencia {securityWarningCount} de {MAX_SECURITY_WARNINGS}
                        </p>
                        
                         <p className="text-sm text-slate-500 mb-4">
                             El timer se ha pausado. Continuará cuando confirmes.
                         </p>
                         
                         {/* Información de penalización */}
                         <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                             <div className="flex items-center gap-2">
                                 <Icon name="fa-exclamation-triangle" className="text-amber-600 text-sm" />
                                 <p className="text-xs text-amber-700">
                                     <span className="font-semibold">Protocolo de seguridad:</span> {MAX_SECURITY_WARNINGS} infracciones = pérdida de {SECURITY_VIOLATION_PENALTY} intento
                                 </p>
                             </div>
                             <p className="text-xs text-amber-600 mt-1">
                                 Infracciones actuales: {securityWarningCount}/{MAX_SECURITY_WARNINGS}
                                 {attemptsPenalized > 0 && ` • Intentos perdidos: ${attemptsPenalized}`}
                             </p>
                         </div>
                         
                         <div className="space-y-3">
                             <button
                                 onClick={() => {
                                     setShowSecurityWarning(false);
                                     setIsTimerRunning(true); // Reanudar timer
                                 }}
                                 className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                             >
                                 Entendido, continuar examen
                             </button>
                             
                             {securityWarningCount >= MAX_SECURITY_WARNINGS && (
                                 <button
                                     onClick={() => {
                                         setShowSecurityWarning(false);
                                         penalizeAttempt();
                                         handleCloseModal();
                                         setLoadMsg("Examen cerrado por 3 infracciones de seguridad. Has perdido 1 intento.");
                                         setTimeout(() => setLoadMsg(''), 3000);
                                     }}
                                     className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                                 >
                                     Cerrar examen (penalización aplicada)
                                 </button>
                             )}
                         </div>
                    </div>
                </div>
             )}
             
             {/* Panel de Estado de Seguridad (flotante) */}
             {showExamModal && !showScoreResult && (
                 <div className="fixed top-4 right-4 z-[90]">
                     <button
                         onClick={() => setShowSecurityStatus(!showSecurityStatus)}
                         className="mb-2 w-10 h-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                         title="Estado de seguridad"
                     >
                         <Icon name="fa-shield-alt" className={`text-sm ${
                             securityWarningCount === 0 ? 'text-emerald-500' :
                             securityWarningCount === 1 ? 'text-amber-500' :
                             'text-red-500'
                         }`} />
                     </button>
                     
                     {showSecurityStatus && (
                         <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-2xl p-4 min-w-64">
                             <div className="flex items-center justify-between mb-3">
                                 <h4 className="font-bold text-slate-800">Estado de Seguridad</h4>
                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                     securityWarningCount === 0 ? 'bg-emerald-100 text-emerald-800' :
                                     securityWarningCount === 1 ? 'bg-amber-100 text-amber-800' :
                                     'bg-red-100 text-red-800'
                                 }`}>
                                     {securityWarningCount === 0 ? 'SEGURO' :
                                      securityWarningCount === 1 ? 'EN RIESGO' : 'ALTO RIESGO'}
                                 </span>
                             </div>
                             
                             <div className="space-y-3">
                                 <div>
                                     <div className="flex justify-between text-sm mb-1">
                                         <span className="text-slate-600">Infracciones:</span>
                                         <span className="font-semibold">{securityWarningCount}/{MAX_SECURITY_WARNINGS}</span>
                                     </div>
                                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                         <div 
                                             className={`h-full rounded-full ${
                                                 securityWarningCount === 0 ? 'bg-emerald-500' :
                                                 securityWarningCount === 1 ? 'bg-amber-500' :
                                                 'bg-red-500'
                                             }`}
                                             style={{ width: `${(securityWarningCount / MAX_SECURITY_WARNINGS) * 100}%` }}
                                         ></div>
                                     </div>
                                 </div>
                                 
                                 <div className="flex justify-between text-sm">
                                     <span className="text-slate-600">Intentos perdidos:</span>
                                     <span className="font-semibold text-red-600">{attemptsPenalized}</span>
                                 </div>
                                 
                                 <div className="flex justify-between text-sm">
                                     <span className="text-slate-600">Violaciones totales:</span>
                                     <span className="font-semibold">{securityViolations}</span>
                                 </div>
                                 
                                 <div className="pt-3 border-t border-slate-100">
                                     <p className="text-xs text-slate-500">
                                         <Icon name="fa-info-circle" className="inline mr-1" />
                                         {MAX_SECURITY_WARNINGS} infracciones = {SECURITY_VIOLATION_PENALTY} intento perdido
                                     </p>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             )}
             
             {/* Mensajes Temporales de Seguridad */}
             {showSecurityMessage && (
                 <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[95] animate-fade-in">
                     <div className="bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-2xl max-w-md">
                         <div className="flex items-center gap-2">
                             <Icon name="fa-shield-exclamation" className="text-amber-300" />
                             <p className="text-sm font-medium">{securityMessage}</p>
                         </div>
                     </div>
                 </div>
             )}
             
              <button 
                  className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-white to-[#F8FAFC] border border-[#E2E8F0]/50 rounded-full shadow-[0_8px_30px_rgba(0,75,99,0.12)] hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center group hover:shadow-[0_12px_40px_rgba(0,75,99,0.16)]"
                  onClick={() => setShowValerioDrawer(!showValerioDrawer)}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                    <path d="M12 3C8.5 3 6 5.5 6 9C6 10.5 6.5 12 7.5 13C8.5 14 9.5 15 10 16C10.5 17 11 18 12 18C13 18 13.5 17 14 16C14.5 15 15.5 14 16.5 13C17.5 12 18 10.5 18 9C18 5.5 15.5 3 12 3Z" fill="#004B63" />
                    <path d="M9 7C8.5 7 8 7.5 8 8C8 8.5 8.5 9 9 9C9.5 9 10 8.5 10 8C10 7.5 9.5 7 9 7Z" fill="#00BCD4" />
                    <path d="M15 7C14.5 7 14 7.5 14 8C14 8.5 14.5 9 15 9C15.5 9 16 8.5 16 8C16 7.5 15.5 7 15 7Z" fill="#00BCD4" />
                    <path d="M12 5C11.5 5 11 5.5 11 6C11 6.5 11.5 7 12 7C12.5 7 13 6.5 13 6C13 5.5 12.5 5 12 5Z" fill="#00BCD4" className="animate-pulse" />
                </svg>
            </button>
            {/* Estilos de protección anti-impresión */}
            <style>
                {`
                    @media print {
                        .exam-protection-modal,
                        .exam-protection-modal * {
                            display: none !important;
                            visibility: hidden !important;
                            opacity: 0 !important;
                        }
                        
                        body::before {
                            content: "⚠️ IMPRESIÓN BLOQUEADA - Este examen está protegido por el protocolo de seguridad Edutechlife";
                            display: block !important;
                            font-size: 24px;
                            font-weight: bold;
                            text-align: center;
                            color: red;
                            padding: 40px;
                            background: white;
                        }
                    }
                    
                    /* Animación para mensajes temporales */
                    @keyframes fade-in {
                        from { opacity: 0; transform: translate(-50%, -10px); }
                        to { opacity: 1; transform: translate(-50%, 0); }
                    }
                    
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out;
                    }
                `}
            </style>
        </>
    );
};

export default IALabFixed;