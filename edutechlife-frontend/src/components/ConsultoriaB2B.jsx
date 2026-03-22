import { useState, useRef } from 'react';
import AIPanel from './AIPanel';
import html2pdf from 'html2pdf.js';

const ConsultoriaB2B = ({ onBack }) => {
    const [activeTool, setActiveTool] = useState('roi');
    const [roiResult, setRoiResult] = useState(null);
    
    const roiSystemPrompt = `Eres un CONSULTOR FINANCIERO EXPERTO en optimización de procesos empresariales con IA. Tienes 15+ años de experiencia en análisis financiero, ROI, reducción de costos operativos y transformación digital. Tu especialidad es calcular y proyectar el retorno de inversión (ROI) de implementaciones de IA en organizaciones educativas y empresariales.

COMPETENCIAS:
- Cálculo de ROI con metodología comprobada
- Análisis de ahorro de tiempo y costos
- Proyecciones financieras a 3, 6 y 12 meses
- Benchmarking con casos de éxito reales
- Recomendaciones de inversión optimas

FORMATO DE RESPUESTA:
Cuando el usuario proporcione datos de su organización (empleados, procesos, presupuesto), genera un informe que incluya:

1. **RESUMEN EJECUTIVO FINANCIERO**
   - Inversión estimada recomendada
   - ROI proyectado (en %)
   - Tiempo de recuperación (payback period)
   - Ahorro anual estimado en COP

2. **ANÁLISIS CUANTITATIVO**
   - Porcentaje de automatización alcanzable
   - Horas-hombre ahorradas por mes
   - Costo por hora optimizado
   - Eficiencia operativa mejorada (%)

3. **PROYECCIÓN DE AHORRO**
   - Ahorro mensual estimado
   - Ahorro trimestral
   - Ahorro anual
   - Ahorro a 3 años

4. **RECOMENDACIONES DE INVERSIÓN**
   - Plan de fases recomendado
   - Inversión por fase
   - Priorización de procesos a automatizar
   - ROI esperado por fase

5. **CASOS DE REFERENCIA**
   - Menciona 2-3 casos similares con resultados reales

Sé preciso con los números, usa metodología financiera estándar, y proporciona datos que el cliente pueda presentar a su junta directiva.`;

    const automationSystemPrompt = `Eres un INGENIERO DE SISTEMAS ESPECIALIZADO en diseño de workflows y automatización de procesos con IA. Tienes experiencia en arquitectura de sistemas, integración de APIs, diseño de pipelines de datos, y orquestación de agentes de IA. Tu especialidad es crear flujos de trabajo (workflows) detallados y técnicos para implementar soluciones de automatización.

COMPETENCIAS:
- Diseño de arquitectura de sistemas
- Diagramación de flujos de trabajo
- Especificación técnica de componentes
- Integración de servicios y APIs
- Definición de KPIs técnicos
- Documentación de implementación paso a paso

FORMATO DE RESPUESTA:
Cuando el usuario describa sus procesos o necesidades de automatización, genera un plan técnico que incluya:

1. **ARQUITECTURA DEL SISTEMA**
   - Diagrama de componentes (descríbelo en texto estructurado)
   - Stack tecnológico recomendado
   - Capas de la arquitectura (presentación, lógica, datos)
   - Servicios externos a integrar

2. **FLUJO DE TRABAJO (WORKFLOW)**
   - Secuencia de pasos numerados
     Paso 1: [Nombre] → [Acción] → [Resultado]
   - Puntos de decisión del flujo
   - Manejo de excepciones y errores
   - Triggers y eventos del sistema

3. **ESPECIFICACIONES TÉCNICAS**
   - Endpoints de API necesarios
   - Modelos de datos (esquemas)
   - Autenticación y permisos
   - Requisitos de infraestructura
   - Consideraciones de seguridad

4. **ROADMAP DE IMPLEMENTACIÓN**
   Fase 1 (Semanas 1-4): [Descripción]
   Fase 2 (Semanas 5-8): [Descripción]
   Fase 3 (Semanas 9-12): [Descripción]
   
5. **KPIs TÉCNICOS**
   - Tiempo de respuesta del sistema
   - Disponibilidad (% uptime)
   - Número de transacciones/hora
   - Tasa de error aceptable

6. **REQUERIMIENTOS NO FUNCIONALES**
   - Escalabilidad
   - Performance
   - Backup y recuperación
   - Monitoreo y logging

Sé muy técnico y detallado. Tu respuesta debe poder ser entregada a un equipo de desarrollo para su implementación.`;

    const handleDownloadPDF = (content, title, type) => {
        const container = document.createElement('div');
        container.style.padding = '40px';
        container.style.fontFamily = "'Montserrat', 'Open Sans', Arial, sans-serif";
        container.style.color = '#1a1a2e';
        container.style.background = '#ffffff';
        container.style.minHeight = '297mm';
        
        container.innerHTML = `
            <div style="border-bottom: 4px solid #004B63; padding-bottom: 25px; margin-bottom: 30px; background: linear-gradient(135deg, #004B63 0%, #4DA8C4 100%); padding: 30px; margin: -40px -40px 30px -40px; border-radius: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="width: 70px; height: 70px; background: white; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            🎓
                        </div>
                        <div>
                            <h1 style="font-family: 'Montserrat', Arial, sans-serif; font-size: 28px; font-weight: 900; margin: 0; color: white; letter-spacing: -0.02em;">EDUTECHLIFE</h1>
                            <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.8); margin: 5px 0 0 0; letter-spacing: 0.15em; text-transform: uppercase;">Consultoría B2B - Plataforma Premium</p>
                        </div>
                    </div>
                    <div style="text-align: right; color: white;">
                        <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 12px; margin: 0; opacity: 0.9;">Documento Oficial</p>
                        <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 11px; margin: 5px 0 0 0; opacity: 0.7;">${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="font-family: 'Montserrat', Arial, sans-serif; font-size: 24px; font-weight: 800; color: #004B63; margin: 0 0 10px 0; padding-bottom: 10px; border-bottom: 2px solid #4DA8C4;">
                    ${title}
                </h2>
                <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 13px; color: #666; margin: 0;">
                    Análisis generado por IA para Consultoría B2B Edutechlife
                </p>
            </div>
            
            <div style="line-height: 1.8; font-size: 13px; color: #333; white-space: pre-wrap; font-family: 'Open Sans', Arial, sans-serif;">
                ${content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}
            </div>
            
            <div style="margin-top: 50px; padding: 25px; background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); border-radius: 15px; border-left: 5px solid #004B63;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="width: 40px; height: 40px; background: #004B63; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">✓</div>
                    <div>
                        <p style="font-family: 'Montserrat', Arial, sans-serif; font-size: 14px; font-weight: 700; color: #004B63; margin: 0;">DOCUMENTO OFICIAL VERIFICADO</p>
                        <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 11px; color: #666; margin: 3px 0 0 0;">Edutechlife v2.286 - Neuro-Educación Premium</p>
                    </div>
                </div>
                <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 11px; color: #888; margin: 0; text-align: center;">
                    Este documento fue generado automáticamente y contiene información confidencial de Consultoría B2B Edutechlife.
                </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center;">
                <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 10px; color: #999; margin: 0;">
                    consultoria@edutechlife.com | www.edutechlife.com | © 2026 Edutechlife - Todos los derechos reservados
                </p>
            </div>
        `;

        const fileName = `Edutechlife_${type}_${new Date().toISOString().split('T')[0]}`;
        
        const opt = {
            margin: 10,
            filename: `${fileName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        html2pdf().set(opt).from(container).save();
    };

    const handleDownloadWord = (content, title, type) => {
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #004B63, #4DA8C4); color: white; padding: 30px; margin: -50px -50px 30px -50px; }
        .logo { font-size: 28px; font-weight: bold; }
        .subtitle { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.9; }
        h1 { font-size: 24px; color: #004B63; border-bottom: 2px solid #4DA8C4; padding-bottom: 10px; }
        h2 { font-size: 16px; color: #004B63; }
        .content { white-space: pre-wrap; font-size: 13px; }
        .footer { margin-top: 40px; padding: 20px; background: #f5f5f5; border-left: 4px solid #004B63; }
        .verification { font-weight: bold; color: #004B63; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🎓 EDUTECHLIFE</div>
        <div class="subtitle">Consultoría B2B - Plataforma Premium</div>
    </div>
    
    <h1>${title}</h1>
    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
    
    <div class="content">${content}</div>
    
    <div class="footer">
        <p class="verification">✓ DOCUMENTO OFICIAL VERIFICADO</p>
        <p>Edutechlife v2.286 - Neuro-Educación Premium</p>
        <p>consultoria@edutechlife.com | www.edutechlife.com</p>
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Edutechlife_${type}_${new Date().toISOString().split('T')[0]}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FFFFFF] to-[#E2E8F0]">
            {/* Header */}
            <div className="bg-white border-b border-[#E2E8F0] shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-2 px-4 py-2 bg-[#F1F5F9] hover:bg-[#4DA8C4] hover:text-white border border-[#E2E8F0] rounded-lg transition-all duration-300"
                        >
                            <i className="fa-solid fa-arrow-left text-[#4DA8C4] hover:text-white" />
                            <span className="text-sm text-[#64748B] hover:text-white">Volver</span>
                        </button>
                        <div className="h-8 w-px bg-[#E2E8F0]" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-building text-white" />
                            </div>
                            <div>
                                <h1 className="font-montserrat font-bold text-lg text-[#004B63]">Herramientas IA</h1>
                                <p className="text-xs text-[#64748B]">Consultoría B2B de Edutechlife</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#66CCCC]/20 border border-[#66CCCC]/40 rounded-full text-xs text-[#004B63] font-mono font-semibold">
                            PREMIUM
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tool Selector */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTool('roi')}
                        className={`flex-1 relative px-6 py-5 rounded-2xl transition-all duration-300 ${
                            activeTool === 'roi' 
                                ? 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white shadow-xl shadow-[#4DA8C4]/30' 
                                : 'bg-white text-[#004B63] hover:shadow-lg border border-[#E2E8F0] hover:border-[#4DA8C4]'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeTool === 'roi' ? 'bg-white/20' : 'bg-[#4DA8C4]/10'}`}>
                                <i className={`fa-solid fa-chart-line text-2xl ${activeTool === 'roi' ? 'text-white' : 'text-[#4DA8C4]'}`} />
                            </div>
                            <div className="text-left">
                                <div className="font-montserrat font-bold text-lg">Calculadora ROI Neural</div>
                                <div className={`text-sm ${activeTool === 'roi' ? 'text-white/80' : 'text-[#64748B]'}`}>Análisis financiero con IA</div>
                            </div>
                        </div>
                        {activeTool === 'roi' && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#66CCCC] rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTool('automation')}
                        className={`flex-1 relative px-6 py-5 rounded-2xl transition-all duration-300 ${
                            activeTool === 'automation' 
                                ? 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white shadow-xl shadow-[#4DA8C4]/30' 
                                : 'bg-white text-[#004B63] hover:shadow-lg border border-[#E2E8F0] hover:border-[#4DA8C4]'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeTool === 'automation' ? 'bg-white/20' : 'bg-[#66CCCC]/10'}`}>
                                <i className={`fa-solid fa-sitemap text-2xl ${activeTool === 'automation' ? 'text-white' : 'text-[#66CCCC]'}`} />
                            </div>
                            <div className="text-left">
                                <div className="font-montserrat font-bold text-lg">Arquitecto de Automatización</div>
                                <div className={`text-sm ${activeTool === 'automation' ? 'text-white/80' : 'text-[#64748B]'}`}>Workflows y sistemas IA</div>
                            </div>
                        </div>
                        {activeTool === 'automation' && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#66CCCC] rounded-full" />
                        )}
                    </button>
                </div>

                {/* AI Panels Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ROI Calculator Panel */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden">
                        <AIPanel
                            title="CALCULADORA ROI NEURAL"
                            icon="fa-chart-line"
                            placeholder="Ingresa los datos de tu organización para calcular el ROI...
Ejemplo: Tenemos 50 empleados, queremos automatizar gestión de estudiantes y reportes. Presupuesto de $20 millones COP."
                            systemPrompt={roiSystemPrompt}
                            onResult={(result) => {
                                setRoiResult(result);
                            }}
                        />
                        
                        {roiResult && (
                            <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleDownloadPDF(roiResult, 'DIAGNÓSTICO ROI NEURAL', 'ROI')}
                                        className="flex-1 px-6 py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-montserrat font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                                    >
                                        <i className="fa-solid fa-file-pdf text-lg group-hover:scale-110 transition-transform" />
                                        <span>Descargar PDF</span>
                                    </button>
                                    <button
                                        onClick={() => handleDownloadWord(roiResult, 'DIAGNÓSTICO ROI NEURAL', 'ROI')}
                                        className="flex-1 px-6 py-4 bg-white border-2 border-[#4DA8C4] text-[#004B63] rounded-xl font-montserrat font-bold hover:bg-[#4DA8C4]/10 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <i className="fa-solid fa-file-word text-lg text-[#4DA8C4]" />
                                        <span>Descargar Word</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Automation Architect Panel */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden">
                        <AIPanel
                            title="ARQUITECTO DE AUTOMATIZACIÓN"
                            icon="fa-diagram-project"
                            placeholder="Describe los procesos que deseas automatizar...
Ejemplo: Necesito automatizar el proceso de admisión de estudiantes: recepción de documentos, validación de requisitos, entrevistas, y generación de contratos."
                            systemPrompt={automationSystemPrompt}
                        />
                    </div>
                </div>

                {/* Features Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-xl flex items-center justify-center mb-4">
                            <i className="fa-solid fa-shield-halved text-white text-xl" />
                        </div>
                        <h3 className="font-montserrat font-bold text-[#004B63] mb-2">Datos Seguros</h3>
                        <p className="text-sm text-[#64748B]">Toda la información se procesa de forma segura y no se almacena en servidores externos.</p>
                    </div>
                    <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#66CCCC] to-[#B2D8E5] rounded-xl flex items-center justify-center mb-4">
                            <i className="fa-solid fa-file-contract text-white text-xl" />
                        </div>
                        <h3 className="font-montserrat font-bold text-[#004B63] mb-2">Exportación Profesional</h3>
                        <p className="text-sm text-[#64748B]">Descarga tus análisis en PDF y Word con el membrete oficial de Edutechlife.</p>
                    </div>
                    <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center mb-4">
                            <i className="fa-solid fa-headset text-white text-xl" />
                        </div>
                        <h3 className="font-montserrat font-bold text-[#004B63] mb-2">Soporte Dedicado</h3>
                        <p className="text-sm text-[#64748B]">¿Necesitas ayuda? Agenda una sesión con nuestros consultores B2B.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultoriaB2B;
