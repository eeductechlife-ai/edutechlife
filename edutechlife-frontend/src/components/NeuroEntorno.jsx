import { useState, useRef, useEffect } from 'react';
import ValerioAvatar from './ValerioAvatar';
import DiagnosticoVAK from './DiagnosticoVAK';
import { callDeepseek } from '../utils/api';

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
            <header className="pillar-header">
                <button onClick={onBack} className="back-btn">
                    <i className="fa-solid fa-arrow-left" />
                    <span>Volver</span>
                </button>
                <div className="pillar-badge">
                    <i className="fa-solid fa-brain" />
                    <span>MÓDULO 01</span>
                </div>
            </header>

            <div className="pillar-hero" style={{ background: 'linear-gradient(135deg, #004B63 0%, #0B2A3A 100%)' }}>
                <div className="pillar-hero-content">
                    <div className="pillar-kicker">NEURO-ENTORNO EDUCATIVO</div>
                    <h1 className="pillar-title" style={{ color: 'white' }}>
                        Descubre Tu Estilo de Aprendizaje
                    </h1>
                    <p className="pillar-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        IA que analiza procesos psicológicos y académicos en tiempo real. 
                        Completa el Diagnóstico VAK y recibe un plan de estudio personalizado.
                    </p>
                    <div className="pillar-stats">
                        <div className="pillar-stat">
                            <span className="pillar-stat-value" style={{ background: 'linear-gradient(135deg, #fff, #B2D8E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>6,000+</span>
                            <span className="pillar-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Estudiantes</span>
                        </div>
                        <div className="pillar-stat">
                            <span className="pillar-stat-value" style={{ background: 'linear-gradient(135deg, #fff, #B2D8E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>98%</span>
                            <span className="pillar-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Precisión</span>
                        </div>
                        <div className="pillar-stat">
                            <span className="pillar-stat-value" style={{ background: 'linear-gradient(135deg, #fff, #B2D8E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4.8/5</span>
                            <span className="pillar-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Satisfacción</span>
                        </div>
                    </div>
                </div>
                <div className="pillar-hero-visual">
                    <div className="neuro-animation">
                        <div className="neuro-circle c1" />
                        <div className="neuro-circle c2" />
                        <div className="neuro-circle c3" />
                        <div className="neuro-center">
                            <i className="fa-solid fa-brain" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pillar-tabs">
                <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                    <i className="fa-solid fa-info-circle" />
                    Información
                </button>
                <button className={`tab-btn ${activeTab === 'diagnostico' ? 'active' : ''}`} onClick={() => { setActiveTab('diagnostico'); setFullDiagnostico(true); }}>
                    <i className="fa-solid fa-brain" />
                    Diagnóstico VAK
                </button>
                <button className={`tab-btn ${activeTab === 'test' ? 'active' : ''}`} onClick={() => { setActiveTab('test'); setShowDiagnostico(true); }}>
                    <i className="fa-solid fa-clipboard-check" />
                    Diagnóstico VAK
                </button>
                <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')} disabled={!testResult}>
                    <i className="fa-solid fa-chart-pie" />
                    Mi Perfil
                </button>
                <button className={`tab-btn ${activeTab === 'testimonios' ? 'active' : ''}`} onClick={() => setActiveTab('testimonios')}>
                    <i className="fa-solid fa-comments" />
                    Testimonios
                </button>
            </div>

            <div className="pillar-content">
                {activeTab === 'diagnostico' && (
                    <DiagnosticoVAK onNavigate={onNavigate} />
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
                        
                        <div className="col-span-full bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 rounded-2xl p-8 text-center border border-[#4DA8C4]/20">
                            <h3 className="font-montserrat text-2xl font-bold text-[#004B63] mb-4">
                                ¿Qué es el método VAK?
                            </h3>
                            <p className="text-[#64748B] max-w-2xl mx-auto mb-6">
                                VAK es un modelo neuropsicológico que identifica cómo procesa información cada persona: 
                                <strong className="text-[#4DA8C4]"> Visual</strong> (imágenes), 
                                <strong className="text-[#66CCCC]"> Auditivo</strong> (sonidos) o 
                                <strong className="text-[#004B63]"> Kinestésico</strong> (experiencias).
                                Conocer tu estilo te permite estudiar de forma más eficiente.
                            </p>
                            <button 
                                onClick={() => { setActiveTab('test'); setShowDiagnostico(true); }}
                                className="px-8 py-4 rounded-full font-montserrat font-bold text-white"
                                style={{ background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)' }}
                            >
                                Comenzar Diagnóstico VAK
                                <i className="fa-solid fa-arrow-right ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'test' && (
                    <div className="vak-test-container">
                        {showDiagnostico ? (
                            <DiagnosticoVAK 
                                onNavigate={onNavigate}
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

            <div className="coach-section">
                <div className="coach-card">
                    <ValerioAvatar state={avatarState} size={64} />
                    <div className="coach-info">
                        <h3>Valerio - Coach Neuro-educativo</h3>
                        <p>Pregúntame sobre metodologías VAK y estrategias de aprendizaje</p>
                    </div>
                </div>
                <div className="coach-input-area">
                    <input
                        type="text"
                        value={coachQ}
                        onChange={(e) => setCoachQ(e.target.value)}
                        placeholder="Escribe tu pregunta sobre neuro-aprendizaje..."
                        onKeyDown={(e) => e.key === 'Enter' && askCoach()}
                    />
                    <button onClick={askCoach} disabled={coachLoad}>
                        <i className="fa-solid fa-paper-plane" />
                    </button>
                </div>
                {coachMsg && (
                    <div className="coach-response">
                        <ValerioAvatar state="speaking" size={40} />
                        <div className="response-bubble">{coachMsg}</div>
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
             `}</style>
        </div>
    );
};

export default NeuroEntorno;
