import { motion } from "framer-motion";
import { FileText, Lock } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { buildVakReport } from "../vakReport";
import {
  MixDonut,
  NumberedList,
  StyleMixCards,
  WeekPlan,
} from "../components/ReportBlocks";
import DocumentActions from "./documentActions";
import VakEnviarInforme from "../VakEnviarInforme";

const SectionTitle = ({ children, accent }) => (
  <h3 className="!m-0 !mb-3 flex items-center gap-2.5 text-lg font-extrabold text-[#072F46]">
    <span
      className="inline-block h-5 w-1.5 rounded-full"
      style={{ background: accent }}
      aria-hidden="true"
    />
    {children}
  </h3>
);

/**
 * Vista previa del informe para la familia. Muestra lo mismo que el PDF
 * (los dos leen `buildVakReport`), con el diseño adaptado a la pantalla.
 */
const DocumentPreviewScreen = ({
  diagnosis,
  parentName,
  generatePDF,
  pdfLoading,
  onBack,
}) => {
  const { t } = useTranslation();
  const report = buildVakReport(diagnosis, {
    parentName,
    date: diagnosis?.date,
  });

  if (!report) {
    return (
      <div className="p-10 text-center text-gray-500">
        {t("vak.ui.no_diagnosis_display")}
      </div>
    );
  }

  const main = report.styles.find((s) => s.key === report.main);
  const accent = main.fill;
  const ink = main.ink;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
        <FileText
          size={20}
          strokeWidth={2.2}
          className="shrink-0 text-[#199DB9]"
          aria-hidden="true"
        />
        <p className="!m-0 text-sm text-[#334155]">
          <strong className="text-[#072F46]">
            {t("vak.ui.report_preview_title")}
          </strong>{" "}
          {t("vak.ui.report_preview_hint")}
        </p>
      </div>

      <article className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_30px_80px_-40px_rgba(7,47,70,0.45)]">
        <div className="h-1.5 bg-[#199DB9]" aria-hidden="true" />
        <div className="space-y-7 p-5 sm:p-8">
          <header className="flex items-start justify-between gap-4">
            <img
              src="/images/logo-edutechlife.webp"
              alt="Edutechlife"
              className="h-7 sm:h-8 w-auto"
            />
            <div className="text-right">
              <p className="!m-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#199DB9]">
                {t("vak.ui.pdf_cover_note")}
              </p>
              <p className="!m-0 !mt-0.5 text-xs text-[#64748B]">
                {report.dateLabel}
              </p>
            </div>
          </header>

          {/* ---------- portada ---------- */}
          <section className="relative overflow-hidden rounded-3xl bg-[#072F46] p-6 sm:p-8 text-white">
            <div
              className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-[#199DB9]/25"
              aria-hidden="true"
            />
            <div className="relative flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="!m-0 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7FD3E3]">
                  {t("vak.ui.pdf_title")}
                </p>
                <h2 className="!m-0 !mt-2 text-3xl sm:text-4xl font-extrabold leading-tight text-white break-words">
                  {report.name}
                </h2>
                <p className="!m-0 !mt-1 text-sm text-white/60">
                  {report.age} años · {report.dateLabel}
                </p>
                <p className="!m-0 !mt-3 text-lg font-bold text-white">
                  {report.headline}
                </p>
                <span
                  className="mt-4 inline-block rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#072F46]"
                  style={{ background: accent }}
                >
                  {report.profileLabel}
                </span>
              </div>
              <MixDonut report={report} size={150} reduceMotion />
            </div>
          </section>

          <p className="!m-0 flex items-start gap-2 text-sm text-[#475569]">
            <Lock
              size={16}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-[#199DB9]"
              aria-hidden="true"
            />
            {report.guardian
              ? t("vak.ui.pdf_prepared_for_both", {
                  parent: report.guardian,
                  student: report.name,
                })
              : t("vak.ui.pdf_prepared_for_student", { student: report.name })}
          </p>

          <section>
            <SectionTitle accent={accent}>
              {t("vak.ui.pdf_learning_profile")}
            </SectionTitle>
            <StyleMixCards report={report} reduceMotion t={t} />
          </section>

          <section>
            <SectionTitle accent={accent}>
              {t("vak.ui.pdf_analysis")}
            </SectionTitle>
            <div className="rounded-2xl border-l-4 border-[#199DB9] bg-[#F8FAFC] p-4">
              <p className="!m-0 text-[15px] leading-relaxed text-[#1E293B]">
                {report.summary}
              </p>
              <p className="!m-0 !mt-2 text-sm italic text-[#64748B]">
                {report.summaryNote}
              </p>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            <section
              className="rounded-3xl p-5"
              style={{ background: `${accent}1F` }}
            >
              <h3
                className="!m-0 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: ink }}
              >
                {t("vak.ui.result_superpower")}
              </h3>
              <p className="!m-0 !mt-2 text-base font-bold leading-snug text-[#072F46]">
                {report.superpower}
              </p>
            </section>
            <section className="rounded-3xl border border-[#B6E3EC] bg-[#F0FAFC] p-5">
              <h3 className="!m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0E7490]">
                {t("vak.ui.result_challenge")}
              </h3>
              <p className="!m-0 !mt-2 text-base leading-snug text-[#0F3B4F]">
                {report.challenge}
              </p>
            </section>
          </div>

          <section>
            <SectionTitle accent={accent}>
              {t("vak.ui.pdf_study_strategies")}
            </SectionTitle>
            <NumberedList
              items={report.strategies}
              accent={accent}
              ink={ink}
              className="sm:columns-2 sm:gap-6 [&>li]:break-inside-avoid [&>li]:mb-2.5"
            />
          </section>

          <section>
            <SectionTitle accent={accent}>
              {t("vak.ui.pdf_parent_tips")}
            </SectionTitle>
            <NumberedList items={report.parentTips} accent={accent} ink={ink} />
          </section>

          <section>
            <SectionTitle accent={accent}>
              {t("vak.ui.report_week_plan")}
            </SectionTitle>
            <WeekPlan report={report} accent={accent} ink={ink} />
          </section>

          <section className="rounded-3xl bg-[#EAF6F9] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <img
                src="/valeria.webp"
                alt=""
                className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <div>
                <p className="!m-0 text-base font-extrabold text-[#072F46]">
                  {t("vak.ui.pdf_valeria_name")}
                </p>
                <p className="!m-0 text-xs text-[#64748B]">
                  {t("vak.ui.pdf_valeria_title")}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-[#1E293B]">
              {report.valeriaNote
                .split("\n\n")
                .filter(Boolean)
                .map((p) => (
                  <p key={p} className="!m-0">
                    {p}
                  </p>
                ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E2E8F0] p-4">
            <h3 className="!m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[#199DB9]">
              {t("vak.ui.pdf_disclaimer_title")}
            </h3>
            <p className="!m-0 !mt-1.5 text-sm leading-relaxed text-[#64748B]">
              {t("vak.ui.pdf_disclaimer_text")}
            </p>
          </section>
        </div>
      </article>

      <DocumentActions
        generatePDF={generatePDF}
        pdfLoading={pdfLoading}
        onBack={onBack}
      />

      <div className="mx-auto mt-8 max-w-md px-4 pb-8">
        <VakEnviarInforme
          nombreInicial={parentName}
          nombreEstudiante={diagnosis.studentName}
          diagnosis={diagnosis}
        />
      </div>
    </motion.div>
  );
};

export default DocumentPreviewScreen;
