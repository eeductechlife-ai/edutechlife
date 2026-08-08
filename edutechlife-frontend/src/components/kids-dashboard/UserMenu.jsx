import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { User, Edit3, ChevronDown, Loader2, Check, X } from "lucide-react";
import { useStudentProfileSmartBoard } from "../../hooks/useStudentProfileSmartBoard";
import { useTranslation } from "../../i18n/I18nProvider";

const UserMenu = ({ authToken, studentName }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const { profile, loading, error, updateProfile } =
    useStudentProfileSmartBoard(authToken);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Inicializar form con datos del perfil cuando se abre modal
  const openEditModal = () => {
    setFormData({
      age: profile?.age || "",
      vakStyle: profile?.vakStyle || "",
      school: profile?.school || "",
      grade: profile?.grade || "",
    });
    setIsEditingModal(true);
    setIsOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    const success = await updateProfile(formData);
    setSaving(false);
    if (success) {
      setSaveMessage(t("kid.user.saved"));
      setTimeout(() => {
        setIsEditingModal(false);
        setSaveMessage("");
      }, 1500);
    }
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
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white">
            <User className="w-4 h-4" />
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
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] p-4 text-white">
                <p className="font-bold text-base">
                  {studentName || t("kid.user.student")}
                </p>
                <p className="text-xs text-white/80">
                  {t("kid.user.smartboard_profile")}
                </p>
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
                <div className="p-4 space-y-3 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      {t("kid.user.age")}
                    </p>
                    <p className="text-sm text-gray-800">
                      {profile.age
                        ? t("kid.user.age_value", { age: profile.age })
                        : t("kid.user.not_specified_age")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      {t("kid.user.vak_type")}
                    </p>
                    <p className="text-sm text-gray-800 capitalize">
                      {profile.vakStyle || t("kid.user.not_detected")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      {t("kid.user.school")}
                    </p>
                    <p className="text-sm text-gray-800">
                      {profile.school || t("kid.user.not_specified")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      {t("kid.user.grade")}
                    </p>
                    <p className="text-sm text-gray-800">
                      {profile.grade || t("kid.user.not_specified")}
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !profile && !error && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {t("kid.user.no_profile_data")}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-4 text-center text-red-600 text-sm">
                  {t("kid.user.load_error")}
                </div>
              )}

              {/* Edit Button */}
              {!loading && (
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={openEditModal}
                    className="w-full flex items-center justify-center gap-2 bg-[#0077B6] hover:bg-[#005fa3] text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    {t("kid.user.edit_profile")}
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
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 max-w-sm w-11/12 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {t("kid.user.edit_profile_title")}
                </h2>
                <button
                  onClick={() => setIsEditingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="mb-6">
                {renderField(
                  "age",
                  t("kid.user.age"),
                  "number",
                  t("kid.user.age_placeholder"),
                )}
                {renderField(
                  "vakStyle",
                  t("kid.user.vak_type"),
                  "text",
                  t("kid.user.vak_placeholder"),
                )}
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

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditingModal(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-semibold"
                >
                  {t("kid.user.cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
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
};

export default UserMenu;
