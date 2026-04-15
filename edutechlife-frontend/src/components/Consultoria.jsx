import { useState, useEffect, useRef } from 'react';
import AutomationArchitect from './AutomationArchitect';
import { Icon } from '../utils/iconMapping.jsx';

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
        costoHora: 50000,
        mesesProyecto: 12,
        costoImplementacion: 15000000
    });
    const [roiResult, setRoiResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [animatedValues, setAnimatedValues] = useState(null);
    const roiRef = useRef(null);

    useEffect(() => {
        if (activeTab === 'roi' && roiRef.current) {
            roiRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeTab]);

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
        setIsCalculating(true);
        setAnimatedValues(null);
        
        const { empleados, horasAhorradas, costoHora, mesesProyecto, costoImplementacion } = roiData;
        const diasLaborales = 22;
        const ahorromensual = empleados * horasAhorradas * costoHora * diasLaborales;
        const ahorroTotal = ahorromensual * mesesProyecto;
        const gananciaNeta = ahorroTotal - costoImplementacion;
        const roi = ((gananciaNeta) / costoImplementacion) * 100;
        const payback = (costoImplementacion / ahorromensual).toFixed(1);
        const eficiencia = Math.min(100, ((ahorroTotal / costoImplementacion) * 100).toFixed(1));
        
        setTimeout(() => {
            setRoiResult({
                ahorroMensual: ahorromensual,
                ahorroTotal: ahorroTotal,
                gananciaNeta: gananciaNeta,
                roi: Math.max(0, roi).toFixed(0),
                paybackMeses: payback,
                eficiencia: eficiencia,
                inversion: costoImplementacion
            });
            setIsCalculating(false);
            animateNumbers();
        }, 1200);
    };

    const animateNumbers = () => {
        const duration = 1500;
        const startTime = Date.now();
        const targetValues = { ...roiResult };
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            
            setAnimatedValues({
                ahorroMensual: Math.round(targetValues.ahorroMensual * eased),
                gananciaNeta: Math.round(targetValues.gananciaNeta * eased),
                roi: (targetValues.roi * eased).toFixed(0)
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    };

    const handleRoiChange = (field, value) => {
        setRoiData(prev => ({ ...prev, [field]: Number(value) }));
        setRoiResult(null);
        setAnimatedValues(null);
    };

    return (
        <div className="pillar-page">
            <header className="pillar-header">
                <button onClick={onBack} className="back-btn">
                    <Icon name="fa-arrow-left" />
                    <span>Volver</span>
                </button>
                <div className="pillar-badge" style={{ background: 'linear-gradient(135deg, #66CCCC, #4DA8C4)' }}>
                    <Icon name="fa-building" />
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
                            <Icon name="fa-arrow-right" />
                        </button>
                        <button className="cta-secondary" onClick={() => setActiveTab('casos')}>
                            <Icon name="fa-play" />
                            <span>Ver Casos de Éxito</span>
                        </button>
                    </div>
                </div>
                <div className="pillar-hero-visual">
                    <div className="consulting-visual">
                        <div className="cv-card">
                            <Icon name="fa-robot" />
                            <span>Agente IA</span>
                        </div>
                        <div className="cv-card">
                            <Icon name="fa-users-cog" />
                            <span>Capacitación</span>
                        </div>
                        <div className="cv-card">
                            <Icon name="fa-chart-pie" />
                            <span>Métricas</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pillar-tabs">
                <button className={`tab-btn ${activeTab === 'servicios' ? 'active' : ''}`} onClick={() => setActiveTab('servicios')}>
                    <Icon name="fa-cubes" />
                    Servicios
                </button>
                <button className={`tab-btn ${activeTab === 'casos' ? 'active' : ''}`} onClick={() => setActiveTab('casos')}>
                    <Icon name="fa-trophy" />
                    Casos de Éxito
                </button>
                <button className={`tab-btn ${activeTab === 'contacto' ? 'active' : ''}`} onClick={() => setActiveTab('contacto')}>
                    <Icon name="fa-envelope" />
                    Contacto
                </button>
                <button className={`tab-btn ${activeTab === 'roi' ? 'active' : ''}`} onClick={() => setActiveTab('roi')}>
                    <Icon name="fa-calculator" />
                    Calculadora ROI
                </button>
                <button className={`tab-btn ${activeTab === 'ai-tools' ? 'active' : ''}`} onClick={() => setActiveTab('ai-tools')}>
                    <Icon name="fa-brain" />
                    Herramientas IA
                </button>
            </div>

            <div className="pillar-content">
                {activeTab === 'servicios' && (
                    <div className="servicios-grid">
                        {servicios.map((s, i) => (
                            <div key={i} className="servicio-card" style={{ borderTop: `4px solid ${s.color}` }}>
                                <div className="servicio-icon" style={{ background: `${s.color}15`, color: s.color }}>
                                    <Icon name={s.icon} />
                                </div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                 <div className="servicio-precio">
                                     <Icon name="fa-tag" />
                                     <span>{s.precio}</span>
                                 </div>
                                <ul className="servicio-features">
                                    {s.features.map((f, fi) => (
                                         <li key={fi}>
                                             <Icon name="fa-check" style={{ color: s.color }} />
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
                                             <Icon name={`fa-chevron-${selectedCase === i ? 'up' : 'down'}`} />
                                         </div>
                                    </div>
                                    <p className="caso-desc">{c.desc}</p>
                                     <div className="caso-resultado">
                                         <Icon name="fa-arrow-trend-up" />
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
                                <Icon name="fa-video" />
                                <div>
                                    <h3>¿Quieres ver una demo personalizada?</h3>
                                    <p>Agenda una sesión de 30 minutos con nuestro equipo</p>
                                </div>
                            </div>
                            <button className="demo-btn" onClick={handleDemoRequest}>
                                {demoRequested ? (
                                    <>
                                        <Icon name="fa-check" />
                                        ¡Solicitud Enviada!
                                    </>
                                ) : (
                                    <>
                                        <Icon name="fa-calendar" />
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
                                    <Icon name="fa-phone" />
                                    <span>+57 601 234 5678</span>
                                </div>
                                <div className="contact-method">
                                    <Icon name="fa-envelope" />
                                    <span>consultoria@edutechlife.com</span>
                                </div>
                                <div className="contact-method">
                                    <Icon name="fa-location-dot" />
                                    <span>Manizales, Colombia</span>
                                </div>
                            </div>
                            <div className="response-guarantee">
                                <Icon name="fa-shield-check" />
                                <span>Respuesta garantizada en menos de 24 horas</span>
                            </div>
                        </div>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            {submitted ? (
                                <div className="success-message">
                                    <Icon name="fa-check-circle" />
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
                                             <label htmlFor="consultoria-nombre">Nombre Completo *</label>
                                             <input
                                                 type="text"
                                                 id="consultoria-nombre"
                                                 placeholder="Ej: Juan Pérez"
                                                 value={contactForm.nombre}
                                                 onChange={(e) => setContactForm({...contactForm, nombre: e.target.value})}
                                                 className={formErrors.nombre ? 'error' : ''}
                                                 autoComplete="name"
                                             />
                                             {formErrors.nombre && <span className="field-error">{formErrors.nombre}</span>}
                                         </div>
                                         <div className="form-field">
                                             <label htmlFor="consultoria-empresa">Empresa / Institución *</label>
                                             <input
                                                 type="text"
                                                 id="consultoria-empresa"
                                                 placeholder="Ej: Colegio San Ignacio"
                                                 value={contactForm.empresa}
                                                 onChange={(e) => setContactForm({...contactForm, empresa: e.target.value})}
                                                 className={formErrors.empresa ? 'error' : ''}
                                                 autoComplete="organization"
                                             />
                                             {formErrors.empresa && <span className="field-error">{formErrors.empresa}</span>}
                                         </div>
                                    </div>
                                    <div className="form-row">
                                         <div className="form-field">
                                             <label htmlFor="consultoria-email">Correo Electrónico *</label>
                                             <input
                                                 type="email"
                                                 id="consultoria-email"
                                                 placeholder="Ej: juan@colegio.edu.co"
                                                 value={contactForm.email}
                                                 onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                                 className={formErrors.email ? 'error' : ''}
                                                 autoComplete="email"
                                             />
                                             {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                                         </div>
                                         <div className="form-field">
                                             <label htmlFor="consultoria-telefono">Teléfono *</label>
                                             <input
                                                 type="tel"
                                                 id="consultoria-telefono"
                                                 placeholder="Ej: +57 300 123 4567"
                                                 value={contactForm.telefono}
                                                 onChange={(e) => setContactForm({...contactForm, telefono: e.target.value})}
                                                 className={formErrors.telefono ? 'error' : ''}
                                                 autoComplete="tel"
                                             />
                                             {formErrors.telefono && <span className="field-error">{formErrors.telefono}</span>}
                                         </div>
                                    </div>
                                    <div className="form-row">
                                         <div className="form-field">
                                             <label htmlFor="consultoria-tamano">Tamaño de Organización</label>
                                             <select
                                                 id="consultoria-tamano"
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
                                             <label htmlFor="consultoria-servicio">Servicio de Interés *</label>
                                             <select
                                                 id="consultoria-servicio"
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
                                         <label htmlFor="consultoria-mensaje">¿En qué podemos ayudarte? *</label>
                                         <textarea
                                             id="consultoria-mensaje"
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
                                         <Icon name="fa-paper-plane" />
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                )}

                {activeTab === 'roi' && (
                    <div className="roi-neural-section" ref={roiRef}>
                        <div className="roi-neural-header">
                            <div className="neural-badge">
                                <div className="neural-pulse" />
                                <Icon name="fa-brain" />
                                <span>ROI Neural Calculator</span>
                            </div>
                            <h2>Calculadora de Retorno de Inversión</h2>
                            <p>Proyecta el impacto financiero de implementar IA en tu organización</p>
                        </div>

                        <div className="roi-neural-grid">
                            <div className="roi-neural-card inputs-card">
                                <div className="card-header">
                                     <Icon name="fa-sliders" />
                                    <h3>Parámetros</h3>
                                </div>
                                
                                <div className="roi-inputs-neural">
                                    <div className="roi-input-group">
                                        <div className="input-header">
                                            <label>
                                                 <Icon name="fa-users" />
                                                Empleados en tu organización
                                            </label>
                                            <span className="input-value">{roiData.empleados}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="5" 
                                            max="1000" 
                                            step="5"
                                            value={roiData.empleados}
                                            onChange={(e) => handleRoiChange('empleados', e.target.value)}
                                            className="neural-range"
                                        />
                                        <div className="range-labels">
                                            <span>5</span>
                                            <span>1,000+</span>
                                        </div>
                                    </div>

                                    <div className="roi-input-group">
                                        <div className="input-header">
                                            <label>
                                                <Icon name="fa-clock" />
                                                Horas ahorradas por empleado/mes
                                            </label>
                                            <span className="input-value">{roiData.horasAhorradas}h</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="15" 
                                            step="0.5"
                                            value={roiData.horasAhorradas}
                                            onChange={(e) => handleRoiChange('horasAhorradas', e.target.value)}
                                            className="neural-range"
                                        />
                                        <div className="range-labels">
                                            <span>1h</span>
                                            <span>15h</span>
                                        </div>
                                    </div>

                                    <div className="roi-input-group">
                                        <div className="input-header">
                                            <label>
                                                 <Icon name="fa-coins" />
                                                Costo promedio hora (COP)
                                            </label>
                                            <span className="input-value">${roiData.costoHora.toLocaleString()}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="15000" 
                                            max="300000" 
                                            step="5000"
                                            value={roiData.costoHora}
                                            onChange={(e) => handleRoiChange('costoHora', e.target.value)}
                                            className="neural-range"
                                        />
                                        <div className="range-labels">
                                            <span>$15K</span>
                                            <span>$300K</span>
                                        </div>
                                    </div>

                                    <div className="roi-input-group">
                                        <div className="input-header">
                                            <label>
                                        <Icon name="fa-calendar" />
                                                Duración del proyecto
                                            </label>
                                            <span className="input-value">{roiData.mesesProyecto} meses</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="3" 
                                            max="36" 
                                            step="1"
                                            value={roiData.mesesProyecto}
                                            onChange={(e) => handleRoiChange('mesesProyecto', e.target.value)}
                                            className="neural-range"
                                        />
                                        <div className="range-labels">
                                            <span>3 meses</span>
                                            <span>36 meses</span>
                                        </div>
                                    </div>

                                    <div className="roi-input-group">
                                        <div className="input-header">
                                            <label>
                                                 <Icon name="fa-rocket" />
                                                Inversión en implementación (COP)
                                            </label>
                                            <span className="input-value">${roiData.costoImplementacion.toLocaleString()}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="5000000" 
                                            max="100000000" 
                                            step="1000000"
                                            value={roiData.costoImplementacion}
                                            onChange={(e) => handleRoiChange('costoImplementacion', e.target.value)}
                                            className="neural-range"
                                        />
                                        <div className="range-labels">
                                            <span>$5M</span>
                                            <span>$100M</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    className={`calculate-btn-neural ${isCalculating ? 'calculating' : ''}`} 
                                    onClick={calculateROI}
                                    disabled={isCalculating}
                                >
                                    {isCalculating ? (
                                        <>
                                            <div className="calc-spinner" />
                                            <span>Analizando...</span>
                                        </>
                                    ) : (
                                        <>
                                             <Icon name="fa-bolt" />
                                            <span>Calcular ROI Neural</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="roi-neural-card results-card">
                                <div className="card-header">
                                    <Icon name="fa-chart-line" />
                                    <h3>Proyección Neural</h3>
                                </div>

                                {!roiResult ? (
                                    <div className="roi-placeholder">
                                        <div className="placeholder-icon">
                                            <Icon name="fa-brain" />
                                        </div>
                                        <p>Configura los parámetros y presiona "Calcular" para ver tu proyección de ROI</p>
                                        <div className="placeholder-glow" />
                                    </div>
                                ) : (
                                    <div className="roi-results-neural">
                                    <svg width="0" height="0">
                                        <defs>
                                            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#4DA8C4" />
                                                <stop offset="100%" stopColor="#66CCCC" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                        <div className="result-hero">
                                            <div className="hero-glow" />
                                            <div className="hero-content">
                                                <span className="hero-label">Ganancia Neta Proyectada</span>
                                                <span className="hero-value">
                                                    ${(animatedValues?.gananciaNeta || roiResult.gananciaNeta).toLocaleString()}
                                                </span>
                                                <span className="hero-sub">en {roiData.mesesProyecto} meses</span>
                                            </div>
                                            <div className="roi-ring">
                                                <svg viewBox="0 0 100 100">
                                                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#4DA8C4" />
                                                        <stop offset="100%" stopColor="#66CCCC" />
                                                    </linearGradient>
                                                    <circle cx="50" cy="50" r="45" className="ring-bg" />
                                                    <circle 
                                                        cx="50" 
                                                        cy="50" 
                                                        r="45" 
                                                        className="ring-progress"
                                                        strokeDasharray={`${Math.min(roiResult.eficiencia * 2.83, 283)} 283`}
                                                    />
                                                </svg>
                                                <span className="ring-value">{roiResult.roi}%</span>
                                            </div>
                                        </div>

                                        <div className="result-metrics">
                                            <div className="metric-card">
                                                <div className="metric-icon">
                                                     <Icon name="fa-arrow-trend-up" />
                                                </div>
                                                <div className="metric-info">
                                                    <span className="metric-label">Ahorro Mensual</span>
                                                    <span className="metric-value">${(animatedValues?.ahorroMensual || roiResult.ahorroMensual).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="metric-card">
                                                <div className="metric-icon">
                                                     <Icon name="fa-piggy-bank" />
                                                </div>
                                                <div className="metric-info">
                                                    <span className="metric-label">Ahorro Total</span>
                                                    <span className="metric-value">${roiResult.ahorroTotal.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="metric-card">
                                                <div className="metric-icon">
                                                    <Icon name="fa-clock" />
                                                </div>
                                                <div className="metric-info">
                                                    <span className="metric-label">Payback</span>
                                                    <span className="metric-value">{roiResult.paybackMeses} meses</span>
                                                </div>
                                            </div>

                                            <div className="metric-card">
                                                <div className="metric-icon">
                                                     <Icon name="fa-chart-pie" />
                                                </div>
                                                <div className="metric-info">
                                                    <span className="metric-label">Eficiencia</span>
                                                    <span className="metric-value">{roiResult.eficiencia}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="result-comparison">
                                            <div className="comparison-bar">
                                                <div className="bar-label">
                                                    <span>Inversión</span>
                                                    <span>${roiResult.inversion.toLocaleString()}</span>
                                                </div>
                                                <div className="bar-track">
                                                    <div 
                                                        className="bar-fill investment"
                                                        style={{ width: '40%' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="comparison-bar">
                                                <div className="bar-label">
                                                    <span>Ahorro Total</span>
                                                    <span>${roiResult.ahorroTotal.toLocaleString()}</span>
                                                </div>
                                                <div className="bar-track">
                                                    <div 
                                                        className="bar-fill savings"
                                                        style={{ width: `${Math.min((roiResult.ahorroTotal / roiResult.inversion) * 40, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="roi-disclaimer-neural">
                                    <Icon name="fa-shield-halved" />
                                    <span>Cálculos basados en promedios de la industria. Los resultados reales pueden variar. Consulta con nuestros especialistas para un análisis personalizado.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ai-tools' && (
                    <div className="ai-tools-section">
                        <div className="ai-tools-header">
                            <div className="neural-badge">
                                <Icon name="fa-brain" />
                                <span>Herramientas de Análisis IA</span>
                            </div>
                            <h2>Potencia tu Consultoría con Inteligencia Artificial</h2>
                            <p>Accede a herramientas especializadas para análisis financiero y diseño de flujos de automatización</p>
                        </div>

                        <div className="ai-tools-grid">
                            <div className="ai-tool-card" onClick={() => onNavigate('consultoria-b2b')}>
                                <div className="ai-tool-icon">
                                     <Icon name="fa-chart-line" />
                                </div>
                                <h3>Calculadora ROI Neural</h3>
                                <p>Calcula el retorno de inversión de implementaciones de IA con análisis financiero detallado</p>
                                <div className="ai-tool-features">
                                     <span><Icon name="fa-check" /> ROI Proyectado</span>
                                     <span><Icon name="fa-check" /> Ahorro Estimado</span>
                                     <span><Icon name="fa-check" /> Análisis Porcentual</span>
                                </div>
                                <div className="ai-tool-action">
                                    <span>Acceder</span>
                                    <Icon name="fa-arrow-right" />
                                </div>
                            </div>

                            <div className="ai-tool-card" onClick={() => onNavigate('consultoria-b2b')}>
                                <div className="ai-tool-icon">
                                    <Icon name="fa-sitemap" />
                                </div>
                                <h3>Arquitecto de Automatización</h3>
                                <p>Diseña workflows técnicos y sistemas de automatización paso a paso</p>
                                <div className="ai-tool-features">
                                     <span><Icon name="fa-check" /> Workflows Detallados</span>
                                     <span><Icon name="fa-check" /> Especificaciones Técnicas</span>
                                     <span><Icon name="fa-check" /> Roadmap de Implementación</span>
                                </div>
                                <div className="ai-tool-action">
                                    <span>Acceder</span>
                                    <Icon name="fa-arrow-right" />
                                </div>
                            </div>
                        </div>

                        <div className="ai-tools-cta">
                            <div className="cta-content">
                                <Icon name="fa-rocket" />
                                <div>
                                    <h3>¿Necesitas un análisis personalizado?</h3>
                                    <p>Agenda una sesión con nuestros consultores B2B para un diagnóstico específico</p>
                                </div>
                            </div>
                            <button className="cta-btn" onClick={() => setActiveTab('contacto')}>
                                <Icon name="fa-calendar" />
                                Agendar Consultoría
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'arquitecto' && (
                    <div className="automation-architect-container" style={{ marginTop: '2rem' }}>
                        <AutomationArchitect onBack={() => setActiveTab('servicios')} embedded={true} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Consultoria;
