import { useTranslation } from "../../../../i18n/I18nProvider";
import { SVG_ICONS } from "../../vakIcons";
import { getTipsPadres } from "../../vakStyles";
import * as styles from "../documentStyles";

const ParentTipsSection = ({ diagnosis }) => {
  const { t } = useTranslation();

  return (
    <div style={styles.tipsBox}>
      <h4 style={styles.tipsTitle}>
        <span
          style={styles.tipsIcon}
          dangerouslySetInnerHTML={{ __html: SVG_ICONS.lightbulb }}
        />
        {t("vak.ui.pdf_parent_tips")}
      </h4>
      <div style={styles.tipsContent}>
        {getTipsPadres(diagnosis.predominantStyle).map((tip, i) => (
          <div key={i} style={styles.tipItem}>
            <span style={styles.tipBullet}>{"\u2022"}</span>
            <span style={styles.tipText}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentTipsSection;
