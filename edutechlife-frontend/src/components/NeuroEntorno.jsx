import { useState, useRef, useEffect } from 'react';
import ValerioAvatar from './ValerioAvatar';
import { callDeepseek } from '../utils/api';

const NeuroEntorno = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [studentAnalysis, setStudentAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisPrompt, setAnalysisPrompt] = useState('');
    const [coachMsg, setCoachMsg] = useState('');
    const [coachQ, setCoachQ] = useState('');
    const [coachLoad, setCoachLoad] = useState(false);
    const [avatarState, setAvatarState] = useState('idle');

    const analizarEstudiante = async () => {
        if (!analysisPrompt.trim()) return;
        setLoading(true);
        setAvatarState('thinking');
        const prompt = `Analiza al siguiente estudiante y proporciona un perfil de aprendizaje detallado:

${analysisPrompt}

Devuelve en JSON con esta estructura exacta:
{
  "perfil": "Visual/Auditivo/Kinestésico/Multimodal",
  "fortalezas": ["array de 3 fortalezas"],
  "areasMeora": ["array de 3 áreas de mejora"],
  "estiloAprendizaje": "descripción del estilo",
  "recomendaciones": ["array de 5 recomendaciones específicas"]
}`;
        
        const r = await callDeepseek(prompt, 'Eres un analista educativo experto en metodologías VAK y STEAM. Responde SOLO en JSON válido.', true);
        if (!r.error) {
            try {
                const data = typeof r === 'string' ? JSON.parse(r) : r;
                setStudentAnalysis(data);
                setActiveTab('perfil');
            } catch (e) {
                setStudentAnalysis({ error: 'No se pudo analizar el perfil. Intenta con más detalles.' });
            }
        }
        setLoading(false);
        setAvatarState('idle');
    };

    const askCoach = async () => {
        if (!coachQ.trim()) return;
        setCoachLoad(true);
        setAvatarState('thinking');
        const r = await callCoach(coachQ);
        setCoachMsg(r);
        setCoachLoad(false);
        setAvatarState('speaking');
        setTimeout(() => setAvatarState('idle'), 3000);
    };

    const callCoach = async (q) => {
        const prompt = `Estudiante pregunta sobre Neuro-Entorno Educativo: ${q}
Eres Valerio, mentor educativo de Edutechlife. Responde de forma empática y específica sobre análisis de perfiles de aprendizaje VAK.`;
        return await callDeepseek(prompt, 'Eres un mentor educativo experto en VAK y neuro-educación.', false);
    };

    const features = [
        { icon: 'fa-brain', title: 'Análisis VAK en Tiempo Real', desc: 'Identificación automática del estilo de aprendizaje predominante' },
        { icon: 'fa-chart-line', title: 'Métricas Neurocognitivas', desc: 'Seguimiento de progreso con indicadores neuroeducativos' },
        { icon: 'fa-wand-magic-sparkles', title: 'Contenido Adaptativo', desc: 'Materiales educativos ajustados al perfil neurológico' },
        { icon: 'fa-users', title: 'Acompañamiento Magisterial', desc: 'Docentes con maestría supervisan cada proceso' },
    ];

    const stats = [
        { value: '6,000+', label: 'Estudiantes Analizados' },
        { value: '98%', label: 'Precisión VAK' },
        { value: '4.8/5', label: 'Satisfacción' },
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
                    <span>PILAR 01</span>
                </div>
            </header>

            <div className="pillar-hero">
                <div className="pillar-hero-content">
                    <div className="pillar-kicker">NEURO-ENTORNO EDUCATIVO</div>
                    <h1 className="pillar-title">Análisis Profundo del Perfil de Aprendizaje</h1>
                    <p className="pillar-subtitle">
                        IA que analiza procesos psicológicos y académicos en tiempo real para cada estudiante.
                        Metodología VAK potenciada con herramientas de neuro-educación.
                    </p>
                    <div className="pillar-stats">
                        {stats.map((s, i) => (
                            <div key={i} className="pillar-stat">
                                <span className="pillar-stat-value">{s.value}</span>
                                <span className="pillar-stat-label">{s.label}</span>
                            </div>
                        ))}
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
                <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                    <i className="fa-solid fa-layer-group" />
                    Descripción
                </button>
                <button className={`tab-btn ${activeTab === 'analizar' ? 'active' : ''}`} onClick={() => setActiveTab('analizar')}>
                    <i className="fa-solid fa-magnifying-glass" />
                    Analizar Estudiante
                </button>
                <button className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
                    <i className="fa-solid fa-user-check" />
                    Perfil VAK
                </button>
            </div>

            <div className="pillar-content">
                {activeTab === 'overview' && (
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

                {activeTab === 'analizar' && (
                    <div className="analyzer-section">
                        <div className="analyzer-card">
                            <div className="analyzer-header">
                                <ValerioAvatar state={avatarState} size={48} />
                                <div>
                                    <h3>Asistente de Análisis VAK</h3>
                                    <p>Ingresa la información del estudiante para un análisis profundo</p>
                                </div>
                            </div>
                            <textarea
                                value={analysisPrompt}
                                onChange={(e) => setAnalysisPrompt(e.target.value)}
                                placeholder="Describe al estudiante: edad, nivel educativo, dificultades académicas, intereses, cómo aprende mejor, contexto familiar..."
                                rows={6}
                            />
                            <button onClick={analizarEstudiante} disabled={loading} className="analyze-btn">
                                {loading ? (
                                    <>
                                        <div className="loading-spinner" />
                                        <span>Analizando...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-brain" />
                                        <span>Analizar Perfil</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'perfil' && (
                    <div className="profile-section">
                        {studentAnalysis ? (
                            studentAnalysis.error ? (
                                <div className="error-message">{studentAnalysis.error}</div>
                            ) : (
                                <>
                                    <div className="profile-header">
                                        <div className="profile-type">{studentAnalysis.perfil}</div>
                                        <div className="profile-stats">
                                            <div className="profile-stat">
                                                <i className="fa-solid fa-check" />
                                                <span>{studentAnalysis.fortalezas?.[0]}</span>
                                            </div>
                                            <div className="profile-stat">
                                                <i className="fa-solid fa-check" />
                                                <span>{studentAnalysis.fortalezas?.[1]}</span>
                                            </div>
                                            <div className="profile-stat">
                                                <i className="fa-solid fa-check" />
                                                <span>{studentAnalysis.fortalezas?.[2]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="profile-grid">
                                        <div className="profile-card">
                                            <h4><i className="fa-solid fa-star" /> Fortalezas</h4>
                                            <ul>
                                                {studentAnalysis.fortalezas?.map((f, i) => <li key={i}>{f}</li>)}
                                            </ul>
                                        </div>
                                        <div className="profile-card">
                                            <h4><i className="fa-solid fa-chart-line" /> Áreas de Mejora</h4>
                                            <ul>
                                                {studentAnalysis.areasMeora?.map((a, i) => <li key={i}>{a}</li>)}
                                            </ul>
                                        </div>
                                        <div className="profile-card full">
                                            <h4><i className="fa-solid fa-lightbulb" /> Recomendaciones</h4>
                                            <ul className="recommendations">
                                                {studentAnalysis.recomendaciones?.map((r, i) => <li key={i}>{r}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            )
                        ) : (
                            <div className="empty-state">
                                <i className="fa-solid fa-user-chart" />
                                <h3>Sin análisis activo</h3>
                                <p>Ve a la pestaña "Analizar Estudiante" para generar un perfil VAK</p>
                            </div>
                        )}
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
        </div>
    );
};

export default NeuroEntorno;
