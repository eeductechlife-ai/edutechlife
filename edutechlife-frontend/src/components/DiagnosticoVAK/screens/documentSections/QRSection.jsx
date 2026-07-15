import { useTranslation } from "../../../../i18n/I18nProvider";
import * as styles from "../documentStyles";

const QRSection = ({ qrUrl }) => {
  const { t } = useTranslation();

  if (!qrUrl) return null;

  return (
    <div style={styles.qrBox}>
      <a
        href={qrUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={t("vak.ui.pdf_open_results")}
      >
        <img
          src={qrUrl}
          alt={t("vak.ui.pdf_qr_alt")}
          style={styles.qrImage}
          crossOrigin="anonymous"
        />
      </a>
      <span style={styles.qrLabel}>
        {"Escanea para ver resultados en l\u00ednea"}
      </span>
    </div>
  );
};

export default QRSection;
