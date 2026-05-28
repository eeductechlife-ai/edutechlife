import React, { useState } from 'react';
import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../i18n/I18nProvider';
import { getFooterContent } from '../data/footer/footerContent';

const socialLinks = [
  { icon: 'fa-brands fa-facebook-f', label: 'Facebook', href: 'https://web.facebook.com/eductechlife/' },
  { icon: 'fa-brands fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/edu_techlife/' },
  { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/edutechlife' },
  { icon: 'fa-brands fa-youtube', label: 'YouTube', href: 'https://www.youtube.com/@edutechlife' },
];

const toolLinks = [
  { label: 'IA Lab con Valerio', view: 'ialab', key: 'footer.ialab' },
  { label: 'SmartBoard', view: 'neuroentorno', key: 'footer.smartboard' },
  { label: 'Diagnóstico VAK', view: 'vak', key: 'footer.vak' },
  { label: 'ROI Calculator', view: 'consultoria', key: 'footer.roi' },
  { label: 'Automatización Empresarial', view: 'automation', key: 'footer.automation' },
];

const resourceLinks = [
  { label: 'Metodología VAK', action: 'vak', key: 'footer.methodology' },
  { label: 'Proyectos SenaTIC', view: 'proyectos', key: 'footer.projects' },
  { label: 'Certificaciones', action: 'certificaciones', key: 'footer.certifications' },
  { label: 'Blog Educativo', action: 'blog', key: 'footer.blog' },
  { label: 'Documentación', action: 'documentacion', key: 'footer.docs' },
];

const legalLinks = [
  { label: 'Política de Privacidad', action: 'privacidad', key: 'footer.privacy' },
  { label: 'Términos de Uso', action: 'terminos', key: 'footer.terms' },
  { label: 'Contacto', action: 'contacto', key: 'footer.contact' },
];

export default function Footer() {
  const { t, locale } = useTranslation();
  const content = getFooterContent(locale);
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
      <footer className="relative w-full z-50 mt-auto bg-gradient-to-b from-[#004B63] to-[#003d52]">
      
      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:pt-6 lg:pb-3">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 lg:mb-2">
          
          {/* Columna 1 - Brand & Social */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="mb-3 lg:mb-3">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-6 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            
            {/* Descripción */}
            <p className="text-sm leading-relaxed mb-5 lg:mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {t('footer.tagline')}
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 lg:gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#4DA8C4] hover:scale-110 hover:shadow-lg hover:shadow-[#4DA8C4]/30"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                  }}
                >
                  <Icon name={social.icon} className="text-base lg:text-sm" style={{ color: '#FFFFFF' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2 - Herramientas */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('footer.tools')}
            </h4>
            <ul className="space-y-2.5 lg:space-y-0">
              {toolLinks.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigateTo(item.view)}
                    className="flex items-center gap-2 group w-full text-left text-sm transition-all duration-200 lg:hover:text-[#4DA8C4] lg:hover:translate-x-0.5 lg:py-0.5"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '0',
                      boxShadow: 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    <Icon name="fa-chevron-right" className="text-xs" style={{ color: '#4DA8C4' }} />
                    {t(item.key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Recursos */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('footer.resources')}
            </h4>
            <ul className="space-y-2.5 lg:space-y-0">
              {resourceLinks.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleResourceClick(item)}
                    className="flex items-center gap-2 group w-full text-left text-sm transition-all duration-200 lg:hover:text-[#4DA8C4] lg:hover:translate-x-0.5 lg:py-0.5"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '0',
                      boxShadow: 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    <Icon name="fa-chevron-right" className="text-xs" style={{ color: '#4DA8C4' }} />
                    {t(item.key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 - Newsletter */}
          <div>
            <h4 
              className="text-base font-bold mb-3 lg:mb-2"
              style={{ color: '#FFFFFF' }}
            >
              {t('footer.newsletter')}
            </h4>
            <p className="text-sm mb-4 lg:mb-2" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
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
                  {t('footer.thanks')}
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {t('footer.thanks_msg')}
                </p>
              </div>
            ) : (
              /* Formulario de suscripción */
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={t('footer.email_placeholder')}
                    className="w-full px-4 h-11 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#374151',
                      border: '2px solid transparent',
                    }}
                  />
                  {emailError && (
                    <p className="text-xs mt-1" style={{ color: '#FF6B9D' }}>
                      {t('footer.email_placeholder')}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full lg:w-auto lg:px-4 lg:shrink-0 h-11 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#4DA8C4]/50 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(to right, #004B63, #4DA8C4)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(77, 168, 196, 0.3)',
                  }}
                >
                  <span style={{ color: '#FFFFFF' }}>{t('footer.subscribe')}</span>
                  <Icon name="fa-paper-plane" className="text-xs" style={{ color: '#FFFFFF' }} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divisor */}
        <div 
          className="h-px w-full mb-4 lg:mb-1.5"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-2">
          <div className="flex items-center gap-3 lg:gap-2">
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {t('footer.copyright')}
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 lg:gap-2">
              {legalLinks.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>}
                  <button
                    onClick={() => openModal(item.action)}
                    className="text-sm transition-all duration-200 lg:hover:text-[#4DA8C4]"
                    style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'none', border: 'none', padding: 0 }}
                  >
                    {t(item.key)}
                  </button>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </footer>

    {/* Modales de Recursos */}
    {activeModal === 'vak' && (
      <ModalVAK onClose={closeModal} content={content} />
    )}
    {activeModal === 'certificaciones' && (
      <ModalCertificaciones onClose={closeModal} content={content} />
    )}
    {activeModal === 'blog' && (
      <ModalBlog onClose={closeModal} content={content} />
    )}
    {activeModal === 'documentacion' && (
      <ModalDocumentacion onClose={closeModal} content={content} />
    )}
    {activeModal === 'privacidad' && (
      <ModalPrivacidad onClose={closeModal} content={content} />
    )}
    {activeModal === 'terminos' && (
      <ModalTerminos onClose={closeModal} content={content} />
    )}
    {activeModal === 'contacto' && (
      <ModalContacto onClose={closeModal} />
    )}
    </>
  );
}

function ModalVAK({ onClose, content }) {
  const c = content.vakContent;
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
            <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>{t('footer.methodology')}</h2>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>{c.subtitle}</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">{c.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {c.styles.map((s, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
                <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                  <Icon name={s.icon} className="text-lg" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#004B63' }}>{s.title}</h3>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl" style={{ backgroundColor: '#004B63' }}>
            <h3 className="font-semibold mb-2 text-white">{c.calloutTitle}</h3>
            <p className="text-sm text-white/80">{c.calloutDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalCertificaciones({ onClose, content }) {
  const c = content.certificationsContent;
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
            <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>{t('footer.certifications')}</h2>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>{c.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">{c.description}</p>

          {c.list.map((cert, index) => (
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
            <p className="text-white font-medium mb-2">{c.calloutTitle}</p>
            <p className="text-sm text-white/80">{c.calloutDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalBlog({ onClose, content }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const blogArticles = content.blogArticles;
  const blogArticleContents = content.blogArticleContents;

  if (selectedArticle) {
    const article = blogArticleContents[selectedArticle];
    if (!article) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={() => setSelectedArticle(null)}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-8 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="text-white font-medium text-sm">{t('footer.blog')}</span>
            </div>
            <button 
              onClick={() => setSelectedArticle(null)} 
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
              style={{ color: '#FFFFFF' }}
            >
              <Icon name="fa-xmark" className="text-lg" />
            </button>
          </div>

          <div className="relative h-56 md:h-72 overflow-hidden">
            <img 
              src={article.imagen} 
              alt={article.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2" style={{ backgroundColor: '#4DA8C4', color: '#FFFFFF' }}>
                {blogArticles.find(a => a.id === selectedArticle)?.categoria}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{article.titulo}</h1>
            </div>
          </div>

          <div className="px-6 py-4 flex flex-wrap items-center gap-4 text-sm" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="flex items-center gap-2">
              <Icon name="fa-user" className="text-sm" style={{ color: '#4DA8C4' }} />
              <span style={{ color: '#374151' }}>{blogArticles.find(a => a.id === selectedArticle)?.autor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="fa-calendar" className="text-sm" style={{ color: '#4DA8C4' }} />
              <span style={{ color: '#374151' }}>{blogArticles.find(a => a.id === selectedArticle)?.fecha}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="fa-clock" className="text-sm" style={{ color: '#4DA8C4' }} />
              <span style={{ color: '#374151' }}>{blogArticles.find(a => a.id === selectedArticle)?.tiempoLectura}</span>
            </div>
          </div>

          <div className="px-6 md:px-10 py-6 space-y-8">
            <p className="text-lg leading-relaxed" style={{ color: '#1F2937' }}>
              {article.introduccion}
            </p>

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

            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E8F4F8' }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#004B63' }}>Conclusión</h3>
              <p className="text-base leading-relaxed" style={{ color: '#374151' }}>{article.conclusion}</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="/images/logo-edutechlife.webp" 
                  alt="Edutechlife" 
                  className="h-6 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span className="text-sm" style={{ color: '#6B7280' }}>{t('footer.blog')}</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
              >
                {content.blogSubtitle === 'Articles, news and resources' ? 'Back to blog' : 'Volver al blog'}
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
            <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>{t('footer.blog')}</h2>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>{content.blogSubtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">{content.blogIntro}</p>

          {blogArticles.map((articulo, index) => (
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
              {content.blogSubtitle === 'Articles, news and resources' ? 'View all articles' : 'Ver todos los artículos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalDocumentacion({ onClose, content }) {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const helpArticles = content.helpArticles;
  const helpArticleContents = content.helpArticleContents;

  if (selectedDoc) {
    const doc = helpArticleContents[selectedDoc];
    if (!doc) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={() => setSelectedDoc(null)}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-8 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="text-white font-medium text-sm">{t('footer.docs')}</span>
            </div>
            <button 
              onClick={() => setSelectedDoc(null)} 
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
              style={{ color: '#FFFFFF' }}
            >
              <Icon name="fa-xmark" className="text-lg" />
            </button>
          </div>

          <div className="px-6 md:px-10 py-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                <Icon name={helpArticles.find(d => d.id === selectedDoc)?.icono || 'fa-file'} className="text-xl" style={{ color: '#004B63' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#004B63' }}>{doc.titulo}</h1>
                <p className="text-sm" style={{ color: '#4DA8C4' }}>{helpArticles.find(d => d.id === selectedDoc)?.tiempo} {content.helpSubtitle === 'Manuals, guides and technical resources' ? 'read' : 'de lectura'}</p>
              </div>
            </div>

            <p className="text-lg leading-relaxed" style={{ color: '#374151' }}>{doc.introduccion}</p>

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
                        <span className="inline-block mt-2 px-2 py-1 rounded text-xs" style={{ backgroundColor: '#E8F4F8', color: '#4DA8C4' }}>{content.helpSubtitle === 'Manuals, guides and technical resources' ? 'Use: ' : 'Uso: '}{modelo.caso}</span>
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
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>{content.helpSubtitle === 'Manuals, guides and technical resources' ? 'Evolution' : 'Evolución'}</h4>
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
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>{content.helpSubtitle === 'Manuals, guides and technical resources' ? 'Metrics' : 'Métricas'}</h4>
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
                    <h4 className="text-sm font-semibold mb-4" style={{ color: '#004B63' }}>{content.helpSubtitle === 'Manuals, guides and technical resources' ? 'Distribution' : 'Distribución'}</h4>
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
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>{content.helpSubtitle === 'Manuals, guides and technical resources' ? 'Method' : 'Método'}</th>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Route</th>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>{content.helpSubtitle === 'Manuals, guides and technical resources' ? 'Description' : 'Descripción'}</th>
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
                      <span className="text-xs" style={{ color: '#6B7280' }}>Format</span>
                      <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.formato}</p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#6B7280' }}>Auth</span>
                      <p className="font-mono text-sm" style={{ color: '#004B63' }}>{seccion.detalle.autenticacion}</p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: '#6B7280' }}>Version</span>
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
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Type</th>
                          <th className="px-4 py-2 text-left font-semibold" style={{ color: '#004B63' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seccion.integraciones.map((int, i) => (
                          <tr key={i} className="border-b" style={{ borderColor: '#E5E7EB' }}>
                            <td className="px-4 py-2 font-medium" style={{ color: '#374151' }}>{int.lms}</td>
                            <td className="px-4 py-2" style={{ color: '#374151' }}>{int.tipo}</td>
                            <td className="px-4 py-2">
                              <span className="px-2 py-1 rounded text-xs" style={{ 
                                backgroundColor: int.estado === 'Production' || int.estado === 'Producción' ? '#DCFCE7' : '#FEF3C7',
                                color: int.estado === 'Production' || int.estado === 'Producción' ? '#166534' : '#92400E'
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

          <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="/images/logo-edutechlife.webp" 
                  alt="Edutechlife" 
                  className="h-6 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span className="text-sm" style={{ color: '#6B7280' }}>{t('footer.docs')}</span>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
              >
                {content.helpSubtitle === 'Manuals, guides and technical resources' ? 'Back' : 'Volver'}
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
            <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>{t('footer.docs')}</h2>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>{content.helpSubtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">{content.helpIntro}</p>

          {helpArticles.map((doc, index) => (
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
              <h3 className="font-semibold" style={{ color: '#004B63' }}>{content.helpNeedHelp}</h3>
            </div>
            <p className="text-sm text-gray-600">{content.helpNeedHelpDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalPrivacidad({ onClose, content }) {
  const c = content.privacyContent;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo-edutechlife.webp" 
              alt="Edutechlife" 
              className="h-8 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-white font-medium text-sm">{t('footer.privacy')}</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
            style={{ color: '#FFFFFF' }}
          >
            <Icon name="fa-xmark" className="text-lg" />
          </button>
        </div>

        <div className="px-6 md:px-10 py-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#004B63' }}>{t('footer.privacy')}</h1>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>{c.lastUpdate}</p>
          </div>

          <div className="space-y-6">
            {c.sections.map((section, si) => (
              <section key={si} className="space-y-3">
                <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>{section.title}</h2>
                <p className="text-base leading-relaxed" style={{ color: '#374151' }}>{section.content}</p>

                {section.items && (
                  <ul className="space-y-2 ml-4">
                    {section.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2">
                        <Icon name="fa-check" className="text-sm mt-1" style={{ color: '#4DA8C4' }} />
                        <span style={{ color: '#374151' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.uses && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.uses.map((use, ui) => (
                      <div key={ui} className="p-4 rounded-xl" style={{ backgroundColor: '#F3F9FB' }}>
                        <h4 className="font-semibold mb-2" style={{ color: '#004B63' }}>{use.title}</h4>
                        <p className="text-sm" style={{ color: '#374151' }}>{use.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.security && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {section.security.map((item, ii) => (
                      <div key={ii} className="p-3 rounded-xl text-center" style={{ backgroundColor: '#E8F4F8' }}>
                        <Icon name={item.icon} className="text-xl mb-2" style={{ color: '#004B63' }} />
                        <p className="text-xs" style={{ color: '#374151' }}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-6 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="text-sm" style={{ color: '#6B7280' }}>{t('footer.privacy')}</span>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalTerminos({ onClose, content }) {
  const c = content.termsContent;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: '#004B63', borderColor: '#003d52' }}>
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo-edutechlife.webp" 
              alt="Edutechlife" 
              className="h-8 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-white font-medium text-sm">{t('footer.terms')}</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
            style={{ color: '#FFFFFF' }}
          >
            <Icon name="fa-xmark" className="text-lg" />
          </button>
        </div>

        <div className="px-6 md:px-10 py-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#004B63' }}>{t('footer.terms')}</h1>
            <p className="text-sm" style={{ color: '#4DA8C4' }}>{c.lastUpdate}</p>
          </div>

          <div className="space-y-6">
            {c.sections.map((section, si) => (
              <section key={si} className="space-y-3">
                <h2 className="text-lg font-bold" style={{ color: '#004B63' }}>{section.title}</h2>
                <p className="text-base leading-relaxed" style={{ color: '#374151' }}>{section.content}</p>

                {section.prohibitions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.prohibitions.map((prohibido, pi) => (
                      <div key={pi} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                        <Icon name="fa-xmark" className="text-sm" style={{ color: '#DC2626' }} />
                        <span className="text-sm" style={{ color: '#991B1B' }}>{prohibido}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-6 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="text-sm" style={{ color: '#6B7280' }}>{t('footer.terms')}</span>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#004B63', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B63'}
            >
              {t('common.close')}
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
              {t('common.close')}
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
              <h3 className="text-xl font-bold" style={{ color: '#004B63' }}>{t('header.contact_us')}</h3>
              <p className="text-sm" style={{ color: '#4DA8C4' }}>{t('nav.contact_subtitle')}</p>
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
            <img src="/images/logo-edutechlife.webp" alt="Edutechlife" loading="lazy" className="h-5 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            <span className="text-xs" style={{ color: '#9CA3AF' }}>{t('footer.contact')}</span>
          </div>
          <button onClick={handleClose} className="text-sm" style={{ color: '#6B7280' }} onMouseEnter={(e) => e.currentTarget.style.color = '#004B63'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
