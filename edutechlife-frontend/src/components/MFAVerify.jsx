import { useState, useRef, useEffect } from "react";
import { Shield, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config/api";

/**
 * MFAVerify — shown after a successful password login when the user has MFA enabled.
 * Calls POST /api/auth/mfa/verify-login and returns the real JWT on success.
 */
const MFAVerify = ({ mfaChallengeToken, onSuccess, onCancel }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = code.replace(/\s/g, "");
    if (trimmed.length !== 6) {
      setError("Ingresa los 6 dígitos de tu aplicación de autenticación.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/mfa/verify-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mfa_challenge_token: mfaChallengeToken,
          code: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Código inválido.");
      }

      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
          <Shield className="h-7 w-7 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Verificación en dos pasos
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Ingresa el código de tu aplicación de autenticación (Google
            Authenticator, Authy, etc.)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="sr-only" htmlFor="mfa-code">
            Código MFA
          </label>
          <input
            ref={inputRef}
            id="mfa-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9\s]*"
            maxLength={7}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/[^0-9]/g, ""));
              setError("");
            }}
            placeholder="000000"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoComplete="one-time-code"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full text-sm text-gray-400 hover:text-white"
        >
          Volver al inicio de sesión
        </button>
      </form>
    </div>
  );
};

export default MFAVerify;
