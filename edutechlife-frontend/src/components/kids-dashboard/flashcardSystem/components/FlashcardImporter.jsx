import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const PRACTICE_GRADIENT =
  "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)";

const FlashcardImporter = memo(
  ({ decks, saveDecks, onStartMultiplayer, darkMode = false }) => {
    const { t } = useTranslation();
    const [showImport, setShowImport] = useState(false);
    const [importCode, setImportCode] = useState("");
    const [shareMessage, setShareMessage] = useState("");

    const textSecondary = darkMode ? "#94A3B8" : "#64748B";
    const borderColor = darkMode ? "rgba(42,58,84,0.6)" : "#E2E8F0";
    const btnNeutralBg = darkMode ? "rgba(42,58,84,0.5)" : "#F8FAFC";

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
      <div className="space-y-3">
        {/* Divider label */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: borderColor }} />
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: textSecondary }}
          >
            Más opciones
          </span>
          <div className="flex-1 h-px" style={{ background: borderColor }} />
        </div>

        {/* Action row */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
            style={{
              background: btnNeutralBg,
              border: `1px solid ${borderColor}`,
              color: textSecondary,
            }}
          >
            📤 {t("kid.flashcards.share_deck")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowImport(true)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
            style={{
              background: btnNeutralBg,
              border: `1px solid ${borderColor}`,
              color: textSecondary,
            }}
          >
            📥 {t("kid.flashcards.import_deck")}
          </motion.button>
        </div>

        {shareMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-center font-semibold"
            style={{ color: "#FF6B9D" }}
          >
            {shareMessage}
          </motion.p>
        )}

        {/* Multiplayer — highlighted */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartMultiplayer}
          className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md"
          style={{
            background: PRACTICE_GRADIENT,
            boxShadow: "0 4px 16px rgba(239,71,111,0.25)",
          }}
        >
          🆚 {t("kid.flashcards.two_player_mode")}
        </motion.button>

        {/* Import modal */}
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="p-6 rounded-2xl max-w-sm w-full shadow-xl"
                style={{ background: darkMode ? "#1E293B" : "#ffffff" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: darkMode ? "#F1F5F9" : "#004B63" }}
                >
                  📥 {t("kid.flashcards.import_deck")}
                </h3>
                <p className="text-xs mb-4" style={{ color: textSecondary }}>
                  Ingresa el código de 6 letras del mazo
                </p>
                <input
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                  placeholder="Ej: F3K7M9"
                  maxLength={6}
                  className="w-full p-3 rounded-xl text-center text-xl font-black tracking-[0.3em] mb-4 focus:outline-none"
                  style={{
                    background: darkMode ? "#151F32" : "#F8FAFC",
                    border: `2px solid ${importCode.length >= 4 ? "#FF6B9D" : borderColor}`,
                    color: darkMode ? "#F1F5F9" : "#004B63",
                    transition: "border-color 0.2s",
                  }}
                />
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowImport(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                    style={{
                      background: darkMode ? "rgba(42,58,84,0.5)" : "#F8FAFC",
                      border: `1px solid ${borderColor}`,
                      color: textSecondary,
                    }}
                  >
                    {t("kid.flashcards.cancel")}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleImport}
                    disabled={importCode.length < 4}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-40"
                    style={{ background: PRACTICE_GRADIENT }}
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
  },
);

FlashcardImporter.displayName = "FlashcardImporter";
export default FlashcardImporter;
