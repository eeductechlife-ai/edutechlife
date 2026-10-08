import { useCallback, useState } from "react";
import { signOutUser } from "./useAuthIdentity";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/** Palabra que la persona escribe para confirmar el borrado. */
export const DELETE_CONFIRM_WORD = "BORRAR";

export const isDeleteConfirmed = (text) =>
  String(text || "")
    .trim()
    .toUpperCase() === DELETE_CONFIRM_WORD;

const getToken = () => {
  try {
    return sessionStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
};

const getEmail = () => {
  try {
    return localStorage.getItem("user_email") || "";
  } catch {
    return "";
  }
};

async function errorMessage(res, fallback) {
  const body = await res.json().catch(() => ({}));
  return body?.error || fallback;
}

/**
 * Controles de «Mis datos» (Ley 1581 y COPPA): descargar, borrar y cambiar la
 * contraseña. Cada acción tiene su propio estado { status, message } con
 * status: "idle" | "working" | "done" | "error".
 */
export function useAccountData({ navigate } = {}) {
  const idle = { status: "idle", message: "" };
  const [download, setDownload] = useState(idle);
  const [removal, setRemoval] = useState(idle);
  const [password, setPassword] = useState(idle);

  const downloadData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setDownload({
        status: "error",
        message: "Tu sesión terminó. Vuelve a entrar para descargar tus datos.",
      });
      return false;
    }
    setDownload({ status: "working", message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/ingenia/export-user-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(
          await errorMessage(res, "No pudimos preparar tus datos."),
        );
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ingenia-mis-datos.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDownload({
        status: "done",
        message: "Listo: se descargó el archivo con tus datos.",
      });
      return true;
    } catch (e) {
      setDownload({
        status: "error",
        message:
          e?.message || "No pudimos preparar tus datos. Intenta otra vez.",
      });
      return false;
    }
  }, []);

  const deleteData = useCallback(
    async (typedWord) => {
      // Defensa en profundidad: aunque la pantalla ya lo exige, el borrado
      // nunca se manda sin la palabra de confirmación.
      if (!isDeleteConfirmed(typedWord)) return false;
      const token = getToken();
      if (!token) {
        setRemoval({
          status: "error",
          message: "Tu sesión terminó. Vuelve a entrar para borrar tus datos.",
        });
        return false;
      }
      setRemoval({ status: "working", message: "" });
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/ingenia/delete-user-data`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) {
          throw new Error(
            await errorMessage(
              res,
              "No pudimos borrar todos tus datos. Intenta otra vez o escribe a soporte.",
            ),
          );
        }
        setRemoval({ status: "done", message: "Tus datos se borraron." });
        // Sin datos no hay sesión que mantener: se cierra y se limpia el navegador.
        await signOutUser("/login", navigate);
        return true;
      } catch (e) {
        setRemoval({
          status: "error",
          message:
            e?.message ||
            "No pudimos borrar todos tus datos. Intenta otra vez o escribe a soporte.",
        });
        return false;
      }
    },
    [navigate],
  );

  const sendPasswordEmail = useCallback(async () => {
    const email = getEmail();
    if (!email) {
      setPassword({
        status: "error",
        message:
          "No encontramos tu correo. Cierra sesión y vuelve a entrar para cambiar la contraseña.",
      });
      return false;
    }
    setPassword({ status: "working", message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        throw new Error(
          await errorMessage(
            res,
            "No pudimos enviar el correo. Intenta otra vez.",
          ),
        );
      }
      setPassword({
        status: "done",
        message: `Te enviamos un correo a ${email} para elegir una contraseña nueva.`,
      });
      return true;
    } catch (e) {
      setPassword({
        status: "error",
        message: e?.message || "No pudimos enviar el correo. Intenta otra vez.",
      });
      return false;
    }
  }, []);

  return {
    download,
    removal,
    password,
    downloadData,
    deleteData,
    sendPasswordEmail,
  };
}
