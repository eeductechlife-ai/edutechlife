import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Save, Check } from "lucide-react";
import { createSupabaseClient } from "../../../../lib/supabase";
import { useTranslation } from "../../../../i18n/I18nProvider";

const FEATURE_TOGGLES = [
  { id: "flashcards", emoji: "🃏", labelKey: "Flashcards" },
  { id: "oral", emoji: "🎤", labelKey: "Examen Oral" },
  { id: "examenes", emoji: "📝", labelKey: "Exámenes de Práctica" },
  { id: "retos", emoji: "🏆", labelKey: "Retos Inteligentes" },
  { id: "podcast", emoji: "🎙️", labelKey: "Podcast Educativo" },
  { id: "vak", emoji: "🧠", labelKey: "Diagnóstico VAK" },
  { id: "calificaciones", emoji: "📊", labelKey: "Escáner de Notas" },
  { id: "misiones", emoji: "🎯", labelKey: "Misiones Diarias" },
];

const TIME_LIMITS = [
  { value: 0, label: "Sin límite" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hora" },
  { value: 90, label: "1.5 horas" },
  { value: 120, label: "2 horas" },
  { value: 180, label: "3 horas" },
];

const STORAGE_KEY = "edutechlife_parental_controls";

const defaultControls = () => {
  const features = {};
  FEATURE_TOGGLES.forEach((f) => {
    features[f.id] = true;
  });
  return { features, dailyTimeLimitMin: 0, chatEnabled: true };
};

const ParentalControlsPanel = ({ authToken, studentId }) => {
  const { t } = useTranslation();
  const [controls, setControls] = useState(defaultControls);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadControls = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setControls(JSON.parse(stored));
    } catch {
      /* ignore */
    }

    if (!authToken || !studentId) {
      setLoaded(true);
      return;
    }
    try {
      const client = createSupabaseClient(authToken);
      const { data } = await client
        .from("parental_controls")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();
      if (data) {
        const merged = {
          features: { ...defaultControls().features, ...(data.features || {}) },
          dailyTimeLimitMin: data.daily_time_limit_min ?? 0,
          chatEnabled: data.chat_enabled ?? true,
        };
        setControls(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    } catch {
      // fallback to localStorage
    }
    setLoaded(true);
  }, [authToken, studentId]);

  useEffect(() => {
    loadControls();
  }, [loadControls]);

  const toggleFeature = (id) => {
    setControls((prev) => ({
      ...prev,
      features: { ...prev.features, [id]: !prev.features[id] },
    }));
    setSaved(false);
  };

  const setTimeLimit = (val) => {
    setControls((prev) => ({ ...prev, dailyTimeLimitMin: val }));
    setSaved(false);
  };

  const toggleChat = () => {
    setControls((prev) => ({ ...prev, chatEnabled: !prev.chatEnabled }));
    setSaved(false);
  };

  const saveControls = async () => {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));

    if (authToken && studentId) {
      try {
        const client = createSupabaseClient(authToken);
        await client.from("parental_controls").upsert(
          {
            student_id: studentId,
            features: controls.features,
            daily_time_limit_min: controls.dailyTimeLimitMin,
            chat_enabled: controls.chatEnabled,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "student_id" },
        );
      } catch (e) {
        console.warn("[ParentalControls] Save to DB failed:", e.message);
      }
    }
    setSaving(false);
    setSaved(true);
  };

  if (!loaded) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[#E2E8F0] animate-pulse" />
        ))}
      </div>
    );
  }

  const enabledCount = Object.values(controls.features).filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004B63] to-[#0077B6] rounded-xl p-5 text-white flex items-center gap-4">
        <Shield className="w-8 h-8 flex-shrink-0" />
        <div>
          <h3 className="font-black text-lg">Control Parental</h3>
          <p className="text-white/70 text-sm">
            Configura qué herramientas puede usar tu hijo/a y establece límites
            de tiempo.
          </p>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-[#004B63] text-sm flex items-center gap-2">
            <span>🛠️</span> Herramientas Habilitadas
          </h4>
          <span className="text-xs text-[#94A3B8]">
            {enabledCount}/{FEATURE_TOGGLES.length} activas
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FEATURE_TOGGLES.map((feat) => {
            const enabled = controls.features[feat.id];
            return (
              <button
                key={feat.id}
                onClick={() => toggleFeature(feat.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  enabled
                    ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 opacity-60"
                }`}
              >
                <span className="text-xl">{feat.emoji}</span>
                <span
                  className={`text-sm font-medium flex-1 ${enabled ? "text-emerald-800" : "text-gray-500"}`}
                >
                  {feat.labelKey}
                </span>
                <div
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    enabled ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                    animate={{ left: enabled ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dani Chat Toggle */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
        <h4 className="font-bold text-[#004B63] text-sm mb-3 flex items-center gap-2">
          <span>🤖</span> Tutor IA (Dani)
        </h4>
        <button
          onClick={toggleChat}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-all w-full text-left ${
            controls.chatEnabled
              ? "bg-blue-50 border-blue-200"
              : "bg-gray-50 border-gray-200 opacity-60"
          }`}
        >
          <span className="text-xl">💬</span>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${controls.chatEnabled ? "text-blue-800" : "text-gray-500"}`}
            >
              Chat con Dani
            </p>
            <p className="text-xs text-gray-500">
              Tutor de IA que ayuda con dudas y explicaciones
            </p>
          </div>
          <div
            className={`w-10 h-6 rounded-full relative transition-colors ${
              controls.chatEnabled ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
              animate={{ left: controls.chatEnabled ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </button>
      </div>

      {/* Daily Time Limit */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
        <h4 className="font-bold text-[#004B63] text-sm mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Límite de Tiempo Diario
        </h4>
        <p className="text-xs text-[#94A3B8] mb-3">
          Establece cuánto tiempo máximo puede usar SmartBoard por día.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {TIME_LIMITS.map((tl) => (
            <button
              key={tl.value}
              onClick={() => setTimeLimit(tl.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                controls.dailyTimeLimitMin === tl.value
                  ? "bg-[#4DA8C4] text-white border-[#4DA8C4]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={saveControls}
        disabled={saving || saved}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          saved
            ? "bg-emerald-500 text-white"
            : "bg-gradient-to-r from-[#004B63] to-[#0077B6] text-white hover:shadow-lg"
        } disabled:opacity-60`}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Guardando...
          </>
        ) : saved ? (
          <>
            <Check className="w-4 h-4" /> Guardado
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> Guardar Configuración
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ParentalControlsPanel;
