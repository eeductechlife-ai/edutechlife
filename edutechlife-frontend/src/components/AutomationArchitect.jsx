import { useState, useEffect, useRef } from 'react';
import { callDeepseek } from '../utils/api';
import AutomationArchitectureViewer from './AutomationArchitectureViewer';

const AutomationArchitect = ({ onBack, embedded = false }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [formData, setFormData] = useState({
        empresa: '',
        sector: '',
        empleados: 50,
        procesos: [],
        objetivos: '',
        presupuesto: 'medio',
        tiempo: '3-6 meses',
        industria: 'educacion'
    });
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [architectures, setArchitectures] = useState([]);
    const [selectedArchitecture, setSelectedArchitecture] = useState(null);

    const procesosOptions = [
        'Atención al cliente',
        'Facturación y cobros',
        'Gestión de inventario',
        'Procesos contables',
        'Recursos humanos',
        'Marketing y ventas',
        'Logística y envíos',
        'Análisis de datos',
        'Comunicación interna',
        'Documentación y reportes'
    ];

    const industrias = [
        { id: 'educacion', label: 'Educación' },
        { id: 'retail', label: 'Retail / Comercio' },
        { id: 'logistica', label: 'Logística / Transporte' },
        { id: 'salud', label: 'Salud / Clínicas' },
        { id: 'fintech', label: 'Fintech / Bancario' },
        { id: 'manufactura', label: 'Manufactura / Industria' },
        { id: 'servicios', label: 'Servicios Profesionales' },
        { id: 'turismo', label: 'Hotelería / Turismo' },
    ];

    const arquitecturasPredefinidas = [
        {
            id: 'basica',
            nombre: 'Arquitectura Básica',
            descripcion: 'Automatización de procesos clave con chatbots, reportes automáticos y notificaciones inteligentes.',
            componentes: ['Chatbot IA', 'Generador de reportes', 'Sistema de notificaciones', 'Integración básica CRM'],
            tiempo: '1-3 meses',
            costo: '$5-10M',
            complejidad: 'Baja',
            icono: 'fa-robot',
            color: '#4DA8C4'
        },
        {
            id: 'intermedia',
            nombre: 'Arquitectura Intermedia',
            descripcion: 'Sistema integrado con IA predictiva, dashboards analíticos y automatización de flujos multi-paso.',
            componentes: ['IA predictiva', 'Dashboard analítico', 'Sistema de recomendaciones', 'API de integración', 'Automatización de flujos'],
            tiempo: '3-6 meses',
            costo: '$15-25M',
            complejidad: 'Media',
            icono: 'fa-brain',
            color: '#66CCCC'
        },
        {
            id: 'avanzada',
            nombre: 'Arquitectura Avanzada',
            descripcion: 'Ecosistema completo con multi-agentes IA, automatización end-to-end y analítica en tiempo real.',
            componentes: ['Multi-agentes IA', 'Automatización end-to-end', 'Analítica en tiempo real', 'Integración ERP', 'Sistema de aprendizaje automático'],
            tiempo: '6-12 meses',
            costo: '$30-50M',
            complejidad: 'Alta',
            icono: 'fa-network-wired',
            color: '#004B63'
        }
    ];

    useEffect(() => {
        // Simular carga de arquitecturas predefinidas
        setArchitectures(arquitecturasPredefinidas);
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProcesoChange = (proceso) => {
        setFormData(prev => {
            const procesos = [...prev.procesos];
            if (procesos.includes(proceso)) {
                return { ...prev, procesos: procesos.filter(p => p !== proceso) };
            } else {
                return { ...prev, procesos: [...procesos, proceso] };
            }
        });
    };

    const generateAutomationPlan = async () => {
        setIsGenerating(true);
        
        const prompt = `Como arquitecto de automatización empresarial experto, genera un plan detallado para:
        
Empresa: ${formData.empresa}
Industria: ${formData.industria}
Número de empleados: ${formData.empleados}
Procesos a automatizar: ${formData.procesos.join(', ')}
Objetivos: ${formData.objetivos}
Presupuesto: ${formData.presupuesto}
Tiempo estimado: ${formData.tiempo}
Arquitectura seleccionada: ${selectedArchitecture?.nombre || 'Por definir'}

Genera un plan de automatización que incluya:
1. Arquitectura recomendada (basada en la seleccionada)
2. Fases de implementación con cronograma
3. Tecnologías y herramientas específicas
4. KPIs de éxito y métricas de ROI
5. Análisis de riesgos y mitigaciones
6. Estándares aplicables (ISO/IEC 42001, NIST AI RMF)

Formato: Título, descripción, y secciones claras con viñetas.`;

        try {
            const result = await callDeepseek(prompt, "Eres un arquitecto de automatización empresarial experto en IA, estándares internacionales y transformación digital. Genera planes detallados, prácticos y realistas.", false);
            setGeneratedPlan(result);
            setActiveStep(4);
        } catch (error) {
            console.error('Error generando plan:', error);
            setGeneratedPlan('Error al generar el plan. Por favor intenta nuevamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPlan = () => {
        const element = document.createElement('a');
        const file = new Blob([generatedPlan], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `plan-automatizacion-${formData.empresa || 'edutechlife'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const resetForm = () => {
        setFormData({
            empresa: '',
            sector: '',
            empleados: 50,
            procesos: [],
            objetivos: '',
            presupuesto: 'medio',
            tiempo: '3-6 meses',
            industria: 'educacion'
        });
        setGeneratedPlan(null);
        setSelectedArchitecture(null);
        setActiveStep(1);
    };

    return (
        <div className="automation-architect">
            {/* Header */}
            <div className="aa-header">
                <div className="aa-badge">
                    <i className="fa-solid fa-robot" />
                    <span>ARQUITECTO DE AUTOMATIZACIÓN</span>
                </div>
                <h1>Diseña tu Ecosistema de IA Empresarial</h1>
                <p>
                    Crea un plan personalizado de automatización con arquitectura, fases de implementación,
                    ROI estimado y estándares internacionales para tu empresa.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#004B63]/5 border border-[#004B63]/10 rounded-full text-[10px] font-semibold text-[#004B63]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        ISO/IEC 42001
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#4DA8C4]/5 border border-[#4DA8C4]/10 rounded-full text-[10px] font-semibold text-[#4DA8C4]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        NIST AI RMF
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#66CCCC]/5 border border-[#66CCCC]/10 rounded-full text-[10px] font-semibold text-[#66CCCC]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        ISO/IEC 23053
                    </span>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="aa-progress-steps">
                {[1, 2, 3, 4].map(step => (
                    <div key={step} className={`aa-step ${activeStep >= step ? 'active' : ''}`}>
                        <div className="aa-step-circle">
                            {step}
                        </div>
                        <span className="aa-step-label">
                            {step === 1 && 'Diagnóstico'}
                            {step === 2 && 'Arquitectura'}
                            {step === 3 && 'Personalización'}
                            {step === 4 && 'Plan'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="aa-content">
                {activeStep === 1 && (
                    <div className="aa-step-content">
                        <h2><i className="fa-solid fa-clipboard-question" /> Diagnóstico Inicial</h2>
                        <p className="aa-subtitle">Cuéntanos sobre tu empresa para diseñar la arquitectura ideal.</p>
                        <div className="aa-form-grid">
                            <div className="aa-form-group">
                                <label>Nombre de la Empresa</label>
                                <input
                                    type="text"
                                    value={formData.empresa}
                                    onChange={(e) => handleInputChange('empresa', e.target.value)}
                                    placeholder="Ej: TechCorp S.A.S"
                                />
                            </div>
                            <div className="aa-form-group">
                                <label>Industria</label>
                                <select
                                    value={formData.industria}
                                    onChange={(e) => handleInputChange('industria', e.target.value)}
                                >
                                    {industrias.map((ind) => (
                                        <option key={ind.id} value={ind.id}>{ind.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="aa-form-group">
                                <label>Número de Empleados</label>
                                <div className="aa-slider-container">
                                    <input
                                        type="range"
                                        min="10"
                                        max="500"
                                        step="10"
                                        value={formData.empleados}
                                        onChange={(e) => handleInputChange('empleados', parseInt(e.target.value))}
                                    />
                                    <span className="aa-slider-value">{formData.empleados} empleados</span>
                                </div>
                            </div>
                        </div>

                        <div className="aa-processes-section">
                            <h3>Procesos a Automatizar</h3>
                            <div className="aa-processes-grid">
                                {procesosOptions.map((proceso, index) => (
                                    <div
                                        key={index}
                                        className={`aa-process-card ${formData.procesos.includes(proceso) ? 'selected' : ''}`}
                                        onClick={() => handleProcesoChange(proceso)}
                                    >
                                        <div className="aa-process-check">
                                            {formData.procesos.includes(proceso) ? '✓' : '+'}
                                        </div>
                                        <span>{proceso}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="aa-form-group">
                            <label>Objetivos Principales</label>
                            <textarea
                                value={formData.objetivos}
                                onChange={(e) => handleInputChange('objetivos', e.target.value)}
                                placeholder="Describe tus objetivos (reducir costos, mejorar eficiencia, escalar operaciones, etc.)"
                                rows="4"
                            />
                        </div>

                        <div className="aa-actions">
                            <button 
                                className="aa-btn-primary"
                                onClick={() => setActiveStep(2)}
                                disabled={!formData.empresa || !formData.sector || formData.procesos.length === 0}
                            >
                                Siguiente: Seleccionar Arquitectura
                                <i className="fa-solid fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="aa-step-content">
                        <h2><i className="fa-solid fa-diagram-project" /> Selecciona tu Arquitectura</h2>
                        <p className="aa-subtitle">Elige una arquitectura base que se ajuste a tus necesidades</p>
                        
                        <div className="aa-architectures-grid">
                            {architectures.map((arch) => (
                                <div
                                    key={arch.id}
                                    className={`aa-architecture-card ${selectedArchitecture?.id === arch.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedArchitecture(arch)}
                                >
                                    <div className="aa-arch-header" style={{ background: arch.color }}>
                                        <i className={`fa-solid ${arch.icono}`} />
                                        <h3>{arch.nombre}</h3>
                                    </div>
                                    <div className="aa-arch-body">
                                        <p>{arch.descripcion}</p>
                                        
                                        <div className="aa-arch-metrics">
                                            <div className="aa-metric">
                                                <i className="fa-solid fa-clock" />
                                                <span>{arch.tiempo}</span>
                                            </div>
                                            <div className="aa-metric">
                                                <i className="fa-solid fa-money-bill-wave" />
                                                <span>{arch.costo}</span>
                                            </div>
                                            <div className="aa-metric">
                                                <i className="fa-solid fa-layer-group" />
                                                <span>{arch.complejidad}</span>
                                            </div>
                                        </div>

                                        <div className="aa-arch-components">
                                            <h4>Componentes Principales</h4>
                                            <ul>
                                                {arch.componentes.map((comp, idx) => (
                                                    <li key={idx}><i className="fa-solid fa-check" /> {comp}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="aa-actions">
                            <button 
                                className="aa-btn-secondary"
                                onClick={() => setActiveStep(1)}
                            >
                                <i className="fa-solid fa-arrow-left" />
                                Anterior
                            </button>
                            <button 
                                className="aa-btn-primary"
                                onClick={() => setActiveStep(3)}
                                disabled={!selectedArchitecture}
                            >
                                Siguiente: Personalizar Plan
                                <i className="fa-solid fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === 3 && (
                    <div className="aa-step-content">
                        <h2><i className="fa-solid fa-sliders" /> Personalización del Plan</h2>
                        
                        <div className="aa-customization-grid">
                            <div className="aa-custom-card">
                                <h3><i className="fa-solid fa-money-bill" /> Presupuesto</h3>
                                <div className="aa-radio-group">
                                    {['bajo', 'medio', 'alto'].map((nivel) => (
                                        <label key={nivel} className="aa-radio-label">
                                            <input
                                                type="radio"
                                                name="presupuesto"
                                                value={nivel}
                                                checked={formData.presupuesto === nivel}
                                                onChange={(e) => handleInputChange('presupuesto', e.target.value)}
                                            />
                                            <span className="aa-radio-custom"></span>
                                            <span className="aa-radio-text">{nivel.toUpperCase()}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="aa-custom-card">
                                <h3><i className="fa-solid fa-calendar" /> Tiempo Estimado</h3>
                                <div className="aa-radio-group">
                                    {['1-3 meses', '3-6 meses', '6-12 meses', '12+ meses'].map((tiempo) => (
                                        <label key={tiempo} className="aa-radio-label">
                                            <input
                                                type="radio"
                                                name="tiempo"
                                                value={tiempo}
                                                checked={formData.tiempo === tiempo}
                                                onChange={(e) => handleInputChange('tiempo', e.target.value)}
                                            />
                                            <span className="aa-radio-custom"></span>
                                            <span className="aa-radio-text">{tiempo}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="aa-summary">
                            <h3>Resumen de tu Proyecto</h3>
                            <div className="aa-summary-grid">
                                <div className="aa-summary-item">
                                    <span>Institución</span>
                                    <strong>{formData.empresa || 'No especificado'}</strong>
                                </div>
                                <div className="aa-summary-item">
                                    <span>Sector</span>
                                    <strong>{formData.sector || 'No especificado'}</strong>
                                </div>
                                <div className="aa-summary-item">
                                    <span>Empleados</span>
                                    <strong>{formData.empleados}</strong>
                                </div>
                                <div className="aa-summary-item">
                                    <span>Procesos</span>
                                    <strong>{formData.procesos.length}</strong>
                                </div>
                                <div className="aa-summary-item">
                                    <span>Arquitectura</span>
                                    <strong>{selectedArchitecture?.nombre || 'No seleccionada'}</strong>
                                </div>
                                <div className="aa-summary-item">
                                    <span>Presupuesto</span>
                                    <strong>{formData.presupuesto.toUpperCase()}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="aa-actions">
                            <button 
                                className="aa-btn-secondary"
                                onClick={() => setActiveStep(2)}
                            >
                                <i className="fa-solid fa-arrow-left" />
                                Anterior
                            </button>
                            <button 
                                className="aa-btn-primary"
                                onClick={generateAutomationPlan}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin" />
                                        Generando Plan...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-magic" />
                                        Generar Plan de Automatización
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === 4 && generatedPlan && (
                    <div className="aa-step-content">
                        <h2><i className="fa-solid fa-file-contract" /> Plan Generado</h2>
                        
                        <div className="aa-plan-header">
                            <div className="aa-plan-badge">
                                <i className="fa-solid fa-check-circle" />
                                <span>PLAN COMPLETADO</span>
                            </div>
                            <h3>Plan de Automatización para {formData.empresa}</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Industria: {industrias.find(i => i.id === formData.industria)?.label || formData.industria} — Arquitectura: {selectedArchitecture?.nombre || 'Personalizada'}
                            </p>
                        </div>

                        <div className="aa-plan-content">
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-[#004B63] mb-3"><i className="fa-solid fa-diagram-project" /> Arquitectura Visual</h4>
                                <AutomationArchitectureViewer
                                    architectures={arquitecturasPredefinidas}
                                    selectedArchitecture={selectedArchitecture}
                                />
                            </div>

                            <div className="aa-plan-card">
                                <h4><i className="fa-solid fa-robot" /> Resumen Ejecutivo</h4>
                                <div className="aa-plan-text">
                                    {generatedPlan.split('\n').map((line, idx) => (
                                        <p key={idx}>{line}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="aa-plan-actions">
                                <button 
                                    className="aa-btn-primary"
                                    onClick={downloadPlan}
                                >
                                    <i className="fa-solid fa-download" />
                                    Descargar Plan
                                </button>
                                <button 
                                    className="aa-btn-secondary"
                                    onClick={resetForm}
                                >
                                    <i className="fa-solid fa-redo" />
                                    Crear Nuevo Plan
                                </button>
                                {onBack && !embedded && (
                                    <button 
                                        className="aa-btn-ghost"
                                        onClick={onBack}
                                    >
                                        <i className="fa-solid fa-arrow-left" />
                                        Volver al Dashboard
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutomationArchitect;