import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  LogOut,
  Moon,
  Sun,
  Users,
  Mail,
  Send,
  CheckCircle2,
  X,
} from "lucide-react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { useStudentProfileIngenIA } from "../../../hooks/useStudentProfileIngenIA";
import { SB_GRADIENTS, glow } from "../ingenIATheme";
import EditProfileModal from "../EditProfileModal";
import { API_BASE_URL as API_BASE } from "../../../config/api";

import ProgressSummary from "./ProgressSummary";
import RewardsGrid from "../ingenIAProgress/components/RewardsGrid";
import { getLevel } from "../ingenIAProgress/gamificationData";

const PROGRESS_GRADIENT = SB_GRADIENTS.progress;
const PROGRESS_GLOW = "#FB8500";

const GOAL_LABELS = {
  mejorar_notas: "📈 Mejorar notas",
  mejorar_habitos: "📅 Mejorar hábitos",
  recuperar_materia: "🔄 Recuperar materia",
  preparar_examenes: "📝 Preparar exámenes",
  aprender_ia: "🤖 Aprender con IA",
  acompanar: "🤝 Acompañar de lejos",
};

const INTEREST_LABELS = {
  matematicas: "🔢 Mates",
  ciencias: "🔬 Ciencias",
  tecnologia: "💻 Tech",
  arte: "🎨 Arte",
  musica: "🎵 Música",
  deporte: "⚽ Deporte",
  lectura: "📚 Lectura",
  historia: "🌍 Historia",
};

const VAK_LABELS = {
  visual: "👁️ Visual",
  auditivo: "👂 Auditivo",
  kinestesico: "✋ Kinestésico",
  auditory: "👂 Auditivo",
  kinesthetic: "✋ Kinestésico",
};

const TABS = [
  { id: "progreso", emoji: "📈", label: "Progreso" },
  { id: "premios", emoji: "🎁", label: "Premios" },
  { id: "estilo", emoji: "🧠", label: "Estilo" },
  { id: "cuenta", emoji: "⚙️", label: "Cuenta" },
];

const Card = ({ children, dm, className = "" }) => (
  <div
    className={`rounded-xl p-4 ${className}`}
    style={{
      background: dm ? "#1A2744" : "#ffffff",
      border: `1px solid ${dm ? "#243152" : "#F1F5F9"}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}
  >
    {children}
  </div>
);

const SmartProfile = memo(function SmartProfile({
  onTabChange,
  onExpandVak,
  onLogout,
  onSectionChange,
  initialTab = "progreso",
}) {
  const {
    studentAge,
    gradeLevel,
    schoolName,
    vakResult,
    daniMemory,
    streak,
    totalPoints,
    unlockedRewards,
    darkMode: dm,
    toggleDarkMode,
    supabaseQueries,
  } = useIngenIAKids();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [editOpen, setEditOpen] = useState(false);
  const [parentInviteOpen, setParentInviteOpen] = useState(false);
  const [parentInviteForm, setParentInviteForm] = useState({
    parentEmail: "",
    studentAge: "",
  });
  const [parentInviteLoading, setParentInviteLoading] = useState(false);
  const [parentInviteResult, setParentInviteResult] = useState(null);
  const [parentInviteError, setParentInviteError] = useState("");
  const authToken =
    typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
  const {
    profile: editProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  } = useStudentProfileIngenIA(authToken);

  const profile = daniMemory?.studentProfile ?? {};
  const accountName = supabaseQueries?.studentData?.data?.name || "";
  const studentName = useMemo(() => {
    if (accountName) return accountName.split(" ")[0];
    try {
      return (
        (localStorage.getItem("student_name") || "").split(" ")[0] ||
        "Estudiante"
      );
    } catch {
      return "Estudiante";
    }
  }, [accountName]);

  const vakStyle = vakResult?.predominantStyle || vakResult?.dominant || null;
  const goalLabel = profile.parentGoal ? GOAL_LABELS[profile.parentGoal] : null;
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  const level = getLevel(totalPoints ?? 0);

  const textMain = dm ? "#F0F6FF" : "#1E293B";
  const textMuted = dm ? "#94A3B8" : "#64748B";

  const handleParentInvite = async (e) => {
    e.preventDefault();
    setParentInviteError("");
    setParentInviteLoading(true);
    try {
      const token = sessionStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/smartboard/parental-consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parentEmail: parentInviteForm.parentEmail,
          studentAge: parseInt(parentInviteForm.studentAge, 10),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar invitación");
      setParentInviteResult(parentInviteForm.parentEmail);
    } catch (err) {
      setParentInviteError(err.message);
    } finally {
      setParentInviteLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* ── Header banner ──────────────────────────────── */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          background: PROGRESS_GRADIENT,
          boxShadow: `0 6px 20px ${PROGRESS_GLOW}28`,
        }}
      >
        <div className="px-4 pt-3 pb-2.5 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
            }}
          >
            🧑‍🎓
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-black text-white truncate">
              {studentName}
            </h2>
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {gradeLevel && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Grado {gradeLevel}
                </span>
              )}
              {studentAge != null && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white">
                  {studentAge} años
                </span>
              )}
              {schoolName && (
                <span className="text-[10px] px-2 py-0.5 rounded-full text-white/75 bg-white/10">
                  🏫 {schoolName}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Stats row */}
        <div
          className="grid grid-cols-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          {[
            {
              icon: "⭐",
              label: "Puntos",
              value: (totalPoints ?? 0).toLocaleString(),
            },
            {
              icon: "🔥",
              label: `Días seguidos · récord ${streak?.longest ?? 0}`,
              value: `${streak?.current ?? 0} días`,
            },
            {
              icon: level.icon,
              label: "Nivel",
              value: level.name,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="py-2 px-1 text-center border-r last:border-r-0 min-w-0"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <p className="text-[13px] font-black text-white truncate">
                {icon} {value}
              </p>
              <p className="text-[10px] text-white/75 truncate">{label}</p>
            </div>
          ))}
        </div>
        {level.next && (
          <div
            className="h-1.5 bg-white/20"
            role="progressbar"
            aria-label={`Faltan ${level.next - (totalPoints ?? 0)} puntos para el siguiente nivel`}
            aria-valuenow={Math.round(level.progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-white/80"
              style={{ width: `${level.progress}%` }}
            />
          </div>
        )}
      </motion.div>

      {/* ── Mini-tab bar ───────────────────────────────── */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{ background: dm ? "#1A2744" : "#F1F5F9" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              onSectionChange?.(tab.id);
            }}
            aria-pressed={activeTab === tab.id}
            className="flex-1 flex flex-col items-center gap-0.5 text-[11px] font-bold py-2 px-1 rounded-lg transition-all min-h-[48px]"
            style={
              activeTab === tab.id
                ? {
                    background: dm ? "#243152" : "#ffffff",
                    color: "#FB8500",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                  }
                : { color: textMuted }
            }
          >
            <span className="text-base leading-none" aria-hidden="true">
              {tab.emoji}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab content ───────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === "progreso" && (
          <motion.div
            key="progreso"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ProgressSummary
              onTabChange={onTabChange}
              onShowRewards={() => setActiveTab("premios")}
            />
          </motion.div>
        )}

        {activeTab === "premios" && (
          <motion.div
            key="premios"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <RewardsGrid
              unlockedRewards={unlockedRewards}
              totalPoints={totalPoints ?? 0}
              darkMode={dm}
            />
          </motion.div>
        )}

        {activeTab === "estilo" && (
          <motion.div
            key="estilo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Objetivo + VAK en fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalLabel && (
                <div
                  className="rounded-xl px-3 py-3 flex items-start gap-2"
                  style={{
                    background: "rgba(251,133,0,0.08)",
                    border: "1px solid rgba(251,133,0,0.18)",
                  }}
                >
                  <span className="text-xl mt-0.5">
                    {goalLabel.split(" ")[0]}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: "#D97706" }}
                    >
                      Objetivo
                    </p>
                    <p
                      className="text-xs font-semibold leading-tight mt-0.5"
                      style={{ color: textMain }}
                    >
                      {goalLabel.replace(/^[^\s]+\s/, "")}
                    </p>
                  </div>
                </div>
              )}
              <div
                className="rounded-xl px-3 py-3 flex items-start gap-2"
                style={{
                  background: dm ? "#1A2744" : "#ffffff",
                  border: `1px solid ${dm ? "#243152" : "#F1F5F9"}`,
                }}
              >
                <span className="text-xl mt-0.5">🧠</span>
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: "#D97706" }}
                  >
                    Estilo
                  </p>
                  {vakStyle ? (
                    <p
                      className="text-xs font-semibold leading-tight mt-0.5"
                      style={{ color: textMain }}
                    >
                      {VAK_LABELS[vakStyle] || vakStyle}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={onExpandVak}
                      className="text-xs font-bold mt-0.5"
                      style={{ color: "#FB8500" }}
                    >
                      Descubrir →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Intereses (chips horizontales) */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {interests.map((id) => (
                  <span
                    key={id}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(251,133,0,0.09)",
                      border: "1px solid rgba(251,133,0,0.18)",
                      color: "#D97706",
                    }}
                  >
                    {INTEREST_LABELS[id] || id}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "cuenta" && (
          <motion.div
            key="cuenta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card dm={dm}>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left"
                  style={{
                    background: SB_GRADIENTS.brand,
                    boxShadow: glow("#00B4D8", 0.25),
                    color: "white",
                  }}
                >
                  <Edit3 className="w-4 h-4 flex-shrink-0" />
                  Editar mi perfil
                </button>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: dm
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,75,99,0.06)",
                    border: `1px solid ${dm ? "#243152" : "#E2E8F0"}`,
                    color: textMain,
                  }}
                >
                  {dm ? (
                    <Sun className="w-4 h-4 flex-shrink-0 text-yellow-400" />
                  ) : (
                    <Moon className="w-4 h-4 flex-shrink-0 text-indigo-500" />
                  )}
                  {dm ? "Modo claro" : "Modo oscuro"}
                </button>

                {/* Parent invitation */}
                <button
                  type="button"
                  onClick={() => {
                    setParentInviteOpen(true);
                    setParentInviteResult(null);
                    setParentInviteError("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: dm
                      ? "rgba(77,168,196,0.12)"
                      : "rgba(77,168,196,0.08)",
                    border: `1px solid ${dm ? "#2B4A6B" : "#BAE0EC"}`,
                    color: dm ? "#7DD8EF" : "#004B63",
                  }}
                >
                  <Users className="w-4 h-4 flex-shrink-0" />
                  Conectar con mis padres
                </button>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ color: "#EF476F" }}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Conectar Padres */}
      <AnimatePresence>
        {parentInviteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setParentInviteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
              style={{ background: dm ? "#1A2744" : "#ffffff" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-base font-black"
                  style={{ color: textMain }}
                >
                  Invita a tus padres
                </h3>
                <button
                  type="button"
                  onClick={() => setParentInviteOpen(false)}
                  className="p-1 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ color: textMuted }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {parentInviteResult ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-500" />
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: textMain }}
                  >
                    ¡Invitación enviada!
                  </p>
                  <p className="text-xs" style={{ color: textMuted }}>
                    Le enviamos un correo a{" "}
                    <strong>{parentInviteResult}</strong>. Pídele que lo revise
                    y siga las instrucciones.
                  </p>
                  <button
                    type="button"
                    onClick={() => setParentInviteOpen(false)}
                    className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: SB_GRADIENTS.brand }}
                  >
                    Entendido
                  </button>
                </div>
              ) : (
                <form onSubmit={handleParentInvite} className="space-y-4">
                  <p className="text-xs" style={{ color: textMuted }}>
                    Tu padre/madre recibirá un correo con un enlace para crear
                    su cuenta y ver tu progreso.
                  </p>
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1"
                      style={{ color: textMain }}
                    >
                      Correo de tu padre o madre
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-2.5 w-4 h-4"
                        style={{ color: textMuted }}
                      />
                      <input
                        type="email"
                        required
                        value={parentInviteForm.parentEmail}
                        onChange={(e) =>
                          setParentInviteForm((p) => ({
                            ...p,
                            parentEmail: e.target.value,
                          }))
                        }
                        placeholder="mama@ejemplo.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border"
                        style={{
                          background: dm ? "#0F172A" : "#F8FAFC",
                          borderColor: dm ? "#243152" : "#CBD5E1",
                          color: textMain,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1"
                      style={{ color: textMain }}
                    >
                      Tu edad
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="17"
                      value={parentInviteForm.studentAge}
                      onChange={(e) =>
                        setParentInviteForm((p) => ({
                          ...p,
                          studentAge: e.target.value,
                        }))
                      }
                      placeholder="ej: 13"
                      className="w-full px-3 py-2 rounded-xl text-sm border"
                      style={{
                        background: dm ? "#0F172A" : "#F8FAFC",
                        borderColor: dm ? "#243152" : "#CBD5E1",
                        color: textMain,
                      }}
                    />
                  </div>
                  {parentInviteError && (
                    <p className="text-xs text-red-500">{parentInviteError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={parentInviteLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                    style={{ background: SB_GRADIENTS.brand }}
                  >
                    {parentInviteLoading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Enviar invitación
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar Perfil */}
      <AnimatePresence>
        {editOpen && (
          <EditProfileModal
            profile={editProfile}
            studentName={editProfile?.name || accountName || studentName}
            displayName={editProfile?.name || accountName || studentName}
            avatarUrl={editProfile?.avatarUrl}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
            removeAvatar={removeAvatar}
            onClose={() => setEditOpen(false)}
            onSaveSuccess={() => {}}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default SmartProfile;
