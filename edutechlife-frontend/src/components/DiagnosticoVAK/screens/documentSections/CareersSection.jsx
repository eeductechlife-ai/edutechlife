import { useTranslation } from "../../../../i18n/I18nProvider";
import { getCarrerasRecomendadas } from "../../vakStyles";
import * as styles from "../documentStyles";

const CareersSection = ({ diagnosis, styleIconBg, sColor }) => {
  const { t } = useTranslation();

  return (
    <div style={styles.whiteCard}>
      <h4 style={styles.careerTitle}>
        <span style={styles.careerIcon}>{"\u25B8"}</span>
        {t("vak.ui.pdf_recommended_careers")}
      </h4>
      <div style={styles.careerTagContainer}>
        {getCarrerasRecomendadas(diagnosis.predominantStyle)
          .slice(0, 6)
          .map((c, i) => (
            <span key={i} style={styles.careerTag(styleIconBg, `${sColor}20`)}>
              {c}
            </span>
          ))}
      </div>
    </div>
  );
};

export default CareersSection;
