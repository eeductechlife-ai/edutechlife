import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";

// Modal de Habeas Data (Ley 1581 de 2012 — Colombia) del Diagnóstico VAK.
// Extraído de DiagnosticoVAK.jsx sin cambios de comportamiento.
// Props:
// - onClose: cierra el modal sin aceptar (clic en backdrop o botón X).
// - onAccept: marca la política como aceptada y cierra el modal.
const HabeasDataModal = ({ onClose, onAccept }) => {
  const { t } = useTranslation();

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
        aria-labelledby="habeas-data-title"
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center">
              <Shield size={20} strokeWidth={2} className="text-[#4DA8C4]" />
            </div>
            <h2
              id="habeas-data-title"
              className="text-lg font-bold text-[#004B63]"
            >
              {t("vak.ui.habeas_data_title")}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-[#004B63]/40 hover:text-[#004B63] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4DA8C4] rounded-md"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm text-[#004B63]/80">
          <div className="bg-[#B2D8E5]/20 rounded-2xl p-4">
            <h3 className="font-bold text-[#004B63] mb-2">
              POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
            </h3>
            <p className="mb-2">
              <span className="font-semibold">EDUTECHLIFE S.A.S.</span>
            </p>
            <p className="text-xs text-[#004B63]/60">
              De acuerdo con la Ley 1581 de 2012 de la República de Colombia
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">
              1. Responsable del Tratamiento
            </h4>
            <p>
              EdutechLife S.A.S., con domicilio en Colombia. Correo de contacto:
              protecciondedatos@edutechlife.com
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">
              2. Finalidad del Tratamiento
            </h4>
            <p>
              Los datos personales recolectados (nombre, edad, correo
              electrónico, teléfono) serán utilizados exclusivamente para:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Generar el diagnóstico de estilo de aprendizaje VAK.</li>
              <li>
                Enviar el informe de resultados al correo electrónico
                registrado.
              </li>
              <li>
                Fines estadísticos anonimizados para la mejora continua del
                servicio.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">
              3. Derechos del Titular
            </h4>
            <p>Como titular de los datos, tienes derecho a:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Conocer, actualizar y rectificar tus datos personales.</li>
              <li>Solicitar prueba de la autorización otorgada.</li>
              <li>Ser informado sobre el uso dado a tus datos.</li>
              <li>Revocar la autorización en cualquier momento.</li>
              <li>Acceder de forma gratuita a tus datos personales.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">
              4. Atención de Consultas y Reclamos
            </h4>
            <p>
              Para cualquier consulta o reclamo relacionado con el tratamiento
              de tus datos personales, puedes contactarnos a través de:
            </p>
            <p className="mt-1">Correo: protecciondedatos@edutechlife.com</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">5. Vigencia</h4>
            <p>
              Los datos personales serán conservados durante el tiempo necesario
              para cumplir con las finalidades descritas y de acuerdo con las
              disposiciones legales aplicables.
            </p>
          </div>
        </div>

        <button
          onClick={onAccept}
          className="w-full mt-6 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl py-3 font-bold text-sm hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004B63]"
        >
          {t("vak.ui.accept_and_continue")}
        </button>
      </motion.div>
    </div>
  );
};

export default HabeasDataModal;
