import { useState } from "react";
import PropTypes from "prop-types";
import { School, Check, Loader2 } from "lucide-react";
import { joinSchool } from "../../../../services/schoolApi";
import { useTranslation } from "../../../../i18n/I18nProvider";

/**
 * SchoolCodeCard
 * El padre escribe el código que le dio el colegio y el niño queda ligado a
 * su colegio y grupo, con Premium incluido. Si no hay código, no pasa nada.
 */
const SchoolCodeCard = ({ authToken, studentId }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !studentId) return;
    setStatus("sending");
    setMessage("");
    const res = await joinSchool(authToken, { studentId, code: code.trim() });
    if (res.ok) {
      setStatus("done");
      setMessage(
        t("school.code_success", {
          school: res.data?.institution?.name || t("school.your_school"),
        }),
      );
      return;
    }
    setStatus("error");
    if (res.status === 409) setMessage(t("school.code_already_linked"));
    else if (res.status === 400) setMessage(t("school.code_invalid"));
    else setMessage(res.error || t("school.code_failed"));
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-6">
      <h3 className="font-bold text-base text-[#004B63] flex items-center gap-2">
        <School className="w-4 h-4" aria-hidden="true" />
        {t("school.code_title")}
      </h3>
      <p className="text-sm text-[#475569] mt-1">{t("school.code_desc")}</p>

      {status === "done" ? (
        <p className="text-sm text-emerald-700 mt-3 flex items-center gap-2">
          <Check className="w-4 h-4" aria-hidden="true" />
          {message}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-3 flex flex-wrap gap-2">
          <label htmlFor="school-code" className="sr-only">
            {t("school.code_label")}
          </label>
          <input
            id="school-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={24}
            autoComplete="off"
            placeholder={t("school.code_placeholder")}
            className="flex-1 min-w-[10rem] border border-[#CBD5E1] rounded-lg px-3 py-2.5 text-sm tracking-widest uppercase"
          />
          <button
            type="submit"
            disabled={status === "sending" || !code.trim()}
            className="inline-flex items-center gap-2 bg-[#004B63] text-white font-bold text-sm px-4 py-2.5 rounded-lg disabled:opacity-60"
          >
            {status === "sending" && (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            )}
            {t("school.code_submit")}
          </button>
        </form>
      )}

      {status === "error" && message && (
        <p role="alert" className="text-sm text-red-700 mt-2">
          {message}
        </p>
      )}
    </div>
  );
};

SchoolCodeCard.propTypes = {
  authToken: PropTypes.string,
  studentId: PropTypes.string,
};

export default SchoolCodeCard;
