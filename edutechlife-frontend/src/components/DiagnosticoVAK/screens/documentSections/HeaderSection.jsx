import { useTranslation } from "../../../../i18n/I18nProvider";
import * as styles from "../documentStyles";

const HeaderSection = ({ folio, diagnosis }) => {
  const { t } = useTranslation();

  return (
    <div style={styles.headerWrapper}>
      <div style={styles.headerInner}>
        <div style={styles.headerLogoArea}>
          <img
            src="/images/logo-edutechlife.webp"
            alt="Edutechlife"
            style={styles.headerLogo}
          />
          <div style={styles.headerDivider}>
            <p style={styles.headerTitle}>{t("vak.ui.pdf_title")}</p>
            <p style={styles.headerSubtitle}>{t("vak.ui.pdf_company")}</p>
          </div>
        </div>
        <div style={styles.headerFolioArea}>
          <p style={styles.headerFolioLabel}>Folio</p>
          <p style={styles.headerFolioValue}>{folio}</p>
          <p style={styles.headerDateText}>
            {diagnosis.date || new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
