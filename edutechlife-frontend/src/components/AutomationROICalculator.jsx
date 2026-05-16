import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const AutomationROICalculator = ({ onGeneratePlan }) => {
  const [inputs, setInputs] = useState({
    ingresos: 500000,
    costosOperativos: 40000,
    empleados: 50,
    horasManuales: 25,
    eficiencia: 40,
  });

  const update = (field, value) => setInputs(prev => ({ ...prev, [field]: value }));

  const results = useMemo(() => {
    const costoAnualOperativo = inputs.costosOperativos * 12;
    const ahorroPotencial = costoAnualOperativo * (inputs.eficiencia / 100) * 0.7;
    const inversion = inputs.empleados * 1200 + inputs.ingresos * 0.03;
    const ahorroAnual = ahorroPotencial + (inputs.horasManuales * inputs.empleados * 40 * 12 * 0.5);
    const roi = ahorroAnual > 0 ? (ahorroAnual - inversion) / inversion : 0;
    const payback = ahorroAnual > 0 ? inversion / ahorroAnual : 0;
    const productividadGanada = (inputs.horasManuales * inputs.empleados * 4 * 12 * inputs.eficiencia) / 100;

    return {
      inversion: Math.round(inversion),
      ahorroAnual: Math.round(ahorroAnual),
      roi: Math.round(roi * 10) / 10,
      payback: Math.round(payback * 10) / 10,
      productividadGanada: Math.round(productividadGanada),
      costoActual: costoAnualOperativo,
      costoFuturo: Math.round(costoAnualOperativo * (1 - inputs.eficiencia / 100 * 0.6)),
    };
  }, [inputs]);

  const Slider = ({ label, value, min, max, step, unit, field, color = '#4DA8C4' }) => (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-600">{label}</label>
        <span className="text-sm font-bold text-[#004B63]">
          {value.toLocaleString()}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => update(field, parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(90deg, ${color} ${((value - min) / (max - min)) * 100}%, #E2E8F0 ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${color};
          cursor: pointer;
          box-shadow: 0 2px 8px ${color}40;
          border: 3px solid white;
        }
        input[type=range]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${color};
          cursor: pointer;
          border: 3px solid white;
        }
      `}</style>
    </div>
  );

  const MetricCard = ({ label, value, sub, color, icon, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
          <svg className="w-5 h-5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-black" style={{ color }}>
        ${value?.toLocaleString()}
      </div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
          <h3 className="text-lg font-bold text-[#004B63] mb-6">Datos de tu Empresa</h3>

          <Slider label="Ingresos Anuales" value={inputs.ingresos} min={100000} max={5000000} step={10000} unit="" field="ingresos" />
          <Slider label="Costos Operativos/mes" value={inputs.costosOperativos} min={5000} max={200000} step={1000} unit="" field="costosOperativos" color="#66CCCC" />
          <Slider label="Empleados" value={inputs.empleados} min={5} max={500} step={1} unit="" field="empleados" color="#004B63" />
          <Slider label="Horas manuales/semana/persona" value={inputs.horasManuales} min={5} max={60} step={1} unit="h" field="horasManuales" color="#4DA8C4" />
          <Slider label="Eficiencia esperada con IA" value={inputs.eficiencia} min={10} max={80} step={5} unit="%" field="eficiencia" color="#10B981" />

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
              <svg className="w-4 h-4 text-[#4DA8C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Los cálculos se basan en estándares de industria y casos reales de automatización.
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <MetricCard label="Inversión" value={results.inversion} color="#4DA8C4" delay={0} icon="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <MetricCard label="Ahorro Anual" value={results.ahorroAnual} color="#10B981" delay={0.1} icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <MetricCard label="ROI" value={results.roi} sub={`${results.roi}x de retorno`} color="#004B63" delay={0.2} icon="M13 10V3L4 14h7v7l9-11h-7z" />
            <MetricCard label="Payback" value={results.payback} sub="meses" color="#66CCCC" delay={0.3} icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="text-sm font-bold text-[#004B63] mb-4">Comparativa Antes vs Después</h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Costo Operativo Anual</span>
                  <span className="font-semibold text-[#004B63]">${results.costoActual?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="h-full rounded-full bg-[#4DA8C4]" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Con Automatización IA</span>
                  <span className="font-semibold text-[#10B981]">${results.costoFuturo?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(results.costoFuturo / results.costoActual) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Productividad recuperada:</span>
                <span className="text-sm font-bold text-[#10B981]">{results.productividadGanada?.toLocaleString()} hrs/año</span>
              </div>
            </div>

            <button
              onClick={() => onGeneratePlan?.(results)}
              className="w-full mt-5 px-5 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Generar Plan con estos Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationROICalculator;
