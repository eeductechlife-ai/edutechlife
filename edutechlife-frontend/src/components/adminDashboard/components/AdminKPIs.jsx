import React from "react";
import { Eye, Ear, Hand } from "lucide-react";

const AdminKPIs = ({ kpis }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl p-6 border border-[#004B63]/30"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10"
                style={{
                  background: kpi.color,
                  borderRadius: "0 0 0 100%",
                }}
              ></div>

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: kpi.bgColor }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: kpi.color }}
                    />
                  </div>
                  {kpi.demo && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-[#FFD166]/20 text-[#FFD166]">
                      DEMO
                    </div>
                  )}
                </div>

                <h3 className="text-sm text-[#B2D8E5] mb-1 font-open-sans">
                  {kpi.label}
                </h3>

                {kpi.value ? (
                  <div className="text-3xl font-bold text-white font-montserrat">
                    {kpi.value}
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-white font-montserrat mb-3">
                      Distribución
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-[#4DA8C4]" />
                          <span className="text-sm text-[#B2D8E5]">
                            Visual
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {kpi.breakdown.visual}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                          style={{ width: `${kpi.breakdown.visual}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ear className="w-4 h-4 text-[#66CCCC]" />
                          <span className="text-sm text-[#B2D8E5]">
                            Auditivo
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {kpi.breakdown.auditory}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#66CCCC] to-[#B2D8E5]"
                          style={{ width: `${kpi.breakdown.auditory}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hand className="w-4 h-4 text-[#FF6B9D]" />
                          <span className="text-sm text-[#B2D8E5]">
                            Kinestésico
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {kpi.breakdown.kinesthetic}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF6B9D] to-[#FFD166]"
                          style={{ width: `${kpi.breakdown.kinesthetic}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#004B63]/20 border border-[#004B63]/30 text-center">
          <p className="text-2xl font-bold text-white font-montserrat">
            1,247
          </p>
          <p className="text-xs text-[#B2D8E5]">Estudiantes Activos Hoy</p>
        </div>
        <div className="p-4 rounded-xl bg-[#004B63]/20 border border-[#004B63]/30 text-center">
          <p className="text-2xl font-bold text-white font-montserrat">
            342
          </p>
          <p className="text-xs text-[#B2D8E5]">Misiones Completadas</p>
        </div>
        <div className="p-4 rounded-xl bg-[#004B63]/20 border border-[#004B63]/30 text-center">
          <p className="text-2xl font-bold text-white font-montserrat">
            89%
          </p>
          <p className="text-xs text-[#B2D8E5]">Tasa de Retención</p>
        </div>
        <div className="p-4 rounded-xl bg-[#004B63]/20 border border-[#004B63]/30 text-center">
          <p className="text-2xl font-bold text-white font-montserrat">
            4.7/5
          </p>
          <p className="text-xs text-[#B2D8E5]">Satisfacción General</p>
        </div>
      </div>
    </>
  );
};

export default AdminKPIs;
