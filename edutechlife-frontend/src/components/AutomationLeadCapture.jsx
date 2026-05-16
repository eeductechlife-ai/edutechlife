import { useState } from 'react';
import { motion } from 'framer-motion';

const AutomationLeadCapture = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', empresa: '', sector: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email) return;
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-gradient-to-br from-[#004B63] to-[#0A3550] rounded-3xl p-10 md:p-14 text-center text-white shadow-xl"
      >
        <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-2xl font-black mb-3">¡Solicitud Enviada!</h3>
        <p className="text-white/80 max-w-md mx-auto">
          Un especialista en automatización se comunicará contigo en las próximas 24 horas
          para agendar tu consultoría gratuita.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-[#004B63] to-[#0A3550] rounded-3xl overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-5">
          <div className="md:col-span-2 p-8 md:p-10 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#66CCCC] animate-pulse" />
                CONSULTORÍA GRATUITA
              </div>
              <h3 className="text-2xl font-black mb-3">
                ¿Listo para Automatizar tu Empresa?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Recibí un plan de automatización personalizado con análisis de estándares
                internacionales, proyección de ROI y roadmap de implementación.
              </p>
              <ul className="space-y-3">
                {[
                  'Diagnóstico de madurez digital gratuito',
                  'Plan de automatización a medida',
                  'ROI proyectado y payback estimado',
                  'Arquitectura recomendada con estándares ISO',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <svg className="w-5 h-5 text-[#66CCCC] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((a) => (
                    <div key={a} className="w-8 h-8 rounded-full bg-white/20 border-2 border-[#004B63] flex items-center justify-center text-[10px] font-bold">
                      {['JD', 'MA', 'CR'][a - 1]}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-white/60">
                  <span className="font-semibold text-white">+50 empresas</span> ya transformadas
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 bg-white p-8 md:p-10">
            <h4 className="text-lg font-bold text-[#004B63] mb-6">Solicitar Consultoría</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre completo</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#004B63] placeholder:text-slate-300 focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/10 transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email corporativo</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#004B63] placeholder:text-slate-300 focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/10 transition-all"
                    placeholder="correo@empresa.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Teléfono</label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#004B63] placeholder:text-slate-300 focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/10 transition-all"
                    placeholder="+57 300 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Empresa</label>
                  <input
                    type="text"
                    value={form.empresa}
                    onChange={(e) => setForm(f => ({ ...f, empresa: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#004B63] placeholder:text-slate-300 focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/10 transition-all"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sector</label>
                <select
                  value={form.sector}
                  onChange={(e) => setForm(f => ({ ...f, sector: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#004B63] focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/10 transition-all"
                >
                  <option value="">Seleccionar...</option>
                  <option value="retail">Retail / Comercio</option>
                  <option value="logistica">Logística / Transporte</option>
                  <option value="salud">Salud / Clínicas</option>
                  <option value="fintech">Fintech / Bancario</option>
                  <option value="manufactura">Manufactura / Industria</option>
                  <option value="servicios">Servicios Profesionales</option>
                  <option value="turismo">Hotelería / Turismo</option>
                  <option value="educacion">Educación</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400">
                Al enviar aceptas nuestra{' '}
                <a href="#" className="text-[#4DA8C4] hover:underline">Política de Privacidad</a>.
                Recibirás un email de confirmación en las próximas horas.
              </p>
              <button
                type="submit"
                disabled={!form.nombre || !form.email}
                className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Agendar Consultoría Gratuita
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationLeadCapture;
