import { useState, useEffect, useRef } from 'react';
import { callDeepseekStream } from '../utils/api';
import { speakTextConversational, iniciarReconocimiento } from '../utils/speech';
import { evaluateWithDeepseek } from '../services/aiEvaluationService';
import { saveProgress, PROGRESS_STATUS } from '../lib/progress';

const AIPanel = ({ title, icon = 'fa-brain-circuit', placeholder, systemPrompt, isJson = false, onResult, moduleId = 1 }) => {
    const [q, setQ] = useState('');
    const [res, setRes] = useState('');
    const [displayedRes, setDisplayedRes] = useState('');
    const [load, setLoad] = useState(false);
    const [speak, setSpeak] = useState(false);
    const [copied, setCopied] = useState(false);
    const [pdfLoad, setPdfLoad] = useState(false);
    const [msg, setMsg] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [streamIndex, setStreamIndex] = useState(0);
    
    const resultRef = useRef(null);
    const streamIntervalRef = useRef(null);
    const isStreamingRef = useRef(false);

    const msgs = ['Analizando contexto...', 'Procesando solicitud...', 'Generando respuesta...', 'Optimizando output...'];
    
    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [displayedRes]);

    const run = async (overrideQ) => {
        const promptQ = typeof overrideQ === 'string' ? overrideQ : q;
        if (!promptQ.trim()) return;
        
        setLoad(true); 
        setRes('');
        setDisplayedRes('');
        setStreamIndex(0);
        
        let idx = 0; 
        setMsg(msgs[0]);
        const iv = setInterval(() => { 
            idx = (idx + 1) % msgs.length; 
            setMsg(msgs[idx]); 
        }, 1800);
        
        try {
            const promptTecnico = `Edutechlife – ${systemPrompt}. Responde en español atendiendo a la solicitud: "${promptQ}". Sé preciso e inspirador.`;
            
            const fullResponse = await callDeepseekStream(
                promptTecnico, 
                systemPrompt, 
                isJson,
                (chunk) => {
                    isStreamingRef.current = true;
                    setDisplayedRes(prev => {
                        const newText = prev + chunk;
                        setStreamIndex(newText.length);
                        return newText;
                    });
                }
            );
            
            clearInterval(iv);
            
            if (fullResponse.error) {
                setRes(`Error: ${fullResponse.message}`);
                setDisplayedRes(`Error: ${fullResponse.message}`);
            } else {
                setRes(fullResponse);
                if (!isJson) {
                    setDisplayedRes(fullResponse);
                } else if (onResult) {
                    onResult(JSON.parse(fullResponse.replace(/```json|```/g, '').trim()));
                }
            }
        } catch (error) {
            console.error("Error en ejecución de AIPanel:", error);
            clearInterval(iv);
            setRes('Error al procesar la solicitud');
            setDisplayedRes('Error al procesar la solicitud');
        } finally {
            setLoad(false);
            isStreamingRef.current = false;
        }
    };

    const handleSpeak = async () => { 
        if (!res || speak) return; 
        setSpeak(true); 
        await speakTextConversational(res, 'sistema'); 
        setSpeak(false); 
    };
    
    const handleCopy = () => {
        if (!res) return;
        navigator.clipboard.writeText(res).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Evaluar prompt con Deepseek y guardar en Supabase
    const handleEvaluateWithDeepseek = async () => {
        if (!q.trim()) return;
        
        setLoad(true);
        setMsg('Evaluando tu prompt con IA...');
        
        try {
            const result = await evaluateWithDeepseek(q, moduleId);
            
            if (result.success) {
                setRes(JSON.stringify(result.data, null, 2));
                setDisplayedRes(JSON.stringify(result.data, null, 2));
                
                // Guardar en Supabase
                await saveProgress(moduleId, PROGRESS_STATUS.COMPLETED, {
                    evaluationScore: result.data.score,
                    evaluationLevel: result.data.level,
                    feedback: result.data.feedback,
                    improvedPrompt: result.data.improvedPrompt,
                    evaluatedAt: new Date().toISOString()
                });

                // Hacer que Valerio hable el feedback
                if (result.data.feedback && window.valerioSpeak) {
                    setTimeout(() => {
                        const rawText = result.data.feedback.join('. ');
                        const cleanText = rawText
                            .replace(/\*\*/g, '')
                            .replace(/\*/g, '')
                            .replace(/`/g, '')
                            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                            .replace(/[_*~]/g, '')
                            .trim();
                        window.valerioSpeak(cleanText);
                    }, 1500);
                }
                
                if (onResult) {
                    onResult(result.data);
                }
            } else {
                setRes(`Error: ${result.error}`);
                setDisplayedRes(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error en evaluación:', error);
            setRes('Error al evaluar el prompt');
            setDisplayedRes('Error al evaluar el prompt');
        } finally {
            setLoad(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!res) return;
        setPdfLoad(true);

        const container = document.createElement('div');
        container.style.padding = '40px';
        container.style.fontFamily = "'DM Sans', sans-serif";
        container.style.color = '#061322';
        container.style.background = '#ffffff';
        container.innerHTML = `
            <div style="border-bottom: 2px solid #0090B8; padding-bottom: 20px; margin-bottom: 30px; display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #0090B8, #00B8D4); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                    <h1 style="font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; margin: 0; color: #061322; letter-spacing: -0.04em;">EDUTECHLIFE</h1>
                    <p style="font-family: 'DM Mono', monospace; font-size: 10px; color: #0090B8; letter-spacing: 0.15em; margin: 0; text-transform: uppercase;">Inteligencia Analítica</p>
                </div>
            </div>
            <h2 style="font-family: 'Syne', sans-serif; font-size: 18px; color: #061322; margin-bottom: 20px;">Reporte: ${title}</h2>
            <div style="line-height: 1.6; font-size: 14px;" class="pdf-content">
                ${window.marked ? window.marked.parse(res) : res}
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-family: 'DM Mono', monospace; font-size: 10px; color: #6b7280; text-align: center;">
                Generado automáticamente por IA Lab Pro de Edutechlife — ${new Date().toLocaleDateString('es-CO')}
            </div>
        `;

        const opt = {
            margin: 10,
            filename: `edutechlife-reporte-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(container).save().then(() => {
            setPdfLoad(false);
        });
    };

    return (
        <div className={`ai-panel${load ? ' neural-glow' : ''}`}>
            <div className="ai-panel-header">
                <div className="ai-panel-icon"><i className={`fa-solid ${icon}`} /></div>
                <span className="ai-panel-title">{title}</span>
                <div className="ai-panel-badge"><span className="ai-panel-badge-dot" />GEMINI LIVE</div>
            </div>
            <textarea 
                className="ai-input-dark" 
                rows={3} 
                placeholder={placeholder} 
                value={q} 
                onChange={e => setQ(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run(); } }} 
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => run()} disabled={load} className="ai-run-btn" style={{ flex: 1, marginTop: 0, minWidth: '120px' }}>
                    {load ? <><span>Procesando</span><div className="ai-loading-bars"><span /><span /><span /><span /><span /></div></> : <><span>Ejecutar</span><i className="fa-solid fa-bolt text-xs relative z-10" /></>}
                </button>
                <button onClick={() => handleEvaluateWithDeepseek()} disabled={load || !q.trim()} className="ai-run-btn" style={{ flex: 1, marginTop: 0, minWidth: '120px', background: 'linear-gradient(135deg, #004B63, #4DA8C4)' }}>
                    {load ? <><span>Evaluando</span><div className="ai-loading-bars"><span /><span /><span /><span /><span /></div></> : <><span>Evaluar</span><i className="fa-solid fa-robot text-xs relative z-10" /></>}
                </button>
                <button 
                    onClick={() => iniciarReconocimiento(setQ, run, setIsListening)} 
                    disabled={load} 
                    className={`ai-run-btn ${isListening ? 'animate-pulse' : ''}`} 
                    style={{ flex: 'none', width: 'auto', padding: '0 1.5rem', marginTop: 0, background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)', border: isListening ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)' }}
                    title="Hablar por micrófono"
                >
                    <i className="fa-solid fa-microphone" style={{ color: isListening ? '#EF4444' : 'var(--primary)' }}></i>
                </button>
            </div>

            {load && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', marginTop: '1rem', background: 'rgba(0,194,224,.06)', border: '1px solid rgba(0,194,224,.15)', borderRadius: '1rem' }}>
                <div className="ai-loading-bars"><span /><span /><span /><span /><span /></div>
                <span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'var(--primary)', letterSpacing: '.15em', textTransform: 'uppercase' }}>{msg}</span>
            </div>}
            
            {displayedRes && !load && (
                <div className="ai-result">
                    <div className="ai-result-topbar">
                        <span className="ai-result-label">Respuesta neural generada</span>
                        <div className="ai-result-actions">
                            <button onClick={handleCopy} className={`ai-copy-btn${copied ? ' copied' : ''}`}>
                                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} text-xs`} />
                                {copied ? 'Copiado' : 'Copiar'}
                            </button>
                            <button onClick={handleSpeak} className={`ai-audio-btn${speak ? ' speaking' : ''}`}>
                                <i className={`fa-solid ${speak ? 'fa-waveform-lines' : 'fa-volume-high'} text-xs`} />{speak ? 'Hablando' : 'Audio'}
                            </button>
                            <button onClick={handleDownloadPDF} disabled={pdfLoad} style={{
                                display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,rgba(0,194,224,.1),rgba(0,224,255,.05))',
                                border: '1px solid rgba(0,194,224,.3)', color: 'var(--primary)', fontFamily: 'DM Mono', fontSize: '9px',
                                fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', padding: '6px 14px', borderRadius: '100px',
                                cursor: 'pointer', transition: 'all .3s'
                            }}
                                onMouseEnter={e => { if (!pdfLoad) { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'var(--navy)'; } }}
                                onMouseLeave={e => { if (!pdfLoad) { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(0,194,224,.1),rgba(0,224,255,.05))'; e.currentTarget.style.color = 'var(--primary)'; } }}>
                                <i className={`fa-solid ${pdfLoad ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-xs`} />{pdfLoad ? 'Generando...' : 'Descargar PDF'}
                            </button>
                        </div>
                    </div>
                    <div 
                        className="ai-result-body" 
                        dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(displayedRes) : displayedRes }} 
                        ref={resultRef}
                    />
                </div>
            )}
        </div>
    );
};

export default AIPanel;
