import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SB_COLORS, SB_RADII, SB_SHADOWS } from "./ingenIATheme";

const API_BASE = import.meta.env.VITE_API_URL || "";

const TIER_META = {
  bronze: {
    label: "Bronce",
    emoji: "🥉",
    color: "#CD7F32",
    bg: "rgba(205,127,50,0.12)",
  },
  silver: {
    label: "Plata",
    emoji: "🥈",
    color: "#A8A9AD",
    bg: "rgba(168,169,173,0.12)",
  },
  gold: {
    label: "Oro",
    emoji: "🥇",
    color: "#FFD700",
    bg: "rgba(255,215,0,0.12)",
  },
  diamond: {
    label: "Diamante",
    emoji: "💎",
    color: "#4DA8C4",
    bg: "rgba(77,168,196,0.12)",
  },
};

function authToken() {
  try {
    return sessionStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
}

export default function LeagueWidget({ dark = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/smartboard/league/current`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setData(json || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const bg = dark ? SB_COLORS.surfaceDarkAlt : SB_COLORS.surfaceLight;
  const border = dark ? SB_COLORS.borderDark : SB_COLORS.borderLight;
  const textMain = dark ? "#F0F6FF" : SB_COLORS.deep;
  const textMuted = dark ? SB_COLORS.textMutedDark : SB_COLORS.textMutedLight;

  if (loading) {
    return (
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: SB_RADII.lg,
          padding: "1.25rem",
          boxShadow: SB_SHADOWS.card,
        }}
      >
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  const tier = data?.league_tier || "bronze";
  const meta = TIER_META[tier] || TIER_META.bronze;
  const xp = data?.xp_earned ?? 0;
  const rank = data?.rank ?? null;
  const weekStart = data?.week_start
    ? new Date(data.week_start).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
      })
    : null;

  // XP thresholds to next tier
  const THRESHOLDS = {
    bronze: 300,
    silver: 700,
    gold: 1500,
    diamond: Infinity,
  };
  const nextTier = {
    bronze: "silver",
    silver: "gold",
    gold: "diamond",
    diamond: null,
  }[tier];
  const maxXP = THRESHOLDS[tier] || 300;
  const progress = Math.min(xp / maxXP, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: SB_RADII.lg,
        padding: "1.25rem",
        boxShadow: SB_SHADOWS.card,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 700,
            color: textMain,
          }}
        >
          Liga Semanal
        </h3>
        {weekStart && (
          <span style={{ fontSize: "0.75rem", color: textMuted }}>
            Semana del {weekStart}
          </span>
        )}
      </div>

      {/* Current tier badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: meta.bg,
          borderRadius: SB_RADII.md,
          padding: "0.75rem 1rem",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "2rem" }}>{meta.emoji}</span>
        <div>
          <div
            style={{ fontSize: "1.1rem", fontWeight: 800, color: meta.color }}
          >
            Liga {meta.label}
          </div>
          {rank != null && (
            <div style={{ fontSize: "0.8rem", color: textMuted }}>
              Posición #{rank} esta semana
            </div>
          )}
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div
            style={{ fontSize: "1.4rem", fontWeight: 900, color: meta.color }}
          >
            {xp}
          </div>
          <div style={{ fontSize: "0.72rem", color: textMuted }}>
            XP ganados
          </div>
        </div>
      </div>

      {/* Progress to next tier */}
      {nextTier && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.35rem",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: textMuted }}>
              Progreso a {TIER_META[nextTier]?.label}
            </span>
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: meta.color,
              }}
            >
              {xp} / {maxXP} XP
            </span>
          </div>
          <div
            style={{
              height: "8px",
              background: dark ? "rgba(255,255,255,0.1)" : "#E2E8F0",
              borderRadius: "99px",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: meta.color,
                borderRadius: "99px",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: textMuted,
            }}
          >
            {maxXP - xp > 0
              ? `${maxXP - xp} XP para subir a ${TIER_META[nextTier]?.label} ${TIER_META[nextTier]?.emoji}`
              : `¡Listo para subir de liga!`}
          </p>
        </>
      )}

      {tier === "diamond" && (
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "0.78rem",
            color: meta.color,
            fontWeight: 600,
          }}
        >
          ¡Estás en la liga máxima! 🏆 Mantén tu racha.
        </p>
      )}

      {!data && (
        <p
          style={{ fontSize: "0.8rem", color: textMuted, marginTop: "0.5rem" }}
        >
          Completa actividades esta semana para aparecer en la clasificación.
        </p>
      )}
    </motion.div>
  );
}
