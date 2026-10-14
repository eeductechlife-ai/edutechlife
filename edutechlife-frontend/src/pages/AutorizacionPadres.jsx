import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL as API_BASE } from "../config/api";

const MOTIVOS = {
  invalido: "Este enlace no es válido.",
  vencido:
    "Este enlace venció. Pide a tu hijo o hija que envíe una nueva solicitud.",
  usado: "Este enlace ya fue usado. La autorización ya está registrada.",
  version:
    "La política cambió desde que abriste el enlace. Recarga la página para leerla de nuevo.",
};

const CASILLAS = [
  {
    clave: "aceptaPolitica",
    texto: "Leí la política de tratamiento de datos.",
  },
  { clave: "aceptaTerminos", texto: "Leí y acepto los términos de uso." },
  {
    clave: "autorizaTratamiento",
    texto:
      "Autorizo a Edutechlife a tratar los datos personales de mi hijo o hija para usar IngenIA, según la Ley 1581 de 2012.",
  },
];

/**
 * Página pública del enlace del correo para padres y madres. No requiere
 * sesión: el token de un solo uso es la credencial. Registra fecha, versión
 * de la política e IP como registro de consentimiento.
 */
const AutorizacionPadres = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [fase, setFase] = useState(token ? "cargando" : "error"); // cargando | lista | enviando | hecha | error
  const [motivo, setMotivo] = useState(token ? "" : "invalido");
  const [version, setVersion] = useState("");
  const [aceptos, setAceptos] = useState({
    aceptaPolitica: false,
    aceptaTerminos: false,
    autorizaTratamiento: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return undefined; // sin token, el estado inicial ya muestra el error
    let cancelado = false;
    fetch(
      `${API_BASE}/api/ingenia/authorization/preview?token=${encodeURIComponent(token)}`,
    )
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("preview")),
      )
      .then((data) => {
        if (cancelado) return;
        if (data.valida) {
          setVersion(data.versionPolitica);
          setFase("lista");
        } else {
          setMotivo(data.motivo || "invalido");
          setFase("error");
        }
      })
      .catch(() => {
        if (!cancelado) {
          setError(
            "No pudimos validar el enlace. Intenta de nuevo en unos minutos.",
          );
          setFase("error");
        }
      });
    return () => {
      cancelado = true;
    };
  }, [token]);

  const todosAceptados = CASILLAS.every((c) => aceptos[c.clave]);

  const confirmar = async (e) => {
    e.preventDefault();
    if (!todosAceptados) return;
    setFase("enviando");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/ingenia/authorization/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, versionPolitica: version, ...aceptos }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setFase("hecha");
      } else if (res.status === 409) {
        setMotivo(data.motivo || "invalido");
        setFase("error");
      } else {
        setError(
          data.error ||
            "No pudimos registrar la autorización. Intenta de nuevo.",
        );
        setFase("lista");
      }
    } catch {
      setError("No pudimos registrar la autorización. Intenta de nuevo.");
      setFase("lista");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <section
        aria-labelledby="autorizacion-titulo"
        className="max-w-xl w-full bg-white rounded-2xl shadow-sm p-6 sm:p-8"
      >
        <h1
          id="autorizacion-titulo"
          className="text-2xl font-bold text-[#072F46] mb-4"
        >
          Autorización para tu hijo o hija en IngenIA
        </h1>

        {fase === "cargando" && (
          <p className="text-slate-600">Validando el enlace…</p>
        )}

        {fase === "error" && (
          <p role="alert" className="text-slate-700 leading-relaxed">
            {error || MOTIVOS[motivo] || MOTIVOS.invalido}
          </p>
        )}

        {fase === "hecha" && (
          <p role="status" className="text-slate-700 leading-relaxed">
            Gracias. Registramos tu autorización y tu hijo o hija ya puede usar
            IngenIA.
          </p>
        )}

        {(fase === "lista" || fase === "enviando") && (
          <form onSubmit={confirmar} className="space-y-5">
            <p className="text-slate-600 leading-relaxed">
              Tu hijo o hija quiere usar IngenIA. Antes de autorizar, lee la{" "}
              <a
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004B63] underline"
              >
                política de datos
              </a>{" "}
              y los{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004B63] underline"
              >
                términos de uso
              </a>
              .
            </p>

            <fieldset className="space-y-3">
              <legend className="sr-only">Autorizaciones</legend>
              {CASILLAS.map((c) => (
                <label
                  key={c.clave}
                  className="flex gap-3 items-start text-slate-700 cursor-pointer min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 shrink-0"
                    checked={aceptos[c.clave]}
                    onChange={(ev) =>
                      setAceptos((prev) => ({
                        ...prev,
                        [c.clave]: ev.target.checked,
                      }))
                    }
                  />
                  <span>{c.texto}</span>
                </label>
              ))}
            </fieldset>

            <p className="text-sm text-slate-500 leading-relaxed">
              Guardamos la fecha, la versión de la política que aceptas y tu
              dirección IP como registro de tu consentimiento. Puedes revocar
              esta autorización cuando quieras.
            </p>

            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!todosAceptados || fase === "enviando"}
              className="w-full min-h-[44px] rounded-lg bg-[#004B63] px-6 py-3 font-semibold text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#199DB9]"
            >
              {fase === "enviando" ? "Registrando…" : "Autorizar"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default AutorizacionPadres;
