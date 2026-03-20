import { useState } from 'react';

const Consultoria = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('servicios');
    const [contactForm, setContactForm] = useState({ 
        nombre: '', 
        empresa: '', 
        email: '', 
        telefono: '',
        tamano: '',
        servicio: '',
        mensaje: '' 
    });
    const [submitted, setSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [selectedCase, setSelectedCase] = useState(null);
    const [demoRequested, setDemoRequested] = useState(false);
    const [roiData, setRoiData] = useState({
        empleados: 50,
        horasAhorradas: 2,
        costoHora: 50000
    });
    const [roiResult, setRoiResult] = useState(null);

    const servicios = [
        {
            icon: 'fa-robot',
            title: 'Agentes de IA Personalizados',
            desc: 'Desarrollamos agentes de IA adaptados a los procesos específicos de tu organización.',
            features: ['Chatbots educativos', 'Asistentes virtuales', 'Automatización de tareas', 'Integración con sistemas existentes'],
            color: '#4DA8C4',
            precio: 'Desde $5.000.000/mes'
        },
        {
            icon: 'fa-chalkboard-teacher',
            title: 'Capacitación STEAM',
            desc: 'Transformamos equipos docentes con metodologías de enseñanza del siglo XXI.',
            features: ['Talleres prácticos', 'Certificaciones internas', 'Mentoría continua', 'Materiales exclusivos'],
            color: '#66CCCC',
            precio: 'Desde $2.500.000/mes'
        },
        {
            icon: 'fa-chart-line',
            title: 'Consultoría Estratégica',
            desc: 'Análisis profundo y roadmap de transformación digital para tu institución.',
            features: ['Diagnóstico inicial', 'Plan de implementación', 'KPIs y métricas', 'Seguimiento trimestral'],
            color: '#004B63',
            precio: 'Desde $8.000.000/proyecto'
        },
    ];

    const casosExito = [
        {
            empresa: 'Colegio San Ignacio',
            sector: 'Educación K-12',
            resultado: 'Mejora del 35% en pruebas internas',
            duracion: '6 meses',
            desc: 'Implementación de metodología VAK en 45 docentes y 1,200 estudiantes.',
            metrics: { satisfaction: 98, retention: 92, performance: 35 },
            services: ['Capacitación STEAM', 'Consultoría Estratégica']
        },
        {
            empresa: 'Instituto Técnico Central',
            sector: 'Educación Técnica',
            resultado: 'Certificación IBM para 200+ estudiantes',
            duracion: '12 meses',
            desc: 'Programa de formación tecnológica con proyección internacional.',
            metrics: { satisfaction: 95, retention: 88, performance: 45 },
            services: ['Agentes de IA', 'Capacitación STEAM']
        },
        {
            empresa: 'Fundación Edúcate',
            sector: 'ONG Educativa',
            resultado: 'Automatización del 60% de procesos',
            duracion: '4 meses',
            desc: 'Agente de IA para gestión de beneficiarios y seguimiento de programas.',
            metrics: { satisfaction: 99, retention: 95, performance: 60 },
            services: ['Agentes de IA']
        },
        {
            empresa: 'Corporación Educativa Regional',
            sector: 'Educación Superior',
            resultado: 'Reducción del 40% en tiempo administrativo',
            duracion: '8 meses',
            desc: 'Implementación de dashboard de métricas y automatización de reportes.',
            metrics: { satisfaction: 94, retention: 91, performance: 40 },
            services: ['Consultoría Estratégica', 'Agentes de IA']
        },
    ];

    const validateForm = () => {
        const errors = {};
        if (!contactForm.nombre.trim()) errors.nombre = 'El nombre es requerido';
        if (!contactForm.empresa.trim()) errors.empresa = 'La empresa es requerida';
        if (!contactForm.email.trim()) {
            errors.email = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
            errors.email = 'Correo inválido';
        }
        if (!contactForm.telefono.trim()) {
            errors.telefono = 'El teléfono es requerido';
        } else if (!/^[0-9+\s-]{7,15}$/.test(contactForm.telefono)) {
            errors.telefono = 'Teléfono inválido';
        }
        if (!contactForm.servicio) errors.servicio = 'Selecciona un servicio';
        if (!contactForm.mensaje.trim()) errors.mensaje = 'El mensaje es requerido';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setSubmitted(true);
    };

    const handleDemoRequest = () => {
        setDemoRequested(true);
        setTimeout(() => setDemoRequested(false), 3000);
    };

    const calculateROI = () => {
        const { empleados, horasAhorradas, costoHora } = roiData;
        const ahorromensual = empleados * horasAhorradas * costoHora * 20;
        const aohorroAnual = ahorromensual * 12;
        const inversion = 15000000;
        const roi = ((aohorroAnual - inversion) / inversion) * 100;
        const payback = (inversion / ahorromensual).toFixed(1);
        
        setRoiResult({
            ahorroMensual: ahorromensual,
            ahorroAnual: aohorroAnual,
            roi: roi.toFixed(0),
            paybackMeses: payback
        });
    };

    const handleRoiChange = (field, value) => {
        setRoiData(prev => ({ ...prev, [field]: Number(value) }));
        setRoiResult(null);
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
                        <button className="cta-primary" onClick={() => setActiveTab('contacto')}>
                            <span>Solicitar Cotización</span>
                            <i className="fa-solid fa-arrow-right" />
                        </button>
                        <button className="cta-secondary" onClick={() => setActiveTab('casos')}>
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
                <button className={`tab-btn ${activeTab === 'roi' ? 'active' : ''}`} onClick={() => setActiveTab('roi')}>
                    <i className="fa-solid fa-calculator" />
                    Calculadora ROI
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
                                <div className="servicio-precio">
                                    <i className="fa-solid fa-tag" />
                                    <span>{s.precio}</span>
                                </div>
                                <ul className="servicio-features">
                                    {s.features.map((f, fi) => (
                                        <li key={fi}>
                                            <i className="fa-solid fa-check" style={{ color: s.color }} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="servicio-cta" onClick={() => { setContactForm(prev => ({...prev, servicio: s.title})); setActiveTab('contacto'); }}>
                                    Solicitar Información
                                </button>
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
                                <div key={i} className="caso-card caso-expandable" onClick={() => setSelectedCase(selectedCase === i ? null : i)}>
                                    <div className="caso-header">
                                        <div>
                                            <h4>{c.empresa}</h4>
                                            <span className="caso-sector">{c.sector}</span>
                                        </div>
                                        <div className="caso-meta">
                                            <span className="caso-duracion">{c.duracion}</span>
                                            <i className={`fa-solid fa-chevron-${selectedCase === i ? 'up' : 'down'}`} />
                                        </div>
                                    </div>
                                    <p className="caso-desc">{c.desc}</p>
                                    <div className="caso-resultado">
                                        <i className="fa-solid fa-arrow-trend-up" />
                                        <span>{c.resultado}</span>
                                    </div>
                                    {selectedCase === i && (
                                        <div className="caso-expanded">
                                            <div className="caso-metrics">
                                                <div className="metric-item">
                                                    <span className="metric-value">{c.metrics.satisfaction}%</span>
                                                    <span className="metric-label">Satisfacción</span>
                                                </div>
                                                <div className="metric-item">
                                                    <span className="metric-value">{c.metrics.retention}%</span>
                                                    <span className="metric-label">Retención</span>
                                                </div>
                                                <div className="metric-item">
                                                    <span className="metric-value">+{c.metrics.performance}%</span>
                                                    <span className="metric-label">Rendimiento</span>
                                                </div>
                                            </div>
                                            <div className="caso-services">
                                                <span className="services-label">Servicios utilizados:</span>
                                                <div className="services-tags">
                                                    {c.services.map((svc, si) => (
                                                        <span key={si} className="service-tag">{svc}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="demo-cta">
                            <div className="demo-content">
                                <i className="fa-solid fa-video" />
                                <div>
                                    <h3>¿Quieres ver una demo personalizada?</h3>
                                    <p>Agenda una sesión de 30 minutos con nuestro equipo</p>
                                </div>
                            </div>
                            <button className="demo-btn" onClick={handleDemoRequest}>
                                {demoRequested ? (
                                    <>
                                        <i className="fa-solid fa-check" />
                                        ¡Solicitud Enviada!
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-calendar" />
                                        Agendar Demo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'contacto' && (
                    <div className="contact-section">
                        <div className="contact-info">
                            <h2>¿Listo para Transformar tu Organización?</h2>
                            <p>Completa el formulario y nos pondremos en contacto en menos de 24 horas.</p>
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
                            <div className="response-guarantee">
                                <i className="fa-solid fa-shield-check" />
                                <span>Respuesta garantizada en menos de 24 horas</span>
                            </div>
                        </div>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            {submitted ? (
                                <div className="success-message">
                                    <i className="fa-solid fa-check-circle" />
                                    <h3>¡Solicitud Enviada!</h3>
                                    <p>Uno de nuestros consultores se pondrá en contacto contigo en menos de 24 horas.</p>
                                    <button type="button" className="reset-form" onClick={() => { setSubmitted(false); setContactForm({ nombre: '', empresa: '', email: '', telefono: '', tamano: '', servicio: '', mensaje: '' }); setFormErrors({}); }}>
                                        Enviar otra solicitud
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Nombre Completo *</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Juan Pérez"
                                                value={contactForm.nombre}
                                                onChange={(e) => setContactForm({...contactForm, nombre: e.target.value})}
                                                className={formErrors.nombre ? 'error' : ''}
                                            />
                                            {formErrors.nombre && <span className="field-error">{formErrors.nombre}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label>Empresa / Institución *</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Colegio San Ignacio"
                                                value={contactForm.empresa}
                                                onChange={(e) => setContactForm({...contactForm, empresa: e.target.value})}
                                                className={formErrors.empresa ? 'error' : ''}
                                            />
                                            {formErrors.empresa && <span className="field-error">{formErrors.empresa}</span>}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Correo Electrónico *</label>
                                            <input
                                                type="email"
                                                placeholder="Ej: juan@colegio.edu.co"
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                                className={formErrors.email ? 'error' : ''}
                                            />
                                            {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label>Teléfono *</label>
                                            <input
                                                type="tel"
                                                placeholder="Ej: +57 300 123 4567"
                                                value={contactForm.telefono}
                                                onChange={(e) => setContactForm({...contactForm, telefono: e.target.value})}
                                                className={formErrors.telefono ? 'error' : ''}
                                            />
                                            {formErrors.telefono && <span className="field-error">{formErrors.telefono}</span>}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Tamaño de Organización</label>
                                            <select
                                                value={contactForm.tamano}
                                                onChange={(e) => setContactForm({...contactForm, tamano: e.target.value})}
                                            >
                                                <option value="">Selecciona...</option>
                                                <option value="micro">Micro (1-10 empleados)</option>
                                                <option value="pequeña">Pequeña (11-50 empleados)</option>
                                                <option value="mediana">Mediana (51-200 empleados)</option>
                                                <option value="grande">Grande (201+ empleados)</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Servicio de Interés *</label>
                                            <select
                                                value={contactForm.servicio}
                                                onChange={(e) => setContactForm({...contactForm, servicio: e.target.value})}
                                                className={formErrors.servicio ? 'error' : ''}
                                            >
                                                <option value="">Selecciona...</option>
                                                <option value="Agentes de IA Personalizados">Agentes de IA Personalizados</option>
                                                <option value="Capacitación STEAM">Capacitación STEAM</option>
                                                <option value="Consultoría Estratégica">Consultoría Estratégica</option>
                                                <option value="Paquete Completo">Paquete Completo</option>
                                            </select>
                                            {formErrors.servicio && <span className="field-error">{formErrors.servicio}</span>}
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>¿En qué podemos ayudarte? *</label>
                                        <textarea
                                            placeholder="Cuéntanos sobre tu organización y qué objetivos quieres alcanzar..."
                                            rows={4}
                                            value={contactForm.mensaje}
                                            onChange={(e) => setContactForm({...contactForm, mensaje: e.target.value})}
                                            className={formErrors.mensaje ? 'error' : ''}
                                        />
                                        {formErrors.mensaje && <span className="field-error">{formErrors.mensaje}</span>}
                                    </div>
                                    <button type="submit" className="submit-btn">
                                        <span>Enviar Solicitud</span>
                                        <i className="fa-solid fa-paper-plane" />
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                )}

                {activeTab === 'roi' && (
                    <div className="roi-section">
                        <div className="roi-header">
                            <i className="fa-solid fa-calculator" />
                            <h2>Calculadora de ROI</h2>
                            <p>Estima el retorno de inversión de implementar soluciones de IA en tu organización</p>
                        </div>
                        <div className="roi-calculator">
                            <div className="roi-inputs">
                                <div className="roi-field">
                                    <label>Número de empleados</label>
                                    <input 
                                        type="range" 
                                        min="10" 
                                        max="500" 
                                        step="10"
                                        value={roiData.empleados}
                                        onChange={(e) => handleRoiChange('empleados', e.target.value)}
                                    />
                                    <span className="roi-value">{roiData.empleados}</span>
                                </div>
                                <div className="roi-field">
                                    <label>Horas ahorradas por empleado/mes</label>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="8" 
                                        step="0.5"
                                        value={roiData.horasAhorradas}
                                        onChange={(e) => handleRoiChange('horasAhorradas', e.target.value)}
                                    />
                                    <span className="roi-value">{roiData.horasAhorradas}h</span>
                                </div>
                                <div className="roi-field">
                                    <label>Costo promedio por hora (COP)</label>
                                    <input 
                                        type="range" 
                                        min="20000" 
                                        max="200000" 
                                        step="10000"
                                        value={roiData.costoHora}
                                        onChange={(e) => handleRoiChange('costoHora', e.target.value)}
                                    />
                                    <span className="roi-value">${roiData.costoHora.toLocaleString()}</span>
                                </div>
                                <button className="calculate-btn" onClick={calculateROI}>
                                    <i className="fa-solid fa-calculator" />
                                    Calcular ROI
                                </button>
                            </div>
                            {roiResult && (
                                <div className="roi-results">
                                    <div className="roi-result-card primary">
                                        <span className="result-label">Ahorro Mensual</span>
                                        <span className="result-value">${roiResult.ahorroMensual.toLocaleString()}</span>
                                    </div>
                                    <div className="roi-result-card">
                                        <span className="result-label">Ahorro Anual</span>
                                        <span className="result-value secondary">${roiResult.ahorroAnual.toLocaleString()}</span>
                                    </div>
                                    <div className="roi-result-card">
                                        <span className="result-label">ROI Estimado</span>
                                        <span className="result-value highlight">{roiResult.roi}%</span>
                                    </div>
                                    <div className="roi-result-card">
                                        <span className="result-label">Payback</span>
                                        <span className="result-value">{roiResult.paybackMeses} meses</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="roi-disclaimer">
                            <i className="fa-solid fa-info-circle" />
                            <span>Esta calculadora proporciona estimaciones basadas en promedios de la industria. Los resultados reales pueden variar según las características específicas de tu organización.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Consultoria;
