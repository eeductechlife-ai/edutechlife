import PropTypes from 'prop-types';
import { Icon } from '../../../utils/iconMapping.jsx';

const FILTERS = [
  { key: 'all', icon: 'fa-layer-group', tKey: 'ialab.forum.section.filter_all' },
  { key: 'mine', icon: 'fa-user', tKey: 'ialab.forum.section.filter_mine' },
  { key: 'unanswered', icon: 'fa-question-circle', tKey: 'ialab.forum.section.filter_unanswered' },
  { key: 'popular', icon: 'fa-fire', tKey: 'ialab.forum.section.filter_popular' },
];

const IALabForumTagFilter = ({ activeFilter, setActiveFilter, t }) => {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {FILTERS.map(({ key, icon, tKey }) => {
        const isActive = activeFilter === key;
        const isCorporate = key === 'unanswered';
        const color = isCorporate ? 'corporate' : 'petroleum';

        return (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              isActive
                ? `bg-${color} text-white shadow-sm`
                : `bg-white text-${color} border border-slate-200 hover:bg-slate-50`
            }`}
          >
            <Icon name={icon} className="mr-2" />
            {t(tKey)}
          </button>
        );
      })}
    </div>
  );
};


IALabForumTagFilter.propTypes = {
  activeFilter: PropTypes.any,
  setActiveFilter: PropTypes.any,
  t: PropTypes.any,
};

export default IALabForumTagFilter;
