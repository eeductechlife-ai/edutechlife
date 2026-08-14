import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../../../config/api";
import { ShieldCheck, HeartPulse } from "lucide-react";
import { useTranslation } from "../../../../i18n/I18nProvider";

/**
 * WellbeingCard
 * Makes SmartBoard's AI wellbeing monitoring VISIBLE to the parent as a trust
 * signal. Shows only aggregate status ("todo tranquilo" / "te avisamos") — never
 * the child's sensitive content. Fails soft: if the status can't load, it still
 * shows the reassurance that monitoring is active.
 */
const WellbeingCard = ({ authToken }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState({
    loaded: false,
    calm: true,
    lastAlertAt: null,
  });

  useEffect(() => {
    if (!authToken) return;
    let active = true;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/smartboard/wellbeing-status`,
          { headers: { Authorization: `Bearer ${authToken}` } },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (active) {
          setStatus({
            loaded: true,
            calm: data.status !== "attention",
            lastAlertAt: data.lastAlertAt || null,
          });
        }
      } catch {
        /* fail soft: keep the reassurance below */
      }
    })();

    return () => {
      active = false;
    };
  }, [authToken]);

  const calm = status.calm;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-5 mb-6 border"
      style={{
        background: calm ? "#F0FDF4" : "#FEF3C7",
        borderColor: calm ? "#BBF7D0" : "#FDE68A",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: calm ? "#16A34A" : "#D97706", color: "#fff" }}
        >
          {calm ? (
            <ShieldCheck className="w-5 h-5" />
          ) : (
            <HeartPulse className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <h3
            className="font-bold text-base"
            style={{ color: calm ? "#166534" : "#92400E" }}
          >
            {calm
              ? t("parent_dashboard.wellbeing_calm_title")
              : t("parent_dashboard.wellbeing_attention_title")}
          </h3>
          <p
            className="text-sm mt-1"
            style={{ color: calm ? "#15803D" : "#B45309" }}
          >
            {t("parent_dashboard.wellbeing_calm_desc")}
            {!calm && status.lastAlertAt
              ? ` ${t("parent_dashboard.wellbeing_last_alert", {
                  date: new Date(status.lastAlertAt).toLocaleDateString(
                    "es-CO",
                  ),
                })}`
              : ""}
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: calm ? "#16A34A" : "#D97706" }}
          >
            {t("parent_dashboard.wellbeing_badge")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

WellbeingCard.propTypes = {
  authToken: PropTypes.string,
};

export default WellbeingCard;
