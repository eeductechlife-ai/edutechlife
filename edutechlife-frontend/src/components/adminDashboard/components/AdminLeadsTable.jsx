import React, { useState, useRef, useEffect } from "react";
import { Search, Download, MessageSquare, Send, Shield, Zap, BarChart3, Brain } from "lucide-react";
import { callDeepseek } from "../../../utils/api";
import { MODULES, getVAKIcon, getVAKColor, getStatusColor } from "./adminLeadsTableUtils";

const AdminLeadsTable = ({
  students,
  institutions,
  institutionFilter,
  setInstitutionFilter,
  dataSource,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vakFilter, setVakFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [consultantMessages, setConsultantMessages] = useState([]);
  const [consultantInput, setConsultantInput] = useState("");
  const [consultantLoading, setConsultantLoading] = useState(false);
  const consultantEndRef = useRef(null);

  const scrollToBottom = () => {
    consultantEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [consultantMessages]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVak = vakFilter === "all" || student.vak === vakFilter;
    const matchesModule =
      moduleFilter === "all" || student.module === moduleFilter;
    return matchesSearch && matchesVak && matchesModule;
  });

  const downloadCSV = () => {
    const headers = [
      "ID",
      "Nombre",
      "Estilo VAK",
      "Módulo Actual",
      "XP",
      "Última Conexión",
      "Estado",
    ];
    const rows = filteredStudents.map((s) => [
      s.id,
      s.name,
      s.vak,
      s.module,
      s.xp,
      s.lastConnection,
      s.status,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `edutechlife_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleConsultantSend = async () => {
    if (!consultantInput.trim()) return;

    const userQuestion = consultantInput;
    setConsultantInput("");
    setConsultantMessages((prev) => [
      ...prev,
      { role: "user", text: userQuestion },
    ]);
    setConsultantLoading(true);

    const studentDataSummary = filteredStudents
      .map(
        (s) =>
          `${s.name} (${s.id}): Estilo VAK ${s.vak}, ${s.module}, ${s.xp} XP`,
      )
      .join("\n");

    const systemPrompt = `Eres Valeria IA, la consultora de análisis educativo de Edutechlife para administradores. Tienes acceso a datos detallados de estudiantes y debes proporcionar insights accionables sobre dificultades de aprendizaje, patrones de rendimiento, y recomendaciones basadas en los estilos VAK. Sé específica, profesional y usa datos cuando sea posible.`;

    const sourceNote =
      dataSource === "real"
        ? "Estos son diagnósticos VAK reales de la plataforma."
        : "NOTA: son datos de demostración (aún no hay diagnósticos reales registrados).";
    const prompt = `Contexto: Somos el centro Edutechlife en Manizales. ${sourceNote}\nDatos de estudiantes:\n${studentDataSummary}\n\nPregunta del administrador: ${userQuestion}`;

    try {
      const response = await callDeepseek(prompt, systemPrompt, false);
      setConsultantMessages((prev) => [
        ...prev,
        { role: "assistant", text: response },
      ]);
    } catch (error) {
      setConsultantMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Lo siento, estoy experimentando dificultades técnicas. Por favor intenta de nuevo.",
        },
      ]);
    }
    setConsultantLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div
          className="rounded-2xl border border-[#004B63]/30 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 75, 99, 0.3) 0%, rgba(11, 15, 25, 0.95) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="p-6 border-b border-[#004B63]/30">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-[#4DA8C4]" />
                <h2 className="text-lg font-bold text-white font-montserrat">
                  Gestión de Estudiantes
                </h2>
              </div>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4DA8C4]/20 text-[#4DA8C4] hover:bg-[#4DA8C4]/30 transition-all border border-[#4DA8C4]/30"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  Descargar Reporte Global
                </span>
              </button>
            </div>

            <div className="mt-4 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2D8E5]/50" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white placeholder-[#B2D8E5]/50 focus:outline-none focus:border-[#4DA8C4] transition-colors"
                />
              </div>
              <div className="flex gap-3">
                {institutions.length > 0 && (
                  <select
                    value={institutionFilter}
                    onChange={(e) => setInstitutionFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white focus:outline-none focus:border-[#4DA8C4] transition-colors cursor-pointer"
                    title="Filtrar por institución"
                  >
                    <option value="all">Todas las instituciones</option>
                    {institutions.map((inst) => (
                      <option key={inst.slug} value={inst.slug}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  value={vakFilter}
                  onChange={(e) => setVakFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white focus:outline-none focus:border-[#4DA8C4] transition-colors cursor-pointer"
                >
                  <option value="all">Todos los VAK</option>
                  <option value="Visual">Visual</option>
                  <option value="Auditivo">Auditivo</option>
                  <option value="Kinestésico">Kinestésico</option>
                </select>
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white focus:outline-none focus:border-[#4DA8C4] transition-colors cursor-pointer"
                >
                  <option value="all">Todos los Módulos</option>
                  {MODULES.map((mod, i) => (
                    <option key={i} value={mod}>
                      Módulo {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#004B63]/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                    Estilo VAK
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                    Módulo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                    XP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                    Última Conexión
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#004B63]/20 hover:bg-[#004B63]/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center text-white text-xs font-bold">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {student.name}
                          </p>
                          <p className="text-xs text-[#B2D8E5]/70">
                            {student.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getVAKColor(student.vak)}`}
                      >
                        {getVAKIcon(student.vak)}
                        {student.vak}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#B2D8E5]">
                        {student.module.split(" - ")[0]}
                      </p>
                      <p className="text-xs text-[#B2D8E5]/70">
                        - {student.module.split(" - ")[1]}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#FFD166]" />
                        <span className="text-sm font-semibold text-white">
                          {student.xp.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#B2D8E5]">
                        {student.lastConnection}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${getStatusColor(student.status)}`}
                        ></span>
                        <span className="text-xs text-[#B2D8E5] capitalize">
                          {student.status === "active"
                            ? "Activo"
                            : student.status === "away"
                              ? "Ausente"
                              : "Inactivo"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-[#004B63]/30 bg-[#0B0F19]/50">
            <p className="text-sm text-[#B2D8E5]">
              Mostrando{" "}
              <span className="font-semibold text-white">
                {filteredStudents.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-white">
                {students.length}
              </span>{" "}
              estudiantes
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div
          className="rounded-2xl border border-[#004B63]/30 overflow-hidden h-full flex flex-col"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 75, 99, 0.3) 0%, rgba(11, 15, 25, 0.95) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="p-6 border-b border-[#004B63]/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #004B63, #4DA8C4)",
                  }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#66CCCC] border-2 border-[#0B0F19]"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-montserrat">
                  Valeria IA
                </h2>
                <p className="text-xs text-[#66CCCC]">
                  Consultora de Análisis Educativo
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#66CCCC]/10 border border-[#66CCCC]/20">
              <MessageSquare className="w-4 h-4 text-[#66CCCC]" />
              <p className="text-xs text-[#B2D8E5]">
                Modo Consultor activo. Pregunta sobre dificultades de
                aprendizaje, patrones y recomendaciones.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #004B63, #4DA8C4)",
                }}
              >
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[#004B63]/30 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                <p className="text-sm text-[#B2D8E5]">
                  ¡Hola! Soy Valeria, tu consultora de IA. Puedo analizar
                  los datos de tus estudiantes y proporcionarte insights
                  sobre dificultades de aprendizaje, patrones de
                  rendimiento y recomendaciones específicas basadas en los
                  estilos VAK. ¿Qué te gustaría saber?
                </p>
              </div>
            </div>

            {consultantMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #004B63, #4DA8C4)",
                    }}
                  >
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`${msg.role === "user" ? "bg-[#4DA8C4]/30 rounded-2xl rounded-tr-none" : "bg-[#004B63]/30 rounded-2xl rounded-tl-none"} p-4 max-w-[85%]`}
                >
                  <p className="text-sm text-white">{msg.text}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#4DA8C4]/30">
                    <Shield className="w-4 h-4 text-[#4DA8C4]" />
                  </div>
                )}
              </div>
            ))}

            {consultantLoading && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #004B63, #4DA8C4)",
                  }}
                >
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#004B63]/30 rounded-2xl rounded-tl-none p-4">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={consultantEndRef} />
          </div>

          <div className="p-4 border-t border-[#004B63]/30">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: ¿Cuál es la principal dificultad de aprendizaje del grupo?"
                value={consultantInput}
                onChange={(e) => setConsultantInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleConsultantSend()
                }
                className="flex-1 px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white placeholder-[#B2D8E5]/50 focus:outline-none focus:border-[#4DA8C4] transition-colors text-sm"
              />
              <button
                onClick={handleConsultantSend}
                disabled={!consultantInput.trim()}
                className="px-4 py-3 rounded-xl bg-[#4DA8C4] text-white hover:bg-[#4DA8C4]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeadsTable;
