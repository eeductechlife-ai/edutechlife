import { motion } from "framer-motion";
import { Shield, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * SmartBoard Habeas Data + Parental Consent Modal
 * Ley 1581/2012 (Colombia) + COPPA compliance
 *
 * Props:
 * - studentAge: number (age of student)
 * - onClose: closes without accepting
 * - onAccept: accepts policy + parental consent flow
 */
const SmartBoardHabeasDataModal = ({ studentAge, onClose, onAccept }) => {
  const { t } = useTranslation();
  const [showParentalForm, setShowParentalForm] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const isMinor = studentAge < 18;

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAccept = () => {
    if (isMinor && !showParentalForm) {
      setShowParentalForm(true);
      return;
    }

    if (isMinor && showParentalForm) {
      if (!parentEmail.trim()) {
        setEmailError(
          t("smartboard.habeas_parent_email_required") || "Email requerido",
        );
        return;
      }
      if (!validateEmail(parentEmail)) {
        setEmailError(
          t("smartboard.habeas_parent_email_invalid") || "Email inválido",
        );
        return;
      }
    }

    onAccept({ parentEmail: isMinor ? parentEmail : null });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="habeas-title"
        className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center">
              <Shield size={20} strokeWidth={2} className="text-[#4DA8C4]" />
            </div>
            <h2 id="habeas-title" className="text-lg font-bold text-[#004B63]">
              {showParentalForm
                ? "Consentimiento Parental"
                : "Política de Datos"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-[#004B63]/40 hover:text-[#004B63]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        {!showParentalForm ? (
          <div className="space-y-4 text-sm text-[#004B63]/80">
            {/* Data Policy */}
            <div className="bg-[#B2D8E5]/20 rounded-2xl p-4">
              <h3 className="font-bold text-[#004B63] mb-2">
                POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
              </h3>
              <p className="mb-2">
                <span className="font-semibold">EDUTECHLIFE S.A.S.</span>
              </p>
              <p className="text-xs text-[#004B63]/60">
                Ley 1581/2012 (Colombia) + COPPA (USA)
              </p>
            </div>

            {/* 1. Responsable */}
            <div>
              <h4 className="font-semibold text-[#004B63] mb-1">
                1. Responsable del Tratamiento
              </h4>
              <p>
                EdutechLife S.A.S., Colombia. Correo:
                protecciondedatos@edutechlife.com
              </p>
            </div>

            {/* 2. Datos Recolectados */}
            <div>
              <h4 className="font-semibold text-[#004B63] mb-1">
                2. Datos Recolectados
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nombre, edad, email</li>
                <li>Historial de chat (Dani tutor)</li>
                <li>Progreso académico, puntos, misiones</li>
                <li>Estilo de aprendizaje VAK</li>
                <li>Datos emocionales (solo si voluntario)</li>
              </ul>
            </div>

            {/* 3. Finalidad */}
            <div>
              <h4 className="font-semibold text-[#004B63] mb-1">
                3. Finalidad
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Proporcionar experiencia educativa personalizada</li>
                <li>Tutor IA (Dani) adaptado al estudiante</li>
                <li>Análisis de progreso académico</li>
                <li>Alertas de seguridad (ideación suicida)</li>
                <li>Mejora continua del servicio</li>
              </ul>
            </div>

            {/* 4. Retención */}
            <div>
              <h4 className="font-semibold text-[#004B63] mb-1">
                4. Retención de Datos
              </h4>
              <p>
                Los datos se conservan mientras la cuenta esté activa. Puedes
                solicitar borrado completo en cualquier momento (Derecho al
                Olvido — GDPR).
              </p>
            </div>

            {/* 5. Derechos */}
            <div>
              <h4 className="font-semibold text-[#004B63] mb-1">
                5. Tus Derechos
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar información incorrecta</li>
                <li>Solicitar borrado (derecho al olvido)</li>
                <li>Revocar consentimiento en cualquier momento</li>
                <li>Contactar: protecciondedatos@edutechlife.com</li>
              </ul>
            </div>

            {/* Minor Alert */}
            {isMinor && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Eres menor de edad</p>
                  <p>
                    Para continuar, necesitamos el email de tu padre, madre o
                    acudiente para verificar su consentimiento.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Parental Consent Form */
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-semibold text-[#004B63] mb-2">
                Consentimiento Parental Requerido
              </h3>
              <p className="text-sm text-[#004B63]/80">
                Como eres menor de 18 años, necesitamos que el consentimiento de
                tu padre, madre o acudiente legal. Ingresa su email y ellos
                recibirán un link de verificación.
              </p>
            </div>

            <div>
              <label
                htmlFor="parent-email"
                className="block text-sm font-semibold text-[#004B63] mb-2"
              >
                Email del Acudiente *
              </label>
              <input
                id="parent-email"
                type="email"
                value={parentEmail}
                onChange={(e) => {
                  setParentEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="papa@example.com"
                className={`w-full px-4 py-2.5 rounded-xl border-2 transition-colors ${
                  emailError
                    ? "border-red-300 bg-red-50"
                    : "border-[#4DA8C4]/20 bg-[#F8FAFC]"
                } focus:outline-none focus:border-[#4DA8C4]`}
              />
              {emailError && (
                <p className="text-red-600 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <p className="text-xs text-[#004B63]/60">
              El acudiente recibirá un email con instrucciones para verificar el
              consentimiento. Sin esto, la cuenta no se activará.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-[#4DA8C4] text-[#004B63] font-bold hover:bg-[#4DA8C4]/5 transition-colors"
          >
            {showParentalForm ? "Atrás" : "Cancelar"}
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-bold hover:shadow-lg transition-all"
          >
            {showParentalForm
              ? "Continuar"
              : isMinor
                ? "Verificar Email del Padre/Madre"
                : "Aceptar y Continuar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartBoardHabeasDataModal;
