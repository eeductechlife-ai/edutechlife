import { useState } from 'react';

const ProyectosNacional = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('proyectos');
    const [selectedCert, setSelectedCert] = useState(null);
    const [enrollForm, setEnrollForm] = useState({ name: '', email: '', institution: '', program: '' });
    const [enrollSubmitted, setEnrollSubmitted] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);

    const proyectos = [
        {
            id: 1,
            title: 'SenaTIC Certification Program',
            desc: 'Programa de certificación oficial para operadores tecnológicos del SENA.',
            stats: { estudiantes: '6,000+', certificaciones: '12,000+', cobertura: '32 deptos' },
            icon: 'fa-graduation-cap',
            color: '#4DA8C4',
            duration: '6 meses',
            modules: ['Fundamentos de TI', 'Metodologías Ágiles', 'Gestión de Proyectos', 'Evaluación de Competencias'],
            certification: 'Técnico en Operación de Centros de Datos'
        },
        {
            id: 2,
            title: 'IBM Academic Initiative',
            desc: 'Alianza con IBM para formación en Watson y herramientas de IA educativa.',
            stats: { cursos: '45+', horas: '1,200+', partners: '8' },
            icon: 'fa-microchip',
            color: '#004B63',
            duration: '4 meses',
            modules: ['IBM Watson Fundamentals', 'AI for Education', 'Data Analytics', 'Cloud Computing Basics'],
            certification: 'IBM AI Practitioner'
        },
        {
            id: 3,
            title: 'Coursera Campus',
            desc: 'Acceso ilimitado a certificaciones internacionales de las mejores universidades.',
            stats: { carreras: '180+', universidades: '40+', paises: '200+' },
            icon: 'fa-globe',
            color: '#66CCCC',
            duration: 'Variable',
            modules: ['Profesionalización', 'Especialización', 'Diplomados', 'Maestrías'],
            certification: 'Certificado Internacional'
        },
        {
            id: 4,
            title: 'MinTIC Colombia Digital',
            desc: 'Programa nacional de transformación digital educativa.',
            stats: { municipios: '1,100+', instituciones: '500+', beneficiarios: '50,000+' },
            icon: 'fa-landmark',
            color: '#B2D8E5',
            duration: '8 meses',
            modules: ['Transformación Digital', 'Gobierno Digital', 'Competencias Digitales', 'Innovación Educativa'],
            certification: 'Especialista en Gobierno Digital'
        },
    ];

    const estadisticas = [
        { value: '6,000+', label: 'Estudiantes Certificados', icon: 'fa-user-graduate' },
        { value: '12,000+', label: 'Certificaciones Emitidas', icon: 'fa-certificate' },
        { value: '200+', label: 'Docentes Transformados', icon: 'fa-chalkboard-teacher' },
        { value: '40+', label: 'Alianzas Estratégicas', icon: 'fa-handshake' },
    ];

    const testimonios = [
        { nombre: 'María Elena Gómez', rol: 'Docente I.E. San José', texto: 'Gracias a la metodología VAK pude transformar mis clases y alcanzar a estudiantes que antes no conectaban con el contenido.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100', programa: 'SenaTIC 2024' },
        { nombre: 'Carlos Andrés Ríos', rol: 'Estudiante SenaTIC 2024', texto: 'La certificación de IBM fue un diferenciador enorme en mi hoja de vida. Hoy trabajo en una multinacional.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', programa: 'IBM Academic' },
        { nombre: 'Laura Patricia Vega', rol: 'Rectora I.E. Normal Superior', texto: 'La consultoría B2B transformó nuestra institución. Los resultados en pruebas Saber mejoraron un 35%.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', programa: 'Consultoría B2B' },
        { nombre: 'Pedro Antonio Muñoz', rol: 'Coordinador TIC', texto: 'El programa MinTIC cambió completamente nuestra forma de enseñar. Ahora nuestros estudiantes están mejor preparados para el mundo digital.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', programa: 'MinTIC 2024' },
    ];

    const successStories = [
        { institution: 'I.E. San José - Bogotá', result: '+45% desempeño en pruebas Saber', year: '2024' },
        { institution: 'I.E. Normal Superior - Medellín', result: '120 docentes certificados', year: '2024' },
        { institution: 'Centro Tecnológico del Valle', result: '98% empleabilidad de egresados', year: '2023' },
    ];

    const handleEnroll = async (e) => {
        e.preventDefault();
        setEnrollLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setEnrollSubmitted(true);
        setEnrollLoading(false);
    };

    const handleEnrollChange = (field, value) => {
        setEnrollForm(prev => ({ ...prev, [field]: value }));
    };

    const resetEnroll = () => {
        setEnrollSubmitted(false);
        setEnrollForm({ name: '', email: '', institution: '', program: '' });
    };

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
                <button className={`tab-btn ${activeTab === 'inscripcion' ? 'active' : ''}`} onClick={() => setActiveTab('inscripcion')}>
                    <i className="fa-solid fa-pen-to-square" />
                    Inscribirme
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
                                <div className="program-meta">
                                    <i className="fa-solid fa-clock" />
                                    <span>{p.duration}</span>
                                </div>
                                <button className="explore-btn" onClick={() => setSelectedCert(p)}>
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
                                    <div className="progress-bar" style={{ width: '75%' }} />
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
                        <div className="dashboard-section">
                            <h3 className="dashboard-title">Historias de Éxito</h3>
                            <div className="success-stories">
                                {successStories.map((story, i) => (
                                    <div key={i} className="success-story-card">
                                        <div className="story-badge">{story.year}</div>
                                        <h4>{story.institution}</h4>
                                        <p>{story.result}</p>
                                    </div>
                                ))}
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
                                <div className="testimonio-programa">
                                    <i className="fa-solid fa-certificate" />
                                    <span>{t.programa}</span>
                                </div>
                                <p>"{t.texto}"</p>
                                <div className="testimonio-rating">
                                    {[1,2,3,4,5].map(s => <i key={s} className="fa-solid fa-star" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'inscripcion' && (
                    <div className="enroll-section">
                        {!enrollSubmitted ? (
                            <div className="enroll-card">
                                <div className="enroll-header">
                                    <i className="fa-solid fa-user-graduate" />
                                    <h2>Formulario de Inscripción</h2>
                                    <p>Completa tus datos para iniciar tu proceso de certificación</p>
                                </div>
                                <form onSubmit={handleEnroll} className="enroll-form">
                                    <div className="form-group">
                                        <label>Nombre Completo</label>
                                        <input 
                                            type="text" 
                                            value={enrollForm.name}
                                            onChange={(e) => handleEnrollChange('name', e.target.value)}
                                            placeholder="Ej: María Elena Gómez"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Correo Electrónico</label>
                                        <input 
                                            type="email" 
                                            value={enrollForm.email}
                                            onChange={(e) => handleEnrollChange('email', e.target.value)}
                                            placeholder="Ej: maria.gomez@email.com"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Institución / Empresa</label>
                                        <input 
                                            type="text" 
                                            value={enrollForm.institution}
                                            onChange={(e) => handleEnrollChange('institution', e.target.value)}
                                            placeholder="Ej: I.E. San José"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Programa de Interés</label>
                                        <select 
                                            value={enrollForm.program}
                                            onChange={(e) => handleEnrollChange('program', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona un programa</option>
                                            <option value="senatic">SenaTIC Certification Program</option>
                                            <option value="ibm">IBM Academic Initiative</option>
                                            <option value="coursera">Coursera Campus</option>
                                            <option value="mintic">MinTIC Colombia Digital</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="enroll-submit" disabled={enrollLoading}>
                                        {enrollLoading ? (
                                            <>
                                                <span className="spinner" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-paper-plane" />
                                                Enviar Solicitud
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="enroll-success">
                                <div className="success-icon">
                                    <i className="fa-solid fa-check" />
                                </div>
                                <h2>¡Solicitud Enviada!</h2>
                                <p>Te hemos enviado un correo de confirmación. Un asesor se pondrá en contacto contigo en las próximas 48 horas.</p>
                                <button className="reset-btn" onClick={resetEnroll}>
                                    <i className="fa-solid fa-plus" />
                                    Realizar otra inscripción
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedCert && (
                <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
                    <div className="modal-content cert-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedCert(null)}>
                            <i className="fa-solid fa-xmark" />
                        </button>
                        <div className="modal-header" style={{ background: `linear-gradient(135deg, ${selectedCert.color}40, ${selectedCert.color}10)` }}>
                            <div className="modal-icon" style={{ background: selectedCert.color }}>
                                <i className={`fa-solid ${selectedCert.icon}`} />
                            </div>
                            <div>
                                <span className="modal-badge">Certificación Oficial</span>
                                <h2>{selectedCert.title}</h2>
                            </div>
                        </div>
                        <div className="modal-body">
                            <p className="modal-desc">{selectedCert.desc}</p>
                            <div className="modal-meta">
                                <div className="meta-item">
                                    <i className="fa-solid fa-clock" />
                                    <span>Duración: {selectedCert.duration}</span>
                                </div>
                                <div className="meta-item">
                                    <i className="fa-solid fa-certificate" />
                                    <span>Certificación: {selectedCert.certification}</span>
                                </div>
                            </div>
                            <div className="modal-modules">
                                <h3>Módulos del Programa</h3>
                                <div className="modules-list">
                                    {selectedCert.modules.map((mod, i) => (
                                        <div key={i} className="module-item">
                                            <span className="module-number">{String(i + 1).padStart(2, '0')}</span>
                                            <span>{mod}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-stats">
                                {Object.entries(selectedCert.stats).map(([key, val]) => (
                                    <div key={key} className="modal-stat">
                                        <span className="modal-stat-value">{val}</span>
                                        <span className="modal-stat-key">{key}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="modal-cta" onClick={() => { setSelectedCert(null); setActiveTab('inscripcion'); }}>
                                <i className="fa-solid fa-pen-to-square" />
                                Inscribirme en este programa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProyectosNacional;
