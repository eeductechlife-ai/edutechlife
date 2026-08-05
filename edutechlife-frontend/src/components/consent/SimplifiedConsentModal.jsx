import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, ExternalLink } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";

const SimplifiedConsentModal = memo(({ onConsent, onReject }) => {
  const { t } = useTranslation();
  const [agreedItems, setAgreedItems] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if consent was already given
    const savedConsent = localStorage.getItem("consent_accepted");
    if (savedConsent) {
      onConsent(JSON.parse(savedConsent));
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("consent_accepted", JSON.stringify(consent));
    onConsent(consent);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("consent_accepted", JSON.stringify(consent));
    onReject(consent);
  };

  const handleCustomChoice = () => {
    const consent = {
      necessary: true,
      analytics: agreedItems.analytics,
      marketing: agreedItems.marketing,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("consent_accepted", JSON.stringify(consent));
    onConsent(consent);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl max-w-2xl w-full shadow-2xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Privacidad y Consentimiento
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Cumplimos con GDPR, COPPA y leyes de privacidad
                  internacionales
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Usamos cookies y tecnologías similares para mejorar tu
              experiencia, analizar uso y personalizar contenido. Algunos datos
              se comparten con servicios de terceros de confianza.
            </p>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAcceptAll}
                className="col-span-2 md:col-span-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Aceptar Todo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRejectAll}
                className="col-span-2 md:col-span-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Solo Necesario
              </motion.button>
            </div>

            {/* Preferences Toggle */}
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              {showDetails ? "Ocultar" : "Personalizar"} preferencias
              <motion.span
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </motion.button>

            {/* Detailed Preferences */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  className="mt-6 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {/* Necessary */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Cookies Necesarias
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Requeridas para seguridad y funcionamiento de la
                          plataforma
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Analytics
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Nos ayuda a entender cómo usas la plataforma y mejorar
                        </p>
                      </div>
                      <motion.button
                        onClick={() =>
                          setAgreedItems({
                            ...agreedItems,
                            analytics: !agreedItems.analytics,
                          })
                        }
                        className={`w-12 h-7 rounded-full transition-all ${
                          agreedItems.analytics
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white mx-1"
                          animate={{
                            x: agreedItems.analytics ? 20 : 0,
                          }}
                        />
                      </motion.button>
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Marketing
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Para personalizar anuncios y ofertas relevantes
                        </p>
                      </div>
                      <motion.button
                        onClick={() =>
                          setAgreedItems({
                            ...agreedItems,
                            marketing: !agreedItems.marketing,
                          })
                        }
                        className={`w-12 h-7 rounded-full transition-all ${
                          agreedItems.marketing
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white mx-1"
                          animate={{
                            x: agreedItems.marketing ? 20 : 0,
                          }}
                        />
                      </motion.button>
                    </div>
                  </div>

                  {/* Save Preferences */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCustomChoice}
                    className="w-full mt-4 py-3 px-4 bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                  >
                    Guardar Preferencias
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 md:px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl md:rounded-b-3xl">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Lee nuestra{" "}
              <a
                href="/privacy"
                className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Política de Privacidad <ExternalLink className="w-3 h-3" />
              </a>{" "}
              y{" "}
              <a
                href="/terms"
                className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Términos de Servicio <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

SimplifiedConsentModal.displayName = "SimplifiedConsentModal";

export default SimplifiedConsentModal;
