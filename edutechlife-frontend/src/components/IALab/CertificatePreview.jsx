import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';
import { INSTITUTIONS, buildVerifyUrl } from '../../utils/certificatePdf';

const MODULE_COUNT = 5;

/** Marca de agua de seguridad: replica la roseta del PDF en la vista previa. */
const Guilloche = () => (
  <svg
    className="absolute inset-0 m-auto h-[68%] w-auto pointer-events-none select-none"
    viewBox="-60 -60 120 120"
    aria-hidden="true"
  >
    {Array.from({ length: 7 }, (_, i) => (
      <circle key={`r${i}`} cx="0" cy="0" r={20 + i * 5.5} fill="none" stroke="#B08D3E" strokeWidth="0.18" opacity="0.13" />
    ))}
    {Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      return (
        <circle
          key={`p${i}`}
          cx={Math.cos(a) * 30}
          cy={Math.sin(a) * 30}
          r="16"
          fill="none"
          stroke="#00A8C6"
          strokeWidth="0.15"
          opacity="0.13"
        />
      );
    })}
  </svg>
);

/** Escuadra dorada/navy de esquina. */
const CornerBracket = ({ position }) => (
  <span
    className={`absolute ${position} w-8 h-8 border-[#0A3049] pointer-events-none`}
    aria-hidden="true"
  />
);
CornerBracket.propTypes = { position: PropTypes.string.isRequired };

const CertificatePreview = ({ studentName, certNumber, issuedAt, compact = false }) => {
  const { t, locale } = useTranslation();
  const courseFullName = t('profile.course_name');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const displayName = studentName || t('ialab.certificate_preview.student_fallback');
  const displayCertNumber =
    certNumber || `EDL-${new Date().getFullYear()}-00000000`;
  const displayDate = useMemo(() => {
    const date = issuedAt ? new Date(issuedAt) : new Date();
    const valid = !Number.isNaN(date.getTime()) ? date : new Date();
    return valid.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }, [issuedAt, locale]);

  const verifyUrl = buildVerifyUrl(displayCertNumber);

  const signatures = useMemo(
    () => [
      { name: t('certificate.signature_1_name'), role: t('certificate.signature_1_role') },
      { name: t('certificate.signature_2_name'), role: t('certificate.signature_2_role') },
    ],
    [t],
  );

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      const [{ default: jsPDF }, pdf, assets] = await Promise.all([
        import('jspdf'),
        import('../../utils/certificatePdf'),
        import('../../utils/certificateAssets'),
      ]);

      const [images, qrMatrix] = await Promise.all([
        assets.loadInstitutionLogos(),
        assets.buildQrMatrix(verifyUrl),
      ]);

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });

      pdf.drawCertificate(doc, {
        studentName: displayName,
        certNumber: displayCertNumber,
        issuedDate: displayDate,
        courseName: courseFullName,
        verifyUrl,
        qrMatrix,
        images,
        signatures,
        strings: {
          title: t('certificate.title_pdf'),
          endorsement: t('certificate.endorsement'),
          awardedTo: t('certificate.awarded_to'),
          body: t('certificate.body', { count: MODULE_COUNT, course: courseFullName }),
          scanToVerify: t('certificate.scan_to_verify'),
          issueDate: t('certificate.issue_date_pdf'),
          certNumber: t('certificate.cert_number_pdf'),
          modality: t('certificate.modality'),
          modalityValue: t('certificate.modality_value', { count: MODULE_COUNT }),
          sealTop: t('certificate.seal_top'),
          sealBottom: t('certificate.verified_seal'),
          footer: t('certificate.footer_pdf'),
        },
      });

      const slug = (value) => value.replace(/\s+/g, '_').replace(/[^\w\-.]/g, '');
      doc.save(`${slug(t('certificate.filename_prefix'))}_${slug(displayName)}_${displayCertNumber}.pdf`);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error generando el certificado:', err);
      setError(t('certificate.error_generating'));
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadButton = (className) => (
    <button
      onClick={handleDownloadPDF}
      disabled={isDownloading}
      className={className}
      aria-busy={isDownloading}
    >
      <Icon name={isDownloading ? 'fa-spinner' : 'fa-download'} className={isDownloading ? 'animate-spin' : ''} />
      {isDownloading
        ? t(compact ? 'ialab.certificate_preview.generating_compact' : 'ialab.certificate_preview.generating')
        : t('ialab.certificate_preview.download')}
    </button>
  );

  if (compact) {
    return (
      <div className="text-center py-2">
        {downloadButton(
          'w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#B08D3E] rounded-lg shadow-sm hover:shadow hover:border-l-[#0A3049] hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-800 disabled:opacity-50',
        )}
        {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-white shadow-xl overflow-hidden"
        style={{ aspectRatio: '297 / 210' }}
      >
        {/* Marco grabado: doble filete dorado */}
        <div className="absolute inset-[3%] border-[3px] border-[#B08D3E] pointer-events-none" />
        <div className="absolute inset-[4%] border border-[#D4B56A]/70 pointer-events-none" />

        {/* Escuadras navy */}
        <CornerBracket position="top-[4%] left-[4%] border-t-2 border-l-2" />
        <CornerBracket position="top-[4%] right-[4%] border-t-2 border-r-2" />
        <CornerBracket position="bottom-[4%] left-[4%] border-b-2 border-l-2" />
        <CornerBracket position="bottom-[4%] right-[4%] border-b-2 border-r-2" />

        <Guilloche />

        <div className="relative h-full flex flex-col px-[8%] py-[5%] text-center">
          {/* Aval institucional */}
          <p className="text-[clamp(5px,0.75vw,8px)] uppercase tracking-[0.3em] text-slate-400">
            {t('certificate.endorsement')}
          </p>

          <div className="mt-[1.5%] flex items-center justify-center divide-x divide-slate-200">
            {INSTITUTIONS.map((inst) => (
              <div key={inst.id} className="flex-1 px-3 flex items-center justify-center min-h-[6%]">
                <img
                  src={inst.logo}
                  alt={inst.full}
                  className="max-h-[clamp(16px,2.6vw,32px)] max-w-full w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-[clamp(6px,0.95vw,11px)] font-bold uppercase tracking-[0.12em] text-[#0A3049] border-y border-[#D4B56A] py-1">
                  {inst.full}
                </span>
              </div>
            ))}
          </div>

          {/* Título: más aire respecto a los logos que antes. */}
          <h2 className="mt-[6.5%] text-[clamp(9px,1.5vw,18px)] font-bold uppercase tracking-[0.34em] text-[#B08D3E]">
            {t('certificate.title_pdf')}
          </h2>

          {/* Ornamento */}
          <div className="mt-[1.5%] flex items-center justify-center gap-2" aria-hidden="true">
            <span className="h-px w-[18%] bg-[#D4B56A]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B08D3E]" />
            <span className="h-px w-[18%] bg-[#D4B56A]" />
          </div>

          <p className="mt-[2.5%] text-[clamp(10px,1.8vw,22px)] font-bold text-[#0A3049] leading-tight">
            {courseFullName}
          </p>

          <p className="mt-[3%] text-[clamp(7px,1.05vw,13px)] text-slate-500">
            {t('certificate.awarded_to')}
          </p>

          {/* Nombre */}
          <p className="mt-[1.5%] text-[clamp(15px,3.3vw,40px)] font-bold text-[#0A3049] leading-none break-words">
            {displayName}
          </p>
          <span className="mx-auto mt-[1.5%] h-[2px] w-[55%] bg-[#B08D3E]" />

          <p className="mt-[3%] mx-auto max-w-[78%] text-[clamp(7px,1.1vw,13px)] text-slate-700 leading-relaxed">
            {t('certificate.body', { count: MODULE_COUNT, course: courseFullName })}
          </p>

          <div className="mt-auto w-full">
            <div className="h-px w-full bg-slate-200" />

            {/* Validación: QR, firmas y sello */}
            <div className="flex items-end justify-between gap-[3%] pt-[3.5%]">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-[clamp(28px,5.5vw,70px)] aspect-square border border-slate-200 flex items-center justify-center bg-white">
                  <Icon name="fa-qrcode" className="text-[#0A3049] text-[clamp(16px,3.5vw,44px)]" />
                </div>
                <span className="mt-1 text-[clamp(4px,0.6vw,7px)] text-slate-400">
                  {t('certificate.scan_to_verify')}
                </span>
              </div>

              {signatures.map((sig) => (
                <div key={sig.role} className="flex-1 text-center">
                  <span className="block h-px w-full bg-[#0A3049]" />
                  <p className="mt-1 text-[clamp(6px,0.95vw,11px)] font-bold text-[#0A3049]">{sig.name}</p>
                  <p className="text-[clamp(5px,0.75vw,9px)] text-slate-500">{sig.role}</p>
                </div>
              ))}

              <div className="shrink-0 w-[clamp(34px,6.5vw,82px)] aspect-square rounded-full bg-[#B08D3E] p-[6%]">
                <div className="w-full h-full rounded-full bg-[#0A3049] flex flex-col items-center justify-center text-center leading-tight">
                  <span className="text-[clamp(3px,0.55vw,7px)] font-bold uppercase tracking-[0.1em] text-[#D4B56A]">
                    {t('certificate.seal_top')}
                  </span>
                  <span className="text-[clamp(4px,0.7vw,9px)] font-bold tracking-[0.08em] text-white">
                    EDUTECHLIFE
                  </span>
                  <span className="text-[clamp(3px,0.5vw,6px)] text-[#D4B56A]">
                    {t('certificate.verified_seal')}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadatos */}
            <div className="mt-[3%] pt-[2%] border-t border-slate-200 grid grid-cols-3 gap-2">
              {[
                { label: t('certificate.issue_date_pdf'), value: displayDate },
                { label: t('certificate.cert_number_pdf'), value: displayCertNumber, mono: true },
                { label: t('certificate.modality'), value: t('certificate.modality_value', { count: MODULE_COUNT }) },
              ].map((meta) => (
                <div key={meta.label}>
                  <p className="text-[clamp(4px,0.62vw,8px)] uppercase tracking-[0.18em] text-slate-400">
                    {meta.label}
                  </p>
                  <p className={`text-[clamp(6px,0.95vw,11px)] font-bold text-[#0A3049] ${meta.mono ? 'font-mono' : ''}`}>
                    {meta.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-[2%] text-[clamp(4px,0.62vw,8px)] text-slate-400">
              {t('certificate.footer_pdf')}
            </p>
            <p className="text-[clamp(4px,0.6vw,8px)] font-mono text-[#004B63] break-all">{verifyUrl}</p>
          </div>
        </div>
      </motion.div>

      {error && (
        <p role="alert" className="text-center text-sm text-red-600">
          {error}
        </p>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        {downloadButton(
          'w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0A3049] to-[#004B63] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50',
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
