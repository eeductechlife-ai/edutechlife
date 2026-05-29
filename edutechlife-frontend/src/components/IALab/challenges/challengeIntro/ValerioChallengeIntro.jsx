import React from 'react';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import VoiceReader from '../../VoiceReader';

const INTRO_TEXTS = {
  2: {
    es: "Bienvenido al desafío de ChatGPT. Aquí aprenderás a crear tu propio GPT personalizado. El desafío tiene 3 pasos: Primero, analizarás un caso de negocio y elegirás cuál automatizar. Segundo, configurarás las instrucciones, conocimientos y capacidades de tu GPT. Tercero, definirás una función para conectarlo con una API externa usando Function Calling. ¡Manos a la obra!",
    en: "Welcome to the ChatGPT challenge. You will create your own custom GPT. The challenge has 3 steps: First, analyze a business case and choose which to automate. Second, configure instructions, knowledge, and capabilities for your GPT. Third, define a function to connect it with an external API using Function Calling. Let's get started!"
  },
  3: {
    es: "Bienvenido al desafío de Gemini. Te convertirás en un investigador digital. El desafío tiene 4 pasos: Primero, elegirás un tema y formularás una pregunta de investigación. Segundo, analizarás fuentes multimodales y extraerás datos clave. Tercero, verificarás la veracidad de distintas afirmaciones. Cuarto, redactarás un informe profesional con tus conclusiones. ¡A investigar!",
    en: "Welcome to the Gemini challenge. You will become a digital researcher. The challenge has 4 steps: First, choose a topic and formulate a research question. Second, analyze multimodal sources and extract key data. Third, verify the truthfulness of different claims. Fourth, write a professional report with your conclusions. Let's research!"
  },
  4: {
    es: "Bienvenido al desafío de NotebookLM. Aprenderás a curar información y crear un podcast académico. El desafío tiene 3 pasos: Primero, seleccionarás hasta 4 documentos y extraerás el insight clave de cada uno. Segundo, responderás preguntas de síntesis conectando ideas entre documentos. Tercero, estructurarás un guión de podcast con introducción, puntos clave y conclusión. ¡Tu voz y tu conocimiento al poder!",
    en: "Welcome to the NotebookLM challenge. You will curate information and create an academic podcast. The challenge has 3 steps: First, select up to 4 documents and extract key insights. Second, answer synthesis questions connecting ideas across documents. Third, structure a podcast script with an introduction, key points, and conclusion. Your voice and knowledge!"
  },
  5: {
    es: "Bienvenido al desafío de Ética en IA. Analizarás un caso real de sesgo algorítmico y diseñarás soluciones. El desafío tiene 3 pasos: Primero, leerás un caso de estudio e identificarás qué tipos de sesgo están presentes y en qué etapa del pipeline ocurrieron. Segundo, analizarás el impacto en las personas afectadas y las causas raíz del problema. Tercero, diseñarás un protocolo ético con principios, medidas de prevención, mitigación y monitoreo. ¡Construyamos una IA responsable!",
    en: "Welcome to the AI Ethics challenge. You will analyze a real case of algorithmic bias and design solutions. The challenge has 3 steps: First, read a case study and identify which types of bias are present and at what pipeline stage they occurred. Second, analyze the impact on affected people and the root causes. Third, design an ethical protocol with principles, prevention measures, mitigation, and monitoring. Let's build responsible AI!"
  }
};

const ValerioChallengeIntro = ({ moduleId, onStart, t, locale: localeProp }) => {
  const { locale: ctxLocale } = useTranslation();
  const locale = localeProp || ctxLocale || 'es';
  const moduleTexts = INTRO_TEXTS[moduleId];
  const text = moduleTexts?.[locale] || moduleTexts?.es || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-12">
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-lg shadow-corporate/20">
            <Icon name="fa-robot" className="text-white text-4xl" />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-emerald-400 border-4 border-white flex items-center justify-center">
          <Icon name="fa-check" className="text-white text-sm" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
        {t('ialab.challenge.valerio_intro_title')}
      </h2>
      <p className="text-sm font-medium text-corporate mb-6 text-center">
        {t('ialab.challenge.valerio_intro_subtitle')}
      </p>

      <div className="max-w-2xl w-full bg-white dark:bg-navy-800 rounded-2xl shadow-xl border border-slate-100 dark:border-navy-700 p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="fa-quote-left" className="text-white text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{text}"
            </p>
          </div>
        </div>

        {text && (
          <div className="mt-4 flex justify-end">
            <VoiceReader text={text} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-lg w-full mb-8">
        <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-4 text-center border border-petroleum/10">
          <Icon name="fa-brain" className="text-corporate text-xl mb-2 mx-auto" />
          <p className="text-[10px] font-semibold text-petroleum dark:text-slate-300 uppercase tracking-wider">
            {t('ialab.challenge.valerio_label_apply')}
          </p>
        </div>
        <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-4 text-center border border-petroleum/10">
          <Icon name="fa-star" className="text-amber-500 text-xl mb-2 mx-auto" />
          <p className="text-[10px] font-semibold text-petroleum dark:text-slate-300 uppercase tracking-wider">
            {t('ialab.challenge.valerio_label_practice')}
          </p>
        </div>
        <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-4 text-center border border-petroleum/10">
          <Icon name="fa-trophy" className="text-amber-500 text-xl mb-2 mx-auto" />
          <p className="text-[10px] font-semibold text-petroleum dark:text-slate-300 uppercase tracking-wider">
            {t('ialab.challenge.valerio_label_challenge')}
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-10 py-4 bg-gradient-to-r from-petroleum to-corporate text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-corporate/25 transition-all duration-300 active:scale-[0.98] flex items-center gap-3"
      >
        <Icon name="fa-play-circle" className="text-xl" />
        {t('ialab.challenge.valerio_start')}
      </button>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 text-center">
        {t('ialab.challenge.valerio_estimated_time')}
      </p>
    </div>
  );
};

export default ValerioChallengeIntro;
