import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { INGENIA_QR_URL } from "../../vakHelpers";
import * as styles from "../documentStyles";

// El QR se dibuja en el navegador y apunta a IngenIA: no lleva datos del estudiante.
const QRSection = () => {
  const { t } = useTranslation();
  const [src, setSrc] = useState("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(INGENIA_QR_URL, { width: 150, margin: 1 })
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!src) return null;

  return (
    <div style={styles.qrBox}>
      <a
        href={INGENIA_QR_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={t("vak.ui.pdf_open_results")}
      >
        <img src={src} alt={t("vak.ui.pdf_qr_alt")} style={styles.qrImage} />
      </a>
      <span style={styles.qrLabel}>{t("vak.ui.pdf_qr_label")}</span>
    </div>
  );
};

export default QRSection;
