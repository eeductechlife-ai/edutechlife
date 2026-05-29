import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const IALabForumFilterBar = ({ category, onCategoryChange }) => {
  const { t } = useTranslation();
  const categories = [
    { id: 'all', label: t('ialab.forum.filter_bar.all'), icon: 'fa-comments' },
    { id: 'question', label: t('ialab.forum.filter_bar.questions'), icon: 'fa-question-circle' },
    { id: 'discussion', label: t('ialab.forum.filter_bar.discussions'), icon: 'fa-comment-dots' },
    { id: 'resource', label: t('ialab.forum.filter_bar.resources'), icon: 'fa-book' },
    { id: 'announcement', label: t('ialab.forum.filter_bar.announcements'), icon: 'fa-bullhorn' },
    { id: 'feedback', label: t('ialab.forum.filter_bar.feedback'), icon: 'fa-lightbulb' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin-ialab">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange?.(cat.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 whitespace-nowrap sm:whitespace-nowrap whitespace-normal sm:px-3 sm:py-1.5 px-2 py-2 border ${
            category === cat.id
              ? 'bg-gradient-to-r from-petroleum to-corporate text-white border-petroleum/30 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:border-petroleum/30 hover:text-petroleum'
          }`}
        >
          <Icon name={cat.icon} className="text-[10px]" />
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default IALabForumFilterBar;
