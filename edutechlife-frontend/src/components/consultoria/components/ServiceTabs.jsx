import { Icon } from '../../../utils/iconMapping.jsx';
import AutomationArchitect from '../../AutomationArchitect';
import ContactForm from './ContactForm';
import CaseStudyCard from './CaseStudyCard';

const ServiceTabs = ({
  activeTab, setActiveTab,
  servicios, casosExito,
  contactForm, setContactForm, formErrors, submitted, handleSubmit, setSubmitted, setFormErrors,
  selectedCase, setSelectedCase,
  demoRequested, handleDemoRequest,
  roiData, roiResult, isCalculating, animatedValues, calculateROI, handleRoiChange, roiRef,
  t, onNavigate
}) => {
  return (
    <>
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
                <CaseStudyCard key={i} caso={c} index={i} selectedCase={selectedCase} onToggle={setSelectedCase} t={t} />
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
          <ContactForm
            contactForm={contactForm}
            setContactForm={setContactForm}
            formErrors={formErrors}
            submitted={submitted}
            handleSubmit={handleSubmit}
            setSubmitted={setSubmitted}
            setFormErrors={setFormErrors}
            t={t}
          />
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
    </>
  );
};

export default ServiceTabs;
