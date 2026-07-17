import React, { memo } from 'react';
import { motion } from 'framer-motion';
import MissionCard from '@/components/MissionCard';
import GlassCard from '@/components/GlassCard';
import { GraduationCap, Play, BookOpen, Trophy, TrendingUp, Mic, MessageCircle, Brain, LogOut, Download, FileText, Users, Clock, Target, Award, Sparkles } from 'lucide-react';
import { sanitize } from '@/utils/sanitize';
import { useTranslation } from '@/i18n/I18nProvider';

const HomeView = memo(({
  studentName,
  missions,
  subjects,
  userLevel,
  onNavigate,
  onMissionStart,
  onMissionComplete,
  onGenerateReport
}) => {
  const { t } = useTranslation();
  return (
  <div className="space-y-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white font-montserrat mb-1" dangerouslySetInnerHTML={{ __html: sanitize(t('smartboard.bienvenido', { name: studentName })) }} />
          <p className="text-white/80 text-sm font-open-sans" dangerouslySetInnerHTML={{ __html: sanitize(t('smartboard.today_missions', { count: missions.filter(m => !m.completed && !m.locked).length, subjects: subjects.filter(s => s.progress > 0 && s.progress < 100).length })) }} />
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="text-right mr-3">
            <p className="text-3xl font-bold text-white font-montserrat">{userLevel}</p>
            <p className="text-xs text-white/70 font-open-sans">{t('smartboard.level_label')}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </motion.div>

    <GlassCard animate delay={0.1}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#66CCCC]"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm text-[#64748B] font-open-sans">{t('smartboard.valeria_ready')}</span>
        </div>
        <div className="flex gap-2">
    <motion.button
      onClick={() => onNavigate('lab-ia')}
      className="px-4 py-2 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-lg text-sm font-semibold hover:bg-[#4DA8C4]/20 transition-all"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={t('smartboard.chat_valeria')}
    >
      <MessageCircle className="w-4 h-4 inline mr-1" />{t('smartboard.chat_valeria')}
    </motion.button>
    <motion.button
      onClick={() => onNavigate('vak')}
      className="px-4 py-2 bg-[#66CCCC]/10 text-[#004B63] rounded-lg text-sm font-semibold hover:bg-[#66CCCC]/20 transition-all"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={t('smartboard.diagnostico_vak')}
    >
      <Brain className="w-4 h-4 inline mr-1" />{t('smartboard.diagnostico_vak')}
    </motion.button>
        </div>
      </div>
    </GlassCard>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: Target, label: t('smartboard.missions_label'), count: missions.filter(m => !m.completed).length, gradient: 'from-[#4DA8C4] to-[#66CCCC]', onClick: () => onNavigate('misiones') },
        { icon: BookOpen, label: t('smartboard.your_subjects'), count: subjects.length, gradient: 'from-[#66CCCC] to-[#004B63]', onClick: () => onNavigate('materias') },
        { icon: Download, label: t('smartboard.download_report'), count: 'PDF', gradient: 'from-[#FFD166] to-[#FF8E53]', onClick: onGenerateReport },
        { icon: Brain, label: 'IA Lab', count: 'Pro', gradient: 'from-[#FF6B9D] to-[#FF8E53]', onClick: () => onNavigate('ialab') },
      ].map((action, index) => (
        <motion.button
          key={action.label}
          onClick={action.onClick}
          className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all text-center group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          whileHover={{ y: -4, scale: 1.02 }}
          aria-label={`${action.label}${typeof action.count === 'number' ? `: ${action.count} pendientes` : ''}`}
        >
          <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <p className="font-semibold text-[#004B63]">{action.label}</p>
          <p className="text-xs text-[#64748B]">{action.count} {typeof action.count === 'number' ? t('smartboard.pending') : ''}</p>
        </motion.button>
      ))}
    </div>

    <GlassCard animate delay={0.3}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#004B63] font-montserrat">{t('smartboard.missions_day')}</h3>
        <button 
          onClick={() => onNavigate('misiones')}
          className="text-sm text-[#4DA8C4] font-semibold hover:underline"
          aria-label={t('smartboard.view_all')}
        >
          {t('smartboard.view_all')} →
        </button>
      </div>
      <div className="space-y-4">
        {missions.slice(0, 3).map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onStart={onMissionStart}
            onComplete={onMissionComplete}
          />
        ))}
      </div>
    </GlassCard>
  </div>
  );
});

HomeView.displayName = 'HomeView';

export default HomeView;
