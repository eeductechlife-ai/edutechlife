import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Download,
  Search,
  Phone,
  Mail,
  FileText,
  X,
  RefreshCw,
} from "lucide-react";
import { fetchLeadsAdmin } from "../services/leads";

// Lee la tabla `leads` vía GET /api/leads (solo rol admin). Antes leía el
// localStorage del navegador del admin, que siempre estaba vacío.
const PERFIL = {
  padre: "Padre o madre",
  docente: "Docente",
  colegio: "Colegio",
  empresa: "Empresa",
  estudiante: "Estudiante",
  otro: "Otro",
};

const fecha = (iso) => (iso ? new Date(iso).toLocaleString("es-CO") : "");

const LeadsManager = ({ onClose }) => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLeads(
        await fetchLeadsAdmin(sessionStorage.getItem("auth_token") || ""),
      );
    } catch (e) {
      setError(
        e?.code === "permiso"
          ? "Tu sesión no tiene rol de administrador o expiró. Vuelve a iniciar sesión."
          : "No se pudieron cargar los leads. Intenta de nuevo.",
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      "Fecha",
      "Nombre",
      "Email",
      "Teléfono",
      "Perfil",
      "Interés",
      "Mensaje",
      "Formulario",
      "Página",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "Estado",
    ];
    const rows = leads.map((l) => [
      fecha(l.created_at),
      l.nombre,
      l.email,
      l.telefono,
      PERFIL[l.perfil] || l.perfil,
      l.producto_interes,
      l.mensaje,
      l.fuente,
      l.pagina,
      l.utm_source,
      l.utm_medium,
      l.utm_campaign,
      l.estado,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob(["﻿" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads_edutechlife_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const term = searchTerm.toLowerCase();
  const filteredLeads = leads.filter((lead) =>
    [
      lead.nombre,
      lead.telefono,
      lead.email,
      lead.producto_interes,
      lead.mensaje,
      lead.fuente,
    ].some((v) => (v || "").toLowerCase().includes(term)),
  );

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-64"
        role="status"
        aria-label="Cargando leads"
      >
        <div className="animate-spin w-8 h-8 border-4 border-[#4DA8C4] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Leads del sitio</h2>
            <p className="text-sm text-[#66CCCC]">
              {leads.length} leads registrados
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full hover:bg-white/10 text-[#66CCCC] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#66CCCC]" />
          <input
            type="text"
            aria-label="Buscar leads"
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A1628]/80 border border-[#4DA8C4]/30 rounded-lg text-white placeholder-[#66CCCC] focus:outline-none focus:border-[#4DA8C4] text-sm"
          />
        </div>
        <button
          onClick={loadLeads}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#4DA8C4]/50 rounded-lg text-[#66CCCC] font-medium text-sm hover:bg-white/5 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
        <button
          onClick={exportToCSV}
          disabled={leads.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-lg text-[#0A1628] font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-sm"
        >
          {error}
        </p>
      ) : leads.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <Users className="w-16 h-16 text-[#4DA8C4]/30 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Aún no hay leads
          </h3>
          <p className="text-sm text-[#66CCCC] max-w-xs">
            Aquí aparecen los formularios de contacto, demo, método,
            automatización, boletín y Nico.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 bg-[#0A1628]/60 border border-[#4DA8C4]/20 rounded-xl hover:border-[#4DA8C4]/40 transition-all"
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <h4 className="text-white font-semibold">
                    {lead.nombre || "Sin nombre"}
                  </h4>
                  <p className="text-xs text-[#66CCCC]">
                    {fecha(lead.created_at)} · {lead.fuente}
                    {lead.utm_source ? ` · ${lead.utm_source}` : ""}
                  </p>
                </div>
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                  {PERFIL[lead.perfil] || lead.perfil} · {lead.estado}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {lead.telefono && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="truncate">{lead.telefono}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
              </div>

              {(lead.producto_interes || lead.mensaje) && (
                <div className="mt-3 pt-3 border-t border-[#4DA8C4]/20">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-[#4DA8C4] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {[lead.producto_interes, lead.mensaje]
                        .filter(Boolean)
                        .join(" — ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsManager;
