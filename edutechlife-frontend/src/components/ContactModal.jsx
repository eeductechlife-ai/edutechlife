import { memo, useState } from "react";
import { Icon } from "../utils/iconMapping";
import { useTranslation } from "../i18n/I18nProvider";
import { track } from "../lib/analytics";
import useFocusTrap from "../hooks/useFocusTrap";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

const ContactModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    motivo: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const focusTrapRef = useFocusTrap(isOpen);
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const leadData = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      interes: formData.motivo || "contacto",
      tema: "Formulario de contacto - Header",
    };

    const existing = JSON.parse(
      localStorage.getItem("edutechlife_leads") || "[]",
    );
    existing.push({ ...leadData, timestamp: new Date().toISOString() });
    localStorage.setItem("edutechlife_leads", JSON.stringify(existing));

    setSubmitted(true);
    track("lead_captured", { source: "contact_modal", ...leadData });
  };

  const handleClose = () => {
    setFormData({ nombre: "", email: "", telefono: "", motivo: "" });
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      ref={focusTrapRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("contact.send_message_title")}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 relative border-b border-gray-100">
          <button
            onClick={handleClose}
            aria-label="Cerrar"
            className="absolute top-2 right-2 p-2.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-edutechlife.webp"
              alt="Edutechlife"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h3 className="text-xl font-bold text-[#004B63]">
                {t("contact.title")}
              </h3>
              <p className="text-sm text-brand-primary">
                {t("contact.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-brand-pill flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-[#004B63] mb-2">
                {t("contact.thanks_title")}
              </h4>
              <p className="text-gray-600">{t("contact.thanks_desc")}</p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 bg-[#004B63] text-white rounded-brand-pill hover:bg-[#006080] transition-colors"
              >
                {t("common.close")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información de contacto */}
              <div className="space-y-4">
                <h4 className="font-bold text-[#004B63]">
                  {t("contact.info_title")}
                </h4>

                <div className="space-y-3">
                  <div
                    className="flex items-center gap-3 p-3 rounded-brand-xl"
                    style={{ backgroundColor: "#F3F9FB" }}
                  >
                    <div className="w-8 h-8 rounded-brand-md flex items-center justify-center bg-brand-primary">
                      <Icon
                        name="fa-envelope"
                        className="text-sm"
                        style={{ color: "#FFFFFF" }}
                      />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: "#6B7280" }}>
                        {t("contact.email_label")}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#004B63" }}
                      >
                        contacto@edutechlife.co
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3 p-3 rounded-brand-xl"
                    style={{ backgroundColor: "#F3F9FB" }}
                  >
                    <div className="w-8 h-8 rounded-brand-md flex items-center justify-center bg-brand-primary">
                      <Icon
                        name="fa-phone"
                        className="text-sm"
                        style={{ color: "#FFFFFF" }}
                      />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: "#6B7280" }}>
                        {t("contact.phone_label")}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#004B63" }}
                      >
                        +57 323 836 5517
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3 p-3 rounded-brand-xl"
                    style={{ backgroundColor: "#F3F9FB" }}
                  >
                    <div className="w-8 h-8 rounded-brand-md flex items-center justify-center bg-brand-primary">
                      <Icon
                        name="fa-location-dot"
                        className="text-sm"
                        style={{ color: "#FFFFFF" }}
                      />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: "#6B7280" }}>
                        {t("contact.address_label")}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#004B63" }}
                      >
                        Calle 13 # 4-32, Manizales
                      </p>
                    </div>
                  </div>
                </div>

                {/* Horario */}
                <div
                  className="p-4 rounded-brand-xl"
                  style={{ backgroundColor: "#E8F4F8" }}
                >
                  <h5 className="font-semibold text-[#004B63] mb-2">
                    {t("contact.hours_title")}
                  </h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: "#374151" }}>
                        {t("contact.weekdays")}
                      </span>
                      <span style={{ color: "#6B7280" }}>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#374151" }}>
                        {t("contact.saturday")}
                      </span>
                      <span style={{ color: "#6B7280" }}>10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#374151" }}>
                        {t("contact.sunday")}
                      </span>
                      <span style={{ color: "#6B7280" }}>
                        {t("contact.closed")}
                      </span>
                    </div>
                    <div
                      className="flex justify-between pt-1 border-t"
                      style={{ borderColor: "#CBD5E1" }}
                    >
                      <span style={{ color: "#004B63", fontWeight: "600" }}>
                        {t("contact.live_chat")}
                      </span>
                      <span style={{ color: "#16A34A" }}>24/7</span>
                    </div>
                  </div>
                </div>

                {/* Redes sociales */}
                <div>
                  <h5 className="font-semibold text-[#004B63] mb-2">
                    {t("contact.follow_us")}
                  </h5>
                  <div className="flex gap-2">
                    <a
                      href="https://web.facebook.com/eductechlife/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "#004B63", color: "#FFFFFF" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#003d52")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#004B63")
                      }
                    >
                      <Icon name="fa-facebook-f" className="text-sm" />
                    </a>
                    <a
                      href="https://www.instagram.com/edu_techlife/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "#4DA8C4", color: "#FFFFFF" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#66CCCC")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#4DA8C4")
                      }
                    >
                      <Icon name="fa-instagram" className="text-sm" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/edutechlife"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "#0A66C2", color: "#FFFFFF" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#0842A0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#0A66C2")
                      }
                    >
                      <Icon name="fa-linkedin-in" className="text-sm" />
                    </a>
                    <a
                      href="https://www.youtube.com/@edutechlife"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "#FF0000", color: "#FFFFFF" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#CC0000")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FF0000")
                      }
                    >
                      <Icon name="fa-youtube" className="text-sm" />
                    </a>
                    <a
                      href="https://wa.me/573238365517"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "#66CCCC", color: "#FFFFFF" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#4DA8C4")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#66CCCC")
                      }
                    >
                      <Icon name="fa-whatsapp" className="text-sm" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div>
                <h4 className="font-bold text-[#004B63] mb-4">
                  {t("contact.send_message_title")}
                </h4>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label
                      htmlFor="contact-nombre"
                      className="block text-sm font-semibold text-[#004B63] mb-1"
                    >
                      {t("contact.full_name_label")}
                    </label>
                    <input
                      type="text"
                      id="contact-nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-brand-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-[#004B63] placeholder-gray-400 text-sm"
                      placeholder={t("contact.name_placeholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-semibold text-[#004B63] mb-1"
                    >
                      {t("contact.email_label_form")}
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-brand-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-[#004B63] placeholder-gray-400 text-sm"
                      placeholder={t("contact.email_placeholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-telefono"
                      className="block text-sm font-semibold text-[#004B63] mb-1"
                    >
                      {t("contact.phone_label_form")}
                    </label>
                    <input
                      type="tel"
                      id="contact-telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-brand-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-[#004B63] placeholder-gray-400 text-sm"
                      placeholder={t("contact.phone_placeholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-motivo"
                      className="block text-sm font-semibold text-[#004B63] mb-1"
                    >
                      {t("contact.reason_label")}
                    </label>
                    <select
                      id="contact-motivo"
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-brand-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all bg-white text-[#004B63] text-sm"
                    >
                      <option value="">{t("contact.reason_select")}</option>
                      <option value="informacion">
                        {t("contact.reason_info")}
                      </option>
                      <option value="diagnostico">
                        {t("contact.reason_diagnosis")}
                      </option>
                      <option value="cursos">
                        {t("contact.reason_courses")}
                      </option>
                      <option value="consultoria">
                        {t("contact.reason_consulting")}
                      </option>
                      <option value="otro">{t("contact.reason_other")}</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#004B63] to-brand-primary text-white font-semibold rounded-brand-xl hover:shadow-lg hover:shadow-brand-primary/30 transition-all duration-300"
                  >
                    {t("contact.send_button")}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo-edutechlife.webp"
              alt="Edutechlife"
              className="h-5 w-auto"
            />
            <span className="text-xs text-gray-400">
              {t("contact.footer_label")}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-[#004B63] transition-colors"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

ContactModal.displayName = "ContactModal";

export default ContactModal;
