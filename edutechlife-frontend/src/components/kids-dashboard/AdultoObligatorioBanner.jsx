import { useEffect, useState } from "react";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { API_BASE_URL as API_BASE } from "../../config/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Aviso para estudiantes menores que ya tenían cuenta y no tienen adulto
 * vinculado. No bloquea nada: el estudiante puede seguir usando IngenIA.
 * Solo se envía correo al adulto que el propio estudiante registra.
 */
const AdultoObligatorioBanner = () => {
  const { token, isLoaded, isSignedIn } = useAuthIdentity();
  const [mostrar, setMostrar] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState({
    edad: "",
    email: "",
    nombre: "",
    confirma: false,
  });
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !token) return;
    let cancelado = false;
    fetch(`${API_BASE}/api/auth/adulto-menor/estado`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelado && data?.mostrarAviso) setMostrar(true);
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, [isLoaded, isSignedIn, token]);

  if (!mostrar) return null;

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    const anios = Number(form.edad);
    if (
      form.edad === "" ||
      !Number.isInteger(anios) ||
      anios < 6 ||
      anios > 16
    ) {
      setError(
        "Escribe tu edad real: IngenIA es para estudiantes de 6 a 16 años.",
      );
      return;
    }
    const correo = form.email.trim().toLowerCase();
    if (!EMAIL_RE.test(correo)) {
      setError("Escribe un correo válido del adulto.");
      return;
    }
    if (form.nombre.trim().length < 3) {
      setError("Escribe el nombre del adulto.");
      return;
    }
    if (!form.confirma) {
      setError(
        "Confirma que eres mayor de 18 años y padre, madre o acudiente de este menor.",
      );
      return;
    }
    setEstado("enviando");
    try {
      const res = await fetch(`${API_BASE}/api/auth/adulto-menor/invitar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          edad: anios,
          adulto: {
            email: correo,
            nombre: form.nombre.trim(),
            confirmaMayorDeEdad: form.confirma,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEstado("");
        setError(data.error || "No se pudo enviar la invitación.");
        return;
      }
      setEstado("enviado");
    } catch {
      setEstado("");
      setError("No se pudo enviar la invitación. Intenta de nuevo.");
    }
  };

  return (
    <aside
      className="mx-4 my-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-[#00374A]"
      aria-label="Aviso de adulto responsable"
    >
      <p className="font-semibold">Registra a tu padre, madre o acudiente</p>
      <p className="text-sm mt-1">
        Para seguir usando IngenIA con tu cuenta, tu padre, madre o acudiente
        debe quedar vinculado. Puedes seguir usando la plataforma mientras
        tanto.
      </p>

      {estado === "enviado" ? (
        <p className="text-sm mt-3" role="status">
          Enviamos la invitación al correo que registraste.
        </p>
      ) : !abierto ? (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="mt-3 text-sm font-semibold underline"
        >
          Registrar a mi adulto
        </button>
      ) : (
        <form
          onSubmit={enviar}
          noValidate
          className="mt-3 flex flex-col gap-2 text-sm"
        >
          <label className="flex flex-col gap-1">
            Tu edad (de 6 a 16 años)
            <input
              type="number"
              min="6"
              max="16"
              value={form.edad}
              onChange={(e) => setForm({ ...form, edad: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            Correo del padre, madre o acudiente
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            Nombre del padre, madre o acudiente
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={form.confirma}
              onChange={(e) => setForm({ ...form, confirma: e.target.checked })}
              className="mt-1"
            />
            <span>
              Soy mayor de 18 años y soy padre, madre o acudiente de este menor.
            </span>
          </label>
          {error && (
            <p className="text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={estado === "enviando"}
            className="self-start bg-[#004B63] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            {estado === "enviando" ? "Enviando…" : "Enviar invitación"}
          </button>
        </form>
      )}
    </aside>
  );
};

export default AdultoObligatorioBanner;
