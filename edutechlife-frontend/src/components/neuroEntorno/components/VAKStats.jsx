import { contentByStyle } from '../neuroEntornoData';

export default function VAKStats({ testResult }) {
    if (!testResult) return null;

    return (
        <div className="profile-results">
            <div className="profile-main-card">
                <div className="profile-type-badge" style={{ 
                    background: contentByStyle[testResult.perfil.toLowerCase()]?.color || '#4DA8C4' 
                }}>
                    <i className={`fa-solid ${contentByStyle[testResult.perfil.toLowerCase()]?.icon || 'fa-brain'}`} />
                    <span>{testResult.perfil}</span>
                </div>

                <div className="profile-percentages">
                    <div className="percentage-bar">
                        <span>Visual</span>
                        <div className="bar-container">
                            <div className="bar-fill" style={{ width: `${testResult.porcentajes?.visual || 0}%`, background: '#4DA8C4' }} />
                        </div>
                        <span className="percentage">{testResult.porcentajes?.visual || 0}%</span>
                    </div>
                    <div className="percentage-bar">
                        <span>Auditivo</span>
                        <div className="bar-container">
                            <div className="bar-fill" style={{ width: `${testResult.porcentajes?.auditivo || 0}%`, background: '#66CCCC' }} />
                        </div>
                        <span className="percentage">{testResult.porcentajes?.auditivo || 0}%</span>
                    </div>
                    <div className="percentage-bar">
                        <span>Kinestésico</span>
                        <div className="bar-container">
                            <div className="bar-fill" style={{ width: `${testResult.porcentajes?.kinestesico || 0}%`, background: '#004B63' }} />
                        </div>
                        <span className="percentage">{testResult.porcentajes?.kinestesico || 0}%</span>
                    </div>
                </div>
            </div>

            <div className="profile-grid">
                <div className="profile-card">
                    <h4><i className="fa-solid fa-star" style={{ color: '#10B981' }} /> Fortalezas</h4>
                    <ul>
                        {testResult.fortalezas?.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
                <div className="profile-card">
                    <h4><i className="fa-solid fa-chart-line" style={{ color: '#F59E0B' }} /> Áreas de Mejora</h4>
                    <ul>
                        {testResult.areasMejora?.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                </div>
                <div className="profile-card full">
                    <h4><i className="fa-solid fa-lightbulb" style={{ color: '#4DA8C4' }} /> Estrategias de Estudio</h4>
                    <ul className="recommendations">
                        {testResult.recomendaciones?.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}
