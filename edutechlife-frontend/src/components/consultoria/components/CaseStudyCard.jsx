import { Icon } from '../../../utils/iconMapping.jsx';

const CaseStudyCard = ({ caso, index, selectedCase, onToggle, t }) => {
  return (
    <div key={index} className="caso-card caso-expandable" onClick={() => onToggle(selectedCase === index ? null : index)}>
      <div className="caso-header">
        <div>
          <h4>{caso.empresa}</h4>
          <span className="caso-sector">{caso.sector}</span>
        </div>
        <div className="caso-meta">
          <span className="caso-duracion">{caso.duracion}</span>
          <Icon name={`fa-chevron-${selectedCase === index ? 'up' : 'down'}`} />
        </div>
      </div>
      <p className="caso-desc">{caso.desc}</p>
      <div className="caso-resultado">
        <Icon name="fa-arrow-trend-up" />
        <span>{caso.resultado}</span>
      </div>
      {selectedCase === index && (
        <div className="caso-expanded">
          <div className="caso-metrics">
            <div className="metric-item">
              <span className="metric-value">{caso.metrics.satisfaction}%</span>
              <span className="metric-label">{t('consultoria.cases_metric_satisfaction')}</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{caso.metrics.retention}%</span>
              <span className="metric-label">{t('consultoria.cases_metric_retention')}</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">+{caso.metrics.performance}%</span>
              <span className="metric-label">{t('consultoria.cases_metric_performance')}</span>
            </div>
          </div>
          <div className="caso-services">
            <span className="services-label">{t('consultoria.cases_services_used')}</span>
            <div className="services-tags">
              {caso.services.map((svc, si) => (
                <span key={si} className="service-tag">{svc}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyCard;
