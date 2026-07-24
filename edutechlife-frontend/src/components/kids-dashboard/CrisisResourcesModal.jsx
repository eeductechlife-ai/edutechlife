import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, MessageSquare, Heart, X } from "lucide-react";
import { useState } from "react";

/**
 * Crisis Resources Modal
 * Shows emergency resources and crisis support lines
 * Triggered when suicidal ideation is detected
 */
const CrisisResourcesModal = ({ isOpen, onClose, crisisLevel }) => {
  const [expandedTab, setExpandedTab] = useState("immediate");

  const resources = {
    immediate: {
      title: "🆘 AYUDA INMEDIATA",
      color: "from-red-600 to-red-700",
      items: [
        {
          label: "Emergencias (Colombia)",
          value: "123",
          description: "Llamada de emergencia",
          action: "tel:123"
        },
        {
          label: "Línea PAS",
          value: "+57 (2) 5149100",
          description: "Crisis 24/7",
          action: "tel:+5725149100"
        },
        {
          label: "Teléfono Amigo",
          value: "Disponible en tu país",
          description: "Apoyo emocional",
          action: null
        }
      ]
    },
    emotional: {
      title: "❤️ APOYO EMOCIONAL",
      color: "from-pink-600 to-pink-700",
      items: [
        {
          label: "Habla con tus padres",
          description: "Los adultos de confianza pueden ayudarte",
          icon: Heart
        },
        {
          label: "Busca un consejero escolar",
          description: "Tu escuela tiene profesionales",
          icon: Heart
        },
        {
          label: "Crisis Text Line",
          value: "Text HOME to 741741",
          description: "Chat anónimo (USA/Canada)",
          icon: MessageSquare
        }
      ]
    },
    reasons: {
      title: "✨ RAZONES PARA VIVIR",
      color: "from-blue-600 to-blue-700",
      items: [
        {
          title: "Tu vida importa",
          description: "Eres valioso/a tal como eres"
        },
        {
          title: "Las emociones cambian",
          description: "Lo que sientes hoy puede ser diferente mañana"
        },
        {
          title: "Hay gente que te ama",
          description: "Tu familia, amigos y educadores se preocupan"
        },
        {
          title: "El futuro tiene sorpresas",
          description: "Muchas personas han pasado por esto y encontraron felicidad"
        }
      ]
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crisis-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2
                    id="crisis-title"
                    className="text-2xl font-bold text-[#004B63]"
                  >
                    Estamos aquí para ti
                  </h2>
                  <p className="text-[#004B63]/60 text-sm">
                    Recursos de apoyo inmediato
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="text-[#004B63]/40 hover:text-[#004B63] transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Alert Message */}
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded mb-6">
              <p className="text-red-900 text-sm">
                <strong>Detectamos que podrías estar pasando por un momento difícil.</strong>
                {" "}
                Queremos ayudarte. Si tienes pensamientos de autolesión,
                <strong> contacta a alguien de confianza o llama a emergencias</strong>.
              </p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {["immediate", "emotional", "reasons"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setExpandedTab(tab)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    expandedTab === tab
                      ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white"
                      : "bg-slate-100 text-[#004B63] hover:bg-slate-200"
                  }`}
                >
                  {tab === "immediate" && "🆘"}
                  {tab === "emotional" && "❤️"}
                  {tab === "reasons" && "✨"}
                  {" "}
                  {tab === "immediate" && "Inmediato"}
                  {tab === "emotional" && "Apoyo"}
                  {tab === "reasons" && "Razones"}
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {expandedTab === "immediate" && (
                <motion.div
                  key="immediate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {resources.immediate.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-red-900">{item.label}</p>
                          <p className="text-red-700 text-sm">
                            {item.description}
                          </p>
                          {item.value && (
                            <p className="text-red-600 font-mono text-lg mt-2">
                              {item.value}
                            </p>
                          )}
                        </div>
                        {item.action && (
                          <a
                            href={item.action}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap"
                          >
                            <Phone className="w-4 h-4" />
                            Llamar
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {expandedTab === "emotional" && (
                <motion.div
                  key="emotional"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {resources.emotional.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4"
                    >
                      <p className="font-bold text-pink-900">{item.label}</p>
                      <p className="text-pink-700 text-sm mt-1">
                        {item.description}
                      </p>
                      {item.value && (
                        <p className="text-pink-600 font-mono text-sm mt-2">
                          {item.value}
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {expandedTab === "reasons" && (
                <motion.div
                  key="reasons"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {resources.reasons.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4"
                    >
                      <p className="font-bold text-blue-900">{item.title}</p>
                      <p className="text-blue-700 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-[#004B63]/60 text-sm mb-4">
                Tu bienestar emocional es importante. Habla con un adulto de confianza
                o contacta a un profesional de salud mental.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-bold hover:shadow-lg transition"
              >
                Entendido, Gracias
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CrisisResourcesModal;
