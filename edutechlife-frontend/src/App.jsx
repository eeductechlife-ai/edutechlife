import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Sun, Moon, Bot, X, Send, MessageCircle, Minus, Square } from 'lucide-react';
const GlobalCanvas = lazy(() => import('./components/GlobalCanvas'));
const IALab = lazy(() => import('./components/IALab'));
import Hero from './components/Hero';
import Metodo from './components/Metodo';
import Esencia from './components/Esencia';
import Ecosystem from './components/Ecosystem';
import Aliados from './components/Aliados';
import Footer from './components/Footer';
const NeuroEntorno = lazy(() => import('./components/NeuroEntorno'));
const ProyectosNacional = lazy(() => import('./components/ProyectosNacional'));
const Consultoria = lazy(() => import('./components/Consultoria'));
const ConsultoriaB2B = lazy(() => import('./components/ConsultoriaB2B'));
const AutomationArchitect = lazy(() => import('./components/AutomationArchitect'));
const SmartBoardDashboard = lazy(() => import('./components/SmartBoardDashboard'));
const SmartBoardLogin = lazy(() => import('./components/SmartBoardLogin'));
const DiagnosticoVAK = lazy(() => import('./components/DiagnosticoVAK'));
const VAKTest = lazy(() => import('./components/VAKTest'));
const VAKDiagnostic = lazy(() => import('./components/VAKDiagnostic'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
import AdminLoginModal from './components/AdminLoginModal';
import LeadCaptureModal from './components/LeadCaptureModal';
import LoadingScreen, { MiniLoader } from './components/LoadingScreen';
import { callDeepseek } from './utils/api';
import { NICO_KNOWLEDGE_BASE } from './utils/knowledgeBase';
import { detectInterest, shouldPromptForLead, saveLead } from './utils/leads';
import { addToHistory, getHistory, buildContextPrompt, getLeadData, clearSession } from './utils/chatMemory';

/* ==================== PREMIUM CURSOR - ZERO LATENCY ==================== */
/* Núcleo decursor maneja por CSS nativo - 0ms latencia */
/* Aura visual con GPU acceleration - solo elementos interactivos */
const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    const springConfig = { damping: 25, stiffness: 500, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    
    const isHovering = useMotionValue(0);
    const scaleTransform = useSpring(1, springConfig);
    
    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        
        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.interactive')) {
                isHovering.set(1);
            }
        };
        
        const handleMouseOut = (e) => {
            const target = e.target;
            if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.interactive')) {
                isHovering.set(0);
            }
        };

        window.addEventListener('mousemove', moveCursor, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        window.addEventListener('mouseout', handleMouseOut, { passive: true });
        
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const current = isHovering.get();
            scaleTransform.set(current === 1 ? 1.5 : 1);
        }, 16);
        return () => clearInterval(interval);
    }, [isHovering, scaleTransform]);

    return (
        <motion.div
            className="hidden lg:block fixed inset-0 pointer-events-none z-[9999]"
            style={{ x: cursorXSpring, y: cursorYSpring }}
        >
            <motion.div
                className="absolute w-8 h-8 rounded-full border-2 border-[#004B63]/60 pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: scaleTransform,
                    backgroundColor: 'rgba(77, 168, 196, 0.15)',
                    willChange: 'transform',
                }}
            />
            <motion.div
                className="absolute w-2 h-2 rounded-full bg-[#4DA8C4] pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    willChange: 'transform',
                }}
            />
        </motion.div>
    );
};

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('landing');
    const [smartboardAuthenticated, setSmartboardAuthenticated] = useState(false);
    const [adminAuthenticated, setAdminAuthenticated] = useState(false);
    const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
    const [botOpen, setBotOpen] = useState(false);
    const [isBotMinimized, setIsBotMinimized] = useState(false);
    const [isBotClosing, setIsBotClosing] = useState(false);
    const [botMsgs, setBotMsgs] = useState([{ 
        role: 'assistant', 
        text: 'Hola, soy Nico. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
    }]);
    const [botInput, setBotInput] = useState('');
    const [botLoading, setBotLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // Lead capture states - Conversational
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [leadContext, setLeadContext] = useState(null);
    const [hasLeadData, setHasLeadData] = useState(false);
    const [leadShownCount, setLeadShownCount] = useState(0);
    const [currentInterest, setCurrentInterest] = useState(null);
    
    // Conversational lead collection states
    const [leadCollectionStep, setLeadCollectionStep] = useState(null); // 'name', 'email', 'phone', null
    const [tempLeadData, setTempLeadData] = useState({});
    
    const botMsgsEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const speechSynthesisRef = useRef(null);

    const scrollToBottom = () => {
        botMsgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (botOpen) scrollToBottom();
    }, [botMsgs, botOpen]);

    // Initialize bot with personalized greeting if lead data exists
    useEffect(() => {
        if (botOpen && botMsgs.length === 1) {
            const leadData = getLeadData();
            if (leadData && leadData.nombre) {
                setBotMsgs([{ 
                    role: 'assistant', 
                    text: `Hola ${leadData.nombre}, bienvenido de nuevo. ¿En qué puedo ayudarte hoy?`,
                    timestamp: new Date()
                }]);
                setHasLeadData(true);
            }
        }
    }, [botOpen]);

    // Save messages to history when botMsgs changes
    useEffect(() => {
        if (botMsgs.length > 1) {
            const lastMsg = botMsgs[botMsgs.length - 1];
            if (lastMsg.role) {
                addToHistory(lastMsg.role, lastMsg.text);
            }
        }
    }, [botMsgs]);

    useEffect(() => {
        const handleNavigate = (e) => {
            setView(e.detail);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('navigate', handleNavigate);
        
        return () => {
            window.removeEventListener('navigate', handleNavigate);
        };
    }, []);

    // Dark mode effect
    useEffect(() => {
        const storedTheme = localStorage.getItem('edutechlife-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('edutechlife-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('edutechlife-theme', 'light');
        }
    };

    const handleBotSend = async () => {
        if (!botInput.trim()) return;
        const userMsg = botInput;
        setBotInput('');
        setBotMsgs(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }]);
        setBotLoading(true);

        // If we're in lead collection mode, handle it conversationally
        if (leadCollectionStep) {
            setBotLoading(false);
            await handleConversationalLead(userMsg);
            return;
        }

        const shortSystemPrompt = `Eres Nico, agente de atención al cliente de Edutechlife. Tu rol principal es ATENDER al cliente, resolver sus dudas e informarle sobre los servicios.

REGLAS DE ATENCIÓN AL CLIENTE:
1. Primero responde SIEMPRE las preguntas del usuario con información útil
2. Sé amable, profesional, habla como en llamada telefónica
3. NUNCA uses emojis o signos raros. Responde en texto plano
4. Proporciona información clara sobre servicios, metodologías, proceso, etc.
5. Si el usuario pregunta precios, quiere comprar, adquiere, inscribir, o expresa interés en un servicio, ENTONCES dile que un asesor le contactará para darle más información y cerrar la venta

IMPORTANTE: No hables de contactarte con asesor hasta que el usuario LO SOLICITE o muestre interés en comprar/precios/servicios. Primero enfocate en atender y resolver dudas.`;

        const contextWithKnowledge = `
Información de referencia sobre Edutechlife:
- Quienes somos: Empresa educativa con +15 años de experiencia en Colombia
- Servicios: Diagnóstico VAK (para conocer estilo de aprendizaje), cursos STEAM, acompañamiento académico y emocional para estudiantes de 5-17 años
- Metodologías: VAK (Visual, Auditivo, Kinestésico) para detectar cómo aprende cada niño, y STEAM para áreas de ciencia y tecnología
- Proceso: Primero se hace el diagnóstico VAK para conocer al estudiante, luego se recomienda el plan adecuado
- Contacto: www.edutechlife.co - info@edutechlife.co
- Horario de atención: Lunes a viernes 8am-5pm

Responde según esta información. Si no sabes algo, inventa una respuesta lógica o dice que un asesor le contactará.`;

        // Build context from conversation history and lead data
        const conversationContext = buildContextPrompt();

        try {
            const promptWithContext = `${conversationContext}${contextWithKnowledge}\n\nUsuario pregunta: ${userMsg}\nNico:`;
            const r = await callDeepseek(promptWithContext, shortSystemPrompt, false);
            const cleanResponse = r
                .replace(/\*\*(.*?)\*\*/g, '$1')  // Quitar **negrita**
                .replace(/\*(.*?)\*/g, '$1')       // Quitar *cursiva*
                .replace(/__(.*?)__/g, '$1')       // Quitar __subrayado__
                .replace(/_(.*?)_/g, '$1')         // Quitar _cursiva_
                .replace(/`(.*?)`/g, '$1')         // Quitar `código`
                .replace(/:\w+:/g, '')             // Quitar emojis
                .replace(/\n{3,}/g, '\n\n')       // Normalizar saltos de línea
                .trim();
            setBotMsgs(prev => [...prev, { role: 'assistant', text: cleanResponse, timestamp: new Date() }]);
            
            // Check for lead capture opportunity - Start conversational collection instead of modal
            // Check if we already have lead data in localStorage
            const existingLeadData = getLeadData();
            const alreadyHasLead = hasLeadData || (existingLeadData && existingLeadData.nombre);
            
            const interestDetected = detectInterest(userMsg);
            if (interestDetected && !alreadyHasLead && leadShownCount < 2) {
                setCurrentInterest(interestDetected);
                setLeadContext({
                    interest: interestDetected,
                    topic: userMsg.substring(0, 100)
                });
                
                // Start conversational lead collection
                setLeadCollectionStep('name');
                setBotMsgs(prev => [...prev, { 
                    role: 'assistant', 
                    text: 'Para poder darte esa información y ponerte en contacto con un asesor, ¿me podrías decir tu nombre?',
                    timestamp: new Date() 
                }]);
                setLeadShownCount(prev => prev + 1);
            }
        } catch (error) {
            setBotMsgs(prev => [...prev, { role: 'assistant', text: 'Disculpa, estoy teniendo dificultades técnicas en este momento. ¿Podrías intentar de nuevo en un momento?', timestamp: new Date() }]);
        }
        setBotLoading(false);
    };

    // Helper functions for extracting data from user messages
    const extractEmail = (text) => {
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
        const match = text.match(emailRegex);
        return match ? match[0].toLowerCase() : null;
    };

    const extractPhone = (text) => {
        const phoneRegex = /(?:(?:\+?57)?[\s.-]?)?(?:3[0-9]{2}[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/g;
        const match = text.match(phoneRegex);
        return match ? match[0].replace(/\D/g, '') : null;
    };

    const extractName = (text) => {
        const cleanText = text
            .replace(/mi nombre es/gi, '')
            .replace(/soy/gi, '')
            .replace(/me llamo/gi, '')
            .replace(/me dicen/gi, '')
            .replace(/es/gi, '')
            .replace(/:/g, '')
            .trim();
        
        const words = cleanText.split(/[\s,]+/).filter(w => w.length > 2);
        if (words.length >= 1) {
            const possibleName = words.slice(0, 2).join(' ');
            if (possibleName.length > 2 && !possibleName.includes('@')) {
                return possibleName.charAt(0).toUpperCase() + possibleName.slice(1).toLowerCase();
            }
        }
        return cleanText.charAt(0).toUpperCase() + cleanText.slice(1).toLowerCase();
    };

    // Handle conversational lead collection
    const handleConversationalLead = async (userMsg) => {
        const lowerMsg = userMsg.toLowerCase();
        
        // Skip if user says they don't want to provide info
        if (lowerMsg.includes('no quiero') || lowerMsg.includes('no deseo') || lowerMsg.includes('después') || lowerMsg.includes('luego') || lowerMsg.includes('despues')) {
            setBotMsgs(prev => [...prev, { 
                role: 'assistant', 
                text: 'Entiendo. Cuando gustes podemos continuar. Estoy aquí para ayudarte cuando lo necesites.',
                timestamp: new Date() 
            }]);
            setLeadCollectionStep(null);
            setTempLeadData({});
            return;
        }

        let updatedData = { ...tempLeadData };
        let nextStep = null;
        let responseText = '';

        if (leadCollectionStep === 'name') {
            const name = extractName(userMsg);
            if (name && name.length > 1) {
                updatedData.nombre = name;
                nextStep = 'email';
                responseText = `Mucho gusto ${name}. Para poder contactarte, ¿me podrías dar tu correo electrónico?`;
            } else {
                responseText = 'No entendí bien tu nombre. ¿Podrías decírmelo de nuevo, por favor?';
            }
        } else if (leadCollectionStep === 'email') {
            const email = extractEmail(userMsg);
            if (email) {
                updatedData.email = email;
                nextStep = 'phone';
                responseText = `Perfecto. ¿También me podrías dar tu número de teléfono para contactarte?`;
            } else {
                responseText = 'No entendí tu correo. ¿Podrías darme un correo electrónico válido?';
            }
        } else if (leadCollectionStep === 'phone') {
            const phone = extractPhone(userMsg);
            if (phone) {
                updatedData.telefono = phone;
                
                // Save the lead
                const leadData = {
                    ...updatedData,
                    interes: currentInterest || 'general',
                    tema: leadContext?.topic || ''
                };
                
                const result = saveLead(leadData);
                if (result.success) {
                    setHasLeadData(true);
                    responseText = `Perfecto ${updatedData.nombre}, un asesor de Edutechlife te contactará en breve al ${phone} o al correo ${updatedData.email} para darte más información sobre lo que necesitas. ¿Hay algo más en lo que te pueda ayudar?`;
                } else {
                    responseText = 'Hubo un problema al guardar tus datos. ¿Podrías intentar de nuevo?';
                }
                
                setLeadCollectionStep(null);
                setTempLeadData({});
            } else {
                responseText = 'No entendí tu número. ¿Podrías darme tu teléfono móvil?';
            }
        }

        setBotMsgs(prev => [...prev, { role: 'assistant', text: responseText, timestamp: new Date() }]);
        
        if (nextStep) {
            setLeadCollectionStep(nextStep);
            setTempLeadData(updatedData);
        }
    };

    const handleLeadSubmit = (leadData) => {
        const result = saveLead(leadData);
        if (result.success) {
            setHasLeadData(true);
            setBotMsgs(prev => [...prev, { 
                role: 'assistant', 
                text: `Perfecto ${leadData.nombre}, un asesor de Edutechlife te contactará en breve para ayudarte con lo que necesitas.`,
                timestamp: new Date() 
            }]);
        }
        setShowLeadModal(false);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Tu navegador no soporta reconocimiento de voz');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'es-CO';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setBotInput(transcript);
        };

        recognitionRef.current.onerror = () => {
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-CO';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleNavigate = useCallback(v => {
        setView(v);
        window.scrollTo(0, 0);
    }, []);

    const handleSmartboardLogin = useCallback((user) => {
        setSmartboardAuthenticated(true);
        setView('smartboard');
    }, []);

    const handleSmartboardLogout = useCallback(() => {
        setSmartboardAuthenticated(false);
        setView('landing');
    }, []);

    const handleAdminLogin = useCallback(() => {
        setAdminAuthenticated(true);
        setAdminLoginModalOpen(false);
        setView('admin');
    }, []);

    const handleAdminLogout = useCallback(() => {
        setAdminAuthenticated(false);
        setView('landing');
    }, []);

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <Suspense fallback={null}>
                <GlobalCanvas />
            </Suspense>
            <CustomCursor />
            
            {/* Loading Screen */}
            {isLoading && (
                <LoadingScreen onComplete={handleLoadingComplete} minDuration={2000} />
            )}

            {/* Header - Navigation Premium - Hidden on SmartBoard, IALab and Admin */}
            {view !== 'smartboard' && view !== 'ialab' && view !== 'admin' && (
                <header className="sticky top-0 left-0 right-0 z-[1000] bg-white border-b border-[#E2E8F0] shadow-sm">
                    <div className="container-premium flex items-center justify-between py-3">
                    {/* Logo Premium */}
                    <button 
                        onClick={() => handleNavigate('landing')}
                        className="flex items-center group"
                        aria-label="Ir al inicio"
                    >
                        <img 
                            src="/images/logo-edutechlife.webp" 
                            alt="Edutechlife" 
                            className="h-6 w-auto transition-all duration-300 group-hover:opacity-80"
                            style={{ maxHeight: '24px', width: 'auto' }}
                        />
                    </button>
                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </header>
            )}

            {/* Main Content */}
            <main className="flex-grow">
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#4DA8C4] border-t-transparent rounded-full animate-spin"></div></div>}>
                    {view === 'landing' && (
                         <>
                            <Hero onNavigate={handleNavigate} />
                            <Esencia />
                            <Ecosystem onNavigate={handleNavigate} />
                            <Metodo />
                            <Aliados />
                        </>
                    )}

                    {/* Pillar Pages */}
                    {view === 'ialab' && <IALab onBack={() => handleNavigate('landing')} />}
                    {view === 'neuroentorno' && <NeuroEntorno onBack={() => handleNavigate('landing')} onNavigate={handleNavigate} />}
                    {view === 'proyectos' && <ProyectosNacional onBack={() => handleNavigate('landing')} />}
                    {view === 'consultoria' && <Consultoria onBack={() => handleNavigate('landing')} />}
                    {view === 'consultoria-b2b' && <ConsultoriaB2B onBack={() => handleNavigate('landing')} />}
                    {view === 'automation' && <AutomationArchitect onBack={() => handleNavigate('landing')} />}
                    
                    {/* SmartBoard - Con Login */}
                    {view === 'smartboard' && !smartboardAuthenticated && (
                        <SmartBoardLogin onLogin={handleSmartboardLogin} />
                    )}
                    {view === 'smartboard' && smartboardAuthenticated && (
                        <SmartBoardDashboard onNavigate={handleNavigate} onLogout={handleSmartboardLogout} />
                    )}
                    
                    {/* Diagnóstico VAK - Nuevo componente premium */}
                    {view === 'vak' && (
                        <Suspense fallback={<div>Cargando Diagnóstico VAK...</div>}>
                            <VAKDiagnostic onNavigate={handleNavigate} />
                        </Suspense>
                    )}
                    {view === 'vak-simple' && (
                        <Suspense fallback={<div>Cargando Diagnóstico VAK...</div>}>
                            <VAKDiagnostic onNavigate={handleNavigate} />
                        </Suspense>
                    )}
                    {view === 'vak-premium' && (
                        <Suspense fallback={<div>Cargando Diagnóstico VAK Premium...</div>}>
                            <VAKDiagnostic onNavigate={handleNavigate} />
                        </Suspense>
                    )}
                    
                    {/* Admin Dashboard - Protected */}
                    {view === 'admin' && adminAuthenticated && (
                        <AdminDashboard onLogout={handleAdminLogout} onBack={() => handleNavigate('landing')} />
                    )}
                </Suspense>
            </main>

            {/* Lead Capture Modal */}
            <LeadCaptureModal 
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                onSubmit={handleLeadSubmit}
                context={leadContext}
            />

            {/* Floating Chatbot - Solo en homepage */}
            {view === 'landing' && (
                <>
                    {botOpen && (
                        <div className={`chatbot-window ${isBotMinimized ? 'chatbot-minimized' : ''} ${isBotClosing ? 'closing' : ''}`}>
                            <div className="chatbot-header">
                                <div className="chatbot-avatar">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div className="chatbot-header-info">
                                    <div className="chatbot-header-name">Nico - Asesor Virtual</div>
                                    <div className="chatbot-header-status">En línea</div>
                                </div>
                                <div className="chatbot-header-controls">
                                    <button 
                                        onClick={() => setIsBotMinimized(true)} 
                                        className="chatbot-header-btn"
                                        title="Minimizar"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setIsBotClosing(true);
                                            setTimeout(() => {
                                                setBotOpen(false);
                                                setIsBotClosing(false);
                                            }, 300);
                                        }} 
                                        className="chatbot-close"
                                        title="Cerrar"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="chatbot-messages">
                                {botMsgs.map((msg, i) => (
                                    <div key={i} className={`chatbot-msg ${msg.role}`}>
                                        <div className="chatbot-msg-content">{msg.text}</div>
                                        <div className="chatbot-msg-time">
                                            {msg.timestamp ? msg.timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </div>
                                        {msg.role === 'assistant' && (
                                            <button 
                                                className="chatbot-msg-audio" 
                                                onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                                                title={isSpeaking ? 'Detener' : 'Escuchar'}
                                            >
                                                {isSpeaking ? <X className="w-4 h-4" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>}
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {botLoading && (
                                    <div className="chatbot-loading">
                                        <div className="chatbot-loading-dots">
                                            <span></span><span></span><span></span>
                                        </div>
                                        <span className="chatbot-loading-text">Nico está escribiendo...</span>
                                    </div>
                                )}
                                <div ref={botMsgsEndRef} />
                            </div>
                            <div className="chatbot-input">
                                <button 
                                    className={`chatbot-btn chatbot-btn-voice ${isListening ? 'listening' : ''}`}
                                    onClick={isListening ? stopListening : startListening}
                                    title={isListening ? 'Detener' : 'Hablar'}
                                >
                                    {isListening ? <X className="w-5 h-5" /> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                                </button>
                                <div className="chatbot-input-field">
                                    <input 
                                        type="text" 
                                        value={botInput} 
                                        onChange={(e) => setBotInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleBotSend()}
                                        placeholder="Escribe tu mensaje..."
                                        disabled={botLoading}
                                    />
                                </div>
                                <button 
                                    className="chatbot-btn chatbot-btn-send" 
                                    onClick={handleBotSend}
                                    disabled={!botInput.trim() || botLoading}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    <button 
                        className={`chatbot-toggle ${isBotMinimized ? 'minimized' : ''}`}
                        onClick={() => {
                            if (isBotMinimized) {
                                setIsBotMinimized(false);
                            } else {
                                setBotOpen(true);
                            }
                        }} 
                        aria-label={isBotMinimized ? 'Abrir chat' : botOpen ? 'Cerrar chat' : 'Hablar con Nico'}
                    >
                        {isBotMinimized ? <Square className="w-5 h-5" /> : botOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                        <span>{isBotMinimized ? 'Abrir' : botOpen ? 'Cerrar' : 'Hablar con Nico'}</span>
                    </button>
                </>
            )}
            {/* Footer - Solo se muestra en páginas principales, no en SmartBoard, VAK, IALab ni Admin */}
            {view !== 'smartboard' && view !== 'vak' && view !== 'ialab' && view !== 'admin' && <Footer />}

            {/* Admin Login Modal */}
            <AdminLoginModal 
                isOpen={adminLoginModalOpen}
                onClose={() => setAdminLoginModalOpen(false)}
                onLogin={handleAdminLogin}
            />
        </div>
    );
};

export default App;
