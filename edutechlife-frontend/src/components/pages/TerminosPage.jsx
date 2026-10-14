import SEO from "../SEO";
import { useTranslation } from "../../i18n/I18nProvider";
import TERMINOS_ES from "../../data/legal/terminos-es.md?raw";

const PRIMARY = "#004B63";
const TEXT = "#374151";

// Los términos están aprobados solo en español: el texto legal no se traduce.
const NOTA_IDIOMA = {
  en: "Note: this document is only available in Spanish. The Spanish version is the current and binding text.",
  pt: "Nota: este documento está disponível apenas em espanhol. A versão em espanhol é o texto vigente e válido.",
};

// Convierte el texto aprobado (títulos ##, listas - y párrafos) en bloques.
function leerBloques(texto) {
  const bloques = [];
  let lista = null;
  for (const linea of texto.split(/\r?\n/).map((l) => l.trim())) {
    if (!linea) {
      lista = null;
      continue;
    }
    if (linea.startsWith("- ")) {
      if (!lista) {
        lista = [];
        bloques.push({ tipo: "ul", items: lista });
      }
      lista.push(linea.slice(2));
      continue;
    }
    lista = null;
    if (linea.startsWith("# "))
      bloques.push({ tipo: "h1", texto: linea.slice(2) });
    else if (linea.startsWith("## "))
      bloques.push({ tipo: "h2", texto: linea.slice(3) });
    else bloques.push({ tipo: "p", texto: linea });
  }
  return bloques;
}

const BLOQUES = leerBloques(TERMINOS_ES);

// Página pública de los Términos y Condiciones (URL /terms).
export default function TerminosPage() {
  const { locale } = useTranslation();
  const nota = NOTA_IDIOMA[locale];

  return (
    <>
      <SEO
        title="Términos y Condiciones"
        description="Términos y condiciones de suscripción y compra de Edutechlife."
      />
      <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 md:py-16">
        <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 md:p-10 shadow-sm space-y-4">
          {nota && (
            <p
              role="note"
              className="rounded-xl bg-[#E8F4F8] p-3 text-sm"
              style={{ color: PRIMARY }}
            >
              {nota}
            </p>
          )}
          {BLOQUES.map((b, i) => {
            if (b.tipo === "h1") {
              return (
                <h1
                  key={i}
                  className="text-xl md:text-2xl font-bold pt-2"
                  style={{ color: PRIMARY }}
                >
                  {b.texto}
                </h1>
              );
            }
            if (b.tipo === "h2") {
              return (
                <h2
                  key={i}
                  className="text-lg font-bold pt-4"
                  style={{ color: PRIMARY }}
                >
                  {b.texto}
                </h2>
              );
            }
            if (b.tipo === "ul") {
              return (
                <ul
                  key={i}
                  className="list-disc space-y-2 pl-6"
                  style={{ color: TEXT }}
                >
                  {b.items.map((item, ii) => (
                    <li key={ii} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="leading-relaxed" style={{ color: TEXT }}>
                {b.texto}
              </p>
            );
          })}
        </article>
      </main>
    </>
  );
}
