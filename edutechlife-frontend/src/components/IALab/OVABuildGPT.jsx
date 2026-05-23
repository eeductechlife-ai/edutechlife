import React, { useState, useEffect } from 'react';
import VoiceReader from './VoiceReader';
import {
    GraduationCap, Bot, MessageSquare, Mail, Settings, Zap,
    CheckCircle, Award, ChevronRight, Play,
    FileText, Database, ArrowRight, ShieldCheck, Check, Star,
    Lightbulb, Workflow
} from 'lucide-react';

const Logo = () => (
    <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-sm text-white">
            <GraduationCap size={22} strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            <span className="text-corporate">Edu</span><span className="text-petroleum">techlife</span>
        </span>
    </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon = null, disabled = false }) => {
    const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
    const variants = {
        primary: "bg-gradient-to-r from-corporate to-corporate-dark text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5",
        secondary: "bg-white dark:bg-slate-700 text-petroleum dark:text-slate-200 border-2 border-[#E0F7FA] dark:border-slate-600 hover:border-corporate hover:bg-[#F0FDFF] dark:hover:bg-slate-600",
        outline: "bg-transparent text-corporate border-2 border-corporate hover:bg-corporate hover:text-white"};

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
            {Icon && <Icon size={20} />}
            {children}
        </button>
    );
};

const Card = ({ children, className = '' }) => (
    <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/40 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl p-6 md:p-8 ${className}`}>
        {children}
    </div>
);

const WelcomeScreen = ({ onNext }) => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-[fadeIn_0.6s_ease-out_forwards] px-4">
        <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
            <Logo />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-petroleum font-semibold text-sm mb-6">
            <Bot size={16} className="text-corporate" />
            <span>Laboratorio Guiado por Valerio</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-petroleum mb-6 leading-tight">
            Construye tu <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-corporate to-corporate-dark">GPT Personalizado</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-slate-300 mb-6 max-w-2xl">
            Hola, soy Valerio, tu coach de IA. En este laboratorio te guiaré paso a paso para que crees tu propio GPT con acciones y conexiones a APIs externas. ¡Vamos allá!
        </p>
        <VoiceReader text="Hola, soy Valerio, tu coach de IA de Edutechlife. En este laboratorio te guiaré paso a paso para que crees tu propio GPT personalizado con acciones y conexión a APIs externas. Vamos a empezar esta aventura juntos." />
        <div className="mt-6">
            <Button onClick={onNext} icon={Play} className="text-lg px-8 py-4">
                Comenzar Laboratorio
            </Button>
        </div>
    </div>
);

const IntroScreen = ({ onNext, addXp }) => {
    useEffect(() => { addXp(50); }, []);
    const introText = "Los GPTs personalizados te permiten crear versiones a tu medida de ChatGPT para tareas específicas. A diferencia del ChatGPT estándar, un GPT personalizado sigue instrucciones precisas, tiene acceso a conocimiento propio y puede conectarse con APIs externas mediante Acciones. Es como tener un asistente entrenado exclusivamente para tu proyecto.";

    return (
        <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
            <Card>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-petroleum">¿Qué es un GPT Personalizado?</h2>
                        </div>
                        <VoiceReader text={introText} />
                        <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed">
                            Los <strong>GPTs personalizados</strong> son versiones adaptadas de ChatGPT que puedes crear para una tarea específica, con instrucciones, conocimientos y acciones propias.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-[#F0FDFF] dark:bg-slate-700/30 p-5 rounded-xl border border-[#E0F7FA] dark:border-slate-600">
                                <Bot className="text-corporate mb-3" size={28} />
                                <h3 className="font-bold text-petroleum mb-2">GPT Personalizado</h3>
                                <p className="text-sm text-gray-600 dark:text-slate-300">Sigue instrucciones específicas, usa tu base de conocimiento y se conecta con APIs externas.</p>
                            </div>
                            <div className="bg-gradient-to-br from-corporate/10 to-petroleum/10 p-5 rounded-xl border border-corporate/30 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2"><CheckCircle className="text-corporate" size={20}/></div>
                                <Workflow className="text-petroleum mb-3" size={28} />
                                <h3 className="font-bold text-petroleum mb-2">Acciones (APIs)</h3>
                                <p className="text-sm text-gray-600 dark:text-slate-300">Conecta tu GPT con servicios externos como Google Sheets, Slack o tu propia API.</p>
                            </div>
                        </div>
                        <Button onClick={onNext} icon={ChevronRight} className="mt-4">Crear mi Primer GPT</Button>
                    </div>
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-corporate to-petroleum rounded-full blur-3xl opacity-20 animate-pulse"></div>
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="IA Educativa" loading="lazy" className="rounded-2xl shadow-2xl relative z-10 object-cover w-full max-h-80 h-auto" />
                    </div>
                </div>
            </Card>
        </div>
    );
};

const ModuleSlack = ({ onNext, addXp }) => {
    const [messages, setMessages] = useState([
        { sender: 'Profe Ana', text: '¡Hola equipo! ¿Alguien tiene el resumen de la reunión de ayer sobre el nuevo currículo?', isBot: false }
    ]);
    const [simulated, setSimulated] = useState(false);

    const simulateIA = () => {
        setSimulated(true);
        addXp(100);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                sender: 'Valerio GPT',
                text: '¡Claro! Aquí tienes el resumen:\n1. Se aprobó el uso de herramientas IA.\n2. Exámenes la próxima semana.\n3. Capacitación docente el viernes.',
                isBot: true
            }]);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
            <h2 className="text-3xl font-bold text-petroleum mb-2">Paso 1: Configurar un GPT para Slack</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-6">Transforma la comunicación educativa con un GPT conectado a tu equipo.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 flex flex-col justify-between">
                    <div>
                        <MessageSquare className="text-corporate w-12 h-12 mb-4" />
                        <h3 className="text-xl font-bold text-petroleum mb-3">¿Qué puede hacer?</h3>
                        <ul className="space-y-3">
                            {['Resumir reuniones automáticamente', 'Responder dudas frecuentes de alumnos', 'Generar ideas para clase'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <VoiceReader text="Tu GPT personalizado puede conectarse a Slack mediante Acciones. Cada vez que alguien pida un resumen, el GPT usará la API de Slack para leer los mensajes y devolver un análisis completo." />
                </Card>

                <Card className="col-span-2 bg-[#F8FAFC] dark:bg-slate-700/30 border-slate-300 dark:border-slate-600">
                    <div className="border-b border-slate-300 dark:border-slate-600 pb-3 mb-4 flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200"># claustro-docentes</span>
                    </div>
                    <div className="space-y-4 mb-6 min-h-[200px]">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 animate-[fadeIn_0.6s_ease-out_forwards] ${msg.isBot ? 'bg-white dark:bg-slate-700 p-3 rounded-lg border border-cyan-100 dark:border-cyan-900/30 shadow-sm' : ''}`}>
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold flex-shrink-0 ${msg.isBot ? 'bg-corporate' : 'bg-purple-600'}`}>
                                    {msg.isBot ? <Bot size={18}/> : 'A'}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        {msg.sender}
                                        {msg.isBot && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 rounded uppercase">GPT</span>}
                                    </div>
                                    <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line mt-1">{msg.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!simulated ? (
                        <Button onClick={simulateIA} icon={Zap} className="w-full">Probar GPT en Slack</Button>
                    ) : (
                        <Button onClick={onNext} variant="secondary" className="w-full">Siguiente Paso <ArrowRight size={16}/></Button>
                    )}
                </Card>
            </div>
        </div>
    );
};

const ModuleGoogle = ({ onNext, addXp }) => {
    const [emailText, setEmailText] = useState("Hola estudiantes,\nles escribo para desirles que el examen es el lunes. estudien.\n\nSaludos.");
    const [improved, setImproved] = useState(false);

    const improveText = () => {
        setImproved(true);
        addXp(100);
        setEmailText("Estimados estudiantes,\n\nEspero que se encuentren muy bien. Les escribo para recordarles que nuestra próxima evaluación se llevará a cabo este lunes. Les recomiendo revisar los apuntes del Módulo 2.\n\n¡Mucho éxito en su preparación!\n\nAtentamente,\nEl Docente.");
    };

    return (
        <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
            <h2 className="text-3xl font-bold text-petroleum mb-2">Paso 2: GPT + Google Workspace</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-6">Conecta tu GPT con Gmail, Google Docs y Sheets.</p>

            <Card className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <Mail className="text-red-500" />
                        <FileText className="text-blue-500" />
                        <Database className="text-green-500" />
                    </div>
                    <VoiceReader text="Al conectar tu GPT con Google Workspace mediante Acciones, puedes pedirle que redacte correos, analice documentos de Docs o extraiga conclusiones de Sheets. Todo sin salir del chat." />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden">
                    <div className="bg-slate-100 dark:bg-slate-700/50 px-4 py-2 border-b dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 flex gap-2">
                        <span>Para: alumnos@instituto.edu</span>
                    </div>
                    <div className="p-4">
                        <textarea
                            className="w-full h-32 p-2 border-none resize-none focus:ring-0 text-slate-700 dark:text-slate-300 bg-transparent"
                            value={emailText}
                            readOnly
                        />
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/30 p-3 border-t dark:border-slate-700 flex justify-between items-center">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Borrador original</span>
                        {!improved ? (
                            <Button onClick={improveText} variant="secondary" className="!py-1.5 !px-4 text-sm" icon={Lightbulb}>
                                Mejorar con GPT
                            </Button>
                        ) : (
                            <span className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1"><Check size={16}/> Texto optimizado por GPT</span>
                        )}
                    </div>
                </div>
            </Card>

            {improved && (
                <div className="flex justify-end animate-[fadeIn_0.6s_ease-out_forwards]">
                    <Button onClick={onNext}>Paso 3: Acciones Avanzadas <ArrowRight size={16}/></Button>
                </div>
            )}
        </div>
    );
};

const ModuleMakeZapier = ({ onNext, addXp }) => {
    const [tab, setTab] = useState('make');
    useEffect(() => { addXp(50); }, [tab]);

    return (
        <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
            <h2 className="text-3xl font-bold text-petroleum mb-2">Paso 3: Acciones con APIs Externas</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-6">Conecta tu GPT con el mundo exterior mediante Acciones personalizadas.</p>

            <div className="flex gap-4 mb-6">
                <button onClick={() => setTab('make')} className={`flex-1 py-3 font-bold rounded-xl transition-all ${tab === 'make' ? 'bg-petroleum text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border dark:border-slate-600 hover:border-petroleum'}`}>
                    <Workflow className="inline mr-2" size={20}/> API REST
                </button>
                <button onClick={() => setTab('zapier')} className={`flex-1 py-3 font-bold rounded-xl transition-all ${tab === 'zapier' ? 'bg-corporate text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border dark:border-slate-600 hover:border-corporate'}`}>
                    <Zap className="inline mr-2" size={20}/> Webhooks
                </button>
            </div>

            <Card className="min-h-[300px]">
                {tab === 'make' ? (
                    <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-petroleum mb-2">Conectar con APIs REST</h3>
                                <p className="text-gray-600 dark:text-slate-300">Tu GPT puede llamar a cualquier API externa usando las Acciones de OpenAI.</p>
                            </div>
                            <VoiceReader text="Las Acciones de GPT funcionan como un puente: defines una especificación OpenAPI y tu GPT puede llamar a servicios externos. Por ejemplo, consultar el clima, buscar en una base de datos, o enviar notificaciones." />
                        </div>

                        <div className="flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-700/30 p-8 rounded-xl border border-slate-200 dark:border-slate-600 overflow-x-auto">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg z-10"><Mail/></div>
                                <span className="text-xs font-bold mt-2 text-slate-600 dark:text-slate-300">Pregunta</span>
                            </div>
                            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-corporate rounded-full flex items-center justify-center text-white shadow-lg z-10"><Bot/></div>
                                <span className="text-xs font-bold mt-2 text-slate-600 dark:text-slate-300">GPT Procesa</span>
                            </div>
                            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg z-10"><Database/></div>
                                <span className="text-xs font-bold mt-2 text-slate-600 dark:text-slate-300">API Externa</span>
                            </div>
                            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-petroleum rounded-full flex items-center justify-center text-white shadow-lg z-10"><CheckCircle/></div>
                                <span className="text-xs font-bold mt-2 text-slate-600 dark:text-slate-300">Respuesta</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-corporate mb-2">Webhooks y Eventos</h3>
                                <p className="text-gray-600 dark:text-slate-300">Tu GPT puede reaccionar a eventos externos en tiempo real.</p>
                            </div>
                            <VoiceReader text="Los webhooks permiten que tu GPT reciba notificaciones cuando ocurre algo. Por ejemplo, cuando un estudiante entrega una tarea, el GPT puede automáticamente revisarla y dar retroalimentación." />
                        </div>

                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600">
                            <table className="w-full text-left bg-white dark:bg-slate-800">
                                <thead className="bg-slate-50 dark:bg-slate-700/30 text-slate-600 dark:text-slate-300">
                                    <tr>
                                        <th className="p-4 border-b">Característica</th>
                                        <th className="p-4 border-b font-bold text-[#004B63]">API REST</th>
                                        <th className="p-4 border-b font-bold text-corporate">Webhooks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4 border-b text-slate-700 dark:text-slate-300">Dirección</td>
                                        <td className="p-4 border-b text-slate-600 dark:text-slate-300">GPT llama a la API</td>
                                        <td className="p-4 border-b text-slate-600 dark:text-slate-300">La app avisa al GPT</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b text-slate-700 dark:text-slate-300">Ideal para</td>
                                        <td className="p-4 border-b text-slate-600 dark:text-slate-300">Consultar datos externos</td>
                                        <td className="p-4 border-b text-slate-600 dark:text-slate-300">Recibir notificaciones</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-slate-700 dark:text-slate-300">Ejemplo</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">Buscar en base de datos</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">Nuevo formulario enviado</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Card>

            <div className="flex justify-center mt-8">
                <Button onClick={onNext} icon={Settings} className="text-lg">Ir a la Actividad Práctica</Button>
            </div>
        </div>
    );
};

const ActivityBuilder = ({ onNext, addXp }) => {
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState({ trigger: null, ai: null, dest: null });

    const handleSelect = (type, val) => {
        setSelections({ ...selections, [type]: val });
        setTimeout(() => {
            if (step < 3) setStep(step + 1);
            else addXp(200);
        }, 500);
    };

    const triggers = [
        { id: 'form', icon: FileText, text: 'Nuevo formulario enviado' },
        { id: 'email', icon: Mail, text: 'Nuevo correo recibido' },
    ];
    const actions = [
        { id: 'summary', icon: Bot, text: 'Generar resumen automático' },
        { id: 'sentiment', icon: Star, text: 'Analizar sentimiento' },
    ];
    const destinations = [
        { id: 'slack', icon: MessageSquare, text: 'Enviar a Slack' },
        { id: 'sheets', icon: Database, text: 'Guardar en Google Sheets' },
    ];

    return (
        <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="text-center mb-8">
                <span className="inline-block px-4 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm mb-3">Actividad Práctica</span>
                <h2 className="text-3xl font-bold text-petroleum">Diseña tu Propio GPT</h2>
                <p className="text-gray-600 dark:text-slate-300 mt-2">Selecciona las piezas para configurar tu GPT con acciones.</p>
            </div>

            <Card className="mb-8">
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700/50 -z-10 -translate-y-1/2"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= i ? 'bg-corporate text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                            {i}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
                        <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-slate-300">1. ¿Qué evento activará tu GPT?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {triggers.map(t => (
                                <button key={t.id} onClick={() => handleSelect('trigger', t.text)} className="p-6 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-corporate hover:bg-cyan-50 dark:hover:bg-cyan-900/20 flex flex-col items-center gap-3 transition-all">
                                    <t.icon size={32} className="text-petroleum" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{t.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
                        <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-slate-300">2. ¿Qué debe hacer tu GPT con la información?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {actions.map(a => (
                                <button key={a.id} onClick={() => handleSelect('ai', a.text)} className="p-6 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-corporate hover:bg-green-50 dark:hover:bg-green-900/20 flex flex-col items-center gap-3 transition-all">
                                    <a.icon size={32} className="text-corporate" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{a.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {step === 3 && !selections.dest && (
                    <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
                        <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-slate-300">3. ¿Dónde enviará el resultado?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {destinations.map(d => (
                                <button key={d.id} onClick={() => handleSelect('dest', d.text)} className="p-6 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex flex-col items-center gap-3 transition-all">
                                    <d.icon size={32} className="text-purple-600" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{d.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {selections.dest && (
                    <div className="text-center animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-petroleum mb-4">¡GPT Configurado!</h3>
                        <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-xl border dark:border-slate-600 inline-flex flex-col md:flex-row items-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                            <span>{selections.trigger}</span>
                            <ArrowRight className="hidden md:block text-slate-300 dark:text-slate-600"/>
                            <span className="text-corporate">{selections.ai}</span>
                            <ArrowRight className="hidden md:block text-slate-300 dark:text-slate-600"/>
                            <span>{selections.dest}</span>
                        </div>
                        <p className="mt-4 text-gray-500 dark:text-slate-400 text-sm">Así funciona un GPT con Acciones: evento → inteligencia → resultado.</p>
                        <div className="mt-8">
                            <Button onClick={onNext} className="mx-auto text-lg px-8">Ir a la Evaluación Final</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

const QuizScreen = ({ onNext, addXp }) => {
    const questions = [
        {
            q: "1. Un equipo docente quiere que un GPT responda automáticamente dudas sobre fechas de exámenes dentro del correo electrónico. ¿Qué necesita configurar?",
            options: [
                "Un GPT con Acción de Gmail que lea y responda correos automáticamente.",
                "Un GPT estándar sin acciones, los alumnos copian y pegan sus dudas.",
                "Solo un prompt bien escrito, sin necesidad de APIs externas.",
                "Un archivo PDF subido como conocimiento del GPT."
            ],
            answer: 0
        },
        {
            q: "2. ¿Cuál es la diferencia clave entre un GPT personalizado y el ChatGPT estándar?",
            options: [
                "El GPT personalizado sigue instrucciones fijas, tiene base de conocimiento propia y puede conectar con APIs externas.",
                "El GPT personalizado es más rápido que ChatGPT estándar.",
                "ChatGPT estándar no puede procesar texto largo, solo el GPT personalizado.",
                "El GPT personalizado funciona sin conexión a internet."
            ],
            answer: 0
        },
        {
            q: "3. Un estudiante usa un GPT para generar un ensayo completo y lo entrega sin leerlo. Según un modelo de aprendizaje significativo, ¿cuál debió ser el uso correcto?",
            options: [
                "Usarlo como compañero cognitivo: para lluvia de ideas, debatir conceptos y recibir retroalimentación de sus borradores.",
                "Usarlo solo para formato, porque la IA no debería participar en la creación de contenido.",
                "Usar herramientas para ocultar el rastro de IA y evitar detección.",
                "Evitar la IA por completo, pues destruye la creatividad."
            ],
            answer: 0
        },
        {
            q: "4. ¿Cuál es el mayor impacto pedagógico de que un docente automatice tareas administrativas con un GPT?",
            options: [
                "Libera tiempo para enfocarse en empatía, tutorías personalizadas y diseño de experiencias de aprendizaje más humanas.",
                "Permite justificar una reducción de carga laboral y dar menos clases.",
                "Demuestra que los docentes pueden ser reemplazados por sistemas de IA.",
                "Obliga al docente a certificarse como ingeniero de software."
            ],
            answer: 0
        }
    ];

    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleAnswer = (index) => {
        setSelected(index);
        if (index === questions[currentQ].answer) {
            setScore(score + 1);
            addXp(125);
        }
        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(currentQ + 1);
                setSelected(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards] pb-12">
            <h2 className="text-3xl font-bold text-petroleum mb-6 flex items-center gap-3">
                <CheckCircle className="text-corporate" size={32}/> Evaluación Final
            </h2>

            {!showResult ? (
                <Card className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Pregunta {currentQ + 1} de {questions.length}</span>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 dark:text-slate-200 mb-6">{questions[currentQ].q}</h3>
                    <div className="space-y-3">
                        {questions[currentQ].options.map((opt, i) => {
                            let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-300 ";
                            if (selected === null) {
                                btnClass += "border-gray-200 dark:border-slate-600 hover:border-corporate hover:bg-[#F0FDFF]";
                            } else {
                                if (i === questions[currentQ].answer) {
                                    btnClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 font-medium";
                                } else if (i === selected) {
                                    btnClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300";
                                } else {
                                    btnClass += "opacity-50 border-gray-200 dark:border-slate-600";
                                }
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => selected === null && handleAnswer(i)}
                                    className={btnClass}
                                    disabled={selected !== null}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${selected !== null && i === questions[currentQ].answer ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-slate-500'}`}>
                                            {selected !== null && i === questions[currentQ].answer && <Check size={14} />}
                                        </div>
                                        <span className="leading-relaxed">{opt}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </Card>
            ) : (
                <Card className="text-center animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-corporate to-petroleum rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg shadow-cyan-200">
                        <Award size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-petroleum mb-2">¡Evaluación Completada!</h3>
                    <p className="text-xl text-gray-600 dark:text-slate-300 mb-6">Obtuviste <span className="font-bold text-corporate">{score}</span> de <span className="font-bold">{questions.length}</span> aciertos.</p>

                    {score === questions.length ? (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-xl mb-8 border border-green-200 dark:border-green-800">
                            <p className="font-medium flex items-center justify-center gap-2"><Star className="text-yellow-500 fill-current" size={20}/> ¡Puntuación perfecta! Valerio está orgulloso de ti.</p>
                        </div>
                    ) : score >= 2 ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl mb-8 border border-blue-200 dark:border-blue-800">
                            <p className="font-medium">¡Buen trabajo! Repasa los conceptos que te hayan quedado dudosos.</p>
                        </div>
                    ) : (
                        <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 p-4 rounded-xl mb-8 border border-orange-200 dark:border-orange-800">
                            <p className="font-medium">No te preocupes, repasa el laboratorio y vuelve a intentarlo. Valerio confía en ti.</p>
                        </div>
                    )}

                    <Button onClick={onNext} icon={Award} className="w-full sm:w-auto text-lg py-3 px-8 mx-auto">
                        Recibir Certificado
                    </Button>
                </Card>
            )}
        </div>
    );
};

const CertificateScreen = ({ xp, onReset }) => {
    return (
        <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards] text-center">
            <h2 className="text-4xl font-extrabold text-petroleum mb-4">¡Felicidades, Constructor de GPTs!</h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 mb-8">Has completado el laboratorio guiado por Valerio. Ahora sabes crear GPTs personalizados con acciones.</p>

            <div className="bg-gradient-to-br from-petroleum to-[#002635] p-1 rounded-3xl shadow-2xl mb-10 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-500">
                <div className="bg-white dark:bg-slate-800 rounded-[22px] p-8 md:p-12 border-4 border-transparent bg-clip-padding relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 dark:bg-cyan-900/20 rounded-bl-full -z-10 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-100 dark:bg-slate-700/50 rounded-tr-full -z-10 opacity-50"></div>

                    <div className="flex justify-center mb-6">
                        <Logo />
                    </div>
                    <div className="text-sm font-bold tracking-widest text-corporate uppercase mb-2">Certificado de Finalización</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">Laboratorio: Construye un GPT Personalizado</h3>

                    <div className="flex justify-center gap-8 text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-700 py-4 mb-6">
                        <div>
                            <div className="text-xs uppercase tracking-wider">Puntaje XP</div>
                            <div className="text-xl font-bold text-petroleum">{xp} / 1000</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wider">Coach</div>
                            <div className="text-xl font-bold text-petroleum">Valerio</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wider">Fecha</div>
                            <div className="text-xl font-bold text-petroleum">{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white shadow-lg border-4 border-white">
                        <Award size={40} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={onReset} variant="outline" icon={Settings}>Reiniciar Laboratorio</Button>
                <Button onClick={() => alert('¡Sigue aprendiendo con Edutechlife y Valerio!')} icon={GraduationCap}>Explorar más cursos</Button>
            </div>
        </div>
    );
};

export default function OVABuildGPT() {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [xp, setXp] = useState(0);
    const totalXp = 1000;

    const addXp = (amount) => {
        setXp(prev => Math.min(prev + amount, totalXp));
        import('../../store/ialabStore').then(m => m.useIALabStore.getState().addXp(amount));
    };

    const nextScreen = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentScreen(prev => prev + 1);
    };

    const screens = [
        <WelcomeScreen onNext={nextScreen} />,
        <IntroScreen onNext={nextScreen} addXp={addXp} />,
        <ModuleSlack onNext={nextScreen} addXp={addXp} />,
        <ModuleGoogle onNext={nextScreen} addXp={addXp} />,
        <ModuleMakeZapier onNext={nextScreen} addXp={addXp} />,
        <ActivityBuilder onNext={nextScreen} addXp={addXp} />,
        <QuizScreen onNext={nextScreen} addXp={addXp} />,
        <CertificateScreen xp={xp} onReset={() => { setCurrentScreen(0); setXp(0); }} />
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0FDFF] to-[#E0F7FA] dark:from-slate-900 dark:to-slate-800 font-sans selection:bg-corporate selection:text-white">


            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="transform scale-75 origin-left sm:scale-100 transition-transform">
                        <Logo />
                    </div>
                    {currentScreen > 0 && currentScreen < screens.length - 1 && (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-sm font-semibold text-slate-500 dark:text-slate-400">
                                Paso {currentScreen} de {screens.length - 2}
                            </div>
                            <div className="flex items-center gap-2 bg-[#F0FDFF] dark:bg-slate-700/30 px-4 py-1.5 rounded-full border border-corporate/20">
                                <Star className="text-yellow-500 fill-current" size={16} />
                                <span className="font-bold text-petroleum">{xp} XP</span>
                            </div>
                        </div>
                    )}
                </div>
                {currentScreen > 0 && (
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700/50">
                        <div
                            className="h-full bg-gradient-to-r from-corporate to-corporate-dark transition-all duration-1000 ease-out"
                            style={{ width: `${(xp / totalXp) * 100}%` }}
                        />
                    </div>
                )}
            </header>

            <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">
                {screens[currentScreen]}
            </main>

            {currentScreen > 0 && (
                <footer className="border-t border-slate-200 dark:border-slate-700 mt-12 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    <p>Laboratorio guiado por <strong className="text-corporate">Valerio</strong> — Coach de IA de Edutechlife.</p>
                </footer>
            )}
        </div>
    );
}
