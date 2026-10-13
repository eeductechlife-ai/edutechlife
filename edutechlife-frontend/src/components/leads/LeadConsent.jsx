import { lazy, Suspense, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "../../i18n/I18nProvider";

// La política existente (modal del footer), cargada solo si se abre.
const PoliticaPrivacidad = lazy(() =>
  Promise.all([
    import("../footer/modals/ModalPrivacidad"),
    import("../../data/footer/footerContent"),
  ]).then(([modal, data]) => ({
    default: ({ locale, onClose }) => (
      <modal.default
        onClose={onClose}
        content={data.getFooterContent(locale)}
      />
    ),
  })),
);

/**
 * Casilla obligatoria de autorización de datos (Ley 1581 de 2012), campo trampa
 * anti-spam y mensaje de error del envío. `lead` es el valor de useLeadSubmit.
 */
export default function LeadConsent({ id, lead, dark = false }) {
  const { t, locale } = useTranslation();
  const [verPolitica, setVerPolitica] = useState(false);
  const tono = dark ? "text-white/80" : "text-gray-600";

  return (
    <div className="space-y-2">
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          No llenar
          <input
            type="text"
            name="sitio_web"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>
      <div className={`flex items-start gap-2 text-xs leading-snug ${tono}`}>
        <input
          id={id}
          type="checkbox"
          checked={lead.consent}
          onChange={(e) => lead.setConsent(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#004B63]"
        />
        <p>
          <label htmlFor={id}>{t("leadForm.consent_text")}</label>{" "}
          <button
            type="button"
            onClick={() => setVerPolitica(true)}
            className="inline p-0 text-left align-baseline font-semibold underline"
          >
            {t("leadForm.consent_link")}
          </button>
          .
        </p>
      </div>
      {lead.errorCode && (
        <p
          role="alert"
          className={`text-xs font-medium ${dark ? "text-red-200" : "text-red-600"}`}
        >
          {t(`leadForm.error_${lead.errorCode}`)}
        </p>
      )}
      {verPolitica &&
        createPortal(
          <div style={{ position: "relative", zIndex: 10050 }}>
            <Suspense fallback={null}>
              <PoliticaPrivacidad
                locale={locale}
                onClose={() => setVerPolitica(false)}
              />
            </Suspense>
          </div>,
          document.body,
        )}
    </div>
  );
}
