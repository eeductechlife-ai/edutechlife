import { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

// ==========================================
// Upload Zone Component
// ==========================================
const UploadZone = memo(({ onUpload, isUploading, uploadProgress }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer backdrop-blur-xl ${
        isDragging 
          ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 scale-[1.02]' 
          : 'border-[#E2E8F0]/50 bg-white/70 hover:border-[#4DA8C4]/50 hover:bg-white/80'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(77, 168, 196, 0.15)' }}
      animate={{ scale: isDragging ? 1.02 : 1 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <p className="text-sm font-semibold text-[#004B63] mb-2">Subiendo archivo...</p>
            <div className="w-48 h-2 bg-[#E2E8F0] rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(uploadProgress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-4 shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-3xl">☁️</span>
            </motion.div>
            <p className="text-lg font-semibold text-[#004B63] mb-2">
              Arrastra tu actividad aquí
            </p>
            <p className="text-sm text-[#64748B] mb-4">
              o haz clic para seleccionar
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-[#64748B]">
              {['PDF', 'DOC', 'TXT', 'IMG'].map((type) => (
                <span key={type} className="px-2 py-1 bg-[#F8FAFC] rounded">
                  {type}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

UploadZone.displayName = 'UploadZone';

// ==========================================
// Activity Card Component
// ==========================================
const ActivityCard = memo(({ activity, index }) => {
  const getStatusColor = () => {
    switch (activity.status) {
      case 'completed': return 'border-[#66CCCC] bg-[#66CCCC]/5';
      case 'in-progress': return 'border-[#FFD166] bg-[#FFD166]/5';
      default: return 'border-[#E2E8F0] bg-white';
    }
  };

  const getStatusEmoji = () => {
    switch (activity.status) {
      case 'completed': return '✅';
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
        <span className="text-2xl">{getStatusEmoji()}</span>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#004B63] mb-1">{activity.name}</h4>
          <p className="text-xs text-[#64748B] mb-2">{activity.subject}</p>
          <div className="flex items-center gap-3 text-xs text-[#64748B]">
            <span>📅 {new Date(activity.uploadedAt).toLocaleDateString('es-ES')}</span>
            {activity.grade && <span>🏆 {activity.grade}</span>}
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          activity.status === 'completed' ? 'bg-[#66CCCC]/20 text-[#66CCCC]' :
          activity.status === 'in-progress' ? 'bg-[#FFD166]/20 text-[#FFD166]' :
          'bg-[#E2E8F0] text-[#64748B]'
        }`}>
          {activity.status === 'completed' ? 'Completada' :
           activity.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
        </span>
      </div>
    </motion.div>
  );
});

ActivityCard.displayName = 'ActivityCard';

// ==========================================
// VAK Recommendation Card
// ==========================================
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

// ==========================================
// Main Activity Uploader Component
// ==========================================
const ActivityUploader = memo(() => {
  const { addUploadedActivity, uploadedActivities, vakRecommendations, vakResult, addPoints } = useSmartBoardKids();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [subject, setSubject] = useState('');

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const newActivity = {
        id: Date.now(),
        name: file.name,
        subject: subject || 'General',
        status: 'in-progress',
        uploadedAt: new Date(),
        fileType: file.type,
        fileSize: file.size,
      };

      addUploadedActivity(newActivity);
      setIsUploading(false);
      setUploadProgress(0);
      setSubject('');
      
      // Dani feedback
      addPoints(50, 'Subió actividad académica');
    }, 2000);
  }, [subject, addUploadedActivity, addPoints]);

  const subjects = [
    { value: 'matematicas', label: 'Matemáticas', icon: '🔢' },
    { value: 'lenguaje', label: 'Lenguaje', icon: '📖' },
    { value: 'ciencias', label: 'Ciencias', icon: '🔬' },
    { value: 'sociales', label: 'Sociales', icon: '🌍' },
    { value: 'ingles', label: 'Inglés', icon: '🇺🇸' },
    { value: 'arte', label: 'Arte', icon: '🎨' },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-[#004B63] mb-4">📤 Subir Actividad Académica</h3>
        <UploadZone
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
        
        {/* Subject Selector */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-[#004B63] mb-2 block">Materia:</label>
          <div className="grid grid-cols-3 gap-2">
            {subjects.map((subj) => (
              <motion.button
                key={subj.value}
                onClick={() => setSubject(subj.value)}
                className={`p-3 rounded-xl border-2 transition-all text-sm ${
                  subject === subj.value
                    ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold'
                    : 'border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-1">{subj.icon}</span>
                {subj.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* VAK Recommendations */}
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

      {/* Uploaded Activities */}
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
              <ActivityCard key={activity.id} activity={activity} index={idx} />
            ))}
          </div>
        </motion.div>
      )}

      {uploadedActivities.length === 0 && !isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <span className="text-6xl mb-4 block">📭</span>
          <p className="text-[#64748B]">Aún no has subido actividades</p>
          <p className="text-sm text-[#64748B] mt-2">¡Sube tu primera tarea y gana 50 puntos!</p>
        </motion.div>
      )}
    </div>
  );
});

ActivityUploader.displayName = 'ActivityUploader';

export default ActivityUploader;
