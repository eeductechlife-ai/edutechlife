import React, { useState } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import {
  Volume2, TrendingUp, Cpu, Brain, Wrench, Search, Layout, Database,
  Share2, Zap, Settings, MessageSquare, Target, AlertTriangle,
  PlaySquare, Square, ChevronDown, Lightbulb, Bot, Play, GraduationCap
} from 'lucide-react';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import { infographicData } from '../../data/ova/ecosystemGuide';

const EdutechLogo = () => (
  <div className="flex items-center text-3xl md:text-4xl font-bold tracking-tight select-none">
    <span style={{ color: '#2596be' }}>Edu</span>
    <span style={{ color: '#133c55' }}>techlife</span>
  </div>
);

const VoiceReader = ({ text }) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const speak = () => {
    if (isPlaying) { stopSpeech(); setIsPlaying(false); return; }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };
  return (
    <button onClick={speak} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${isPlaying ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30' : 'bg-[#2596be] text-white hover:bg-[#1f7e9f] shadow-md'}`} title={t('ova.ecosystem.voice_title')}>
      {isPlaying ? <Square size={18} /> : <Volume2 size={18} />}
      <span className="font-bold uppercase tracking-wide">{isPlaying ? t('ova.ecosystem.voice_stop') : t('ova.ecosystem.voice_listen')}</span>
    </button>
  );
};

const DetailCard = ({ detail }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const DetailIcon = detail.icon || PlaySquare;
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border overflow-hidden group ${isExpanded ? 'border-[#2596be]' : 'border-slate-200 dark:border-slate-600'}`}>
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-start gap-4 p-4 md:p-5 text-left relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2596be] focus-visible:ring-offset-2 rounded-lg">
        <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${isExpanded ? 'bg-[#2596be]' : 'bg-slate-200 dark:bg-slate-600 group-hover:bg-[#2596be]'}`}></div>
        <div className={`mt-1 transition-colors duration-300 ${isExpanded ? 'text-[#133c55]' : 'text-[#2596be]'}`}><DetailIcon size={22} /></div>
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
            <h5 className="font-bold text-slate-800 dark:text-slate-100 text-base md:text-lg leading-tight">{detail.title}</h5>
            {detail.date && <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-[#2596be] rounded-md self-start md:self-auto">{detail.date}</span>}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pr-2 md:pr-6">{detail.text}</p>
        </div>
        <div className={`text-slate-600 dark:text-slate-400 mt-2 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#2596be]' : ''}`}><ChevronDown size={20} /></div>
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          {detail.extendedText && (
            <div className="p-4 md:p-5 pt-0 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-600">
              <div className="bg-blue-50/70 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-200 leading-relaxed flex gap-3 border border-blue-100 dark:border-blue-800 italic">
                <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div><strong className="block mb-1 text-[#133c55] dark:text-slate-100 font-bold uppercase text-[11px] tracking-widest">{t('ova.ecosystem.detail_deep')}</strong>{detail.extendedText}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const generateSectionTextToSpeech = (section) => {
  let textToRead = `${section.title}. ${section.content} `;
  if (section.details && section.details.length > 0) {
    textToRead += "Conceptos clave: ";
    section.details.forEach(detail => {
      textToRead += `${detail.title}. ${detail.text} `;
      if (detail.extendedText) textToRead += `Profundización: ${detail.extendedText} `;
    });
  }
  return textToRead;
};

const WelcomeScreen = ({ onNext }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-[fadeIn_0.8s_ease-out_forwards] px-4 py-8 bg-white dark:bg-slate-800">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-petroleum dark:text-slate-100 font-semibold text-sm mb-4">
        <Bot size={16} className="text-corporate" /><span>{t('ova.ecosystem.lab_badge')}</span>
      </div>
      <EdutechLogo />
      <h1 className="text-3xl md:text-5xl font-black mt-6 mb-3 leading-tight tracking-tight text-[#133c55] dark:text-slate-100">{infographicData.header.title}</h1>
      <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light mb-4">{infographicData.header.subtitle}</p>
      <p className="text-slate-600 dark:text-slate-400 max-w-xl mb-4">{t('ova.ecosystem.welcome_desc')}</p>
      <VoiceReader text={t('ova.ecosystem.welcome_voice')} />
      <button onClick={onNext} className="mt-4 px-8 py-4 bg-gradient-to-r from-[#2596be] to-[#1f7e9f] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3"><Play size={20} />{t('ova.ecosystem.start_btn')}</button>
    </div>
  );
};

export default function OVAEcosystemGuide() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('evolution');

  const handleSectionClick = (sectionId) => {
    setActiveSectionId(prev => prev === sectionId ? null : sectionId);
  };

  if (currentScreen === 0) return <WelcomeScreen onNext={() => setCurrentScreen(1)} />;

  const sectionIcons = { TrendingUp, Cpu, Wrench, Share2, Target };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b sticky top-0 z-50" style={{ borderColor: '#2596be' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <EdutechLogo />
          <div className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em] hidden md:block">{t('ova.ecosystem.header_module')}</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-[#133c55] dark:text-slate-100">{infographicData.header.title}</h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light">{infographicData.header.subtitle}</p>
          <div className="h-1 w-20 bg-[#2596be] mx-auto mt-4 rounded-full opacity-50"></div>
        </div>

        <div className="space-y-4">
          {infographicData.sections.map((section) => {
            const isActive = activeSectionId === section.id;
            const Icon = sectionIcons[section.icon];
            return (
              <div key={section.id} className={`bg-white dark:bg-slate-800 rounded-3xl shadow-sm border transition-all duration-500 overflow-hidden ${isActive ? 'border-[#2596be] ring-1 ring-[#2596be]/10' : 'border-slate-100 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}>
                <button onClick={() => handleSectionClick(section.id)} className="w-full flex items-center justify-between p-6 md:p-8 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2596be] focus-visible:ring-offset-2 rounded-3xl bg-white dark:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-5 md:gap-6">
                    <div className={`p-4 rounded-2xl transition-all duration-500 ${isActive ? 'bg-[#2596be] text-white shadow-lg rotate-3' : 'bg-slate-50 dark:bg-slate-700/30 text-slate-600 dark:text-slate-300'}`}><Icon size={32} /></div>
                    <div>
                      <h2 className={`text-2xl md:text-3xl font-black tracking-tight transition-colors duration-300 ${isActive ? 'text-[#133c55]' : 'text-slate-700 dark:text-slate-200'}`}>{section.title}</h2>
                      <div className={`h-0.5 bg-[#2596be] transition-all duration-500 ${isActive ? 'w-full opacity-50' : 'w-0 opacity-0'}`}></div>
                    </div>
                  </div>
                  <div className={`p-2 transition-all duration-500 ${isActive ? 'text-[#2596be] rotate-180' : 'text-slate-300 dark:text-slate-500'}`}><ChevronDown size={28} /></div>
                </button>

                <div className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 md:p-8 pt-0 bg-slate-50/30 dark:bg-slate-800/30">
                      <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm">
                        <div className="flex-grow">
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg md:text-xl border-l-4 pl-6" style={{ borderColor: '#2596be' }}>{section.content}</p>
                        </div>
                        <VoiceReader text={generateSectionTextToSpeech(section)} />
                      </div>
                      <div className="flex items-center gap-2 mb-6 ml-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2596be]"></div>
                        <h4 className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em]">{t('ova.ecosystem.detail_breakdown')}</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {section.details.map((detail, idx) => <DetailCard key={idx} detail={detail} />)}
                      </div>
                      {section.id === 'prompt' && (
                        <div className="mt-8 p-8 bg-[#133c55] text-white rounded-[2rem] text-center shadow-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={120} /></div>
                          <h5 className="font-black mb-6 text-[#2596be] text-sm uppercase tracking-widest">{t('ova.ecosystem.master_formula')}</h5>
                          <div className="flex flex-wrap justify-center gap-3 relative z-10">
                            {[t('ova.ecosystem.formula_role'), t('ova.ecosystem.formula_context'), t('ova.ecosystem.formula_task'), t('ova.ecosystem.formula_format'), t('ova.ecosystem.formula_constraints'), t('ova.ecosystem.formula_examples')].map((elem, i) => (
                              <span key={i} className="px-5 py-2.5 bg-white/5 dark:bg-white/10 hover:bg-white/10 rounded-xl border border-white/10 text-sm font-bold transition-colors">{elem}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="text-center pb-16 pt-8 border-t border-slate-100 dark:border-slate-600 mt-12 px-6">
        <EdutechLogo />
        <p className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">{t('ova.ecosystem.footer')}</p>
      </footer>

    </div>
  );
}
