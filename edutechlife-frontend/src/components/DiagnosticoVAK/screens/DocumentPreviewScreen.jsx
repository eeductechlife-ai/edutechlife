import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { SVG_ICONS } from "../vakIcons";
import { STYLE_INSIGHTS, getAnalysisText } from "../vakStyles";
import * as styles from "./documentStyles";
import HeaderSection from "./documentSections/HeaderSection";
import StudentInfoSection from "./documentSections/StudentInfoSection";
import GuardianSection from "./documentSections/GuardianSection";
import ResultHeroSection from "./documentSections/ResultHeroSection";
import CharacteristicsSection from "./documentSections/CharacteristicsSection";
import ParentTipsSection from "./documentSections/ParentTipsSection";
import ValentinaCommentarySection from "./documentSections/ValentinaCommentarySection";
import QRSection from "./documentSections/QRSection";
import FooterSection from "./documentSections/FooterSection";
import DocumentActions from "./documentActions";

const STYLE_THEME = {
  visual: {
    color: "#4DA8C4",
    gradient: "linear-gradient(135deg, #4DA8C4 0%, #2D8BA8 50%, #1A5A6E 100%)",
    soft: "rgba(77,168,196,0.12)",
  },
  auditivo: {
    color: "#66CCCC",
    gradient: "linear-gradient(135deg, #66CCCC 0%, #4DA8C4 50%, #2D8BA8 100%)",
    soft: "rgba(102,204,204,0.12)",
  },
  kinestesico: {
    color: "#E8A838",
    gradient: "linear-gradient(135deg, #E8A838 0%, #D4912A 50%, #B87A1E 100%)",
    soft: "rgba(232,168,56,0.12)",
  },
};

const DocumentPreviewScreen = ({
  diagnosis,
  studentName,
  studentAge,
  studentMood,
  parentName,
  generatePDF,
  pdfLoading,
  onBack,
  getIconComponent,
}) => {
  const { t } = useTranslation();

  if (!diagnosis) {
    return (
      <div className="p-10 text-center text-gray-500">
        {t("vak.ui.no_diagnosis_display")}
      </div>
    );
  }

  const genDate = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const age = parseInt(diagnosis.studentAge || studentAge) || 12;
  const guardian = (parentName || diagnosis.parentName || "").trim();

  const theme = STYLE_THEME[diagnosis.predominantStyle] || STYLE_THEME.visual;
  const sColor = theme.color;
  const sGradient = theme.gradient;
  const styleIconBg = theme.soft;
  const insight = STYLE_INSIGHTS[diagnosis.predominantStyle];

  const scores = diagnosis.scores || {};
  const scoreItems = ["visual", "auditivo", "kinestesico"].map((key) => ({
    label: STYLE_INSIGHTS[key].label.toUpperCase(),
    score: scores[key] || 0,
    color: STYLE_THEME[key].color,
    bg: `linear-gradient(180deg, ${STYLE_THEME[key].soft} 0%, rgba(255,255,255,0.02) 100%)`,
    border: STYLE_THEME[key].soft,
    isDominant: diagnosis.predominantStyle === key,
  }));

  const analysis = getAnalysisText(diagnosis, age);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto"
    >
      <div id="document-preview-content" style={styles.docContainer}>
        {/* ======== PORTADA ======== */}
        <div style={styles.coverWrapper}>
          <div style={styles.coverCircleTopRight} />
          <div style={styles.coverCircleBottomLeft} />
          <img
            src="/images/logo-edutechlife.webp"
            alt="Edutechlife"
            style={styles.coverLogo}
          />
          <div style={styles.companyBadge}>{t("vak.ui.pdf_company")}</div>
          <h1 style={styles.coverTitle}>{t("vak.ui.pdf_title")}</h1>
          <div style={styles.coverDivider} />
          <p style={styles.coverStudentName}>{diagnosis.studentName}</p>
          <p style={styles.coverDateText}>{genDate}</p>
          <div style={styles.coverFolio}>{t("vak.ui.pdf_cover_note")}</div>
        </div>

        <HeaderSection diagnosis={diagnosis} />

        <div style={styles.contentPadding}>
          {/* ======== NOTA ======== */}
          <div style={styles.noteBox}>
            <span dangerouslySetInnerHTML={{ __html: SVG_ICONS.lock }} />
            <span style={styles.noteText}>
              {guardian
                ? t("vak.ui.pdf_prepared_for_both", {
                    parent: guardian,
                    student: diagnosis.studentName,
                  })
                : t("vak.ui.pdf_prepared_for_student", {
                    student: diagnosis.studentName,
                  })}
            </span>
          </div>

          {/* ======== QUÉ MIDE Y QUÉ NO ======== */}
          <div style={styles.adviceBox(styleIconBg, sColor)}>
            <h4 style={styles.adviceTitle}>
              {t("vak.ui.pdf_disclaimer_title")}
            </h4>
            <p style={styles.adviceText}>{t("vak.ui.pdf_disclaimer_text")}</p>
          </div>

          {/* ======== DATOS ======== */}
          <div style={styles.infoGrid}>
            <StudentInfoSection
              diagnosis={diagnosis}
              studentName={studentName}
              studentAge={studentAge}
              studentMood={studentMood}
            />
            {guardian && (
              <GuardianSection diagnosis={diagnosis} parentName={guardian} />
            )}
          </div>

          <div style={styles.separator} />

          {/* ======== MEZCLA PRINCIPAL ======== */}
          <ResultHeroSection
            diagnosis={diagnosis}
            getIconComponent={getIconComponent}
            sGradient={sGradient}
          />

          <div style={styles.scoreRow}>
            {scoreItems.map((item) => (
              <div
                key={item.label}
                style={styles.scoreCard(
                  item.bg,
                  item.isDominant ? item.color : item.border,
                )}
              >
                {item.isDominant && (
                  <div style={styles.scoreCorner(item.color)}>
                    <span style={styles.scoreCheckmark}>{"✓"}</span>
                  </div>
                )}
                <div style={styles.scoreLabel(item.color)}>{item.label}</div>
                <div style={styles.scoreValue(item.color)}>
                  {item.score}
                  <span style={styles.scoreMaxLabel}>%</span>
                </div>
                <div style={styles.scoreTrack}>
                  <div style={styles.scoreFill(item.color, item.score)} />
                </div>
              </div>
            ))}
          </div>

          {/* ======== LECTURA ======== */}
          <div style={styles.analysisBox(sColor)}>
            <div style={styles.analysisQuoteMark(sColor)}>{"“"}</div>
            <h4 style={styles.analysisTitle}>{t("vak.ui.pdf_analysis")}</h4>
            <p style={styles.analysisText}>{analysis.main}</p>
            <p style={styles.analysisFooter}>{analysis.footer}</p>
          </div>

          {/* ======== DOS COLUMNAS ======== */}
          <div style={styles.twoColGrid}>
            <div style={styles.leftCol}>
              <CharacteristicsSection
                diagnosis={diagnosis}
                sColor={sColor}
                styleIconBg={styleIconBg}
              />

              {insight && (
                <div style={styles.strengthsBox(styleIconBg, sColor)}>
                  <h4 style={styles.strengthsTitle}>
                    {t("vak.ui.result_superpower")}
                  </h4>
                  <div style={styles.strengthsText}>{insight.superpower}</div>
                  <h4 style={{ ...styles.strengthsTitle, marginTop: 12 }}>
                    {t("vak.ui.result_challenge")}
                  </h4>
                  <div style={styles.strengthsText}>{insight.challenge}</div>
                </div>
              )}
            </div>

            <div style={styles.rightCol}>
              <div style={styles.whiteCard}>
                <h4 style={styles.sectionTitle(sColor)}>
                  <span style={styles.sectionIcon(styleIconBg)}>{"◆"}</span>
                  {t("vak.ui.pdf_study_strategies")}
                </h4>
                <ol style={styles.stratList}>
                  {(diagnosis.styleDetails?.strategies || []).map((s, i) => (
                    <li key={i} style={styles.stratItem}>
                      <span style={styles.stratHighlight(sColor)}>
                        {s.split(" ")[0]}
                      </span>
                      {s.slice(s.split(" ")[0].length)}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div style={styles.separator2} />

          <ParentTipsSection diagnosis={diagnosis} />

          <ValentinaCommentarySection
            diagnosis={diagnosis}
            studentName={studentName}
            studentAge={studentAge}
            sColor={sColor}
          />

          {diagnosis.styleDetails?.tip && (
            <div style={styles.adviceBox(styleIconBg, sColor)}>
              <h4 style={styles.adviceTitle}>
                {t("vak.ui.pdf_personalized_advice")}
              </h4>
              <p style={styles.adviceText}>{diagnosis.styleDetails?.tip}</p>
            </div>
          )}

          <div style={styles.footerWrapper}>
            <div style={styles.footerContent}>
              <QRSection />
              <FooterSection genDate={genDate} />
            </div>
          </div>
        </div>
      </div>

      <DocumentActions
        generatePDF={generatePDF}
        pdfLoading={pdfLoading}
        onBack={onBack}
      />
    </motion.div>
  );
};

export default DocumentPreviewScreen;
