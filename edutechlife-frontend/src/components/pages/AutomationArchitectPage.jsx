import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';
import AutomationHero from '../AutomationHero';
import AutomationReadinessTest from '../AutomationReadinessTest';
import AutomationROICalculator from '../AutomationROICalculator';
import AutomationProcessDiscovery from '../AutomationProcessDiscovery';
import AutomationCaseStudies from '../AutomationCaseStudies';
import AutomationLeadCapture from '../AutomationLeadCapture';

// Lazy load del componente AutomationArchitect
const AutomationArchitect = lazy(() => import('../AutomationArchitect'));

/**
 * Página Automation Architect - Centro de Automatización Empresarial
 * Ruta: /automation
 * Pública - no requiere autenticación
 */
const AutomationArchitectPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const heroRef = { current: null };

  const scrollToTools = () => {
    const el = document.getElementById('automation-tools');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      <AutomationHero
        onStartDiagnosis={() => {
          setActiveTab('architect');
          setTimeout(() => scrollToTools(), 100);
        }}
        onViewCases={() => {
          setActiveTab('cases');
          setTimeout(() => scrollToTools(), 100);
        }}
      />

      <div id="automation-tools" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {[
            { id: 'diagnosis', label: 'Diagnóstico', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 3-3m-3-3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'discovery', label: 'Procesos', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            { id: 'architect', label: 'Arquitecto IA', icon: 'M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 002.012-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.218a2.25 2.25 0 012.013 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3' },
            { id: 'roi', label: 'Calculadora ROI', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'cases', label: 'Casos de Éxito', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#004B63] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'diagnosis' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-[#004B63] mb-2">Diagnóstico de Madurez Digital</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Evalúa el nivel de preparación de tu empresa para la automatización con IA.
                Respondé 10 preguntas y obtené un plan de acción personalizado.
              </p>
            </div>
            <AutomationReadinessTest onComplete={(result) => {
              setActiveTab('architect');
              setTimeout(() => scrollToTools(), 100);
            }} />
          </div>
        )}

        {activeTab === 'discovery' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-[#004B63] mb-2">Descubrí tu Solución IA</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Seleccioná los procesos de tu empresa y descubrí qué soluciones de inteligencia artificial
                pueden transformarlos.
              </p>
            </div>
            <AutomationProcessDiscovery onGeneratePlan={() => {
              setActiveTab('architect');
              setTimeout(() => scrollToTools(), 100);
            }} />
          </div>
        )}

        {activeTab === 'architect' && (
          <Suspense fallback={<PageLoader message="Cargando Arquitecto IA..." />}>
            <AutomationArchitect onBack={() => navigate('/')} />
          </Suspense>
        )}

        {activeTab === 'roi' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-[#004B63] mb-2">Calculadora de ROI</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Calcula el retorno de inversión de automatizar tus procesos con IA.
                Ajusta los parámetros y ve los resultados en tiempo real.
              </p>
            </div>
            <AutomationROICalculator onGeneratePlan={() => {
              setActiveTab('architect');
              setTimeout(() => scrollToTools(), 100);
            }} />
          </div>
        )}

        {activeTab === 'cases' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-[#004B63] mb-2">Casos de Éxito</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Conocé cómo empresas de diferentes sectores transformaron sus procesos
                con nuestras soluciones de automatización IA.
              </p>
            </div>
            <AutomationCaseStudies />
          </div>
        )}
      </div>

      {/* Lead Capture Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-[#004B63] mb-2">
            Comenzá tu Transformación
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Solicita una consultoría gratuita y recibí un plan de automatización personalizado
            para tu empresa.
          </p>
        </div>
        <AutomationLeadCapture />
      </div>
    </div>
  );
};

export default AutomationArchitectPage;