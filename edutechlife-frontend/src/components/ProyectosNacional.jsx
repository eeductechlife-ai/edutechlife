const ProyectosNacional = ({ onBack }) => {
  return (
    <div className="pillar-page">
      <header className="pillar-header">
        <button onClick={onBack} className="back-btn">
          <i className="fa-solid fa-arrow-left" />
          <span>Volver</span>
        </button>
        <div
          className="pillar-badge"
          style={{ background: "linear-gradient(135deg, #004B63, #4DA8C4)" }}
        >
          <i className="fa-solid fa-award" />
          <span>PILAR 02</span>
        </div>
      </header>

      <div
        className="pillar-hero"
        style={{
          background: "linear-gradient(135deg, #004B63 0%, #0B2A3A 100%)",
        }}
      >
        <div className="pillar-hero-content">
          <div className="pillar-kicker">PROYECTOS DE IMPACTO NACIONAL</div>
          <h1 className="pillar-title" style={{ color: "white" }}>
            Trabajamos en el proyecto SenaTIC
          </h1>
          <p
            className="pillar-subtitle"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Más de 6.000 estudiantes certificados en el proyecto SenaTIC, en un
            curso de Coursera con certificado de IBM.
          </p>
          <div className="pillar-stats">
            <div className="pillar-stat">
              <span
                className="pillar-stat-value"
                style={{
                  background: "linear-gradient(135deg, #fff, #B2D8E5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                6,000+
              </span>
              <span
                className="pillar-stat-label"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Estudiantes certificados en el proyecto SenaTIC
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pillar-content">
        <div className="proyectos-grid">
          <div className="proyecto-card">
            <div
              className="proyecto-header"
              style={{
                background: "linear-gradient(135deg, #4DA8C420, #4DA8C405)",
              }}
            >
              <div className="proyecto-icon" style={{ background: "#4DA8C4" }}>
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <span className="proyecto-tag">Proyecto SenaTIC</span>
            </div>
            <h3>Proyecto SenaTIC</h3>
            <p>
              Trabajamos en el proyecto SenaTIC. Sus estudiantes certificados lo
              hicieron en un curso de Coursera con certificado de IBM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProyectosNacional;
