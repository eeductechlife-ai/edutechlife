import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import { track } from "../lib/analytics";
import useFocusTrap from "../hooks/useFocusTrap";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import useLeadSubmit from "../hooks/useLeadSubmit";
import LeadConsent from "./leads/LeadConsent";
import LeadProfileSelect from "./leads/LeadProfileSelect";

const LeadCaptureModal = ({ isOpen, onClose, onSubmit, context }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const lead = useLeadSubmit("demo_movil");
  const isSubmitting = lead.sending;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert(t("leadCapture.name_required"));
      return;
    }

    const datos = {
      ...formData,
      producto_interes: context?.interest || "demo",
      mensaje: context?.topic || null,
    };
    // onSubmit es opcional: el modal guarda el lead por sí mismo. Antes lo
    // exigía y AppLayout no lo pasaba, así que el envío lanzaba TypeError.
    const ok = await lead.submit(datos, e.currentTarget);
    if (!ok) return;
    onSubmit?.(datos);

    track("lead_captured", {
      source: "lead_capture_modal",
      interest: context?.interest,
      topic: context?.topic,
    });

    setFormData({ nombre: "", email: "", telefono: "" });
  };

  const handleClose = () => {
    lead.reset();
    onClose();
  };

  const getContextMessage = () => {
    if (!context) return t("leadCapture.context_default");

    const messages = {
      diagnostico_vak: t("leadCapture.context_diagnosis"),
      cursos: t("leadCapture.context_courses"),
      metodologia: t("leadCapture.context_methodology"),
      precios: t("leadCapture.context_pricing"),
      general: t("leadCapture.context_general"),
    };

    return messages[context.interest] || messages.general;
  };

  const focusTrapRef = useFocusTrap(isOpen);
  useBodyScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("leadCapture.title")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "400px",
              width: "100%",
              maxHeight: "calc(100dvh - 1rem)",
              overflowY: "auto",
              zIndex: 10000,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            }}
          >
            <button
              onClick={handleClose}
              aria-label="Cerrar"
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "10px",
                color: "#94A3B8",
                display: "flex",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #004B63 0%, #006080 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <Send size={24} color="white" />
              </div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "700",
                  color: "#1E293B",
                  margin: 0,
                }}
              >
                {t("leadCapture.title")}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#64748B",
                  margin: "0.5rem 0 0",
                }}
              >
                {getContextMessage()}
              </p>
            </div>

            {lead.status === "sent" ? (
              <div role="status" style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 700, color: "#004B63", margin: 0 }}>
                  {t("contact.thanks_title")}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
                  {t("contact.thanks_desc")}
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.6rem 1.5rem",
                    border: "none",
                    borderRadius: "8px",
                    background: "#004B63",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {t("common.close")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <label
                      htmlFor="lead-nombre"
                      style={{
                        display: "block",
                        marginBottom: "0.25rem",
                        fontSize: "0.875rem",
                        color: "#004B63",
                        fontWeight: "500",
                      }}
                    >
                      {t("leadCapture.name_label")}
                    </label>
                    <input
                      type="text"
                      id="lead-nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder={t("leadCapture.name_placeholder")}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#4DA8C4")}
                      onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lead-email"
                      style={{
                        display: "block",
                        marginBottom: "0.25rem",
                        fontSize: "0.875rem",
                        color: "#004B63",
                        fontWeight: "500",
                      }}
                    >
                      {t("leadCapture.email_label")}
                    </label>
                    <input
                      type="email"
                      id="lead-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("leadCapture.email_placeholder")}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#4DA8C4")}
                      onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lead-telefono"
                      style={{
                        display: "block",
                        marginBottom: "0.25rem",
                        fontSize: "0.875rem",
                        color: "#004B63",
                        fontWeight: "500",
                      }}
                    >
                      {t("leadCapture.phone_label")}
                    </label>
                    <input
                      type="tel"
                      id="lead-telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder={t("leadCapture.phone_placeholder")}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#4DA8C4")}
                      onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                      autoComplete="tel"
                    />
                  </div>
                  <LeadProfileSelect
                    id="lead-perfil"
                    lead={lead}
                    labelStyle={{
                      display: "block",
                      marginBottom: "0.25rem",
                      fontSize: "0.875rem",
                      color: "#004B63",
                      fontWeight: "500",
                    }}
                    selectStyle={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      background: "white",
                    }}
                  />
                  <LeadConsent id="lead-autorizacion" lead={lead} />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "1.25rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      background: "white",
                      color: "#64748B",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {t("leadCapture.not_now")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      border: "none",
                      borderRadius: "8px",
                      background: isSubmitting
                        ? "#94A3B8"
                        : "linear-gradient(135deg, #004B63 0%, #006080 100%)",
                      color: "white",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {isSubmitting
                      ? t("leadCapture.sending")
                      : t("leadCapture.share_data")}
                  </button>
                </div>
              </form>
            )}

            <p
              style={{
                fontSize: "0.7rem",
                color: "#94A3B8",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              {t("leadCapture.privacy_notice")}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
