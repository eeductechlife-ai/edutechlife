import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";
import { buildCertVerificationUrl } from "../../utils/certificateVerification";

// Paleta fiel al diseño original del certificado
const NAVY = "#1B3A5F";
const GOLD = "#B08D3F";
const GOLD_LINE = "#C9A227";
const LINK = "#2563EB";

// Logos reales del certificado (colócalos en edutechlife-frontend/public/images/cert/).
// Si un archivo no existe, el generador cae a un texto de respaldo (no rompe el PDF).
const CERT_LOGOS = {
  tic: "/images/cert/tic.png",
  mzlAlcaldia: "/images/cert/mzl-alcaldia.png",
  edutechlife: "/images/cert/edutechlife.png",
};

const CertificatePreview = ({
  studentName,
  certNumber,
  issuedAt,
  compact = false,
}) => {
  const { t, locale } = useTranslation();
  const courseName = t("ialab.course_title");
  const courseFullName = t("profile.course_name");
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const displayName =
    studentName || t("ialab.certificate_preview.student_fallback");
  const displayCertNumber = certNumber || "EDL-2026-00000000";
  const verifyUrl = buildCertVerificationUrl(displayCertNumber);
  const displayDate = issuedAt
    ? new Date(issuedAt).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  // Carga cualquier imagen a data URL PNG y devuelve también sus dimensiones
  // naturales (para conservar la proporción al insertarla en el PDF).
  const loadImageDataUrl = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve({
            dataUrl: canvas.toDataURL("image/png"),
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("image load failed: " + src));
      img.src = src;
    });

  const loadImageWithTimeout = async (src, ms = 2500) => {
    try {
      return await Promise.race([
        loadImageDataUrl(src),
        new Promise((res) => setTimeout(() => res(null), ms)),
      ]);
    } catch {
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const W = doc.internal.pageSize.getWidth(); // 297
      const H = doc.internal.pageSize.getHeight(); // 210
      const cx = W / 2;

      // Paleta
      const NAVY = [27, 58, 95];
      const GOLD = [176, 141, 63];
      const GOLD_LINE = [201, 162, 39];
      const GOLD_SOFT = [226, 216, 189];
      const GRAY = [107, 114, 128];
      const GRAY_LT = [156, 163, 175];
      const LINK = [37, 99, 235];

      const setFill = (c) => doc.setFillColor(c[0], c[1], c[2]);
      const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2]);
      const setText = (c) => doc.setTextColor(c[0], c[1], c[2]);

      // Fondo
      setFill([255, 255, 255]);
      doc.rect(0, 0, W, H, "F");

      // Guilloche sutil (círculos concéntricos + roseta) detrás del texto
      setDraw(GOLD_SOFT);
      doc.setLineWidth(0.15);
      for (let i = 0; i < 8; i++) doc.circle(cx, 90, 30 + i * 5.5, "S");
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16;
        doc.line(cx, 90, cx + Math.cos(a) * 30, 90 + Math.sin(a) * 30);
      }

      // Marco doble dorado
      setDraw(GOLD);
      doc.setLineWidth(1.1);
      doc.rect(6, 6, W - 12, H - 12, "S");
      setDraw(GOLD_LINE);
      doc.setLineWidth(0.5);
      doc.rect(9.5, 9.5, W - 19, H - 19, "S");

      // Esquinas navy (brackets en L)
      setDraw(NAVY);
      doc.setLineWidth(2.2);
      const c0x = 6,
        c0y = 6,
        c1x = W - 6,
        c1y = H - 6,
        bl = 20;
      doc.line(c0x, c0y, c0x + bl, c0y);
      doc.line(c0x, c0y, c0x, c0y + bl);
      doc.line(c1x, c0y, c1x - bl, c0y);
      doc.line(c1x, c0y, c1x, c0y + bl);
      doc.line(c0x, c1y, c0x + bl, c1y);
      doc.line(c0x, c1y, c0x, c1y - bl);
      doc.line(c1x, c1y, c1x - bl, c1y);
      doc.line(c1x, c1y, c1x, c1y - bl);

      // Aviso superior
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      setText(GRAY);
      doc.text("PROGRAMA AVALADO POR LAS SIGUIENTES ENTIDADES", cx, 17, {
        align: "center",
        charSpace: 1.1,
      });

      // ---- Logos de entidades (línea superior) ----
      // Se usan los archivos reales; si falta alguno, se dibuja un texto de
      // respaldo para que el PDF nunca falle.
      const [ticLogo, mzlAlcaldiaLogo, edutechlifeCertLogo] = await Promise.all(
        [
          loadImageWithTimeout(CERT_LOGOS.tic),
          loadImageWithTimeout(CERT_LOGOS.mzlAlcaldia),
          loadImageWithTimeout(CERT_LOGOS.edutechlife),
        ],
      );
      const edutechlifeLogo =
        edutechlifeCertLogo ||
        (await loadImageWithTimeout("/images/logo-edutechlife.webp", 2000));

      const placeLogo = (logo, { left, right, maxH, maxW }) => {
        if (!logo || !logo.width || !logo.height) return false;
        const ratio = logo.width / logo.height;
        let h = maxH;
        let w = h * ratio;
        if (maxW && w > maxW) {
          w = maxW;
          h = w / ratio;
        }
        const x = right != null ? right - w : left;
        const y = 22 + (11 - h) / 2;
        doc.addImage(logo.dataUrl, "PNG", x, y, w, h);
        return true;
      };

      // TIC (izquierda)
      if (!placeLogo(ticLogo, { left: 18, maxH: 11 })) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        setText([0, 120, 190]);
        doc.text("TIC", 18, 30, { align: "left" });
      }

      // MZL + Alcaldía de Manizales (centro)
      if (!placeLogo(mzlAlcaldiaLogo, { left: cx - 45, maxH: 11 })) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        setText(NAVY);
        doc.text("MZL  ·  ALCALDÍA DE MANIZALES", cx, 29.5, {
          align: "center",
        });
      }

      // Edutechlife (derecha, wordmark)
      if (!placeLogo(edutechlifeLogo, { right: W - 18, maxH: 7, maxW: 62 })) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        setText(NAVY);
        doc.text("Edutechlife", W - 18, 29, { align: "right" });
      }

      // ---- Título ----
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      setText(GOLD);
      doc.text("CERTIFICADO DE APROBACIÓN", cx, 50, {
        align: "center",
        charSpace: 2.6,
      });

      // Divider dorado con rombo central
      setDraw(GOLD_LINE);
      doc.setLineWidth(0.4);
      doc.line(cx - 78, 55, cx - 6, 55);
      doc.line(cx + 6, 55, cx + 78, 55);
      setFill(GOLD_LINE);
      doc.triangle(cx, 52.6, cx - 2.6, 55, cx + 2.6, 55, "F");
      doc.triangle(cx - 2.6, 55, cx + 2.6, 55, cx, 57.4, "F");
      doc.circle(cx - 84, 55, 0.7, "F");
      doc.circle(cx + 84, 55, 0.7, "F");

      // Nombre del curso
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      setText(NAVY);
      doc.text(courseFullName, cx, 65, { align: "center" });

      // Texto intro
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      setText(GRAY);
      doc.text("Se otorga el presente certificado a", cx, 76, {
        align: "center",
      });

      // Nombre del estudiante
      doc.setFont("helvetica", "bold");
      doc.setFontSize(30);
      setText(NAVY);
      doc.text(displayName, cx, 90, { align: "center" });

      // Línea dorada bajo el nombre
      const nameW = doc.getTextWidth(displayName);
      setDraw(GOLD_LINE);
      doc.setLineWidth(1.3);
      doc.line(cx - nameW / 2 - 12, 94.5, cx + nameW / 2 + 12, 94.5);

      // Cuerpo
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      setText(GRAY);
      doc.text(
        "Por haber cursado y aprobado satisfactoriamente los 5 módulos del programa Introducción a la Inteligencia Artificial",
        cx,
        105,
        { align: "center" },
      );
      doc.text(
        "Generativa, demostrando dominio de los fundamentos, herramientas y aplicaciones prácticas de la IA Generativa.",
        cx,
        112,
        { align: "center" },
      );

      // ---- Firma única: Coordinador del Programa ----
      setDraw(NAVY);
      doc.setLineWidth(0.5);
      doc.line(cx - 32, 138, cx + 32, 138);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      setText(NAVY);
      doc.text("Coordinador del Programa", cx, 143.5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setText(GRAY_LT);
      doc.text("Alcaldía de Manizales", cx, 148.5, { align: "center" });

      // ---- Sello (derecha) ----
      const sealX = W - 40;
      const sealY = 140;
      setFill(GOLD_LINE);
      doc.circle(sealX, sealY, 16, "F");
      setFill(NAVY);
      doc.circle(sealX, sealY, 14, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      setText(GOLD_LINE);
      doc.text("CERTIFICADO", sealX, sealY - 5, {
        align: "center",
        charSpace: 0.6,
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      setText([255, 255, 255]);
      doc.text("EDUTECHLIFE", sealX, sealY + 0.5, {
        align: "center",
        charSpace: 0.4,
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      setText(GOLD_LINE);
      doc.text("VERIFICADO", sealX, sealY + 6, {
        align: "center",
        charSpace: 0.6,
      });

      // ---- QR (abajo izquierda) ----
      if (verifyUrl) {
        try {
          const { default: QRCode } = await import("qrcode");
          const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
            margin: 0,
            width: 256,
            color: { dark: "#1B3A5F", light: "#FFFFFF" },
          });
          const qrSize = 24;
          const qrX = 24;
          const qrY = 132;
          doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(6);
          setText(GRAY_LT);
          doc.text(
            "Escaneo para verificar",
            qrX + qrSize / 2,
            qrY + qrSize + 3.5,
            { align: "center" },
          );
        } catch (err) {
          if (import.meta.env.DEV) console.error("QR generation failed:", err);
        }
      }

      // ---- Pie ----
      setDraw([226, 232, 240]);
      doc.setLineWidth(0.3);
      doc.line(20, 168, W - 20, 168);

      const colY = 176;
      const valY = 182.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      setText(GRAY_LT);

      doc.text("FECHA DE EMISIÓN", cx - 78, colY, {
        align: "center",
        charSpace: 0.8,
      });
      doc.text("N.º DE CERTIFICADO", cx, colY, {
        align: "center",
        charSpace: 0.8,
      });
      doc.text("MODALIDAD", cx + 78, colY, { align: "center", charSpace: 0.8 });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      setText(NAVY);
      doc.text(displayDate, cx - 78, valY, { align: "center" });
      doc.text(displayCertNumber, cx, valY, { align: "center" });
      doc.text("Virtual", cx + 78, valY, { align: "center" });

      // Línea inferior
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      setText(GRAY_LT);
      doc.text(
        "edutechlife.co - Documento digital con verificación en línea",
        cx,
        190,
        { align: "center" },
      );
      if (verifyUrl) {
        doc.setFontSize(6.5);
        setText(LINK);
        doc.textWithLink(verifyUrl, cx, 195, {
          align: "center",
          url: verifyUrl,
        });
      }

      const fileName = `${t("certificate.filename_prefix")}_${courseName.replace(/\s+/g, "_")}_${displayName.replace(/\s+/g, "_")}.pdf`;
      try {
        doc.save(fileName);
      } catch (saveErr) {
        // Fallback (p. ej. navegadores móviles que bloquean la descarga):
        // abrir el blob en una pestaña nueva.
        console.error("doc.save falló, usando blob:", saveErr);
        const blobUrl = doc.output("bloburl");
        window.open(blobUrl, "_blank", "noopener,noreferrer");
      }
      setDownloadError(null);
    } catch (err) {
      // No silenciar el error en producción: mostrarlo al usuario.
      console.error("Error generating PDF:", err);
      setDownloadError(err?.message || "No se pudo generar el PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (compact) {
    return (
      <div className="text-center py-2">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[var(--theme-emphasis)] rounded-lg shadow-sm hover:shadow hover:border-l-[var(--theme-primary)] hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-800 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Icon name="fa-spinner" className="animate-spin" />
              {t("ialab.certificate_preview.generating_compact")}
            </>
          ) : (
            <>
              <Icon name="fa-download" />
              {t("ialab.certificate_preview.download")}
            </>
          )}
        </button>
        {downloadError && (
          <p className="mt-2 text-[11px] text-red-600" role="alert">
            {downloadError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        ref={certificateRef}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white shadow-xl"
        style={{
          containerType: "inline-size",
          border: `0.55cqw solid ${GOLD}`,
          minHeight: "70cqw",
        }}
      >
        {/* Marco interior */}
        <div
          className="absolute pointer-events-none"
          style={{ inset: "2.1cqw", border: `0.18cqw solid ${GOLD_LINE}` }}
        />

        {/* Esquinas navy */}
        {[
          {
            top: "1.6cqw",
            left: "1.6cqw",
            borderTop: `0.3cqw solid ${NAVY}`,
            borderLeft: `0.3cqw solid ${NAVY}`,
          },
          {
            top: "1.6cqw",
            right: "1.6cqw",
            borderTop: `0.3cqw solid ${NAVY}`,
            borderRight: `0.3cqw solid ${NAVY}`,
          },
          {
            bottom: "1.6cqw",
            left: "1.6cqw",
            borderBottom: `0.3cqw solid ${NAVY}`,
            borderLeft: `0.3cqw solid ${NAVY}`,
          },
          {
            bottom: "1.6cqw",
            right: "1.6cqw",
            borderBottom: `0.3cqw solid ${NAVY}`,
            borderRight: `0.3cqw solid ${NAVY}`,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{ ...s, width: "6cqw", height: "6cqw" }}
          />
        ))}

        {/* Guilloche sutil */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 297 210"
          preserveAspectRatio="xMidYMid slice"
        >
          <g fill="none" stroke="#E2D8BD" strokeWidth="0.15" opacity="0.5">
            {[30, 35.5, 41, 46.5, 52, 57.5, 63].map((r, i) => (
              <circle key={i} cx="148.5" cy="90" r={r} />
            ))}
          </g>
        </svg>

        <div
          className="relative z-10 flex flex-col min-h-[70cqw] px-[4.6cqw] py-[2.6cqw] text-center"
          style={{ color: NAVY }}
        >
          {/* Aviso superior */}
          <p className="tracking-[0.28em] text-[1.1cqw] text-slate-500 font-medium">
            PROGRAMA AVALADO POR LAS SIGUIENTES ENTIDADES
          </p>

          {/* Logos */}
          <div className="flex items-center justify-between px-[4cqw] mt-[1.5cqw] mb-[1cqw]">
            <img
              src={CERT_LOGOS.tic}
              alt="TIC"
              className="h-[9cqw] w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <img
              src={CERT_LOGOS.mzlAlcaldia}
              alt="MZL · Alcaldía de Manizales"
              className="h-[9cqw] w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <img
              src={CERT_LOGOS.edutechlife}
              alt="Edutechlife"
              className="h-[6cqw] w-auto object-contain max-w-[26%]"
              onError={(e) => {
                if (e.currentTarget.dataset.fallback) {
                  e.currentTarget.style.visibility = "hidden";
                } else {
                  e.currentTarget.dataset.fallback = "1";
                  e.currentTarget.src = "/images/logo-edutechlife.webp";
                }
              }}
            />
          </div>

          {/* Título */}
          <h2
            className="font-bold tracking-[0.32em] text-[2.6cqw] mt-[1.5%]"
            style={{ color: GOLD }}
          >
            CERTIFICADO DE APROBACIÓN
          </h2>
          <div className="flex items-center justify-center gap-[1cqw] my-[1%]">
            <span
              className="h-[0.4cqw] w-[22%]"
              style={{ background: GOLD_LINE }}
            />
            <span
              className="w-[1.4cqw] h-[1.4cqw] rotate-45"
              style={{ background: GOLD_LINE }}
            />
            <span
              className="h-[0.4cqw] w-[22%]"
              style={{ background: GOLD_LINE }}
            />
          </div>

          {/* Curso */}
          <p className="font-bold text-[2.1cqw]">{courseFullName}</p>

          <p className="text-[1.5cqw] text-slate-500 mt-[2%]">
            Se otorga el presente certificado a
          </p>

          {/* Nombre */}
          <h3 className="font-extrabold text-[4.4cqw] leading-none mt-[1.4%]">
            {displayName}
          </h3>
          <div
            className="h-[0.45cqw] w-[60%] mx-auto mt-[1.5%]"
            style={{ background: GOLD_LINE }}
          />

          {/* Cuerpo */}
          <p className="text-[1.5cqw] text-slate-500 leading-relaxed mt-[2.2%] max-w-[78%] mx-auto">
            Por haber cursado y aprobado satisfactoriamente los 5 módulos del
            programa Introducción a la Inteligencia Artificial Generativa,
            demostrando dominio de los fundamentos, herramientas y aplicaciones
            prácticas de la IA Generativa.
          </p>

          {/* Bloque inferior */}
          <div className="mt-auto grid grid-cols-3 items-end gap-[2%] pb-[1%]">
            {/* QR */}
            <div className="justify-self-start text-left">
              <div className="w-[16cqw] h-[16cqw] border border-slate-200 p-[0.6cqw] bg-white">
                <div
                  className="w-full h-full"
                  style={{
                    background: `repeating-conic-gradient(${NAVY} 0% 25%, #fff 0% 50%) 50% / 18% 18%`,
                  }}
                />
              </div>
              <span className="block text-[1cqw] text-slate-400 mt-[0.4cqw]">
                Escaneo para verificar
              </span>
            </div>

            {/* Firma única */}
            <div className="flex items-end justify-center">
              <div className="text-center">
                <div
                  className="h-px w-[52%] mx-auto bg-slate-800 mb-[1cqw]"
                  style={{ minHeight: "1px" }}
                />
                <span className="font-bold text-[1.2cqw] whitespace-nowrap">
                  Coordinador del Programa
                </span>
                <span className="block text-[1.1cqw] text-slate-400">
                  Alcaldía de Manizales
                </span>
              </div>
            </div>

            {/* Sello */}
            <div className="justify-self-end">
              <div
                className="w-[13cqw] h-[13cqw] rounded-full flex flex-col items-center justify-center"
                style={{ background: NAVY, border: `1cqw solid ${GOLD_LINE}` }}
              >
                <span
                  className="text-[0.9cqw] tracking-[0.2em]"
                  style={{ color: GOLD_LINE }}
                >
                  CERTIFICADO
                </span>
                <span className="text-white font-extrabold text-[1.3cqw] mt-[0.4cqw]">
                  EDUTECHLIFE
                </span>
                <span
                  className="text-[0.9cqw] tracking-[0.2em]"
                  style={{ color: GOLD_LINE }}
                >
                  VERIFICADO
                </span>
              </div>
            </div>
          </div>

          {/* Pie */}
          <div className="border-t border-slate-200 pt-[1.2%] grid grid-cols-3 gap-[2%]">
            <div>
              <p className="text-[1cqw] tracking-[0.16em] text-slate-400">
                FECHA DE EMISIÓN
              </p>
              <p className="font-bold text-[1.5cqw]">{displayDate}</p>
            </div>
            <div>
              <p className="text-[1cqw] tracking-[0.16em] text-slate-400">
                N.º DE CERTIFICADO
              </p>
              <p className="font-bold text-[1.5cqw]">{displayCertNumber}</p>
            </div>
            <div>
              <p className="text-[1cqw] tracking-[0.16em] text-slate-400">
                MODALIDAD
              </p>
              <p className="font-bold text-[1.5cqw]">Virtual</p>
            </div>
          </div>
          <p className="text-[0.95cqw] text-slate-400 mt-[0.6%]">
            edutechlife.co - Documento digital con verificación en línea
          </p>
          {verifyUrl && (
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[1cqw] hover:underline break-all"
              style={{ color: LINK }}
            >
              {verifyUrl}
            </a>
          )}
        </div>
      </motion.div>

      {/* Download button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Icon name="fa-spinner" className="animate-spin" />
              {t("ialab.certificate_preview.generating")}
            </>
          ) : (
            <>
              <Icon name="fa-download" />
              {t("ialab.certificate_preview.download")}
            </>
          )}
        </motion.button>
        {downloadError && (
          <p className="mt-2 text-xs text-red-600 text-center" role="alert">
            {downloadError}
          </p>
        )}
      </motion.div>
    </div>
  );
};

CertificatePreview.propTypes = {
  studentName: PropTypes.string,
  certNumber: PropTypes.string,
  issuedAt: PropTypes.string,
  compact: PropTypes.bool,
};

export default CertificatePreview;
