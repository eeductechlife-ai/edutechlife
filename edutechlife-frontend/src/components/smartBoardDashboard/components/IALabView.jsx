import React, { memo } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { useTranslation } from '@/i18n/I18nProvider';

const IALabView = memo(({ onNavigate }) => {
  const { t } = useTranslation();
  return (
  <div className="space-y-6">
    <GlassCard animate>
      <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-4">{t('smartboard.ialab_title')}</h3>
      <p className="text-[#64748B] mb-6">
        {t('smartboard.ialab_desc')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '🤖', title: t('smartboard.chat_valeria_title'), desc: t('smartboard.chat_valeria_desc'), gradient: 'from-[#4DA8C4]/10 to-[#004B63]/5', action: () => onNavigate('lab-ia') },
          { icon: '🧠', title: t('smartboard.vak_title'), desc: t('smartboard.vak_desc'), gradient: 'from-[#66CCCC]/10 to-[#4DA8C4]/5', action: () => onNavigate('vak') },
          { icon: '🏆', title: t('smartboard.ialab_pro_title'), desc: t('smartboard.ialab_pro_desc'), gradient: 'from-[#FFD166]/10 to-[#FF8E53]/5', action: () => onNavigate('ialab') },
        ].map((item, index) => (
          <motion.button
            key={item.title}
            onClick={item.action}
            className={`bg-gradient-to-br ${item.gradient} p-6 rounded-2xl border border-[#E2E8F0] text-left hover:scale-[1.02] transition-all hover:shadow-lg hover:border-[#4DA8C4]/30`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl">{item.icon}</span>
            </div>
            <h4 className="font-bold text-[#004B63] font-montserrat mb-2">{item.title}</h4>
            <p className="text-sm text-[#64748B]">{item.desc}</p>
          </motion.button>
        ))}
      </div>
    </GlassCard>
  </div>
  );
});

IALabView.displayName = 'IALabView';

export default IALabView;
