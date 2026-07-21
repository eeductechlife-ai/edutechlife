import { motion } from "framer-motion";
import { Sparkles, User, Phone, Mail } from "lucide-react";
import { validateEmail } from "../vakHelpers";

export default function renderParentData({
  t,
  parentName,
  setParentName,
  parentPhone,
  setParentPhone,
  parentEmail,
  setParentEmail,
  emailError,
  setEmailError,
  onSubmit,
}) {
  const isValid =
    parentName.trim() &&
    parentPhone.trim() &&
    parentEmail.trim() &&
    validateEmail(parentEmail);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#66CCCC]/10 to-[#4DA8C4]/5 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center shadow-lg mb-4">
            <Sparkles size={32} strokeWidth={2} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#004B63] mb-2">
            {t("vak.ui.almost_done")}
          </h1>
          <p className="text-sm text-[#004B63]/70 leading-relaxed">
            {t("vak.ui.parent_data_instruction")}
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
              <User
                size={14}
                strokeWidth={2}
                className="inline mr-1 text-[#4DA8C4]"
              />
              {t("vak.ui.parent_name_label")}
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder={t("vak.ui.parent_name_placeholder")}
              className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
              <Phone
                size={14}
                strokeWidth={2}
                className="inline mr-1 text-[#4DA8C4]"
              />
              {t("vak.ui.contact_phone_label")}
            </label>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder={t("vak.ui.phone_placeholder")}
              className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
              <Mail
                size={14}
                strokeWidth={2}
                className="inline mr-1 text-[#4DA8C4]"
              />
              {t("vak.ui.email_label")}
            </label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => {
                setParentEmail(e.target.value);
                setEmailError(
                  e.target.value.length > 0 && !validateEmail(e.target.value),
                );
              }}
              placeholder={t("vak.ui.email_placeholder")}
              className={`w-full rounded-2xl border-2 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 transition-all shadow-md ${
                emailError
                  ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                  : "border-[#B2D8E5]/50 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4]"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span>
                <span>
                  {t("vak.ui.invalid_email")}
                </span>
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <motion.button
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            onClick={onSubmit}
            disabled={!isValid}
            className={`w-full rounded-2xl py-4 px-6 shadow-xl transition-all font-bold text-lg ${
              isValid
                ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white hover:shadow-2xl"
                : "bg-[#B2D8E5] text-[#004B63]/50 cursor-not-allowed"
            }`}
          >
            {t("vak.ui.view_results_btn")}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
