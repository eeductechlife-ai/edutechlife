import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/react';
import { supabase } from '../../lib/supabase';
import { useProgressContext } from '../../context/ProgressContext';
import { useIALabContext } from '../../context/IALabContext';
import { Card, CardContent } from '../ui/card-simple';
import { Icon } from '../../utils/iconMapping.jsx';
import CertificatePreview from '../IALab/CertificatePreview';

const COURSE_NAME = 'Introducción a la I.A Generativa';
const TOTAL_MODULES = 5;

const CertificatesModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { courseProgress, completedModules, isLoading: progressLoading } = useProgressContext();
  const { calculateModuleScore, storedCertificate, generateCertificate } = useIALabContext();

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (storedCertificate) {
      setCertificate(storedCertificate);
    }
  }, [storedCertificate]);

  if (!isOpen) return null;

  const modulesByScore = [1, 2, 3, 4, 5].filter(id => calculateModuleScore(id) >= 80).length;
  const modulesByContext = completedModules.length;
  const completedModulesCount = Math.max(modulesByScore, modulesByContext);

  const canGenerateCertificate = courseProgress >= 80 || completedModulesCount >= 5;

  const handleGenerateCertificate = async () => {
    if (canGenerateCertificate) {
      setGenerating(true);
      setError(null);
      try {
        const studentName = nameInput.trim() || user.fullName || 'Estudiante';
        const result = await generateCertificate(studentName);
        if (result && !result.error) {
          setCertificate(result);
        } else {
          const errorMsg = result?.error || 'Error desconocido al generar certificado';
          setError(errorMsg);
          console.error('❌ Error en modal:', errorMsg);
        }
      } catch (err) {
        setError(err.message || 'Error inesperado');
        console.error('❌ Error inesperado generando certificado:', err);
      } finally {
        setGenerating(false);
      }
    }
  };

  const renderCertificateTab = () => {
    if (certificate) {
      return (
        <CertificatePreview
          studentName={certificate.cert_name}
          certNumber={certificate.cert_number}
          issuedAt={certificate.issued_at}
        />
      );
    }

    if (canGenerateCertificate) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Icon name="fa-check-circle" className="text-emerald-600 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-800">¡Curso Completado!</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Has completado los 5 módulos con un progreso del {Math.round(courseProgress)}%. Genera tu certificado ahora.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Nombre para el certificado</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder={user?.fullName || 'Tu nombre completo'}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004B63]/30 focus:border-[#004B63] transition-all"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-exclamation-triangle" className="text-red-600 text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-800">Error al generar certificado</p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                  <p className="text-[10px] text-red-600 mt-2 font-medium">
                    💡 Solución: Ejecuta el script SQL en Supabase Dashboard:
                    <br />
                    <code className="bg-red-100 px-1.5 py-0.5 rounded text-[10px]">
                      sql/fix_certificates_rls.sql
                    </code>
                  </p>
                </div>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateCertificate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:from-[#00374A] hover:to-[#0097A7] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Icon name="fa-spinner" className="animate-spin" />
                Generando certificado...
              </>
            ) : (
              <>
                <Icon name="fa-award" />
                Generar Certificado
              </>
            )}
          </motion.button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
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
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/20"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          aria-label="Cerrar"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        <div className="relative bg-gradient-to-r from-[#004B63] to-[#00BCD4] px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name="fa-award" className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Mis Certificados</h2>
              <p className="text-xs text-white/70 mt-0.5">{COURSE_NAME}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-5 overflow-y-auto flex-1">
          {loading || progressLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Icon name="fa-spinner" className="text-3xl text-[#00BCD4] animate-spin mb-4" />
              <p className="text-sm text-slate-500">Cargando...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {renderCertificateTab()}
            </motion.div>
          )}
        </CardContent>
      </motion.div>
    </div>
  );
};

export default CertificatesModal;
