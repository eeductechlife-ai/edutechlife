import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { IALabProvider, useIALabContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import confetti from 'canvas-confetti';
import IALabHeader from './IALabHeader';
import IALabSidebar from './IALabSidebar';
import IALabModuleHeader from './IALabModuleHeader';
import ModuleOverviewCard from './ModuleOverviewCard';
import ModuleInfoSection from './ModuleInfoSection';
import ToolTutorAccordion from './ToolTutorAccordion';
import TuRutaDeHoy from './TuRutaDeHoy';
import ModuleActions from './ModuleActions';
import IALabForumOptimized from './IALabForumOptimized';
import IALabTour from './IALabTour';
import useIALabKeyboardShortcuts from '../../hooks/IALab/useIALabKeyboardShortcuts';
import ErrorBoundary from '../forum/ErrorBoundary';
import { useTheme } from '../../context/ThemeContext';

// Lazy-loaded modals (only loaded when opened)
const IALabEvaluationModal = lazy(() => import('./IALabEvaluationModal'));
const IALabEvaluationModalPremium = lazy(() => import('./IALabEvaluationModalPremium'));
const IALabQuizModal = lazy(() => import('./IALabQuizModal'));
const IALabValerioPanel = lazy(() => import('./IALabValerioPanel'));
const ExamResultViewer = lazy(() => import('./ExamResultViewer'));
const ChallengeResultViewer = lazy(() => import('./ChallengeResultViewer'));
const CertificatesModal = lazy(() => import('../modals/CertificatesModal'));

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl px-8 py-6 shadow-xl">
      <div className="w-8 h-8 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Cargando...</p>
    </div>
  </div>
);

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

/**
 * Componente principal wrapper para IALab - Arquitectura modular premium
 * Integra todos los componentes modulares manteniendo 100% la estructura visual original
 * Elimina componentes redundantes (cuadro "¿Listo para avanzar?" y quiz evaluación inline)
 * 
 * @returns {JSX.Element} Componente IALab completo
 */
const IALabContent = () => {
    const { showPremiumEvaluationModal, setShowPremiumEvaluationModal, user, completedModules, courseProgress, activeMod, showCertificateModal, setShowCertificateModal, completedExams, challengeScores, moduleProgress } = useIALabContext();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [showExamModal, setShowExamModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showValerioPanel, setShowValerioPanel] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showExamResult, setShowExamResult] = useState(false);
    const [showChallengeResult, setShowChallengeResult] = useState(false);
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [showModuleCelebration, setShowModuleCelebration] = useState(false);
    const [viewSection, setViewSection] = useState(null);

    const TABS = [
      { id: null, label: 'Todo' },
      { id: 'objetivos', label: 'Objetivos' },
      { id: 'contenido', label: 'Contenido' },
      { id: 'actividades', label: 'Actividades' },
      { id: 'herramientas', label: 'Herramientas' },
    ];

    const moduleScore = useIALabStore((s) => s.calculateModuleScore(activeMod));

    React.useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    // Reset scroll al inicio al cargar el dashboard
    React.useEffect(() => {
        const forceScrollToTop = () => {
            const mainEl = document.querySelector('main');
            if (mainEl) {
                mainEl.scrollTop = 0;
                requestAnimationFrame(() => {
                    mainEl.scrollTop = 0;
                });
            }
        };
        forceScrollToTop();
        window.addEventListener('popstate', forceScrollToTop);
        return () => window.removeEventListener('popstate', forceScrollToTop);
    }, []);

    // Escucha evento para abrir la comunidad desde TuRutaDeHoy
    React.useEffect(() => {
        const handleSwitchTab = (e) => {
            if (e.detail === 'comunidad') {
                setIsForumOpen(true);
                setTimeout(() => {
                    document.getElementById('forum-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 350);
            }
        };
        window.addEventListener('ialab:switchTab', handleSwitchTab);
        return () => window.removeEventListener('ialab:switchTab', handleSwitchTab);
    }, []);

    // Celebración al completar módulo (score >= 80)
    const prevModuleScore = React.useRef(moduleScore);
    React.useEffect(() => {
        if (moduleScore >= 80 && prevModuleScore.current < 80) {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#004B63', '#00BCD4', '#FFD166', '#10B981']
            });
            setShowModuleCelebration(true);
            const t = setTimeout(() => setShowModuleCelebration(false), 6000);
            return () => clearTimeout(t);
        }
        prevModuleScore.current = moduleScore;
    }, [moduleScore]);

    // Handler para acciones globales
    const handleGlobalAction = (action, data) => {
        switch (action) {
            case 'OPEN_EVALUATION':
                setShowExamModal(true);
                break;
            case 'OPEN_QUIZ':
                setShowQuizModal(true);
                break;
            case 'OPEN_CHALLENGE':
                setShowPremiumEvaluationModal(true);
                break;
            case 'SHOW_EXAM_RESULT':
                setShowExamResult(true);
                break;
            case 'SHOW_CHALLENGE_RESULT':
                setShowChallengeResult(true);
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
            case 'OPEN_CERTIFICATE':
            case 'SHOW_CERTIFICATE':
                setShowCertificateModal(true);
                break;
            case 'OPEN_COMMUNITY':
                window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: 'comunidad' }));
                break;
            default:
                console.warn('Acción global no manejada:', action, data);
        }
    };

    useIALabKeyboardShortcuts(handleGlobalAction);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-bg-light dark:bg-slate-900">
                {/* Mobile Header - solo en móviles */}
                <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 z-50 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
                  <h1 className="text-2xl font-bold text-petroleum dark:text-[#4DA8C4] tracking-tight">IA Lab</h1>
                  <button
                    onClick={() => setShowMobileMenu(true)}
                    className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50"
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
                    <div className="hidden lg:flex" data-tour="tour-sidebar">
                      <IALabSidebar />
                    </div>

                    {/* Drawer móvil con overlay */}
                    {showMobileMenu && (
                      <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60" onClick={() => setShowMobileMenu(false)} />
                        <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-xl overflow-y-auto">
                          {/* Perfil del usuario en el drawer */}
                          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user?.full_name || 'Usuario'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{Math.round(courseProgress)}% Completado</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowMobileMenu(false)}
                              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                              <Icon name="fa-xmark" className="text-sm" />
                            </button>
                          </div>
                          <IALabSidebar />
                        </div>
                      </div>
                    )}
                    
                      {/* Skip link para accesibilidad */}
                      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:bg-petroleum focus:text-white focus:rounded-lg focus:text-sm focus:font-bold">
                        Saltar al contenido
                      </a>

                      {/* Área de Contenido Principal - scroll propio */}
                      <main id="main-content" className="flex-1 overflow-y-auto h-full px-4 pt-12 pb-2 md:px-8 md:py-4 lg:px-10 lg:py-5">
                           <div className="space-y-5 w-full max-w-5xl pb-8">
                            {/* Info bar móvil - solo visible en móvil */}
                            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-petroleum/8 dark:border-petroleum/20 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center text-white text-xs font-bold">
                                  {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user?.full_name || 'Usuario'}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Módulo {activeMod} de 5</p>
                                </div>
                              </div>
                              <div className="px-3 py-1.5 bg-petroleum/8 dark:bg-petroleum/20 border border-petroleum/15 text-petroleum dark:text-[#4DA8C4] rounded-lg font-semibold text-xs">
                                {Math.round(courseProgress)}% Completado
                              </div>
                            </div>

                            <div data-tour="tour-ruta">
                              <TuRutaDeHoy onAction={handleGlobalAction} />
                            </div>

                            {/* TAB PILLS - Navegación entre secciones */}
                            <div data-tour="tour-tabs" className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                              {TABS.map((tab) => (
                                <button
                                  key={tab.id ?? 'all'}
                                  onClick={() => setViewSection(tab.id)}
                                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 border ${
                                    viewSection === tab.id
                                      ? 'bg-gradient-to-r from-petroleum to-corporate text-white border-petroleum/30 shadow-md shadow-petroleum/10 ring-1 ring-white/20'
                                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:border-petroleum/30 hover:text-petroleum dark:hover:text-[#4DA8C4] hover:shadow-sm'
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              ))}
                              <button
                                onClick={toggleDarkMode}
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center transition-all duration-300 hover:shadow-md hover:shadow-petroleum/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30 ml-2 flex-shrink-0"
                                aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
                              >
                                <Icon name={isDarkMode ? 'fa-sun' : 'fa-moon'} className={`text-sm transition-all duration-300 ${isDarkMode ? 'text-amber-300' : 'text-white'}`} />
                              </button>
                            </div>

<AnimatePresence mode="wait">
                          <motion.div
                            key={activeMod}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                          >
                            {/* 1. TÍTULO PRINCIPAL */}
                            {(viewSection === null) && (
                              <div className="relative z-30">
                                <IALabModuleHeader onAction={handleGlobalAction} />
                              </div>
                            )}

                            {/* 2. SECCIÓN INFORMATIVA DEL MÓDULO */}
                            {(viewSection === null || viewSection === 'objetivos') && (
                              <div className="mt-4" data-tour="tour-objetivos">
                                <ModuleInfoSection />
                              </div>
                            )}

                            {/* 3. TEMAS DEL MÓDULO - ACORDEÓN */}
                            {(viewSection === null || viewSection === 'contenido') && (
                              <div data-tour="tour-temas">
                              <ErrorBoundary>
                                  <ModuleOverviewCard onAction={handleGlobalAction} onToggleForum={setIsForumOpen} />
                              </ErrorBoundary>
                              </div>
                            )}

                            {/* 4. ACTIVIDADES DEL MÓDULO */}
                            {(viewSection === null || viewSection === 'actividades') && (
                              <div data-tour="tour-actividades">
                              <ErrorBoundary>
                              <ModuleActions
                                onAction={handleGlobalAction}
                                activeMod={activeMod}
                                challengeScores={challengeScores}
                                completedExams={completedExams}
                                moduleProgress={moduleProgress}
                                isForumOpen={isForumOpen}
                                onToggleForum={() => setIsForumOpen(prev => !prev)}
                              />
                              </ErrorBoundary>
                              </div>
                            )}

                            {/* BANNER CELEBRATORIO - siempre visible si activo */}
                            {showModuleCelebration && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="relative bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-700/30 shadow-sm p-4 md:p-5 overflow-hidden"
                              >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-2xl" />
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Icon name="fa-trophy" className="text-white text-lg" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">¡Módulo completado!</h4>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-300/80">Has alcanzado el 80% o más. Sigue así hacia tu certificación.</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        </AnimatePresence>

                            {/* 5. FORO DEL MÓDULO */}
                            {(viewSection === null || viewSection === 'actividades') && isForumOpen && (
                              <div id="forum-section">
                                <ErrorBoundary>
                                  <IALabForumOptimized compact={false} initialLimit={3} />
                                </ErrorBoundary>
                              </div>
                            )}

                            {/* Herramientas + Tutorías */}
                            {(viewSection === null || viewSection === 'herramientas') && (
                              <div className="mt-5" data-tour="tour-herramientas">
                                <ToolTutorAccordion onAction={handleGlobalAction} />
                              </div>
                            )}
                        </div>
                    </main>
                </div>
                
                {/* Modal de Evaluación */}
                {showExamModal && (
                    <ErrorBoundary>
                        <SuspenseWrapper>
                            <IALabEvaluationModal 
                                isOpen={showExamModal}
                                onClose={() => handleGlobalAction('CLOSE_EVALUATION')}
                            />
                        </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                {/* Modal de Examen (8 preguntas) */}
                {showQuizModal && (
                    <ErrorBoundary>
                        <SuspenseWrapper>
                            <IALabQuizModal
                                isOpen={showQuizModal}
                                onClose={() => handleGlobalAction('CLOSE_QUIZ')}
                            />
                        </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                {/* Panel de Coach IA Valerio */}
                {showValerioPanel && (
                    <ErrorBoundary>
                        <SuspenseWrapper>
                            <IALabValerioPanel 
                                isOpen={showValerioPanel}
                                onClose={() => handleGlobalAction('CLOSE_VALERIO')}
                            />
                        </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                {/* Modal de Evaluación Premium (Nuevo Desafío) */}
                {showPremiumEvaluationModal && (
                    <ErrorBoundary>
                        <SuspenseWrapper>
                            <IALabEvaluationModalPremium 
                                isOpen={showPremiumEvaluationModal}
                                onClose={() => setShowPremiumEvaluationModal(false)}
                            />
                        </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                {/* Modal de Certificado del Curso */}
                <ErrorBoundary>
                <SuspenseWrapper>
                    <CertificatesModal
                        isOpen={showCertificateModal}
                        onClose={() => setShowCertificateModal(false)}
                        initialTab="certificate"
                    />
                </SuspenseWrapper>
                </ErrorBoundary>

                {/* Modal de Resultado de Examen */}
                {showExamResult && (
                    <ErrorBoundary>
                    <SuspenseWrapper>
                        <ExamResultViewer
                            moduleId={activeMod}
                            score={completedExams?.[activeMod] || 80}
                            onClose={() => setShowExamResult(false)}
                        />
                    </SuspenseWrapper>
                    </ErrorBoundary>
                )}

                {/* Modal de Resultado de Desafío */}
                {showChallengeResult && (
                    <ErrorBoundary>
                    <SuspenseWrapper>
                        <ChallengeResultViewer
                            moduleId={activeMod}
                            onClose={() => setShowChallengeResult(false)}
                            onRetry={() => {
                                setShowChallengeResult(false);
                                const store = useIALabStore.getState();
                                if (store.canAttemptChallengeRetry(activeMod)) {
                                    store.decrementChallengeAttempt(activeMod);
                                    setShowPremiumEvaluationModal(true);
                                } else {
                                    const nextTime = store.getNextAttemptTime(activeMod);
                                    const hoursLeft = nextTime ? Math.ceil((nextTime - Date.now()) / 3600000) : 12;
                                    setToast({ type: 'warning', message: `Debes esperar ${hoursLeft}h para intentar de nuevo. (3 intentos máximo, 12h entre cada uno).` });
                                }
                            }}
                        />
                    </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                 {/* FAB de Valerio - posicionado relativo al viewport */}
                 <button 
                      className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-petroleum to-corporate rounded-xl lg:rounded-2xl shadow-lg dark:shadow-premium-lg hover:shadow-xl dark:hover:shadow-premium hover:scale-105 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                      onClick={() => handleGlobalAction('OPEN_VALERIO')}
                      aria-label="Abrir panel de coach IA Valerio"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                        <path d="M12 3C8.5 3 6 5.5 6 9C6 10.5 6.5 12 7.5 13C8.5 14 9.5 15 10 16C10.5 17 11 18 12 18C13 18 13.5 17 14 16C14.5 15 15.5 14 16.5 13C17.5 12 18 10.5 18 9C18 5.5 15.5 3 12 3Z" fill="white" />
                        <path d="M9 7C8.5 7 8 7.5 8 8C8 8.5 8.5 9 9 9C9.5 9 10 8.5 10 8C10 7.5 9.5 7 9 7Z" fill="var(--color-petroleum-dark)" />
                        <path d="M15 7C14.5 7 14 7.5 14 8C14 8.5 14.5 9 15 9C15.5 9 16 8.5 16 8C16 7.5 15.5 7 15 7Z" fill="var(--color-petroleum-dark)" />
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
                                content: "IMPRESIÓN BLOQUEADA - Este examen está protegido por el protocolo de seguridad Edutechlife";
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
                            background: linear-gradient(to bottom, var(--color-petroleum), var(--color-corporate));
                            border-radius: 4px;
                        }
                        
                        ::-webkit-scrollbar-thumb:hover {
                            background: linear-gradient(to bottom, var(--color-petroleum-darker), var(--color-corporate));
                        }
                    `}
                </style>

                {/* Tour interactivo contextual */}
                <IALabTour />

                {/* Toast notification */}
                {toast && (
                    <div
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-in max-w-md ${
                            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                        role="alert"
                        aria-live="polite"
                    >
                        {toast.message}
                    </div>
                )}
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