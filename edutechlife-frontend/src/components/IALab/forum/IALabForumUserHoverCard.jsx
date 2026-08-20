import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import useForumProfile from '../../../hooks/IALab/forum/useForumProfile';

const IALabForumUserHoverCard = ({ userId, children }) => {
  const { showHoverProfile, hideHoverProfile, hoverProfile, isLoading, getLevel, getReputationBreakdown } = useForumProfile();
  const [visible, setVisible] = useState(false);
  const showTimer = useRef(null);
  const hideTimer = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => {
      setVisible(true);
      if (userId) showHoverProfile(userId);
    }, 300);
  }, [userId, showHoverProfile]);

  const handleMouseLeave = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      hideHoverProfile();
    }, 200);
  }, [hideHoverProfile]);

  const profile = hoverProfile;
  const level = profile ? getLevel(profile.reputation) : { level: 1, title: 'Novato', color: '#94A3B8' };
  const stats = profile ? getReputationBreakdown(profile) : [];

  return (
    <span className="relative inline-flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <AnimatePresence>
        {visible && profile && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/20"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-white">
                    {(profile.full_name || '?').split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{profile.full_name}</p>
                  <span className="text-[10px] font-medium" style={{ color: level.color }}>
                    <Icon name="fa-crown" className="mr-0.5 text-[8px]" />
                    {level.title}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                    <Icon name={s.icon} className="text-[var(--theme-emphasis)] text-[8px]" />
                    <span>{s.value} {s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

IALabForumUserHoverCard.propTypes = {
  userId: PropTypes.string,
  children: PropTypes.node,
};

export default IALabForumUserHoverCard;
