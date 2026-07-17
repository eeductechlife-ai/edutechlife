import { useState } from 'react';
import { motion } from 'framer-motion';
import DiagnosticoVAK from '../DiagnosticoVAK/DiagnosticoVAK';
import { testimoniosVAK, features } from './neuroEntornoData';
import VAKInfoPanel from './components/VAKInfoPanel';
import VAKChatPanel from './components/VAKChatPanel';
import VAKStats from './components/VAKStats';
import './NeuroEntorno.css';

const NeuroEntorno = ({ onBack, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [testResult, setTestResult] = useState(null);
    const [showDiagnostico, setShowDiagnostico] = useState(false);
    const [fullDiagnostico, setFullDiagnostico] = useState(false);

    const handleNeuroEntornoNavigate = (view) => {
        if (view === 'neuroentorno') {
            setActiveTab('diagnostico');
            setShowDiagnostico(false);
            window.scrollTo(0, 0);
        } else if (onNavigate) {
            onNavigate(view);
        }
    };

    return (
        <div className="pillar-page">
            <VAKInfoPanel onBack={onBack} onNavigate={onNavigate} />

            <div className="pillar-tabs">
                <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                    <i className="fa-solid fa-info-circle" />
                    Información
                </button>
                <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
                    <i className="fa-solid fa-comments" />
                    Coach VAK
                </button>
                <button className={`tab-btn ${activeTab === 'testimonios' ? 'active' : ''}`} onClick={() => setActiveTab('testimonios')}>
                    <i className="fa-solid fa-comment-dots" />
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

                {activeTab === 'chat' && <VAKChatPanel />}

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

                {activeTab === 'results' && <VAKStats testResult={testResult} />}

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
                                        <img src={t.img} alt={t.nombre} loading="lazy" />
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
        </div>
    );
};

export default NeuroEntorno;
