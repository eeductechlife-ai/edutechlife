import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";
import { SUBSCRIPTION_TIERS, TIER_ORDER } from "../../config/subscriptionTiers";

const FeatureRow = ({ feature }) => (
  <motion.div
    className="flex items-start gap-3 py-3 px-4"
    whileHover={{ x: 4 }}
  >
    {feature.included ? (
      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
    ) : (
      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
    )}
    <div className="flex-1">
      <p
        className={`font-semibold ${feature.included ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
      >
        {feature.name}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {feature.description}
      </p>
    </div>
  </motion.div>
);

const TierCard = ({ tierId, isRecommended }) => {
  const tier = SUBSCRIPTION_TIERS[tierId];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isRecommended ? { scale: 1.05 } : { scale: 1.02 }}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
            ⭐ Recomendado
          </div>
        </motion.div>
      )}

      {/* Card */}
      <div
        className={`relative rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
          isRecommended
            ? "border-2 border-blue-400 shadow-2xl shadow-blue-500/20"
            : "border border-gray-200 dark:border-gray-700 shadow-lg"
        }`}
        style={{
          background: isRecommended
            ? "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(34,197,94,0.05) 100%)"
            : "rgba(255,255,255,0.5)",
        }}
      >
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
          <div className="text-5xl mb-4">{tier.badge}</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {tier.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {tier.description}
          </p>

          {/* Price */}
          <div className="mb-6">
            {tier.price === 0 ? (
              <div className="text-4xl font-bold text-green-600">Gratis</div>
            ) : (
              <>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${tier.price}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  por mes, facturado mensualmente
                </div>
              </>
            )}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
              isRecommended
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/40"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {tier.cta}
          </motion.button>
        </div>

        {/* Features List */}
        <div className="p-8 space-y-1">
          {tier.features.map((feature, idx) => (
            <FeatureRow key={idx} feature={feature} />
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-8 text-center border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {tier.price === 0
              ? "Sin tarjeta de crédito requerida"
              : "Cancela en cualquier momento. Sin compromiso."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const PricingPage = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Planes de Suscripción
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Elige el plan perfecto para tu viaje educativo
        </p>

        {/* Toggle Annual/Monthly */}
        <div className="inline-flex gap-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <button className="px-6 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600">
            Pago Mensual
          </button>
          <button className="px-6 py-2 rounded-md font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Pago Anual (25% desc.)
          </button>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {TIER_ORDER.map((tierId) => (
            <TierCard
              key={tierId}
              tierId={tierId}
              isRecommended={SUBSCRIPTION_TIERS[tierId].recommended}
            />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div
        className="max-w-4xl mx-auto mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "¿Puedo cambiar de plan en cualquier momento?",
              a: "Sí, puedes actualizar o degradar tu suscripción en cualquier momento. Los cambios se reflejarán en tu próximo ciclo de facturación.",
            },
            {
              q: "¿Hay prueba gratuita?",
              a: "Nuestro plan Gratis tiene acceso completo sin necesidad de tarjeta de crédito. Comienza hoy mismo.",
            },
            {
              q: "¿Qué métodos de pago aceptan?",
              a: "Aceptamos tarjetas de crédito (Visa, Mastercard, Amex), PayPal y transferencia bancaria.",
            },
            {
              q: "¿Hay descuento para educadores?",
              a: "Sí, ofrecemos 50% de descuento para educadores verificados. Contáctanos en support@edutechlife.com",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
              whileHover={{ y: -2 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {item.q}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Footer */}
      <motion.div
        className="max-w-2xl mx-auto mt-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">
            ¿Preguntas sobre tu suscripción?
          </h3>
          <p className="mb-6 text-white/90">
            Nuestro equipo de soporte está disponible 24/7 para ayudarte
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all"
          >
            Contactar Soporte
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
});

PricingPage.displayName = "PricingPage";

export default PricingPage;
