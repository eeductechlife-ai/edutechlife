import { useState, useRef, useCallback } from 'react';
import { callDeepseek } from '../utils/api';
import { PROMPT_VALERIO_DOCENTE } from '../constants/prompts';

const researchLines = [
    {
        id: 'tecnica',
        title: 'Linea Tecnica',
        subtitle: 'Ingenieria y Sistemas',
        icon: 'fa-microchip',
        color: '#4DA8C4',
        gradient: 'from-[#4DA8C4]/20 to-[#004B63]/10',
        topics: ['Algoritmos', 'Robotica', 'Automacion', 'IA Aplicada'],
        badge: 'Activa',
    },
    {
        id: 'biologica',
        title: 'Linea Biologica',
        subtitle: 'Ciencias de la Vida',
        icon: 'fa-dna',
        color: '#66CCCC',
        gradient: 'from-[#66CCCC]/20 to-[#4DA8C4]/10',
        topics: ['Neurociencia', 'Genetica', 'Biomedicina', 'Ecologia'],
        badge: 'Explorando',
    },
    {
        id: 'astrofisica',
        title: 'Linea Astrofisica',
        subtitle: 'Espacio y Cosmos',
        icon: 'fa-rocket',
        color: '#B2D8E5',
        gradient: 'from-[#B2D8E5]/20 to-[#66CCCC]/10',
        topics: ['Cosmologia', 'Astrofisica', 'Exoplanetas', 'Astrobiologia'],
        badge: 'En Expansion',
    },
];

const SmartBoard = ({ onAnalysisComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedLine, setSelectedLine] = useState(null);
    const fileInputRef = useRef(null);

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
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (allowedTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx)$/i)) {
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

            const lineContext = selectedLine 
                ? `El estudiante esta explorando la linea de investigacion: ${selectedLine}. ` 
                : '';

            const prompt = `${lineContext}El estudiante acaba de subir un documento para analisis en el SmartBoard del IA-Lab.\n\nContenido del documento:\n${content.substring(0, 3000)}\n\nComo Valerio (Psicologo Experto en Metodologia VAK), analizalo de manera empática y práctica. Indica:\n1. De que trata el documento brevemente\n2. Que técnicas de aprendizaje VAK puedes sugerir para estudiarlo\n3. Una pregunta reflexiva para profundizar el tema\n\nResponde de forma concisa y motivadora.`;

            const result = await callDeepseek(prompt, PROMPT_VALERIO_DOCENTE, false);
            setAnalysisResult(result);
            setIsAnalyzing(false);

            if (onAnalysisComplete) {
                onAnalysisComplete({ file: file.name, result });
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="relative">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-3 px-4 py-2 bg-[#004B63]/80 backdrop-blur-xl border border-[#4DA8C4]/30 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                        <i className="fa-solid fa-brain text-white text-xs" />
                    </div>
                    <span className="font-mono text-xs text-[#B2D8E5]">
                        SmartBoard conectado con <span className="text-[#66CCCC] font-semibold">Valerio</span>
                    </span>
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#66CCCC] animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-[#66CCCC] animate-pulse animation-delay-150" />
                        <span className="w-2 h-2 rounded-full bg-[#66CCCC] animate-pulse animation-delay-300" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {researchLines.map((line) => (
                    <div
                        key={line.id}
                        onClick={() => setSelectedLine(selectedLine === line.title ? null : line.title)}
                        className={`
                            relative p-6 rounded-2xl
                            bg-gradient-to-br ${line.gradient}
                            backdrop-blur-xl
                            border transition-all duration-500 cursor-pointer
                            hover:-translate-y-2 hover:shadow-xl
                            ${selectedLine === line.title 
                                ? 'border-[#4DA8C4]/50 shadow-[0_0_30px_rgba(77,168,196,0.2)]' 
                                : 'border-white/10 hover:border-white/20'}
                        `}
                    >
                        <div className={`
                            absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider
                            ${line.badge === 'Activa' ? 'bg-[#4DA8C4]/20 text-[#4DA8C4] border border-[#4DA8C4]/30' : ''}
                            ${line.badge === 'Explorando' ? 'bg-[#66CCCC]/20 text-[#66CCCC] border border-[#66CCCC]/30' : ''}
                            ${line.badge === 'En Expansion' ? 'bg-[#B2D8E5]/20 text-[#B2D8E5] border border-[#B2D8E5]/30' : ''}
                        `}>
                            {line.badge}
                        </div>

                        <div 
                            className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                            style={{ background: `${line.color}20`, border: `1px solid ${line.color}40` }}
                        >
                            <i className={`fa-solid ${line.icon} text-2xl`} style={{ color: line.color }} />
                        </div>

                        <h3 className="font-montserrat font-bold text-lg text-white mb-1">
                            {line.title}
                        </h3>
                        <p className="font-mono text-xs text-white/50 mb-4">
                            {line.subtitle}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {line.topics.map((topic, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 text-[10px] font-mono bg-white/5 border border-white/10 rounded-full text-white/60"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                                    Progreso
                                </span>
                                <span className="text-xs font-mono" style={{ color: line.color }}>
                                    {Math.floor(Math.random() * 40 + 60)}%
                                </span>
                            </div>
                            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${Math.floor(Math.random() * 40 + 60)}%`,
                                        background: `linear-gradient(90deg, ${line.color}, ${line.color}80)`
                                    }}
                                />
                            </div>
                        </div>

                        {selectedLine === line.title && (
                            <div className="absolute inset-0 bg-[#0A1628]/90 backdrop-blur-xl rounded-2xl flex items-center justify-center z-10 animate-fade-in">
                                <div className="text-center p-4">
                                    <i className={`fa-solid ${line.icon} text-4xl mb-3`} style={{ color: line.color }} />
                                    <p className="font-mono text-sm text-[#B2D8E5]">
                                        Linea {line.title} seleccionada
                                    </p>
                                    <p className="text-xs text-white/50 mt-1">
                                        Los documentos se analizaran con este enfoque
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                    relative mt-8 p-8 rounded-2xl border-2 border-dashed transition-all duration-300
                    ${isDragging
                        ? 'bg-[#4DA8C4]/10 border-[#4DA8C4] shadow-[0_0_30px_rgba(77,168,196,0.3)]'
                        : 'bg-white/[0.03] border-white/20 hover:border-white/30'
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center text-center">
                    {uploadingFile ? (
                        <div className="w-full max-w-xs">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[#4DA8C4]/20 border border-[#4DA8C4]/30 flex items-center justify-center">
                                    <i className="fa-solid fa-file-pdf text-[#4DA8C4] animate-pulse" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{uploadingFile}</p>
                                    <p className="text-xs text-[#66CCCC]">{Math.min(Math.round(uploadProgress), 100)}%</p>
                                </div>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                                />
                            </div>
                            <p className="mt-3 text-xs text-white/50">
                                <i className="fa-solid fa-wand-magic-sparkles mr-1" />
                                Procesando con Valerio...
                            </p>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="py-4">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <div className="absolute inset-0 border-4 border-[#4DA8C4]/20 rounded-full" />
                                <div className="absolute inset-0 border-4 border-transparent border-t-[#4DA8C4] rounded-full animate-spin" />
                                <div className="absolute inset-2 flex items-center justify-center">
                                    <i className="fa-solid fa-brain text-[#66CCCC] text-lg animate-pulse" />
                                </div>
                            </div>
                            <p className="font-mono text-sm text-[#B2D8E5]">
                                Valerio esta analizando...
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                                Identificando estilo de aprendizaje optimo
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className={`
                                w-20 h-20 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300
                                ${isDragging
                                    ? 'bg-[#4DA8C4]/30 scale-110'
                                    : 'bg-white/5 border border-white/10'
                                }
                            `}>
                                <i className={`fa-solid fa-cloud-arrow-up text-3xl ${isDragging ? 'text-[#4DA8C4] animate-bounce' : 'text-white/40'}`} />
                            </div>
                            <h4 className="font-montserrat font-bold text-lg text-white mb-2">
                                Arrastra archivos aqui
                            </h4>
                            <p className="text-sm text-white/50 mb-4">
                                o haz click para seleccionar
                            </p>
                            <div className="flex gap-3">
                                <span className="px-3 py-1 text-xs font-mono bg-red-500/10 text-red-400/80 border border-red-500/20 rounded-full">
                                    <i className="fa-solid fa-file-pdf mr-1" />
                                    PDF
                                </span>
                                <span className="px-3 py-1 text-xs font-mono bg-blue-500/10 text-blue-400/80 border border-blue-500/20 rounded-full">
                                    <i className="fa-solid fa-file-word mr-1" />
                                    DOC
                                </span>
                            </div>
                            <p className="mt-4 text-xs text-[#66CCCC]">
                                <i className="fa-solid fa-link mr-1" />
                                Conectado con el laboratorio de IA
                            </p>
                        </>
                    )}
                </div>

                {isDragging && (
                    <div className="absolute inset-0 bg-[#4DA8C4]/5 rounded-2xl flex items-center justify-center pointer-events-none">
                        <div className="px-6 py-3 bg-[#4DA8C4]/20 backdrop-blur-xl border border-[#4DA8C4]/40 rounded-xl">
                            <span className="font-mono text-sm text-[#4DA8C4]">
                                Suelta para subir
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {analysisResult && (
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/5 backdrop-blur-xl border border-[#4DA8C4]/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                            <i className="fa-solid fa-brain text-white text-sm" />
                        </div>
                        <div>
                            <h4 className="font-montserrat font-bold text-white">
                                Analisis de Valerio
                            </h4>
                            <p className="text-xs text-white/50">
                                Informe personalizado VAK
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                            {analysisResult}
                        </p>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .animation-delay-150 {
                    animation-delay: 150ms;
                }
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
            `}</style>
        </div>
    );
};

export default SmartBoard;
