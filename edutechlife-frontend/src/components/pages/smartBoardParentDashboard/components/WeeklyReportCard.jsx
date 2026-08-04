import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Mail, Check, Loader2 } from "lucide-react";

/**
 * WeeklyReportCard
 * Lets the parent email themselves the child's weekly SmartBoard summary.
 * Additive: calls POST /api/smartboard/weekly-report with the auth token.
 * Fails soft — never blocks the rest of the dashboard.
 */
const WeeklyReportCard = ({ authToken, studentName }) => {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [message, setMessage] = useState("");

  const sendReport = async () => {
    if (!authToken) {
      setStatus("error");
      setMessage("Inicia sesión para recibir el reporte.");
      return;
    }
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "https://edutechlife-backend.onrender.com"}/api/smartboard/weekly-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ studentName }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("sent");
        setMessage(
          data.to
            ? `Reporte enviado a ${data.to}`
            : "Reporte enviado a tu correo.",
        );
      } else if (res.status === 404) {
        setStatus("error");
        setMessage(
          data.error ||
            "Aún no hay email de padre registrado o datos suficientes.",
        );
      } else {
        setStatus("error");
        setMessage("No pudimos enviar el reporte. Intenta más tarde.");
      }
    } catch {
      setStatus("error");
      setMessage("Sin conexión con el servidor. Intenta más tarde.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] rounded-xl p-5 text-white mb-6"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-md">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Reporte semanal por correo
          </h3>
          <p className="text-sm text-white/85 mt-1">
            Recibe cada semana el progreso de {studentName || "tu hijo"}:
            puntos, días activos, racha y materias. Así lo acompañas sin tener
            que estar encima.
          </p>
        </div>

        <button
          onClick={sendReport}
          disabled={status === "sending"}
          className="shrink-0 inline-flex items-center gap-2 bg-white text-[#004B63] font-bold text-sm px-4 py-2.5 rounded-full hover:bg-white/90 transition-colors disabled:opacity-60"
        >
          {status === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === "sent" && <Check className="w-4 h-4" />}
          {status === "sending"
            ? "Enviando..."
            : status === "sent"
              ? "Enviado"
              : "Enviar a mi correo"}
        </button>
      </div>

      {message && (
        <p
          className={`text-xs mt-3 ${
            status === "error" ? "text-yellow-200" : "text-white/90"
          }`}
        >
          {message}
        </p>
      )}
    </motion.div>
  );
};

WeeklyReportCard.propTypes = {
  authToken: PropTypes.string,
  studentName: PropTypes.string,
};

export default WeeklyReportCard;
