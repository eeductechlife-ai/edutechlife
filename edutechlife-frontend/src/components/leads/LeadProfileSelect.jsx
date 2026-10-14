import { useTranslation } from "../../i18n/I18nProvider";

export const PERFILES = [
  "padre",
  "docente",
  "colegio",
  "empresa",
  "estudiante",
  "otro",
];

/**
 * Selector obligatorio «Soy: …» de los formularios de leads. Llena `perfil`.
 * Cada formulario pasa sus clases/estilos para que se vea como sus otros campos.
 */
export default function LeadProfileSelect({
  id,
  lead,
  labelClassName = "",
  labelStyle,
  selectClassName = "",
  selectStyle,
  opciones = PERFILES,
}) {
  const { t } = useTranslation();
  return (
    <div>
      <label htmlFor={id} className={labelClassName} style={labelStyle}>
        {t("leadForm.profile_label")}
      </label>
      <select
        id={id}
        name="perfil"
        required
        value={lead.perfil}
        onChange={(e) => lead.setPerfil(e.target.value)}
        className={selectClassName}
        style={selectStyle}
      >
        <option value="">{t("leadForm.profile_placeholder")}</option>
        {opciones.map((p) => (
          <option key={p} value={p}>
            {t(`leadForm.profile_${p}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
