import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

const SPONSORS = [
  { name: 'Colciencias', initials: 'CO', color: [0, 102, 179] },
  { name: 'MinTIC', initials: 'MT', color: [0, 153, 51] },
  { name: 'Edutechlife', initials: 'EL', color: [0, 75, 99] },
];

const CertificatePreview = ({ studentName, certNumber, issuedAt, compact = false }) => {
  const { t, locale } = useTranslation();
  const courseName = t('ialab.course_title');
  const courseFullName = t('profile.course_name');
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const displayName = studentName || t('ialab.certificate_preview.student_fallback');
  const displayCertNumber = certNumber || 'EDL-2026-00000000';
  const displayDate = issuedAt 
    ? new Date(issuedAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
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
      doc.text(t('certificate.edutechlife'), 15, 12);
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
      doc.text(t('certificate.title_pdf'), W / 2, 50, { align: 'center' });

      // Cyan line under title
      doc.setDrawColor(0, 188, 212);
      doc.setLineWidth(0.8);
      doc.line(W / 2 - 30, 54, W / 2 + 30, 54);

      // Course name
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.setTextColor(100, 116, 139);
      doc.text(courseFullName, W / 2, 63, { align: 'center' });

      // Intro text
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(t('certificate.awarded_to'), W / 2, 78, { align: 'center' });

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
      doc.text(t('certificate.completed_course'), W / 2, 108, { align: 'center' });
      doc.text(t('certificate.outstanding_performance', { course: courseName }), W / 2, 115, { align: 'center' });

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
      doc.text(t('certificate.verified_seal'), sealX, sealY - 2, { align: 'center' });
      doc.text(t('certificate.edutechlife'), sealX, sealY + 4, { align: 'center' });

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(25, 128, W - 25, 128);

      // Footer info
      const footerY = 138;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);

      // Date
      doc.text(t('certificate.issue_date_pdf'), W / 2 - 45, footerY, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text(displayDate, W / 2 - 45, footerY + 6, { align: 'center' });

      // Certificate number
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(t('certificate.cert_number_pdf'), W / 2, footerY, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text(displayCertNumber, W / 2, footerY + 6, { align: 'center' });

      // Verified badge text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(t('certificate.verified_pdf'), W / 2 + 45, footerY, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 75, 99);
      doc.text(t('certificate.edutechlife'), W / 2 + 45, footerY + 6, { align: 'center' });

      // Sponsor logos
      const sponsorY = footerY + 18;
      const sponsorStartX = W / 2 - ((SPONSORS.length * 20) / 2);
      SPONSORS.forEach((s, i) => {
        const cx = sponsorStartX + i * 20 + 10;
        doc.setFillColor(s.color[0], s.color[1], s.color[2]);
        doc.circle(cx, sponsorY, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5);
        doc.setTextColor(255, 255, 255);
        doc.text(s.initials, cx, sponsorY + 1.5, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(4.5);
        doc.setTextColor(148, 163, 184);
        doc.text(s.name, cx, sponsorY + 10, { align: 'center' });
      });

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
      doc.text(t('certificate.footer_pdf'), W / 2, H - 4, { align: 'center' });

      doc.save(`${t('certificate.filename_prefix')}_${courseName.replace(/\s+/g, '_')}_${displayName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error generating PDF:', err);
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
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-petroleum rounded-lg shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-800 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Icon name="fa-spinner" className="animate-spin" />
              {t('ialab.certificate_preview.generating_compact')}
            </>
          ) : (
            <>
              <Icon name="fa-download" />
              {t('ialab.certificate_preview.download')}
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
        className="relative bg-white rounded-xl overflow-hidden shadow-xl border-[3px] border-[#FFD166]"
      >
        {/* Outer decorative border */}
        <div
          className="absolute inset-2 pointer-events-none rounded-lg border border-[#FFD166]/50"
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
          <span className="font-black text-[200px] md:text-[250px] opacity-[0.03] text-petroleum">
            E
          </span>
        </div>

        {/* Header gradient */}
        <div className="relative z-10 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate px-6 py-3.5">
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
            className="text-3xl md:text-4xl font-black tracking-[0.2em] text-petroleum"
          >
            {t('ialab.certificate_preview.certificate_title_react')}
          </motion.h2>

          {/* Cyan divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-0.5 mx-auto my-3 bg-gradient-to-r from-transparent via-corporate to-transparent"
          />

          {/* Course name */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm md:text-base font-medium tracking-wide uppercase mb-8 text-slate-500"
          >
            {courseFullName}
          </motion.p>

          {/* Intro text */}
          <p className="text-sm mb-2 text-slate-400">
            {t('ialab.certificate_preview.issued_to')}
          </p>

          {/* Student name */}
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold mb-3 px-4 text-petroleum"
          >
            {displayName}
          </motion.h3>

          {/* Name underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-48 h-0.5 mx-auto mb-6 bg-gradient-to-r from-transparent via-petroleum/30 to-transparent"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-sm max-w-md mx-auto leading-relaxed mb-8 text-slate-500"
          >
            {t('ialab.certificate_preview.completed_text', { count: 5, course: courseName })}
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
              <p className="text-[10px] uppercase tracking-wider mb-1 text-slate-400">
                {t('ialab.certificate_preview.issue_date')}
              </p>
              <p className="text-sm font-bold text-petroleum">
                {displayDate}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider mb-1 text-slate-400">
                {t('ialab.certificate_preview.cert_number')}
              </p>
              <p className="text-sm font-bold font-mono text-petroleum">
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
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFD166] to-amber-500 shadow-[0_4px_15px_rgba(255,209,102,0.4)]"
              >
                {/* Inner circle */}
                <div className="w-14 h-14 rounded-full border-2 border-white/50 flex flex-col items-center justify-center">
                  <span className="text-[8px] font-bold leading-tight text-petroleum">
                    {t('ialab.certificate_preview.verified')}
                  </span>
                  <span className="text-[7px] font-semibold leading-tight" style={{ color: 'var(--color-petroleum-dark)' }}>
                    EDUTECHLIFE
                  </span>
                </div>
              </div>
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 1.2, duration: 1.5, repeat: 1, repeatDelay: 3 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate px-6 py-2.5 text-center">
          <p className="text-[10px] text-white/70 tracking-wide">
            www.edutechlife.com  •  {t('ialab.certificate_preview.verified')}
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
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Icon name="fa-spinner" className="animate-spin" />
              {t('ialab.certificate_preview.generating')}
            </>
          ) : (
            <>
              <Icon name="fa-download" />
              {t('ialab.certificate_preview.download')}
            </>
          )}
        </motion.button>
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
