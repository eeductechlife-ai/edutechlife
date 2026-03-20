import { useState } from 'react';

const ProyectosNacional = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('proyectos');

    const proyectos = [
        {
            id: 1,
            title: 'SenaTIC Certification Program',
            desc: 'Programa de certificación oficial para operadores tecnológicos del SENA.',
            stats: { estudiantes: '6,000+', certificaciones: '12,000+', cobertura: '32 deptos' },
            icon: 'fa-graduation-cap',
            color: '#4DA8C4'
        },
        {
            id: 2,
            title: 'IBM Academic Initiative',
            desc: 'Alianza con IBM para formación en Watson y herramientas de IA educativa.',
            stats: { cursos: '45+', horas: '1,200+', partners: '8' },
            icon: 'fa-microchip',
            color: '#004B63'
        },
        {
            id: 3,
            title: 'Coursera Campus',
            desc: 'Acceso ilimitado a certificaciones internacionales de las mejores universidades.',
            stats: { carreras: '180+', universidades: '40+', paises: '200+' },
            icon: 'fa-globe',
            color: '#66CCCC'
        },
        {
            id: 4,
            title: 'MinTIC Colombia Digital',
            desc: 'Programa nacional de transformación digital educativa.',
            stats: { municipios: '1,100+', instituciones: '500+', beneficiarios: '50,000+' },
            icon: 'fa-landmark',
            color: '#B2D8E5'
        },
    ];

    const estadisticas = [
        { value: '6,000+', label: 'Estudiantes Certificados', icon: 'fa-user-graduate' },
        { value: '12,000+', label: 'Certificaciones Emitidas', icon: 'fa-certificate' },
        { value: '200+', label: 'Docentes Transformados', icon: 'fa-chalkboard-teacher' },
        { value: '40+', label: 'Alianzas Estratégicas', icon: 'fa-handshake' },
    ];

    const testimonios = [
        { nombre: 'María Elena Gómez', rol: 'Docente I.E. San José', texto: 'Gracias a la metodología VAK pude transformar mis clases y alcanzar a estudiantes que antes no conectaban con el contenido.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
        { nombre: 'Carlos Andrés Ríos', rol: 'Estudiante SenaTIC 2024', texto: 'La certificación de IBM fue un diferenciador enorme en mi hoja de vida. Hoy trabajo en una multinacional.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { nombre: 'Laura Patricia Vega', rol: 'Rectora I.E. Normal Superior', texto: 'La consultoría B2B transformó nuestra institución. Los resultados en pruebas Saber mejoraron un 35%.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
    ];

    return (
        <div className="pillar-page">
            <header className="pillar-header">
                <button onClick={onBack} className="back-btn">
                    <i className="fa-solid fa-arrow-left" />
                    <span>Volver</span>
                </button>
                <div className="pillar-badge" style={{ background: 'linear-gradient(135deg, #004B63, #4DA8C4)' }}>
                    <i className="fa-solid fa-award" />
                    <span>PILAR 02</span>
                </div>
            </header>

            <div className="pillar-hero" style={{ background: 'linear-gradient(135deg, #004B63 0%, #0B2A3A 100%)' }}>
                <div className="pillar-hero-content">
                    <div className="pillar-kicker">PROYECTOS DE IMPACTO NACIONAL</div>
                    <h1 className="pillar-title" style={{ color: 'white' }}>Certificaciones con Respaldo Internacional</h1>
                    <p className="pillar-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Operadores oficiales SenaTIC · Certificaciones IBM y Coursera · 
                        Transformación digital de instituciones educativas en Colombia.
                    </p>
                    <div className="pillar-stats">
                        {estadisticas.map((s, i) => (
                            <div key={i} className="pillar-stat">
                                <span className="pillar-stat-value" style={{ background: 'linear-gradient(135deg, #fff, #B2D8E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</span>
                                <span className="pillar-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pillar-tabs">
                <button className={`tab-btn ${activeTab === 'proyectos' ? 'active' : ''}`} onClick={() => setActiveTab('proyectos')}>
                    <i className="fa-solid fa-folder-open" />
                    Programas
                </button>
                <button className={`tab-btn ${activeTab === 'estadisticas' ? 'active' : ''}`} onClick={() => setActiveTab('estadisticas')}>
                    <i className="fa-solid fa-chart-bar" />
                    Estadísticas
                </button>
                <button className={`tab-btn ${activeTab === 'testimonios' ? 'active' : ''}`} onClick={() => setActiveTab('testimonios')}>
                    <i className="fa-solid fa-comments" />
                    Testimonios
                </button>
            </div>

            <div className="pillar-content">
                {activeTab === 'proyectos' && (
                    <div className="proyectos-grid">
                        {proyectos.map((p) => (
                            <div key={p.id} className="proyecto-card">
                                <div className="proyecto-header" style={{ background: `linear-gradient(135deg, ${p.color}20, ${p.color}05)` }}>
                                    <div className="proyecto-icon" style={{ background: p.color }}>
                                        <i className={`fa-solid ${p.icon}`} />
                                    </div>
                                    <span className="proyecto-tag">Certificación Oficial</span>
                                </div>
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                                <div className="proyecto-stats">
                                    {Object.entries(p.stats).map(([key, val]) => (
                                        <div key={key} className="proyecto-stat">
                                            <span className="stat-value">{val}</span>
                                            <span className="stat-key">{key}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="explore-btn">
                                    <span>Explorar</span>
                                    <i className="fa-solid fa-arrow-right" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'estadisticas' && (
                    <div className="stats-section-page">
                        <div className="stats-hero-card">
                            <h2>Impacto Nacional 2024</h2>
                            <p>Resultados del programa de transformación educativa</p>
                        </div>
                        <div className="stats-grid">
                            <div className="big-stat-card">
                                <div className="big-number">6,000+</div>
                                <div className="big-label">Estudiantes certificados en 2024</div>
                                <div className="stat-progress">
                                    <div className="progress-bar" style={{ width: '85%' }} />
                                    <span>Meta 2025: 8,000+</span>
                                </div>
                            </div>
                            <div className="stats-mini-grid">
                                <div className="mini-stat">
                                    <i className="fa-solid fa-map-marker-alt" />
                                    <span className="mini-value">32</span>
                                    <span className="mini-label">Departamentos</span>
                                </div>
                                <div className="mini-stat">
                                    <i className="fa-solid fa-building" />
                                    <span className="mini-value">200+</span>
                                    <span className="mini-label">Instituciones</span>
                                </div>
                                <div className="mini-stat">
                                    <i className="fa-solid fa-clock" />
                                    <span className="mini-value">1,200h</span>
                                    <span className="mini-label">Formación</span>
                                </div>
                                <div className="mini-stat">
                                    <i className="fa-solid fa-star" />
                                    <span className="mini-value">4.8/5</span>
                                    <span className="mini-label">Satisfacción</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'testimonios' && (
                    <div className="testimonios-section">
                        {testimonios.map((t, i) => (
                            <div key={i} className="testimonio-card">
                                <div className="testimonio-header">
                                    <img src={t.img} alt={t.nombre} />
                                    <div>
                                        <h4>{t.nombre}</h4>
                                        <span>{t.rol}</span>
                                    </div>
                                </div>
                                <p>"{t.texto}"</p>
                                <div className="testimonio-rating">
                                    {[1,2,3,4,5].map(s => <i key={s} className="fa-solid fa-star" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProyectosNacional;
