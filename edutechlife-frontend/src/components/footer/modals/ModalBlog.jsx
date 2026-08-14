import { useState } from "react";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";
import useFocusTrap from "../../../hooks/useFocusTrap";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

const footerWhiteText = { color: "#FFFFFF" };
const footerPrimaryText = { color: "#004B63" };
const footerDarkText = { color: "#374151" };
const footerMutedText = { color: "#6B7280" };
const footerAccentText = { color: "#4DA8C4" };
const footerLightBg = { backgroundColor: "#F3F9FB" };
const footerLighterBg = { backgroundColor: "#E8F4F8" };
const footerLogoInvert = { filter: "brightness(0) invert(1)" };
const footerPrimaryButton = { backgroundColor: "#004B63", color: "#FFFFFF" };

export default function ModalBlog({ onClose, content }) {
  const { t, locale } = useTranslation();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const blogArticles = content.blogArticles;
  const blogArticleContents = content.blogArticleContents;

  const focusTrapRef = useFocusTrap(true);
  useBodyScrollLock(true);

  if (selectedArticle) {
    const article = blogArticleContents[selectedArticle];
    if (!article) return null;

    return (
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("footer.blog")}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4"
        onClick={() => setSelectedArticle(null)}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
            style={{ backgroundColor: "#004B63", borderColor: "#003d52" }}
          >
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-edutechlife.webp"
                alt="Edutechlife"
                className="h-8 w-auto"
                style={footerLogoInvert}
              />
              <span className="text-white font-medium text-sm">
                {t("footer.blog")}
              </span>
            </div>
            <button
              onClick={() => setSelectedArticle(null)}
              aria-label="Cerrar"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
              style={footerWhiteText}
            >
              <Icon name="fa-xmark" className="text-lg" />
            </button>
          </div>

          <div className="relative h-56 md:h-72 overflow-hidden">
            <img
              src={article.imagen}
              alt={article.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                style={{ backgroundColor: "#4DA8C4", color: "#FFFFFF" }}
              >
                {blogArticles.find((a) => a.id === selectedArticle)?.categoria}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {article.titulo}
              </h1>
            </div>
          </div>

          <div
            className="px-6 py-4 flex flex-wrap items-center gap-4 text-sm"
            style={{ backgroundColor: "#F8FAFC" }}
          >
            <div className="flex items-center gap-2">
              <Icon
                name="fa-user"
                className="text-sm"
                style={footerAccentText}
              />
              <span style={footerDarkText}>
                {blogArticles.find((a) => a.id === selectedArticle)?.autor}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                name="fa-calendar"
                className="text-sm"
                style={footerAccentText}
              />
              <span style={footerDarkText}>
                {blogArticles.find((a) => a.id === selectedArticle)?.fecha}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                name="fa-clock"
                className="text-sm"
                style={footerAccentText}
              />
              <span style={footerDarkText}>
                {
                  blogArticles.find((a) => a.id === selectedArticle)
                    ?.tiempoLectura
                }
              </span>
            </div>
          </div>

          <div className="px-6 md:px-10 py-6 space-y-8">
            <p className="text-lg leading-relaxed" style={{ color: "#1F2937" }}>
              {article.introduccion}
            </p>
            {article.secciones.map((seccion, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold" style={footerPrimaryText}>
                  {seccion.titulo}
                </h2>
                <p className="text-base leading-relaxed" style={footerDarkText}>
                  {seccion.contenido}
                </p>
                {seccion.lista && (
                  <ul className="space-y-2 ml-4">
                    {seccion.lista.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: "#4DA8C4" }}
                        />
                        <span style={footerDarkText}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {seccion.imagen && (
                  <img
                    src={seccion.imagen}
                    alt={seccion.titulo}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
                {seccion.grafica === "linea" &&
                  renderLineChart(
                    seccion,
                    footerPrimaryText,
                    footerMutedText,
                    footerLightBg,
                  )}
                {seccion.grafica === "barras" &&
                  renderBarChart(
                    seccion,
                    footerPrimaryText,
                    footerDarkText,
                    footerLightBg,
                  )}
                {seccion.grafica === "dona" &&
                  renderDonutChart(seccion, footerDarkText, footerLightBg)}
              </div>
            ))}
            <div className="p-6 rounded-xl" style={footerLighterBg}>
              <h3 className="font-bold text-lg mb-2" style={footerPrimaryText}>
                Conclusión
              </h3>
              <p className="text-base leading-relaxed" style={footerDarkText}>
                {article.conclusion}
              </p>
            </div>
          </div>

          <div
            className="px-6 py-4 border-t flex items-center justify-between"
            style={{ borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" }}
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/logo-edutechlife.webp"
                alt="Edutechlife"
                className="h-6 w-auto"
                style={footerLogoInvert}
              />
              <span className="text-sm" style={footerMutedText}>
                {t("footer.blog")}
              </span>
            </div>
            <button
              onClick={() => setSelectedArticle(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={footerPrimaryButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#003d52")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#004B63")
              }
            >
              {
                {
                  en: "Back to blog",
                  pt: "Voltar ao blog",
                  es: "Volver al blog",
                }[locale]
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={focusTrapRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("footer.blog")}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          style={footerPrimaryText}
        >
          <Icon name="fa-xmark" className="text-xl" />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#004B63" }}
          >
            <Icon
              name="fa-book-open"
              className="text-2xl"
              style={footerWhiteText}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={footerPrimaryText}>
              {t("footer.blog")}
            </h2>
            <p className="text-sm" style={footerAccentText}>
              {content.blogSubtitle}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">
            {content.blogIntro}
          </p>
          {blogArticles.map((articulo, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer"
              style={{ borderColor: "#E8F4F8", backgroundColor: "#FAFDFF" }}
              onClick={() => setSelectedArticle(articulo.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: "#E8F4F8", color: "#004B63" }}
                >
                  {articulo.categoria}
                </span>
                <span className="text-xs text-gray-500">{articulo.fecha}</span>
              </div>
              <h3 className="font-semibold" style={footerPrimaryText}>
                {articulo.titulo}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span>{articulo.autor}</span>
                <span>•</span>
                <span>{articulo.tiempoLectura}</span>
              </div>
            </div>
          ))}
          <div className="mt-6 text-center">
            <button
              className="px-6 py-3 rounded-xl font-semibold transition-all"
              style={footerPrimaryButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#003d52")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#004B63")
              }
            >
              {
                {
                  en: "View all articles",
                  pt: "Ver todos os artigos",
                  es: "Ver todos los artículos",
                }[locale]
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderLineChart(seccion) {
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F3F9FB" }}>
      <h4 className="text-sm font-semibold mb-4" style={{ color: "#004B63" }}>
        Evolución {seccion.unidad}
      </h4>
      <div className="flex items-end justify-between h-40 gap-2">
        {seccion.datos.map((d, i) => {
          const max = Math.max(
            ...seccion.datos.map((x) => x.valor || x.antes || x.despues),
          );
          const h = ((d.valor || d.antes || d.despues) / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${h}%`,
                  backgroundColor:
                    i === seccion.datos.length - 1 ? "#004B63" : "#4DA8C4",
                }}
              />
              <span className="text-xs mt-2" style={{ color: "#6B7280" }}>
                {d.anio}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderBarChart(seccion) {
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F3F9FB" }}>
      <h4 className="text-sm font-semibold mb-4" style={{ color: "#004B63" }}>
        {seccion.unidad}
      </h4>
      <div className="space-y-3">
        {seccion.datos.map((d, i) => {
          const max = Math.max(
            ...seccion.datos.map(
              (x) => x.valor || x.mejora || x.despues || 100,
            ),
          );
          const val = d.valor || d.mejora || d.despues || 0;
          const pct = (val / max) * 100;
          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: "#374151" }}>{d.categoria}</span>
                <span className="font-semibold" style={{ color: "#004B63" }}>
                  {val}
                  {seccion.unidad.includes("%") ? "%" : ""}
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: "#E5E7EB" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: "#4DA8C4" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderDonutChart(seccion) {
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: "#F3F9FB" }}>
      <h4 className="text-sm font-semibold mb-4" style={{ color: "#004B63" }}>
        Distribución
      </h4>
      <div className="flex items-center justify-center gap-6">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {(() => {
              const colors = ["#004B63", "#4DA8C4", "#66CCCC"];
              let cumulative = 0;
              return seccion.datos.map((d, i) => {
                const pct = d.valor / 100;
                const dash = pct * 100;
                const color = colors[i % colors.length];
                const start = cumulative * 100;
                cumulative += pct;
                return (
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${100 - dash}`}
                    strokeDashoffset={`${-start}`}
                  />
                );
              });
            })()}
          </svg>
        </div>
        <div className="space-y-2">
          {seccion.datos.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#004B63", "#4DA8C4", "#66CCCC", "#88D4E5"][
                    i
                  ],
                }}
              />
              <span style={{ color: "#374151" }}>
                {d.nombre}: {d.valor}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
