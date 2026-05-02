import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const MODULE_NAMES = {
  1: 'Fundamentos de IA',
  2: 'Prompt Engineering',
  3: 'Herramientas de IA',
  4: 'Ética y Seguridad',
  5: 'Proyecto Final',
};

const MODULE_LESSONS = { 1: 5, 2: 5, 3: 5, 4: 5, 5: 4 };
const TOTAL_LESSONS = 24;

const CertificatesModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [moduleProgress, setModuleProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    if (!isOpen || !user?.id) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [certRes, progressRes] = await Promise.all([
          supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('user_progress')
            .select('module_id, activity_type, is_completed, score')
            .eq('user_id', user.id),
        ]);

        setCertificate(certRes.data);

        const progressData = progressRes.data || [];

        const modules = [];
        let completedCount = 0;
        let scores = [];

        for (const moduleId of [1, 2, 3, 4, 5]) {
          const moduleItems = progressData.filter((p) => p.module_id === moduleId);
          const completed = moduleItems.filter((p) => p.is_completed).length;
          const total = MODULE_LESSONS[moduleId];
          const moduleScores = moduleItems
            .filter((p) => p.score !== null)
            .map((p) => p.score);

          const bestScore = moduleScores.length > 0 ? Math.max(...moduleScores) : null;

          completedCount += completed;
          if (bestScore !== null) scores.push(bestScore);

          modules.push({
            id: moduleId,
            name: MODULE_NAMES[moduleId],
            completed,
            total,
            progress: Math.round((completed / total) * 100),
            bestScore,
            isComplete: completed === total,
          });
        }

        setModuleProgress(modules);
        setTotalCompleted(completedCount);
        setOverallProgress(Math.round((completedCount / TOTAL_LESSONS) * 100));
        setAvgScore(scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0);
      } catch (err) {
        console.error('Error loading certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const handleDownloadCertificate = () => {
    alert('📄 Generando certificado PDF... Esta funcionalidad estará disponible pronto.');
  };

  const hasAnyProgress = totalCompleted > 0;
  const completedModules = moduleProgress.filter((m) => m.isComplete).length;
  const inProgressModules = moduleProgress.filter((m) => !m.isComplete && m.completed > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <Card className="w-full max-w-2xl bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[85vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all duration-200"
          aria-label="Cerrar modal"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        <CardHeader className="border-b border-slate-200/60 bg-white sticky top-0 z-10 pt-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
              <Icon name="fa-award" className="text-[#004B63]" />
            </div>
            <CardTitle className="text-slate-800 font-bold text-sm">Mis Certificados</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Icon name="fa-spinner" className="text-3xl text-[#00BCD4] animate-spin mb-4" />
              <p className="text-sm text-slate-500">Cargando tus certificados y progreso...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-[#004B63]">
                    {certificate ? 1 : 0}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Certificados</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-[#00BCD4]">{completedModules}/5</p>
                  <p className="text-[10px] text-slate-500 font-medium">Módulos</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{totalCompleted}/{TOTAL_LESSONS}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Lecciones</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">{avgScore > 0 ? `${avgScore}%` : '—'}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Promedio</p>
                </div>
              </div>

              {/* Certificado obtenido */}
              {certificate ? (
                <div className="border border-slate-200/60 rounded-xl bg-white overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-[#004B63] to-[#00BCD4]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon name="fa-award" className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Certificado Obtenido</h3>
                        <p className="text-xs text-white/80">Especialista en IA - Edutechlife</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-500 font-medium">Puntuación</p>
                        <p className="text-lg font-bold text-[#004B63]">{certificate.overall_score}%</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-500 font-medium">Fecha</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {new Date(certificate.issued_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    {certificate.cert_number && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-500 font-medium">Número de Certificado</p>
                        <p className="text-sm font-mono font-semibold text-slate-700">{certificate.cert_number}</p>
                      </div>
                    )}
                    <button
                      onClick={handleDownloadCertificate}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-800"
                    >
                      <Icon name="fa-download" />
                      Descargar PDF
                    </button>
                  </div>
                </div>
              ) : hasAnyProgress ? (
                <div className="border border-amber-200 rounded-xl bg-amber-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="fa-trophy" className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 text-sm">¡Sigue avanzando!</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Completa los 5 módulos para obtener tu certificado de Especialista en IA. Llevas {totalCompleted}/{TOTAL_LESSONS} lecciones ({overallProgress}%).
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 text-center">
                  <Icon name="fa-graduation-cap" className="text-slate-400 text-4xl mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 text-sm">Aún no tienes certificados</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Completa el curso de Especialista en IA para obtener tu certificado.
                  </p>
                </div>
              )}

              {/* Progreso por módulos */}
              {hasAnyProgress && (
                <div className="border border-slate-200/60 rounded-xl bg-white overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <Icon name="fa-layer-group" className="text-[#004B63] text-sm" />
                      <h3 className="font-semibold text-[#004B63] text-sm">Progreso por Módulo</h3>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    {moduleProgress.map((mod) => (
                      <div key={mod.id} className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            mod.isComplete
                              ? 'bg-gradient-to-br from-[#004B63] to-[#00BCD4]'
                              : 'bg-slate-200'
                          }`}
                        >
                          <Icon
                            name={mod.isComplete ? 'fa-check' : 'fa-play'}
                            className={`text-white text-xs`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold truncate ${mod.isComplete ? 'text-[#004B63]' : 'text-slate-700'}`}>
                              {mod.name}
                            </span>
                            <span className="text-[10px] text-slate-500 ml-2 flex-shrink-0">
                              {mod.progress}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                mod.isComplete
                                  ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4]'
                                  : 'bg-[#00BCD4]'
                              }`}
                              style={{ width: `${mod.progress}%` }}
                            />
                          </div>
                        </div>

                        {mod.bestScore !== null && (
                          <span className={`text-[10px] font-semibold flex-shrink-0 ${
                            mod.bestScore >= 90 ? 'text-emerald-600' : mod.bestScore >= 70 ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {mod.bestScore}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cursos en progreso */}
              {inProgressModules.length > 0 && !certificate && (
                <div className="border border-slate-200/60 rounded-xl bg-white overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <Icon name="fa-clock" className="text-[#00BCD4] text-sm" />
                      <h3 className="font-semibold text-[#004B63] text-sm">Cursos en Progreso</h3>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    {inProgressModules.map((mod) => (
                      <div
                        key={mod.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{mod.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {mod.completed}/{mod.total} lecciones
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-[#00BCD4]">
                          {mod.progress}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatesModal;
