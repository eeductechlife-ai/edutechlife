import React, { useState } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { IALabProvider, useIALabContext } from '../../context/IALabContext';
import IALabHeader from './IALabHeader';
import IALabSidebar from './IALabSidebar';
import IALabModuleHeader from './IALabModuleHeader';
import ModuleOverviewCard from './ModuleOverviewCard';
import ModuleInfoSection from './ModuleInfoSection';
import IALabContentAccordion from './IALabContentAccordion';
import IALabChallengeSection from './IALabChallengeSection';
import IALabForumSection from './IALabForumSection';
import IALabForumOptimized from './IALabForumOptimized';
import IALabSynthesizer from './IALabSynthesizer';
import ReactivePromptStation from './ReactivePromptStation';
import IALabEvaluationModal from './IALabEvaluationModal';
import IALabEvaluationModalPremium from './IALabEvaluationModalPremium';
import IALabQuizModal from './IALabQuizModal';
import IALabValerioPanel from './IALabValerioPanel';
import ErrorBoundary from '../forum/ErrorBoundary';

/**
 * Componente principal wrapper para IALab - Arquitectura modular premium
 * Integra todos los componentes modulares manteniendo 100% la estructura visual original
 * Elimina componentes redundantes (cuadro "¿Listo para avanzar?" y quiz evaluación inline)
 * 
 * @returns {JSX.Element} Componente IALab completo
 */
const IALabContent = () => {
    const { showPremiumEvaluationModal, setShowPremiumEvaluationModal, user, completedModules } = useIALabContext();
    const [showExamModal, setShowExamModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showValerioPanel, setShowValerioPanel] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Debug logging
    React.useEffect(() => {
        console.log('🎯 [DEBUG] IALabContent montado');
        console.log('🎯 [DEBUG] Estado showPremiumEvaluationModal:', showPremiumEvaluationModal);
    }, []);

    React.useEffect(() => {
        console.log('🎯 [DEBUG] showPremiumEvaluationModal actualizado:', showPremiumEvaluationModal);
    }, [showPremiumEvaluationModal]);

    // Handler para acciones globales
    const handleGlobalAction = (action, data) => {
        switch (action) {
            case 'OPEN_EVALUATION':
                setShowExamModal(true);
                break;
            case 'OPEN_QUIZ':
                setShowQuizModal(true);
                break;
            case 'OPEN_VALERIO':
                setShowValerioPanel(true);
                break;
            case 'CLOSE_EVALUATION':
                setShowExamModal(false);
                break;
            case 'CLOSE_QUIZ':
                setShowQuizModal(false);
                break;
            case 'CLOSE_VALERIO':
                setShowValerioPanel(false);
                break;
            default:
                console.log('Acción global no manejada:', action, data);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-[#F0F9FF]">
                {/* Decorative background elements */}
                <div className="fixed top-0 right-0 w-[30%] h-[40%] bg-gradient-to-bl from-[#004B63]/5 via-[#00BCD4]/3 to-transparent rounded-bl-[100px] pointer-events-none" />
                <div className="fixed bottom-0 left-0 w-[25%] h-[35%] bg-gradient-to-tr from-[#004B63]/4 via-transparent to-transparent rounded-tr-[100px] pointer-events-none" />
                
                {/* Mobile Header - solo en móviles */}
                <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-between px-4 border-b border-slate-100">
                  <h1 className="text-2xl font-bold text-[#004B63] tracking-tight">IA Lab</h1>
                  <button
                    onClick={() => setShowMobileMenu(true)}
                    className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    aria-label="Abrir menú"
                  >
                    <Icon name="fa-bars" className="w-5 h-5" />
                  </button>
                </div>

                {/* Header principal - oculto en móviles */}
                <div className="hidden md:block">
                  <IALabHeader onAction={handleGlobalAction} />
                </div>
                
                {/* Layout principal - Flexbox estricto para evitar overlap */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - oculto en móviles, visible desde lg */}
                    <div className="hidden lg:flex">
                      <IALabSidebar />
                    </div>

                    {/* Drawer móvil con overlay */}
                    {showMobileMenu && (
                      <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
                        <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
                          {/* Perfil del usuario en el drawer */}
                          <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.full_name || 'Usuario'}</p>
                                <p className="text-xs text-slate-500">{completedModules.length}/5 Módulos</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowMobileMenu(false)}
                              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              <Icon name="fa-xmark" className="text-sm" />
                            </button>
                          </div>
                          <IALabSidebar />
                        </div>
                      </div>
                    )}
                    
                     {/* Área de Contenido Principal - scroll propio */}
                     <main className="flex-1 overflow-y-auto h-full px-4 pt-20 pb-4 md:px-8 md:py-6 lg:px-10 lg:py-8">
                          <div className="space-y-6 w-full max-w-5xl pb-20">
                            {/* Info bar móvil - solo visible en móvil */}
                            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-[#004B63]/8 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center text-white text-xs font-bold">
                                  {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.full_name || 'Usuario'}</p>
                                  <p className="text-[10px] text-slate-500">Módulo 1 de 5</p>
                                </div>
                              </div>
                              <div className="px-3 py-1.5 bg-[#004B63]/8 border border-[#004B63]/15 text-[#004B63] rounded-lg font-semibold text-xs">
                                {completedModules.length}/5 Módulos
                              </div>
                            </div>

                            {/* 1. PRIMERO: TÍTULO PRINCIPAL ARRIBA DEL TODO */}
                            <div className="relative z-30">
                              <IALabModuleHeader onAction={handleGlobalAction} />
                            </div>

                            {/* 2. SEGUNDO: SECCIÓN INFORMATIVA DEL MÓDULO */}
                            <div className="mt-8">
                              <ModuleInfoSection />
                            </div>

                            {/* 3. TERCERO: TARJETA DE RESUMEN EN EL MEDIO */}
                            <ModuleOverviewCard onAction={handleGlobalAction} />

                            {/* 3. TERCERO: ACORDEONES/LECCIONES ABAJO */}
                            <div className="mt-6">
                              <IALabContentAccordion />
                            </div>
                            
                            {/* Estación Reactiva de Prompts - Fusión Sintetizador + Dashboard */}
                            <div className="mt-10">
                              <ReactivePromptStation />
                            </div>
                            
                            {/* Contenedor Grid: Desafío y Comunidad */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-8">
                                {/* Columna Izquierda: Desafío del Curso */}
                                <ErrorBoundary>
                                    <IALabChallengeSection />
                                </ErrorBoundary>
                                
                                {/* Columna Derecha: Comunidad IALab Optimizada */}
                                <ErrorBoundary>
                                    <IALabForumOptimized 
                                        compact={false}
                                        initialLimit={5}
                                    />
                                </ErrorBoundary>
                            </div>
                        </div>
                    </main>
                </div>
                
                {/* Modal de Evaluación */}
                {showExamModal && (
                    <ErrorBoundary>
                        <IALabEvaluationModal 
                            isOpen={showExamModal}
                            onClose={() => handleGlobalAction('CLOSE_EVALUATION')}
                        />
                    </ErrorBoundary>
                )}
                
                {/* Modal de Examen (8 preguntas) */}
                {showQuizModal && (
                    <ErrorBoundary>
                        <IALabQuizModal
                            isOpen={showQuizModal}
                            onClose={() => handleGlobalAction('CLOSE_QUIZ')}
                        />
                    </ErrorBoundary>
                )}
                
                {/* Panel de Coach IA Valerio */}
                {showValerioPanel && (
                    <ErrorBoundary>
                        <IALabValerioPanel 
                            isOpen={showValerioPanel}
                            onClose={() => handleGlobalAction('CLOSE_VALERIO')}
                        />
                    </ErrorBoundary>
                )}
                
                {/* Modal de Evaluación Premium (Nuevo Desafío) */}
                {showPremiumEvaluationModal && (
                    <>
                        {console.log('🎯 [DEBUG] Condición showPremiumEvaluationModal es TRUE, renderizando modal...')}
                        <ErrorBoundary>
                            <IALabEvaluationModalPremium 
                                isOpen={showPremiumEvaluationModal}
                                onClose={() => setShowPremiumEvaluationModal(false)}
                            />
                        </ErrorBoundary>
                    </>
                )}
                
                 {/* FAB de Valerio - posicionado relativo al viewport */}
                 <button 
                     className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#004B63] to-[#00BCD4] rounded-xl lg:rounded-2xl shadow-[0_12px_40px_rgba(0,75,99,0.25)] hover:shadow-[0_20px_50px_rgba(0,75,99,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center group"
                     onClick={() => handleGlobalAction('OPEN_VALERIO')}
                     aria-label="Abrir panel de coach IA Valerio"
                 >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                        <path d="M12 3C8.5 3 6 5.5 6 9C6 10.5 6.5 12 7.5 13C8.5 14 9.5 15 10 16C10.5 17 11 18 12 18C13 18 13.5 17 14 16C14.5 15 15.5 14 16.5 13C17.5 12 18 10.5 18 9C18 5.5 15.5 3 12 3Z" fill="white" />
                        <path d="M9 7C8.5 7 8 7.5 8 8C8 8.5 8.5 9 9 9C9.5 9 10 8.5 10 8C10 7.5 9.5 7 9 7Z" fill="#0A3550" />
                        <path d="M15 7C14.5 7 14 7.5 14 8C14 8.5 14.5 9 15 9C15.5 9 16 8.5 16 8C16 7.5 15.5 7 15 7Z" fill="#0A3550" />
                        <path d="M12 5C11.5 5 11 5.5 11 6C11 6.5 11.5 7 12 7C12.5 7 13 6.5 13 6C13 5.5 12.5 5 12 5Z" fill="white" className="animate-pulse" />
                    </svg>
                </button>
                
                {/* Estilos de protección anti-impresión (para modal de evaluación) */}
                <style>
                    {`
                        @media print {
                            .exam-protection-modal,
                            .exam-protection-modal * {
                                display: none !important;
                                visibility: hidden !important;
                                opacity: 0 !important;
                            }
                            
                            body::before {
                                content: "⚠️ IMPRESIÓN BLOQUEADA - Este examen está protegido por el protocolo de seguridad Edutechlife";
                                display: block !important;
                                font-size: 24px;
                                font-weight: bold;
                                text-align: center;
                                color: red;
                                padding: 40px;
                                background: white;
                            }
                        }
                        
                        /* Animación para mensajes temporales */
                        @keyframes fade-in {
                            from { opacity: 0; transform: translate(-50%, -10px); }
                            to { opacity: 1; transform: translate(-50%, 0); }
                        }
                        
                        .animate-fade-in {
                            animation: fade-in 0.3s ease-out;
                        }
                        
                        /* Efectos de botón premium */
                        .button-pulse {
                            animation: pulse 2s infinite;
                        }
                        
                        @keyframes pulse {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(0, 188, 212, 0.4); }
                            50% { box-shadow: 0 0 0 10px rgba(0, 188, 212, 0); }
                        }
                        
                        /* Scrollbar personalizada */
                        ::-webkit-scrollbar {
                            width: 8px;
                            height: 8px;
                        }
                        
                        ::-webkit-scrollbar-track {
                            background: #F1F5F9;
                            border-radius: 4px;
                        }
                        
                        ::-webkit-scrollbar-thumb {
                            background: linear-gradient(to bottom, #004B63, #00BCD4);
                            border-radius: 4px;
                        }
                        
                        ::-webkit-scrollbar-thumb:hover {
                            background: linear-gradient(to bottom, #00374A, #0097A7);
                        }
                    `}
                </style>
            </div>
    );
};

/**
 * Componente principal wrapper que provee el contexto
 */
const IALab = () => {
    return (
        <IALabProvider>
            <IALabContent />
        </IALabProvider>
    );
};

export default IALab;