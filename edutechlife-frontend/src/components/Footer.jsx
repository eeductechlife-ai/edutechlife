import { useState } from 'react';
import { Icon } from '../utils/iconMapping.jsx';

const socialLinks = [
  { icon: 'fa-brands fa-facebook-f', label: 'Facebook', href: 'https://web.facebook.com/eductechlife/' },
  { icon: 'fa-brands fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/edu_techlife/' },
  { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/edutechlife' },
  { icon: 'fa-brands fa-youtube', label: 'YouTube', href: 'https://www.youtube.com/@edutechlife' },
];

const toolLinks = [
  { label: 'IA Lab con Valerio', view: 'ialab' },
  { label: 'SmartBoard', view: 'neuroentorno' },
  { label: 'Diagnóstico VAK', view: 'vak' },
  { label: 'ROI Calculator', view: 'consultoria' },
  { label: 'Automation Architect', view: 'automation' },
];

const resourceLinks = [
  { label: 'Metodología VAK', action: 'vak' },
  { label: 'Proyectos SenaTIC', view: 'proyectos' },
  { label: 'Certificaciones', action: 'certificaciones' },
  { label: 'Blog Educativo', action: 'blog' },
  { label: 'Documentación', action: 'documentacion' },
];

const legalLinks = [
  { label: 'Política de Privacidad', action: 'privacidad' },
  { label: 'Términos de Uso', action: 'terminos' },
  { label: 'Contacto', action: 'contacto' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }
    
    setEmailError(false);
    setSubscribed(true);
    setEmail('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(false);
  };

  const navigateTo = (view) => {
    if (view) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: view }));
    }
  };

  const handleResourceClick = (item) => {
    if (item.view) {
      navigateTo(item.view);
    } else if (item.action) {
      openModal(item.action);
    }
  };

  return (
    <>
      <footer className="relative w-full z-50 mt-auto" style={{ backgroundColor: '#004B63' }}>
      
      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          
          {/* Columna 1 - Brand & Social */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="mb-3">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-6 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            
            {/* Descripción */}
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Transformando la educación con inteligencia artificial y metodologías pedagógicas de vanguardia para el futuro digital.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4DA8C4';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Icon name={social.icon} className="text-base" style={{ color: '#FFFFFF' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2 - Herramientas */}
          <div>
            <h4 
              className="text-sm font-semibold uppercase tracking-wider mb-4 pb-2"
              style={{ color: '#4DA8C4', borderBottom: '2px solid #4DA8C4' }}
            >
              Herramientas
            </h4>
            <ul className="space-y-2.5">
              {toolLinks.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigateTo(item.view)}
                    className="flex items-center gap-2 group w-full text-left text-sm transition-all duration-200"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '0',
                      boxShadow: 'none',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4DA8C4';
                      e.currentTarget.style.paddingLeft = '4px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <Icon name="fa-chevron-right" className="text-xs" style={{ color: '#4DA8C4' }} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Recursos */}
          <div>
            <h4 
              className="text-sm font-semibold uppercase tracking-wider mb-4 pb-2"
              style={{ color: '#4DA8C4', borderBottom: '2px solid #4DA8C4' }}
            >
              Recursos
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleResourceClick(item)}
                    className="flex items-center gap-2 group w-full text-left text-sm transition-all duration-200"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '0',
                      boxShadow: 'none',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4DA8C4';
                      e.currentTarget.style.paddingLeft = '4px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <Icon name="fa-chevron-right" className="text-xs" style={{ color: '#4DA8C4' }} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 - Newsletter */}
          <div>
            <h4 
              className="text-base font-bold mb-3"
              style={{ color: '#FFFFFF' }}
            >
              Newsletter
            </h4>
            <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Recibe novedades educativas y actualizaciones de la plataforma.
            </p>
            
            {subscribed ? (
              /* Estado de éxito */
              <div 
                className="rounded-xl p-5 text-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: '#4DA8C4' }}
                >
                  <Icon name="fa-check" className="text-xl" style={{ color: '#FFFFFF' }} />
                </div>
                <p className="text-base font-semibold" style={{ color: '#FFFFFF' }}>
                  ¡Gracias por suscribirte!
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Te mantendremos informado
                </p>
              </div>
            ) : (
              /* Formulario de suscripción */
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#374151',
                      border: '2px solid transparent',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4DA8C4';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                    }}
                  />
                  {emailError && (
                    <p className="text-xs mt-1" style={{ color: '#FF6B9D' }}>
                      Ingresa un email válido
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(to right, #004B63, #4DA8C4)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(77, 168, 196, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(77, 168, 196, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(77, 168, 196, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ color: '#FFFFFF' }}>Suscribirme</span>
                  <Icon name="fa-paper-plane" className="text-xs" style={{ color: '#FFFFFF' }} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divisor */}
        <div 
          className="h-px w-full mb-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: '#4DA8C4' }}
            />
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              © 2026 Edutechlife Premium. Todos los derechos reservados.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
              {legalLinks.map((item, index) => (
                <button
                  key={index}
                  onClick={() => openModal(item.action)}
                  className="text-sm transition-all duration-200 hover:underline"
                  style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'none', border: 'none', padding: 0 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4DA8C4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </footer>

    {/* Modales de Recursos */}
    {activeModal === 'vak' && (
      <ModalVAK onClose={closeModal} />
    )}
    {activeModal === 'certificaciones' && (
      <ModalCertificaciones onClose={closeModal} />
    )}
    {activeModal === 'blog' && (
      <ModalBlog onClose={closeModal} />
    )}
    {activeModal === 'documentacion' && (
      <ModalDocumentacion onClose={closeModal} />
    )}
    {activeModal === 'privacidad' && (
      <ModalPrivacidad onClose={closeModal} />
    )}
    {activeModal === 'terminos' && (
      <ModalTerminos onClose={closeModal} />
    )}
    {activeModal === 'contacto' && (
      <ModalContacto onClose={closeModal} />
    )}
    </>
  );
}

function ModalVAK({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ color: '#004B63' }}>
          <Icon name="fa-xmark" className="text-xl" />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#004B63' }}>
            <Icon name="fa-brain" className="text-2xl" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>Metodología VAK</h2>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>Aprendizaje Visual, Auditivo y Kinestésico</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            La metodología VAK identifica el estilo de aprendizaje predominante de cada estudiante, permitiendo una educación personalizada que maximiza el potencial cognitivo y la retención de conocimiento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
              <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                <Icon name="fa-eye" className="text-lg" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#004B63' }}>Visual</h3>
              <p className="text-sm text-gray-600">Aprende mejor con imágenes, diagramas y videos. Recuerda lo que ve.</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
              <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                <Icon name="fa-headphones" className="text-lg" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#004B63' }}>Auditivo</h3>
              <p className="text-sm text-gray-600">Aprende mejor escuchando, discutiendo y explicando conceptos en voz alta.</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
              <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                <Icon name="fa-hand" className="text-lg" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#004B63' }}>Kinestésico</h3>
              <p className="text-sm text-gray-600">Aprende mejor haciendo, tocando y experimentando con materiales prácticos.</p>
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{ backgroundColor: '#004B63' }}>
            <h3 className="font-semibold mb-2 text-white">Diagnóstico VAK en Edutechlife</h3>
            <p className="text-sm text-white/80">
              Realiza nuestro diagnóstico gratuito para descubrir tu estilo de aprendizaje y recibir recomendaciones personalizadas de estudio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalCertificaciones({ onClose }) {
  const certificaciones = [
    { titulo: 'Certificación en IA Educativa', descripcion: 'Implementación de inteligencia artificial en entornos pedagógicos', nivel: 'Avanzado' },
    { titulo: 'Metodología VAK Premium', descripcion: 'Dominio de técnicas de aprendizaje multimodal', nivel: 'Intermedio' },
    { titulo: 'EdTech Integration Specialist', descripcion: 'Integración de herramientas tecnológicas en el aula', nivel: 'Básico' },
    { titulo: 'SmartBoard Master', descripcion: 'Certificación en pizarras interactivas inteligentes', nivel: 'Intermedio' },
    { titulo: 'Neuroentorno Educativo', descripcion: 'Diseño de ambientes de aprendizaje basados en neurociencia', nivel: 'Avanzado' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ color: '#004B63' }}>
          <Icon name="fa-xmark" className="text-xl" />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#004B63' }}>
            <Icon name="fa-certificate" className="text-2xl" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>Certificaciones</h2>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>Reconocimiento oficial de competencias</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">
            Obtén certificaciones reconocidas que validan tus competencias en tecnologías educativas y metodologías pedagógicas de vanguardia.
          </p>

          {certificaciones.map((cert, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer"
              style={{ borderColor: '#E8F4F8', backgroundColor: '#FAFDFF' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: '#004B63' }}>{cert.titulo}</h3>
                  <p className="text-sm text-gray-600 mt-1">{cert.descripcion}</p>
                </div>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#E8F4F8', color: '#004B63' }}
                >
                  {cert.nivel}
                </span>
              </div>
            </div>
          ))}

          <div className="mt-6 p-5 rounded-xl text-center" style={{ backgroundColor: '#004B63' }}>
            <p className="text-white font-medium mb-2">¿Interesado en certificarte?</p>
            <p className="text-sm text-white/80">Contáctanos para más información sobre próximos programas de certificación.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalBlog({ onClose }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articulos = [
    { 
      id: 'ia-educacion',
      titulo: 'El futuro de la IA en la educación', 
      fecha: '15 Mar 2026', 
      categoria: 'Inteligencia Artificial',
      autor: 'Dr. Carlos Mendoza',
      tiempoLectura: '8 min'
    },
    { 
      id: 'vak-aula',
      titulo: 'Cómo implementar VAK en el aula', 
      fecha: '10 Mar 2026', 
      categoria: 'Metodología',
      autor: 'Lic. Ana Sofía Torres',
      tiempoLectura: '6 min'
    },
    { 
      id: 'smartboard',
      titulo: 'SmartBoard: Guía completa 2026', 
      fecha: '5 Mar 2026', 
      categoria: 'Herramientas',
      autor: 'Ing. Roberto Chen',
      tiempoLectura: '7 min'
    },
    { 
      id: 'neurociencia',
      titulo: 'Neurociencia y aprendizaje efectivo', 
      fecha: '28 Feb 2026', 
      categoria: 'Neuroentorno',
      autor: 'Dra. Patricia Vázquez',
      tiempoLectura: '9 min'
    },
    { 
      id: 'automatizacion',
      titulo: 'Automatización de procesos educativos', 
      fecha: '20 Feb 2026', 
      categoria: 'Automation',
      autor: 'Mg. Luis Hernández',
      tiempoLectura: '5 min'
    },
  ];

  const getArticleContent = (id) => {
    const contents = {
      'ia-educacion': {
        titulo: 'El futuro de la IA en la educación',
        imagen: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        introduccion: 'La inteligencia artificial está transformando radicalmente el panorama educativo mundial. Según el informe de UNESCO 2025, el 85% de las instituciones educativas implementarán alguna forma de IA para 2027, representando un mercado de $400 mil millones.',
        secciones: [
          {
            titulo: 'Adopción Global de IA en Educación',
            contenido: 'Los datos demuestran un crecimiento exponencial en la adopción de tecnologías de IA en el sector educativo. Un estudio de HolonIQ revela que la inversión en EdTech alcanzó $18.2 mil millones en 2024, con proyecciones de alcanzar $400 mil millones para 2027.',
            grafica: 'linea',
            datos: [
              { anio: '2023', valor: 95 },
              { anio: '2024', valor: 142 },
              { anio: '2025', valor: 220 },
              { anio: '2026', valor: 310 },
              { anio: '2027', valor: 400 }
            ],
            unidad: 'Miles de millones USD'
          },
          {
            titulo: 'Casos de Éxito en Universidades Top',
            contenido: 'Las universidades líderes han implementado IA con resultados extraordinarios. Stanford reportó una mejora del 35% en retención estudiantil mediante sistemas de tutoring con IA. MIT desarrolló algoritmos que predicen con 90% de precisión estudiantes en riesgo de deserción.',
            grafica: 'barras',
            datos: [
              { categoria: 'Stanford', mejora: 35 },
              { categoria: 'MIT', mejora: 28 },
              { categoria: 'Oxford', mejora: 32 },
              { categoria: 'Harvard', mejora: 40 },
              { categoria: 'Cambridge', mejora: 25 }
            ],
            unidad: '% Mejora en retención'
          },
          {
            titulo: 'Impacto en el Aprendizaje',
            contenido: 'Los estudios demeta-análisis muestran que los estudiantes que utilizan herramientas de IA mejoran su rendimiento académico en un promedio del 25%. La personalización del aprendizaje, impossible de lograr a escala sin IA, permite adaptar el contenido al ritmo de cada estudiante.'
          },
          {
            titulo: 'Tendencias 2026-2030',
            contenido: 'Las predicciones de Gartner indican que para 2030, la IA será responsable del 40% de las tareas administrativas educativas, liberando a los docentes para enfocarse en la mentoría y desarrollo socioemocional de los estudiantes.'
          }
        ],
        conclusion: 'La IA no reemplazará a los educadores, pero aquellos que dominen las herramientas de IA reemplazarán a quienes no lo hagan. La transformación digital en educación es inevitable, y las instituciones que lideren esta adopción definirán el futuro del aprendizaje.'
      },
      'vak-aula': {
        titulo: 'Cómo implementar VAK en el aula',
        imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
        introduccion: 'La metodología VAK (Visual, Auditivo, Kinestésico) identifica el estilo de aprendizaje predominante de cada estudiante. Investigaciones de la Universidad de Harvard demuestran que personalizar la enseñanza según el estilo de aprendizaje mejora la retención de información en un 30%.',
        secciones: [
          {
            titulo: 'Los Tres Estilos de Aprendizaje',
            contenido: 'Según el modelo de Neil Fleming, existen tres canales principales de percepción: Visual (aprenden viendo), Auditivo (aprenden escuchando) y Kinestésico (aprenden haciendo). La mayoría de personas tienen una combinación, aunquepredomina un estilo.',
            grafica: 'dona',
            datos: [
              { nombre: 'Visual', valor: 45 },
              { nombre: 'Auditivo', valor: 30 },
              { nombre: 'Kinestésico', valor: 25 }
            ],
            unidad: '% Población'
          },
          {
            titulo: 'Paso 1: Diagnóstico Inicial',
            contenido: 'Antes de implementar VAK, es fundamental identificar el estilo predominante de cada estudiante. El diagnóstico debe incluir: observación comportamental, cuestionario de preferencias y análisis de rendimiento académico en diferentes actividades.',
            imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop'
          },
          {
            titulo: 'Paso 2: Diseño de Actividades Multimodales',
            contenido: 'Cada lección debe incluir actividades para los tres estilos. Para contenido sobre la Revolución Francesa: Visual (mapas conceptuales, líneas de tiempo), Auditivo (debates, podcasts, lectura en voz alta), Kinestésico (dramatización, simulaciones).',
            lista: [
              'Proporcionar diagramas y infografías para aprendices visuales',
              'Incluir podcasts y discusión grupal para auditivos',
              'Diseñar experimentos y proyectos prácticos para kinestésicos'
            ]
          },
          {
            titulo: 'Paso 3: Evaluación Adaptativa',
            contenido: 'Las evaluaciones deben permitir demostrar conocimiento de múltiples formas: presentación oral (auditivo), informe escrito con gráficos (visual), proyecto práctico (kinestésico). Esto permite que cada estudiante muestre su verdadero dominio.',
            grafica: 'barras',
            datos: [
              { categoria: 'Tradicional', retention: 40 },
              { categoria: 'VAK', retention: 70 }
            ],
            unidad: '% Retención'
          },
          {
            titulo: 'Resultados Esperados',
            contenido: 'Estudios longitudinales en escuelas que implementaron VAK durante 3 años muestran: 30% mayor retención de información, 25% mejora en evaluaciones estandarizadas, 40% reducción en comportamientos disruptivos, 35% aumento en motivación estudiantil.'
          }
        ],
        conclusion: 'Implementar VAK no requiere tecnología avanzada, sino un cambio metodológico. Los docentes deben diseñar experiencias diversificadas que reach a todos los estilos, monitorear resultados y ajustar estrategias continuamente.'
      },
      'smartboard': {
        titulo: 'SmartBoard: Guía completa 2026',
        imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        introduccion: 'Las pizarras interactivas inteligentes han evolucionado significativamente. Según el informe de EdTech Magazine 2025, las instituciones que implementaron SmartBoards reportan un 40% increase en participación estudiantil y 28% mejora en comprensión de conceptos complejos.',
        secciones: [
          {
            titulo: 'Evolución Tecnológica 2024-2026',
            contenido: 'Los SmartBoards modernos incorporan: pantallas 4K con táctil de precisión, integración con IA para reconocimiento de escritura, conectividad con dispositivos móviles, software de colaboración en tiempo real y análisis de engagement estudiantil.',
            grafica: 'linea',
            datos: [
              { anio: '2024', capacidad: 65 },
              { anio: '2025', capacidad: 78 },
              { anio: '2026', capacidad: 92 }
            ],
            unidad: '% Funcionalidades'
          },
          {
            titulo: 'Casos de Implementación Exitosa',
            contenido: 'El Colegio Americano de México implementó 50 SmartBoards en 2023. Resultados después de 18 meses: 42% increase en participación, 31% mejoría en matemáticas, 89% de docentes reportado satisfacción positiva.',
            grafica: 'barras',
            datos: [
              { categoria: 'Participación', antes: 45, despues: 87 },
              { categoria: 'Comprensión', antes: 52, despues: 78 },
              { categoria: 'Colaboración', antes: 38, despues: 82 }
            ],
            unidad: '%'
          },
          {
            titulo: 'Funcionalidades Esenciales 2026',
            contenido: 'Las características que todo SmartBoard debe tener incluyen: pizarra colaborativa infinita, integración con LMS institucionales, herramientas de evaluación en tiempo real, compatibilidad con dispositivos de estudiantes, análisis de patrones de atención mediante IA.',
            lista: [
              'Pizarra colaborativa con almacenamiento en la nube',
              'Integración nativa con Google Classroom y Microsoft Teams',
              'Reconocimiento de escritura a texto en tiempo real',
              'Grabación de sesiones para revisión posterior',
              'Análisis de engagement con heatmaps'
            ]
          },
          {
            titulo: 'ROI Educativo',
            contenido: 'El retorno de inversión se manifiesta en múltiples áreas: reducción de materiales didácticos físicos (-35%), mayor retención de estudiantes (-20% deserción), preparación para entornos digitales profesionales, y eficiencia en la explicación de conceptos abstractos.',
            grafica: 'barras',
            datos: [
              { categoria: 'ROI 1 año', valor: 145 },
              { categoria: 'ROI 3 años', valor: 280 },
              { categoria: 'ROI 5 años', valor: 420 }
            ],
            unidad: '%'
          }
        ],
        conclusion: 'La inversión en SmartBoards es una decisión estratégica que posiciona a las instituciones a la vanguardia de la educación digital. El costo inicial se recupera en 18-24 meses considerando todos los beneficios cuantificables.'
      },
      'neurociencia': {
        titulo: 'Neurociencia y aprendizaje efectivo',
        imagen: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop',
        introduccion: 'La neurociencia educativa ha revolucionado nuestra comprensión del aprendizaje. Investigadores de Stanford (2025) demuestran que comprender cómo funciona el cerebro permite diseñar intervenciones pedagógicas hasta 50% más efectivas.',
        secciones: [
          {
            titulo: 'Principios Fundamentales del Neuroaprendizaje',
            contenido: 'Los cuatro principios clave que todo educador debe conocer: Neuroplasticidad (el cerebro puede cambiar a cualquier edad), Consolidación de memoria (el sueño es esencial), Atención selectiva (limitada a 20 min), y Transferencia (aprender en un contexto ayuda en otros).',
            grafica: 'dona',
            datos: [
              { nombre: 'Neuroplasticidad', valor: 30 },
              { nombre: 'Consolidación', valor: 25 },
              { nombre: 'Atención', valor: 25 },
              { nombre: 'Transferencia', valor: 20 }
            ],
            unidad: 'Importancia'
          },
          {
            titulo: 'El Ciclo de Aprendizaje Neurocientífico',
            contenido: 'Basado en investigaciones de Howard Gardner y neurocientíficos de Harvard, el ciclo optimal de aprendizaje incluye: Activación de conocimientos previos (5 min), Presentación de nuevo contenido (15-20 min), Procesamiento activo (10 min), Consolidación mediante sueño o descanso.',
            imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop'
          },
          {
            titulo: 'Investigaciones Recientes (2024-2026)',
            contenido: 'Estudios de la Universidad de Cambridge (2025) demuestran que el aprendizaje interleaved (mezclar temas) mejora la retención en 43% comparado con el aprendizaje bloqueado. Otro estudio de MIT muestra que explicar conceptos a otros activa las mismas regiones cerebrales que aprenderlos.',
            grafica: 'barras',
            datos: [
              { categoria: 'Bloqueado', retention: 45 },
              { categoria: 'Interleaved', retention: 72 },
              { categoria: 'Espaciado', retention: 68 },
              { categoria: 'Activo', retention: 78 }
            ],
            unidad: '% Retención'
          },
          {
            titulo: 'Aplicaciones Pedagógicas Basadas en Evidencia',
            contenido: 'Las estrategias con mayor evidencia científica incluyen: Repetición espaciada (repasar a intervalos crecientes), Retrieval practice (recuperar información sin ayuda), Interleaving (mezclar tipos de problemas), y Generación (generar preguntas propias).',
            lista: [
              'Aplicar la regla 10-5-2: revisar a los 10 min, 5 horas, 2 días',
              'Usar preguntas de autoevaluación antes de revisar',
              'Mezclar temas diferentes en una sesión',
              'Pedir a estudiantes que generen preguntas de examen'
            ]
          },
          {
            titulo: 'Ambientes de Aprendizaje Óptimos',
            contenido: 'La investigación demuestra que factores ambientales impactan hasta 25% en el rendimiento: Iluminación natural (+15% rendimiento), Temperatura 20-24°C (pico de atención), Sonido blanco o silencio (vs música), Espacios flexibles que permitan movimiento.'
          }
        ],
        conclusion: 'La neurociencia no es solo teoría; es una guía práctica para optimizar cada aspecto del proceso educativo. Los docentes que aplican estos principios basados en evidencia ven mejoras significativas en el aprendizaje de sus estudiantes.'
      },
      'automatizacion': {
        titulo: 'Automatización de procesos educativos',
        imagen: 'https://images.unsplash.com/photo-1451015618060-fa747ccd567c?w=800&h=400&fit=crop',
        introduccion: 'La automatización en educación ya no es un lujo, es una necesidad. Según McKinsey (2025), las instituciones que automatizan procesos administrativos reducen costos operativos en un 35% y liberan 60% del tiempo de los docentes para enfocarse en la enseñanza.',
        secciones: [
          {
            titulo: 'Estado Actual de la Automatización Educativa',
            contenido: 'El informe de EDUCAUSE 2025 revela que el 67% de las universidades han implementado algún nivel de automatización, pero solo el 23% han alcanzado automatización avanzada. Las áreas con mayor adopción son: inscripciones, calificaciones y comunicaciones.',
            grafica: 'barras',
            datos: [
              { categoria: 'Inscripciones', avance: 85 },
              { categoria: 'Calificaciones', avance: 78 },
              { categoria: 'Comunicación', avance: 65 },
              { categoria: 'Evaluación', avance: 45 },
              { categoria: 'Personalización', avance: 30 }
            ],
            unidad: '% Implementación'
          },
          {
            titulo: 'Procesos con Mayor Impacto de Automatización',
            contenido: 'Identificamos los 5 procesos con mayor ROI: Envío automático de retroalimentación (ahorra 8 horas/semana), Programación inteligente de evaluaciones (reduce conflictos 90%), Seguimiento de progreso automatizado (identifica estudiantes en riesgo), Chatbots de admisión (atienden 24/7), Generación de informes institucionales.',
            lista: [
              'Feedback automático con IA personalizado',
              'Algoritmos de programación académica',
              'Dashboards de progreso estudiantil',
              'Asistentes virtuales para estudiantes',
              'Reportes automáticos para acreditación'
            ]
          },
          {
            titulo: 'Métricas de Eficiencia por Área',
            contenido: 'Las instituciones que implementaron automatización completa reportan: Admisiones -50% tiempo de procesamiento, Evaluación -70% tiempo en corrección, Comunicación -40% tiempo en notificaciones, Reporting -80% tiempo en generación de informes.',
            grafica: 'linea',
            datos: [
              { anio: '2023', tiempo: 100 },
              { anio: '2024', tiempo: 82 },
              { anio: '2025', tiempo: 58 },
              { anio: '2026', tiempo: 40 }
            ],
            unidad: '% Tiempo administrativo'
          },
          {
            titulo: 'Casos de Éxito en Instituciones',
            contenido: 'La Universidad Tecnológica de México automatizó su proceso de admisiones en 2024. Resultado: Tiempo de respuesta reducido de 15 días a 48 horas, Satisfacción de candidatos increased de 72% a 94%, Costo por admisión reducido 40%.',
            grafica: 'barras',
            datos: [
              { categoria: 'Tiempo', antes: 15, despues: 2 },
              { categoria: 'Satisfacción', antes: 72, despues: 94 },
              { categoria: 'Costo', antes: 100, despues: 60 }
            ],
            unidad: 'Días / % / %'
          },
          {
            titulo: 'Tendencias en Automatización Educativa 2026',
            contenido: 'Las tendencias emergentes incluyen: Automatización de workflows con IA generativa, Chatbots con capacidad de tutoría, Predicción de deserción con ML, Personalización masiva de rutas de aprendizaje, Integración blockchain para credenciales.'
          }
        ],
        conclusion: 'La automatización no significa menos educación personalizada; significa más tiempo para la interacción humana significativa. Las instituciones que adoptan estas herramientas tomorrow estarán mejor posicionadas para competir en un mercado educativo cada vez más digitalizado.'
      }
    };
    return contents[id] || null;
  };

  if (selectedArticle) {
    const article = getArticleContent(selectedArticle);
    if (!article) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={() => setSelectedArticle(null)}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con Logo */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-8 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="text-white font-medium text-sm">Blog Educativo</span>
            </div>
            <button 
              onClick={() => setSelectedArticle(null)} 
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
              style={{ color: '#FFFFFF' }}
            >
              <Icon name="fa-xmark" className="text-lg" />
            </button>
          </div>

          {/* Imagen de portada */}
          <div className="relative h-56 md:h-72 overflow-hidden">
            <img 
              src={article.imagen} 
              alt={article.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2" style={{ backgroundColor: '#4DA8C4', color: '#FFFFFF' }}>
                {articulos.find(a => a.id === selectedArticle)?.categoria}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{article.titulo}</h1>
            </div>
          </div>

          {/* Metadata */}
          <div className="px-6 py-4 flex flex-wrap items-center gap-4 text-sm" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="flex items-center gap-2">
              <Icon name="fa-user" className="text-sm" style={{ color: '#4DA8C4' }} />
              <span style={{ color: '#374151' }}>{articulos.find(a => a.id === selectedArticle)?.autor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="fa-calendar" className="text-sm" style={{ color: '#4DA8C4' }} />
              <span style={{ color: '#374151' }}>{articulos.find(a => a.id === selectedArticle)?.fecha}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="fa-clock" className="text-sm" style={{ color: '#4DA8C4' }} />
              <span style={{ color: '#374151' }}>{articulos.find(a => a.id === selectedArticle)?.tiempoLectura}</span>
            </div>
          </div>

          {/* Contenido */}
          <div className="px-6 md:px-10 py-6 space-y-8">
            {/* Introducción */}
            <p className="text-lg leading-relaxed" style={{ color: '#1F2937' }}>
              {article.introduccion}
            </p>

            {/* Secciones */}
            {article.secciones.map((seccion, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold" style={{ color: '#004B63' }}>{seccion.titulo}</h2>
                <p className="text-base leading-relaxed" style={{ color: '#374151' }}>{seccion.contenido}</p>

                {seccion.lista && (
                  <ul className="space-y-2 ml-4">
                    {seccion.lista.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#4DA8C4' }} />
                        <span style={{ color: '#374151' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {seccion.imagen && (
                  <img 
                    src={seccion.imagen} 
                    alt={seccion.titulo}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}

                {/* Gráficos */}
                {seccion.grafica === 'linea' && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>Evolución {seccion.unidad}</h4>
                    <div className="flex items-end justify-between h-40 gap-2">
                      {seccion.datos.map((d, i) => {
                        const max = Math.max(...seccion.datos.map(x => x.valor || x.antes || x.despues));
                        const h = ((d.valor || d.antes || d.despues) / max) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full rounded-t-md transition-all"
                              style={{ 
                                height: `${h}%`, 
                                backgroundColor: i === seccion.datos.length - 1 ? '#004B63' : '#4DA8C4' 
                              }}
                            />
                            <span className="text-xs mt-2" style={{ color: '#6B7280' }}>{d.anio}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {seccion.grafica === 'barras' && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>{seccion.unidad}</h4>
                    <div className="space-y-3">
                      {seccion.datos.map((d, i) => {
                        const max = Math.max(...seccion.datos.map(x => x.valor || x.mejora || x.mejora || x.despues || 100));
                        const val = d.valor || d.mejora || d.despues || 0;
                        const pct = (val / max) * 100;
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span style={{ color: '#374151' }}>{d.categoria}</span>
                              <span className="font-semibold" style={{ color: '#004B63' }}>{val}{seccion.unidad.includes('%') ? '%' : ''}</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, backgroundColor: '#4DA8C4' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {seccion.grafica === 'dona' && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>Distribución</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="relative w-28 h-28">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          {(() => {
                            const colors = ['#004B63', '#4DA8C4', '#66CCCC'];
                            let cumulative = 0;
                            return seccion.datos.map((d, i) => {
                              const pct = d.valor / 100;
                              const dash = pct * 100;
                              const color = colors[i % colors.length];
                              const start = cumulative * 100;
                              cumulative += pct;
                              return (
                                <circle 
                                  key={i}
                                  cx="18" cy="18" r="14"
                                  fill="none"
                                  stroke={color}
                                  strokeWidth="4"
                                  strokeDasharray={`${dash} ${100 - dash}`}
                                  strokeDashoffset={`${-start}`}
                                />
                              );
                            });
                          })()}
                        </svg>
                      </div>
                      <div className="space-y-2">
                        {seccion.datos.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 rounded-full" style={{ 
                              backgroundColor: ['#004B63', '#4DA8C4', '#66CCCC', '#88D4E5'][i] 
                            }} />
                            <span style={{ color: '#374151' }}>{d.nombre}: {d.valor}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Conclusión */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#004B63' }}>Conclusión</h3>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>{article.conclusion}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="/images/logo-edutechlife.webp" 
                  alt="Edutechlife" 
                  className="h-6 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span className="text-sm" style={{ color: '#6B7280' }}>Blog Educativo</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
              >
                Volver al blog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ color: '#004B63' }}>
          <Icon name="fa-xmark" className="text-xl" />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#004B63' }}>
            <Icon name="fa-book-open" className="text-2xl" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>Blog Educativo</h2>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>Artículos, noticias y recursos</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">
            Explora nuestros artículos más recientes sobre tendencias educativas, tecnología e innovación pedagógica.
          </p>

          {articulos.map((articulo, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer"
              style={{ borderColor: '#E8F4F8', backgroundColor: '#FAFDFF' }}
              onClick={() => setSelectedArticle(articulo.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span 
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: '#E8F4F8', color: '#004B63' }}
                >
                  {articulo.categoria}
                </span>
                <span className="text-xs text-gray-500">{articulo.fecha}</span>
              </div>
              <h3 className="font-semibold" style={{ color: '#004B63' }}>{articulo.titulo}</h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span>{articulo.autor}</span>
                <span>•</span>
                <span>{articulo.tiempoLectura}</span>
              </div>
            </div>
          ))}

          <div className="mt-6 text-center">
            <button 
              className="px-6 py-3 rounded-xl font-semibold transition-all"
              style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
            >
              Ver todos los artículos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalDocumentacion({ onClose }) {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const documentos = [
    { id: 'inicio-rapido', titulo: 'Guía de inicio rápido', descripcion: 'Primeros pasos con la plataforma', icono: 'fa-rocket', tiempo: '5 min' },
    { id: 'manual-ia', titulo: 'Manual de herramientas IA', descripcion: 'Funciones y configuración de IA Lab', icono: 'fa-robot', tiempo: '12 min' },
    { id: 'tutorial-smartboard', titulo: 'Tutorial SmartBoard', descripcion: 'Configuración y uso de pizarra interactiva', icono: 'fa-chalkboard', tiempo: '8 min' },
    { id: 'api-docs', titulo: 'API Documentation', descripcion: 'Integración con sistemas externos', icono: 'fa-code', tiempo: '15 min' },
    { id: 'faq', titulo: 'FAQ frecuentes', descripcion: 'Preguntas y respuestas comunes', icono: 'fa-circle-question', tiempo: '3 min' },
  ];

  const getDocContent = (id) => {
    const contents = {
      'inicio-rapido': {
        titulo: 'Guía de inicio rápido',
        introduccion: 'Bienvenido a Edutechlife. Esta guía te llevará a través de los primeros pasos para comenzar a utilizar la plataforma de manera efectiva. En menos de 10 minutos podrás navegar y utilizar las herramientas principales.',
        secciones: [
          {
            titulo: '1. Crear tu cuenta',
            contenido: 'El primer paso es crear tu cuenta en Edutechlife. Visita la página de registro e ingresa tu correo electrónico institucional. Recibirás un correo de verificación en menos de 2 minutos.',
            pasos: [
              'Ingresa a edutechlife.com y haz clic en "Registrarse"',
              'Ingresa tu correo electrónico institucional',
              'Crea una contraseña segura (mínimo 8 caracteres)',
              'Verifica tu correo electrónico',
              'Completa tu perfil con tu información académica'
            ]
          },
          {
            titulo: '2. Explorando el Dashboard',
            contenido: 'Una vez iniciado sesión, llegarás al Dashboard principal. Aquí encontrarás: navegación principal a la izquierda, panel de métricas en el centro, y accesos rápidos a herramientas en la parte superior.',
            imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
          },
          {
            titulo: '3. Tu primera sesión con IA Lab',
            contenido: 'IA Lab es tu asistente de inteligencia artificial. Para comenzar tu primera sesión: selecciona "IA Lab" en el menú de herramientas, elige el modelo de IA preferido, escribe tu primera consulta en el campo de texto.',
            consejos: [
              'Sé específico en tus preguntas para obtener mejores resultados',
              'Utiliza los prompts predefinidos para comenzar',
              'Guarda tus conversaciones para referencia futura'
            ]
          },
          {
            titulo: '4. Configurar tu entorno',
            contenido: 'Personaliza tu experiencia en Edutechlife: accede a Configuración desde el menú, ajusta el idioma y zona horaria, configura tus preferencias de notificaciones, vincula tu calendario institucional.'
          },
          {
            titulo: '5. Próximos pasos',
            contenido: 'Una vez completado el inicio básico, te recomendamos: explorar el diagnóstico VAK para personalizar tu aprendizaje, revisar los tutoriales de SmartBoard si planeas usar pizarras interactivas, consultar la sección de automatización para optimizar procesos.'
          }
        ]
      },
      'manual-ia': {
        titulo: 'Manual de herramientas IA',
        introduccion: 'IA Lab es el núcleo de inteligencia artificial de Edutechlife. Esta guía te enseña a configurar y utilizar todas las capacidades de IA para potenciar tu práctica educativa.',
        secciones: [
          {
            titulo: 'Introducción a IA Lab',
            contenido: 'IA Lab integra modelos de IA avanzados para asistir en la creación de contenido educativo, análisis de datos y personalización del aprendizaje. El sistema soporta múltiples idiomas incluyendo español, inglés y português.',
            grafica: 'dona',
            datos: [
              { nombre: 'Generación de contenido', valor: 35 },
              { nombre: 'Análisis y evaluación', valor: 30 },
              { nombre: 'Asesoría pedagógica', valor: 25 },
              { nombre: 'Investigación', valor: 10 }
            ]
          },
          {
            titulo: 'Configuración de Modelos',
            contenido: 'Edutechlife ofrece múltiples modelos de IA optimizados para diferentes propósitos educativos. La selección del modelo correcto puede mejorar significativamente tus resultados.',
            modelos: [
              { nombre: 'Valerio', descripcion: 'Asistente pedagógico especializado en metodologías educativas', caso: 'Creación de planes de clase' },
              { nombre: 'Analítico', descripcion: 'Análisis de datos de estudiantes y generar reportes', caso: 'Identificación de patrones de aprendizaje' },
              { nombre: 'Creador', descripcion: 'Generación de contenido educativo diverso', caso: 'Materiales didácticos' },
              { nombre: 'Investigador', descripcion: 'Búsqueda y síntesis de información académica', caso: 'Revisión de literatura' }
            ]
          },
          {
            titulo: 'Prompts Personalizados',
            contenido: 'Los prompts son instrucciones que guían a la IA para generar respuestas específicas. Edutechlife incluye una biblioteca de prompts optimizados para diferentes escenarios educativos.',
            lista: [
              'Prompts para generación de evaluaciones',
              'Prompts para creación de rúbricas',
              'Prompts para diseño de actividades',
              'Prompts para retroalimentación automática'
            ]
          },
          {
            titulo: 'Configuración Avanzada',
            contenido: 'Para usuarios avanzados, IA Lab permite ajustar parámetros como: temperatura (creatividad vs precisión), longitud de respuesta, nivel de detalle, formato de salida.',
            grafica: 'barras',
            datos: [
              { categoria: 'Productividad', antes: 45, despues: 82 },
              { categoria: 'Calidad contenido', antes: 60, despues: 91 },
              { categoria: 'Tiempo preparación', antes: 100, despues: 35 }
            ]
          },
          {
            titulo: 'Integración con Valerio',
            contenido: 'Valerio es el avatar inteligente de Edutechlife que combina técnicas de coaching con IA. Compatible con IA Lab, Valerio proporciona respuestas contextualizadas basadas en las mejores prácticas pedagógicas.'
          }
        ]
      },
      'tutorial-smartboard': {
        titulo: 'Tutorial SmartBoard',
        introduccion: 'SmartBoard es la solución de pizarra interactiva inteligente de Edutechlife. Esta guía te ayudará a configurar y utilizar todas las funciones para maximizar el engagement de tus estudiantes.',
        secciones: [
          {
            titulo: 'Especificaciones Técnicas',
            contenido: 'Antes de comenzar, conoce las especificaciones de tu SmartBoard: pantalla 4K multitáctil, tamaño de 65-86 pulgadas, tecnología infrarroja de alta precisión, conectividad HDMI, USB-C y WiFi 6.',
            especificacion: [
              { label: 'Resolución', valor: '3840 x 2160 (4K)' },
              { label: 'Táctil', valor: '20 puntos simultáneos' },
              { label: 'Tiempo respuesta', valor: '< 8ms' },
              { label: 'Brillo', valor: '400 cd/m²' },
              { label: 'Conectividad', valor: 'HDMI 2.0, USB-C, WiFi 6' }
            ]
          },
          {
            titulo: 'Instalación y Configuración',
            contenido: 'El proceso de instalación incluye: montaje en pared o soporte móvil, conexión de cables de energía y datos, calibración inicial de la pantalla, emparejamiento con el software Edutechlife.',
            pasos: [
              'Desempaca el SmartBoard y verifica todos los componentes',
              'Instala el soporte siguiendo las instrucciones del fabricante',
              'Conecta el cable HDMI al puerto correspondiente',
              'Enciende el dispositivo y espera a que cargue el sistema',
              'Descarga e instala la aplicación Edutechlife desde el centro de descargas'
            ]
          },
          {
            titulo: 'Herramientas Interactivas',
            contenido: 'SmartBoard incluye un conjunto completo de herramientas: pizarra colaborativa infinita, reconocimiento de escritura a mano, herramientas geométricas, editor de imágenes, grabación de sesiones.',
            grafica: 'linea',
            datos: [
              { anio: '2024', engagement: 65 },
              { anio: '2025', engagement: 78 },
              { anio: '2026', engagement: 92 }
            ]
          },
          {
            titulo: 'Integración con Dispositivos',
            contenido: 'Maximiza la funcionalidad conectando dispositivos adicionales: tablets de estudiantes para compartir contenido, voting systems para evaluaciones en tiempo real, sistemas de audio mejorados para conferencias.',
            opciones: [
              'Conexión por código QR para compartir pantalla',
              'Emparejamiento Bluetooth para control remoto',
              'Sincronización con Google Classroom y Microsoft Teams'
            ]
          },
          {
            titulo: 'Solución de Problemas Comunes',
            contenido: 'Problemas frecuentes y sus soluciones: La pantalla no responde - verificar conexiones y reiniciar; La conexión WiFi falla - mover el router más cerca o usar cable Ethernet; El táctil no funciona - recalibrar desde configuración.',
            faqs: [
              { q: '¿Puedo usar el SmartBoard sin internet?', a: 'Sí, las funciones básicas funcionan offline' },
              { q: '¿Cuántos dispositivos puedo conectar?', a: 'Hasta 50 dispositivos simultáneamente' },
              { q: '¿El software es compatible con Mac?', a: 'Totalmente compatible con macOS 12+' }
            ]
          }
        ]
      },
      'api-docs': {
        titulo: 'API Documentation',
        introduccion: 'La API de Edutechlife permite integrar nuestras funcionalidades con tus sistemas existentes. Esta documentación está diseñada para desarrolladores que necesitan conectar LMS, sistemas de gestión académica o aplicaciones personalizadas.',
        secciones: [
          {
            titulo: 'Información General',
            contenido: 'La API de Edutechlife sigue arquitectura RESTful con autenticación JWT. Todos los endpoints requieren una clave API válida que puedes obtener desde el panel de administración.',
            detalle: {
              base: 'https://api.edutechlife.com/v1',
              formato: 'JSON',
              autenticacion: 'Bearer Token (JWT)',
              version: 'v1 (actual)'
            }
          },
          {
            titulo: 'Endpoints Principales',
            contenido: 'Los endpoints disponibles cubren las principales funcionalidades de la plataforma. A continuación se detallan los más utilizados:',
            endpoints: [
              { metodo: 'GET', ruta: '/usuarios', descripcion: 'Lista todos los usuarios' },
              { metodo: 'POST', ruta: '/usuarios', descripcion: 'Crea un nuevo usuario' },
              { metodo: 'GET', ruta: '/estudiantes/{id}', descripcion: 'Obtiene datos de un estudiante' },
              { metodo: 'PUT', ruta: '/estudiantes/{id}', descripcion: 'Actualiza información del estudiante' },
              { metodo: 'GET', ruta: '/resultados/vak', descripcion: 'Obtiene resultados de diagnóstico VAK' },
              { metodo: 'POST', ruta: '/ia/chat', descripcion: 'Envía mensaje al chat de IA' }
            ]
          },
          {
            titulo: 'Ejemplo de Autenticación',
            contenido: 'Para autenticarte con la API, incluye el token en el header de cada solicitud:',
            codigo: `// JavaScript - Fetch
const response = await fetch('https://api.edutechlife.com/v1/usuarios', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer TU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
            lenguaje: 'JavaScript'
          },
          {
            titulo: 'Integración con LMS',
            contenido: 'Edutechlife se integra nativamente con los principales sistemas de gestión del aprendizaje:',
            integraciones: [
              { lms: 'Moodle', tipo: 'Plugin disponible', estado: 'Producción' },
              { lms: 'Canvas', tipo: 'API REST', estado: 'Producción' },
              { lms: 'Blackboard', tipo: 'LTI 1.3', estado: 'Beta' },
              { lms: 'Google Classroom', tipo: 'API OAuth', estado: 'Producción' }
            ]
          },
          {
            titulo: 'Rate Limits y Best Practices',
            contenido: 'Para garantizar la estabilidad del servicio, aplicamos límites de uso: 1000 requests/hora por API key, 100 requests/minuto en endpoints de IA. Recomendamos implementar caché local y webhooks para notificaciones asíncronas.',
            grafica: 'barras',
            datos: [
              { categoria: 'Gratis', limite: '100/h' },
              { categoria: 'Profesional', limite: '1000/h' },
              { categoria: 'Institucional', limite: '10000/h' },
              { categoria: 'Enterprise', limite: 'Ilimitado' }
            ]
          }
        ]
      },
      'faq': {
        titulo: 'FAQ Frecuentes',
        introduccion: 'Aquí encontrarás respuestas a las preguntas más frecuentes sobre Edutechlife. Si no encuentras la respuesta que buscas, contacta nuestro equipo de soporte.',
        secciones: [
          {
            titulo: 'Cuenta y Facturación',
            contenido: '',
            faqs: [
              { q: '¿Cómo puedo cambiar mi plan de suscripción?', a: 'Desde Configuración > Suscripción puedes cambiar tu plan en cualquier momento. El cambio será efectivo al siguiente ciclo de facturación.' },
              { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PayPal, y transferencias bancarias para planes anuales.' },
              { q: '¿Puedo obtener factura fiscal?', a: 'Sí, todas las transacciones incluyen factura fiscal. Descárgala desde Configuración > Facturación.' },
              { q: '¿Qué sucede si supero mi límite de usuarios?', a: 'Te notificaremos cuando alcances el 80% de tu límite. Puedes actualizar tu plan o esperar al siguiente ciclo.' }
            ]
          },
          {
            titulo: 'Técnicas',
            contenido: '',
            faqs: [
              { q: '¿Qué navegadores son compatibles?', a: 'Chrome 90+, Firefox 88+, Safari 15+, Edge 90+. Recomendamos Chrome para mejor rendimiento.' },
              { q: '¿Edutechlife funciona sin internet?', a: 'Algunas funciones básicas funcionan offline. Sincronizará automáticamente cuando vuelvas a conectar.' },
              { q: '¿Mis datos están seguros?', a: 'Utilizamos encriptación AES-256, cumplimiento con GDPR y SOC 2 Type II. Tus datos nunca se comparten.' },
              { q: '¿Puedo exportar mis datos?', a: 'Sí, desde Configuración > Datos puedes exportar en formato CSV, PDF o Excel.' }
            ]
          },
          {
            titulo: 'Pedagógicas',
            contenido: '',
            faqs: [
              { q: '¿El diagnóstico VAK es gratuito?', a: 'El diagnóstico básico es gratuito. La versión completa con análisis detallado requiere plan Profesional.' },
              { q: '¿Puedo usar Edutechlife para educación online?', a: 'Totalmente. Todas nuestras herramientas están optimizadas para entornos presenciales, híbridos y remotos.' },
              { q: '¿Cómo mido el ROI de usar la plataforma?', a: 'Incluimos un ROI Calculator que analiza métricas de rendimiento, engagement y reducción de tiempo administrativo.' },
              { q: '¿Las certificaciones tienen validez oficial?', a: 'Nuestras certificaciones son emitidas por Edutechlife y reconocidas por instituciones educativas aliadas.' }
            ]
          },
          {
            titulo: 'Soporte',
            contenido: '',
            faqs: [
              { q: '¿Cómo contacto al soporte?', a: 'Desde el chat en vivo (disponible 24/7), email a soporte@edutechlife.com, o través del formulario en el Centro de Ayuda.' },
              { q: '¿Tienen capacitación para instituciones?', a: 'Sí, ofrecemos capacitación virtual y presencial para implementaciones institucionales.' },
              { q: '¿Cuál es el tiempo de respuesta?', a: 'Plan Gratuito: 48h, Profesional: 24h, Enterprise: 4h con administrador dedicado.' }
            ]
          }
        ]
      }
    };
    return contents[id] || null;
  };

  if (selectedDoc) {
    const doc = getDocContent(selectedDoc);
    if (!doc) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={() => setSelectedDoc(null)}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con Logo */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-8 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="text-white font-medium text-sm">Documentación</span>
            </div>
            <button 
              onClick={() => setSelectedDoc(null)} 
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
              style={{ color: '#FFFFFF' }}
            >
              <Icon name="fa-xmark" className="text-lg" />
            </button>
          </div>

          {/* Contenido */}
          <div className="px-6 md:px-10 py-6 space-y-6">
            {/* Título */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                <Icon name={documentos.find(d => d.id === selectedDoc)?.icono || 'fa-file'} className="text-xl" style={{ color: '#004B63' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#004B63' }}>{doc.titulo}</h1>
                <p className="text-sm" style={{ color: '#4DA8C4' }}>{documentos.find(d => d.id === selectedDoc)?.tiempo} de lectura</p>
              </div>
            </div>

            {/* Introducción */}
            <p className="text-lg leading-relaxed" style={{ color: '#374151' }}>
              {doc.introduccion}
            </p>

            {/* Secciones */}
            {doc.secciones.map((seccion, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold" style={{ color: '#004B63' }}>{seccion.titulo}</h2>
                <p className="text-base leading-relaxed" style={{ color: '#374151' }}>{seccion.contenido}</p>

                {seccion.pasos && (
                  <ol className="space-y-2 ml-4">
                    {seccion.pasos.map((paso, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#4DA8C4', color: '#FFFFFF' }}>{i + 1}</span>
                        <span style={{ color: '#374151' }}>{paso}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {seccion.consejos && (
                  <ul className="space-y-2 ml-4">
                    {seccion.consejos.map((consejo, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon name="fa-lightbulb" className="text-sm mt-1" style={{ color: '#F59E0B' }} />
                        <span style={{ color: '#374151' }}>{consejo}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {seccion.especificacion && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        {seccion.especificacion.map((spec, i) => (
                          <tr key={i} className="border-b" style={{ borderColor: '#E5E7EB' }}>
                            <td className="py-2 font-medium" style={{ color: '#004B63' }}>{spec.label}</td>
                            <td className="py-2" style={{ color: '#374151' }}>{spec.valor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {seccion.modelos && (
                  <div className="space-y-3">
                    {seccion.modelos.map((modelo, i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                        <h4 className="font-semibold" style={{ color: '#004B63' }}>{modelo.nombre}</h4>
                        <p className="text-sm text-gray-600 mt-1">{modelo.descripcion}</p>
                        <span className="inline-block mt-2 px-2 py-1 rounded text-xs" style={{ backgroundColor: '#E8F4F8', color: '#4DA8C4' }}>Uso: {modelo.caso}</span>
                      </div>
                    ))}
                  </div>
                )}

                {seccion.lista && (
                  <ul className="space-y-2 ml-4">
                    {seccion.lista.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon name="fa-check" className="text-sm mt-1" style={{ color: '#4DA8C4' }} />
                        <span style={{ color: '#374151' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {seccion.opciones && (
                  <div className="space-y-2">
                    {seccion.opciones.map((opcion, i) => (
                      <div key={i} className="p-3 rounded-lg border-2" style={{ borderColor: '#E8F4F8' }}>
                        <span style={{ color: '#374151' }}>{opcion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {seccion.imagen && (
                  <img 
                    src={seccion.imagen} 
                    alt={seccion.titulo}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}

                {seccion.grafica === 'linea' && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>Evolución</h4>
                    <div className="flex items-end justify-between h-40 gap-2">
                      {seccion.datos.map((d, i) => {
                        const max = Math.max(...seccion.datos.map(x => x.engagement || x.valor || 100));
                        const h = ((d.engagement || d.valor) / max) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full rounded-t-md transition-all"
                              style={{ 
                                height: `${h}%`, 
                                backgroundColor: i === seccion.datos.length - 1 ? '#004B63' : '#4DA8C4' 
                              }}
                            />
                            <span className="text-xs mt-2" style={{ color: '#6B7280' }}>{d.anio}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {seccion.grafica === 'barras' && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>Métricas</h4>
                    <div className="space-y-3">
                      {seccion.datos.map((d, i) => {
                        const max = Math.max(...seccion.datos.map(x => x.antes || x.despues || x.valor || 100));
                        const val = d.despues || d.valor || 0;
                        const pct = (val / max) * 100;
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span style={{ color: '#374151' }}>{d.categoria}</span>
                              <span className="font-semibold" style={{ color: '#004B63' }}>{d.despues || d.valor}%</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, backgroundColor: '#4DA8C4' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {seccion.grafica === 'dona' && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>Distribución</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="relative w-28 h-28">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          {(() => {
                            const colors = ['#004B63', '#4DA8C4', '#66CCCC', '#88D4E5'];
                            let cumulative = 0;
                            return seccion.datos.map((d, i) => {
                              const pct = d.valor / 100;
                              const dash = pct * 100;
                              const color = colors[i % colors.length];
                              const start = cumulative * 100;
                              cumulative += pct;
                              return (
                                <circle 
                                  key={i}
                                  cx="18" cy="18" r="14"
                                  fill="none"
                                  stroke={color}
                                  strokeWidth="4"
                                  strokeDasharray={`${dash} ${100 - dash}`}
                                  strokeDashoffset={`${-start}`}
                                />
                              );
                            });
                          })()}
                        </svg>
                      </div>
                      <div className="space-y-2">
                        {seccion.datos.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 rounded-full" style={{ 
                              backgroundColor: ['#004B63', '#4DA8C4', '#66CCCC', '#88D4E5'][i] 
                            }} />
                            <span style={{ color: '#374151' }}>{d.nombre}: {d.valor}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {seccion.endpoints && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: '#F3F9FB' }}>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Método</th>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Ruta</th>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seccion.endpoints.map((ep, i) => (
                          <tr key={i} className="border-b" style={{ borderColor: '#E5E7EB' }}>
                            <td className="px-4 py-2">
                              <span className="px-2 py-1 rounded text-xs font-mono" style={{ 
                                backgroundColor: ep.metodo === 'GET' ? '#DCFCE7' : ep.metodo === 'POST' ? '#DBEAFE' : '#FEF3C7',
                                color: ep.metodo === 'GET' ? '#166534' : ep.metodo === 'POST' ? '#1E40AF' : '#92400E'
                              }}>{ep.metodo}</span>
                            </td>
                            <td className="px-4 py-2 font-mono text-xs" style={{ color: '#374151' }}>{ep.ruta}</td>
                            <td className="px-4 py-2" style={{ color: '#374151' }}>{ep.descripcion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {seccion.codigo && (
                  <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
                    <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: '#0F172A' }}>
                      <span className="text-xs" style={{ color: '#94A3B8' }}>{seccion.lenguaje}</span>
                      <Icon name="fa-code" className="text-sm" style={{ color: '#94A3B8' }} />
                    </div>
                    <pre className="p-4 text-sm font-mono overflow-x-auto" style={{ color: '#E2E8F0' }}>
                      {seccion.codigo}
                    </pre>
                  </div>
                )}

                {seccion.detalle && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                    <div>
                      <span className="text-xs" style={{ color: '#6B7280' }}>Base URL</span>
                      <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.base}</p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#6B7280' }}>Formato</span>
                      <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.formato}</p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#6B7280' }}>Autenticación</span>
                      <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.autenticacion}</p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#6B7280' }}>Versión</span>
                      <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.version}</p>
                    </div>
                  </div>
                )}

                {seccion.integraciones && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: '#F3F9FB' }}>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>LMS</th>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Tipo</th>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seccion.integraciones.map((int, i) => (
                          <tr key={i} className="border-b" style={{ borderColor: '#E5E7EB' }}>
                            <td className="px-4 py-2 font-medium" style={{ color: '#374151' }}>{int.lms}</td>
                            <td className="px-4 py-2" style={{ color: '#374151' }}>{int.tipo}</td>
                            <td className="px-4 py-2">
                              <span className="px-2 py-1 rounded text-xs" style={{ 
                                backgroundColor: int.estado === 'Producción' ? '#DCFCE7' : '#FEF3C7',
                                color: int.estado === 'Producción' ? '#166534' : '#92400E'
                              }}>{int.estado}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {seccion.faqs && (
                  <div className="space-y-4">
                    {seccion.faqs.map((faq, i) => (
                      <div key={i} className="p-4 rounded-xl border-2" style={{ borderColor: '#E8F4F8' }}>
                        <h4 className="font-semibold mb-2" style={{ color: '#004B63' }}>{faq.q}</h4>
                        <p className="text-sm" style={{ color: '#374151' }}>{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="/images/logo-edutechlife.webp" 
                  alt="Edutechlife" 
                  className="h-6 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span className="text-sm" style={{ color: '#6B7280' }}>Documentación</span>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ color: '#004B63' }}>
          <Icon name="fa-xmark" className="text-xl" />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#004B63' }}>
            <Icon name="fa-folder-open" className="text-2xl" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>Documentación</h2>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>Manuales, guías y recursos técnicos</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">
            Accede a toda la documentación necesaria para implementar y aprovechar al máximo las herramientas de Edutechlife.
          </p>

          {documentos.map((doc, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer flex items-center gap-4"
              style={{ borderColor: '#E8F4F8', backgroundColor: '#FAFDFF' }}
              onClick={() => setSelectedDoc(doc.id)}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                <Icon name={doc.icono} className="text-lg" style={{ color: '#004B63' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: '#004B63' }}>{doc.titulo}</h3>
                <p className="text-sm text-gray-600">{doc.descripcion}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#4DA8C4' }}>{doc.tiempo}</span>
                <Icon name="fa-chevron-right" className="text-sm" style={{ color: '#4DA8C4' }} />
              </div>
            </div>
          ))}

          <div className="mt-6 p-5 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
            <div className="flex items-center gap-3 mb-2">
              <Icon name="fa-life-ring" className="text-lg" style={{ color: '#004B63' }} />
              <h3 className="font-semibold" style={{ color: '#004B63' }}>¿Necesitas más ayuda?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Contacta nuestro equipo de soporte para asistencia técnica personalizada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalPrivacidad({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con Logo */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo-edutechlife.webp" 
              alt="Edutechlife" 
              className="h-8 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-white font-medium text-sm">Política de Privacidad</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
            style={{ color: '#FFFFFF' }}
          >
            <Icon name="fa-xmark" className="text-lg" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 md:px-10 py-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#004B63' }}>Política de Privacidad</h1>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>Última actualización: 15 de Marzo 2026</p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>1. Introducción</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                En Edutechlife, accesible desde edutechlife.com, una de nuestras prioridades principales es la privacidad de nuestros usuarios. Este documento de Política de Privacidad contiene tipos de información que se recopilan y registran por Edutechlife y cómo la usamos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>2. Información que recopilamos</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Recopilamos información que nos proporcionas directamente al registrarte, crear un perfil o utilizar nuestros servicios. Esta puede incluir:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <Icon name="fa-check" className="text-sm mt-1" style={{ color: '#4DA8C4' }} />
                  <span style={{ color: '#374151' }}>Información de identificación personal (nombre, correo electrónico, institución)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="fa-check" className="text-sm mt-1" style={{ color: '#4DA8C4' }} />
                  <span style={{ color: '#374151' }}>Datos de uso de la plataforma y métricas de rendimiento</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="fa-check" className="text-sm mt-1" style={{ color: '#4DA8C4' }} />
                  <span style={{ color: '#374151' }}>Contenido generado por el usuario (materiales educativos, evaluaciones)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="fa-check" className="text-sm mt-1" style={{ color: '#4DA8C4' }} />
                  <span style={{ color: '#374151' }}>Información de dispositivo y conexión</span>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>3. Cómo usamos tu información</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Utilizamos la información recopilada para diversos fines:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#004B63' }}>Proveer servicios</h4>
                  <p className="text-sm" style={{ color: '#374151' }}>Mantener y mejorar nuestra plataforma educativa</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#004B63' }}>Personalización</h4>
                  <p className="text-sm" style={{ color: '#374151' }}>Adaptar la experiencia de aprendizaje a tus necesidades</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#004B63' }}>Comunicación</h4>
                  <p className="text-sm" style={{ color: '#374151' }}>Enviar actualizaciones y soporte técnico</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#004B63' }}>Investigación</h4>
                  <p className="text-sm" style={{ color: '#374151' }}>Analizar patrones de uso para mejorar servicios</p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>4. Cookies y tecnologías similares</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Edutechlife utiliza "cookies" y tecnologías de seguimiento similares para mejorar tu experiencia. Estos archivos pequeños se almacenan en tu dispositivo y nos ayudan a analizar el tráfico web, personalizar contenido y comprender el comportamiento del usuario.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>5. Protección de datos</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Implementamos medidas de seguridad robustas para proteger tu información personal:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: 'fa-lock', label: 'Encriptación AES-256' },
                  { icon: 'fa-shield-halved', label: 'Firewall avanzado' },
                  { icon: 'fa-server', label: 'Servidores seguros' },
                  { icon: 'fa-user-shield', label: 'Autenticación 2FA' }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ backgroundColor: '#E8F4F8' }}>
                    <Icon name={item.icon} className="text-xl mb-2" style={{ color: '#004B63' }} />
                    <p className="text-xs" style={{ color: '#374151' }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>6. Tus derechos</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Tienes derecho a acceder, corregir o eliminar tus datos personales. Puedes ejercer estos derechos contactándonos en privacidad@edutechlife.com. Responderemos a tu solicitud dentro de 30 días.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-6 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="text-sm" style={{ color: '#6B7280' }}>Política de Privacidad</span>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalTerminos({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con Logo */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo-edutechlife.webp" 
              alt="Edutechlife" 
              className="h-8 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-white font-medium text-sm">Términos de Uso</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
            style={{ color: '#FFFFFF' }}
          >
            <Icon name="fa-xmark" className="text-lg" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 md:px-10 py-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#004B63' }}>Términos de Uso</h1>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>Última actualización: 15 de Marzo 2026</p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>1. Aceptación de términos</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Al acceder y utilizar Edutechlife, aceptas cumplir con estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no deberías utilizar nuestro servicio.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>2. Uso del servicio</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Edutechlife proporciona una plataforma educativa para instituciones, docentes y estudiantes. Puedes utilizar nuestro servicio únicamente para fines educativos legítimos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>3. Cuentas de usuario</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Cuando creas una cuenta en Edutechlife, debes proporcionar información precisa y completa. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>4. Contenido del usuario</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Puedes subir contenido a nuestra plataforma, incluyendo materiales educativos, evaluaciones y comentarios. Mantienes la propiedad de tu contenido pero nos otorgas licencia para usarlo.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>5. Uso prohibido</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                No puedes utilizar Edutechlife para:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Actividades ilegales',
                  'Intento de acceso no autorizado',
                  'Distribución de malware',
                  'Acoso o intimidación',
                  'Violación de privacidad',
                  'Propaganda o discurso de odio',
                  'Spam o phishing',
                  'Manipulación de precios'
                ].map((prohibido, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                    <Icon name="fa-xmark" className="text-sm" style={{ color: '#DC2626' }} />
                    <span className="text-sm" style={{ color: '#991B1B' }}>{prohibido}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>6. Propiedad intelectual</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                El servicio de Edutechlife y todo el contenido proporcionado, incluyendo texto, gráficos, logos e imágenes, son propiedad de Edutechlife o sus licenciantes y están protegidos por leyes de propiedad intelectual.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>7. Limitación de responsabilidad</h2>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
                Edutechlife no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso o incapacidad de usar el servicio.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-6 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="text-sm" style={{ color: '#6B7280' }}>Términos de Uso</span>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalContacto({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    motivo: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const leadData = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      interes: formData.motivo || 'contacto',
      tema: 'Formulario de contacto - Footer'
    };
    
    const existing = JSON.parse(localStorage.getItem('edutechlife_leads') || '[]');
    existing.push({ ...leadData, timestamp: new Date().toISOString() });
    localStorage.setItem('edutechlife_leads', JSON.stringify(existing));
    
    setSubmitted(true);
  };

  const handleClose = () => {
    setFormData({ nombre: '', email: '', telefono: '', motivo: '' });
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={handleClose}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div 
          className="relative w-full max-w-md mx-4 overflow-hidden rounded-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#DCFCE7' }}>
              <Icon name="fa-check" className="text-3xl" style={{ color: '#16A34A' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#004B63' }}>¡Gracias!</h3>
            <p className="text-gray-600 mb-6">Un asesor te contactará pronto.</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-full font-semibold transition-colors"
              style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-2xl mx-4 overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 transition-colors"
            style={{ color: '#9CA3AF' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <Icon name="fa-xmark" className="text-xl" />
          </button>
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo-edutechlife.webp" 
              alt="Edutechlife" 
              className="h-10 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#004B63' }}>Contáctanos</h3>
              <p className="text-sm" style={{ color: '#4DA8C4' }}>Estamos aquí para ayudarte</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de contacto */}
            <div className="space-y-4">
              <h4 className="font-bold" style={{ color: '#004B63' }}>Información de contacto</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                    <Icon name="fa-envelope" className="text-sm" style={{ color: '#FFFFFF' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#6B7280' }}>Email</p>
                    <p className="text-sm font-medium" style={{ color: '#004B63' }}>contacto@edutechlife.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                    <Icon name="fa-phone" className="text-sm" style={{ color: '#FFFFFF' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#6B7280' }}>Teléfono</p>
                    <p className="text-sm font-medium" style={{ color: '#004B63' }}>+52 (55) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                    <Icon name="fa-location-dot" className="text-sm" style={{ color: '#FFFFFF' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#6B7280' }}>Dirección</p>
                    <p className="text-sm font-medium" style={{ color: '#004B63' }}>Av. Principal 123, Centro</p>
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
                <h5 className="font-semibold mb-2" style={{ color: '#004B63' }}>Horario de atención</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: '#374151' }}>Lunes - Viernes</span>
                    <span style={{ color: '#6B7280' }}>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#374151' }}>Sábado</span>
                    <span style={{ color: '#6B7280' }}>10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#374151' }}>Domingo</span>
                    <span style={{ color: '#6B7280' }}>Cerrado</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t" style={{ borderColor: '#CBD5E1' }}>
                    <span style={{ color: '#004B63', fontWeight: '600' }}>Chat en vivo</span>
                    <span style={{ color: '#16A34A' }}>24/7</span>
                  </div>
                </div>
              </div>

              {/* Redes sociales */}
              <div>
                <h5 className="font-semibold mb-2" style={{ color: '#004B63' }}>Síguenos en redes</h5>
                <div className="flex gap-2">
                  <a href="https://web.facebook.com/eductechlife/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#004B63', color: '#FFFFFF' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}>
                    <Icon name="fa-facebook-f" className="text-sm" />
                  </a>
                  <a href="https://www.instagram.com/edu_techlife/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#4DA8C4', color: '#FFFFFF' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#66CCCC'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4DA8C4'}>
                    <Icon name="fa-instagram" className="text-sm" />
                  </a>
                  <a href="https://www.linkedin.com/company/edutechlife" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#0A66C2', color: '#FFFFFF' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0842A0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A66C2'}>
                    <Icon name="fa-linkedin-in" className="text-sm" />
                  </a>
                  <a href="https://www.youtube.com/@edutechlife" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#FF0000', color: '#FFFFFF' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#CC0000'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF0000'}>
                    <Icon name="fa-youtube" className="text-sm" />
                  </a>
                  <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#66CCCC', color: '#FFFFFF' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4DA8C4'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#66CCCC'}>
                    <Icon name="fa-whatsapp" className="text-sm" />
                  </a>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div>
              <h4 className="font-bold mb-4" style={{ color: '#004B63' }}>Envíanos un mensaje</h4>
              <form onSubmit={handleSubmit} className="space-y-3">
                 <div>
                   <label htmlFor="footer-nombre" className="block text-sm font-semibold mb-1" style={{ color: '#004B63' }}>Nombre completo</label>
                   <input type="text" id="footer-nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ border: '2px solid #E5E7EB', color: '#004B63', outline: 'none' }} placeholder="Tu nombre" onFocus={(e) => e.target.style.borderColor = '#4DA8C4'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB' } autoComplete="name" />
                 </div>
                 <div>
                   <label htmlFor="footer-email" className="block text-sm font-semibold mb-1" style={{ color: '#004B63' }}>Correo electrónico</label>
                   <input type="email" id="footer-email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ border: '2px solid #E5E7EB', color: '#004B63', outline: 'none' }} placeholder="tu@email.com" onFocus={(e) => e.target.style.borderColor = '#4DA8C4'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB' } autoComplete="email" />
                 </div>
                 <div>
                   <label htmlFor="footer-telefono" className="block text-sm font-semibold mb-1" style={{ color: '#004B63' }}>Teléfono</label>
                   <input type="tel" id="footer-telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ border: '2px solid #E5E7EB', color: '#004B63', outline: 'none' }} placeholder="300 123 4567" onFocus={(e) => e.target.style.borderColor = '#4DA8C4'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB' } autoComplete="tel" />
                 </div>
                 <div>
                   <label htmlFor="footer-motivo" className="block text-sm font-semibold mb-1" style={{ color: '#004B63' }}>Motivo de contacto</label>
                   <select id="footer-motivo" name="motivo" value={formData.motivo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl text-sm bg-white" style={{ border: '2px solid #E5E7EB', color: '#004B63', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#4DA8C4'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB' }>
                     <option value="">Selecciona un motivo</option>
                     <option value="informacion">Información sobre servicios</option>
                     <option value="diagnostico">Diagnóstico VAK</option>
                     <option value="cursos">Cursos STEAM</option>
                     <option value="consultoria">Consultoría B2B</option>
                     <option value="otro">Otro</option>
                   </select>
                 </div>
                <button type="submit" className="w-full py-3 font-semibold rounded-xl transition-all duration-300" style={{ background: 'linear-gradient(to right, #004B63, #4DA8C4)', color: '#FFFFFF', boxShadow: '0 4px 15px rgba(77, 168, 196, 0.3)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(77, 168, 196, 0.5)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(77, 168, 196, 0.3)'}>
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center justify-between" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center gap-2">
            <img src="/images/logo-edutechlife.webp" alt="Edutechlife" className="h-5 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            <span className="text-xs" style={{ color: '#9CA3AF' }}>Contacto</span>
          </div>
          <button onClick={handleClose} className="text-sm" style={{ color: '#6B7280' }} onMouseEnter={(e) => e.currentTarget.style.color = '#004B63'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
