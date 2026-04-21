import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

/**
 * Componente para Paso 3: Crear un prompt desde cero
 * Interfaz avanzada para creación de prompts con asistencia de IA
 * 
 * @param {Object} props
 * @param {string} props.exercise - Caso de uso complejo generado por DeepSeek
 * @param {string} props.response - Prompt creado por el usuario
 * @param {Function} props.onResponseChange - Handler para actualizar respuesta
 */
const IALabEvaluationStep3 = ({ exercise, response, onResponseChange }) => {
    const [createdPrompt, setCreatedPrompt] = useState(response || '');
    const [characterCount, setCharacterCount] = useState(0);
    const [activeTab, setActiveTab] = useState('editor');
    const [isGenerating, setIsGenerating] = useState(false);

    // Actualizar contador de caracteres
    useEffect(() => {
        setCharacterCount(createdPrompt.length);
        onResponseChange(createdPrompt);
    }, [createdPrompt, onResponseChange]);

    // Componentes de prompt (para construcción modular)
    const promptComponents = {
        role: [
            "Eres un experto en marketing digital especializado en e-commerce",
            "Eres un consultor de IA con 10 años de experiencia",
            "Eres un copywriter senior para marcas de tecnología",
            "Eres un estratega de contenido para redes sociales",
            "Eres un especialista en UX writing para aplicaciones móviles"
        ],
        context: [
            "Trabajando para una startup de SaaS que quiere expandirse a Latinoamérica",
            "En una agencia digital que atiende a clientes del sector salud",
            "Para una marca de moda sostenible que quiere lanzar su primera colección",
            "En el departamento de innovación de un banco tradicional",
            "Como freelance para una ONG que busca aumentar su impacto social"
        ],
        objective: [
            "Crear una campaña de email marketing que aumente las aperturas en un 25%",
            "Desarrollar una estrategia de contenido para posicionar la marca como líder",
            "Generar ideas para posts virales en TikTok que alcancen 1M de vistas",
            "Diseñar un flujo de onboarding que reduzca la tasa de abandono en un 15%",
            "Escribir copy para una landing page que convierta al 3% de visitantes"
        ],
        audience: [
            "Emprendedores de 25-40 años que están empezando su negocio online",
            "Profesionales de marketing que buscan actualizar sus habilidades",
            "Jóvenes de 18-25 años interesados en sostenibilidad y moda",
            "Ejecutivos de empresas que toman decisiones de compra B2B",
            "Usuarios de apps móviles que valoran la simplicidad y eficiencia"
        ],
        requirements: [
            "Usar un tono profesional pero cercano",
            "Incluir ejemplos concretos y casos de estudio",
            "Proporcionar 3 opciones diferentes para comparar",
            "Basarse en datos y mejores prácticas de la industria",
            "Ser específico y evitar generalidades"
        ],
        format: [
            "En formato de lista con viñetas",
            "Como una guía paso a paso",
            "En una tabla comparativa",
            "Como un script conversacional",
            "En formato de presentación ejecutiva"
        ]
    };

    // Generar prompt con IA (simulación)
    const generateWithAI = async () => {
        setIsGenerating(true);
        
        // Simulación de generación con IA
        setTimeout(() => {
            const aiPrompt = `## Rol
Eres un ${promptComponents.role[Math.floor(Math.random() * promptComponents.role.length)]}

## Contexto
${promptComponents.context[Math.floor(Math.random() * promptComponents.context.length)]}

## Objetivo
${promptComponents.objective[Math.floor(Math.random() * promptComponents.objective.length)]}

## Audiencia
${promptComponents.audience[Math.floor(Math.random() * promptComponents.audience.length)]}

## Requisitos
- ${promptComponents.requirements[Math.floor(Math.random() * promptComponents.requirements.length)]}
- ${promptComponents.requirements[Math.floor(Math.random() * promptComponents.requirements.length)]}
- ${promptComponents.requirements[Math.floor(Math.random() * promptComponents.requirements.length)]}

## Formato de respuesta
${promptComponents.format[Math.floor(Math.random() * promptComponents.format.length)]}`;

            setCreatedPrompt(aiPrompt);
            setIsGenerating(false);
        }, 1500);
    };

    const addComponent = (type, component) => {
        const lines = createdPrompt.split('\n');
        let sectionIndex = -1;
        
        // Buscar sección existente
        const sections = ['## Rol', '## Contexto', '## Objetivo', '## Audiencia', '## Requisitos', '## Formato'];
        sections.forEach((section, index) => {
            if (lines.some(line => line.trim() === section)) {
                sectionIndex = index;
            }
        });

        if (sectionIndex === -1 || !lines.some(line => line.trim() === `## ${type.charAt(0).toUpperCase() + type.slice(1)}`)) {
            // Añadir nueva sección
            const newSection = `## ${type.charAt(0).toUpperCase() + type.slice(1)}\n${component}`;
            setCreatedPrompt(prev => prev ? `${prev}\n\n${newSection}` : newSection);
        } else {
            // Añadir a sección existente
            const newLines = [...lines];
            for (let i = 0; i < newLines.length; i++) {
                if (newLines[i].trim() === `## ${type.charAt(0).toUpperCase() + type.slice(1)}`) {
                    // Encontrar siguiente sección o final
                    let j = i + 1;
                    while (j < newLines.length && !newLines[j].startsWith('##')) {
                        j++;
                    }
                    newLines.splice(j, 0, component);
                    break;
                }
            }
            setCreatedPrompt(newLines.join('\n'));
        }
    };

    return (
        <div className="space-y-8">
            {/* Instrucciones */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                        <Icon name="fa-plus-circle" className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Crea un prompt desde cero</h3>
                        <p className="text-slate-400 text-sm">
                            Diseña un prompt efectivo para el caso de uso proporcionado
                        </p>
                    </div>
                </div>
            </div>

            {/* Caso de uso */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Icon name="fa-briefcase" className="text-[#00BCD4]" />
                    <h4 className="text-lg font-semibold text-white">Caso de uso</h4>
                </div>
                <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex items-start gap-3">
                        <Icon name="fa-star" className="text-[#00BCD4] mt-1" />
                        <p className="text-slate-200 leading-relaxed">
                            {exercise}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs: Editor vs Constructor */}
            <div className="border-b border-slate-700">
                <div className="flex space-x-1">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                            activeTab === 'editor'
                                ? 'bg-slate-800 text-white border-b-2 border-[#00BCD4]'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        <Icon name="fa-edit" className="mr-2" />
                        Editor Avanzado
                    </button>
                    <button
                        onClick={() => setActiveTab('constructor')}
                        className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                            activeTab === 'constructor'
                                ? 'bg-slate-800 text-white border-b-2 border-[#00BCD4]'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        <Icon name="fa-puzzle-piece" className="mr-2" />
                        Constructor Modular
                    </button>
                </div>
            </div>

            {/* Contenido según tab activo */}
            {activeTab === 'editor' ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Icon name="fa-keyboard" className="text-emerald-500" />
                            <h4 className="text-lg font-semibold text-white">Editor de Prompt</h4>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-sm ${characterCount < 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {characterCount} caracteres
                            </span>
                            <button
                                onClick={generateWithAI}
                                disabled={isGenerating}
                                className="px-4 py-2 bg-[#00BCD4]/20 text-[#00BCD4] rounded-lg hover:bg-[#00BCD4]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[#00BCD4] border-t-transparent rounded-full animate-spin"></div>
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="fa-robot" />
                                        Ayuda de IA
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <textarea
                            value={createdPrompt}
                            onChange={(e) => setCreatedPrompt(e.target.value)}
                            placeholder={`## Rol\nEres un experto en...\n\n## Contexto\nTrabajando para...\n\n## Objetivo\nCrear un...\n\n## Audiencia\nDirigido a...\n\n## Requisitos\n- Requisito 1\n- Requisito 2\n\n## Formato de respuesta\nEn formato de...`}
                            className="w-full h-80 bg-slate-900/50 border-2 border-slate-700 rounded-xl p-5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 resize-none font-mono text-sm leading-relaxed"
                            spellCheck="false"
                            autoFocus
                        />
                        
                        {/* Contador de caracteres */}
                        <div className={`absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                            characterCount < 100 ? 'bg-red-500/20 text-red-400' :
                            characterCount < 200 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                        }`}>
                            {characterCount}/1000
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Icon name="fa-cubes" className="text-[#004B63]" />
                            <h4 className="text-lg font-semibold text-white">Constructor Modular</h4>
                        </div>
                        <button
                            onClick={() => setCreatedPrompt('')}
                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <Icon name="fa-trash" className="mr-2" />
                            Limpiar todo
                        </button>
                    </div>

                    {/* Componentes modulares */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(promptComponents).map(([type, components]) => (
                            <div key={type} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#004B63]/20 flex items-center justify-center">
                                        <Icon 
                                            name={
                                                type === 'role' ? 'fa-user-tie' :
                                                type === 'context' ? 'fa-building' :
                                                type === 'objective' ? 'fa-bullseye' :
                                                type === 'audience' ? 'fa-users' :
                                                type === 'requirements' ? 'fa-list-check' :
                                                'fa-file-alt'
                                            } 
                                            className="text-[#004B63]" 
                                        />
                                    </div>
                                    <h5 className="font-semibold text-white capitalize">{type}</h5>
                                </div>
                                
                                <div className="space-y-2">
                                    {components.map((component, index) => (
                                        <button
                                            key={index}
                                            onClick={() => addComponent(type, component)}
                                            className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-800/50 rounded-lg border border-slate-700 hover:border-[#004B63]/30 transition-colors group"
                                        >
                                            <div className="flex items-start gap-2">
                                                <Icon 
                                                    name="fa-plus" 
                                                    className="text-slate-500 group-hover:text-[#004B63] mt-1 flex-shrink-0" 
                                                />
                                                <span className="text-sm text-slate-300 group-hover:text-white">
                                                    {component}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vista previa del prompt construido */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Icon name="fa-eye" className="text-emerald-500" />
                            <h4 className="text-lg font-semibold text-white">Vista previa</h4>
                        </div>
                        
                        <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                            {createdPrompt ? (
                                <pre className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                    {createdPrompt}
                                </pre>
                            ) : (
                                <div className="text-center py-8">
                                    <Icon name="fa-cube" className="text-slate-600 text-3xl mb-3" />
                                    <p className="text-slate-500">
                                        Añade componentes para construir tu prompt
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Guía de creación */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <Icon name="fa-graduation-cap" className="text-amber-500" />
                    <h4 className="text-lg font-semibold text-white">Guía para prompts efectivos</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h5 className="font-medium text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
                            Estructura recomendada
                        </h5>
                        <ol className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                                <span className="text-[#00BCD4] font-bold">1.</span>
                                <span>Comienza con el <strong>Rol</strong> específico del asistente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#00BCD4] font-bold">2.</span>
                                <span>Define el <strong>Contexto</strong> y situación</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#00BCD4] font-bold">3.</span>
                                <span>Establece el <strong>Objetivo</strong> claro y medible</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#00BCD4] font-bold">4.</span>
                                <span>Describe la <strong>Audiencia</strong> objetivo</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#00BCD4] font-bold">5.</span>
                                <span>Lista los <strong>Requisitos</strong> específicos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#00BCD4] font-bold">6.</span>
                                <span>Especifica el <strong>Formato</strong> de respuesta</span>
                            </li>
                        </ol>
                    </div>
                    
                    <div className="space-y-3">
                        <h5 className="font-medium text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            Consejos clave
                        </h5>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Sé <strong>específico</strong> en lugar de general</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Incluye <strong>ejemplos</strong> cuando sea posible</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Usa un <strong>tono</strong> apropiado para el contexto</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Define <strong>métricas</strong> de éxito claras</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Considera las <strong>limitaciones</strong> y restricciones</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IALabEvaluationStep3;