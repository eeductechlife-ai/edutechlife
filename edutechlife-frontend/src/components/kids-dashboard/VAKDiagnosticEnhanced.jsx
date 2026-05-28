import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import { useTranslation } from '../../i18n/I18nProvider';

// ==========================================
// VAK Diagnostic Enhanced - 20 Questions
// ==========================================

const questions = [
  { q: '¿Prefieres leer las instrucciones o que te las expliquen?', v: 'Leer', a: 'Que expliquen', k: 'Empezar a hacer' },
  { q: 'Al estudiar, ¿qué te ayuda más?', v: 'Diagramas y colores', a: 'Explicaciones orales', k: 'Tocar y manipular' },
  { q: 'En clase, ¿cómo prestas más atención?', v: 'Mirando la pizarra', a: 'Escuchando atentamente', k: 'Tomando apuntes activamente' },
  { q: '¿Cómo recordás mejor un evento?', v: 'Por fotos del evento', a: 'Por conversaciones sobre ello', k: 'Por lo que hiciste en el evento' },
  { q: 'Al armar algo nuevo, ¿qué prefieres?', v: 'Instrucciones escritas', a: 'Alguien que explique', k: 'Mirar el modelo y armar' },
  { q: '¿Cómo prefieres aprender un deporte?', v: 'Viendo videos tutoriales', a: 'Escuchando consejos', k: 'Practicando un poco' },
  { q: 'Al leer un libro, ¿qué hacés más?', v: 'Libros con muchas imágenes', a: 'Audiolibros', k: 'Leer e ir actuando la historia' },
  { q: '¿Cómo resolés un problema complejo?', v: 'Dibujando un esquema', a: 'Hablando del problema', k: 'Probando diferentes soluciones' },
  { q: '¿Qué tipo de clase prefieres?', v: 'Con muchas diapositivas', a: 'Con debates y discusiones', k: 'Con experimentos y prácticas' },
  { q: 'Al memorizar, ¿qué hacés?', v: 'Subrayás con colores', a: 'Repetís en voz alta', k: 'Caminás mientras estudiás' },
  { q: '¿Cómo organizás tus ideas?', v: 'Mapas mentales', a: 'Hablando con otros', k: 'Haciendo un proyecto' },
  { q: '¿Qué te resulta más fácil?', v: 'Seguir un gráfico', a: 'Seguir instrucciones orales', k: 'Seguir un ejemplo práctico' },
  { q: 'En un museo, ¿qué hacés más?', v: 'Mirás todas las obras', a: 'Escuchás el audio guía', k: 'Participás en actividades interactivas' },
  { q: '¿Cómo prefieres comunicarte?', v: 'Mensajes de texto', a: 'Llamadas o audios', k: 'Charlas presenciales' },
  { q: 'Al estudiar para un examen, ¿qué hacés?', v: 'Hacés resúmenes visuales', a: 'Grabás y escuchás tus notas', k: 'Hacés simulacros prácticos' },
  { q: '¿Qué tipo de juegos preferís?', v: 'Juegos de mesa con tablero', a: 'Juegos de palabras/habla', k: 'Juegos de acción/movimiento' },
  { q: 'Al armar un rompecabezas, ¿cómo hacés?', v: 'Mirás la imagen completa', a: 'Leés las instrucciones', k: 'Probás piezas hasta que encajen' },
  { q: '¿Cómo aprendés mejor un idioma?', v: 'Con libros y ejercicios escritos', a: 'Conversando con nativos', k: 'Viajando al país' },
  { q: '¿Qué necesitás para concentrarte?', v: 'Un espacio visualmente ordenado', a: 'Silencio o música de fondo', k: 'Podés moverte o estar cómodo' },
  { q: 'Al terminar una tarea, ¿cómo celebrás?', v: 'Mostrando tu trabajo', a: 'Contándoselo a otros', k: 'Haciendo una celebración especial' },
];

const VAKDiagnosticEnhanced = ({ vakResult, onComplete }) => {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(!!vakResult);
  const { addPoints } = useSmartBoardKids();

  const handleAnswer = useCallback((type) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate VAK scores
      const scores = { visual: 0, auditivo: 0, kinestesico: 0 };
      newAnswers.forEach(answer => {
        scores[answer]++;
      });

      const total = newAnswers.length;
      const result = {
        visual: Math.round((scores.visual / total) * 100),
        auditivo: Math.round((scores.auditivo / total) * 100),
        kinestesico: Math.round((scores.kinestesico / total) * 100),
      };

      const predominantStyle = Object.entries(result).sort((a, b) => b[1] - a[1])[0][0];
      
      const vakResultData = {
        scores: result,
        predominantStyle,
        completedAt: new Date(),
      };

      setIsCompleted(true);
      onComplete(vakResultData);
      addPoints(300, 'Completó diagnóstico VAK');
    }
  }, [currentQuestion, answers, onComplete, addPoints]);

  if (isCompleted && vakResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-[#004B63] mb-2">{t('kid.vak.result_title')}</h3>
        <p className="text-lg text-[#4DA8C4] font-semibold mb-6">
          {t('kid.vak.result_subtitle')} {vakResult.predominantStyle.toUpperCase()}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(vakResult.scores).map(([key, value]) => (
            <div key={key} className="p-4 bg-[#F8FAFC] rounded-xl">
              <p className="text-3xl font-black text-[#4DA8C4]">{value}%</p>
              <p className="text-xs text-[#64748B] mt-1">
                {key === 'visual' ? t('kid.vak.style_visual') : key === 'auditivo' ? t('kid.vak.style_auditory') : t('kid.vak.style_kinesthetic')}
              </p>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-[#64748B]">
          {t('kid.vak.result_message')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0]">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-[#004B63]">{t('kid.vak.diagnostic_title')}</h3>
          <span className="text-sm text-[#64748B]">{currentQuestion + 1}/{questions.length}</span>
        </div>
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <p className="text-xl text-[#004B63] font-semibold mb-6">{questions[currentQuestion].q}</p>
        
        <div className="space-y-3">
          {[
            { type: 'visual', label: questions[currentQuestion].v, emoji: '👁️', color: '#4DA8C4' },
            { type: 'auditivo', label: questions[currentQuestion].a, emoji: '👂', color: '#66CCCC' },
            { type: 'kinestesico', label: questions[currentQuestion].k, emoji: '🏃', color: '#FFD166' },
          ].map((option) => (
            <motion.button
              key={option.type}
              onClick={() => handleAnswer(option.type)}
              className="w-full p-4 bg-[#F8FAFC] rounded-xl border-2 border-[#E2E8F0] hover:border-[#4DA8C4]/50 text-left transition-all flex items-center gap-3"
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="font-medium text-[#004B63]">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export { VAKDiagnosticEnhanced };
export default VAKDiagnosticEnhanced;
