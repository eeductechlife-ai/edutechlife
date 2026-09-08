import {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useIALabStore } from "../../../store/ialabStore";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getModules } from "../../../data/ialab";
import { Icon } from "../../../utils/iconMapping.jsx";
import DashboardBgPattern from "./DashboardBgPattern";
import DashboardTopBar from "./DashboardTopBar";
import DashboardTabs from "./DashboardTabs";
import DashboardModuleList from "./DashboardModuleList";
import DashboardNewStudent from "./DashboardNewStudent";
import { useAuth } from "../../../context/AuthContext";

const DashboardActivityView = lazy(() => import("./DashboardActivityView"));

const MODULES = [1, 2, 3, 4, 5];
const IDLE_TIMEOUT = 60000;

function DashboardInProgress() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const xp = useIALabStore((s) => s.xp);
  const streak = useIALabStore((s) => s.streak);
  const completedExams = useIALabStore((s) => s.completedExams);
  const challengeScores = useIALabStore((s) => s.challengeScores);
  const courseProgress = useIALabStore((s) => s.courseProgress);
  const courseCompleted = useIALabStore((s) => s.courseCompleted);

  const modulesData = useMemo(() => getModules(locale), [locale]);

  const { user, profile } = useAuth();
  const firstName = useMemo(() => {
    if (profile?.first_name) return profile.first_name;
    if (user?.user_metadata?.first_name) return user.user_metadata.first_name;
    if (user?.user_metadata?.username) return user.user_metadata.username;
    if (user?.email) return user.email.split("@")[0];
    return null;
  }, [user, profile]);

  const [idlePct, setIdlePct] = useState(0);
  const [activeTab, setActiveTab] = useState("modules");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const idleRef = useRef(null);
  const animRef = useRef(null);
  const fileInputRef = useRef(null);

  const stats = useMemo(() => {
    const completed = MODULES.filter((id) => {
      const mod = moduleProgress[id];
      return (
        mod?.exam &&
        mod?.challenge &&
        mod?.resourcesCompleted &&
        (mod?.currentScore || 0) >= 80
      );
    }).length;
    const scores = MODULES.map((id) => completedExams[id]).filter(Boolean);
    return {
      completed,
      avgScore: scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0,
    };
  }, [moduleProgress, completedExams]);

  const modules = useMemo(
    () =>
      MODULES.map((id) => {
        const mod = moduleProgress[id];
        const approved =
          mod?.exam &&
          mod?.challenge &&
          mod?.resourcesCompleted &&
          (mod?.currentScore || 0) >= 80;
        return {
          id,
          approved,
          unlocked: id === 1 || mod?.isUnlocked === true,
          score: mod?.currentScore || 0,
          examScore: completedExams[id],
          challengeScore: challengeScores[id],
        };
      }),
    [moduleProgress, completedExams, challengeScores],
  );

  const firstIncomplete = useMemo(
    () => modules.find((m) => m.unlocked && !m.approved) || null,
    [modules],
  );
  const activeModuleId = firstIncomplete?.id || 5;
  const suggestedAction = useMemo(
    () => useIALabStore.getState().getNextSuggestedAction(),
    [moduleProgress, courseProgress],
  );

  const hasNoProgress = useMemo(
    () =>
      !moduleProgress[1] ||
      (!moduleProgress[1]?.resourcesCompleted &&
        !moduleProgress[1]?.exam &&
        !moduleProgress[1]?.challenge),
    [moduleProgress],
  );

  const doNavigate = useCallback(() => {
    if (hasNoProgress) {
      navigate("/ialab/1");
      return;
    }
    if (suggestedAction?.moduleId) {
      navigate(`/ialab/${suggestedAction.moduleId}`);
      return;
    }
    if (activeModuleId) {
      navigate(`/ialab/${activeModuleId}`);
    }
  }, [navigate, hasNoProgress, suggestedAction, activeModuleId]);

  const resetIdle = useCallback(() => {
    setIdlePct(0);
    clearTimeout(idleRef.current);
    clearInterval(animRef.current);
    if (courseCompleted || hasNoProgress) return;
    const start = Date.now();
    animRef.current = setInterval(
      () =>
        setIdlePct(Math.min(100, ((Date.now() - start) / IDLE_TIMEOUT) * 100)),
      100,
    );
    idleRef.current = setTimeout(doNavigate, IDLE_TIMEOUT);
  }, [courseCompleted, hasNoProgress, doNavigate]);

  useEffect(() => {
    resetIdle();
    const evs = ["click", "touchstart", "keydown", "mousemove"];
    evs.forEach((e) => window.addEventListener(e, resetIdle));
    return () => {
      evs.forEach((e) => window.removeEventListener(e, resetIdle));
      clearTimeout(idleRef.current);
      clearInterval(animRef.current);
    };
  }, [resetIdle]);

  useEffect(() => {
    const saved = localStorage.getItem("ialab_avatar");
    if (saved) setAvatarUrl(saved);
  }, []);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatarUrl(dataUrl);
      localStorage.setItem("ialab_avatar", dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const actionIcon =
    {
      exam: "fa-file-text",
      challenge: "fa-trophy",
      resources: "fa-video",
      community: "fa-comments",
      certificate: "fa-certificate",
    }[suggestedAction?.action] || "fa-play-circle";

  const greetingText = useMemo(() => {
    if (courseProgress >= 80) return "¡Ya casi terminas! Un último empujón 🏁";
    if (courseProgress >= 50) return "¡Vas a la mitad! Sigue así 💪";
    if (courseProgress >= 20) return "¡Buen ritmo! Continúa donde lo dejaste";
    return "¡Bienvenido de vuelta! Retoma tu progreso";
  }, [courseProgress]);

  if (hasNoProgress) return <DashboardNewStudent />;

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6">
      <DashboardBgPattern />
      <DashboardTopBar />
      <p className="text-sm font-medium text-slate-600 dark:text-white/60 -mt-3">
        {firstName ? `¡Hola de nuevo, ${firstName}! ` : ""}
        {greetingText}
      </p>

      <section
        className="relative overflow-hidden bg-gradient-to-br from-[var(--theme-emphasis)] via-[var(--theme-emphasis)]-dark to-[var(--theme-primary)] rounded-3xl shadow-lg"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,75,99,0.25),0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div className="grid grid-cols-[280px_1fr] gap-8 p-7 max-md:grid-cols-1 max-md:p-5 max-md:gap-5">
          <div className="flex flex-col items-center">
            <div className="relative w-[170px] h-[170px] max-md:w-[140px] max-md:h-[140px]">
              <svg
                viewBox="0 0 150 150"
                className="w-full h-full -rotate-90"
                data-testid="progress-ring"
                role="progressbar"
                aria-valuenow={courseProgress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={t("dashboard.global_progress", {
                  pct: courseProgress,
                })}
              >
                <circle
                  cx="75"
                  cy="75"
                  r="70"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="70"
                  fill="none"
                  stroke="#00BCD4"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={
                    2 * Math.PI * 70 * (1 - courseProgress / 100)
                  }
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  title="Cambiar foto de perfil"
                  aria-label="Cambiar foto de perfil"
                  className="w-[90px] h-[90px] max-md:w-[76px] max-md:h-[76px] rounded-full bg-white/15 backdrop-blur border-2 border-white/10 flex items-center justify-center cursor-pointer group/avatar overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_rgba(0,188,212,0.4)]"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <svg viewBox="0 0 64 64" className="w-full h-full">
                      <circle
                        cx="32"
                        cy="22"
                        r="10"
                        fill="rgba(255,255,255,0.85)"
                      />
                      <ellipse
                        cx="32"
                        cy="50"
                        rx="18"
                        ry="14"
                        fill="rgba(255,255,255,0.85)"
                      />
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 rounded-full">
                    <Icon name="fa-camera" className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
            {firstName && (
              <p className="text-sm font-bold text-white mt-2 text-center leading-tight">
                {firstName}
              </p>
            )}
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.08em] mt-1">
              {t("dashboard.global_progress", { pct: courseProgress })}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/[0.06] max-md:flex-col max-md:items-stretch max-md:gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0 shadow-md shadow-[var(--theme-primary)]/30">
                  <Icon
                    name={actionIcon}
                    className="w-[18px] h-[18px] text-white"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-0.5">
                    Tu próximo paso
                  </p>
                  <p className="text-sm font-bold text-white leading-snug">
                    {suggestedAction?.label ||
                      t("dashboard.accept_challenge", {
                        id: suggestedAction?.moduleId,
                      })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 max-md:w-full max-md:justify-between">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="relative w-9 h-9 flex items-center justify-center">
                    <svg
                      viewBox="0 0 40 40"
                      className="absolute inset-0 -rotate-90"
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="none"
                        stroke="rgba(0,188,212,0.6)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={2 * Math.PI * 18 * (idlePct / 100)}
                      />
                    </svg>
                    <span className="text-[10px] font-bold text-white">
                      {Math.ceil((1 - idlePct / 100) * (IDLE_TIMEOUT / 1000))}s
                    </span>
                  </div>
                  <span className="text-[8px] text-white/40 leading-none text-center whitespace-nowrap">
                    auto-navegar
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="dashboard-continue-btn"
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  onClick={doNavigate}
                  className="bg-[var(--theme-primary)] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_4px_14px_rgba(0,188,212,0.3)] hover:shadow-[0_6px_20px_rgba(0,188,212,0.4)] transition-all"
                >
                  {t("dashboard.continue_btn")}{" "}
                  <Icon name="fa-arrow-right" className="w-3 h-3" />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  icon: "fa-star",
                  grad: "from-amber-400 to-amber-500",
                  value: xp?.toLocaleString() || "0",
                  label: "XP ganados",
                },
                {
                  icon: "fa-fire",
                  grad: "from-orange-400 to-red-500",
                  value: streak || 0,
                  label: `día${(streak || 0) !== 1 ? "s" : ""} seguidos`,
                },
                {
                  icon: "fa-target",
                  grad: "from-[var(--theme-emphasis)] to-[var(--theme-primary)]",
                  value: `${stats.avgScore}%`,
                  label: "en exámenes",
                },
              ].map((s) => (
                <motion.div
                  key={s.icon}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  role="region"
                  aria-label={`${s.value} ${s.label}`}
                  className="bg-white/10 backdrop-blur rounded-[14px] py-3 px-2 text-center border border-white/[0.06]"
                >
                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center mx-auto mb-1.5 shadow-sm`}
                  >
                    <Icon
                      name={s.icon}
                      className="w-[15px] h-[15px] text-white"
                    />
                  </div>
                  <p className="text-lg font-black text-white leading-tight">
                    {s.value}
                  </p>
                  <p className="text-[9px] font-semibold text-white/60 leading-tight mt-0.5 uppercase tracking-wide">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "modules" ? (
        <div
          role="tabpanel"
          id="tabpanel-modules"
          aria-labelledby="tab-modules"
        >
          <DashboardModuleList />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="tabpanel-activity"
          aria-labelledby="tab-activity"
        >
          <Suspense
            fallback={
              <div className="h-32 bg-gray-100 rounded animate-pulse" />
            }
          >
            <DashboardActivityView />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default memo(DashboardInProgress);
