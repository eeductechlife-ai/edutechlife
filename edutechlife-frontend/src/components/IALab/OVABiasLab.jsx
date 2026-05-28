import React, { useState, useEffect, useRef } from 'react';
import VoiceReader from './VoiceReader';
import { CheckCircle, XCircle, Award, Brain, Shield, AlertTriangle, Scale, Eye, Lock, Users, Zap, BookOpen, Gamepad2 } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';
import { contentData, gameData } from '../../data/ova/biasLab';

const BrainIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
  </svg>
);

const EdutechLogo = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A5F] to-[#2FA8C6] rounded-xl rotate-3 shadow-md"></div>
      <Brain className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase font-bold">
      <span className="text-[#1E3A5F]">edu</span><span className="text-[#2FA8C6]">techlife</span>
    </div>
  </div>
);

export default function OVABiasLab({ onComplete }) {
  const { t } = useTranslation();
  const certCompletedRef = useRef(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [shuffledCases, setShuffledCases] = useState([]);
  const [shuffledConcepts, setShuffledConcepts] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setShuffledCases([...gameData].sort(() => Math.random() - 0.5));
    setShuffledConcepts([...gameData].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (selectedCase && selectedConcept) {
      if (selectedCase.id === selectedConcept.id) { setMatchedPairs([...matchedPairs, selectedCase.id]); setSelectedCase(null); setSelectedConcept(null); }
      else { setIsError(true); setTimeout(() => { setIsError(false); setSelectedCase(null); setSelectedConcept(null); }, 800); }
    }
  }, [selectedCase, selectedConcept]);

  

  const navItems = [
    { id: 'intro', icon: <BookOpen size={18}/> },
    { id: 'cap1', icon: <Scale size={18}/> },
    { id: 'cap2', icon: <Shield size={18}/> },
    { id: 'cap3', icon: <AlertTriangle size={18}/> },
    { id: 'cap4', icon: <Brain size={18}/> },
    { id: 'game', icon: <Gamepad2 size={18}/> },
  ];



  return (
    <div className="w-full bg-blue-50 dark:bg-slate-900 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden relative min-h-[500px]">
      <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] bg-[length:50px_50px]" /><div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(47,168,198,0.15)_0%,rgba(255,255,255,0)_70%)]" /><div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(30,58,95,0.08)_0%,rgba(255,255,255,0)_70%)]" />
      <aside className="w-full md:w-64 bg-white/90 dark:bg-slate-800/90 flex flex-col shadow-xl z-10 md:min-h-screen border-r border-blue-100">
        <div className="p-6 text-center border-b border-blue-50">
          <EdutechLogo />
          <p className="text-[10px] uppercase mt-2 text-slate-600 dark:text-slate-300 font-bold tracking-[0.2em]">{t('ova.biaslab.sidebar_subtitle')}</p>
        </div>
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-w-max md:min-w-0 ${activeSection === item.id ? 'bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white font-semibold shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-[#E0F7FA] hover:text-[#004B63]'}`}>
              {item.icon}<span className="text-sm md:text-base">{t(`ova.biaslab.nav_${item.id}`)}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-50">
          <VoiceReader text={activeSection === 'intro' ? contentData.intro.text + ' ' + contentData.intro.extended : contentData[activeSection]?.text || 'Bienvenido al laboratorio de ética en IA'} />
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto relative" style={{ maxHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto bg-white/85 dark:bg-slate-800/85 backdrop-blur-[20px] border border-[#2FA8C6]/15 shadow-[0_10px_40px_rgba(30,58,95,0.08)] rounded-3xl p-6 md:p-10 min-h-[80vh] flex flex-col relative z-10 border-t-4 border-t-[#2FA8C6]">
          {activeSection === 'intro' && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
              <h2 className="text-3xl md:text-4xl font-black text-[#1E3A5F] dark:text-slate-100 mb-6 font-montserrat">{contentData.intro.title}</h2>
              <div className="w-full h-64 md:h-80 rounded-2xl mb-8 overflow-hidden shadow-xl border border-[#EAEAEA]">
                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000" alt={t('ova.biaslab.intro_img_alt')} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">{contentData.intro.text}</p>
              <div className="mt-6 p-6 bg-[#E0F7FA] border-l-8 border-[#2FA8C6] rounded-r-2xl italic text-[#1E3A5F] dark:text-slate-100 font-medium">"{contentData.intro.extended}"</div>
            </div>
          )}

          {activeSection === 'cap2' && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
              <h2 className="text-3xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-6 font-montserrat">{contentData.cap2.title}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div className="space-y-4">
                  <p className="text-base text-slate-600 dark:text-slate-300">{contentData.cap2.text}</p>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><CheckCircle size={18}/> {t('ova.biaslab.responsible_practices')}</h3>
                    <ul className="space-y-3">{contentData.cap2.dos.map((item, i) => (<li key={i} className="flex gap-3 text-emerald-900 dark:text-emerald-100 text-sm bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-emerald-50"><Zap size={14} className="mt-1 flex-shrink-0 text-emerald-500"/> {item}</li>))}</ul>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#1E3A5F] to-[#0D1B2A] rounded-2xl p-6 text-white shadow-xl flex flex-col justify-center border-b-8 border-[#2FA8C6]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#2FA8C6] rounded-xl"><Zap size={24}/></div>
                    <h3 className="text-xl font-bold">{contentData.cap2.toolTitle}</h3>
                  </div>
                  <p className="text-blue-100 text-sm mb-6">{contentData.cap2.toolDesc}</p>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-xs uppercase tracking-widest text-[#2FA8C6] font-bold mb-2">{t('ova.biaslab.case_study')}</p>
                    <p className="text-sm italic">"Domina NotebookLM como tu asistente definitivo para evitar alucinaciones."</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeSection === 'cap1' || activeSection === 'cap3' || activeSection === 'cap4') && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
              <h2 className="text-3xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-6 font-montserrat">{contentData[activeSection].title}</h2>
              <p className="text-base text-slate-600 dark:text-slate-300 mb-8">{contentData[activeSection].text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(contentData[activeSection].principles || contentData[activeSection].risks || contentData[activeSection].biases).map((item, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-[#2FA8C6] transition-all group">
                    <h4 className="font-bold text-[#1E3A5F] dark:text-slate-100 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#2FA8C6] group-hover:scale-150 transition-transform"></div>
                      {item.name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              {activeSection === 'cap3' && (
                <div className="mt-6 p-6 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-100 rounded-2xl">
                  <h4 className="text-rose-700 dark:text-rose-300 font-black uppercase text-xs mb-2">{t('ova.biaslab.attention_label')}</h4>
                  <p className="text-rose-900 dark:text-rose-100 font-medium">{contentData.cap3.critical}</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'game' && (
            <div className="flex flex-col h-full items-center justify-center text-center animate-[fadeIn_0.6s_ease-out_forwards]">
              {matchedPairs.length < gameData.length ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-[#1E3A5F] dark:text-slate-100 mb-2 font-montserrat">{t('ova.biaslab.game_title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t('ova.biaslab.game_desc')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-3">{shuffledCases.map(item => (
                      <button key={item.id} disabled={matchedPairs.includes(item.id)} onClick={() => setSelectedCase(item)}
                        className={`w-full p-4 text-left text-sm rounded-2xl border-2 transition-all ${matchedPairs.includes(item.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-700 dark:text-emerald-300 opacity-50' : selectedCase?.id === item.id ? 'border-[#2FA8C6] bg-[#E0F7FA] shadow-md scale-105' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#2FA8C6]'} ${isError && selectedCase?.id === item.id ? 'animate-[shake_0.4s_ease-in-out] border-rose-400 bg-rose-50 dark:bg-rose-900/20' : ''}`}>
                        {item.case}
                      </button>
                    ))}</div>
                    <div className="space-y-3">{shuffledConcepts.map(item => (
                      <button key={item.id} disabled={matchedPairs.includes(item.id)} onClick={() => setSelectedConcept(item)}
                        className={`w-full p-4 text-center font-bold rounded-2xl border-2 transition-all ${matchedPairs.includes(item.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-700 dark:text-emerald-300 opacity-50' : selectedConcept?.id === item.id ? 'border-[#2FA8C6] bg-[#E0F7FA] shadow-md scale-105' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#2FA8C6]'} ${isError && selectedConcept?.id === item.id ? 'animate-[shake_0.4s_ease-in-out] border-rose-400 bg-rose-50 dark:bg-rose-900/20' : ''}`}>
                        {item.concept}
                      </button>
                    ))}</div>
                  </div>
                </>
              ) : (
                <div className="p-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border-4 border-emerald-200 flex flex-col items-center">
                  <Award className="w-24 h-24 text-emerald-500 mb-4 animate-bounce" />
                  <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 font-montserrat">{t('ova.biaslab.game_complete_title')}</h2>
                  <p className="text-emerald-700 dark:text-emerald-300 mt-2">{t('ova.biaslab.game_complete_desc')}</p>
                  {!certCompletedRef.current && (
                    <button onClick={() => { certCompletedRef.current = true; onComplete?.(); }}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto mb-3 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {t('common.mark_viewed')}
                    </button>
                  )}
                  <button onClick={() => { setActiveSection('intro'); setMatchedPairs([]); }}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                    {t('ova.biaslab.back_to_start')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <footer className="mt-4 text-center text-slate-600 dark:text-slate-300 text-xs py-4">
          {t('ova.biaslab.footer')}
        </footer>
      </main>
      
    </div>
  );
}
