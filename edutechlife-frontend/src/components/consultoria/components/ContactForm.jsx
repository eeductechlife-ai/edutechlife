import { Icon } from '../../../utils/iconMapping.jsx';

const ContactForm = ({ contactForm, setContactForm, formErrors, submitted, handleSubmit, setSubmitted, setFormErrors, t }) => {
  return (
    <div className="contact-section">
      <div className="contact-info">
        <h2>{t('consultoria.contact_title')}</h2>
        <p>{t('consultoria.contact_subtitle')}</p>
        <div className="contact-methods">
          <div className="contact-method">
            <Icon name="fa-phone" />
            <span>+57 601 234 5678</span>
          </div>
          <div className="contact-method">
            <Icon name="fa-envelope" />
            <span>consultoria@edutechlife.com</span>
          </div>
          <div className="contact-method">
            <Icon name="fa-location-dot" />
            <span>Manizales, Colombia</span>
          </div>
        </div>
        <div className="response-guarantee">
          <Icon name="fa-shield-check" />
          <span>{t('consultoria.contact_response')}</span>
        </div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        {submitted ? (
          <div className="success-message">
            <Icon name="fa-check-circle" />
            <h3>{t('consultoria.contact_success_title')}</h3>
            <p>{t('consultoria.contact_success_desc')}</p>
            <button type="button" className="reset-form" onClick={() => { setSubmitted(false); setContactForm({ nombre: '', empresa: '', email: '', telefono: '', tamano: '', servicio: '', mensaje: '' }); setFormErrors({}); }}>
              {t('consultoria.contact_new_request')}
            </button>
          </div>
        ) : (
          <>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="consultoria-nombre">{t('consultoria.form_name')}</label>
                <input
                  type="text"
                  id="consultoria-nombre"
                  placeholder={t('consultoria.form_name_placeholder')}
                  value={contactForm.nombre}
                  onChange={(e) => setContactForm({...contactForm, nombre: e.target.value})}
                  className={formErrors.nombre ? 'error' : ''}
                  autoComplete="name"
                />
                {formErrors.nombre && <span className="field-error">{formErrors.nombre}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="consultoria-empresa">{t('consultoria.form_company')}</label>
                <input
                  type="text"
                  id="consultoria-empresa"
                  placeholder={t('consultoria.form_company_placeholder')}
                  value={contactForm.empresa}
                  onChange={(e) => setContactForm({...contactForm, empresa: e.target.value})}
                  className={formErrors.empresa ? 'error' : ''}
                  autoComplete="organization"
                />
                {formErrors.empresa && <span className="field-error">{formErrors.empresa}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="consultoria-email">{t('consultoria.form_email')}</label>
                <input
                  type="email"
                  id="consultoria-email"
                  placeholder={t('consultoria.form_email_placeholder')}
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className={formErrors.email ? 'error' : ''}
                  autoComplete="email"
                />
                {formErrors.email && <span className="field-error">{formErrors.email}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="consultoria-telefono">{t('consultoria.form_phone')}</label>
                <input
                  type="tel"
                  id="consultoria-telefono"
                  placeholder={t('consultoria.form_phone_placeholder')}
                  value={contactForm.telefono}
                  onChange={(e) => setContactForm({...contactForm, telefono: e.target.value})}
                  className={formErrors.telefono ? 'error' : ''}
                  autoComplete="tel"
                />
                {formErrors.telefono && <span className="field-error">{formErrors.telefono}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="consultoria-tamano">{t('consultoria.form_org_size')}</label>
                <select
                  id="consultoria-tamano"
                  value={contactForm.tamano}
                  onChange={(e) => setContactForm({...contactForm, tamano: e.target.value})}
                >
                  <option value="">{t('consultoria.form_org_select')}</option>
                  <option value="micro">{t('consultoria.form_org_micro')}</option>
                  <option value="pequeña">{t('consultoria.form_org_small')}</option>
                  <option value="mediana">{t('consultoria.form_org_medium')}</option>
                  <option value="grande">{t('consultoria.form_org_large')}</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="consultoria-servicio">{t('consultoria.form_service')}</label>
                <select
                  id="consultoria-servicio"
                  value={contactForm.servicio}
                  onChange={(e) => setContactForm({...contactForm, servicio: e.target.value})}
                  className={formErrors.servicio ? 'error' : ''}
                >
                  <option value="">{t('consultoria.form_service_select')}</option>
                  <option value={t('consultoria.form_service_agent')}>{t('consultoria.form_service_agent')}</option>
                  <option value={t('consultoria.form_service_steam')}>{t('consultoria.form_service_steam')}</option>
                  <option value={t('consultoria.form_service_consulting')}>{t('consultoria.form_service_consulting')}</option>
                  <option value={t('consultoria.form_service_package')}>{t('consultoria.form_service_package')}</option>
                </select>
                {formErrors.servicio && <span className="field-error">{formErrors.servicio}</span>}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="consultoria-mensaje">{t('consultoria.form_message')}</label>
              <textarea
                id="consultoria-mensaje"
                placeholder={t('consultoria.form_message_placeholder')}
                rows={4}
                value={contactForm.mensaje}
                onChange={(e) => setContactForm({...contactForm, mensaje: e.target.value})}
                className={formErrors.mensaje ? 'error' : ''}
              />
              {formErrors.mensaje && <span className="field-error">{formErrors.mensaje}</span>}
            </div>
            <button type="submit" className="submit-btn">
              <span>{t('consultoria.form_submit')}</span>
              <Icon name="fa-paper-plane" />
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
