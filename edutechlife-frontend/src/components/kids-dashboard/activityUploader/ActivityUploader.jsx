import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { useSmartBoardKids } from '../../../context/SmartBoardKidsContext';
import { getFileIcon } from '../../../utils/documentParser';
import { useActivityUpload } from './useActivityUpload';
import UploadDropzone from './components/UploadDropzone';
import UploadForm from './components/UploadForm';

const AnalysisResult = memo(({ analysis, onTutorWithDani }) => {
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 65) return 'text-amber-500';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-green-50 border-green-200';
    if (score >= 65) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const difficultyColors = {
    básico: 'bg-[#66CCCC]/20 text-[#66CCCC]',
    intermedio: 'bg-[#FFD166]/20 text-[#FFD166]',
    avanzado: 'bg-[#FF6B9D]/20 text-[#FF6B9D]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm"
    >
      <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg">{analysis.title || 'Análisis completado'}</h4>
            <p className="text-white/70 text-xs mt-1">
              {analysis.subject} • Dificultad: {analysis.difficulty}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl ${getScoreBg(analysis.score)} text-center`}>
            <span className={`text-2xl font-black ${getScoreColor(analysis.score)}`}>{analysis.score}</span>
            <span className={`block text-[10px] ${getScoreColor(analysis.score)}`}>puntos</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-[#64748B] leading-relaxed">{analysis.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-green-50 border border-green-100">
            <h5 className="text-xs font-bold text-green-600 mb-2">✅ Fortalezas</h5>
            <ul className="space-y-1">
              {analysis.strengths?.map((s, i) => (
                <li key={i} className="text-xs text-green-700 flex items-start gap-1">
                  <span>•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
            <h5 className="text-xs font-bold text-amber-600 mb-2">💡 Áreas de mejora</h5>
            <ul className="space-y-1">
              {analysis.improvements?.map((s, i) => (
                <li key={i} className="text-xs text-amber-700 flex items-start gap-1">
                  <span>•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.button
          onClick={onTutorWithDani}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          🤖 Hablar con Dani sobre este análisis
        </motion.button>
      </div>
    </motion.div>
  );
});

AnalysisResult.displayName = 'AnalysisResult';

const ActivityCard = memo(({ activity, index, onViewAnalysis }) => {
  const getStatusColor = () => {
    switch (activity.status) {
      case 'analyzed': return 'border-[#66CCCC] bg-[#66CCCC]/5';
      case 'in-progress': return 'border-[#FFD166] bg-[#FFD166]/5';
      default: return 'border-[#E2E8F0] bg-white';
    }
  };

  const getStatusEmoji = () => {
    switch (activity.status) {
      case 'analyzed': return '✅';
      case 'in-progress': return '🔄';
      default: return '📝';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border-2 ${getStatusColor()} transition-all hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getFileIcon(activity.name)}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-[#004B63] mb-1 truncate">{activity.name}</h4>
          <p className="text-xs text-[#64748B] mb-2">{activity.subject}</p>
          <div className="flex items-center gap-3 text-xs text-[#64748B]">
            <span>📅 {new Date(activity.uploadedAt).toLocaleDateString('es-ES')}</span>
            {activity.analysis?.score && (
              <span className="font-bold" style={{
                color: activity.analysis.score >= 85 ? '#22C55E' : activity.analysis.score >= 65 ? '#F59E0B' : '#EF4444'
              }}>
                {activity.analysis.score}/100
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            activity.status === 'analyzed' ? 'bg-[#66CCCC]/20 text-[#66CCCC]' :
            activity.status === 'in-progress' ? 'bg-[#FFD166]/20 text-[#FFD166]' :
            'bg-[#E2E8F0] text-[#64748B]'
          }`}>
            {activity.status === 'analyzed' ? 'Analizado' :
             activity.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
          </span>
          {activity.analysis && (
            <motion.button
              onClick={() => onViewAnalysis(activity)}
              className="text-[10px] text-[#4DA8C4] font-semibold hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Ver análisis
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ActivityCard.displayName = 'ActivityCard';

const VAKRecommendation = memo(({ recommendation, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="p-4 bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/10 rounded-xl border border-[#4DA8C4]/20"
  >
    <div className="flex items-start gap-3">
      <span className="text-2xl">
        {recommendation.type === 'activity' ? '🎯' : '📚'}
      </span>
      <div>
        <h5 className="text-sm font-bold text-[#004B63] mb-1">{recommendation.name}</h5>
        <p className="text-xs text-[#64748B]">{recommendation.description}</p>
      </div>
    </div>
  </motion.div>
));

VAKRecommendation.displayName = 'VAKRecommendation';

const ActivityUploader = memo(() => {
  const {
    uploadedActivities,
    analyzedActivities,
    vakRecommendations,
    vakResult,
  } = useSmartBoardKids();

  const {
    isUploading,
    uploadProgress,
    uploadStatus,
    subject,
    setSubject,
    currentAnalysis,
    viewingAnalysis,
    setViewingAnalysis,
    handleUpload,
    handleTutorWithDani,
  } = useActivityUpload();

  const focusTrapRef = useFocusTrap(viewingAnalysis !== null);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-[#004B63] mb-4">📤 Subir Actividad Académica</h3>
        <UploadDropzone
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          uploadStatus={uploadStatus}
        />

        <UploadForm subject={subject} onSubjectChange={setSubject} />
      </motion.div>

      {currentAnalysis && (
        <AnalysisResult
          analysis={currentAnalysis}
          onTutorWithDani={() => handleTutorWithDani(currentAnalysis)}
        />
      )}

      {uploadedActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-bold text-[#004B63] mb-4">
            📂 Mis Actividades ({uploadedActivities.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {uploadedActivities.slice().reverse().map((activity, idx) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={idx}
                onViewAnalysis={setViewingAnalysis}
              />
            ))}
          </div>
        </motion.div>
      )}

      {uploadedActivities.length === 0 && !isUploading && !currentAnalysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <span className="text-6xl mb-4 block">📭</span>
          <p className="text-[#64748B]">Aún no has subido actividades</p>
          <p className="text-sm text-[#64748B] mt-2">¡Sube tu primera tarea y Dani la analizará!</p>
          <p className="text-xs text-[#64748B] mt-1">Gana 50 puntos por subir y 100 por análisis completo</p>
        </motion.div>
      )}

      {vakRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-bold text-[#004B63] mb-4">
            💡 Recomendaciones para tu estilo {vakResult?.predominantStyle?.toUpperCase()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vakRecommendations.map((rec, idx) => (
              <VAKRecommendation key={idx} recommendation={rec} index={idx} />
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {viewingAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            style={{ overscrollBehavior: 'contain' }}
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-label="Análisis de actividad"
            onClick={() => setViewingAnalysis(null)}
            onKeyDown={(e) => { if (e.key === 'Escape') setViewingAnalysis(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <AnalysisResult
                analysis={viewingAnalysis.analysis}
                onTutorWithDani={() => {
                  handleTutorWithDani(viewingAnalysis.analysis);
                  setViewingAnalysis(null);
                }}
              />
              <button
                onClick={() => setViewingAnalysis(null)}
                className="mt-2 w-full py-2 text-sm text-white/80 hover:text-white text-center"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ActivityUploader.displayName = 'ActivityUploader';

export default ActivityUploader;
