import { useTranslation } from "../../../../i18n/I18nProvider";
import { SVG_ICONS } from "../../vakIcons";
import * as styles from "../documentStyles";

const GuardianSection = ({
  diagnosis,
  parentName,
  parentPhone,
  parentEmail,
}) => {
  const { t } = useTranslation();

  return (
    <div style={styles.guardianCard}>
      <h3 style={styles.cardTitle("#66CCCC")}>
        <span dangerouslySetInnerHTML={{ __html: SVG_ICONS.users }} />
        {t("vak.ui.pdf_guardian_section")}
      </h3>
      <div style={styles.infoRow}>
        <span style={styles.infoLabel}>{t("vak.ui.pdf_name")}:</span>
        <span style={styles.infoValue}>
          {parentName || diagnosis.parentName || "N/A"}
        </span>
      </div>
      <div style={styles.infoRow}>
        <span style={styles.infoLabel}>{t("vak.ui.contact_phone_label")}:</span>
        <span style={styles.infoValuePlain}>
          {parentPhone || diagnosis.parentPhone || "N/A"}
        </span>
      </div>
      <div style={styles.infoRowLast}>
        <span style={styles.infoLabel}>{t("vak.ui.email_label")}:</span>
        <span style={styles.infoValuePlain}>
          {parentEmail || diagnosis.parentEmail || "N/A"}
        </span>
      </div>
    </div>
  );
};

export default GuardianSection;
