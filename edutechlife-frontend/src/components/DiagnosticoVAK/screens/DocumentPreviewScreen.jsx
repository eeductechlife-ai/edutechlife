import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { buildResultsURL } from "../vakHelpers";
import { SVG_ICONS } from "../vakIcons";
import * as styles from "./documentStyles";
import HeaderSection from "./documentSections/HeaderSection";
import StudentInfoSection from "./documentSections/StudentInfoSection";
import GuardianSection from "./documentSections/GuardianSection";
import ResultHeroSection from "./documentSections/ResultHeroSection";
import CharacteristicsSection from "./documentSections/CharacteristicsSection";
import CareersSection from "./documentSections/CareersSection";
import ParentTipsSection from "./documentSections/ParentTipsSection";
import ValentinaCommentarySection from "./documentSections/ValentinaCommentarySection";
import QRSection from "./documentSections/QRSection";
import FooterSection from "./documentSections/FooterSection";
import DocumentActions from "./documentActions";

const DocumentPreviewScreen = ({
  diagnosis,
  studentName,
  studentAge,
  studentEmail,
  studentMood,
  parentName,
  parentPhone,
  parentEmail,
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

  const qrUrl = buildResultsURL(diagnosis);
  const folio = `VAK-${(diagnosis.date || new Date().toISOString().split("T")[0]).replace(/\//g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const genDate = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const age = parseInt(diagnosis.studentAge || studentAge) || 12;

  const sColor =
    diagnosis.predominantStyle === "visual"
      ? "#4DA8C4"
      : diagnosis.predominantStyle === "auditivo"
        ? "#66CCCC"
        : "#E8A838";
  const sGradient =
    diagnosis.predominantStyle === "visual"
      ? "linear-gradient(135deg, #4DA8C4 0%, #2D8BA8 50%, #1A5A6E 100%)"
      : diagnosis.predominantStyle === "auditivo"
        ? "linear-gradient(135deg, #66CCCC 0%, #4DA8C4 50%, #2D8BA8 100%)"
        : "linear-gradient(135deg, #E8A838 0%, #D4912A 50%, #B87A1E 100%)";

  const styleIconBg =
    diagnosis.predominantStyle === "visual"
      ? "rgba(77,168,196,0.12)"
      : diagnosis.predominantStyle === "auditivo"
        ? "rgba(102,204,204,0.12)"
        : "rgba(232,168,56,0.12)";

  const secondPlace = Object.entries(diagnosis.counts || {})
    .filter(([k]) => k !== diagnosis.predominantStyle)
    .sort(([, a], [, b]) => b - a)[0];
  const secondName = secondPlace
    ? secondPlace[0] === "visual"
      ? "Visual"
      : secondPlace[0] === "auditivo"
        ? "Auditivo"
        : "Kinest\u00e9sico"
    : "";
  const secondScore = secondPlace ? secondPlace[1] : 0;

  const scoreItems = [
    {
      label: "VISUAL",
      score: diagnosis.counts?.visual || 0,
      color: "#4DA8C4",
      bg: "linear-gradient(180deg, rgba(77,168,196,0.08) 0%, rgba(77,168,196,0.02) 100%)",
      border: "rgba(77,168,196,0.2)",
      isDominant: diagnosis.predominantStyle === "visual",
    },
    {
      label: "AUDITIVO",
      score: diagnosis.counts?.auditivo || 0,
      color: "#66CCCC",
      bg: "linear-gradient(180deg, rgba(102,204,204,0.08) 0%, rgba(102,204,204,0.02) 100%)",
      border: "rgba(102,204,204,0.2)",
      isDominant: diagnosis.predominantStyle === "auditivo",
    },
    {
      label: "KINEST\u00c9SICO",
      score: diagnosis.counts?.kinestesico || 0,
      color: "#E8A838",
      bg: "linear-gradient(180deg, rgba(232,168,56,0.08) 0%, rgba(232,168,56,0.02) 100%)",
      border: "rgba(232,168,56,0.2)",
      isDominant: diagnosis.predominantStyle === "kinestesico",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="max-w-4xl mx-auto"
    >
      <div id="document-preview-content" style={styles.docContainer}>
        {/* ======== COVER PAGE ======== */}
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
          <div style={styles.coverFolio}>
            {"Documento Confidencial \u2014 Folio "}
            {folio}
          </div>
        </div>

        {/* ======== HEADER ======== */}
        <HeaderSection folio={folio} diagnosis={diagnosis} />

        <div style={styles.contentPadding}>
          {/* ======== SELLO DE AUTENTICIDAD ======== */}
          <div style={styles.sealOuter}>
            <div style={styles.sealInner}>
              <span style={styles.sealCertLabel}>Certificado</span>
              <span style={styles.sealVakLabel}>VAK</span>
            </div>
          </div>

          {/* ======== NOTA CONFIDENCIALIDAD ======== */}
          <div style={styles.noteBox}>
            <span dangerouslySetInnerHTML={{ __html: SVG_ICONS.lock }} />
            <span style={styles.noteText}>
              {"Este informe ha sido preparado exclusivamente para "}
              {parentName || diagnosis.parentName || "el acudiente"}
              {" y "}
              {diagnosis.studentName}
              {
                ". Prohibida su reproducci\u00f3n sin autorizaci\u00f3n de Edutechlife."
              }
            </span>
          </div>

          {/* ======== DATOS ESTUDIANTE Y ACUDIENTE ======== */}
          <div style={styles.infoGrid}>
            <StudentInfoSection
              diagnosis={diagnosis}
              studentName={studentName}
              studentAge={studentAge}
              studentEmail={studentEmail}
              studentMood={studentMood}
            />
            <GuardianSection
              diagnosis={diagnosis}
              parentName={parentName}
              parentPhone={parentPhone}
              parentEmail={parentEmail}
            />
          </div>

          {/* ======== SEPARADOR ======== */}
          <div style={styles.separator} />

          {/* ======== HERO RESULTADO PRINCIPAL ======== */}
          <ResultHeroSection
            diagnosis={diagnosis}
            getIconComponent={getIconComponent}
            sGradient={sGradient}
          />

          {/* ======== PUNTAJES CON BARRA DE PROGRESO ======== */}
          <div style={styles.scoreRow}>
            {scoreItems.map((item, i) => (
              <div
                key={i}
                style={styles.scoreCard(
                  item.bg,
                  item.isDominant ? item.color : item.border,
                )}
              >
                {item.isDominant && (
                  <div style={styles.scoreCorner(item.color)}>
                    <span style={styles.scoreCheckmark}>{"\u2713"}</span>
                  </div>
                )}
                <div style={styles.scoreLabel(item.color)}>{item.label}</div>
                <div style={styles.scoreValue(item.color)}>
                  {item.score}
                  <span style={styles.scoreMaxLabel}>/10</span>
                </div>
                <div style={styles.scoreTrack}>
                  <div
                    style={styles.scoreFill(
                      item.color,
                      (item.score / 10) * 100,
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ======== AN\u00c1LISIS PREMIUM ======== */}
          <div style={styles.analysisBox(sColor)}>
            <div style={styles.analysisQuoteMark(sColor)}>{"\u201C"}</div>
            <h4 style={styles.analysisTitle}>{t("vak.ui.pdf_analysis")}</h4>
            <p style={styles.analysisText}>
              {age <= 10 ? (
                <>
                  {diagnosis.predominantStyle === "visual" &&
                    `\u00a1Hola! Despu\u00e9s de analizar tus respuestas, descubrimos que aprendes mejor cuando PUEDES VER las cosas. Obtuviste ${diagnosis.counts?.visual || 0} de 10 en el canal Visual, \u00a1y ese es tu superpoder! Tambi\u00e9n tienes habilidades en ${secondName.toLowerCase()} (${secondScore}/10). Te recomendamos usar dibujos, colores y videos para aprender m\u00e1s f\u00e1cil.`}
                  {diagnosis.predominantStyle === "auditivo" &&
                    `\u00a1Qu\u00e9 emoci\u00f3n! Descubrimos que aprendes mejor cuando ESCUCHAS y HABLAS. Obtuviste ${diagnosis.counts?.auditivo || 0} de 10 en el canal Auditivo, \u00a1y ese es tu superpoder! Tambi\u00e9n tienes habilidades en ${secondName.toLowerCase()} (${secondScore}/10). Te recomendamos escuchar canciones, grabar tus clases y explicar en voz alta lo que aprendes.`}
                  {diagnosis.predominantStyle === "kinestesico" &&
                    `\u00a1Incre\u00edble! Descubrimos que aprendes mejor cuando te MUEVES y PRACTICAS. Obtuviste ${diagnosis.counts?.kinestesico || 0} de 10 en el canal Kinest\u00e9sico, \u00a1y ese es tu superpoder! Tambi\u00e9n tienes habilidades en ${secondName.toLowerCase()} (${secondScore}/10). Te recomendamos tomar notas a mano, hacer pausas activas y aprender haciendo proyectos.`}
                </>
              ) : (
                <>
                  {diagnosis.predominantStyle === "visual" &&
                    `El canal Visual obtuvo ${diagnosis.counts?.visual || 0} de 10 puntos, siendo el sistema de representaci\u00f3n dominante. El canal secundario es ${secondName} con ${secondScore}/10 puntos. Esto indica que ${diagnosis.studentName} procesa informaci\u00f3n de manera \u00f3ptima a trav\u00e9s de im\u00e1genes, gr\u00e1ficos y organizadores visuales, complementado por su canal secundario que enriquece su versatilidad cognitiva.`}
                  {diagnosis.predominantStyle === "auditivo" &&
                    `El canal Auditivo obtuvo ${diagnosis.counts?.auditivo || 0} de 10 puntos, siendo el sistema de representaci\u00f3n dominante. El canal secundario es ${secondName} con ${secondScore}/10 puntos. Esto indica que ${diagnosis.studentName} procesa informaci\u00f3n de manera \u00f3ptima a trav\u00e9s de la palabra hablada, explicaciones verbales y recursos sonoros, complementado por su canal secundario.`}
                  {diagnosis.predominantStyle === "kinestesico" &&
                    `El canal Kinest\u00e9sico obtuvo ${diagnosis.counts?.kinestesico || 0} de 10 puntos, siendo el sistema de representaci\u00f3n dominante. El canal secundario es ${secondName} con ${secondScore}/10 puntos. Esto indica que ${diagnosis.studentName} procesa informaci\u00f3n de manera \u00f3ptima a trav\u00e9s de la experiencia pr\u00e1ctica, el movimiento y la manipulaci\u00f3n de objetos, complementado por su canal secundario.`}
                </>
              )}
            </p>
            <p style={styles.analysisFooter}>
              {
                "Los puntajes secundarios complementan el perfil, sugiriendo que aunque existe una especializaci\u00f3n clara, "
              }
              {diagnosis.studentName}
              {
                " puede beneficiarse de estrategias multimodales para enriquecer su aprendizaje. Se recomienda priorizar las estrategias del estilo predominante sin descuidar los canales secundarios."
              }
            </p>
          </div>

          {/* ======== CONTENIDO A 2 COLUMNAS ======== */}
          <div style={styles.twoColGrid}>
            <div style={styles.leftCol}>
              <CharacteristicsSection
                diagnosis={diagnosis}
                sColor={sColor}
                styleIconBg={styleIconBg}
              />

              {/* ======== FORTALEZAS ======== */}
              <div style={styles.strengthsBox(styleIconBg, sColor)}>
                <h4 style={styles.strengthsTitle}>
                  {t("vak.ui.pdf_identified_strengths")}
                </h4>
                <div style={styles.strengthsText}>
                  {diagnosis.predominantStyle === "visual" && (
                    <>
                      {diagnosis.studentName}
                      {
                        " posee una capacidad natural para procesar informaci\u00f3n visual, destacando en: memoria fotogr\u00e1fica, organizaci\u00f3n espacial, atenci\u00f3n al detalle, s\u00edntesis gr\u00e1fica de conceptos, y aprendizaje mediante observaci\u00f3n. Estas fortalezas le permiten destacar en entornos que requieren an\u00e1lisis visual y pensamiento estructurado."
                      }
                    </>
                  )}
                  {diagnosis.predominantStyle === "auditivo" && (
                    <>
                      {diagnosis.studentName}
                      {
                        " posee una capacidad natural para procesar informaci\u00f3n auditiva, destacando en: memoria verbal, expresi\u00f3n oral estructurada, aprendizaje mediante di\u00e1logo, facilidad para idiomas, y retenci\u00f3n de secuencias sonoras. Estas fortalezas le permiten destacar en entornos colaborativos y de comunicaci\u00f3n verbal."
                      }
                    </>
                  )}
                  {diagnosis.predominantStyle === "kinestesico" && (
                    <>
                      {diagnosis.studentName}
                      {
                        " posee una capacidad natural para el aprendizaje experiencial, destacando en: coordinaci\u00f3n motora, aprendizaje mediante pr\u00e1ctica directa, resoluci\u00f3n activa de problemas, pensamiento concreto, y memoria procedimental. Estas fortalezas le permiten destacar en entornos que requieren aplicaci\u00f3n pr\u00e1ctica y experimentaci\u00f3n."
                      }
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.rightCol}>
              {/* ======== ESTRATEGIAS ======== */}
              <div style={styles.whiteCard}>
                <h4 style={styles.sectionTitle(sColor)}>
                  <span style={styles.sectionIcon(styleIconBg)}>
                    {"\u25C6"}
                  </span>
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

              <CareersSection
                diagnosis={diagnosis}
                styleIconBg={styleIconBg}
                sColor={sColor}
              />
            </div>
          </div>

          {/* ======== SEPARADOR ======== */}
          <div style={styles.separator2} />

          {/* ======== TIPS PARA PADRES ======== */}
          <ParentTipsSection diagnosis={diagnosis} />

          {/* ======== COMENTARIO DE VALERIA ======== */}
          <ValentinaCommentarySection
            diagnosis={diagnosis}
            studentName={studentName}
            studentAge={studentAge}
            sColor={sColor}
          />

          {/* ======== CONSEJO PERSONALIZADO ======== */}
          {diagnosis.styleDetails?.tip && (
            <div style={styles.adviceBox(styleIconBg, sColor)}>
              <h4 style={styles.adviceTitle}>
                {t("vak.ui.pdf_personalized_advice")}
              </h4>
              <p style={styles.adviceText}>{diagnosis.styleDetails?.tip}</p>
            </div>
          )}

          {/* ======== FOOTER ======== */}
          <div style={styles.footerWrapper}>
            <div style={styles.footerContent}>
              <QRSection qrUrl={qrUrl} />
              <FooterSection folio={folio} genDate={genDate} />
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
