import { useTranslation } from "../../../../i18n/I18nProvider";
import { getCaracteristicasEstilo } from "../../vakStyles";
import * as styles from "../documentStyles";

const CharacteristicsSection = ({ diagnosis, sColor, styleIconBg }) => {
  const { t } = useTranslation();

  return (
    <div style={styles.whiteCard}>
      <h4 style={styles.sectionTitle(sColor)}>
        <span style={styles.sectionIcon(styleIconBg)}>{"\u2726"}</span>
        {t("vak.ui.pdf_style_features")}
      </h4>
      <div style={styles.charList}>
        {getCaracteristicasEstilo(diagnosis.predominantStyle)
          .slice(0, 5)
          .map((c, i) => (
            <div key={i} style={styles.charItem}>
              <span style={styles.charBullet(sColor)}>{"\u2022"}</span>
              <span style={styles.charText}>{c}</span>
            </div>
          ))}
        <div style={styles.charMore(sColor)}>
          + {getCaracteristicasEstilo(diagnosis.predominantStyle).length - 5}{" "}
          {"caracter\u00edsticas m\u00e1s..."}
        </div>
      </div>
    </div>
  );
};

export default CharacteristicsSection;
