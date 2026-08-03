import { useState } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';
import useFocusTrap from '../../../hooks/useFocusTrap';
import useBodyScrollLock from '../../../hooks/useBodyScrollLock';

const footerWhiteText = { color: '#FFFFFF' };
const footerPrimaryText = { color: '#004B63' };
const footerAccentText = { color: '#4DA8C4' };
const footerDarkText = { color: '#374151' };
const footerMutedText = { color: '#6B7280' };
const footerLightBg = { backgroundColor: '#F3F9FB' };
const footerLighterBg = { backgroundColor: '#E8F4F8' };
const footerLogoInvert = { filter: 'brightness(0) invert(1)' };
const footerPrimaryButton = { backgroundColor: '#004B63', color: '#FFFFFF' };

export default function ModalContacto({ onClose }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', motivo: '' });
  const [submitted, setSubmitted] = useState(false);

  const focusTrapRef = useFocusTrap(true);
  useBodyScrollLock(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div ref={focusTrapRef} role="dialog" aria-modal="true" aria-label={t('footer.contact_modal.success_title')} className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={handleClose}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative w-full max-w-md mx-4 overflow-hidden rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#DCFCE7' }}>
              <Icon name="fa-check" className="text-3xl" style={{ color: '#16A34A' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={footerPrimaryText}>{t('footer.contact_modal.success_title')}</h3>
            <p className="text-gray-600 mb-6">{t('footer.contact_modal.success_desc')}</p>
            <button onClick={handleClose} className="px-6 py-2 rounded-full font-semibold transition-colors" style={footerPrimaryButton}
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
    <div ref={focusTrapRef} role="dialog" aria-modal="true" aria-label={t('header.contact_us')} className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl mx-4 overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 px-6 py-4 border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <button onClick={handleClose} aria-label="Cerrar" className="absolute top-4 right-4 transition-colors" style={{ color: '#9CA3AF' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <Icon name="fa-xmark" className="text-xl" />
          </button>
          <div className="flex items-center gap-3">
            <img src="/images/logo-edutechlife.webp" alt="Edutechlife" className="h-10 w-auto" style={footerLogoInvert} />
            <div>
              <h3 className="text-xl font-bold" style={footerPrimaryText}>{t('header.contact_us')}</h3>
              <p className="text-sm" style={footerAccentText}>{t('nav.contact_subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold" style={footerPrimaryText}>{t('footer.contact_modal.contact_info')}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={footerLightBg}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                    <Icon name="fa-envelope" className="text-sm" style={footerWhiteText} />
                  </div>
                  <div>
                    <p className="text-xs" style={footerMutedText}>{t('footer.contact_modal.email')}</p>
                    <p className="text-sm font-medium" style={footerPrimaryText}>{t('footer.contact_email_text')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl" style={footerLightBg}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                    <Icon name="fa-phone" className="text-sm" style={footerWhiteText} />
                  </div>
                  <div>
                    <p className="text-xs" style={footerMutedText}>{t('footer.contact_modal.phone')}</p>
                    <p className="text-sm font-medium" style={footerPrimaryText}>{t('footer.contact_phone_text')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl" style={footerLightBg}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4DA8C4' }}>
                    <Icon name="fa-location-dot" className="text-sm" style={footerWhiteText} />
                  </div>
                  <div>
                    <p className="text-xs" style={footerMutedText}>{t('footer.contact_modal.address')}</p>
                    <p className="text-sm font-medium" style={footerPrimaryText}>{t('footer.contact_address_text')}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={footerLighterBg}>
                <h5 className="font-semibold mb-2" style={footerPrimaryText}>{t('footer.contact_modal.schedule_title')}</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span style={footerDarkText}>{t('footer.contact_modal.mon_fri')}</span>
                    <span style={footerMutedText}>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={footerDarkText}>{t('footer.contact_modal.saturday')}</span>
                    <span style={footerMutedText}>10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={footerDarkText}>{t('footer.contact_modal.sunday')}</span>
                    <span style={footerMutedText}>{t('footer.contact_modal.closed')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t" style={{ borderColor: '#CBD5E1' }}>
                    <span style={{ color: '#004B63', fontWeight: '600' }}>{t('footer.contact_modal.live_chat')}</span>
                    <span style={{ color: '#16A34A' }}>24/7</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold mb-2" style={footerPrimaryText}>{t('footer.contact_modal.follow_us')}</h5>
                <div className="flex gap-2">
                  {[
                    { icon: 'fa-facebook-f', label: 'Facebook', bg: '#004B63', hover: '#003d52', href: 'https://web.facebook.com/eductechlife/' },
                    { icon: 'fa-instagram', label: 'Instagram', bg: '#4DA8C4', hover: '#66CCCC', href: 'https://www.instagram.com/edu_techlife/' },
                    { icon: 'fa-linkedin-in', label: 'LinkedIn', bg: '#0A66C2', hover: '#0842A0', href: 'https://www.linkedin.com/company/edutechlife' },
                    { icon: 'fa-youtube', label: 'YouTube', bg: '#FF0000', hover: '#CC0000', href: 'https://www.youtube.com/@edutechlife' },
                    { icon: 'fa-whatsapp', label: 'WhatsApp', bg: '#66CCCC', hover: '#4DA8C4', href: 'https://wa.me/573238365517' },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-white"
                      style={{ backgroundColor: s.bg }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = s.hover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = s.bg}
                    >
                      <Icon name={s.icon} className="text-sm" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={footerPrimaryText}>{t('footer.contact_modal.form_title')}</h4>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="footer-nombre" className="block text-sm font-semibold mb-1" style={footerPrimaryText}>{t('footer.contact_modal.label_name')}</label>
                  <input type="text" id="footer-nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ border: '2px solid #E5E7EB', color: '#004B63', outline: 'none' }} placeholder={t('footer.contact_modal.placeholder_name')} onFocus={(e) => e.target.style.borderColor = '#4DA8C4'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="footer-email" className="block text-sm font-semibold mb-1" style={footerPrimaryText}>{t('footer.contact_modal.label_email')}</label>
                  <input type="email" id="footer-email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ border: '2px solid #E5E7EB', color: '#004B63', outline: 'none' }} placeholder={t('footer.contact_modal.placeholder_email')} onFocus={(e) => e.target.style.borderColor = '#4DA8C4'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="footer-telefono" className="block text-sm font-semibold mb-1" style={footerPrimaryText}>{t('footer.contact_modal.label_phone')}</label>
                  <input type="tel" id="footer-telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ border: '2px solid #E5E7EB', color: '#004B63', outline: 'none' }} placeholder={t('footer.contact_modal.placeholder_phone')} onFocus={(e) => e.target.style.borderColor = '#4DA8C4'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} autoComplete="tel" />
                </div>
                <div>
                  <label htmlFor="footer-motivo" className="block text-sm font-semibold mb-1" style={footerPrimaryText}>{t('footer.contact_modal.label_reason')}</label>
                  <select id="footer-motivo" name="motivo" value={formData.motivo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl text-sm bg-white" style={{ border: '2px solid #E5E7EB', color: '#004B63', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = '#4DA8C4'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}>
                    <option value="">{t('footer.contact_modal.reason_placeholder')}</option>
                    <option value="informacion">{t('footer.contact_modal.reason_info')}</option>
                    <option value="diagnostico">{t('footer.contact_modal.reason_vak')}</option>
                    <option value="cursos">{t('footer.contact_modal.reason_courses')}</option>
                    <option value="consultoria">{t('footer.contact_modal.reason_consulting')}</option>
                    <option value="otro">{t('footer.contact_modal.reason_other')}</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 font-semibold rounded-xl transition-all duration-300 text-white"
                  style={{ background: 'linear-gradient(to right, #004B63, #4DA8C4)', boxShadow: '0 4px 15px rgba(77, 168, 196, 0.3)' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(77, 168, 196, 0.5)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(77, 168, 196, 0.3)'}
                >
                  {t('footer.contact_modal.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t flex items-center justify-between" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center gap-2">
            <img src="/images/logo-edutechlife.webp" alt="Edutechlife" loading="lazy" className="h-5 w-auto" style={footerLogoInvert} />
            <span className="text-xs" style={{ color: '#9CA3AF' }}>{t('footer.contact')}</span>
          </div>
          <button onClick={handleClose} className="text-sm" style={footerMutedText}
            onMouseEnter={(e) => e.currentTarget.style.color = '#004B63'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
