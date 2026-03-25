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
import ContactModal from './components/ContactModal';
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
import { callDeepseek, callDeepseekStream } from './utils/api';

// Cache de preguntas frecuentes para respuestas instantáneas
const responseCache = new Map();

// Preguntas frecuentes con respuestas predefinidas
const frequentQuestions = [
  { patterns: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hello', 'hey'], 
    response: '¡Hola! Soy Nico, tu asistente virtual de Edutechlife. ¿En qué puedo ayudarte hoy?' },
  { patterns: ['servicios', 'qué hacen', 'a qué se dedican', 'qué ofrecen'], 
    response: 'En Edutechlife ofrecemos: Diagnóstico VAK (para conocer el estilo de aprendizaje), Cursos STEAM, Acompañamiento académico y emocional, y Consultoría B2B. ¿Te gustaría más información sobre alguno?' },
  { patterns: ['contacto', 'hablar con alguien', 'asesor', 'hablar con un experto'], 
    response: '¡Con gusto! Un asesor te contactará pronto. ¿Me puedes dar tu nombre y teléfono?' },
  { patterns: ['gracias', 'thank', 'thanks'], 
    response: '¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda colaborarte?' },
  { patterns: ['adiós', 'bye', 'hasta luego', 'nos vemos'], 
    response: '¡Hasta luego! Que tengas un excelente día. Cuando gustes, aquí estaré para ayudarte.' },
];

// Función para buscar en cache
const getCachedResponse = (message) => {
  const lowerMsg = message.toLowerCase().trim();
  for (const faq of frequentQuestions) {
    for (const pattern of faq.patterns) {
      if (lowerMsg.includes(pattern)) {
        return faq.response;
      }
    }
  }
  return null;
};
import { NICO_KNOWLEDGE_BASE } from './utils/knowledgeBase';
import { detectInterest, shouldPromptForLead, saveLead } from './utils/leads';
import { addToHistory, getHistory, buildContextPrompt, getLeadData, clearSession } from './utils/chatMemory';

/* ==================== PREMIUM CURSOR - ZERO LATENCY ==================== */
/* Núcleo decursor maneja por CSS nativo - 0ms latencia */
/* Aura visual con GPU acceleration - siempre visible */
const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    
    const isHovering = useMotionValue(0);
    const isClicking = useMotionValue(0);
    const scaleTransform = useSpring(1, springConfig);
    const clickScale = useSpring(1, { damping: 20, stiffness: 600 });
    
    // Trail positions
    const trail1X = useSpring(cursorX, { damping: 35, stiffness: 300, mass: 0.8 });
    const trail1Y = useSpring(cursorY, { damping: 35, stiffness: 300, mass: 0.8 });
    const trail2X = useSpring(cursorX, { damping: 40, stiffness: 200, mass: 1.2 });
    const trail2Y = useSpring(cursorY, { damping: 40, stiffness: 200, mass: 1.2 });
    
    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        
        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.interactive') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
                isHovering.set(1);
            }
        };
        
        const handleMouseOut = (e) => {
            const target = e.target;
            if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.interactive') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
                isHovering.set(0);
            }
        };
        
        const handleMouseDown = () => {
            isClicking.set(1);
            clickScale.set(0.8);
        };
        
        const handleMouseUp = () => {
            isClicking.set(0);
            clickScale.set(1);
        };

        window.addEventListener('mousemove', moveCursor, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        window.addEventListener('mouseout', handleMouseOut, { passive: true });
        window.addEventListener('mousedown', handleMouseDown, { passive: true });
        window.addEventListener('mouseup', handleMouseUp, { passive: true });
        
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const hovering = isHovering.get();
            const clicking = isClicking.get();
            const baseScale = clicking ? 0.8 : (hovering ? 1.8 : 1);
            scaleTransform.set(baseScale);
        }, 16);
        return () => clearInterval(interval);
    }, [isHovering, isClicking, scaleTransform]);

    return (
        <motion.div
            className="hidden lg:block fixed inset-0 pointer-events-none z-[9999]"
            style={{ x: cursorXSpring, y: cursorYSpring }}
        >
            {/* Trail 2 - furthest */}
            <motion.div
                className="absolute w-12 h-12 rounded-full pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    x: trail2X,
                    y: trail2Y,
                    scale: scaleTransform,
                    backgroundColor: 'rgba(77, 168, 196, 0.03)',
                    willChange: 'transform',
                }}
            />
            
            {/* Trail 1 - middle */}
            <motion.div
                className="absolute w-8 h-8 rounded-full pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    x: trail1X,
                    y: trail1Y,
                    scale: scaleTransform,
                    backgroundColor: 'rgba(77, 168, 196, 0.08)',
                    willChange: 'transform',
                }}
            />
            
            {/* Outer ring - hover effect */}
            <motion.div
                className="absolute w-10 h-10 rounded-full border-2 pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: scaleTransform,
                    borderColor: isHovering ? 'rgba(77, 168, 196, 0.6)' : 'rgba(0, 75, 99, 0.3)',
                    backgroundColor: isHovering ? 'rgba(77, 168, 196, 0.1)' : 'rgba(77, 168, 196, 0.05)',
                    willChange: 'transform, borderColor, backgroundColor',
                }}
            />
            
            {/* Main dot - always visible */}
            <motion.div
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: isHovering ? '#004B63' : '#4DA8C4',
                    scale: clickScale,
                    willChange: 'transform, backgroundColor',
                    boxShadow: isHovering 
                        ? '0 0 10px rgba(0, 75, 99, 0.5)' 
                        : '0 0 8px rgba(77, 168, 196, 0.4)',
                }}
            />
            
            {/* Click effect - pulse */}
            <motion.div
                className="absolute w-6 h-6 rounded-full pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: clickScale,
                    backgroundColor: 'rgba(77, 168, 196, 0.3)',
                    opacity: isClicking,
                    willChange: 'transform, opacity',
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
    
    // Contact modal state
    const [showContactModal, setShowContactModal] = useState(false);
    
    // Conversation tracking
    const [interactionCount, setInteractionCount] = useState(0);
    const [askedForName, setAskedForName] = useState(false);
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
        
        // Increment interaction count
        const newInteractionCount = interactionCount + 1;
        setInteractionCount(newInteractionCount);

        // If we're in lead collection mode, handle it conversationally
        if (leadCollectionStep) {
            setBotLoading(false);
            await handleConversationalLead(userMsg, newInteractionCount);
            return;
        }

        // Get lead data for personalization
        const leadData = getLeadData();
        const userName = leadData?.nombre || tempLeadData?.nombre;
        
        // Build personalized greeting if we have the name
        const personalizedGreeting = userName ? `${userName}, ` : '';

        const shortSystemPrompt = `Eres Nico, agente de atención al cliente de Edutechlife. Tu rol principal es ATENDER al cliente, resolver sus dudas e informarle sobre los servicios.

REGLAS DE ATENCIÓN AL CLIENTE:
1. Primero responde SIEMPRE las preguntas del usuario con información útil
2. Sé amable, profesional, habla como en llamada telefónica
3. NUNCA uses emojis o signos raros. Responde en texto plano
4. Proporciona información clara sobre servicios, metodologías, proceso, etc.
5. Si el usuario pregunta precios, quiere comprar, adquiere, inscribir, o expresa interés en un servicio, ENTONCES pregunta de forma natural si quiere que un asesor le contacte

IMPORTANTE: 
- No hables de contactarte con asesor hasta que el usuario LO SOLICITE o muestre interés activo en comprar/precios/servicios
- Usa el nombre del usuario si lo conoces: ${userName ? userName : 'el nombre del usuario'}
- Primero enfocate en atender y resolver dudas`;

        const contextWithKnowledge = `
Información de referencia sobre Edutechlife:
- Quienes somos: Empresa educativa con +15 años de experiencia en Colombia
- Servicios: Diagnóstico VAK (para conocer estilo de aprendizaje), cursos STEAM, acompañamiento académico y emocional para estudiantes de 5-17 años
- Metodologías: VAK (Visual, Auditivo, Kinestésico) para detectar cómo aprende cada niño, y STEAM para áreas de ciencia y tecnología
- Proceso: Primero se hace el diagnóstico VAK para conocer al estudiante, luego se recomienda el plan adecuado
- Contacto: www.edutechlife.co - info@edutechlife.co
- Horario de atención: Lunes a viernes 8am-5pm

Responde según esta información. Si no sabes algo, inventa una respuesta lógica o dice que un asesor le contactará.`;

        // Build context from conversation history and lead data (reducido a 5 mensajes)
        const conversationHistory = getHistory().slice(-10); // Últimos 5 intercambios
        
        // Verificar cache primero
        const cachedResponse = getCachedResponse(userMsg);
        
        if (cachedResponse) {
          setBotMsgs(prev => [...prev, { role: 'assistant', text: cachedResponse, timestamp: new Date() }]);
          setBotLoading(false);
          return;
        }

        try {
            const historyContext = conversationHistory.length > 0 
                ? `\nConversación anterior:\n${conversationHistory.map(m => `${m.role === 'user' ? 'Usuario' : 'Nico'}: ${m.text}`).join('\n')}\n`
                : '';
            
            const promptWithContext = `${historyContext}${contextWithKnowledge}\n\nUsuario pregunta: ${userMsg}\nNico:`;
            
            // Usar streaming para percepción más rápida
            const fullResponse = await callDeepseekStream(
                promptWithContext, 
                shortSystemPrompt, 
                false,
                (chunk) => {
                    // Aquí podríamos mostrar el texto gradual pero por simplicidad
                    // esperamos la respuesta completa
                }
            );
            
            const cleanResponse = fullResponse
                ? fullResponse
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\*(.*?)\*/g, '$1')
                    .replace(/__(.*?)__/g, '$1')
                    .replace(/_(.*?)_/g, '$1')
                    .replace(/`(.*?)`/g, '$1')
                    .replace(/:\w+:/g, '')
                    .replace(/\n{3,}/g, '\n\n')
                    .trim()
                : 'Disculpa, no pude generar una respuesta. ¿Podrías intentar de nuevo?';
            
            setBotMsgs(prev => [...prev, { role: 'assistant', text: cleanResponse, timestamp: new Date() }]);
            
            // Check for lead capture opportunity
            const existingLeadData = getLeadData();
            const alreadyHasName = hasLeadData || (existingLeadData && existingLeadData.nombre);
            const userHasName = tempLeadData?.nombre || alreadyHasName;
            
            // Strategy: 
            // 1. Ask for name at interaction 3 (if we don't have it)
            // 2. If user shows strong interest, ask for contact naturally
            
            const interestDetected = detectInterest(userMsg);
            
            // Ask for name at interaction 3 if we don't have it
            if (newInteractionCount >= 3 && !userHasName && !askedForName && !leadCollectionStep) {
                setAskedForName(true);
                setLeadCollectionStep('name');
                setTimeout(() => {
                    setBotMsgs(prev => [...prev, { 
                        role: 'assistant', 
                        text: 'Para conocerte mejor y atenderte de forma personalizada, ¿cómo te llamas?',
                        timestamp: new Date() 
                    }]);
                }, 500);
            }
            
            // If user shows strong interest and we have their name, ask for contact naturally
            if (interestDetected && userHasName && !leadCollectionStep && leadShownCount < 2) {
                setCurrentInterest(interestDetected);
                setLeadContext({
                    interest: interestDetected,
                    topic: userMsg.substring(0, 100)
                });
                
                // Ask for contact naturally
                setLeadCollectionStep('phone');
                setLeadShownCount(prev => prev + 1);
                setTimeout(() => {
                    setBotMsgs(prev => [...prev, { 
                        role: 'assistant', 
                        text: `${tempLeadData.nombre || '¡Excelente!'} Un asesor puede darte más información sobre esto. ¿Te gustaría que te contactemos? ¿Cuál es tu número de teléfono?`,
                        timestamp: new Date() 
                    }]);
                }, 500);
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
    // eslint-disable-next-line no-unused-vars
    const handleConversationalLead = async (userMsg, currentInteractionCount) => {
        const lowerMsg = userMsg.toLowerCase();
        
        // Track attempts for each field
        const maxAttempts = 2;
        
        // Skip if user says they don't want to provide info - continue conversation
        if (lowerMsg.includes('no quiero') || lowerMsg.includes('no deseo') || lowerMsg.includes('después') || lowerMsg.includes('luego') || lowerMsg.includes('despues') || lowerMsg.includes('no tengo') || lowerMsg.includes('no me interesa') || lowerMsg.includes('ahora no')) {
            setBotMsgs(prev => [...prev, { 
                role: 'assistant', 
                text: '¡Entendido! No hay problema. Estoy aquí para ayudarte. ¿En qué más puedo colaborarte?',
                timestamp: new Date() 
            }]);
            setLeadCollectionStep(null);
            setTempLeadData({});
            return;
        }

        let updatedData = { ...tempLeadData };
        let nextStep = null;
        let responseText = '';
        
        // Get current attempt count or initialize
        const nameAttempts = tempLeadData._nameAttempts || 0;
        const emailAttempts = tempLeadData._emailAttempts || 0;
        const phoneAttempts = tempLeadData._phoneAttempts || 0;

        if (leadCollectionStep === 'name') {
            const name = extractName(userMsg);
            if (name && name.length > 1) {
                updatedData.nombre = name;
                delete updatedData._nameAttempts;
                // Store name and continue conversation normally
                setTempLeadData(updatedData);
                setLeadCollectionStep(null);
                setBotMsgs(prev => [...prev, { 
                    role: 'assistant', 
                    text: `Mucho gusto ${name}. ¿En qué más puedo ayudarte hoy?`,
                    timestamp: new Date() 
                }]);
                return;
            } else {
                // Try again or continue
                const newAttempts = nameAttempts + 1;
                updatedData._nameAttempts = newAttempts;
                
                if (newAttempts >= maxAttempts) {
                    // Max attempts reached, continue without name
                    setLeadCollectionStep(null);
                    delete updatedData._nameAttempts;
                    setTempLeadData({});
                    setBotMsgs(prev => [...prev, { 
                        role: 'assistant', 
                        text: '¡No hay problema! ¿En qué puedo ayudarte?',
                        timestamp: new Date() 
                    }]);
                    return;
                }
                
                responseText = 'No entendí bien tu nombre. ¿Podrías decírmelo de nuevo, por favor?';
            }
        } else if (leadCollectionStep === 'email') {
            const email = extractEmail(userMsg);
            if (email) {
                updatedData.email = email;
                delete updatedData._emailAttempts;
                // Store email and continue
                setTempLeadData(updatedData);
                // Optionally ask for phone but don't block
                const askPhone = Math.random() > 0.5; // 50% chance to ask
                if (askPhone) {
                    setLeadCollectionStep('phone');
                    setBotMsgs(prev => [...prev, { 
                        role: 'assistant', 
                        text: `Perfecto ${updatedData.nombre || ''}. ¿Te gustaría recibir información por WhatsApp? ¿Cuál es tu número?`,
                        timestamp: new Date() 
                    }]);
                    return;
                } else {
                    // Save lead with just email
                    const leadData = {
                        nombre: updatedData.nombre,
                        email: updatedData.email,
                        telefono: updatedData.telefono || '',
                        interes: currentInterest || 'general',
                        tema: leadContext?.topic || ''
                    };
                    saveLead(leadData);
                    setHasLeadData(true);
                    setLeadCollectionStep(null);
                    setBotMsgs(prev => [...prev, { 
                        role: 'assistant', 
                        text: `¡Gracias ${updatedData.nombre || ''}! Un asesor te contactará pronto al correo. ¿Hay algo más en lo que te pueda ayudar?`,
                        timestamp: new Date() 
                    }]);
                    return;
                }
            } else {
                const newAttempts = emailAttempts + 1;
                updatedData._emailAttempts = newAttempts;
                
                if (newAttempts >= maxAttempts) {
                    // Max attempts, save what we have and continue
                    const leadData = {
                        nombre: updatedData.nombre,
                        email: '',
                        telefono: '',
                        interes: currentInterest || 'general',
                        tema: leadContext?.topic || ''
                    };
                    if (updatedData.nombre) {
                        saveLead(leadData);
                    }
                    setLeadCollectionStep(null);
                    setBotMsgs(prev => [...prev, { 
                        role: 'assistant', 
                        text: `¡Entendido ${updatedData.nombre || ''}! ¿Te ayudo con algo más?`,
                        timestamp: new Date() 
                    }]);
                    return;
                }
                responseText = 'No entendí tu correo. ¿Podrías darme un correo electrónico válido? (O dime "continuar" si prefieres)';
            }
        } else if (leadCollectionStep === 'phone') {
            const phone = extractPhone(userMsg);
            if (phone) {
                updatedData.telefono = phone;
                delete updatedData._phoneAttempts;
                
                // Save the lead
                const leadData = {
                    nombre: updatedData.nombre || '',
                    email: updatedData.email || '',
                    telefono: phone,
                    interes: currentInterest || 'general',
                    tema: leadContext?.topic || ''
                };
                
                saveLead(leadData);
                setHasLeadData(true);
                setLeadCollectionStep(null);
                setTempLeadData({});
                setBotMsgs(prev => [...prev, { 
                    role: 'assistant', 
                    text: `Perfecto ${updatedData.nombre || ''}. Un asesor de Edutechlife te contactará en breve. ¿Hay algo más en lo que te pueda ayudar?`,
                    timestamp: new Date() 
                }]);
                return;
            } else {
                const newAttempts = phoneAttempts + 1;
                updatedData._phoneAttempts = newAttempts;
                
                if (newAttempts >= maxAttempts) {
                    // Max attempts, save what we have and continue
                    const leadData = {
                        nombre: updatedData.nombre || '',
                        email: updatedData.email || '',
                        telefono: '',
                        interes: currentInterest || 'general',
                        tema: leadContext?.topic || ''
                    };
                    if (updatedData.nombre || updatedData.email) {
                        saveLead(leadData);
                    }
                    setLeadCollectionStep(null);
                    setBotMsgs(prev => [...prev, { 
                        role: 'assistant', 
                        text: `¡No hay problema! ${updatedData.nombre ? updatedData.nombre + ', ' : ''}¿Te ayudo con algo más?`,
                        timestamp: new Date() 
                    }]);
                    return;
                }
                responseText = 'No entendí tu número. ¿Podrías darme tu teléfono móvil? (O dime "continuar" si prefieres)';
            }
        }

        setBotMsgs(prev => [...prev, { role: 'assistant', text: responseText, timestamp: new Date() }]);
        
        if (nextStep) {
            setLeadCollectionStep(nextStep);
            setTempLeadData(updatedData);
        } else if (responseText && !nextStep) {
            // Update data even if we continue
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
                <header className="sticky top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between py-3">
                        {/* Logo Premium - Smaller */}
                        <button 
                            onClick={() => handleNavigate('landing')}
                            className="flex items-center group"
                            aria-label="Ir al inicio"
                        >
                            <img 
                                src="/images/logo-edutechlife.webp" 
                                alt="Edutechlife" 
                                className="h-5 w-auto transition-all duration-300 group-hover:opacity-80"
                            />
                        </button>
                        
                        {/* Navigation Links - Active */}
                        <nav className="hidden md:flex items-center gap-6">
                            <button 
                                onClick={() => {
                                    handleNavigate('landing');
                                    setTimeout(() => {
                                        const esenciaSection = document.getElementById('esencia');
                                        if (esenciaSection) {
                                            esenciaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }, 100);
                                }}
                                className="text-sm font-medium text-gray-600 hover:text-[#004B63] transition-colors duration-200"
                            >
                                Esencia
                            </button>
                            <button 
                                onClick={() => {
                                    handleNavigate('landing');
                                    setTimeout(() => {
                                        const ecosystemSection = document.getElementById('ecosystem');
                                        if (ecosystemSection) {
                                            ecosystemSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }, 100);
                                }}
                                className="text-sm font-medium text-gray-600 hover:text-[#004B63] transition-colors duration-200"
                            >
                                Ecosistema
                            </button>
                            <button 
                                onClick={() => setShowContactModal(true)}
                                className="text-sm font-medium text-gray-600 hover:text-[#004B63] transition-colors duration-200"
                            >
                                Contacto
                            </button>
                        </nav>
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

            {/* Contact Modal */}
            <ContactModal 
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
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
