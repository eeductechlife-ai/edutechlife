import { useState, useEffect } from "react";
import { Shield, CheckCircle, Loader2, Copy, Check } from "lucide-react";
import { API_BASE_URL } from "../config/api";

/**
 * MFASetup — step-by-step TOTP enrollment wizard.
 * Requires the user to be logged in (passes Bearer token via sessionStorage).
 *
 * Steps:
 *   1. Fetch QR code from /api/auth/mfa/enroll
 *   2. User scans QR in their authenticator app
 *   3. User enters first code → /api/auth/mfa/verify-setup
 *   4. Success screen
 */
const MFASetup = ({ onDone }) => {
  const [step, setStep] = useState("loading"); // loading | scan | verify | done | error
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [secretHint, setSecretHint] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const token = () => sessionStorage.getItem("auth_token");

  useEffect(() => {
    const startEnroll = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/mfa/enroll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "No se pudo iniciar la configuración.");

        setQrDataUrl(data.qrDataUrl);
        // Extract secret from otpauth URI for manual entry fallback
        const match = data.otpauth?.match(/secret=([A-Z2-7]+)/i);
        if (match) setSecretHint(match[1]);
        setStep("scan");
      } catch (err) {
        setError(err.message);
        setStep("error");
      }
    };
    startEnroll();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    const trimmed = code.replace(/\s/g, "");
    if (trimmed.length !== 6) {
      setError("Ingresa los 6 dígitos del código.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/mfa/verify-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Código incorrecto.");
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secretHint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="text-sm text-gray-400">Preparando configuración MFA…</p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="space-y-4 py-4 text-center">
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={onDone}
          className="rounded-xl bg-white/10 px-6 py-2 text-sm text-white hover:bg-white/20"
        >
          Cerrar
        </button>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle className="h-14 w-14 text-green-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">¡MFA activado!</h3>
          <p className="mt-1 text-sm text-gray-400">
            Tu cuenta ahora requiere un código de autenticación al iniciar
            sesión.
          </p>
        </div>
        <button
          onClick={onDone}
          className="mt-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Listo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
          <Shield className="h-7 w-7 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Configurar autenticación de dos factores
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Escanea el código QR con Google Authenticator, Authy u otra
            aplicación compatible.
          </p>
        </div>
      </div>

      {/* QR Code */}
      {step === "scan" && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={qrDataUrl}
              alt="Código QR para autenticador"
              className="h-48 w-48 rounded-xl bg-white p-2"
            />
          </div>

          {secretHint && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="mb-1 text-xs text-gray-400">
                ¿No puedes escanear? Ingresa esta clave manual:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all text-xs font-mono text-gray-200">
                  {secretHint}
                </code>
                <button
                  type="button"
                  onClick={copySecret}
                  className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-white"
                  aria-label="Copiar clave"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep("verify")}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Ya lo escaneé — Continuar
          </button>
        </div>
      )}

      {/* Verify first code */}
      {step === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-center text-sm text-gray-400">
            Ingresa el código de 6 dígitos que muestra tu aplicación para
            confirmar la configuración.
          </p>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/[^0-9]/g, ""));
              setError("");
            }}
            placeholder="000000"
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoComplete="one-time-code"
          />

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Activar MFA"
            )}
          </button>

          <button
            type="button"
            onClick={() => setStep("scan")}
            className="w-full text-sm text-gray-400 hover:text-white"
          >
            Volver al QR
          </button>
        </form>
      )}
    </div>
  );
};

export default MFASetup;
