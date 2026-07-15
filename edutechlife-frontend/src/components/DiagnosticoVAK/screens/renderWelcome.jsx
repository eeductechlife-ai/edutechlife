import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Headphones,
  Activity,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Download,
  Zap,
  Clock,
  List,
  Check,
  Rocket,
  Volume,
} from "lucide-react";

export default function renderWelcome({
  t,
  valentinaIntroComplete,
  startTest,
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#66CCCC]/10 to-[#4DA8C4]/5 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#B2D8E5]/50 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
              <Target size={24} strokeWidth={2} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#004B63]">
              {t("vak.ui.what_is_vak")}
            </h2>
          </div>
          <p className="text-[#004B63]/80 leading-relaxed text-base">
            {t("vak.ui.vak_intro")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-[#004B63] mb-4 text-center">
            {t("vak.ui.three_styles_title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#4DA8C4] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mb-4 mx-auto">
                <Eye size={32} strokeWidth={1.5} className="text-[#4DA8C4]" />
              </div>
              <h3 className="text-lg font-bold text-[#4DA8C4] text-center mb-3 uppercase tracking-wide">
                {t("vak.ui.visual")}
              </h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                {t("vak.ui.visual_short_desc")}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_images_videos")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_mind_maps")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_diagrams")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_colors_schemas")}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#66CCCC] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#66CCCC]/10 flex items-center justify-center mb-4 mx-auto">
                <Headphones
                  size={32}
                  strokeWidth={1.5}
                  className="text-[#66CCCC]"
                />
              </div>
              <h3 className="text-lg font-bold text-[#66CCCC] text-center mb-3 uppercase tracking-wide">
                {t("vak.ui.auditory")}
              </h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                {t("vak.ui.auditory_short_desc")}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#66CCCC] shrink-0"
                  />
                  <span>{t("vak.ui.feature_podcasts_audio")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#66CCCC] shrink-0"
                  />
                  <span>{t("vak.ui.feature_debates_discussions")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#66CCCC] shrink-0"
                  />
                  <span>{t("vak.ui.feature_explain_aloud")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#66CCCC] shrink-0"
                  />
                  <span>{t("vak.ui.feature_music_rhythms")}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#4DA8C4] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mb-4 mx-auto">
                <Activity
                  size={32}
                  strokeWidth={1.5}
                  className="text-[#4DA8C4]"
                />
              </div>
              <h3 className="text-lg font-bold text-[#4DA8C4] text-center mb-3 uppercase tracking-wide">
                {t("vak.ui.kinesthetic")}
              </h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                {t("vak.ui.kinesthetic_short_desc")}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_hands_on")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_movement_breaks")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_projects")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_role_play")}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-3xl p-6 md:p-8 shadow-xl mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {t("vak.ui.what_you_get_title")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">
                {t("vak.ui.personalized_diagnosis")}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Lightbulb size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">
                {t("vak.ui.adapted_strategies")}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Download size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">
                {t("vak.ui.pdf_report")}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Zap size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">
                {t("vak.ui.practical_tips")}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-[#B2D8E5]/50 mb-6"
        >
          <h2 className="text-xl font-bold text-[#004B63] mb-6 text-center">
            {t("vak.ui.what_to_expect_title")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <Clock size={28} strokeWidth={2} className="text-[#4DA8C4]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">10 min</p>
              <p className="text-xs text-[#004B63]/60">
                {t("vak.ui.duration")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#66CCCC]/10 flex items-center justify-center mx-auto mb-2">
                <List size={28} strokeWidth={2} className="text-[#66CCCC]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">10</p>
              <p className="text-xs text-[#004B63]/60">
                {t("vak.ui.questions_count")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <Target size={28} strokeWidth={2} className="text-[#4DA8C4]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">100%</p>
              <p className="text-xs text-[#004B63]/60">
                {t("vak.ui.personalized_label")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2
                  size={28}
                  strokeWidth={2}
                  className="text-[#4DA8C4]"
                />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">100%</p>
              <p className="text-xs text-[#004B63]/60">
                {t("vak.ui.confidential_label")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              {t("vak.ui.no_wrong_answers")}
            </span>
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              {t("vak.ui.answer_honestly")}
            </span>
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              {t("vak.ui.valeria_will_guide")}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={valentinaIntroComplete ? { scale: 1.02 } : {}}
            whileTap={valentinaIntroComplete ? { scale: 0.98 } : {}}
            onClick={startTest}
            disabled={!valentinaIntroComplete}
            className={`w-full rounded-2xl py-5 px-8 shadow-xl transition-all duration-300 ${
              valentinaIntroComplete
                ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:shadow-2xl"
                : "bg-[#B2D8E5] cursor-not-allowed"
            }`}
          >
            <span className="text-lg font-bold text-white flex items-center justify-center gap-3">
              {valentinaIntroComplete ? (
                <>
                  <Rocket size={24} strokeWidth={2} />
                  {t("vak.ui.start_diagnosis_btn")}
                </>
              ) : (
                <>
                  <Volume size={24} strokeWidth={2} className="animate-pulse" />
                  {t("vak.ui.waiting_for_valeria")}
                </>
              )}
            </span>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-[#004B63]/50 mt-6"
        >
          {t("vak.ui.developed_by")}{" "}
          <span className="font-semibold text-[#4DA8C4]">EdutechLife</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
