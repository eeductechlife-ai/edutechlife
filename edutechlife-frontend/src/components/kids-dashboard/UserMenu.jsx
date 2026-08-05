import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { User, Edit3, ChevronDown, Loader2, Check, X } from "lucide-react";
import { useStudentProfileSmartBoard } from "../../hooks/useStudentProfileSmartBoard";

const UserMenu = ({ authToken, studentName }) => {
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
      setSaveMessage("Guardado correctamente");
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
          aria-label="Abrir menú de perfil"
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
                  {studentName || "Estudiante"}
                </p>
                <p className="text-xs text-white/80">Perfil de SmartBoard</p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-4 text-center">
                  <Loader2 className="w-5 h-5 animate-spin inline text-[#0077B6]" />
                  <p className="text-sm text-gray-600 mt-2">
                    Cargando perfil...
                  </p>
                </div>
              )}

              {/* Profile Data */}
              {!loading && profile && (
                <div className="p-4 space-y-3 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">EDAD</p>
                    <p className="text-sm text-gray-800">
                      {profile.age ? `${profile.age} años` : "No especificada"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      TIPO DE APRENDIZAJE (VAK)
                    </p>
                    <p className="text-sm text-gray-800 capitalize">
                      {profile.vakStyle || "No detectado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      COLEGIO
                    </p>
                    <p className="text-sm text-gray-800">
                      {profile.school || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">GRADO</p>
                    <p className="text-sm text-gray-800">
                      {profile.grade || "No especificado"}
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !profile && !error && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No hay datos de perfil disponibles
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-4 text-center text-red-600 text-sm">
                  Error al cargar el perfil
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
                    Editar perfil
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
                  Editar Perfil
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
                {renderField("age", "Edad", "number", "ej: 12")}
                {renderField(
                  "vakStyle",
                  "Tipo de Aprendizaje (VAK)",
                  "text",
                  "ej: visual, auditivo, kinestésico",
                )}
                {renderField("school", "Colegio", "text", "ej: Colegio Mayor")}
                {renderField("grade", "Grado", "text", "ej: 6B")}
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
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#005fa3] transition-colors disabled:opacity-50 font-semibold"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Guardando..." : "Guardar"}
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
