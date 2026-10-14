import { useEffect, useState } from "react";
import { School, Users, Activity, Loader2 } from "lucide-react";
import { fetchSchoolOverview } from "../../services/schoolApi";
import { useTranslation } from "../../i18n/I18nProvider";
import SEO from "../SEO";

const VAK_KEYS = {
  visual: "school.vak_visual",
  auditivo: "school.vak_auditory",
  kinestesico: "school.vak_kinesthetic",
  sin_diagnostico: "school.vak_none",
};

/**
 * Panel del rector (piloto de colegios): solo lectura y solo cifras por grupo.
 * No muestra nombres de estudiantes (datos de menores, Ley 1581).
 */
const SchoolOverviewPage = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    let alive = true;
    const token = sessionStorage.getItem("auth_token");
    fetchSchoolOverview(token).then((res) => {
      if (!alive) return;
      if (res.ok) setState({ status: "ready", data: res.data });
      else
        setState({
          status: res.status === 403 ? "forbidden" : "error",
          data: null,
        });
    });
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#004B63]">
        <Loader2
          className="w-6 h-6 animate-spin"
          aria-label={t("common.loading")}
        />
      </div>
    );
  }

  if (state.status !== "ready") {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <School
          className="w-10 h-10 mx-auto text-[#4DA8C4]"
          aria-hidden="true"
        />
        <h1 className="text-xl font-bold text-[#004B63] mt-4">
          {t("school.panel_title")}
        </h1>
        <p className="text-[#475569] mt-2">
          {state.status === "forbidden"
            ? t("school.panel_forbidden")
            : t("school.panel_error")}
        </p>
      </main>
    );
  }

  const { institution, total, activos7d, grupos, vak } = state.data;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <SEO
        title={t("school.panel_title")}
        description={t("school.panel_desc")}
        noindex
      />
      <p className="text-sm font-semibold text-[#4DA8C4]">
        {t("school.panel_title")}
      </p>
      <h1 className="text-2xl md:text-3xl font-bold text-[#004B63] mt-1">
        {institution.name}
      </h1>
      <p className="text-sm text-[#475569] mt-2">{t("school.panel_desc")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-sm text-[#475569] flex items-center gap-2">
            <Users className="w-4 h-4" aria-hidden="true" />{" "}
            {t("school.students_total")}
          </p>
          <p className="text-3xl font-bold text-[#004B63] mt-1">{total}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-sm text-[#475569] flex items-center gap-2">
            <Activity className="w-4 h-4" aria-hidden="true" />{" "}
            {t("school.students_active")}
          </p>
          <p className="text-3xl font-bold text-[#004B63] mt-1">{activos7d}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-[#004B63]">
          {t("school.groups_title")}
        </h2>
        {grupos.length === 0 ? (
          <p className="text-sm text-[#475569] mt-2">
            {t("school.groups_empty")}
          </p>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm bg-white border border-[#E2E8F0] rounded-xl">
              <thead>
                <tr className="text-left text-[#475569]">
                  <th scope="col" className="p-3">
                    {t("school.col_group")}
                  </th>
                  <th scope="col" className="p-3">
                    {t("school.col_students")}
                  </th>
                  <th scope="col" className="p-3">
                    {t("school.col_active")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {grupos.map((g) => (
                  <tr key={g.grupo} className="border-t border-[#E2E8F0]">
                    <td className="p-3 font-semibold text-[#004B63]">
                      {g.grupo}
                    </td>
                    <td className="p-3">{g.estudiantes}</td>
                    <td className="p-3">{g.activos7d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-[#004B63]">
          {t("school.vak_title")}
        </h2>
        <ul className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(VAK_KEYS).map(([style, key]) => (
            <li
              key={style}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4"
            >
              <p className="text-xs text-[#475569]">{t(key)}</p>
              <p className="text-xl font-bold text-[#004B63]">
                {vak?.[style] || 0}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default SchoolOverviewPage;
