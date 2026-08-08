import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";

const FlashcardImporter = memo(({ decks, saveDecks, onStartMultiplayer }) => {
  const { t } = useTranslation();
  const [showImport, setShowImport] = useState(false);
  const [importCode, setImportCode] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const handleShare = () => {
    const deck = decks[0];
    const code =
      deck.shareCode ||
      Math.random().toString(36).substring(2, 8).toUpperCase();
    if (!deck.shareCode) {
      const updated = { ...deck, shareCode: code };
      saveDecks((prev) => prev.map((d) => (d.id === deck.id ? updated : d)));
    }
    navigator.clipboard.writeText(code);
    setShareMessage(t("kid.flashcards.code_copied"));
    setTimeout(() => setShareMessage(""), 2000);
  };

  const handleImport = () => {
    const allDecks = [
      ...decks,
      ...JSON.parse(localStorage.getItem("edutechlife_shared_decks") || "[]"),
    ];
    const found = allDecks.find((d) => d.shareCode === importCode);
    if (found) {
      saveDecks((prev) => {
        const exists = prev.some((d) => d.shareCode === importCode);
        if (!exists) {
          return [
            ...prev,
            { ...found, id: `${found.id}_imported_${Date.now()}` },
          ];
        }
        return prev;
      });
      setShowImport(false);
      setImportCode("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-sm font-bold"
        >
          {t("kid.flashcards.share_deck")}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowImport(true)}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD166] to-[#FFB300] text-white text-sm font-bold"
        >
          {t("kid.flashcards.import_deck")}
        </motion.button>
      </div>
      {shareMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-center text-[#4DA8C4] font-semibold"
        >
          {shareMessage}
        </motion.p>
      )}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStartMultiplayer}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B9D] to-[#A855F7] text-white text-sm font-bold flex items-center justify-center gap-2"
      >
        {t("kid.flashcards.two_player_mode")}
      </motion.button>

      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImport(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="p-6 rounded-2xl max-w-sm w-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#004B63] mb-4">
                {t("kid.flashcards.import_deck")}
              </h3>
              <input
                value={importCode}
                onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                placeholder="Ej: F3K7M9"
                maxLength={6}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-center text-lg font-bold tracking-widest mb-4 bg-[#F8FAFC] text-[#004B63]"
              />
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowImport(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#64748B]"
                >
                  {t("kid.flashcards.cancel")}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleImport}
                  disabled={importCode.length < 4}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-sm font-bold disabled:opacity-50"
                >
                  {t("kid.flashcards.import_btn")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FlashcardImporter.displayName = "FlashcardImporter";

export default FlashcardImporter;
