import { useState, useEffect, useRef } from 'react';
import AutomationArchitect from './AutomationArchitect';
import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../i18n/I18nProvider';

const Consultoria = ({ onBack }) => {
    const { t } = useTranslation();
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
        if (!contactForm.nombre.trim()) errors.nombre = t('consultoria.error_name');
        if (!contactForm.empresa.trim()) errors.empresa = t('consultoria.error_company');
        if (!contactForm.email.trim()) {
            errors.email = t('consultoria.error_email');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
            errors.email = t('consultoria.error_email_invalid');
        }
        if (!contactForm.telefono.trim()) {
            errors.telefono = t('consultoria.error_phone');
        } else if (!/^[0-9+\s-]{7,15}$/.test(contactForm.telefono)) {
            errors.telefono = t('consultoria.error_phone_invalid');
        }
        if (!contactForm.servicio) errors.servicio = t('consultoria.error_service');
        if (!contactForm.mensaje.trim()) errors.mensaje = t('consultoria.error_message');
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
                    <span>{t('consultoria.back')}</span>
                </button>
                <div className="pillar-badge" style={{ background: 'linear-gradient(135deg, #66CCCC, #4DA8C4)' }}>
                    <Icon name="fa-building" />
                    <span>{t('consultoria.pilar_03')}</span>
                </div>
            </header>

            <div className="pillar-hero" style={{ background: 'linear-gradient(135deg, #0B2A3A 0%, #004B63 50%, #0B2A3A 100%)' }}>
                <div className="pillar-hero-content">
                    <div className="pillar-kicker">{t('consultoria.hero_kicker')}</div>
                    <h1 className="pillar-title" style={{ color: 'white' }}>{t('consultoria.hero_title')}</h1>
                    <p className="pillar-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('consultoria.hero_subtitle')}
                    </p>
                    <div className="cta-buttons">
                        <button className="cta-primary" onClick={() => setActiveTab('contacto')}>
                            <span>{t('consultoria.cta_quote')}</span>
                            <Icon name="fa-arrow-right" />
                        </button>
                        <button className="cta-secondary" onClick={() => setActiveTab('casos')}>
                            <Icon name="fa-play" />
                            <span>{t('consultoria.cta_cases')}</span>
                        </button>
                    </div>
                </div>
                <div className="pillar-hero-visual">
                    <div className="consulting-visual">
                        <div className="cv-card">
                            <Icon name="fa-robot" />
                            <span>{t('consultoria.visual_card_agent')}</span>
                        </div>
                        <div className="cv-card">
                            <Icon name="fa-users-cog" />
                            <span>{t('consultoria.visual_card_training')}</span>
                        </div>
                        <div className="cv-card">
                            <Icon name="fa-chart-pie" />
                            <span>{t('consultoria.visual_card_metrics')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pillar-tabs">
                <button className={`tab-btn ${activeTab === 'servicios' ? 'active' : ''}`} onClick={() => setActiveTab('servicios')}>
                    <Icon name="fa-cubes" />
                    {t('consultoria.tab_services')}
                </button>
                <button className={`tab-btn ${activeTab === 'casos' ? 'active' : ''}`} onClick={() => setActiveTab('casos')}>
                    <Icon name="fa-trophy" />
                    {t('consultoria.tab_cases')}
                </button>
                <button className={`tab-btn ${activeTab === 'contacto' ? 'active' : ''}`} onClick={() => setActiveTab('contacto')}>
                    <Icon name="fa-envelope" />
                    {t('consultoria.tab_contact')}
                </button>
                <button className={`tab-btn ${activeTab === 'roi' ? 'active' : ''}`} onClick={() => setActiveTab('roi')}>
                    <Icon name="fa-calculator" />
                    {t('consultoria.tab_roi')}
                </button>
                <button className={`tab-btn ${activeTab === 'ai-tools' ? 'active' : ''}`} onClick={() => setActiveTab('ai-tools')}>
                    <Icon name="fa-brain" />
                    {t('consultoria.tab_ai_tools')}
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
                                    {t('consultoria.service_request_info')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'casos' && (
                    <div className="casos-section">
                        <div className="casos-header">
                            <h2>{t('consultoria.cases_title')}</h2>
                            <p>{t('consultoria.cases_subtitle')}</p>
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
                                                    <span className="metric-label">{t('consultoria.cases_metric_satisfaction')}</span>
                                                </div>
                                                <div className="metric-item">
                                                    <span className="metric-value">{c.metrics.retention}%</span>
                                                    <span className="metric-label">{t('consultoria.cases_metric_retention')}</span>
                                                </div>
                                                <div className="metric-item">
                                                    <span className="metric-value">+{c.metrics.performance}%</span>
                                                    <span className="metric-label">{t('consultoria.cases_metric_performance')}</span>
                                                </div>
                                            </div>
                                            <div className="caso-services">
                                                <span className="services-label">{t('consultoria.cases_services_used')}</span>
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
                                    <h3>{t('consultoria.cases_demo_title')}</h3>
                                    <p>{t('consultoria.cases_demo_subtitle')}</p>
                                </div>
                            </div>
                            <button className="demo-btn" onClick={handleDemoRequest}>
                                {demoRequested ? (
                                    <>
                                        <Icon name="fa-check" />
                                        {t('consultoria.cases_demo_sent')}
                                    </>
                                ) : (
                                    <>
                                        <Icon name="fa-calendar" />
                                        {t('consultoria.cases_demo_btn')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'contacto' && (
                    <div className="contact-section">
                        <div className="contact-info">
                            <h2>{t('consultoria.contact_title')}</h2>
                            <p>{t('consultoria.contact_subtitle')}</p>
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
                                <span>{t('consultoria.contact_response')}</span>
                            </div>
                        </div>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            {submitted ? (
                                <div className="success-message">
                                    <Icon name="fa-check-circle" />
                                    <h3>{t('consultoria.contact_success_title')}</h3>
                                    <p>{t('consultoria.contact_success_desc')}</p>
                                    <button type="button" className="reset-form" onClick={() => { setSubmitted(false); setContactForm({ nombre: '', empresa: '', email: '', telefono: '', tamano: '', servicio: '', mensaje: '' }); setFormErrors({}); }}>
                                        {t('consultoria.contact_new_request')}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="form-row">
                                         <div className="form-field">
                                              <label htmlFor="consultoria-nombre">{t('consultoria.form_name')}</label>
                                              <input
                                                  type="text"
                                                  id="consultoria-nombre"
                                                  placeholder={t('consultoria.form_name_placeholder')}
                                                 value={contactForm.nombre}
                                                 onChange={(e) => setContactForm({...contactForm, nombre: e.target.value})}
                                                 className={formErrors.nombre ? 'error' : ''}
                                                 autoComplete="name"
                                             />
                                             {formErrors.nombre && <span className="field-error">{formErrors.nombre}</span>}
                                         </div>
                                         <div className="form-field">
                                              <label htmlFor="consultoria-empresa">{t('consultoria.form_company')}</label>
                                              <input
                                                  type="text"
                                                  id="consultoria-empresa"
                                                  placeholder={t('consultoria.form_company_placeholder')}
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
                                              <label htmlFor="consultoria-email">{t('consultoria.form_email')}</label>
                                              <input
                                                  type="email"
                                                  id="consultoria-email"
                                                  placeholder={t('consultoria.form_email_placeholder')}
                                                 value={contactForm.email}
                                                 onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                                 className={formErrors.email ? 'error' : ''}
                                                 autoComplete="email"
                                             />
                                             {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                                         </div>
                                         <div className="form-field">
                                              <label htmlFor="consultoria-telefono">{t('consultoria.form_phone')}</label>
                                              <input
                                                  type="tel"
                                                  id="consultoria-telefono"
                                                  placeholder={t('consultoria.form_phone_placeholder')}
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
                                              <label htmlFor="consultoria-tamano">{t('consultoria.form_org_size')}</label>
                                              <select
                                                  id="consultoria-tamano"
                                                  value={contactForm.tamano}
                                                  onChange={(e) => setContactForm({...contactForm, tamano: e.target.value})}
                                              >
                                                  <option value="">{t('consultoria.form_org_select')}</option>
                                                  <option value="micro">{t('consultoria.form_org_micro')}</option>
                                                  <option value="pequeña">{t('consultoria.form_org_small')}</option>
                                                  <option value="mediana">{t('consultoria.form_org_medium')}</option>
                                                  <option value="grande">{t('consultoria.form_org_large')}</option>
                                             </select>
                                         </div>
                                         <div className="form-field">
                                              <label htmlFor="consultoria-servicio">{t('consultoria.form_service')}</label>
                                              <select
                                                  id="consultoria-servicio"
                                                  value={contactForm.servicio}
                                                  onChange={(e) => setContactForm({...contactForm, servicio: e.target.value})}
                                                  className={formErrors.servicio ? 'error' : ''}
                                              >
                                                  <option value="">{t('consultoria.form_service_select')}</option>
                                                  <option value={t('consultoria.form_service_agent')}>{t('consultoria.form_service_agent')}</option>
                                                  <option value={t('consultoria.form_service_steam')}>{t('consultoria.form_service_steam')}</option>
                                                  <option value={t('consultoria.form_service_consulting')}>{t('consultoria.form_service_consulting')}</option>
                                                  <option value={t('consultoria.form_service_package')}>{t('consultoria.form_service_package')}</option>
                                             </select>
                                             {formErrors.servicio && <span className="field-error">{formErrors.servicio}</span>}
                                         </div>
                                    </div>
                                     <div className="form-field">
                                          <label htmlFor="consultoria-mensaje">{t('consultoria.form_message')}</label>
                                          <textarea
                                              id="consultoria-mensaje"
                                              placeholder={t('consultoria.form_message_placeholder')}
                                             rows={4}
                                             value={contactForm.mensaje}
                                             onChange={(e) => setContactForm({...contactForm, mensaje: e.target.value})}
                                             className={formErrors.mensaje ? 'error' : ''}
                                         />
                                         {formErrors.mensaje && <span className="field-error">{formErrors.mensaje}</span>}
                                     </div>
                                    <button type="submit" className="submit-btn">
                                        <span>{t('consultoria.form_submit')}</span>
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
                                <span>{t('consultoria.roi_badge')}</span>
                            </div>
                            <h2>{t('consultoria.roi_title')}</h2>
                            <p>{t('consultoria.roi_subtitle')}</p>
                        </div>

                        <div className="roi-neural-grid">
                            <div className="roi-neural-card inputs-card">
                                <div className="card-header">
                                     <Icon name="fa-sliders" />
                                    <h3>{t('consultoria.roi_params_title')}</h3>
                                </div>
                                
                                <div className="roi-inputs-neural">
                                    <div className="roi-input-group">
                                        <div className="input-header">
                                            <label>
                                                 <Icon name="fa-users" />
                                                {t('consultoria.roi_employees')}
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
                                                {t('consultoria.roi_hours')}
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
                                                {t('consultoria.roi_cost')}
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
                                                {t('consultoria.roi_duration')}
                                            </label>
                                            <span className="input-value">{roiData.mesesProyecto} {t('consultoria.months')}</span>
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
                                                {t('consultoria.roi_investment')}
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
                                            <span>{t('consultoria.roi_analyzing')}</span>
                                        </>
                                    ) : (
                                        <>
                                             <Icon name="fa-bolt" />
                                            <span>{t('consultoria.roi_calculate')}</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="roi-neural-card results-card">
                                <div className="card-header">
                                    <Icon name="fa-chart-line" />
                                    <h3>{t('consultoria.roi_projection')}</h3>
                                </div>

                                {!roiResult ? (
                                    <div className="roi-placeholder">
                                        <div className="placeholder-icon">
                                            <Icon name="fa-brain" />
                                        </div>
                                        <p>{t('consultoria.roi_placeholder')}</p>
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
                                                <span className="hero-label">{t('consultoria.roi_net_profit')}</span>
                                                <span className="hero-value">
                                                    ${(animatedValues?.gananciaNeta || roiResult.gananciaNeta).toLocaleString()}
                                                </span>
                                                <span className="hero-sub">{t('consultoria.roi_in_month', { months: roiData.mesesProyecto })}</span>
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
                                                    <span className="metric-label">{t('consultoria.roi_monthly_savings')}</span>
                                                    <span className="metric-value">${(animatedValues?.ahorroMensual || roiResult.ahorroMensual).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="metric-card">
                                                <div className="metric-icon">
                                                     <Icon name="fa-piggy-bank" />
                                                </div>
                                                <div className="metric-info">
                                                    <span className="metric-label">{t('consultoria.roi_total_savings')}</span>
                                                    <span className="metric-value">${roiResult.ahorroTotal.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="metric-card">
                                                <div className="metric-icon">
                                                    <Icon name="fa-clock" />
                                                </div>
                                                <div className="metric-info">
                                                    <span className="metric-label">{t('consultoria.roi_payback')}</span>
                                                    <span className="metric-value">{roiResult.paybackMeses} {t('consultoria.months')}</span>
                                                </div>
                                            </div>

                                            <div className="metric-card">
                                                <div className="metric-icon">
                                                     <Icon name="fa-chart-pie" />
                                                </div>
                                                <div className="metric-info">
                                                    <span className="metric-label">{t('consultoria.roi_efficiency')}</span>
                                                    <span className="metric-value">{roiResult.eficiencia}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="result-comparison">
                                            <div className="comparison-bar">
                                                <div className="bar-label">
                                                    <span>{t('consultoria.roi_investment_label')}</span>
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
                                                    <span>{t('consultoria.roi_savings_label')}</span>
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
                                    <span>{t('consultoria.roi_disclaimer')}</span>
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
                                <span>{t('consultoria.ai_tools_badge')}</span>
                            </div>
                            <h2>{t('consultoria.ai_tools_title')}</h2>
                            <p>{t('consultoria.ai_tools_subtitle')}</p>
                        </div>

                        <div className="ai-tools-grid">
                            <div className="ai-tool-card" onClick={() => onNavigate('consultoria-b2b')}>
                                <div className="ai-tool-icon">
                                     <Icon name="fa-chart-line" />
                                </div>
                                <h3>{t('consultoria.ai_tools_roi_title')}</h3>
                                <p>{t('consultoria.ai_tools_roi_desc')}</p>
                                <div className="ai-tool-features">
                                     <span><Icon name="fa-check" /> {t('consultoria.ai_tools_roi_feature1')}</span>
                                     <span><Icon name="fa-check" /> {t('consultoria.ai_tools_roi_feature2')}</span>
                                     <span><Icon name="fa-check" /> {t('consultoria.ai_tools_roi_feature3')}</span>
                                </div>
                                <div className="ai-tool-action">
                                    <span>{t('consultoria.ai_tools_access')}</span>
                                    <Icon name="fa-arrow-right" />
                                </div>
                            </div>

                            <div className="ai-tool-card" onClick={() => onNavigate('consultoria-b2b')}>
                                <div className="ai-tool-icon">
                                    <Icon name="fa-sitemap" />
                                </div>
                                <h3>{t('consultoria.ai_tools_architect_title')}</h3>
                                <p>{t('consultoria.ai_tools_architect_desc')}</p>
                                <div className="ai-tool-features">
                                     <span><Icon name="fa-check" /> {t('consultoria.ai_tools_architect_feature1')}</span>
                                     <span><Icon name="fa-check" /> {t('consultoria.ai_tools_architect_feature2')}</span>
                                     <span><Icon name="fa-check" /> {t('consultoria.ai_tools_architect_feature3')}</span>
                                </div>
                                <div className="ai-tool-action">
                                    <span>{t('consultoria.ai_tools_access')}</span>
                                    <Icon name="fa-arrow-right" />
                                </div>
                            </div>
                        </div>

                        <div className="ai-tools-cta">
                            <div className="cta-content">
                                <Icon name="fa-rocket" />
                                <div>
                                    <h3>{t('consultoria.ai_tools_cta_title')}</h3>
                                    <p>{t('consultoria.ai_tools_cta_desc')}</p>
                                </div>
                            </div>
                            <button className="cta-btn" onClick={() => setActiveTab('contacto')}>
                                <Icon name="fa-calendar" />
                                {t('consultoria.ai_tools_cta_btn')}
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
