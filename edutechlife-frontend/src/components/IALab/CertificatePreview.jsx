import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import jsPDF from 'jspdf';

const COURSE_NAME = 'Introducción a la I.A Generativa';
const COURSE_FULL_NAME = 'Introducción a la Inteligencia Artificial Generativa';

const CertificatePreview = ({ studentName, certNumber, issuedAt, compact = false }) => {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const displayName = studentName || 'Estudiante';
  const displayCertNumber = certNumber || 'EDL-2026-00000000';
  const displayDate = issuedAt 
    ? new Date(issuedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, 'F');

      // Gradient header bar
      for (let x = 0; x < W; x++) {
        const ratio = x / W;
        const r = Math.round(0 + (0 - 0) * ratio);
        const g = Math.round(75 + (188 - 75) * ratio);
        const b = Math.round(99 + (212 - 99) * ratio);
        doc.setFillColor(r, g, b);
        doc.rect(x, 0, 1, 18, 'F');
      }

      // Header text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text('EDUTECHLIFE', 15, 12);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('www.edutechlife.com', W - 15, 12, { align: 'right' });

      // Gold border lines
      doc.setDrawColor(255, 209, 102);
      doc.setLineWidth(2);
      doc.rect(10, 22, W - 20, H - 34, 'S');
      doc.setLineWidth(0.5);
      doc.rect(13, 25, W - 26, H - 40, 'S');

      // Corner ornaments
      const cs = 6;
      doc.setDrawColor(255, 209, 102);
      doc.setLineWidth(1.5);
      [[13, 25], [W - 13, 25], [13, H - 15], [W - 13, H - 15]].forEach(([cx, cy]) => {
        doc.setFillColor(255, 209, 102);
        doc.circle(cx, cy, 2.5, 'F');
      });

      // Watermark
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(120);
      doc.setTextColor(0, 75, 99, 0.03);
      doc.text('E', W / 2, H / 2 + 20, { align: 'center' });

      // CERTIFICADO title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      doc.setTextColor(0, 75, 99);
      doc.text('CERTIFICADO', W / 2, 50, { align: 'center' });

      // Cyan line under title
      doc.setDrawColor(0, 188, 212);
      doc.setLineWidth(0.8);
      doc.line(W / 2 - 30, 54, W / 2 + 30, 54);

      // Course name
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.setTextColor(100, 116, 139);
      doc.text(COURSE_FULL_NAME, W / 2, 63, { align: 'center' });

      // Intro text
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text('Este certificado se otorga a:', W / 2, 78, { align: 'center' });

      // Student name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(0, 75, 99);
      doc.text(displayName, W / 2, 93, { align: 'center' });

      // Underline for name
      const nameW = doc.getTextWidth(displayName);
      doc.setDrawColor(0, 75, 99);
      doc.setLineWidth(0.5);
      doc.line(W / 2 - nameW / 2 - 5, 97, W / 2 + nameW / 2 + 5, 97);

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text('Por haber completado exitosamente los 5 módulos del curso', W / 2, 108, { align: 'center' });
      doc.text(`de ${COURSE_NAME} con desempeño sobresaliente.`, W / 2, 115, { align: 'center' });

      // Seal circle
      const sealX = W / 2 + 70;
      const sealY = 95;
      doc.setDrawColor(255, 209, 102);
      doc.setFillColor(255, 209, 102);
      doc.circle(sealX, sealY, 18, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1);
      doc.circle(sealX, sealY, 16, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(0, 75, 99);
      doc.text('VERIFICADO', sealX, sealY - 2, { align: 'center' });
      doc.text('EDUTECHLIFE', sealX, sealY + 4, { align: 'center' });

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(25, 128, W - 25, 128);

      // Footer info
      const footerY = 138;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);

      // Date
      doc.text('Fecha de Emisión', W / 2 - 45, footerY, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text(displayDate, W / 2 - 45, footerY + 6, { align: 'center' });

      // Certificate number
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Nº Certificado', W / 2, footerY, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text(displayCertNumber, W / 2, footerY + 6, { align: 'center' });

      // Verified badge text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Certificado Verificado', W / 2 + 45, footerY, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text('EDUTECHLIFE', W / 2 + 45, footerY + 6, { align: 'center' });

      // Bottom bar
      for (let x = 0; x < W; x++) {
        const ratio = x / W;
        const r = Math.round(0 + (0 - 0) * ratio);
        const g = Math.round(75 + (188 - 75) * ratio);
        const b = Math.round(99 + (212 - 99) * ratio);
        doc.setFillColor(r, g, b);
        doc.rect(x, H - 12, 1, 12, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('www.edutechlife.com  •  Certificado digital verificable', W / 2, H - 4, { align: 'center' });

      doc.save(`Certificado_${COURSE_NAME.replace(/\s+/g, '_')}_${displayName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
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
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-800 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Icon name="fa-spinner" className="animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Icon name="fa-download" />
              Descargar PDF
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        ref={certificateRef}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-white rounded-xl overflow-hidden shadow-xl"
        style={{ border: '3px solid #FFD166' }}
      >
        {/* Outer decorative border */}
        <div
          className="absolute inset-2 pointer-events-none rounded-lg"
          style={{ border: '1px solid rgba(255, 209, 102, 0.5)' }}
        />

        {/* Corner ornaments */}
        {[
          'top-3 left-3',
          'top-3 right-3',
          'bottom-3 left-3',
          'bottom-3 right-3',
        ].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-2.5 h-2.5 rounded-full bg-[#FFD166] z-20 pointer-events-none`} />
        ))}

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span
            className="font-black text-[200px] md:text-[250px] opacity-[0.03]"
            style={{ color: '#004B63' }}
          >
            E
          </span>
        </div>

        {/* Header gradient */}
        <div className="relative z-10 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" fill="white" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm tracking-[0.15em]">EDUTECHLIFE</span>
            </div>
            <span className="text-white/60 text-[10px] hidden sm:block">www.edutechlife.com</span>
          </div>
        </div>

        {/* Certificate content */}
        <div className="relative z-10 px-6 py-10 md:px-12 md:py-12 text-center">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-4xl font-black tracking-[0.2em]"
            style={{ color: '#004B63' }}
          >
            CERTIFICADO
          </motion.h2>

          {/* Cyan divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-0.5 mx-auto my-3"
            style={{ background: 'linear-gradient(90deg, transparent, #00BCD4, transparent)' }}
          />

          {/* Course name */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm md:text-base font-medium tracking-wide uppercase mb-8"
            style={{ color: '#64748B' }}
          >
            {COURSE_FULL_NAME}
          </motion.p>

          {/* Intro text */}
          <p className="text-sm mb-2" style={{ color: '#94A3B8' }}>
            Este certificado se otorga a:
          </p>

          {/* Student name */}
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold mb-3 px-4"
            style={{ color: '#004B63' }}
          >
            {displayName}
          </motion.h3>

          {/* Name underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-48 h-0.5 mx-auto mb-6"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,75,99,0.3), transparent)' }}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-sm max-w-md mx-auto leading-relaxed mb-8"
            style={{ color: '#64748B' }}
          >
            Por haber completado exitosamente los{' '}
            <span className="font-semibold" style={{ color: '#004B63' }}>5 módulos</span>{' '}
            del curso de {COURSE_NAME} con desempeño sobresaliente.
          </motion.p>

          {/* Divider */}
          <div className="w-full h-px bg-slate-200 mb-8" />

          {/* Footer info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16"
          >
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
                Fecha de Emisión
              </p>
              <p className="text-sm font-bold" style={{ color: '#004B63' }}>
                {displayDate}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
                Nº Certificado
              </p>
              <p className="text-sm font-bold font-mono" style={{ color: '#004B63' }}>
                {displayCertNumber}
              </p>
            </div>

            {/* Official Seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <div
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FFD166 0%, #F59E0B 100%)',
                  boxShadow: '0 4px 15px rgba(255, 209, 102, 0.4)',
                }}
              >
                {/* Inner circle */}
                <div className="w-14 h-14 rounded-full border-2 border-white/50 flex flex-col items-center justify-center">
                  <span className="text-[8px] font-bold leading-tight" style={{ color: '#004B63' }}>
                    VERIFICADO
                  </span>
                  <span className="text-[7px] font-semibold leading-tight" style={{ color: '#0A3550' }}>
                    EDUTECHLIFE
                  </span>
                </div>
              </div>
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 1.2, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] px-6 py-2.5 text-center">
          <p className="text-[10px] text-white/70 tracking-wide">
            www.edutechlife.com  •  Certificado digital verificable
          </p>
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
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Icon name="fa-spinner" className="animate-spin" />
              Generando PDF...
            </>
          ) : (
            <>
              <Icon name="fa-download" />
              Descargar PDF
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CertificatePreview;
