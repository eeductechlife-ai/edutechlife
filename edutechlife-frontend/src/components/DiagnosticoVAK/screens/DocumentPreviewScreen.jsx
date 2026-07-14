import { motion } from "framer-motion";
import { ArrowRight, Download, Rocket } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { buildResultsURL, getMoodLabel } from "../vakHelpers";
import {
  getCaracteristicasEstilo,
  getTipsPadres,
  getCarrerasRecomendadas,
  getValentinaCommentary,
} from "../vakStyles";
import { SVG_ICONS } from "../vakIcons";

// Vista previa del documento/informe PDF del Diagnóstico VAK.
// Extraída de DiagnosticoVAK.jsx sin cambios de comportamiento: el nodo
// #document-preview-content es el que consume generatePDF (html2pdf).
// Props explícitas:
// - diagnosis: resultado completo del diagnóstico (obligatorio para renderizar).
// - studentName/studentAge/studentEmail/studentMood: estado del estudiante (fallbacks).
// - parentName/parentPhone/parentEmail: datos del acudiente (fallbacks).
// - generatePDF: handler de descarga del PDF; pdfLoading: estado de carga.
// - onBack: vuelve a la pantalla de resultados.
// - getIconComponent: resuelve el icono lucide del estilo predominante.
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

  const StyleIcon = getIconComponent(diagnosis.styleDetails?.icon || "Eye");
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
        : "Kinestésico"
    : "";
  const secondScore = secondPlace ? secondPlace[1] : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="max-w-4xl mx-auto"
    >
      <div
        id="document-preview-content"
        style={{
          backgroundColor: "#ffffff",
          padding: "0",
          fontFamily: "Montserrat, system-ui, sans-serif",
          color: "#334155",
          lineHeight: "1.5",
          fontSize: "13px",
        }}
      >
        {/* ======== COVER PAGE ======== */}
        <div
          style={{
            background: "linear-gradient(135deg, #004B63 0%, #1A5A6E 100%)",
            padding: "60px 40px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(77,168,196,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(102,204,204,0.06)",
              pointerEvents: "none",
            }}
          />
          <img
            src="/images/logo-edutechlife.webp"
            alt="Edutechlife"
            style={{ height: "52px", width: "auto", marginBottom: "24px" }}
          />
          <div
            style={{
              display: "inline-block",
              padding: "4px 16px",
              border: "1.5px solid rgba(255,255,255,0.25)",
              borderRadius: "20px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            {t("vak.ui.pdf_company")}
          </div>
          <h1
            style={{
              color: "#ffffff",
              margin: "0 0 8px 0",
              fontSize: "28px",
              fontWeight: "900",
              letterSpacing: "0.5px",
            }}
          >
            {t("vak.ui.pdf_title")}
          </h1>
          <div
            style={{
              width: "60px",
              height: "3px",
              background: "#4DA8C4",
              margin: "16px auto",
              borderRadius: "2px",
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "13px",
              margin: "0 0 4px 0",
            }}
          >
            {diagnosis.studentName}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "10px",
              margin: "24px 0 0 0",
            }}
          >
            {genDate}
          </p>
          <div
            style={{
              marginTop: "32px",
              padding: "12px 20px",
              display: "inline-block",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.4)",
              fontSize: "9px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Documento Confidencial — Folio {folio}
          </div>
        </div>

        {/* ======== HEADER ======== */}
        <div
          style={{
            background: "linear-gradient(135deg, #004B63 0%, #1A5A6E 100%)",
            padding: "18px 28px",
            borderBottom: "3px solid #4DA8C4",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src="/images/logo-edutechlife.webp"
                alt="Edutechlife"
                style={{ height: "28px", width: "auto" }}
              />
              <div
                style={{
                  borderLeft: "1.5px solid rgba(255,255,255,0.2)",
                  paddingLeft: "12px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.3px",
                  }}
                >
                  {t("vak.ui.pdf_title")}
                </p>
                <p
                  style={{
                    margin: "1px 0 0 0",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "10px",
                    fontWeight: "400",
                  }}
                >
                  {t("vak.ui.pdf_company")}
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Folio
              </p>
              <p
                style={{
                  margin: "1px 0 2px 0",
                  color: "#4DA8C4",
                  fontSize: "10px",
                  fontWeight: "700",
                  fontFamily: "monospace",
                }}
              >
                {folio}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "9px",
                }}
              >
                {diagnosis.date || new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 28px", position: "relative" }}>
          {/* ======== SELLO DE AUTENTICIDAD (watermark) ======== */}
          <div
            style={{
              position: "absolute",
              top: "180px",
              right: "40px",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "2.5px solid rgba(77,168,196,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "76px",
                height: "76px",
                borderRadius: "50%",
                border: "1.5px solid rgba(77,168,196,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#4DA8C4",
                  fontSize: "6px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Certificado
              </span>
              <span
                style={{
                  color: "#004B63",
                  fontSize: "5px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  marginTop: "1px",
                  textTransform: "uppercase",
                }}
              >
                VAK
              </span>
            </div>
          </div>

          {/* ======== NOTA CONFIDENCIALIDAD ======== */}
          <div
            style={{
              padding: "10px 14px",
              background: "#F8FAFC",
              borderRadius: "8px",
              border: "1px solid #E8EDF2",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: SVG_ICONS.lock }} />
            <span
              style={{ color: "#94A3B8", fontSize: "9px", lineHeight: "1.4" }}
            >
              Este informe ha sido preparado exclusivamente para{" "}
              {parentName || diagnosis.parentName || "el acudiente"} y{" "}
              {diagnosis.studentName}. Prohibida su reproducción sin
              autorización de Edutechlife.
            </span>
          </div>

          {/* ======== DATOS ESTUDIANTE Y ACUDIENTE ======== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                padding: "14px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,75,99,0.06)",
                border: "1px solid #E8F0F3",
              }}
            >
              <h3
                style={{
                  color: "#004B63",
                  margin: "0 0 10px 0",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "2px solid #4DA8C4",
                  paddingBottom: "7px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: SVG_ICONS.user }} />
                {t("vak.ui.pdf_student_section")}
              </h3>
              <div
                style={{
                  fontSize: "11px",
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748B" }}>
                  {t("vak.ui.pdf_name")}:
                </span>
                <span style={{ color: "#004B63", fontWeight: "600" }}>
                  {diagnosis.studentName}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748B" }}>{t("vak.ui.pdf_age")}:</span>
                <span style={{ color: "#004B63" }}>
                  {diagnosis.studentAge || studentAge || "N/A"}{" "}
                  {t("vak.ui.years")}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748B" }}>Email:</span>
                <span style={{ color: "#004B63" }}>
                  {diagnosis.studentEmail || studentEmail || "—"}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748B" }}>
                  {t("vak.ui.pdf_mood")}:
                </span>
                <span style={{ color: "#004B63" }}>
                  {getMoodLabel(diagnosis.studentMood || studentMood, t)}
                </span>
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #F8FCFF, #F0FDFF)",
                padding: "14px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(77,168,196,0.07)",
                border: "1px solid #D6EEF5",
              }}
            >
              <h3
                style={{
                  color: "#004B63",
                  margin: "0 0 10px 0",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "2px solid #66CCCC",
                  paddingBottom: "7px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: SVG_ICONS.users }} />
                {t("vak.ui.pdf_guardian_section")}
              </h3>
              <div
                style={{
                  fontSize: "11px",
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748B" }}>
                  {t("vak.ui.pdf_name")}:
                </span>
                <span style={{ color: "#004B63", fontWeight: "600" }}>
                  {parentName || diagnosis.parentName || "N/A"}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748B" }}>
                  {t("vak.ui.contact_phone_label")}:
                </span>
                <span style={{ color: "#004B63" }}>
                  {parentPhone || diagnosis.parentPhone || "N/A"}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748B" }}>
                  {t("vak.ui.email_label")}:
                </span>
                <span style={{ color: "#004B63" }}>
                  {parentEmail || diagnosis.parentEmail || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* ======== SEPARADOR ======== */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, transparent, #4DA8C4, transparent)",
              margin: "0 0 20px 0",
              opacity: 0.3,
            }}
          />

          {/* ======== HERO RESULTADO PRINCIPAL ======== */}
          <div
            style={{
              position: "relative",
              margin: "0 0 20px 0",
              padding: "28px 24px",
              background: sGradient,
              borderRadius: "16px",
              textAlign: "center",
              color: "white",
              boxShadow: "0 8px 40px rgba(77,168,196,0.2)",
            }}
          >
            {/* Sello de autenticidad en hero */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                opacity: 0.8,
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "6px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  lineHeight: "1.2",
                }}
              >
                Oficial
              </span>
              <div
                style={{
                  width: "16px",
                  height: "1.5px",
                  background: "rgba(255,255,255,0.4)",
                  margin: "2px 0",
                }}
              />
              <span
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "5px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Verificado
              </span>
            </div>

            <div
              style={{
                width: "52px",
                height: "52px",
                margin: "0 auto 10px",
                background: "rgba(255,255,255,0.18)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              <StyleIcon size={26} strokeWidth={2} color="white" />
            </div>
            <p
              style={{
                margin: "0 0 4px 0",
                color: "rgba(255,255,255,0.8)",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: "600",
              }}
            >
              {t("vak.ui.pdf_learning_profile")}
            </p>
            <h2
              style={{
                margin: "0 0 2px 0",
                fontSize: "24px",
                fontWeight: "800",
                letterSpacing: "0.5px",
              }}
            >
              {diagnosis.styleDetails?.name}
            </h2>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "900",
                margin: "6px 0",
                textShadow: "0 4px 20px rgba(0,0,0,0.12)",
                lineHeight: "1",
              }}
            >
              {diagnosis.percentage}%
            </div>
            <div
              style={{
                width: `${Math.min(diagnosis.percentage || 0, 100)}%`,
                maxWidth: "260px",
                height: "5px",
                margin: "6px auto 10px",
                background: "rgba(255,255,255,0.3)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  background: "rgba(255,255,255,0.65)",
                  borderRadius: "3px",
                }}
              />
            </div>
            <p
              style={{
                margin: 0,
                opacity: 0.9,
                fontSize: "12px",
                lineHeight: "1.5",
                maxWidth: "440px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {diagnosis.styleDetails?.description}
            </p>
          </div>

          {/* ======== PUNTAJES CON BARRA DE PROGRESO ======== */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {[
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
                label: "KINESTÉSICO",
                score: diagnosis.counts?.kinestesico || 0,
                color: "#E8A838",
                bg: "linear-gradient(180deg, rgba(232,168,56,0.08) 0%, rgba(232,168,56,0.02) 100%)",
                border: "rgba(232,168,56,0.2)",
                isDominant: diagnosis.predominantStyle === "kinestesico",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "12px 10px",
                  background: item.bg,
                  borderRadius: "12px",
                  border: `1.5px solid ${item.isDominant ? item.color : item.border}`,
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {item.isDominant && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "0",
                      height: "0",
                      borderStyle: "solid",
                      borderWidth: "0 20px 20px 0",
                      borderColor: `transparent ${item.color} transparent transparent`,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "3px",
                        right: "-16px",
                        color: "white",
                        fontSize: "7px",
                        fontWeight: "700",
                      }}
                    >
                      ✓
                    </span>
                  </div>
                )}
                <div
                  style={{
                    fontSize: "9px",
                    color: item.color,
                    fontWeight: "700",
                    marginBottom: "5px",
                    letterSpacing: "1.5px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "800",
                    color: item.color,
                    lineHeight: "1",
                  }}
                >
                  {item.score}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94A3B8",
                      fontWeight: "400",
                    }}
                  >
                    /10
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "7px",
                    height: "3px",
                    background: "#E8EDF0",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(item.score / 10) * 100}%`,
                      background: item.color,
                      borderRadius: "2px",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ======== ANÁLISIS PREMIUM ======== */}
          <div
            style={{
              padding: "18px 18px 18px 22px",
              background: "linear-gradient(135deg, #F8FAFC, #F0FDFF)",
              borderRadius: "12px",
              borderLeft: `4px solid ${sColor}`,
              marginBottom: "20px",
              position: "relative",
              boxShadow: "0 2px 12px rgba(77,168,196,0.06)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "4px",
                left: "10px",
                fontSize: "36px",
                color: sColor,
                opacity: 0.15,
                fontFamily: "Georgia, serif",
                lineHeight: "1",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {"\u201C"}
            </div>
            <h4
              style={{
                color: "#004B63",
                margin: "0 0 6px 0",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {t("vak.ui.pdf_analysis")}
            </h4>
            <p
              style={{
                margin: 0,
                color: "#334155",
                fontSize: "11px",
                lineHeight: "1.7",
                fontStyle: "italic",
              }}
            >
              {age <= 10 ? (
                <>
                  {diagnosis.predominantStyle === "visual" &&
                    `¡Hola! Después de analizar tus respuestas, descubrimos que aprendes mejor cuando PUEDES VER las cosas. Obtuviste ${diagnosis.counts?.visual || 0} de 10 en el canal Visual, ¡y ese es tu superpoder! También tienes habilidades en ${secondName.toLowerCase()} (${secondScore}/10). Te recomendamos usar dibujos, colores y videos para aprender más fácil.`}
                  {diagnosis.predominantStyle === "auditivo" &&
                    `¡Qué emoción! Descubrimos que aprendes mejor cuando ESCUCHAS y HABLAS. Obtuviste ${diagnosis.counts?.auditivo || 0} de 10 en el canal Auditivo, ¡y ese es tu superpoder! También tienes habilidades en ${secondName.toLowerCase()} (${secondScore}/10). Te recomendamos escuchar canciones, grabar tus clases y explicar en voz alta lo que aprendes.`}
                  {diagnosis.predominantStyle === "kinestesico" &&
                    `¡Increíble! Descubrimos que aprendes mejor cuando te MUEVES y PRACTICAS. Obtuviste ${diagnosis.counts?.kinestesico || 0} de 10 en el canal Kinestésico, ¡y ese es tu superpoder! También tienes habilidades en ${secondName.toLowerCase()} (${secondScore}/10). Te recomendamos tomar notas a mano, hacer pausas activas y aprender haciendo proyectos.`}
                </>
              ) : (
                <>
                  {diagnosis.predominantStyle === "visual" &&
                    `El canal Visual obtuvo ${diagnosis.counts?.visual || 0} de 10 puntos, siendo el sistema de representación dominante. El canal secundario es ${secondName} con ${secondScore}/10 puntos. Esto indica que ${diagnosis.studentName} procesa información de manera óptima a través de imágenes, gráficos y organizadores visuales, complementado por su canal secundario que enriquece su versatilidad cognitiva.`}
                  {diagnosis.predominantStyle === "auditivo" &&
                    `El canal Auditivo obtuvo ${diagnosis.counts?.auditivo || 0} de 10 puntos, siendo el sistema de representación dominante. El canal secundario es ${secondName} con ${secondScore}/10 puntos. Esto indica que ${diagnosis.studentName} procesa información de manera óptima a través de la palabra hablada, explicaciones verbales y recursos sonoros, complementado por su canal secundario.`}
                  {diagnosis.predominantStyle === "kinestesico" &&
                    `El canal Kinestésico obtuvo ${diagnosis.counts?.kinestesico || 0} de 10 puntos, siendo el sistema de representación dominante. El canal secundario es ${secondName} con ${secondScore}/10 puntos. Esto indica que ${diagnosis.studentName} procesa información de manera óptima a través de la experiencia práctica, el movimiento y la manipulación de objetos, complementado por su canal secundario.`}
                </>
              )}
            </p>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#64748B",
                fontSize: "10px",
                lineHeight: "1.5",
                borderTop: "1px solid #E2E8F0",
                paddingTop: "8px",
              }}
            >
              Los puntajes secundarios complementan el perfil, sugiriendo que
              aunque existe una especialización clara, {diagnosis.studentName}{" "}
              puede beneficiarse de estrategias multimodales para enriquecer su
              aprendizaje. Se recomienda priorizar las estrategias del estilo
              predominante sin descuidar los canales secundarios.
            </p>
          </div>

          {/* ======== CONTENIDO A 2 COLUMNAS ======== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: "0 4px 20px rgba(0,75,99,0.05)",
                  border: "1px solid #E8F0F3",
                }}
              >
                <h4
                  style={{
                    color: "#004B63",
                    margin: "0 0 8px 0",
                    fontSize: "11px",
                    fontWeight: "700",
                    borderBottom: `2px solid ${sColor}`,
                    paddingBottom: "7px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      width: "18px",
                      height: "18px",
                      background: styleIconBg,
                      borderRadius: "5px",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                    }}
                  >
                    ✦
                  </span>
                  {t("vak.ui.pdf_style_features")}
                </h4>
                <div style={{ fontSize: "10px" }}>
                  {getCaracteristicasEstilo(diagnosis.predominantStyle)
                    .slice(0, 5)
                    .map((c, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            color: sColor,
                            fontWeight: "bold",
                            fontSize: "12px",
                            lineHeight: "1.4",
                            flexShrink: 0,
                          }}
                        >
                          •
                        </span>
                        <span style={{ color: "#475569" }}>{c}</span>
                      </div>
                    ))}
                  <div
                    style={{
                      marginTop: "6px",
                      color: sColor,
                      fontSize: "9px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    +{" "}
                    {getCaracteristicasEstilo(diagnosis.predominantStyle)
                      .length - 5}{" "}
                    características más...
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  background: `linear-gradient(135deg, ${styleIconBg}, transparent)`,
                  borderRadius: "12px",
                  borderLeft: `3px solid ${sColor}`,
                  boxShadow: "0 2px 12px rgba(77,168,196,0.05)",
                }}
              >
                <h4
                  style={{
                    color: "#004B63",
                    margin: "0 0 6px 0",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {t("vak.ui.pdf_identified_strengths")}
                </h4>
                <div
                  style={{
                    fontSize: "10px",
                    lineHeight: "1.5",
                    color: "#475569",
                  }}
                >
                  {diagnosis.predominantStyle === "visual" && (
                    <>
                      {diagnosis.studentName} posee una capacidad natural para
                      procesar información visual, destacando en: memoria
                      fotográfica, organización espacial, atención al detalle,
                      síntesis gráfica de conceptos, y aprendizaje mediante
                      observación. Estas fortalezas le permiten destacar en
                      entornos que requieren análisis visual y pensamiento
                      estructurado.
                    </>
                  )}
                  {diagnosis.predominantStyle === "auditivo" && (
                    <>
                      {diagnosis.studentName} posee una capacidad natural para
                      procesar información auditiva, destacando en: memoria
                      verbal, expresión oral estructurada, aprendizaje mediante
                      diálogo, facilidad para idiomas, y retención de secuencias
                      sonoras. Estas fortalezas le permiten destacar en entornos
                      colaborativos y de comunicación verbal.
                    </>
                  )}
                  {diagnosis.predominantStyle === "kinestesico" && (
                    <>
                      {diagnosis.studentName} posee una capacidad natural para
                      el aprendizaje experiencial, destacando en: coordinación
                      motora, aprendizaje mediante práctica directa, resolución
                      activa de problemas, pensamiento concreto, y memoria
                      procedimental. Estas fortalezas le permiten destacar en
                      entornos que requieren aplicación práctica y
                      experimentación.
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: "0 4px 20px rgba(0,75,99,0.05)",
                  border: "1px solid #E8F0F3",
                }}
              >
                <h4
                  style={{
                    color: "#004B63",
                    margin: "0 0 8px 0",
                    fontSize: "11px",
                    fontWeight: "700",
                    borderBottom: `2px solid ${sColor}`,
                    paddingBottom: "7px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      width: "18px",
                      height: "18px",
                      background: styleIconBg,
                      borderRadius: "5px",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                    }}
                  >
                    ◆
                  </span>
                  {t("vak.ui.pdf_study_strategies")}
                </h4>
                <ol
                  style={{
                    paddingLeft: "16px",
                    margin: 0,
                    fontSize: "10px",
                    lineHeight: "1.6",
                    color: "#475569",
                  }}
                >
                  {(diagnosis.styleDetails?.strategies || []).map((s, i) => (
                    <li
                      key={i}
                      style={{ marginBottom: "4px", color: "#475569" }}
                    >
                      <span style={{ color: sColor, fontWeight: "600" }}>
                        {s.split(" ")[0]}
                      </span>
                      {s.slice(s.split(" ")[0].length)}
                    </li>
                  ))}
                </ol>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: "0 4px 20px rgba(0,75,99,0.05)",
                  border: "1px solid #E8F0F3",
                }}
              >
                <h4
                  style={{
                    color: "#004B63",
                    margin: "0 0 8px 0",
                    fontSize: "11px",
                    fontWeight: "700",
                    borderBottom: `2px solid #66CCCC`,
                    paddingBottom: "7px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      width: "18px",
                      height: "18px",
                      background: "rgba(102,204,204,0.12)",
                      borderRadius: "5px",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                    }}
                  >
                    ▸
                  </span>
                  {t("vak.ui.pdf_recommended_careers")}
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {getCarrerasRecomendadas(diagnosis.predominantStyle)
                    .slice(0, 6)
                    .map((c, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "4px 8px",
                          background: `linear-gradient(135deg, ${styleIconBg}, transparent)`,
                          borderRadius: "16px",
                          color: "#004B63",
                          fontSize: "9px",
                          fontWeight: "600",
                          border: `1px solid ${sColor}20`,
                        }}
                      >
                        {c}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* ======== SEPARADOR ======== */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, transparent, #66CCCC, transparent)",
              margin: "0 0 16px 0",
              opacity: 0.25,
            }}
          />

          {/* ======== TIPS PARA PADRES PREMIUM ======== */}
          <div
            style={{
              padding: "14px 16px",
              background:
                "linear-gradient(135deg, rgba(77,168,196,0.04), rgba(102,204,204,0.04))",
              borderRadius: "12px",
              borderLeft: `4px solid #66CCCC`,
              marginBottom: "16px",
              boxShadow: "0 2px 12px rgba(102,204,204,0.06)",
            }}
          >
            <h4
              style={{
                color: "#004B63",
                margin: "0 0 8px 0",
                fontSize: "11px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: "24px",
                  height: "24px",
                  background: "linear-gradient(135deg, #66CCCC, #4DA8C4)",
                  borderRadius: "7px",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                }}
                dangerouslySetInnerHTML={{ __html: SVG_ICONS.lightbulb }}
              />
              {t("vak.ui.pdf_parent_tips")}
            </h4>
            <div style={{ fontSize: "10px", lineHeight: "1.6" }}>
              {getTipsPadres(diagnosis.predominantStyle).map((tip, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      color: "#66CCCC",
                      fontWeight: "bold",
                      fontSize: "12px",
                      lineHeight: "1.5",
                      flexShrink: 0,
                    }}
                  >
                    •
                  </span>
                  <span style={{ color: "#475569" }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ======== COMENTARIO DE VALERIA PREMIUM ======== */}
          <div
            style={{
              padding: "14px 16px",
              background:
                "linear-gradient(135deg, rgba(102,204,204,0.07), rgba(77,168,196,0.07))",
              borderRadius: "12px",
              borderLeft: `4px solid ${sColor}`,
              marginBottom: "14px",
              boxShadow: "0 2px 12px rgba(77,168,196,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/valeria.png"
                  alt="Valeria"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid ${sColor}`,
                    boxShadow: `0 0 0 3px ${sColor}15`,
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  style={{
                    display: "none",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${sColor}, ${sColor}88)`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    VR
                  </span>
                </div>
              </div>
              <div>
                <h4
                  style={{
                    color: "#004B63",
                    margin: 0,
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {t("vak.ui.pdf_valeria_name")}
                </h4>
                <p
                  style={{
                    margin: "1px 0 0 0",
                    color: "#64748B",
                    fontSize: "9px",
                  }}
                >
                  Psicóloga Educativa — Especialista VAK
                </p>
              </div>
            </div>
            <div
              style={{
                margin: 0,
                color: "#334155",
                fontSize: "10px",
                lineHeight: "1.6",
                whiteSpace: "pre-line",
                fontStyle: "italic",
              }}
            >
              {getValentinaCommentary(diagnosis, studentName, studentAge)}
            </div>
          </div>

          {/* ======== CONSEJO PERSONALIZADO ======== */}
          {diagnosis.styleDetails?.tip && (
            <div
              style={{
                padding: "12px 14px",
                background: `linear-gradient(135deg, ${styleIconBg}, transparent)`,
                borderRadius: "10px",
                borderLeft: `3px solid ${sColor}`,
                marginBottom: "16px",
              }}
            >
              <h4
                style={{
                  color: "#004B63",
                  margin: "0 0 4px 0",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {t("vak.ui.pdf_personalized_advice")}
              </h4>
              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "10px",
                  lineHeight: "1.5",
                }}
              >
                {diagnosis.styleDetails?.tip}
              </p>
            </div>
          )}

          {/* ======== FOOTER PREMIUM ======== */}
          <div
            style={{
              marginTop: "20px",
              padding: "16px 0 0 0",
              borderTop: "2px solid #D6E4EB",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {qrUrl && (
                <div
                  style={{
                    background: "#ffffff",
                    padding: "6px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <a
                    href={qrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t("vak.ui.pdf_open_results")}
                  >
                    <img
                      src={qrUrl}
                      alt={t("vak.ui.pdf_qr_alt")}
                      style={{ width: 80, height: 80, display: "block" }}
                      crossOrigin="anonymous"
                    />
                  </a>
                  <span
                    style={{
                      color: "#94A3B8",
                      fontSize: "7px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Escanea para ver resultados en línea
                  </span>
                </div>
              )}
              <div
                style={{
                  padding: "0 20px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 2px 0",
                    color: "#64748B",
                    fontSize: "9px",
                    fontWeight: "500",
                  }}
                >
                  {t("vak.ui.pdf_generated_by")}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#4DA8C4",
                    fontSize: "10px",
                    fontWeight: "600",
                  }}
                >
                  www.edutechlife.co
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  <span style={{ color: "#94A3B8", fontSize: "7px" }}>
                    Folio: {folio}
                  </span>
                  <span style={{ color: "#CBD5E1", fontSize: "7px" }}>|</span>
                  <span style={{ color: "#94A3B8", fontSize: "7px" }}>
                    {genDate}
                  </span>
                </div>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: "#CBD5E1",
                    fontSize: "7px",
                    lineHeight: "1.4",
                  }}
                >
                  {t("vak.ui.pdf_legal")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10"
      >
        <motion.button
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePDF}
          disabled={pdfLoading}
          className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {pdfLoading ? (
            <>
              <div className="relative z-10 w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span className="relative z-10 text-base font-semibold">
                {t("vak.ui.generating_pdf")}
              </span>
            </>
          ) : (
            <>
              <Download size={20} strokeWidth={2} className="relative z-10" />
              <span className="relative z-10 text-base font-semibold">
                {t("vak.ui.download_pdf_btn")}
              </span>
            </>
          )}
          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="relative bg-white border-2 border-[#004B63] text-[#004B63] rounded-full px-8 py-4 flex items-center gap-3 overflow-hidden group"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#004B63]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <ArrowRight size={20} strokeWidth={2} className="relative z-10" />
          <span className="relative z-10 text-base font-semibold">
            {t("vak.ui.back_to_results")}
          </span>
          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#004B63]/10 blur-md rounded-full"></div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/")}
          className="text-[#004B63]/50 hover:text-[#4DA8C4] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Rocket size={16} strokeWidth={2} />
          <span>{t("vak.ui.go_home")}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DocumentPreviewScreen;
