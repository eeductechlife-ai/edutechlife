import { useState } from 'react';

const Consultoria = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('servicios');
    const [contactForm, setContactForm] = useState({ nombre: '', empresa: '', email: '', mensaje: '' });
    const [submitted, setSubmitted] = useState(false);

    const servicios = [
        {
            icon: 'fa-robot',
            title: 'Agentes de IA Personalizados',
            desc: 'Desarrollamos agentes de IA adaptados a los procesos específicos de tu organización.',
            features: ['Chatbots educativos', 'Asistentes virtuales', 'Automatización de tareas', 'Integración con sistemas existentes'],
            color: '#4DA8C4'
        },
        {
            icon: 'fa-chalkboard-teacher',
            title: 'Capacitación STEAM',
            desc: 'Transformamos equipos docentes con metodologías de enseñanza del siglo XXI.',
            features: ['Talleres prácticos', 'Certificaciones internas', 'Mentoría continua', 'Materiales exclusivos'],
            color: '#66CCCC'
        },
        {
            icon: 'fa-chart-line',
            title: 'Consultoría Estratégica',
            desc: 'Análisis profundo y roadmap de transformación digital para tu institución.',
            features: ['Diagnóstico inicial', 'Plan de implementación', 'KPIs y métricas', 'Seguimiento trimestral'],
            color: '#004B63'
        },
    ];

    const casosExito = [
        {
            empresa: 'Colegio San Ignacio',
            sector: 'Educación K-12',
            resultado: 'Mejora del 35% en pruebas internas',
            duracion: '6 meses',
            desc: 'Implementación de metodología VAK en 45 docentes y 1,200 estudiantes.'
        },
        {
            empresa: 'Instituto Técnico Central',
            sector: 'Educación Técnica',
            resultado: 'Certificación IBM para 200+ estudiantes',
            duracion: '12 meses',
            desc: 'Programa de formación tecnológica con proyección internacional.'
        },
        {
            empresa: 'Fundación Edúcate',
            sector: 'ONG Educativa',
            resultado: 'Automatización del 60% de procesos',
            duracion: '4 meses',
            desc: 'Agente de IA para gestión de beneficiarios y seguimiento de programas.'
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setContactForm({ nombre: '', empresa: '', email: '', mensaje: '' });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className="pillar-page">
            <header className="pillar-header">
                <button onClick={onBack} className="back-btn">
                    <i className="fa-solid fa-arrow-left" />
                    <span>Volver</span>
                </button>
                <div className="pillar-badge" style={{ background: 'linear-gradient(135deg, #66CCCC, #4DA8C4)' }}>
                    <i className="fa-solid fa-building" />
                    <span>PILAR 03</span>
                </div>
            </header>

            <div className="pillar-hero" style={{ background: 'linear-gradient(135deg, #0B2A3A 0%, #004B63 50%, #0B2A3A 100%)' }}>
                <div className="pillar-hero-content">
                    <div className="pillar-kicker">CONSULTORÍA B2B Y AUTOMATIZACIÓN</div>
                    <h1 className="pillar-title" style={{ color: 'white' }}>Transformación Digital Empresarial</h1>
                    <p className="pillar-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Agentes de IA personalizados y capacitación de alto nivel que generan 
                        productividad real desde el primer mes de implementación.
                    </p>
                    <div className="cta-buttons">
                        <button className="cta-primary">
                            <span>Solicitar Cotización</span>
                            <i className="fa-solid fa-arrow-right" />
                        </button>
                        <button className="cta-secondary">
                            <i className="fa-solid fa-play" />
                            <span>Ver Casos de Éxito</span>
                        </button>
                    </div>
                </div>
                <div className="pillar-hero-visual">
                    <div className="consulting-visual">
                        <div className="cv-card">
                            <i className="fa-solid fa-robot" />
                            <span>Agente IA</span>
                        </div>
                        <div className="cv-card">
                            <i className="fa-solid fa-users-cog" />
                            <span>Capacitación</span>
                        </div>
                        <div className="cv-card">
                            <i className="fa-solid fa-chart-pie" />
                            <span>Métricas</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pillar-tabs">
                <button className={`tab-btn ${activeTab === 'servicios' ? 'active' : ''}`} onClick={() => setActiveTab('servicios')}>
                    <i className="fa-solid fa-cubes" />
                    Servicios
                </button>
                <button className={`tab-btn ${activeTab === 'casos' ? 'active' : ''}`} onClick={() => setActiveTab('casos')}>
                    <i className="fa-solid fa-trophy" />
                    Casos de Éxito
                </button>
                <button className={`tab-btn ${activeTab === 'contacto' ? 'active' : ''}`} onClick={() => setActiveTab('contacto')}>
                    <i className="fa-solid fa-envelope" />
                    Contacto
                </button>
            </div>

            <div className="pillar-content">
                {activeTab === 'servicios' && (
                    <div className="servicios-grid">
                        {servicios.map((s, i) => (
                            <div key={i} className="servicio-card" style={{ borderTop: `4px solid ${s.color}` }}>
                                <div className="servicio-icon" style={{ background: `${s.color}15`, color: s.color }}>
                                    <i className={`fa-solid ${s.icon}`} />
                                </div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <ul className="servicio-features">
                                    {s.features.map((f, fi) => (
                                        <li key={fi}>
                                            <i className="fa-solid fa-check" style={{ color: s.color }} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'casos' && (
                    <div className="casos-section">
                        <div className="casos-header">
                            <h2>Resultados que Transforman</h2>
                            <p>Casos de éxito de organizaciones que confiaron en Edutechlife</p>
                        </div>
                        <div className="casos-grid">
                            {casosExito.map((c, i) => (
                                <div key={i} className="caso-card">
                                    <div className="caso-header">
                                        <div>
                                            <h4>{c.empresa}</h4>
                                            <span className="caso-sector">{c.sector}</span>
                                        </div>
                                        <span className="caso-duracion">{c.duracion}</span>
                                    </div>
                                    <p className="caso-desc">{c.desc}</p>
                                    <div className="caso-resultado">
                                        <i className="fa-solid fa-arrow-trend-up" />
                                        <span>{c.resultado}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'contacto' && (
                    <div className="contact-section">
                        <div className="contact-info">
                            <h2>¿Listo para Transformar tu Organización?</h2>
                            <p>Agenda una reunión con nuestro equipo de consultoría para diseñar tu plan de transformación.</p>
                            <div className="contact-methods">
                                <div className="contact-method">
                                    <i className="fa-solid fa-phone" />
                                    <span>+57 601 234 5678</span>
                                </div>
                                <div className="contact-method">
                                    <i className="fa-solid fa-envelope" />
                                    <span>consultoria@edutechlife.com</span>
                                </div>
                                <div className="contact-method">
                                    <i className="fa-solid fa-location-dot" />
                                    <span>Manizales, Colombia</span>
                                </div>
                            </div>
                        </div>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            {submitted ? (
                                <div className="success-message">
                                    <i className="fa-solid fa-check-circle" />
                                    <h3>¡Mensaje Enviado!</h3>
                                    <p>Nos pondremos en contacto contigo en menos de 24 horas.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            value={contactForm.nombre}
                                            onChange={(e) => setContactForm({...contactForm, nombre: e.target.value})}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Empresa / Institución"
                                            value={contactForm.empresa}
                                            onChange={(e) => setContactForm({...contactForm, empresa: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                        required
                                    />
                                    <textarea
                                        placeholder="¿En qué podemos ayudarte?"
                                        rows={4}
                                        value={contactForm.mensaje}
                                        onChange={(e) => setContactForm({...contactForm, mensaje: e.target.value})}
                                        required
                                    />
                                    <button type="submit" className="submit-btn">
                                        <span>Enviar Solicitud</span>
                                        <i className="fa-solid fa-paper-plane" />
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Consultoria;
