import React from "react";
import {
  ChevronDown,
  Shield,
  BarChart3,
  FolderOpen,
  LogOut,
} from "lucide-react";

const AdminHeader = ({ onLogout, onBack, activeTab, setActiveTab, dataSource }) => {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-[#004B63]/30"
      style={{ background: "rgba(11, 15, 25, 0.9)" }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#B2D8E5] hover:text-white transition-colors"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
            <span className="text-sm">Volver</span>
          </button>
          <div className="h-8 w-px bg-[#004B63]/50"></div>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #004B63, #4DA8C4)",
              }}
            >
              <Shield className="w-2.5 h-2.5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-montserrat">
                Command Center
              </h1>
              <p className="text-xs text-[#B2D8E5]">
                Panel de Administración Edutechlife
              </p>
            </div>
            <div className="flex items-center gap-1 ml-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === "dashboard"
                    ? "bg-[#4DA8C4]/30 text-white border border-[#4DA8C4]/50"
                    : "text-[#66CCCC] hover:text-white hover:bg-white/5"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === "leads"
                    ? "bg-[#4DA8C4]/30 text-white border border-[#4DA8C4]/50"
                    : "text-[#66CCCC] hover:text-white hover:bg-white/5"
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="text-sm">Leads</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {dataSource === "real" && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
              Datos reales
            </span>
          )}
          {dataSource === "demo" && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFD166]/20 text-[#FFD166] border border-[#FFD166]/40">
              Datos de demostración
            </span>
          )}
          {dataSource === "loading" && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#B2D8E5] border border-white/20">
              Cargando datos…
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#004B63]/30 text-[#66CCCC] border border-[#004B63]/50">
            ADMIN_MASTER
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B9D]/20 text-[#FF6B9D] hover:bg-[#FF6B9D]/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
