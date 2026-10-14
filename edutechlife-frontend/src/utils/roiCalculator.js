// Fórmula única y explícita de la calculadora de ROI de automatización.
//
//   costoActual      = costos operativos mensuales x 12
//   ahorroAnual      = costoActual x eficiencia x FACTOR_REALIZACION
//   costoConIA       = costoActual - ahorroAnual
//   inversion        = empleados x COSTO_POR_EMPLEADO + ingresos anuales x PORCENTAJE_INGRESOS
//   ROI (veces)      = (ahorroAnual - inversion) / inversion
//   payback (meses)  = inversion / ahorroAnual x 12
//
// Las horas manuales liberadas se reportan aparte (horas/año), no se
// monetizan, para que "Ahorro anual" y "Con automatización" cuadren.
export const FACTOR_REALIZACION = 0.6;
export const COSTO_POR_EMPLEADO = 1200;
export const PORCENTAJE_INGRESOS = 0.03;

export function calcularROI({
  ingresos,
  costosOperativos,
  empleados,
  horasManuales,
  eficiencia,
}) {
  const costoActual = costosOperativos * 12;
  const ahorroAnual = costoActual * (eficiencia / 100) * FACTOR_REALIZACION;
  const costoFuturo = costoActual - ahorroAnual;
  const inversion =
    empleados * COSTO_POR_EMPLEADO + ingresos * PORCENTAJE_INGRESOS;
  const roi = inversion > 0 ? (ahorroAnual - inversion) / inversion : 0;
  const payback = ahorroAnual > 0 ? (inversion / ahorroAnual) * 12 : 0;
  const productividadGanada =
    (horasManuales * empleados * 4 * 12 * eficiencia) / 100;

  return {
    inversion: Math.round(inversion),
    ahorroAnual: Math.round(ahorroAnual),
    roi: Math.round(roi * 10) / 10,
    payback: Math.round(payback * 10) / 10,
    productividadGanada: Math.round(productividadGanada),
    costoActual: Math.round(costoActual),
    costoFuturo: Math.round(costoFuturo),
  };
}

const copFmt = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});
const decFmt = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
const intFmt = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

export const formatCOP = (n) => copFmt.format(n ?? 0);
export const formatDecimal = (n) => decFmt.format(n ?? 0);
export const formatInt = (n) => intFmt.format(n ?? 0);
