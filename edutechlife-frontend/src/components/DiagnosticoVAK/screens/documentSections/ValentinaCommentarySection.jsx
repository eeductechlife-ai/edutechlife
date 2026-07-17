import { useTranslation } from "../../../../i18n/I18nProvider";
import { getValentinaCommentary } from "../../vakStyles";
import * as styles from "../documentStyles";

const ValentinaCommentarySection = ({
  diagnosis,
  studentName,
  studentAge,
  sColor,
}) => {
  const { t } = useTranslation();

  return (
    <div style={styles.commentBox(sColor)}>
      <div style={styles.commentHeader}>
        <div style={styles.commentAvatar}>
          <img
            src="/valeria.webp"
            alt="Valeria"
            style={styles.commentAvatarImg(sColor)}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div style={styles.commentAvatarFallback(sColor)}>
            <span style={styles.commentAvatarText}>VR</span>
          </div>
        </div>
        <div style={styles.commentInfo}>
          <h4 style={styles.commentName}>{t("vak.ui.pdf_valeria_name")}</h4>
          <p style={styles.commentRole}>
            {"Psic\u00f3loga Educativa \u2014 Especialista VAK"}
          </p>
        </div>
      </div>
      <div style={styles.commentText}>
        {getValentinaCommentary(diagnosis, studentName, studentAge)}
      </div>
    </div>
  );
};

export default ValentinaCommentarySection;
