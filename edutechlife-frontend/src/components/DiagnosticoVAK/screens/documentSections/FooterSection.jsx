import { useTranslation } from "../../../../i18n/I18nProvider";
import * as styles from "../documentStyles";

const FooterSection = ({ genDate }) => {
  const { t } = useTranslation();

  return (
    <div style={styles.footerInfo}>
      <p style={styles.footerGeneratedBy}>{t("vak.ui.pdf_generated_by")}</p>
      <p style={styles.footerSite}>www.edutechlife.co</p>
      <div style={styles.footerMeta}>
        <span style={styles.footerDate}>{genDate}</span>
      </div>
      <p style={styles.footerLegal}>{t("vak.ui.pdf_legal")}</p>
    </div>
  );
};

export default FooterSection;
