import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAuthIdentity } from "../../../hooks/useAuthIdentity";
import { useStudentProfile } from "../../../hooks/useStudentProfile";
import { useProgressContext } from "../../ProgressContext";
import { useNotification } from "../../NotificationContext";
import { useActivityTracker } from "../../../hooks/useActivityTracker";
import { useTranslation } from "../../../i18n/I18nProvider";
import { supabase } from "../../../lib/supabase";
import { modules as STATIC_MODULES } from "@/data/ialab";
import { LS_KEYS } from "@/constants/ialab";
import { useIALabStore } from "../../../store/ialabStore";
import { getAnalyzingMsgs } from "./ialabAnalyzingMsgs";

export function useIALabUI(onBack) {
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);
  const { t } = useTranslation();
  // Identidad y perfil desde Supabase. Antes venian de Clerk, que ya no
  // autentica a nadie, por lo que `user` era siempre null y todo lo que
  // dependia de `user.id` (gamificacion, notificaciones) no se ejecutaba.
  const { userId, email: authEmail, isLoaded: authLoaded } = useAuthIdentity();
  const { profile, role: userRole } = useStudentProfile();

  const activeTab = useIALabStore((s) => s.activeTab);
  const setActiveTab = useIALabStore((s) => s.setActiveTab);
  const sidebarDropdowns = useIALabStore((s) => s.sidebarDropdowns);
  const setSidebarDropdowns = useIALabStore((s) => s.setSidebarDropdowns);
  const toggleSidebarDropdown = useIALabStore((s) => s.toggleSidebarDropdown);
  const openAccordions = useIALabStore((s) => s.openAccordions);
  const setOpenAccordions = useIALabStore((s) => s.setOpenAccordions);
  const visibleAccordions = useIALabStore((s) => s.visibleAccordions);
  const setVisibleAccordions = useIALabStore((s) => s.setVisibleAccordions);
  const insightsExpanded = useIALabStore((s) => s.insightsExpanded);
  const setInsightsExpanded = useIALabStore((s) => s.setInsightsExpanded);
  const coachQ = useIALabStore((s) => s.coachQ);
  const setCoachQ = useIALabStore((s) => s.setCoachQ);
  const coachMsg = useIALabStore((s) => s.coachMsg);
  const setCoachMsg = useIALabStore((s) => s.setCoachMsg);
  const coachLoad = useIALabStore((s) => s.coachLoad);
  const setCoachLoad = useIALabStore((s) => s.setCoachLoad);
  const isListening = useIALabStore((s) => s.isListening);
  const setIsListening = useIALabStore((s) => s.setIsListening);
  const avatarState = useIALabStore((s) => s.avatarState);
  const setAvatarState = useIALabStore((s) => s.setAvatarState);
  const showValerioDrawer = useIALabStore((s) => s.showValerioDrawer);
  const setShowValerioDrawer = useIALabStore((s) => s.setShowValerioDrawer);
  const showProfileDropdown = useIALabStore((s) => s.showProfileDropdown);
  const setShowProfileDropdown = useIALabStore((s) => s.setShowProfileDropdown);
  const showEvaluationTooltip = useIALabStore((s) => s.showEvaluationTooltip);
  const setShowEvaluationTooltip = useIALabStore(
    (s) => s.setShowEvaluationTooltip,
  );
  const certName = useIALabStore((s) => s.certName);
  const setCertName = useIALabStore((s) => s.setCertName);
  const showNameModal = useIALabStore((s) => s.showNameModal);
  const setShowNameModal = useIALabStore((s) => s.setShowNameModal);
  const courseCompleted = useIALabStore((s) => s.courseCompleted);
  const setCourseCompleted = useIALabStore((s) => s.setCourseCompleted);
  const showCertificateModal = useIALabStore((s) => s.showCertificateModal);
  const setShowCertificateModal = useIALabStore(
    (s) => s.setShowCertificateModal,
  );
  const storedCertificate = useIALabStore((s) => s.storedCertificate);
  const setStoredCertificate = useIALabStore((s) => s.setStoredCertificate);
  const certificateGenerating = useIALabStore((s) => s.certificateGenerating);
  const setCertificateGenerating = useIALabStore(
    (s) => s.setCertificateGenerating,
  );
  const currentLessonIndex = useIALabStore((s) => s.currentLessonIndex);
  const setCurrentLessonIndex = useIALabStore((s) => s.setCurrentLessonIndex);
  const isSynthesizerOpen = useIALabStore((s) => s.isSynthesizerOpen);
  const setIsSynthesizerOpen = useIALabStore((s) => s.setIsSynthesizerOpen);
  const isMarkingComplete = useIALabStore((s) => s.isMarkingComplete);
  const setIsMarkingComplete = useIALabStore((s) => s.setIsMarkingComplete);
  const showBadgeGallery = useIALabStore((s) => s.showBadgeGallery);
  const setShowBadgeGallery = useIALabStore((s) => s.setShowBadgeGallery);
  const showLeaderboard = useIALabStore((s) => s.showLeaderboard);
  const setShowLeaderboard = useIALabStore((s) => s.setShowLeaderboard);
  const isTouchDevice = useIALabStore((s) => s.isTouchDevice);
  const setIsTouchDevice = useIALabStore((s) => s.setIsTouchDevice);
  const isIOS = useIALabStore((s) => s.isIOS);
  const setIsIOS = useIALabStore((s) => s.setIsIOS);
  const isAndroid = useIALabStore((s) => s.isAndroid);
  const setIsAndroid = useIALabStore((s) => s.setIsAndroid);
  const clearProgressFromStorage = useIALabStore(
    (s) => s.clearProgressFromStorage,
  );
  const xp = useIALabStore((s) => s.xp);
  const streak = useIALabStore((s) => s.streak);
  const badges = useIALabStore((s) => s.badges);
  const lessonProgress = useIALabStore((s) => s.lessonProgress);

  const user = useMemo(() => {
    if (!userId) return null;
    const fullName =
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
      profile?.username ||
      t("profile.user_fallback");
    return {
      id: userId,
      full_name: fullName,
      email: profile?.email || authEmail || "",
      fullName,
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      username: profile?.username || "",
      imageUrl: profile?.avatar_url || "",
      createdAt: profile?.created_at || null,
      role: userRole,
    };
  }, [userId, authEmail, profile, userRole, t]);

  const signOut = async () => {
    // Clerk's signOut was a no-op here (no Clerk session existed), so sessions
    // were never actually closed. Clearing the Supabase session is what signs
    // the student out.
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
    } catch {
      /* ignore */
    }
    clearProgressFromStorage();
    window.location.replace("/login");
  };

  const { syncGamification: syncGamificationToSupabase } = useProgressContext();
  const { createNotification } = useNotification();
  const { trackActivity } = useActivityTracker();

  const gamificationSyncRef = useRef(null);
  useEffect(() => {
    if (!user?.id || !syncGamificationToSupabase) return;
    clearTimeout(gamificationSyncRef.current);
    gamificationSyncRef.current = setTimeout(() => {
      const s = useIALabStore.getState();
      syncGamificationToSupabase({
        xp: s.xp,
        streak: s.streak,
        lastActivityDate: s.lastActivityDate,
        badges: s.badges,
        lessonProgress: s.lessonProgress,
        checkpointAnswers: s.checkpointAnswers,
        forumPostCount: s.forumPostCount,
        forumCommentCount: s.forumCommentCount,
        startDate: s.startDate,
      });
    }, 2000);
    return () => clearTimeout(gamificationSyncRef.current);
  }, [
    xp,
    streak,
    badges,
    lessonProgress,
    user?.id,
    syncGamificationToSupabase,
  ]);

  useEffect(() => {
    if (!user?.id) return;
    const loadExistingCert = async () => {
      try {
        const { data } = await supabase
          .from("certificates")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setStoredCertificate(data);
          setCertName(data.cert_name || "");
          setCourseCompleted(true);
        }
      } catch (err) {
        console.error("Error cargando certificado:", err);
      }
    };
    loadExistingCert();
  }, [user?.id]);

  const generateCertificate = useCallback(
    async (overrideName) => {
      if (!user?.id) {
        console.error("generateCertificate: user.id no disponible");
        return { success: false, error: t("progress.unauthenticated") };
      }

      setCertificateGenerating(true);
      try {
        const existingCert = await supabase
          .from("certificates")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingCert.error) {
          console.error(
            "Error buscando certificado existente:",
            existingCert.error.message,
          );
        }

        if (existingCert.data) {
          setStoredCertificate(existingCert.data);
          setCertificateGenerating(false);
          return existingCert.data;
        }

        const studentName =
          (overrideName || certName).trim() ||
          user.full_name ||
          t("progress.student_fallback");
        const s = useIALabStore.getState();
        const moduleScores = [1, 2, 3, 4, 5].map((id) =>
          s.calculateModuleScore(id),
        );
        const overallScore = Math.round(
          moduleScores.reduce((a, b) => a + b, 0) / 5,
        );

        const certData = {
          user_id: user.id,
          cert_name: studentName,
          overall_score: Math.max(overallScore, 80),
          modules_completed: 5,
        };

        const { data, error } = await supabase
          .from("certificates")
          .insert(certData)
          .select()
          .single();

        if (error)
          throw new Error(error.message || t("certificate.error_generating"));

        setStoredCertificate(data);
        setCourseCompleted(true);

        await createNotification({
          type: "certificate_earned",
          title: t("certificate.generated_title"),
          message: t("certificate.generated_msg", {
            studentName,
            score: Math.max(overallScore, 80),
          }),
          metadata: {
            score: Math.max(overallScore, 80),
            certId: data.id,
            studentName,
          },
        });

        await trackActivity({
          moduleId: 0,
          type: "resource",
          resourceId: `certificate_${data.id}`,
          title: t("progress.certificate_generated_activity", { studentName }),
          score: Math.max(overallScore, 80),
          metadata: {
            action: "certificate_generated",
            certId: data.id,
            studentName,
          },
        });

        return data;
      } catch (err) {
        console.error("Error generando certificado:", err);
        return {
          success: false,
          error: err.message || t("progress.unknown_error"),
        };
      } finally {
        setCertificateGenerating(false);
      }
    },
    [user, createNotification, trackActivity, certName],
  );

  useEffect(() => {
    if (!user?.id) return;
    const s = useIALabStore.getState();
    const isFullyComplete = s.checkCourseCompletion();
    const hasNotified = localStorage.getItem(LS_KEYS.NOTIFIED_CERTIFICATION);

    if (isFullyComplete && !hasNotified) {
      localStorage.setItem(LS_KEYS.NOTIFIED_CERTIFICATION, "true");
      createNotification({
        type: "certificate_earned",
        title: t("certificate.course_completed_title"),
        message: t("certificate.course_completed_msg", {
          progress: Math.round(s.courseProgress),
        }),
        metadata: { progress: s.courseProgress, allModulesApproved: true },
      });

      trackActivity({
        moduleId: 0,
        type: "resource",
        resourceId: "course_completed",
        title: t("progress.course_completed_activity"),
        score: Math.round(s.courseProgress),
        metadata: { action: "course_certified", progress: s.courseProgress },
      });
    }
  }, [courseCompleted, user?.id, createNotification, trackActivity]);

  const backfillRef = useRef(false);
  useEffect(() => {
    if (!user?.id) return;
    const s = useIALabStore.getState();
    const completedMods = s.completedModules;
    if (!completedMods.length || backfillRef.current) return;
    const backfilledKey = `ialab_notifs_backfilled_${user.id}`;
    if (localStorage.getItem(backfilledKey)) return;

    completedMods.forEach((modId) => {
      if (modId < 1 || modId > 5) return;
      const moduleName =
        STATIC_MODULES.find((m) => m.id === modId)?.title ||
        t("progress.module_fallback", { id: modId });
      const score = Math.max(s.calculateModuleScore(modId), 80);
      createNotification({
        type: "module_complete",
        title: t("progress.module_completed_title", { moduleName }),
        message: t("progress.module_completed_msg", {
          score,
          nextMsg: t("progress.module_completed_all"),
        }),
        metadata: { moduleId: modId, score, backfilled: true },
      });
    });

    backfillRef.current = true;
    localStorage.setItem(backfilledKey, "true");
  }, [user?.id, createNotification]);

  const lastModuleNotifiedRef = useRef(0);
  useEffect(() => {
    if (!user?.id) return;
    const s = useIALabStore.getState();
    const activeModule = s.activeMod;
    if (activeModule === 1 || activeModule === lastModuleNotifiedRef.current)
      return;

    const mod = STATIC_MODULES.find((m) => m.id === activeModule);
    if (!mod) return;

    const prevModuleId = activeModule - 1;
    const prevScore = s.calculateModuleScore(prevModuleId);
    const prevPassed = prevScore >= 80;

    let title, message;
    if (prevPassed) {
      title = t("progress.module_unlocked_title", { moduleId: activeModule });
      message = t("progress.module_unlocked_msg", {
        moduleName: mod.title,
        prevMsg:
          prevModuleId < 5
            ? t("progress.module_unlocked_passed", { score: prevScore })
            : t("progress.module_unlocked_last"),
      });
    } else if (prevModuleId >= 1) {
      title = t("progress.module_view_title", { moduleName: mod.title });
      message = t("progress.module_explore_msg");
    } else {
      title = t("progress.module_view_title", { moduleName: mod.title });
      message = t("progress.module_new_msg");
    }

    createNotification({
      type: "course_update",
      title,
      message,
      metadata: { moduleId: activeModule, action: "module_entered" },
    });

    trackActivity({
      moduleId: activeModule,
      type: "resource",
      resourceId: `m${activeModule}_module_entered`,
      title: t("progress.module_started_activity", { moduleName: mod.title }),
      metadata: { action: "module_started", prevScore },
    });

    lastModuleNotifiedRef.current = activeModule;
  }, [user?.id, createNotification, trackActivity]);

  const contextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      sidebarDropdowns,
      setSidebarDropdowns,
      toggleSidebarDropdown,
      openAccordions,
      setOpenAccordions,
      visibleAccordions,
      setVisibleAccordions,
      insightsExpanded,
      setInsightsExpanded,
      coachQ,
      setCoachQ,
      coachMsg,
      setCoachMsg,
      coachLoad,
      setCoachLoad,
      isListening,
      setIsListening,
      avatarState,
      setAvatarState,
      showValerioDrawer,
      setShowValerioDrawer,
      showProfileDropdown,
      setShowProfileDropdown,
      showEvaluationTooltip,
      setShowEvaluationTooltip,
      certName,
      setCertName,
      showNameModal,
      setShowNameModal,
      courseCompleted,
      setCourseCompleted,
      showCertificateModal,
      setShowCertificateModal,
      storedCertificate,
      setStoredCertificate,
      certificateGenerating,
      currentLessonIndex,
      setCurrentLessonIndex,
      isSynthesizerOpen,
      setIsSynthesizerOpen,
      isMarkingComplete,
      setIsMarkingComplete,
      isTouchDevice,
      setIsTouchDevice,
      isIOS,
      setIsIOS,
      isAndroid,
      setIsAndroid,
      showBadgeGallery,
      setShowBadgeGallery,
      showLeaderboard,
      setShowLeaderboard,
      user,
      isLoaded: authLoaded,
      signOut,
      onBack: (...args) => onBackRef.current?.(...args),
      msgs: getAnalyzingMsgs(t),
      generateCertificate,
    }),
    [
      activeTab,
      sidebarDropdowns,
      openAccordions,
      visibleAccordions,
      insightsExpanded,
      coachQ,
      coachMsg,
      coachLoad,
      isListening,
      avatarState,
      showValerioDrawer,
      showProfileDropdown,
      showEvaluationTooltip,
      certName,
      showNameModal,
      courseCompleted,
      showCertificateModal,
      storedCertificate,
      certificateGenerating,
      currentLessonIndex,
      isSynthesizerOpen,
      isMarkingComplete,
      isTouchDevice,
      isIOS,
      isAndroid,
      showBadgeGallery,
      setShowBadgeGallery,
      showLeaderboard,
      setShowLeaderboard,
      user,
      authLoaded,
      signOut,
      generateCertificate,
    ],
  );

  return contextValue;
}
