import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { getPlans, startCheckout } from "../../services/stripeClient";
import SEO from "../SEO";
import { useTranslation } from "../../i18n/I18nProvider";

const STRIPE_ENABLED = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
// Los planes en pesos se cobran con Wompi (el backend decide si está activo).
const canPay = (plan) => STRIPE_ENABLED || plan.currency === "cop";

const PlanCard = ({ plan, onSelect }) => {
  const isFree = plan.price === 0;
  const isEnterprise = plan.isCustom;
  const priceDisplay = isEnterprise
    ? "Cotizar"
    : isFree
      ? "Gratis"
      : `$${(plan.price / 100).toLocaleString("es-CO")}/mes`;

  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col ${plan.id === "pro" ? "border-[#D4A017] ring-2 ring-[#D4A017]/20 bg-white" : "border-gray-200 bg-white"}`}
    >
      {plan.id === "pro" && (
        <span className="text-xs font-bold text-[#D4A017] bg-[#FFD166]/10 px-3 py-1 rounded-full self-start mb-3">
          Más popular
        </span>
      )}
      <h3 className="text-lg font-black text-[#004B63] mb-1">{plan.name}</h3>
      <p className="text-3xl font-black text-[#004B63] mb-4">{priceDisplay}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
            <span className="text-[#004B63] mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={isFree}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
          plan.id === "pro" || (!isFree && !isEnterprise && canPay(plan))
            ? "bg-[#004B63] text-white hover:bg-[#003A4E]"
            : isEnterprise
              ? "bg-gray-100 text-[#004B63] hover:bg-gray-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {!canPay(plan)
          ? "Próximamente"
          : isFree
            ? "Plan actual"
            : isEnterprise
              ? "Contáctanos"
              : "Suscribirse"}
      </button>
    </div>
  );
};

const PlanesPage = () => {
  const { isSignedIn } = useAuthIdentity();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (plan) => {
    setCheckoutMessage("");
    if (!canPay(plan)) {
      setCheckoutMessage(t("planes.checkout_unavailable"));
      return;
    }
    if (!isSignedIn) {
      navigate("/login?returnTo=/planes");
      return;
    }
    try {
      const { url } = await startCheckout(plan.id);
      if (!url) throw new Error("El pago no devolvió una URL");
      window.location.href = url;
    } catch (err) {
      console.error("Error:", err);
      setCheckoutMessage(t("planes.checkout_error"));
    }
  };

  return (
    <>
      <SEO title={t("seo.planes.title")} description={t("seo.planes.desc")} />
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-[#004B63] mb-3">
              Elige tu plan
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Accede a herramientas de IA, cursos interactivos y mucho más.
            </p>
          </div>

          {checkoutMessage && (
            <p
              role="alert"
              className="text-center text-sm font-semibold text-red-600 mb-6"
            >
              {checkoutMessage}
            </p>
          )}

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-white p-6 h-64 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={() => handleSelect(plan)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlanesPage;
