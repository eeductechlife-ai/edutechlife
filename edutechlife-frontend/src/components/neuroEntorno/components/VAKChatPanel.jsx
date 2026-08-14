import { motion } from 'framer-motion';
import { useVAKChat } from '../useVAKChat';
import ValerioAvatar from '../../ValerioAvatar';

export default function VAKChatPanel() {
    const {
        coachQ,
        setCoachQ,
        coachMsg,
        coachLoad,
        avatarState,
        askCoach,
    } = useVAKChat();

    return (
        <div className="vak-chat-panel max-w-3xl mx-auto p-6">
            <div className="flex flex-col items-center gap-6">
                <ValerioAvatar state={avatarState} size="lg" />
                
                {coachMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-5 shadow-premium-lg border border-[#004B63]/10 w-full"
                    >
                        <p className="text-[#0B2A3A] leading-relaxed">{coachMsg}</p>
                    </motion.div>
                )}
                
                <div className="flex gap-3 w-full">
                    <input
                        type="text"
                        value={coachQ}
                        onChange={(e) => setCoachQ(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && askCoach()}
                        placeholder="Pregunta a MAX sobre tu estilo de aprendizaje..."
                        className="flex-1 px-5 py-3 rounded-full border-2 border-[#004B63]/20 bg-white/90 backdrop-blur-sm focus:border-[#4DA8C4] focus:outline-none text-[#004B63] placeholder:text-[#004B63]/40 transition-all duration-300"
                        disabled={coachLoad}
                    />
                    <button
                        onClick={askCoach}
                        disabled={coachLoad || !coachQ.trim()}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#004B63] to-[#2D7A94] text-white font-bold hover:shadow-premium-lg transition-all duration-300 disabled:opacity-50"
                    >
                        {coachLoad ? (
                            <i className="fa-solid fa-spinner animate-spin" />
                        ) : (
                            <i className="fa-solid fa-paper-plane" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
