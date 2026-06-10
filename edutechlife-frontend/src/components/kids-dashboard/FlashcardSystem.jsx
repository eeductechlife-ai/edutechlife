import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
const STORAGE_KEY = 'edutechlife_flashcards';
const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };

const QuizCard = memo(({ card, flipped, onFlip, onResult, idx, total }) => (
  <div className="flex flex-col items-center gap-6">
    <p className="text-sm text-[#64748B]">{idx + 1} / {total}</p>
    <div className="w-full max-w-md h-64 cursor-pointer" style={{ perspective: '1000px' }} onClick={onFlip}>
      <motion.div className="relative w-full h-full" animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }} style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 rounded-2xl bg-white border border-[#E2E8F0] shadow-lg p-6 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}>
          <span className="text-xs font-semibold text-[#4DA8C4] mb-3">FRENTE</span>
          <p className="text-lg font-bold text-[#004B63] text-center">{card.front}</p>
          <p className="text-xs text-[#64748B] mt-4">Toca para ver la respuesta</p>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/30 shadow-lg p-6 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <span className="text-xs font-semibold text-[#66CCCC] mb-3">RESPUESTA</span>
          <p className="text-lg font-bold text-[#004B63] text-center">{card.back}</p>
        </div>
      </motion.div>
    </div>
    <AnimatePresence mode="wait">
      {flipped && (
        <motion.div key="actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-4">
          <motion.button onClick={() => onResult(false)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white border-2 border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50">🔄 Repasar</motion.button>
          <motion.button onClick={() => onResult(true)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md">✅ Sabía</motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));
QuizCard.displayName = 'QuizCard';

const DeckCard = memo(({ deck, onStudy, onEdit, onDelete, index }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
    className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className="min-w-0 flex-1 mr-2">
        <h4 className="font-bold text-[#004B63] truncate">{deck.title}</h4>
        {deck.description && <p className="text-xs text-[#64748B] mt-1 truncate">{deck.description}</p>}
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#4DA8C4]/10 text-[#4DA8C4] whitespace-nowrap shrink-0">{deck.cards.length} tarjetas</span>
    </div>
    {deck.stats?.totalStudied > 0 && (
      <div className="flex gap-3 mb-3 text-xs text-[#64748B]">
        <span>📊 {deck.stats.totalStudied} estudiadas</span>
        <span>✅ {deck.stats.correct} correctas</span>
        <span>🔥 {deck.stats.streak || 0} racha</span>
      </div>
    )}
    <div className="flex gap-2">
      <motion.button onClick={() => onStudy(deck.id)}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="flex-1 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md">📖 Estudiar</motion.button>
      <motion.button onClick={() => onEdit(deck.id)}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm">✏️</motion.button>
      <motion.button onClick={() => onDelete(deck.id)}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="px-4 py-2 bg-white border border-red-200 text-red-400 rounded-xl text-sm">🗑️</motion.button>
    </div>
  </motion.div>
));
DeckCard.displayName = 'DeckCard';

const FlashcardSystem = memo(() => {
  useSmartBoardKids();
  const [mode, setMode] = useState('decks');
  const [decks, setDecks] = useState([]);
  const [currentDeckId, setCurrentDeckId] = useState(null);
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { setDecks(load()); }, []);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(decks)); } catch {} }, [decks]);

  const deck = useMemo(() => decks.find(d => d.id === currentDeckId) || null, [decks, currentDeckId]);
  const saveDecks = useCallback((fn) => setDecks(prev => fn(prev)), []);

  const createDeck = useCallback(() => {
    const title = deckTitle.trim();
    if (!title) return;
    saveDecks(prev => [...prev, { id: id(), title, description: deckDescription.trim(), cards: [],
      createdAt: new Date().toISOString(), stats: { totalStudied: 0, correct: 0, incorrect: 0, streak: 0 } }]);
    setDeckTitle('');
    setDeckDescription('');
  }, [deckTitle, deckDescription, saveDecks]);

  const addCard = useCallback(() => {
    const front = frontText.trim(), back = backText.trim();
    if (!front || !back || !currentDeckId) return;
    saveDecks(prev => prev.map(d => d.id === currentDeckId ? { ...d, cards: [...d.cards, { id: id(), front, back }] } : d));
    setFrontText('');
    setBackText('');
  }, [frontText, backText, currentDeckId, saveDecks]);

  const deleteDeck = useCallback((id) => {
    saveDecks(prev => prev.filter(d => d.id !== id));
    if (currentDeckId === id) setCurrentDeckId(null);
  }, [currentDeckId, saveDecks]);

  const startStudy = useCallback((id) => {
    const d = decks.find(x => x.id === id);
    if (!d || d.cards.length === 0) return;
    setCurrentDeckId(id); setCardIdx(0); setFlipped(false);
    setCorrect(0); setIncorrect(0); setDone(false); setMode('quiz');
  }, [decks]);

  const handleResult = useCallback((known) => {
    if (known) setCorrect(prev => prev + 1); else setIncorrect(prev => prev + 1);
    const d = decks.find(x => x.id === currentDeckId);
    if (!d) return;
    if (cardIdx + 1 >= d.cards.length) {
      setDone(true);
      saveDecks(prev => prev.map(x => x.id === currentDeckId ? { ...x, stats: {
        totalStudied: (x.stats?.totalStudied || 0) + d.cards.length,
        correct: (x.stats?.correct || 0) + (known ? 1 : 0),
        incorrect: (x.stats?.incorrect || 0) + (known ? 0 : 1),
        streak: known ? (x.stats?.streak || 0) + 1 : 0,
      } } : x));
    } else { setCardIdx(prev => prev + 1); setFlipped(false); }
  }, [currentDeckId, cardIdx, decks, saveDecks]);

  const rate = useMemo(() => { const t = correct + incorrect; return t > 0 ? Math.round((correct / t) * 100) : 0; }, [correct, incorrect]);

  if (mode === 'quiz' && deck) {
    if (done) return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-md text-center">
          <span className="text-5xl block mb-4">🎉</span>
          <h3 className="text-lg font-bold text-[#004B63] mb-2">¡Estudio completado!</h3>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mt-4">
            <div className="p-3 rounded-xl bg-[#66CCCC]/10">
              <p className="text-2xl font-black text-[#004B63]">{rate}%</p>
              <p className="text-xs text-[#64748B]">Correctas</p>
            </div>
            <div className="p-3 rounded-xl bg-[#4DA8C4]/10">
              <p className="text-2xl font-black text-[#004B63]">{correct + incorrect}</p>
              <p className="text-xs text-[#64748B]">Revisadas</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6 justify-center">
            <motion.button onClick={() => startStudy(currentDeckId)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md">
              🔄 Estudiar de nuevo
            </motion.button>
            <motion.button onClick={() => setMode('decks')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm">
              Volver
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#004B63]">📖 {deck.title}</h3>
          <motion.button onClick={() => setMode('decks')}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="text-sm text-[#64748B] hover:text-[#004B63]">
            ✕ Cerrar
          </motion.button>
        </div>
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
            initial={{ width: 0 }}
            animate={{ width: `${((cardIdx + 1) / deck.cards.length) * 100}%` }}
          />
        </div>
        <QuizCard card={deck.cards[cardIdx]} flipped={flipped} onFlip={() => setFlipped(prev => !prev)}
          onResult={handleResult} idx={cardIdx} total={deck.cards.length} />
      </motion.div>
    );
  }

  if (mode === 'editor') return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#004B63]">{deck ? '✏️ Editar mazo' : '🆕 Nuevo mazo'}</h3>
        <button onClick={() => { setMode('decks'); setCurrentDeckId(null); }}
          className="text-sm text-[#64748B] hover:text-[#004B63]">✕ Cerrar</button>
      </div>
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div>
          <label className="text-sm font-semibold text-[#004B63] mb-1 block">Nombre del mazo</label>
          <input value={deckTitle} onChange={e => setDeckTitle(e.target.value)}
            placeholder="Ej: Vocabulario Inglés"
            className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]" />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#004B63] mb-1 block">Descripción</label>
          <input value={deckDescription} onChange={e => setDeckDescription(e.target.value)}
            placeholder="Ej: Palabras básicas para el examen"
            className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]" />
        </div>
        <motion.button onClick={createDeck}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md">
          {deck ? '💾 Guardar cambios' : '➕ Crear mazo'}
        </motion.button>
      </div>
      {deck && (
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <h4 className="font-bold text-[#004B63]">Tarjetas ({deck.cards.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {deck.cards.map(c => (
              <div key={c.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-sm font-semibold text-[#004B63]">{c.front}</p>
                <p className="text-xs text-[#64748B] mt-1">{c.back}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
            <h5 className="text-sm font-semibold text-[#004B63]">Agregar tarjeta</h5>
            <input value={frontText} onChange={e => setFrontText(e.target.value)}
              placeholder="Frente (pregunta)"
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]" />
            <input value={backText} onChange={e => setBackText(e.target.value)}
              placeholder="Reverso (respuesta)"
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]" />
            <motion.button onClick={addCard}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-xl font-bold text-sm">
              ➕ Agregar tarjeta
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#004B63]">🎴 Mis Mazos de Estudio</h3>
        {decks.length > 0 && (
          <motion.button onClick={() => { setDeckTitle(''); setDeckDescription(''); setCurrentDeckId(null); setMode('editor'); }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md">
            + Nuevo mazo
          </motion.button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          onClick={() => { setDeckTitle(''); setDeckDescription(''); setCurrentDeckId(null); setMode('editor'); }}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(77, 168, 196, 0.15)' }}
          className="p-5 rounded-2xl border-2 border-dashed border-[#E2E8F0]/50 bg-white/50 backdrop-blur-xl flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:border-[#4DA8C4]/50 transition-all"
        >
          <span className="text-3xl mb-2">➕</span>
          <p className="font-semibold text-[#004B63]">Crear nuevo mazo</p>
          <p className="text-xs text-[#64748B] mt-1">Agrega tarjetas de estudio</p>
        </motion.div>
        {decks.map((d, i) => (
          <DeckCard key={d.id} deck={d} index={i} onStudy={startStudy} onEdit={(id) => { setCurrentDeckId(id); const d2 = decks.find(x => x.id === id); if (d2) { setDeckTitle(d2.title); setDeckDescription(d2.description || ''); } setMode('editor'); }} onDelete={deleteDeck} />
        ))}
      </div>
      {decks.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
          <span className="text-6xl mb-4 block">📚</span>
          <p className="text-[#64748B]">Aún no tienes mazos de estudio</p>
          <p className="text-sm text-[#64748B] mt-2">¡Crea tu primer mazo para empezar a estudiar!</p>
        </motion.div>
      )}
    </motion.div>
  );
});

FlashcardSystem.displayName = 'FlashcardSystem';

export { FlashcardSystem };
export default FlashcardSystem;
