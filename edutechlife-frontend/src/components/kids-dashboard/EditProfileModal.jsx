import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Loader2, Check, X, Camera, Trash2 } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";
import { VAK_OPTIONS, getInitials } from "./userMenuConstants";
import {
  AGE_OPTIONS,
  GRADE_OPTIONS,
  gradeLabel,
  validateAgeGrade,
} from "../../utils/studentLevel";

// El perfil guarda el grado como texto libre ("9", "6B"); el formulario solo
// ofrece 3.º–11.º, así que un valor que no esté en la lista se pide de nuevo.
const gradeFromProfile = (grade) => {
  const n = parseInt(grade, 10);
  return GRADE_OPTIONS.includes(n) ? String(n) : "";
};

const EditProfileModal = ({
  profile,
  studentName,
  displayName,
  avatarUrl,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  onClose,
  onSaveSuccess,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: profile?.name || studentName || "",
    age: profile?.age ? String(profile.age) : "",
    vakStyle: profile?.vakStyle || "",
    school: profile?.school || "",
    grade: gradeFromProfile(profile?.grade),
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    setSaveError("");
    const payload = {};
    if (formData.name !== undefined && formData.name !== (profile?.name || ""))
      payload.name = formData.name;
    // Edad y grado se validan juntos (A los 12 años lo habitual es 6.º o 7.º).
    // Solo se exige si la persona los tocó: cambiar el nombre no se bloquea
    // por un perfil antiguo incompleto.
    const ageChanged = String(formData.age) !== String(profile?.age ?? "");
    const gradeChanged = formData.grade !== gradeFromProfile(profile?.grade);
    if (ageChanged || gradeChanged) {
      const check = validateAgeGrade(formData.age, formData.grade);
      if (!check.ok) {
        setSaveError(check.message);
        setSaving(false);
        return;
      }
      if (ageChanged) payload.age = Number(formData.age);
      if (gradeChanged) payload.grade = String(formData.grade);
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
    const result = await updateProfile(payload);
    setSaving(false);
    if (result?.ok) {
      onSaveSuccess(payload);
      setSaveMessage(t("kid.user.saved"));
      setTimeout(() => {
        onClose();
        setSaveMessage("");
      }, 1500);
    } else {
      setSaveError(result?.message || t("kid.user.save_error"));
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

  const renderField = (key, label, type = "text", placeholder = "") => (
    <div key={key} className="mb-4">
      <label
        htmlFor={`profile-${key}`}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={`profile-${key}`}
        type={type}
        placeholder={placeholder}
        value={formData[key] || ""}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
      />
    </div>
  );

  const renderSelect = (key, label, options, placeholder) => (
    <div key={key} className="mb-4">
      <label
        htmlFor={`profile-${key}`}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={`profile-${key}`}
        value={formData[key] || ""}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        aria-invalid={pairHint ? "true" : undefined}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6] bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  const ageOptions = AGE_OPTIONS.map((n) => ({
    value: String(n),
    label: `${n} años`,
  }));
  const gradeOptions = GRADE_OPTIONS.map((n) => ({
    value: String(n),
    label: gradeLabel(n),
  }));
  // Aviso en vivo cuando ya hay edad y grado y no cuadran entre sí.
  const pairCheck =
    formData.age && formData.grade
      ? validateAgeGrade(formData.age, formData.grade)
      : null;
  const pairHint = pairCheck && !pairCheck.ok ? pairCheck.message : "";

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0,0,0,0.55)",
      }}
      onClick={onClose}
    >
      {/* Modal — stops click propagation so clicking inside doesn't close */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "24rem",
          maxHeight: "90dvh",
          overflowY: "auto",
          padding: "1.25rem",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {t("kid.user.edit_profile_title")}
          </h2>
          <button
            onClick={onClose}
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
          {renderSelect(
            "age",
            t("kid.user.age"),
            ageOptions,
            t("kid.user.age_placeholder"),
          )}

          {/* VAK Select */}
          <div className="mb-4">
            <label
              htmlFor="profile-vakStyle"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              {t("kid.user.vak_type")}
            </label>
            <select
              id="profile-vakStyle"
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
          {renderSelect(
            "grade",
            t("kid.user.grade"),
            gradeOptions,
            t("kid.user.grade_placeholder"),
          )}
          {pairHint && (
            <p role="alert" className="-mt-2 mb-4 text-sm text-amber-700">
              {pairHint}
            </p>
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
            onClick={onClose}
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
    </motion.div>,
    document.body,
  );
};

EditProfileModal.propTypes = {
  profile: PropTypes.object,
  studentName: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  updateProfile: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  removeAvatar: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaveSuccess: PropTypes.func.isRequired,
};

export default EditProfileModal;
