import { useTranslation } from "../../../../i18n/I18nProvider";
import { SVG_ICONS } from "../../vakIcons";
import * as styles from "../documentStyles";

const GuardianSection = ({ parentName }) => {
  const { t } = useTranslation();

  return (
    <div style={styles.guardianCard}>
      <h3 style={styles.cardTitle("#66CCCC")}>
        <span dangerouslySetInnerHTML={{ __html: SVG_ICONS.users }} />
        {t("vak.ui.pdf_guardian_section")}
      </h3>
      <div style={styles.infoRowLast}>
        <span style={styles.infoLabel}>{t("vak.ui.pdf_name")}:</span>
        <span style={styles.infoValue}>{parentName}</span>
      </div>
    </div>
  );
};

export default GuardianSection;
