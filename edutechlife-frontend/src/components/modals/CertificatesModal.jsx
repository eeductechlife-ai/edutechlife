import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import { supabase } from '../../lib/supabase';
import { useProgressContext } from '../../context/ProgressContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const COURSE_NAME = 'Introducción a la I.A Generativa';
const TOTAL_MODULES = 5;
const TOTAL_LESSONS = 24;

const CertificatesModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { courseProgress, completedModules, completedVideos, completedExams, completedInfographics, completedActivities, isLoading: progressLoading } = useProgressContext();

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    if (!isOpen || !user?.id) return;

    const fetchCertificate = async () => {
      setLoading(true);

      try {
        const certRes = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        setCertificate(certRes.data);
      } catch (err) {
        console.error('Error loading certificate:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const handleDownloadCertificate = () => {
    alert('📄 Generando certificado PDF... Esta funcionalidad estará disponible pronto.');
  };

  const completedLessons = completedVideos.length + completedInfographics.length + completedActivities.length + Object.values(completedExams).filter(Boolean).length;
  const completedModulesCount = completedModules.length;
  const currentModule = Math.min(completedModulesCount + 1, TOTAL_MODULES);
  const avgScore = certificate?.overall_score || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      <Card className="w-full max-w-md bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[85vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          aria-label="Cerrar"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        {/* Header con gradiente corporativo IALab */}
        <div className="relative bg-gradient-to-r from-[#004B63] to-[#00BCD4] px-6 pt-8 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name="fa-award" className="text-white text-lg" />
            </div>
            <div>
              <CardTitle className="text-white font-bold text-base">Mis Certificados</CardTitle>
              <p className="text-xs text-white/70 mt-0.5">{COURSE_NAME}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-5 overflow-y-auto flex-1">
          {loading || progressLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Icon name="fa-spinner" className="text-3xl text-[#00BCD4] animate-spin mb-4" />
              <p className="text-sm text-slate-500">Cargando tus certificados...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Estadísticas */}
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-md p-3 grid grid-cols-4 gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-[#004B63]">{certificate ? 1 : 0}</p>
                  <p className="text-[9px] text-slate-500 font-medium">Certificados</p>
                </div>
                <div className="text-center border-x border-slate-200/60">
                  <p className="text-lg font-bold text-[#00BCD4]">{completedModulesCount}/{TOTAL_MODULES}</p>
                  <p className="text-[9px] text-slate-500 font-medium">Módulos</p>
                </div>
                <div className="text-center border-x border-slate-200/60">
                  <p className="text-lg font-bold text-emerald-600">{completedLessons}/{TOTAL_LESSONS}</p>
                  <p className="text-[9px] text-slate-500 font-medium">Lecciones</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-600">{avgScore > 0 ? `${avgScore}%` : '—'}</p>
                  <p className="text-[9px] text-slate-500 font-medium">Promedio</p>
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
                        <p className="text-xs text-white/80">{COURSE_NAME}</p>
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
              ) : (
                /* Sin certificado: mostrar curso inscrito y progreso */
                <div className="space-y-4">
                  {/* Curso Inscrito */}
                  <div className="p-4 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 border border-[#004B63]/10 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-graduation-cap" className="text-[#004B63] text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Curso Inscrito</p>
                        <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">{COURSE_NAME}</p>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso general */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700">Avance del curso</span>
                      <span className="text-[10px] text-slate-500">{completedLessons}/{TOTAL_LESSONS} lecciones</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-full transition-all duration-700"
                        style={{ width: `${courseProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Módulo actual */}
                  <div className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 rounded-lg border border-[#004B63]/10">
                    <Icon name="fa-location-dot" className="text-[#004B63] text-sm" />
                    <span className="text-sm font-bold text-[#004B63]">
                      Módulo {currentModule} de {TOTAL_MODULES}
                    </span>
                  </div>

                  {/* Mensaje motivacional */}
                  {completedModulesCount > 0 ? (
                    <div className="border border-amber-200 rounded-xl bg-amber-50/50 p-4">
                      <div className="flex items-start gap-3">
                        <Icon name="fa-trophy" className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-amber-800 text-sm">¡Sigue avanzando!</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Llevas {completedModulesCount}/{TOTAL_MODULES} módulos completados. Completa los restantes para obtener tu certificado.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl bg-slate-50 p-6 text-center">
                      <Icon name="fa-rocket" className="text-[#00BCD4] text-3xl mx-auto mb-3" />
                      <p className="font-semibold text-slate-700 text-sm">¡Comienza tu curso!</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Completa los 5 módulos de <strong>{COURSE_NAME}</strong> para obtener tu certificado.
                      </p>
                    </div>
                  )}
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
