import { useState, useCallback, useMemo } from "react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";

const id = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

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

  const deck = useMemo(
    () => decks.find((d) => d.id === currentDeckId) || null,
    [decks, currentDeckId],
  );

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
    (id) => {
      saveDecks((prev) => prev.filter((d) => d.id !== id));
      if (currentDeckId === id) setCurrentDeckId(null);
    },
    [currentDeckId, saveDecks],
  );

  const startStudy = useCallback(
    (id) => {
      const d = decks.find((x) => x.id === id);
      if (!d || d.cards.length === 0) return;
      setCurrentDeckId(id);
      setCardIdx(0);
      setFlipped(false);
      setCorrect(0);
      setIncorrect(0);
      setDone(false);
      setMode("quiz");
    },
    [decks],
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
      if (cardIdx + 1 >= d.cards.length) {
        setDone(true);
        saveDecks((prev) =>
          prev.map((x) =>
            x.id === currentDeckId
              ? {
                  ...x,
                  stats: {
                    totalStudied:
                      (x.stats?.totalStudied || 0) + d.cards.length,
                    correct:
                      (x.stats?.correct || 0) + (known ? 1 : 0),
                    incorrect:
                      (x.stats?.incorrect || 0) + (known ? 0 : 1),
                    streak: known
                      ? (x.stats?.streak || 0) + 1
                      : 0,
                  },
                }
              : x,
          ),
        );
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
    ],
  );

  const startMultiplayer = useCallback(() => {
    const first = decks.find((d) => (d.cards?.length || 0) > 0);
    if (!first) return;
    setMultiplayerMode(true);
    setCurrentDeckId(first.id);
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
    rate,
    saveDecks,
    createDeck,
    handleGenerateFlashcards,
    addCard,
    deleteDeck,
    startStudy,
    handleResult,
    startMultiplayer,
  };
}
