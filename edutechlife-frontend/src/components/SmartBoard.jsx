import React, { useState, useRef, useCallback, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { callDeepseek } from '../utils/api';
import { PROMPT_VALERIO_DOCENTE } from '../constants/prompts';
import ValerioAvatar from './ValerioAvatar';
import GlassCard from './GlassCard';

const researchLines = [
  {
    id: 'tecnica',
    title: 'Línea Técnica',
    subtitle: 'Ingeniería y Sistemas',
    icon: 'fa-microchip',
    color: '#4DA8C4',
    bgGradient: 'from-[#4DA8C4]/5 to-[#004B63]/10',
    borderColor: 'rgba(77, 168, 196, 0.2)',
    topics: ['Algoritmos', 'Robótica', 'Automatización', 'IA Aplicada'],
    badge: 'Activa',
    progress: 78,
  },
  {
    id: 'biologica',
    title: 'Línea Biológica',
    subtitle: 'Ciencias de la Vida',
    icon: 'fa-dna',
    color: '#66CCCC',
    bgGradient: 'from-[#66CCCC]/5 to-[#4DA8C4]/10',
    borderColor: 'rgba(102, 204, 204, 0.2)',
    topics: ['Neurociencia', 'Genética', 'Biomedicina', 'Ecología'],
    badge: 'Explorando',
    progress: 45,
  },
  {
    id: 'astrofisica',
    title: 'Línea Astrofísica',
    subtitle: 'Espacio y Cosmos',
    icon: 'fa-rocket',
    color: '#B2D8E5',
    bgGradient: 'from-[#B2D8E5]/5 to-[#66CCCC]/10',
    borderColor: 'rgba(178, 216, 229, 0.2)',
    topics: ['Cosmología', 'Astrofísica', 'Exoplanetas', 'Astrobiología'],
    badge: 'En Expansión',
    progress: 32,
  },
];

const ResearchCard = memo(({
  line,
  isSelected,
  onSelect
}) => (
  <motion.div
    className={`
      sb-research-card ${isSelected ? 'selected' : ''}
      bg-gradient-to-br ${line.bgGradient}
      p-6 rounded-2xl border cursor-pointer
      transition-all duration-300 ease-out
      hover:shadow-lg hover:scale-[1.02]
      ${isSelected ? 'border-[#4DA8C4]/50 shadow-xl ring-2 ring-[#4DA8C4]/20' : 'border-[#E2E8F0]'}
    `}
    onClick={onSelect}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    layout
  >
    <div className="sb-research-header flex items-start justify-between mb-4">
      <motion.div 
        className="sb-research-icon w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center shadow-lg"
        animate={{ scale: isSelected ? 1.1 : 1 }}
      >
        <i className={`fa-solid ${line.icon} text-white text-lg`} />
      </motion.div>
      <span className="sb-research-badge px-3 py-1 rounded-full text-xs font-semibold bg-[#66CCCC]/20 text-[#66CCCC]">
        {line.badge}
      </span>
    </div>

    <h3 className="text-lg font-bold text-[#004B63] font-montserrat mb-1">{line.title}</h3>
    <p className="sb-research-subtitle text-sm text-[#64748B] font-open-sans mb-4">{line.subtitle}</p>

    <div className="sb-research-topics flex flex-wrap gap-2 mb-4">
      {line.topics.map((topic, i) => (
        <span key={i} className="sb-topic-tag px-2 py-1 rounded-md text-xs bg-white/50 text-[#64748B]">
          {topic}
        </span>
      ))}
    </div>

    <div className="sb-research-progress">
      <div className="sb-progress-info flex items-center justify-between mb-2">
        <span className="text-xs text-[#64748B] font-open-sans">Progreso</span>
        <span className="sb-progress-value text-sm font-bold text-[#66CCCC] font-montserrat">{line.progress}%</span>
      </div>
      <div className="sb-progress-bar-container h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
        <motion.div 
          className="sb-progress-bar-fill h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
          initial={{ width: 0 }}
          animate={{ width: `${line.progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>

    <AnimatePresence>
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="sb-selected-overlay mt-4 pt-4 border-t border-[#E2E8F0]"
        >
          <div className="sb-selected-content flex items-center gap-3">
            <i className={`fa-solid ${line.icon} text-[#4DA8C4]`} />
            <span className="text-sm font-semibold text-[#004B63]">Línea seleccionada</span>
          </div>
          <p className="text-xs text-[#64748B] mt-2">Los documentos se analizarán con este enfoque</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
));

ResearchCard.displayName = 'ResearchCard';

const DropZone = memo(({
  isDragging,
  uploadingFile,
  uploadProgress,
  isAnalyzing,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  fileInputRef
}) => (
  <motion.div
    className={`
      sb-analyzer-dropzone relative
      border-2 border-dashed rounded-2xl p-12
      transition-all duration-300 cursor-pointer
      ${isDragging 
        ? 'border-[#4DA8C4] bg-[#4DA8C4]/5 scale-[1.02]' 
        : 'border-[#E2E8F0] hover:border-[#4DA8C4]/50 hover:bg-[#F8FAFC]'
      }
    `}
    onDragEnter={onDragEnter}
    onDragLeave={onDragLeave}
    onDragOver={onDragOver}
    onDrop={onDrop}
    onClick={() => fileInputRef.current?.click()}
    animate={{ 
      scale: isDragging ? 1.02 : 1,
      borderColor: isDragging ? '#4DA8C4' : '#E2E8F0'
    }}
  >
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.doc,.docx,.txt,.md"
      onChange={onFileSelect}
      className="hidden"
    />

    <AnimatePresence mode="wait">
      {uploadingFile ? (
        <motion.div
          key="uploading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sb-upload-state text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-file-pdf text-3xl text-[#4DA8C4]" />
          </div>
          <h4 className="text-lg font-semibold text-[#004B63] mb-2 truncate max-w-xs mx-auto">
            {uploadingFile}
          </h4>
          <div className="w-48 h-2 bg-[#E2E8F0] rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(uploadProgress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm text-[#64748B] mt-2 block">{Math.min(Math.round(uploadProgress), 100)}%</span>
        </motion.div>
      ) : isAnalyzing ? (
        <motion.div
          key="analyzing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sb-analyzing-state text-center"
        >
          <ValerioAvatar state="thinking" size={64} />
          <h4 className="text-lg font-semibold text-[#004B63] mt-4 mb-2">Valerio está analizando...</h4>
          <p className="text-sm text-[#64748B]">Identificando técnicas VAK óptimas para tu perfil</p>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sb-empty-state text-center"
        >
          <motion.div
            className="sb-upload-circle w-20 h-20 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-4 shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <i className="fa-solid fa-cloud-arrow-up text-3xl text-white" />
          </motion.div>
          <h4 className="text-lg font-semibold text-[#004B63] mb-2">Arrastra archivos aquí</h4>
          <p className="text-sm text-[#64748B] mb-4">o haz clic para seleccionar</p>
          <div className="sb-file-types flex items-center justify-center gap-4">
            {[
              { icon: 'fa-file-pdf', label: 'PDF' },
              { icon: 'fa-file-word', label: 'DOC' },
              { icon: 'fa-file-lines', label: 'TXT' },
            ].map((type) => (
              <span key={type.label} className="flex items-center gap-1 text-xs text-[#64748B]">
                <i className={`fa-solid ${type.icon}`} /> {type.label}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="sb-drag-overlay absolute inset-0 bg-[#4DA8C4]/10 rounded-2xl flex items-center justify-center"
        >
          <span className="text-lg font-semibold text-[#4DA8C4]">Suelta para subir</span>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
));

DropZone.displayName = 'DropZone';

const AnalysisCard = memo(({
  analysisResult,
  onCopy,
  onClear
}) => (
  <motion.div
    className="sb-analysis-card bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="sb-analysis-header flex items-center gap-4 mb-4">
      <ValerioAvatar state="speaking" size={48} />
      <div className="sb-analysis-title">
        <h4 className="font-bold text-[#004B63] font-montserrat">Análisis de Valerio</h4>
        <span className="text-xs text-[#64748B]">Informe personalizado VAK</span>
      </div>
    </div>
    <div className="sb-analysis-content p-4 bg-[#F8FAFC] rounded-xl mb-4">
      <p className="text-[#334155] font-open-sans leading-relaxed whitespace-pre-wrap">
        {analysisResult}
      </p>
    </div>
    <div className="sb-analysis-actions flex gap-3">
      <motion.button
        onClick={onCopy}
        className="flex-1 py-2 px-4 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-lg font-semibold hover:bg-[#4DA8C4]/20 transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <i className="fa-solid fa-copy" /> Copiar
      </motion.button>
      <motion.button
        onClick={onClear}
        className="flex-1 py-2 px-4 bg-[#FF6B9D]/10 text-[#FF6B9D] rounded-lg font-semibold hover:bg-[#FF6B9D]/20 transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <i className="fa-solid fa-trash" /> Limpiar
      </motion.button>
    </div>
  </motion.div>
));

AnalysisCard.displayName = 'AnalysisCard';

const SmartBoard = ({ onAnalysisComplete, embedded = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [activeTab, setActiveTab] = useState('lines');
  const [avatarState, setAvatarState] = useState('idle');
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      setIsDragging(false);
      setUploadingFile(null);
      setUploadProgress(0);
      setAnalysisResult(null);
      setIsAnalyzing(false);
      setSelectedLine(null);
      setActiveTab('lines');
    };
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const simulateUpload = useCallback((file) => {
    setUploadingFile(file.name);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      setUploadProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadingFile(null);
          setUploadProgress(0);
          analyzeDocument(file);
        }, 300);
      }
    }, 100);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|md)$/i)) {
        simulateUpload(file);
      }
    }
  }, [simulateUpload]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      simulateUpload(file);
    }
  }, [simulateUpload]);

  const analyzeDocument = useCallback(async (file) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const content = event.target.result;
      setIsAnalyzing(true);
      setAvatarState('thinking');

      const lineContext = selectedLine 
        ? `El estudiante está explorando la línea de investigación: ${selectedLine}. ` 
        : '';

      const prompt = `${lineContext}El estudiante acaba de subir un documento para análisis en el SmartBoard del IA-Lab.\n\nContenido del documento:\n${content.substring(0, 4000)}\n\nComo Valerio (Psicólogo Experto en Metodología VAK y STEAM), analízalo de manera empática y práctica. Indica:\n1. De qué trata el documento brevemente\n2. Qué técnicas de aprendizaje VAK puedes sugerir para estudiarlo\n3. Una pregunta reflexiva para profundizar el tema\n\nResponde de forma concisa, motivadora y en español.`;

      const result = await callDeepseek(prompt, PROMPT_VALERIO_DOCENTE, false);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setAvatarState('speaking');

      setTimeout(() => {
        setAvatarState('idle');
      }, 3000);

      if (onAnalysisComplete) {
        onAnalysisComplete({ file: file.name, result });
      }
    };

    reader.readAsText(file);
  }, [selectedLine, onAnalysisComplete]);

  const handleCopyResult = useCallback(() => {
    navigator.clipboard.writeText(analysisResult);
  }, [analysisResult]);

  const handleClearResult = useCallback(() => {
    setAnalysisResult(null);
  }, []);

  if (embedded) {
    return (
      <div className="smartboard-embedded">
        <div className="sb-header flex items-center justify-between mb-4">
          <div className="sb-status flex items-center gap-2">
            <div className="sb-status-dot w-2 h-2 rounded-full bg-[#66CCCC] animate-pulse" />
            <span className="text-sm font-semibold text-[#004B63]">SmartBoard</span>
          </div>
          <div className="sb-valerio-mini">
            <ValerioAvatar state={avatarState} size={32} />
          </div>
        </div>
        
        <div className="sb-lines-grid grid grid-cols-3 gap-3 mb-4">
          {researchLines.map((line) => (
            <motion.div
              key={line.id}
              className={`
                sb-line-card p-3 rounded-xl border cursor-pointer transition-all
                ${selectedLine === line.title ? 'border-[#4DA8C4] bg-[#4DA8C4]/5' : 'border-[#E2E8F0] hover:border-[#4DA8C4]/30'}
              `}
              onClick={() => setSelectedLine(selectedLine === line.title ? null : line.title)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <i className={`fa-solid ${line.icon} text-sm`} style={{ color: line.color }} />
                <span className="text-xs font-semibold text-[#004B63] truncate">{line.title}</span>
              </div>
              <span className="sb-badge text-[10px] px-2 py-0.5 rounded-full bg-[#66CCCC]/20 text-[#66CCCC]">
                {line.badge}
              </span>
            </motion.div>
          ))}
        </div>

        <DropZone
          isDragging={isDragging}
          uploadingFile={uploadingFile}
          uploadProgress={uploadProgress}
          isAnalyzing={isAnalyzing}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          fileInputRef={fileInputRef}
        />

        <AnimatePresence>
          {analysisResult && (
            <AnalysisCard
              analysisResult={analysisResult}
              onCopy={handleCopyResult}
              onClear={handleClearResult}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="smartboard-page min-h-screen bg-[#F8FAFC]">
      <div className="smartboard-hero bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-8 text-white">
        <motion.div
          className="smartboard-badge inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className="fa-solid fa-brain" />
          <span className="text-sm font-bold">SMARTBOARD</span>
        </motion.div>
        <motion.h1 
          className="text-3xl font-bold font-montserrat mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Laboratorio de Investigación Inteligente
        </motion.h1>
        <motion.p 
          className="text-white/80 font-open-sans max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Explora líneas de investigación, analiza documentos con IA y recibe 
          recomendaciones personalizadas basadas en tu perfil de aprendizaje VAK.
        </motion.p>
      </div>

      <div className="smartboard-tabs flex gap-2 p-4 border-b border-[#E2E8F0] bg-white">
        {[
          { id: 'lines', label: 'Líneas de Investigación', icon: 'fa-diagram-project' },
          { id: 'analyzer', label: 'Analizador de Documentos', icon: 'fa-file-analysis' },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              sb-tab flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${activeTab === tab.id 
                ? 'bg-[#4DA8C4] text-white shadow-lg' 
                : 'text-[#64748B] hover:bg-[#F1F5F9]'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className={`fa-solid ${tab.icon}`} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="smartboard-content p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'lines' && (
            <motion.div
              key="lines"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="sb-lines-section"
            >
              <div className="sb-lines-grid-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {researchLines.map((line, index) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ResearchCard
                      line={line}
                      isSelected={selectedLine === line.title}
                      onSelect={() => setSelectedLine(selectedLine === line.title ? null : line.title)}
                    />
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {selectedLine && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="sb-selected-info flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg border border-[#E2E8F0]"
                  >
                    <ValerioAvatar state={avatarState} size={48} />
                    <div className="sb-selected-text">
                      <h4 className="font-bold text-[#004B63]">Línea de Investigación Activa</h4>
                      <p className="text-sm text-[#64748B]">
                        Has seleccionado: <strong>{selectedLine}</strong>. 
                        Los documentos que subas al analizador serán procesados con este contexto.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'analyzer' && (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="sb-analyzer-section"
            >
              <div className="sb-analyzer-main grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DropZone
                    isDragging={isDragging}
                    uploadingFile={uploadingFile}
                    uploadProgress={uploadProgress}
                    isAnalyzing={isAnalyzing}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onFileSelect={handleFileSelect}
                    fileInputRef={fileInputRef}
                  />
                </div>

                <div className="sb-analyzer-sidebar space-y-4">
                  <GlassCard padding="md">
                    <h4 className="font-bold text-[#004B63] mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-wand-magic-sparkles text-[#4DA8C4]" /> 
                      Análisis VAK
                    </h4>
                    <p className="text-sm text-[#64748B] mb-3">
                      Valerio analizará tu documento y te proporcionará:
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Resumen del contenido',
                        'Técnicas de aprendizaje óptimas',
                        'Preguntas reflexivas'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#334155]">
                          <i className="fa-solid fa-check text-[#66CCCC]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>

                  <GlassCard padding="md">
                    <h4 className="font-bold text-[#004B63] mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-link text-[#4DA8C4]" /> 
                      Conexión Activa
                    </h4>
                    <div className="sb-connection-status flex items-center gap-2">
                      <div className="sb-status-indicator w-2 h-2 rounded-full bg-[#66CCCC] animate-pulse" />
                      <span className="text-sm text-[#64748B]">Conectado con IA Lab</span>
                    </div>
                  </GlassCard>
                </div>
              </div>

              <AnimatePresence>
                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6"
                  >
                    <AnalysisCard
                      analysisResult={analysisResult}
                      onCopy={handleCopyResult}
                      onClear={handleClearResult}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SmartBoard;
