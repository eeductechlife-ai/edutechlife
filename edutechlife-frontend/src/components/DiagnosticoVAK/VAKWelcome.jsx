import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Eye, Headphones, Activity, CheckCircle2,
  Sparkles, Lightbulb, Download, Zap,
  Clock, List, Check, Volume2, VolumeX, Rocket
} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';
import { tutorAvatars, DEFAULT_AVATAR } from '../../data/tutorAvatars';

const styles = [
  {
    key: 'visual',
    icon: Eye,
    color: '#4DA8C4',
    border: 'border-[#4DA8C4]',
    bg: 'bg-[#4DA8C4]/10',
    features: [
      'feature_images_videos',
      'feature_mind_maps',
      'feature_diagrams',
      'feature_colors_schemas'
    ]
  },
  {
    key: 'auditory',
    icon: Headphones,
    color: '#66CCCC',
    border: 'border-[#66CCCC]',
    bg: 'bg-[#66CCCC]/10',
    features: [
      'feature_podcasts_audio',
      'feature_debates_discussions',
      'feature_explain_aloud',
      'feature_music_rhythms'
    ]
  },
  {
    key: 'kinesthetic',
    icon: Activity,
    color: '#4DA8C4',
    border: 'border-[#4DA8C4]',
    bg: 'bg-[#4DA8C4]/10',
    features: [
      'feature_hands_on',
      'feature_movement_breaks',
      'feature_projects',
      'feature_role_play'
    ]
  }
];

const benefits = [
  { icon: Sparkles, key: 'personalized_diagnosis' },
  { icon: Lightbulb, key: 'adapted_strategies' },
  { icon: Download, key: 'pdf_report' },
  { icon: Zap, key: 'practical_tips' }
];

const stats = [
  { value: '3 min', key: 'duration' },
  { value: '16', key: 'questions_count' },
  { value: '100%', key: 'personalized_label' },
  { value: '100%', key: 'confidential_label' }
];

const badges = [
  'no_wrong_answers',
  'answer_honestly',
  'valeria_will_guide'
];

export default function VAKWelcome({ onStart, valeriaEnabled, onToggleValeria, valeria }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (valeriaEnabled && valeria?.startWelcomeSequence) {
      valeria.startWelcomeSequence();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src={tutorAvatars.Valeria || DEFAULT_AVATAR}
            alt="Valeria"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#4DA8C4]/30"
          />
          {valeria?.isValentinaSpeaking && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-[#004B63] mb-8">
        {t('vak.ui.welcome_title')}
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => onToggleValeria(!valeriaEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            valeriaEnabled
              ? 'bg-[#4DA8C4] text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {valeriaEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          {valeriaEnabled ? t('vak.ui.valeria_on') : t('vak.ui.valeria_off')}
        </button>
      </div>

      {/* SECCIÓN: ¿QUÉ ES? */}
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
          <h2 className="text-xl font-bold text-[#004B63]">{t('vak.ui.what_is_vak')}</h2>
        </div>
        <p className="text-[#004B63]/80 leading-relaxed text-base">
          {t('vak.ui.vak_intro')}
        </p>
      </motion.div>

      {/* SECCIÓN: LOS 3 ESTILOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold text-[#004B63] mb-4 text-center">{t('vak.ui.three_styles_title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {styles.map((style) => {
            const Icon = style.icon;
            return (
              <div
                key={style.key}
                className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${style.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 rounded-2xl ${style.bg} flex items-center justify-center mb-4 mx-auto`}>
                  <Icon size={32} strokeWidth={1.5} style={{ color: style.color }} />
                </div>
                <h3
                  className="text-lg font-bold text-center mb-3 uppercase tracking-wide"
                  style={{ color: style.color }}
                >
                  {t(`vak.ui.${style.key}`)}
                </h3>
                <p className="text-sm text-[#004B63]/70 text-center mb-4">
                  {t(`vak.ui.${style.key}_short_desc`)}
                </p>
                <div className="space-y-2">
                  {style.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-sm text-[#004B63]/80">
                      <CheckCircle2 size={16} strokeWidth={2} style={{ color: style.color }} className="shrink-0" />
                      <span>{t(`vak.ui.${feat}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* SECCIÓN: ¿QUÉ RECIBIRÁS? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-3xl p-6 md:p-8 shadow-xl mb-6"
      >
        <h2 className="text-xl font-bold text-white mb-6 text-center">{t('vak.ui.what_you_get_title')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((ben) => {
            const Icon = ben.icon;
            return (
              <div key={ben.key} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={24} strokeWidth={2} className="text-white" />
                </div>
                <p className="text-white font-semibold text-sm">{t(`vak.ui.${ben.key}`)}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* SECCIÓN: ¿QUÉ ESPERAR? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-[#B2D8E5]/50 mb-6"
      >
        <h2 className="text-xl font-bold text-[#004B63] mb-6 text-center">{t('vak.ui.what_to_expect_title')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <p className="text-2xl font-bold text-[#004B63]">{stat.value}</p>
              <p className="text-xs text-[#004B63]/60">{t(`vak.ui.${stat.key}`)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full"
            >
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              {t(`vak.ui.${badge}`)}
            </span>
          ))}
        </div>
      </motion.div>

      {/* BOTÓN COMENZAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <button
          onClick={onStart}
          className="group px-8 py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
        >
          <span className="flex items-center gap-3">
            <Rocket size={24} strokeWidth={2} />
            {t('vak.ui.start_diagnosis_btn')}
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
