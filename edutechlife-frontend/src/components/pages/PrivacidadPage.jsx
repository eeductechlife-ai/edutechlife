import SEO from "../SEO";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";
import { getFooterContent } from "../../data/footer/footerContent";

const PRIMARY = "#004B63";
const ACCENT = "#4DA8C4";
const TEXT = "#374151";

// Página pública de la política de privacidad (URL /privacidad).
// Usa el mismo contenido legal que el modal del pie de página (legal.js).
export default function PrivacidadPage() {
  const { t, locale } = useTranslation();
  const { privacyContent: c } = getFooterContent(locale);
  const title = t("footer.privacy");

  return (
    <>
      <SEO title={title} description={c.sections[0].content} />
      <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 md:py-16">
        <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 md:p-10 shadow-sm">
          <header className="mb-8 text-center">
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: PRIMARY }}
            >
              {title}
            </h1>
            <p className="mt-2 text-sm" style={{ color: ACCENT }}>
              {c.lastUpdate}
            </p>
          </header>

          <div className="space-y-6">
            {c.sections.map((section, si) => (
              <section key={si} className="space-y-3">
                <h2 className="text-lg font-bold" style={{ color: PRIMARY }}>
                  {section.title}
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: TEXT }}
                >
                  {section.content}
                </p>
                {section.items && (
                  <ul className="space-y-2 ml-4">
                    {section.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2">
                        <Icon
                          name="fa-check"
                          className="text-sm mt-1"
                          style={{ color: ACCENT }}
                        />
                        <span style={{ color: TEXT }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.uses && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.uses.map((use, ui) => (
                      <div key={ui} className="p-4 rounded-xl bg-[#F3F9FB]">
                        <h3
                          className="font-semibold mb-2"
                          style={{ color: PRIMARY }}
                        >
                          {use.title}
                        </h3>
                        <p className="text-sm" style={{ color: TEXT }}>
                          {use.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {section.security && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {section.security.map((item, ii) => (
                      <div
                        key={ii}
                        className="p-3 rounded-xl text-center bg-[#E8F4F8]"
                      >
                        <Icon
                          name={item.icon}
                          className="text-xl mb-2"
                          style={{ color: PRIMARY }}
                        />
                        <p className="text-xs" style={{ color: TEXT }}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
