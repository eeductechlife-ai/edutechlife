/**
 * Modal de Certificados - Gestión y visualización de certificados obtenidos
 * Diseño premium con estilos corporativos Edutechlife
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Button } from '../ui/button-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const CertificatesModal = ({ onClose }) => {
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      title: 'Neuroaprendizaje Avanzado',
      issuer: 'EdutechLife Academy',
      date: '2024-03-15',
      status: 'completado',
      score: 98,
      hours: 40,
      downloadUrl: '#',
      previewUrl: '#',
    },
    {
      id: 2,
      title: 'Diseño Instruccional Digital',
      issuer: 'EdutechLife Academy',
      date: '2024-02-28',
      status: 'completado',
      score: 95,
      hours: 32,
      downloadUrl: '#',
      previewUrl: '#',
    },
    {
      id: 3,
      title: 'Gamificación Educativa',
      issuer: 'EdutechLife Academy',
      date: '2024-01-20',
      status: 'completado',
      score: 92,
      hours: 24,
      downloadUrl: '#',
      previewUrl: '#',
    },
    {
      id: 4,
      title: 'Inteligencia Artificial en Educación',
      issuer: 'EdutechLife Academy',
      date: 'En progreso',
      status: 'en_progreso',
      progress: 65,
      hours: 48,
      estimatedCompletion: '2024-04-30',
    },
    {
      id: 5,
      title: 'Analítica de Datos Educativos',
      issuer: 'EdutechLife Academy',
      date: 'Pendiente',
      status: 'pendiente',
      hours: 36,
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [downloading, setDownloading] = useState(null);

  const filters = [
    { id: 'todos', label: 'Todos', count: certificates.length },
    { id: 'completado', label: 'Completados', count: certificates.filter(c => c.status === 'completado').length },
    { id: 'en_progreso', label: 'En Progreso', count: certificates.filter(c => c.status === 'en_progreso').length },
    { id: 'pendiente', label: 'Pendientes', count: certificates.filter(c => c.status === 'pendiente').length },
  ];

  const filteredCertificates = certificates.filter(cert => 
    selectedFilter === 'todos' ? true : cert.status === selectedFilter
  );

  const handleDownload = async (certificateId, format = 'pdf') => {
    setDownloading(certificateId);
    
    try {
      // Simular descarga
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`✅ Certificado descargado en formato ${format.toUpperCase()}`);
      console.log(`Descargando certificado ${certificateId} en formato ${format}`);
    } catch (error) {
      console.error('Error al descargar certificado:', error);
      alert('❌ Error al descargar el certificado');
    } finally {
      setDownloading(null);
    }
  };

  const handleShare = (certificate) => {
    const shareText = `🎓 He obtenido el certificado "${certificate.title}" en EdutechLife Academy con una calificación de ${certificate.score}%! #EdutechLife #Aprendizaje`;
    
    if (navigator.share) {
      navigator.share({
        title: certificate.title,
        text: shareText,
        url: window.location.origin,
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(shareText);
      alert('✅ Enlace copiado al portapapeles. ¡Compártelo en tus redes sociales!');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completado: { text: '✅ Completado', color: 'bg-emerald-100 text-emerald-700' },
      en_progreso: { text: '🔄 En Progreso', color: 'bg-amber-100 text-amber-700' },
      pendiente: { text: '⏳ Pendiente', color: 'bg-slate-100 text-slate-700' },
    };
    return badges[status] || badges.pendiente;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl mx-4 border border-cyan-500/20 shadow-2xl">
        <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#004B63] font-display font-bold flex items-center gap-2">
              <Icon name="fa-award" className="text-[#00BCD4]" />
              Mis Certificados
            </CardTitle>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-[#004B63] transition-colors p-1.5 rounded-lg hover:bg-cyan-50"
            >
              <Icon name="fa-times" className="text-lg" />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 p-4 rounded-xl border border-cyan-200/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#004B63] flex items-center justify-center">
                  <Icon name="fa-award" className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#004B63]">
                    {certificates.filter(c => c.status === 'completado').length}
                  </p>
                  <p className="text-sm text-slate-600">Certificados Obtenidos</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Icon name="fa-chart-line" className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {Math.round(certificates.filter(c => c.score).reduce((acc, c) => acc + c.score, 0) / certificates.filter(c => c.score).length) || 0}%
                  </p>
                  <p className="text-sm text-slate-600">Promedio General</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                  <Icon name="fa-clock" className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700">
                    {certificates.filter(c => c.hours).reduce((acc, c) => acc + c.hours, 0)}
                  </p>
                  <p className="text-sm text-slate-600">Horas de Estudio</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <Icon name="fa-trophy" className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">
                    {certificates.filter(c => c.score >= 90).length}
                  </p>
                  <p className="text-sm text-slate-600">Con Distinción</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[#004B63]">Filtrar por Estado</h3>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${selectedFilter === filter.id ? 'bg-[#004B63] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
          
          {/* Lista de Certificados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#004B63]">
              {selectedFilter === 'todos' ? 'Todos los Certificados' : 
               selectedFilter === 'completado' ? 'Certificados Completados' :
               selectedFilter === 'en_progreso' ? 'Cursos en Progreso' : 'Cursos Pendientes'}
            </h3>
            
            {filteredCertificates.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-300 rounded-xl">
                <Icon name="fa-inbox" className="text-4xl text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500">No hay certificados en esta categoría</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCertificates.map(cert => (
                  <div key={cert.id} className="border border-slate-200 rounded-xl p-4 hover:border-cyan-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Información del certificado */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                            <Icon name="fa-certificate" className="text-white text-xl" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-bold text-[#004B63]">{cert.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(cert.status).color}`}>
                                {getStatusBadge(cert.status).text}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Icon name="fa-building" className="text-slate-400" />
                                {cert.issuer}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="fa-calendar" className="text-slate-400" />
                                {cert.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="fa-clock" className="text-slate-400" />
                                {cert.hours} horas
                              </span>
                              
                              {cert.score && (
                                <span className={`flex items-center gap-1 font-medium ${getScoreColor(cert.score)}`}>
                                  <Icon name="fa-star" />
                                  {cert.score}% de calificación
                                </span>
                              )}
                            </div>
                            
                            {cert.status === 'en_progreso' && cert.progress && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-slate-600">Progreso</span>
                                  <span className="font-medium text-[#004B63]">{cert.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${cert.progress}%` }}
                                  ></div>
                                </div>
                                {cert.estimatedCompletion && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    Completado estimado: {cert.estimatedCompletion}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex flex-wrap gap-2">
                        {cert.status === 'completado' && (
                          <>
                            <Button
                              onClick={() => handleDownload(cert.id, 'pdf')}
                              variant="outline"
                              className="border-[#004B63] text-[#004B63] hover:bg-[#004B63] hover:text-white"
                              disabled={downloading === cert.id}
                            >
                              {downloading === cert.id ? (
                                <Icon name="fa-spinner" className="animate-spin" />
                              ) : (
                                <>
                                  <Icon name="fa-download" className="mr-2" />
                                  PDF
                                </>
                              )}
                            </Button>
                            
                            <Button
                              onClick={() => handleShare(cert)}
                              variant="outline"
                              className="border-cyan-500 text-cyan-600 hover:bg-cyan-50"
                            >
                              <Icon name="fa-share-alt" className="mr-2" />
                              Compartir
                            </Button>
                          </>
                        )}
                        
                        {cert.status === 'en_progreso' && (
                          <Button
                            onClick={() => alert(`Continuar con el curso: ${cert.title}`)}
                            className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white"
                          >
                            <Icon name="fa-play" className="mr-2" />
                            Continuar
                          </Button>
                        )}
                        
                        {cert.status === 'pendiente' && (
                          <Button
                            onClick={() => alert(`Iniciar curso: ${cert.title}`)}
                            variant="outline"
                            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Icon name="fa-play-circle" className="mr-2" />
                            Iniciar Curso
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Información adicional */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-semibold text-[#004B63] mb-2 flex items-center gap-2">
              <Icon name="fa-info-circle" className="text-cyan-500" />
              Información sobre Certificados
            </h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li className="flex items-start gap-2">
                <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                <span>Todos los certificados son digitales y verificables</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                <span>Puedes descargarlos en formato PDF para imprimir</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                <span>Comparte tus logros en redes sociales y LinkedIn</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                <span>Los certificados con más del 90% obtienen distinción especial</span>
              </li>
            </ul>
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50 h-12"
            >
              Cerrar
            </Button>
            
            <Button
              onClick={() => window.open('/cursos', '_blank')}
              className="flex-1 bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90 text-white h-12"
            >
              <Icon name="fa-graduation-cap" className="mr-2" />
              Explorar Más Cursos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatesModal;