import { useState } from 'react';
import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../i18n/I18nProvider';

export default function MetodoLeadModal({ show, onClose }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', interes: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const leadData = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      interes: formData.interes || 'Transformación Educativa',
      tema: 'Comenzar Mi Transformación - Método'
    };
    const existing = JSON.parse(localStorage.getItem('edutechlife_leads') || '[]');
    existing.push({ ...leadData, timestamp: new Date().toISOString() });
    localStorage.setItem('edutechlife_leads', JSON.stringify(existing));
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({ nombre: '', email: '', telefono: '', interes: '' });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-premium-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-border-light">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-petroleum hover:bg-gray-100 transition-all"
          >
            <Icon name="fa-xmark" className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-light to-petroleum flex items-center justify-center">
              <Icon name="fa-rocket" className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-petroleum">{t('metodo.cta_text')}</h3>
              <p className="text-sm text-primary-light">{t('metodo.modal_subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-petroleum flex items-center justify-center mx-auto mb-6">
                <Icon name="fa-check" className="text-white text-3xl" />
              </div>
              <h4 className="text-xl font-bold text-petroleum mb-2">{t('metodo.success_title')}</h4>
              <p className="text-gray-600 mb-8">{t('metodo.success_desc')}</p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-gradient-to-r from-petroleum to-primary-light text-white font-semibold rounded-full hover:shadow-premium-lg transition-all duration-300"
              >
                {t('metodo.success_close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-petroleum mb-1.5">{t('metodo.form_name_label')} <span className="text-red-400">*</span></label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all text-petroleum text-sm"
                  placeholder={t('metodo.form_name_placeholder')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-petroleum mb-1.5">{t('metodo.form_email_label')} <span className="text-red-400">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all text-petroleum text-sm"
                  placeholder={t('metodo.form_email_placeholder')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-petroleum mb-1.5">{t('metodo.form_phone_label')} <span className="text-red-400">*</span></label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all text-petroleum text-sm"
                  placeholder={t('metodo.form_phone_placeholder')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-petroleum mb-1.5">{t('metodo.form_interest_label')}</label>
                <select name="interes" value={formData.interes} onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all bg-white text-petroleum text-sm">
                  <option value="">{t('metodo.form_select_default')}</option>
                  <option value="Diagnóstico VAK">{t('metodo.form_option_vak')}</option>
                  <option value="Cursos STEAM">{t('metodo.form_option_steam')}</option>
                  <option value="Tutorías Personalizadas">{t('metodo.form_option_tutoring')}</option>
                  <option value="SmartBoard">{t('metodo.form_option_smartboard')}</option>
                  <option value="Consultoría B2B">{t('metodo.form_option_b2b')}</option>
                  <option value="Otro">{t('metodo.form_option_other')}</option>
                </select>
              </div>
              <button type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-petroleum to-primary-light text-white font-bold rounded-xl hover:shadow-premium-lg transition-all duration-300 flex items-center justify-center gap-2">
                <Icon name="fa-paper-plane" className="text-sm" />
                {t('metodo.form_submit')}
              </button>
              <p className="text-xs text-gray-400 text-center">{t('metodo.form_privacy')}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
