import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { cn } from "../../forum/forumDesignSystem";
import { RESOURCE_TYPE_CONFIG } from "../constants/moduleResources";

const TopicResourcesTypeBadges = ({ resources }) => {
  if (resources.length === 0) return null;

  const typeCounts = {};
  resources.forEach((r) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="px-6 py-3 border-b border-petroleum/25 flex flex-wrap items-center gap-2">
      {sortedTypes.map(([type, count]) => {
        const cfg = RESOURCE_TYPE_CONFIG[type] || {
          label: type,
          color: "#64748B",
          bg: "bg-slate-100",
        };
        return (
          <span
            key={type}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              cfg.bg,
            )}
            style={{ color: cfg.color }}
          >
            <Icon name={cfg.icon || "fa-file"} className="w-3 h-3" />
            {cfg.label}
            <span className="font-bold">{count}</span>
          </span>
        );
      })}
    </div>
  );
};

TopicResourcesTypeBadges.propTypes = {
  resources: PropTypes.array,
};

export default TopicResourcesTypeBadges;
