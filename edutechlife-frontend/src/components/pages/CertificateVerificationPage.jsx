import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "../../i18n/I18nProvider";
import { supabase } from "../../lib/supabase";
import SEO from "../SEO";
import { normalizeCertNumber, isValidCertNumber } from "../../utils/certificateVerification";

const STATUS = {
  LOADING: "loading",
  VALID: "valid",
  NOT_FOUND: "not_found",
  INVALID: "invalid",
  UNAVAILABLE: "unavailable",
};

const formatDate = (value, locale) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(locale || undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

/**
 * Página pública de verificación de certificados (Fase 6).
 * Consulta la RPC `verify_certificate` (solo campos públicos) y muestra el
 * estado del certificado. Aditiva: no toca el flujo autenticado existente.
 */
export default function CertificateVerificationPage() {
  const { certNumber } = useParams();
  const { t, locale } = useTranslation();
  const [status, setStatus] = useState(STATUS.LOADING);
  const [cert, setCert] = useState(null);

  const normalized = normalizeCertNumber(certNumber);
  const formatInvalid = !isValidCertNumber(normalized);
  const viewStatus = formatInvalid ? STATUS.INVALID : status;

  useEffect(() => {
    if (formatInvalid) return undefined;

    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("verify_certificate", {
          p_cert_number: normalized,
        });
        if (!active) return;
        if (error) {
          setStatus(STATUS.UNAVAILABLE);
          return;
        }
        const row = Array.isArray(data) ? data[0] : data;
        if (!row) {
          setStatus(STATUS.NOT_FOUND);
          return;
        }
        setCert(row);
        setStatus(STATUS.VALID);
      } catch {
        if (active) setStatus(STATUS.UNAVAILABLE);
      }
    })();

    return () => {
      active = false;
    };
  }, [normalized, formatInvalid]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <SEO title={t("seo.certificate_verify.title")} description={t("seo.certificate_verify.desc")} />
      <section
        data-testid="certificate-verification"
        data-status={viewStatus}
        className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4"
      >
        <h1 className="text-xl font-bold text-[var(--theme-emphasis)]">
          {t("certificate_verify.title")}
        </h1>

        <p className="text-xs text-slate-500 break-all">
          {t("certificate_verify.number")}: <strong>{normalized || "—"}</strong>
        </p>

        {viewStatus === STATUS.LOADING && (
          <p data-testid="verify-loading" className="text-sm text-slate-500">
            {t("certificate_verify.loading")}
          </p>
        )}

        {viewStatus === STATUS.VALID && cert && (
          <div data-testid="verify-valid" className="space-y-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
              ✓ {t("certificate_verify.valid_title")}
            </p>
            <dl className="text-sm space-y-1.5">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t("certificate_verify.holder")}</dt>
                <dd className="font-medium text-slate-800 text-right">{cert.cert_name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t("certificate_verify.course")}</dt>
                <dd className="font-medium text-slate-800 text-right">
                  {t("certificate_verify.course_name")}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t("certificate_verify.score")}</dt>
                <dd className="font-medium text-slate-800 text-right">{cert.overall_score}%</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{t("certificate_verify.issued")}</dt>
                <dd className="font-medium text-slate-800 text-right">
                  {formatDate(cert.issued_at, locale)}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {viewStatus === STATUS.NOT_FOUND && (
          <p data-testid="verify-not-found" className="text-sm text-slate-600">
            {t("certificate_verify.not_found_desc")}
          </p>
        )}

        {viewStatus === STATUS.INVALID && (
          <p data-testid="verify-invalid" className="text-sm text-slate-600">
            {t("certificate_verify.invalid_desc")}
          </p>
        )}

        {viewStatus === STATUS.UNAVAILABLE && (
          <p data-testid="verify-unavailable" className="text-sm text-slate-600">
            {t("certificate_verify.unavailable_desc")}
          </p>
        )}

        <Link
          to="/"
          className="inline-block text-sm font-medium text-[var(--theme-primary)] hover:underline"
        >
          {t("certificate_verify.back_home")}
        </Link>
      </section>
    </main>
  );
}
