import { useState, useCallback, useMemo } from "react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";

const id = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// SM2 spaced-repetition algorithm (quality: 0=fail, 1=pass)
function sm2Update(card, quality) {
  const q = quality === 1 ? 4 : 1;
  const { interval = 1, repetitions = 0, ef = 2.5 } = card.sm2 || {};
  const newEf = Math.max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  let newInterval, newReps;
  if (q < 3) {
    newInterval = 1;
    newReps = 0;
  } else {
    newReps = repetitions + 1;
    newInterval =
      newReps === 1 ? 1 : newReps === 2 ? 6 : Math.round(interval * newEf);
  }
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  return {
    interval: newInterval,
    repetitions: newReps,
    ef: newEf,
    nextReview: nextReview.toISOString(),
  };
}

function ensureSm2(card) {
  if (card.sm2) return card;
  return {
    ...card,
    sm2: {
      interval: 1,
      repetitions: 0,
      ef: 2.5,
      nextReview: new Date().toISOString(),
    },
  };
}

export function useFlashcardDeck() {
  const { flashcardDecks: decks, setFlashcardDecks: setDecks } =
    useSmartBoardKids();
  const [mode, setMode] = useState("decks");
  const [currentDeckId, setCurrentDeckId] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [multiplayerMode, setMultiplayerMode] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [mpCurrentPlayer, setMpCurrentPlayer] = useState(1);
  const [qIdx, setQIdx] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState("");
  // null = full deck; array = only the due subset
  const [studyQueue, setStudyQueue] = useState(null);

  const deck = useMemo(
    () => decks.find((d) => d.id === currentDeckId) || null,
    [decks, currentDeckId],
  );

  // Cards being studied in the current session
  const activeCards = useMemo(
    () => studyQueue ?? deck?.cards ?? [],
    [studyQueue, deck],
  );

  // Per-deck count of cards due today (never reviewed counts as due)
  const dueToday = useMemo(() => {
    const now = new Date();
    const map = {};
    decks.forEach((d) => {
      map[d.id] = d.cards.filter((c) => {
        if (!c.sm2?.nextReview) return true;
        return new Date(c.sm2.nextReview) <= now;
      }).length;
    });
    return map;
  }, [decks]);

  const saveDecks = useCallback((fn) => setDecks((prev) => fn(prev)), []);

  const rate = useMemo(() => {
    const t = correct + incorrect;
    return t > 0 ? Math.round((correct / t) * 100) : 0;
  }, [correct, incorrect]);

  const createDeck = useCallback(() => {
    const title = deckTitle.trim();
    if (!title) return;
    saveDecks((prev) => [
      ...prev,
      {
        id: id(),
        title,
        description: deckDescription.trim(),
        cards: [],
        createdAt: new Date().toISOString(),
        stats: { totalStudied: 0, correct: 0, incorrect: 0, streak: 0 },
        metadata: {},
      },
    ]);
    setDeckTitle("");
    setDeckDescription("");
  }, [deckTitle, deckDescription, saveDecks]);

  const handleGenerateFlashcards = useCallback(
    (title, cards, metadata) => {
      if (!cards || cards.length === 0) return;
      saveDecks((prev) => [
        ...prev,
        {
          id: id(),
          title,
          description: `Mazo generado con IA - ${metadata.theme?.name || "General"}`,
          cards: cards.map((card) => ({
            id: card.id,
            front: card.front,
            back: card.back,
            example: card.example,
            relatedTerms: card.relatedTerms,
            icon: card.icon,
          })),
          createdAt: new Date().toISOString(),
          stats: { totalStudied: 0, correct: 0, incorrect: 0, streak: 0 },
          metadata: metadata || {},
        },
      ]);
      setMode("decks");
    },
    [saveDecks],
  );

  const addCard = useCallback(() => {
    const front = frontText.trim(),
      back = backText.trim();
    if (!front || !back || !currentDeckId) return;
    saveDecks((prev) =>
      prev.map((d) =>
        d.id === currentDeckId
          ? { ...d, cards: [...d.cards, { id: id(), front, back }] }
          : d,
      ),
    );
    setFrontText("");
    setBackText("");
  }, [frontText, backText, currentDeckId, saveDecks]);

  const deleteDeck = useCallback(
    (deckId) => {
      saveDecks((prev) => prev.filter((d) => d.id !== deckId));
      if (currentDeckId === deckId) setCurrentDeckId(null);
    },
    [currentDeckId, saveDecks],
  );

  const startStudy = useCallback(
    (deckId) => {
      const d = decks.find((x) => x.id === deckId);
      if (!d || d.cards.length === 0) return;
      // Initialize sm2 on any cards that have never been reviewed
      saveDecks((prev) =>
        prev.map((x) =>
          x.id === deckId ? { ...x, cards: x.cards.map(ensureSm2) } : x,
        ),
      );
      setCurrentDeckId(deckId);
      setStudyQueue(null);
      setCardIdx(0);
      setFlipped(false);
      setCorrect(0);
      setIncorrect(0);
      setDone(false);
      setMode("quiz");
    },
    [decks, saveDecks],
  );

  // Study only cards that are due today
  const startStudyDue = useCallback(
    (deckId) => {
      const d = decks.find((x) => x.id === deckId);
      if (!d || d.cards.length === 0) return;
      const now = new Date();
      const initialized = d.cards.map(ensureSm2);
      const dueCards = initialized.filter(
        (c) => !c.sm2?.nextReview || new Date(c.sm2.nextReview) <= now,
      );
      if (dueCards.length === 0) return;
      // Persist sm2 initialization
      saveDecks((prev) =>
        prev.map((x) => (x.id === deckId ? { ...x, cards: initialized } : x)),
      );
      setCurrentDeckId(deckId);
      setStudyQueue(dueCards);
      setCardIdx(0);
      setFlipped(false);
      setCorrect(0);
      setIncorrect(0);
      setDone(false);
      setMode("quiz");
    },
    [decks, saveDecks],
  );

  const handleResult = useCallback(
    (known) => {
      if (multiplayerMode) {
        if (mpCurrentPlayer === 1)
          setScore1((prev) => (known ? prev + 1 : prev));
        else setScore2((prev) => (known ? prev + 1 : prev));
        setMpCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
      }
      if (known) setCorrect((prev) => prev + 1);
      else setIncorrect((prev) => prev + 1);

      const d = decks.find((x) => x.id === currentDeckId);
      if (!d) return;

      const queue = studyQueue ?? d.cards;
      const currentCard = queue[cardIdx];
      const updatedSm2 = currentCard
        ? sm2Update(currentCard, known ? 1 : 0)
        : null;

      const totalInSession = queue.length;
      const isLast = cardIdx + 1 >= totalInSession;

      // Persist sm2 update (and stats when done) in one saveDecks call
      saveDecks((prev) =>
        prev.map((x) => {
          if (x.id !== currentDeckId) return x;
          const updatedCards = updatedSm2
            ? x.cards.map((c) =>
                c.id === currentCard.id ? { ...c, sm2: updatedSm2 } : c,
              )
            : x.cards;
          if (!isLast) return { ...x, cards: updatedCards };
          return {
            ...x,
            cards: updatedCards,
            stats: {
              totalStudied: (x.stats?.totalStudied || 0) + totalInSession,
              correct: (x.stats?.correct || 0) + (known ? 1 : 0),
              incorrect: (x.stats?.incorrect || 0) + (known ? 0 : 1),
              streak: known ? (x.stats?.streak || 0) + 1 : 0,
            },
          };
        }),
      );

      // Also update the in-memory studyQueue so activeCards reflects new sm2
      if (studyQueue && updatedSm2) {
        setStudyQueue((prev) =>
          prev
            ? prev.map((c) =>
                c.id === currentCard.id ? { ...c, sm2: updatedSm2 } : c,
              )
            : prev,
        );
      }

      if (isLast) {
        setDone(true);
      } else {
        setCardIdx((prev) => prev + 1);
        setFlipped(false);
      }
    },
    [
      currentDeckId,
      cardIdx,
      decks,
      saveDecks,
      multiplayerMode,
      mpCurrentPlayer,
      studyQueue,
    ],
  );

  const startMultiplayer = useCallback(() => {
    const first = decks.find((d) => (d.cards?.length || 0) > 0);
    if (!first) return;
    setMultiplayerMode(true);
    setCurrentDeckId(first.id);
    setStudyQueue(null);
    setMode("quiz");
    setScore1(0);
    setScore2(0);
    setMpCurrentPlayer(1);
    setQIdx(0);
    setPlayerAnswer("");
    setCardIdx(0);
    setFlipped(false);
    setDone(false);
  }, [decks]);

  return {
    decks,
    mode,
    setMode,
    currentDeckId,
    setCurrentDeckId,
    deckTitle,
    setDeckTitle,
    deckDescription,
    setDeckDescription,
    frontText,
    setFrontText,
    backText,
    setBackText,
    cardIdx,
    setCardIdx,
    flipped,
    setFlipped,
    correct,
    setCorrect,
    incorrect,
    setIncorrect,
    done,
    setDone,
    multiplayerMode,
    setMultiplayerMode,
    score1,
    setScore1,
    score2,
    setScore2,
    mpCurrentPlayer,
    setMpCurrentPlayer,
    qIdx,
    setQIdx,
    playerAnswer,
    setPlayerAnswer,
    deck,
    activeCards,
    dueToday,
    rate,
    saveDecks,
    createDeck,
    handleGenerateFlashcards,
    addCard,
    deleteDeck,
    startStudy,
    startStudyDue,
    handleResult,
    startMultiplayer,
  };
}
