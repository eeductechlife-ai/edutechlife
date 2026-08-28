import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Loader2, Check, X, Camera, Trash2 } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";
import { VAK_OPTIONS, getInitials } from "./userMenuConstants";

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
    age: profile?.age || "",
    vakStyle: profile?.vakStyle || "",
    school: profile?.school || "",
    grade: profile?.grade || "",
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
    </>
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
