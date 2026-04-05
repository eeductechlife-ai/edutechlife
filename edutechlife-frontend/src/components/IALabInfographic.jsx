import React from 'react';

const IALabInfographic = ({ module, type = 'module' }) => {
    const corporateColors = {
        petroleum: '#2D7A94',
        corporateBlue: '#4DA8C4',
        mint: '#66CCCC',
        softBlue: '#B2D8E5',
        darkBlue: '#004B63',
        gold: '#FFD166',
        orange: '#FF8E53'
    };

    const getModuleColor = (moduleId) => {
        const colors = [
            corporateColors.corporateBlue, // Module 1
            corporateColors.mint,          // Module 2
            corporateColors.softBlue,      // Module 3
            corporateColors.darkBlue,      // Module 4
            corporateColors.gold           // Module 5
        ];
        return colors[moduleId - 1] || corporateColors.corporateBlue;
    };

    const renderModuleInfographic = () => {
        const moduleColor = getModuleColor(module.id);
        
        return (
            <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="relative h-48 bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
                    <div className="absolute inset-0 bg-opacity-20" style={{ backgroundColor: moduleColor }}></div>
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-20" style={{ backgroundColor: moduleColor }}></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full -ml-32 -mb-32 opacity-20" style={{ backgroundColor: moduleColor }}></div>
                    
                    <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg" style={{ backgroundColor: moduleColor }}>
                                <i className={`fas ${module.icon}`}></i>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2 font-montserrat">Módulo {module.id}</h1>
                                <h2 className="text-3xl font-bold text-white font-montserrat">{module.title}</h2>
                            </div>
                        </div>
                        <p className="text-gray-200 text-lg max-w-2xl">{module.desc}</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Left Column - Key Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold mb-4 text-gray-800 font-montserrat" style={{ color: moduleColor }}>Información Clave</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Duración:</span>
                                        <span className="font-bold text-gray-800">{module.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Nivel:</span>
                                        <span className="font-bold text-gray-800">{module.level}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Videos:</span>
                                        <span className="font-bold text-gray-800">{module.videos}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Proyectos:</span>
                                        <span className="font-bold text-gray-800">{module.projects}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold mb-4 text-gray-800 font-montserrat" style={{ color: moduleColor }}>Estilo de Aprendizaje</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">Visual</span>
                                            <span className="text-sm font-bold" style={{ color: moduleColor }}>40%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: '40%', backgroundColor: corporateColors.corporateBlue }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">Auditivo</span>
                                            <span className="text-sm font-bold" style={{ color: moduleColor }}>35%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: '35%', backgroundColor: corporateColors.mint }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">Kinestésico</span>
                                            <span className="text-sm font-bold" style={{ color: moduleColor }}>25%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: '25%', backgroundColor: corporateColors.softBlue }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Column - Topics */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 font-montserrat" style={{ color: moduleColor }}>Temas Principales</h3>
                            <div className="space-y-4">
                                {module.topics.map((topic, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1 flex-shrink-0" style={{ backgroundColor: moduleColor }}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-1">{topic}</h4>
                                            <p className="text-gray-600 text-sm">
                                                {getTopicDescription(topic, module.id)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Challenge & Resources */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold mb-4 text-gray-800 font-montserrat" style={{ color: moduleColor }}>Desafío Final</h3>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-700 italic">"{module.challenge}"</p>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-sm text-blue-700">
                                        <i className="fas fa-lightbulb mr-2"></i>
                                        Este desafío integra todos los conceptos aprendidos en el módulo
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold mb-4 text-gray-800 font-montserrat" style={{ color: moduleColor }}>Recursos</h3>
                                <div className="space-y-3">
                                    {module.resources.map((resource, index) => (
                                        <a 
                                            key={index}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                                        >
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: moduleColor, opacity: 0.8 }}>
                                                <i className="fas fa-external-link-alt text-white text-sm"></i>
                                            </div>
                                            <span className="text-gray-700 hover:text-gray-900">{resource.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Materials Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 font-montserrat" style={{ color: moduleColor }}>Materiales Descargables</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {module.materials.map((material, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: moduleColor, opacity: 0.9 }}>
                                            <i className={`fas fa-file-${material.type === 'pdf' ? 'pdf' : material.type === 'md' ? 'file-alt' : material.type === 'json' ? 'code' : 'download'} text-white`}></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{material.name}</h4>
                                            <p className="text-xs text-gray-500">{material.type.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                                    <button className="w-full py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90" style={{ backgroundColor: moduleColor, color: 'white' }}>
                                        <i className="fas fa-download mr-2"></i>
                                        Descargar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: corporateColors.petroleum }}></div>
                                    <span className="text-gray-700 font-medium">EdutechLife</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">IALab - Inteligencia Artificial Aplicada</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                <p>© {new Date().getFullYear()} EdutechLife. Todos los derechos reservados.</p>
                                <p className="mt-1">Diseñado con la paleta corporativa de EdutechLife</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getTopicDescription = (topic, moduleId) => {
        const descriptions = {
            1: {
                'Mastery Framework': 'Estructura sistemática para dominar cualquier técnica de IA',
                'Contexto Dinámico': 'Adaptación del contexto según el objetivo del prompt',
                'Zero-Shot Prompting': 'Técnicas sin ejemplos previos para respuestas inmediatas',
                'Chain-of-Thought': 'Razonamiento paso a paso para problemas complejos'
            },
            2: {
                'Análisis Predictivo': 'Uso de ChatGPT para predecir tendencias y resultados',
                'GPTs Personalizados': 'Creación de asistentes especializados para tareas específicas',
                'Function Calling': 'Integración de funciones externas en conversaciones',
                'System Prompts': 'Configuración del comportamiento base del modelo'
            },
            3: {
                'Razonamiento Multimodal': 'Análisis combinado de texto, imágenes y datos',
                'Grounding Real-Time': 'Validación de información con fuentes en tiempo real',
                'Deep Research': 'Investigación exhaustiva con múltiples fuentes',
                'Fact-Checking IA': 'Verificación automática de hechos y datos'
            },
            4: {
                'Curaduría de Fuentes': 'Selección y organización de documentos relevantes',
                'Síntesis de Conocimiento': 'Resumen y conexión de ideas complejas',
                'Audio Overviews': 'Creación de resúmenes auditivos de documentos',
                'Gestión Documental': 'Organización eficiente de bibliotecas digitales'
            },
            5: {
                'Integración Total': 'Combinación de todas las técnicas aprendidas',
                'MVP Inteligente': 'Desarrollo de producto mínimo viable con IA',
                'Pitch Deck IA': 'Presentación automatizada para inversores',
                'Roadmap Estratégico': 'Planificación a largo plazo con análisis predictivo'
            }
        };

        return descriptions[moduleId]?.[topic] || 'Técnica avanzada de inteligencia artificial';
    };

    return renderModuleInfographic();
};

export default IALabInfographic;