import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";

const AXIS_LABEL_KEYS = {
  3: [
    "ialab.evaluation.results.axis_identify",
    "ialab.evaluation.results.axis_apply",
    "ialab.evaluation.results.axis_create",
  ],
  4: [
    "ialab.evaluation.results.axis_identify",
    "ialab.evaluation.results.axis_apply",
    "ialab.evaluation.results.axis_create",
    "ialab.evaluation.results.axis_synthesize",
  ],
};

const CompetenceRadar = ({ scores, size = 220 }) => {
  const { t } = useTranslation();
  const total = Math.max(3, (scores || []).length);
  const values = scores || [];
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 38;

  const angle = (i) => -Math.PI / 2 + (2 * Math.PI * i) / total;
  const pointAt = (i, value) => {
    const r = (Math.max(0, Math.min(100, value)) / 100) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };

  const grid = [25, 50, 75, 100].map((level) => {
    const pts = Array.from({ length: total }, (_, i) =>
      pointAt(i, level).join(","),
    ).join(" ");
    return (
      <polygon
        key={level}
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
      />
    );
  });

  const dataPoints = values
    .filter((v) => v !== null && v !== undefined)
    .map((v, i) => pointAt(i, v).join(","))
    .join(" ");

  const labels = Array.from({ length: total }, (_, i) => {
    const key =
      (AXIS_LABEL_KEYS[total] && AXIS_LABEL_KEYS[total][i]) ||
      "ialab.evaluation.results.axis_apply";
    const [lx, ly] = [
      cx + (radius + 20) * Math.cos(angle(i)),
      cy + (radius + 20) * Math.sin(angle(i)),
    ];
    return (
      <text
        key={i}
        x={lx}
        y={ly}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-slate-500 dark:fill-slate-300"
        style={{ fontSize: "10px", fontWeight: 600 }}
      >
        {t(key)}
      </text>
    );
  });

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${size} ${size}`}
      className="max-w-[220px] mx-auto text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)]"
      role="img"
      aria-label={t("ialab.evaluation.results.radar_label")}
    >
      {grid}
      {dataPoints && (
        <polygon
          points={dataPoints}
          fill="rgba(0,188,212,0.18)"
          stroke="#00BCD4"
          strokeWidth="2"
        />
      )}
      {labels}
    </svg>
  );
};

CompetenceRadar.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.number),
  size: PropTypes.number,
};

export default CompetenceRadar;
