import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import { Icon } from '../../utils/iconMapping.jsx';
import { servicios, casosExito } from './consultingData';
import useContactForm from './useContactForm';
import ServiceTabs from './components/ServiceTabs';

const Consultoria = ({ onBack, onNavigate }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('servicios');
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

  const { contactForm, setContactForm, submitted, setSubmitted, formErrors, setFormErrors, handleSubmit } = useContactForm(t);

  useEffect(() => {
    if (activeTab === 'roi' && roiRef.current) {
      roiRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

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

      <ServiceTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        servicios={servicios}
        casosExito={casosExito}
        contactForm={contactForm}
        setContactForm={setContactForm}
        formErrors={formErrors}
        submitted={submitted}
        handleSubmit={handleSubmit}
        setSubmitted={setSubmitted}
        setFormErrors={setFormErrors}
        selectedCase={selectedCase}
        setSelectedCase={setSelectedCase}
        demoRequested={demoRequested}
        handleDemoRequest={handleDemoRequest}
        roiData={roiData}
        roiResult={roiResult}
        isCalculating={isCalculating}
        animatedValues={animatedValues}
        calculateROI={calculateROI}
        handleRoiChange={handleRoiChange}
        roiRef={roiRef}
        t={t}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default Consultoria;
