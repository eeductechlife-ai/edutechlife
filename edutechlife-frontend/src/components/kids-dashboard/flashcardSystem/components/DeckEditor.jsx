import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const DeckEditor = memo(
  ({
    deck,
    deckTitle,
    setDeckTitle,
    deckDescription,
    setDeckDescription,
    createDeck,
    frontText,
    setFrontText,
    backText,
    setBackText,
    addCard,
    onClose,
  }) => {
    const { t } = useTranslation();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#004B63]">
            {deck
              ? t("kid.flashcards.edit_deck")
              : t("kid.flashcards.new_deck")}
          </h3>
          <button
            onClick={onClose}
            className="text-sm text-[#64748B] hover:text-[#004B63]"
          >
            ✕ {t("common.close")}
          </button>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#004B63] mb-1 block">
              {t("kid.flashcards.deck_name")}
            </label>
            <input
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              placeholder={t("kid.flashcards.deck_name_placeholder")}
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#004B63] mb-1 block">
              {t("kid.flashcards.deck_description")}
            </label>
            <input
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              placeholder={t("kid.flashcards.deck_description_placeholder")}
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
            />
          </div>
          <motion.button
            onClick={createDeck}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md"
          >
            {deck
              ? t("kid.flashcards.save_changes")
              : t("kid.flashcards.create_deck")}
          </motion.button>
        </div>
        {deck && (
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="font-bold text-[#004B63]">
              {t("kid.flashcards.cards_label", { count: deck.cards.length })}
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {deck.cards.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <p className="text-sm font-semibold text-[#004B63]">
                    {c.front}
                  </p>
                  <p className="text-xs text-[#64748B] mt-1">{c.back}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
              <h5 className="text-sm font-semibold text-[#004B63]">
                {t("kid.flashcards.add_card")}
              </h5>
              <input
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder={t("kid.flashcards.card_front_placeholder")}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
              />
              <input
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                placeholder={t("kid.flashcards.card_back_placeholder")}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
              />
              <motion.button
                onClick={addCard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-xl font-bold text-sm"
              >
                {t("kid.flashcards.add_card_btn")}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    );
  },
);

DeckEditor.displayName = "DeckEditor";

export default DeckEditor;
