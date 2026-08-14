import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  ChevronDown,
  Loader2,
  Check,
  X,
  Camera,
  Trash2,
  LogOut,
  BarChart3,
} from "lucide-react";
import { useStudentProfileSmartBoard } from "../../hooks/useStudentProfileSmartBoard";
import { useTranslation } from "../../i18n/I18nProvider";

const VAK_STYLES_MAP = {
  visual: {
    es: "visual",
    labelKey: "kid.vak.style_visual",
    color: "#0077B6",
    icon: "👁️",
    bg: "#E1F2FB",
  },
  auditory: {
    es: "auditivo",
    labelKey: "kid.vak.style_auditory",
    color: "#0F766E",
    icon: "👂",
    bg: "#E0F5F2",
  },
  kinesthetic: {
    es: "kinestesico",
    labelKey: "kid.vak.style_kinesthetic",
    color: "#B45309",
    icon: "🤸",
    bg: "#FEF3E2",
  },
};

const VAK_OPTIONS = [
  { value: "visual", labelKey: "kid.vak.style_visual", icon: "👁️" },
  { value: "auditory", labelKey: "kid.vak.style_auditory", icon: "👂" },
  { value: "kinesthetic", labelKey: "kid.vak.style_kinesthetic", icon: "🤸" },
];

export const getInitials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "S";

const getVakKey = (vakStyle) => {
  if (!vakStyle) return null;
  const normalized = String(vakStyle).toLowerCase().trim();
  const map = {
    visual: "visual",
    auditivo: "auditory",
    auditory: "auditory",
    kinestesico: "kinesthetic",
    kinesthetic: "kinesthetic",
  };
  return map[normalized] || null;
};

const UserMenu = ({
  authToken,
  studentName,
  darkMode,
  onTabChange,
  onLogout,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const { profile, loading, error, updateProfile, uploadAvatar, removeAvatar } =
    useStudentProfileSmartBoard(authToken);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const displayName = profile?.name || studentName || t("kid.user.student");
  const vakKey = getVakKey(profile?.vakStyle);
  const vakMeta = VAK_STYLES_MAP[vakKey];
  const avatarUrl = profile?.avatarUrl;
  const surface = darkMode
    ? "bg-[#151F32] text-white"
    : "bg-white text-gray-800";
  const muted = darkMode ? "text-[#94A3B8]" : "text-gray-500";

  // Inicializar form con datos del perfil cuando se abre modal
  const openEditModal = () => {
    setFormData({
      name: profile?.name || studentName || "",
      age: profile?.age || "",
      vakStyle: profile?.vakStyle || "",
      school: profile?.school || "",
      grade: profile?.grade || "",
    });
    setAvatarPreview("");
    setSaveMessage("");
    setSaveError("");
    setIsEditingModal(true);
    setIsOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    setSaveError("");
    const payload = {};
    if (formData.name !== undefined && formData.name !== (profile?.name || ""))
      payload.name = formData.name;
    if (formData.age !== undefined && formData.age !== (profile?.age ?? "")) {
      const ageValue = String(formData.age).trim();
      const ageNum = Number(ageValue);
      if (
        ageValue !== "" &&
        !(Number.isFinite(ageNum) && ageNum >= 5 && ageNum <= 25)
      ) {
        setSaveError(t("kid.user.save_error"));
        setSaving(false);
        return;
      }
      if (ageValue !== "") payload.age = ageNum;
    }
    if (
      formData.vakStyle !== undefined &&
      formData.vakStyle !== (profile?.vakStyle || "")
    )
      payload.vakStyle = formData.vakStyle;
    if (
      formData.school !== undefined &&
      formData.school !== (profile?.school || "")
    )
      payload.school = formData.school;
    if (
      formData.grade !== undefined &&
      formData.grade !== (profile?.grade || "")
    )
      payload.grade = formData.grade;

    const success = await updateProfile(payload);
    setSaving(false);
    if (success) {
      setSaveMessage(t("kid.user.saved"));
      setTimeout(() => {
        setIsEditingModal(false);
        setSaveMessage("");
      }, 1500);
    } else {
      setSaveError(t("kid.user.save_error"));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveError(t("kid.user.avatar_too_big"));
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setSaveError(t("kid.user.avatar_invalid"));
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setAvatarPreview(dataUrl);
      setSaveError("");
      setUploadingAvatar(true);
      const ok = await uploadAvatar(dataUrl);
      setUploadingAvatar(false);
      if (ok) {
        setSaveMessage(t("kid.user.avatar_saved"));
        setTimeout(() => setSaveMessage(""), 2000);
      } else {
        setSaveError(t("kid.user.load_error"));
        setAvatarPreview("");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveAvatar = async () => {
    setSaving(true);
    setSaveError("");
    const ok = await removeAvatar();
    setSaving(false);
    setAvatarPreview("");
    if (ok) setSaveMessage(t("kid.user.saved"));
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    if (onLogout) onLogout();
  };

  const handleProgressClick = () => {
    setIsOpen(false);
    if (onTabChange) onTabChange("progreso");
  };

  // Renderizar campo editable
  const renderField = (key, label, type = "text", placeholder = "") => (
    <div key={key} className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={formData[key] || ""}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
      />
    </div>
  );

  return (
    <>
      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={t("kid.user.open_menu")}
          aria-expanded={isOpen}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold">
                {getInitials(displayName)}
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white overflow-hidden flex-shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold">
                        {getInitials(displayName)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-base truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-white/80">
                      {t("kid.user.smartboard_profile")}
                    </p>
                    {vakMeta && (
                      <span
                        className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                      >
                        {vakMeta.icon} {t(vakMeta.labelKey)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-4 text-center">
                  <Loader2 className="w-5 h-5 animate-spin inline text-[#0077B6]" />
                  <p className="text-sm text-gray-600 mt-2">
                    {t("kid.user.loading")}
                  </p>
                </div>
              )}

              {/* Profile Data */}
              {!loading && profile && (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#0284C7]">
                        {t("kid.user.age")}
                      </p>
                      <p className="text-sm text-gray-800 mt-0.5">
                        {profile.age
                          ? t("kid.user.age_value", { age: profile.age })
                          : t("kid.user.not_specified_age")}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#15803D]">
                        {t("kid.user.grade")}
                      </p>
                      <p className="text-sm text-gray-800 mt-0.5">
                        {profile.grade || t("kid.user.not_specified")}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#B45309]">
                      {t("kid.user.vak_type")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {vakMeta ? (
                        <>
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: vakMeta.bg,
                              color: vakMeta.color,
                            }}
                          >
                            {vakMeta.icon} {t(vakMeta.labelKey)}
                          </span>
                        </>
                      ) : (
                        <p className="text-sm text-gray-800">
                          {t("kid.user.not_detected")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] border border-gray-200 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      {t("kid.user.school")}
                    </p>
                    <p className="text-sm text-gray-800 mt-0.5">
                      {profile.school || t("kid.user.not_specified")}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="p-4 text-center text-red-600 text-sm">
                  {t("kid.user.load_error")}
                </div>
              )}

              {/* Actions */}
              {!loading && (
                <div className="p-3 border-t border-gray-200 space-y-2">
                  <button
                    onClick={handleProgressClick}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#F0F9FF] transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-[#0077B6]" />
                    {t("kid.user.progress")}
                  </button>
                  <button
                    onClick={openEditModal}
                    className="w-full flex items-center justify-center gap-2 bg-[#0077B6] hover:bg-[#005fa3] text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    {t("kid.user.edit_profile")}
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("kid.user.logout")}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Editar Perfil */}
      <AnimatePresence>
        {isEditingModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingModal(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 max-w-sm w-11/12 z-50 max-h-[90dvh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {t("kid.user.edit_profile_title")}
                </h2>
                <button
                  onClick={() => setIsEditingModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                  aria-label={t("kid.user.cancel")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white overflow-hidden relative"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarPreview || avatarUrl ? (
                    <img
                      src={avatarPreview || avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {getInitials(formData.name || displayName)}
                    </span>
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] py-0.5 flex items-center justify-center gap-0.5">
                    {uploadingAvatar ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Camera className="w-3 h-3" />
                    )}
                    {t("kid.user.avatar_update")}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0077B6] text-white rounded-lg text-xs font-semibold hover:bg-[#005fa3] transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    {t("kid.user.avatar_upload")}
                  </button>
                  {(avatarPreview || avatarUrl) && (
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={saving || uploadingAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t("kid.user.avatar_remove")}
                    </button>
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              {/* Form */}
              <div className="mb-6">
                {renderField(
                  "name",
                  t("kid.user.fullname"),
                  "text",
                  t("kid.user.fullname_placeholder"),
                )}
                {renderField(
                  "age",
                  t("kid.user.age"),
                  "number",
                  t("kid.user.age_placeholder"),
                )}

                {/* VAK Select */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("kid.user.vak_type")}
                  </label>
                  <select
                    value={formData.vakStyle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, vakStyle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] bg-white"
                  >
                    <option value="">{t("kid.user.select_vak")}</option>
                    {VAK_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.icon} {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                {renderField(
                  "school",
                  t("kid.user.school"),
                  "text",
                  t("kid.user.school_placeholder"),
                )}
                {renderField(
                  "grade",
                  t("kid.user.grade"),
                  "text",
                  t("kid.user.grade_placeholder"),
                )}
              </div>

              {/* Messages */}
              {saveMessage && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  <Check className="w-4 h-4" />
                  {saveMessage}
                </div>
              )}
              {saveError && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  <X className="w-4 h-4" />
                  {saveError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditingModal(false)}
                  disabled={saving || uploadingAvatar}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-semibold"
                >
                  {t("kid.user.cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || uploadingAvatar}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#005fa3] transition-colors disabled:opacity-50 font-semibold"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? t("kid.user.saving") : t("kid.user.save")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

UserMenu.propTypes = {
  authToken: PropTypes.string,
  studentName: PropTypes.string,
  darkMode: PropTypes.bool,
  onTabChange: PropTypes.func,
  onLogout: PropTypes.func,
};

export default UserMenu;
