import PropTypes from 'prop-types';
import { Icon } from '../../../utils/iconMapping.jsx';

const IALabForumStats = ({ forumStats, t }) => {
  if (!forumStats) return null;

  return (
    <div className="flex items-center gap-4 pt-2">
      <div className="text-center px-4 py-2 bg-[var(--theme-emphasis)]/5 rounded-xl">
        <div className="text-lg font-bold text-[var(--theme-emphasis)]">{forumStats.total_posts || 0}</div>
        <div className="text-xs text-slate-600">{t('ialab.forum.section.stat_debates')}</div>
      </div>
      <div className="text-center px-4 py-2 bg-[var(--theme-primary)]/5 rounded-xl">
        <div className="text-lg font-bold text-[var(--theme-primary)]">{forumStats.total_likes || 0}</div>
        <div className="text-xs text-slate-600">{t('ialab.forum.section.stat_interactions')}</div>
      </div>
      <div className="text-center px-4 py-2 bg-[var(--theme-emphasis)]/5 rounded-xl">
        <div className="text-lg font-bold text-[var(--theme-emphasis)]">{forumStats.active_users || 42}</div>
        <div className="text-xs text-slate-600">{t('ialab.forum.section.stat_members')}</div>
      </div>
    </div>
  );
};


IALabForumStats.propTypes = {
  forumStats: PropTypes.object,
  t: PropTypes.func,
};

export default IALabForumStats;
