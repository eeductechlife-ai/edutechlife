import { useState, useRef, useCallback, useEffect } from 'react';
import { callDeepseek } from '../utils/api';
import { PROMPT_VALERIO_DOCENTE } from '../constants/prompts';
import ValerioAvatar from './ValerioAvatar';

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

    const simulateUpload = (file) => {
        setUploadingFile(file.name);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15 + 5;
            });
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setUploadProgress(100);
            setTimeout(() => {
                setUploadingFile(null);
                setUploadProgress(0);
                analyzeDocument(file);
            }, 500);
        }, 1500);
    };

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
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            simulateUpload(file);
        }
    };

    const analyzeDocument = async (file) => {
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
    };

    if (embedded) {
        return (
            <div className="smartboard-embedded">
                <div className="sb-header">
                    <div className="sb-status">
                        <div className="sb-status-dot" />
                        <span>SmartBoard</span>
                    </div>
                    <div className="sb-valerio-mini">
                        <ValerioAvatar state={avatarState} size={32} />
                    </div>
                </div>
                
                <div className="sb-lines-grid">
                    {researchLines.map((line) => (
                        <div
                            key={line.id}
                            className={`sb-line-card ${selectedLine === line.title ? 'selected' : ''}`}
                            onClick={() => setSelectedLine(selectedLine === line.title ? null : line.title)}
                            style={{ '--line-color': line.color }}
                        >
                            <div className="sb-line-icon">
                                <i className={`fa-solid ${line.icon}`} />
                            </div>
                            <h4>{line.title}</h4>
                            <span className="sb-badge">{line.badge}</span>
                        </div>
                    ))}
                </div>

                <div
                    className={`sb-dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.md"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    
                    {uploadingFile ? (
                        <div className="sb-upload-progress">
                            <i className="fa-solid fa-file-pdf" />
                            <span className="sb-filename">{uploadingFile}</span>
                            <div className="sb-progress-bar">
                                <div className="sb-progress-fill" style={{ width: `${Math.min(uploadProgress, 100)}%` }} />
                            </div>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="sb-analyzing">
                            <ValerioAvatar state="thinking" size={48} />
                            <span>Valerio analizando...</span>
                        </div>
                    ) : (
                        <>
                            <i className="fa-solid fa-cloud-arrow-up" />
                            <span>Arrastra documentos aquí</span>
                        </>
                    )}
                </div>

                {analysisResult && (
                    <div className="sb-analysis-result">
                        <div className="sb-analysis-header">
                            <ValerioAvatar state="speaking" size={36} />
                            <span>Análisis de Valerio</span>
                        </div>
                        <p>{analysisResult}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="smartboard-page">
            <div className="smartboard-hero">
                <div className="smartboard-badge">
                    <i className="fa-solid fa-brain" />
                    <span>SMARTBOARD</span>
                </div>
                <h1>Laboratorio de Investigación Inteligente</h1>
                <p>
                    Explora líneas de investigación, analiza documentos con IA y recibe 
                    recomendaciones personalizadas basadas en tu perfil de aprendizaje VAK.
                </p>
            </div>

            <div className="smartboard-tabs">
                <button 
                    className={`sb-tab ${activeTab === 'lines' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lines')}
                >
                    <i className="fa-solid fa-diagram-project" />
                    Líneas de Investigación
                </button>
                <button 
                    className={`sb-tab ${activeTab === 'analyzer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analyzer')}
                >
                    <i className="fa-solid fa-file-analysis" />
                    Analizador de Documentos
                </button>
            </div>

            <div className="smartboard-content">
                {activeTab === 'lines' && (
                    <div className="sb-lines-section">
                        <div className="sb-lines-grid-full">
                            {researchLines.map((line) => (
                                <div
                                    key={line.id}
                                    className={`sb-research-card ${selectedLine === line.title ? 'selected' : ''}`}
                                    onClick={() => setSelectedLine(selectedLine === line.title ? null : line.title)}
                                    style={{ '--line-color': line.color }}
                                >
                                    <div className="sb-research-header">
                                        <div className="sb-research-icon">
                                            <i className={`fa-solid ${line.icon}`} />
                                        </div>
                                        <span className="sb-research-badge">{line.badge}</span>
                                    </div>

                                    <h3>{line.title}</h3>
                                    <p className="sb-research-subtitle">{line.subtitle}</p>

                                    <div className="sb-research-topics">
                                        {line.topics.map((topic, i) => (
                                            <span key={i} className="sb-topic-tag">{topic}</span>
                                        ))}
                                    </div>

                                    <div className="sb-research-progress">
                                        <div className="sb-progress-info">
                                            <span>Progreso</span>
                                            <span className="sb-progress-value">{line.progress}%</span>
                                        </div>
                                        <div className="sb-progress-bar-container">
                                            <div 
                                                className="sb-progress-bar-fill"
                                                style={{ width: `${line.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {selectedLine === line.title && (
                                        <div className="sb-selected-overlay">
                                            <div className="sb-selected-content">
                                                <i className={`fa-solid ${line.icon}`} />
                                                <span>Línea seleccionada</span>
                                                <p>Los documentos se analizarán con este enfoque</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {selectedLine && (
                            <div className="sb-selected-info">
                                <ValerioAvatar state={avatarState} size={48} />
                                <div className="sb-selected-text">
                                    <h4>Línea de Investigación Activa</h4>
                                    <p>Has seleccionado: <strong>{selectedLine}</strong>. 
                                    Los documentos que subas al analizador serán procesados con este contexto.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analyzer' && (
                    <div className="sb-analyzer-section">
                        <div className="sb-analyzer-main">
                            <div
                                className={`sb-analyzer-dropzone ${isDragging ? 'dragging' : ''}`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt,.md"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {uploadingFile ? (
                                    <div className="sb-upload-state">
                                        <div className="sb-upload-icon">
                                            <i className="fa-solid fa-file-pdf" />
                                        </div>
                                        <h4>{uploadingFile}</h4>
                                        <div className="sb-upload-progress-bar">
                                            <div 
                                                className="sb-upload-progress-fill"
                                                style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                                            />
                                        </div>
                                        <span>{Math.min(Math.round(uploadProgress), 100)}%</span>
                                    </div>
                                ) : isAnalyzing ? (
                                    <div className="sb-analyzing-state">
                                        <ValerioAvatar state="thinking" size={64} />
                                        <h4>Valerio está analizando...</h4>
                                        <p>Identificando técnicas VAK óptimas para tu perfil</p>
                                    </div>
                                ) : (
                                    <div className="sb-empty-state" onClick={() => fileInputRef.current?.click()}>
                                        <div className="sb-upload-circle">
                                            <i className="fa-solid fa-cloud-arrow-up" />
                                        </div>
                                        <h4>Arrastra archivos aquí</h4>
                                        <p>o haz clic para seleccionar</p>
                                        <div className="sb-file-types">
                                            <span><i className="fa-solid fa-file-pdf" /> PDF</span>
                                            <span><i className="fa-solid fa-file-word" /> DOC</span>
                                            <span><i className="fa-solid fa-file-lines" /> TXT</span>
                                        </div>
                                    </div>
                                )}

                                {isDragging && (
                                    <div className="sb-drag-overlay">
                                        <span>Suelta para subir</span>
                                    </div>
                                )}
                            </div>

                            <div className="sb-analyzer-sidebar">
                                <div className="sb-sidebar-card">
                                    <h4><i className="fa-solid fa-wand-magic-sparkles" /> Análisis VAK</h4>
                                    <p>Valerio analizará tu documento y te proporcionará:</p>
                                    <ul>
                                        <li><i className="fa-solid fa-check" /> Resumen del contenido</li>
                                        <li><i className="fa-solid fa-check" /> Técnicas de aprendizaje óptimas</li>
                                        <li><i className="fa-solid fa-check" /> Preguntas reflexivas</li>
                                    </ul>
                                </div>
                                <div className="sb-sidebar-card">
                                    <h4><i className="fa-solid fa-link" /> Conexión Activa</h4>
                                    <div className="sb-connection-status">
                                        <div className="sb-status-indicator" />
                                        <span>Conectado con IA Lab</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {analysisResult && (
                            <div className="sb-analysis-card">
                                <div className="sb-analysis-header">
                                    <ValerioAvatar state="speaking" size={48} />
                                    <div className="sb-analysis-title">
                                        <h4>Análisis de Valerio</h4>
                                        <span>Informe personalizado VAK</span>
                                    </div>
                                </div>
                                <div className="sb-analysis-content">
                                    <p>{analysisResult}</p>
                                </div>
                                <div className="sb-analysis-actions">
                                    <button onClick={() => navigator.clipboard.writeText(analysisResult)}>
                                        <i className="fa-solid fa-copy" /> Copiar
                                    </button>
                                    <button onClick={() => setAnalysisResult(null)}>
                                        <i className="fa-solid fa-trash" /> Limpiar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartBoard;
