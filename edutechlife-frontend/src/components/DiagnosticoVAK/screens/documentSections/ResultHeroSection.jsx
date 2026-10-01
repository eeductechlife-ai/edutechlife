import { useTranslation } from "../../../../i18n/I18nProvider";
import { STYLE_INSIGHTS } from "../../vakStyles";
import * as styles from "../documentStyles";

const ResultHeroSection = ({ diagnosis, getIconComponent, sGradient }) => {
  const { t } = useTranslation();
  const StyleIcon = getIconComponent(diagnosis.styleDetails?.icon || "Eye");
  const second = diagnosis.secondaryStyle
    ? STYLE_INSIGHTS[diagnosis.secondaryStyle]
    : null;
  const title = second
    ? `${STYLE_INSIGHTS[diagnosis.predominantStyle]?.label} + ${second.label}`
    : diagnosis.styleDetails?.name;

  return (
    <div style={styles.heroWrapper(sGradient)}>
      <div style={styles.heroIconBox}>
        <StyleIcon size={26} strokeWidth={2} color="white" />
      </div>
      <p style={styles.heroLabel}>{t("vak.ui.pdf_learning_profile")}</p>
      <h2 style={styles.heroTitle}>{title}</h2>
      <div style={styles.heroPercentage}>{diagnosis.percentage}%</div>
      <div style={styles.heroProgressTrack}>
        <div
          style={{
            ...styles.heroProgressFill,
            width: `${Math.min(diagnosis.percentage || 0, 100)}%`,
          }}
        />
      </div>
      <p style={styles.heroDescription}>
        {diagnosis.styleDetails?.description}
      </p>
    </div>
  );
};

export default ResultHeroSection;
