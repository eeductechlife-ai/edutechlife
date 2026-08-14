import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import { track } from "../lib/analytics";
import useFocusTrap from "../hooks/useFocusTrap";
import useBodyScrollLock from "../hooks/useBodyScrollLock";

const LeadCaptureModal = ({ isOpen, onClose, onSubmit, context }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onSubmit({
      ...formData,
      interes: context?.interest || "general",
      tema: context?.topic || "",
    });

    track("lead_captured", {
      source: "lead_capture_modal",
      interest: context?.interest,
      topic: context?.topic,
    });

    setFormData({ nombre: "", email: "", telefono: "" });
    setIsSubmitting(false);
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
            onClick={onClose}
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
              onClick={onClose}
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
                  onClick={onClose}
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
