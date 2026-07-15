import { useTranslation } from "../../../../i18n/I18nProvider";
import { SVG_ICONS } from "../../vakIcons";
import { getMoodLabel } from "../../vakHelpers";
import * as styles from "../documentStyles";

const StudentInfoSection = ({
  diagnosis,
  studentName,
  studentAge,
  studentEmail,
  studentMood,
}) => {
  const { t } = useTranslation();

  return (
    <div style={styles.studentCard}>
      <h3 style={styles.cardTitle("#4DA8C4")}>
        <span dangerouslySetInnerHTML={{ __html: SVG_ICONS.user }} />
        {t("vak.ui.pdf_student_section")}
      </h3>
      <div style={styles.infoRow}>
        <span style={styles.infoLabel}>{t("vak.ui.pdf_name")}:</span>
        <span style={styles.infoValue}>{diagnosis.studentName}</span>
      </div>
      <div style={styles.infoRow}>
        <span style={styles.infoLabel}>{t("vak.ui.pdf_age")}:</span>
        <span style={styles.infoValuePlain}>
          {diagnosis.studentAge || studentAge || "N/A"} {t("vak.ui.years")}
        </span>
      </div>
      <div style={styles.infoRow}>
        <span style={styles.infoLabel}>Email:</span>
        <span style={styles.infoValuePlain}>
          {diagnosis.studentEmail || studentEmail || "\u2014"}
        </span>
      </div>
      <div style={styles.infoRowLast}>
        <span style={styles.infoLabel}>{t("vak.ui.pdf_mood")}:</span>
        <span style={styles.infoValuePlain}>
          {getMoodLabel(diagnosis.studentMood || studentMood, t)}
        </span>
      </div>
    </div>
  );
};

export default StudentInfoSection;
