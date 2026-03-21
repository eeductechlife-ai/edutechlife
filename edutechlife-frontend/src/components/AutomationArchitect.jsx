import { useState, useEffect, useRef } from 'react';
import { callDeepseek } from '../utils/api';

const AutomationArchitect = ({ onBack, embedded = false }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [formData, setFormData] = useState({
        empresa: '',
        sector: '',
        empleados: 50,
        procesos: [],
        objetivos: '',
        presupuesto: 'medio',
        tiempo: '3-6 meses'
    });
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [architectures, setArchitectures] = useState([]);
    const [selectedArchitecture, setSelectedArchitecture] = useState(null);

    const procesosOptions = [
        'Gestión de estudiantes',
        'Calificaciones y reportes',
        'Comunicación con padres',
        'Administración académica',
        'Gestión de recursos',
        'Planificación de clases',
        'Evaluación docente',
        'Seguimiento de proyectos',
        'Automatización de tareas repetitivas',
        'Análisis de datos educativos'
    ];

    const arquitecturasPredefinidas = [
        {
            id: 'basica',
            nombre: 'Arquitectura Básica',
            descripcion: 'Automatización de procesos simples con chatbots y reportes automáticos',
            componentes: ['Chatbot educativo', 'Generador de reportes', 'Sistema de notificaciones'],
            tiempo: '1-3 meses',
            costo: '$5-10M',
            complejidad: 'Baja',
            icono: 'fa-robot',
            color: '#4DA8C4'
        },
        {
            id: 'intermedia',
            nombre: 'Arquitectura Intermedia',
            descripcion: 'Sistema integrado con IA para análisis predictivo y personalización',
            componentes: ['IA predictiva', 'Dashboard analítico', 'Sistema de recomendaciones', 'API de integración'],
            tiempo: '3-6 meses',
            costo: '$15-25M',
            complejidad: 'Media',
            icono: 'fa-brain',
            color: '#66CCCC'
        },
        {
            id: 'avanzada',
            nombre: 'Arquitectura Avanzada',
            descripcion: 'Ecosistema completo con múltiples agentes de IA y automatización total',
            componentes: ['Multi-agentes IA', 'Automatización end-to-end', 'Analítica en tiempo real', 'Integración ERP', 'Sistema de aprendizaje'],
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
        
        const prompt = `Como arquitecto de automatización educativo, genera un plan detallado para:
        
Empresa: ${formData.empresa}
Sector: ${formData.sector}
Número de empleados: ${formData.empleados}
Procesos a automatizar: ${formData.procesos.join(', ')}
Objetivos: ${formData.objetivos}
Presupuesto: ${formData.presupuesto}
Tiempo estimado: ${formData.tiempo}

Genera un plan de automatización que incluya:
1. Arquitectura recomendada
2. Fases de implementación
3. Tecnologías específicas
4. KPIs de éxito
5. ROI estimado
6. Riesgos y mitigaciones

Formato: Título, descripción, y secciones claras.`;

        try {
            const result = await callDeepseek(prompt, "Eres un arquitecto de automatización educativo experto en IA y pedagogía. Genera planes detallados, prácticos y realistas.", false);
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
            tiempo: '3-6 meses'
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
                <h1>Diseña tu Ecosistema de IA Educativa</h1>
                <p>
                    Crea un plan personalizado de automatización con arquitectura, fases de implementación 
                    y ROI estimado para tu institución educativa.
                </p>
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
                        <div className="aa-form-grid">
                            <div className="aa-form-group">
                                <label>Nombre de la Institución</label>
                                <input
                                    type="text"
                                    value={formData.empresa}
                                    onChange={(e) => handleInputChange('empresa', e.target.value)}
                                    placeholder="Ej: Colegio San Ignacio"
                                />
                            </div>
                            <div className="aa-form-group">
                                <label>Sector Educativo</label>
                                <select
                                    value={formData.sector}
                                    onChange={(e) => handleInputChange('sector', e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="k12">Educación K-12</option>
                                    <option value="tecnica">Educación Técnica</option>
                                    <option value="superior">Educación Superior</option>
                                    <option value="corporativa">Capacitación Corporativa</option>
                                    <option value="ong">ONG Educativa</option>
                                </select>
                            </div>
                            <div className="aa-form-group">
                                <label>Número de Empleados/Docentes</label>
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
                                placeholder="Describe tus objetivos principales (reducir costos, mejorar eficiencia, personalizar aprendizaje, etc.)"
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
                        </div>

                        <div className="aa-plan-content">
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