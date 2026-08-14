import { useState, useEffect, useRef } from "react";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { supabase } from "../../lib/supabase";
import { useProgressContext } from "../../context/ProgressContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { normalizePhone } from "./profileSaveLogic";
import { API_BASE_URL } from "../../config/api";

export function useProfileData({ isOpen, onClose, onOpenChangeAvatar }) {
  const { t, locale } = useTranslation();
  // Identidad y perfil desde Supabase. Antes venia de Clerk, que ya no
  // autentica, por lo que la tarjeta de perfil quedaba vacia.
  const {
    userId,
    email: authEmail,
    isSignedIn,
    isLoaded: clerkIsLoaded,
  } = useAuthIdentity();
  const {
    courseProgress,
    completedModules,
    completedVideos,
    completedExams,
    completedInfographics,
    completedActivities,
  } = useProgressContext();

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    email: "",
    role: "student",
    total_learning_hours: 0,
    created_at: null,
  });

  const [pendingChanges, setPendingChanges] = useState({
    full_name: "",
    phone: "",
  });

  const [stats, setStats] = useState({
    completedLessons: 0,
    completedModules: 0,
    progressPercent: 0,
    certificates: 0,
    bestScore: 0,
    learningHours: 0,
    enrollmentDate: null,
  });

  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [phoneError, setPhoneError] = useState("");

  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const hasLoadedRef = useRef(false);

  const getUserInitials = () => {
    const name = profileData.full_name || "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const getRoleLabel = (role) => {
    const labels = {
      student: t("mobile_menu.role_student"),
      teacher: t("mobile_menu.role_teacher"),
      admin: t("profile.role_admin"),
      premium_student: t("profile.role_premium_student"),
    };
    return labels[role] || t("mobile_menu.role_student");
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      student: "bg-white/15 text-white/90",
      teacher: "bg-amber-400/20 text-amber-200",
      admin: "bg-rose-400/20 text-rose-200",
      premium_student: "bg-emerald-400/20 text-emerald-200",
    };
    return colors[role] || colors.student;
  };

  const validatePhone = (phone) => {
    if (!phone || phone.length === 0) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10 && !digits.startsWith("3")) {
      return t("profile.phone_error_format");
    }
    if (digits.length > 0 && digits.length < 10) {
      return t("profile.phone_error_digits", { count: 10 - digits.length });
    }
    return "";
  };

  const hasPendingChanges = () => {
    return (
      pendingChanges.full_name !== profileData.full_name ||
      pendingChanges.phone !== profileData.phone
    );
  };

  const formatDate = (date) => {
    if (!date) return t("profile.na");
    return new Date(date).toLocaleDateString(
      { en: "en-US", pt: "pt-BR", es: "es-CO" }[locale] || "es-CO",
      { day: "numeric", month: "short", year: "numeric" },
    );
  };

  const loadProfileData = async () => {
    if (!userId || !isSignedIn) return;
    setIsLoading(true);

    const clerkName = t("profile.user_fallback");
    const clerkEmail = authEmail || "";
    const clerkRole = "student";
    const clerkCreatedAt = null;

    setProfileData((prev) => ({
      ...prev,
      full_name: clerkName,
      email: clerkEmail,
      role: clerkRole,
    }));
    setPendingChanges({ full_name: clerkName, phone: "" });

    try {
      const [profileRes, certRes] = await Promise.all([
        supabase
          .from("users")
          .select("id, first_name, last_name, email, created_at")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("certificates")
          .select("id, overall_score")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      let learningHours = 0;
      let createdAt = clerkCreatedAt;
      let phone = "";

      if (profileRes.data) {
        const p = profileRes.data;
        const name =
          [p.first_name, p.last_name].filter(Boolean).join(" ") || clerkName;
        // phone_number puede no existir en la tabla users (esquema variable);
        // consultarlo por separado y tolerar su ausencia. Respaldo: profiles.phone.
        try {
          const { data: phoneRow, error: phoneErr } = await supabase
            .from("users")
            .select("phone_number")
            .eq("id", userId)
            .maybeSingle();
          phone = phoneRow?.phone_number || "";
          if (
            (phoneErr || !phone) &&
            /column.*does not exist|PGRST204|42703/i.test(
              phoneErr?.message || "",
            )
          ) {
            const { data: profRow } = await supabase
              .from("profiles")
              .select("phone")
              .eq("id", userId)
              .maybeSingle();
            phone = profRow?.phone || "";
          }
        } catch {
          phone = "";
        }
        setProfileData((prev) => ({
          ...prev,
          full_name: name,
          email: p.email || clerkEmail,
          phone,
          role: clerkRole,
          total_learning_hours: 0,
          created_at: p.created_at || createdAt,
        }));
        setPendingChanges({ full_name: name, phone });
        if (p.created_at) createdAt = p.created_at;
        setIsSynced(true);
      }

      const completedLessons =
        completedVideos.length +
        completedInfographics.length +
        completedActivities.length +
        Object.values(completedExams).filter(Boolean).length;
      const completedModulesCount = completedModules.length;
      const progressPercent = courseProgress;

      setStats({
        completedLessons: Number(completedLessons),
        completedModules: Number(completedModulesCount),
        progressPercent: Math.round(Number(progressPercent)),
        certificates: certRes.data ? 1 : 0,
        bestScore: certRes.data?.overall_score || 0,
        learningHours,
        enrollmentDate: createdAt,
      });

      hasLoadedRef.current = true;
    } catch (err) {
      console.warn("Error loading profile:", err.message);
      setIsSynced(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      hasLoadedRef.current = false;
      return;
    }
    if (!userId || !isSignedIn) return;
    if (hasLoadedRef.current) return;
    loadProfileData();
  }, [isOpen, userId, isSignedIn]);

  useEffect(() => {
    if (!isOpen) return;
    setStats((prev) => ({
      ...prev,
      completedLessons:
        completedVideos.length +
        completedInfographics.length +
        completedActivities.length +
        Object.values(completedExams).filter(Boolean).length,
      completedModules: completedModules.length,
      progressPercent: Math.round(courseProgress),
    }));
  }, [
    isOpen,
    courseProgress,
    completedModules,
    completedVideos,
    completedExams,
    completedInfographics,
    completedActivities,
  ]);

  const startEditing = (field) => {
    setEditingField(field);
    setTempValue(profileData[field] || "");
    setPhoneError("");
    setTimeout(() => {
      if (field === "full_name" && nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.select();
      } else if (field === "phone" && phoneInputRef.current) {
        phoneInputRef.current.focus();
        phoneInputRef.current.select();
      }
    }, 50);
  };

  const handleTempChange = (field, value) => {
    if (field === "phone") {
      const digits = normalizePhone(value);
      setTempValue(digits);
      setPhoneError(validatePhone(digits));
      setPendingChanges((prev) => ({ ...prev, phone: digits }));
    } else {
      setTempValue(value);
      setPendingChanges((prev) => ({ ...prev, full_name: value }));
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
    setPhoneError("");
  };

  const handleSaveAll = async () => {
    if (!userId || !hasPendingChanges()) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // 1. Guardar el NOMBRE (columnas first_name/last_name, siempre presentes
      //    en la tabla users). Es el cambio principal y no debe depender de
      //    columnas opcionales.
      if (pendingChanges.full_name !== profileData.full_name) {
        const parts = pendingChanges.full_name.trim().split(" ");
        const updates = {
          first_name: parts[0] || "",
          last_name: parts.slice(1).join(" "),
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
          .from("users")
          .update(updates)
          .eq("id", userId);
        if (error) throw new Error(error.message);
      }

      // 2. Guardar el TELÉFONO por separado y de forma tolerante: la columna
      //    phone_number puede no existir en el esquema real de users, en cuyo
      //    caso se intenta en profiles.phone (poblada por el trigger de auth).
      if (pendingChanges.phone !== profileData.phone) {
        const phone = normalizePhone(pendingChanges.phone);
        try {
          const { error } = await supabase
            .from("users")
            .update({
              phone_number: phone,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
          if (
            error &&
            !/column.*does not exist|PGRST204|42703/i.test(error.message || "")
          ) {
            throw new Error(error.message);
          }
        } catch (phoneErr) {
          // Columna phone_number ausente en users → intentar en profiles.phone
          try {
            await supabase
              .from("profiles")
              .update({ phone, updated_at: new Date().toISOString() })
              .eq("id", userId);
          } catch (profilesErr) {
            console.warn(
              "phone_number/profile.phone unavailable:",
              profilesErr.message,
            );
          }
        }
      }

      setProfileData((prev) => ({
        ...prev,
        full_name: pendingChanges.full_name,
        phone: pendingChanges.phone,
      }));
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: {
            full_name: pendingChanges.full_name,
            phone: pendingChanges.phone,
          },
        }),
      );

      setSaveMessage({ type: "success", text: t("profile.save_success") });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error("Error saving profile:", err.message);
      setSaveMessage({ type: "error", text: t("profile.save_error") });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChangePassword = async () => {
    // Antes abria el perfil de Clerk y, si fallaba, mandaba al usuario a
    // accounts.clerk.com. Ahora usa el flujo propio de recuperacion.
    try {
      await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: displayEmail }),
      });
      setSaveMessage({
        type: "success",
        text: t("profile.password_email_sent"),
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err) {
      console.error("reset-password:", err.message);
      setSaveMessage({ type: "error", text: t("profile.save_error") });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleLogout = async () => {
    if (window.confirm(t("profile.confirm_logout"))) {
      try {
        sessionStorage.removeItem("auth_token");
        localStorage.removeItem("user_email");
      } catch (err) {
        console.error("Error signing out:", err);
      }
      onClose();
      window.location.replace("/login");
    }
  };

  const displayEmail = profileData.email || authEmail || "";
  const displayName = profileData.full_name || t("profile.user_fallback");

  return {
    t,
    locale,
    profileData,
    pendingChanges,
    stats,
    isLoading,
    editingField,
    tempValue,
    isSaving,
    saveMessage,
    phoneError,
    nameInputRef,
    phoneInputRef,
    getUserInitials,
    getRoleLabel,
    getRoleBadgeColor,
    hasPendingChanges,
    formatDate,
    displayEmail,
    displayName,
    startEditing,
    handleTempChange,
    handleCancelEdit,
    handleSaveAll,
    handleOpenChangePassword,
    handleLogout,
  };
}
