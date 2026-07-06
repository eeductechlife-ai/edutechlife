import React, { useState } from 'react';
import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../i18n/I18nProvider';
import { getFooterContent } from '../data/footer/footerContent';
import ModalVAK from './footer/modals/ModalVAK';
import ModalCertificaciones from './footer/modals/ModalCertificaciones';
import ModalBlog from './footer/modals/ModalBlog';
import ModalDocumentacion from './footer/modals/ModalDocumentacion';
import ModalPrivacidad from './footer/modals/ModalPrivacidad';
import ModalTerminos from './footer/modals/ModalTerminos';
import ModalContacto from './footer/modals/ModalContacto';

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:pt-6 lg:pb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 lg:mb-2">
            <div className="lg:col-span-1">
              <div className="mb-3 lg:mb-3">
                <img
                  src="/images/logo-edutechlife.webp"
                  alt="Edutechlife"
                  className="h-6 w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <p className="text-sm leading-relaxed mb-5 lg:mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {t('footer.tagline')}
              </p>
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

            <div>
              <h4 className="text-base font-bold mb-3 lg:mb-2 text-white">
                {t('footer.newsletter')}
              </h4>
              <p className="text-sm mb-4 lg:mb-2" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {t('footer.contact_modal.newsletter_tagline')}
              </p>

              {subscribed ? (
                <div className="rounded-xl p-5 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                    <Icon name="fa-check" className="text-xl text-white" />
                  </div>
                  <p className="text-base font-semibold text-white">
                    {t('footer.thanks')}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {t('footer.thanks_msg')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder={t('footer.email_placeholder')}
                      className="w-full px-4 h-11 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                      style={{ backgroundColor: '#FFFFFF', color: '#374151', border: '2px solid transparent' }}
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
                    <span className="text-white">{t('footer.subscribe')}</span>
                    <Icon name="fa-paper-plane" className="text-xs text-white" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="h-px w-full mb-4 lg:mb-1.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

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

      {activeModal === 'vak' && <ModalVAK onClose={closeModal} content={content} />}
      {activeModal === 'certificaciones' && <ModalCertificaciones onClose={closeModal} content={content} />}
      {activeModal === 'blog' && <ModalBlog onClose={closeModal} content={content} />}
      {activeModal === 'documentacion' && <ModalDocumentacion onClose={closeModal} content={content} />}
      {activeModal === 'privacidad' && <ModalPrivacidad onClose={closeModal} content={content} />}
      {activeModal === 'terminos' && <ModalTerminos onClose={closeModal} content={content} />}
      {activeModal === 'contacto' && <ModalContacto onClose={closeModal} />}
    </>
  );
}
