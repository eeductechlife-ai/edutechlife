import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DaniCharacter from "./dani/DaniCharacter";

// ==========================================
// Dani Avatar — Main Protagonist (brand character v3 inside a glowing chip)
// ==========================================
const moodConfig = {
  happy: { face: "happy", glow: "rgba(0, 194, 224, 0.45)", scale: 1 },
  thinking: {
    face: "thinking",
    glow: "rgba(255, 209, 102, 0.45)",
    scale: 1.03,
  },
  explaining: {
    face: "happy",
    glow: "rgba(67, 97, 238, 0.45)",
    scale: 1.05,
    talking: true,
  },
  empathetic: { face: "happy", glow: "rgba(123, 47, 247, 0.4)", scale: 1.03 },
  celebrating: {
    face: "celebrating",
    glow: "rgba(255, 209, 102, 0.6)",
    scale: 1.08,
  },
};

const SIZES = { sm: 48, md: 80, lg: 128, xl: 192 };

const DaniAvatar3D = memo(
  ({ mood = "happy", isTyping = false, isSpeaking = false, size = "lg" }) => {
    const [isHovered, setIsHovered] = useState(false);
    const config = moodConfig[mood] || moodConfig.happy;
    const px = SIZES[size] || SIZES.lg;

    return (
      <motion.div
        className="relative rounded-full flex items-center justify-center cursor-pointer"
        style={{ width: px, height: px }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTapStart={() => setIsHovered(true)}
        onTapCancel={() => setIsHovered(false)}
        animate={{ scale: isHovered ? 1.08 : config.scale }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: config.glow, filter: "blur(18px)" }}
          animate={{
            opacity: isHovered ? 0.9 : 0.6,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Chip */}
        <div
          className="relative z-10 w-full h-full rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #1E3F73 0%, #0B1D3A 72%)",
            boxShadow:
              "0 0 0 2px rgba(111,240,255,0.5), 0 10px 26px rgba(3,10,30,0.35)",
          }}
        >
          <DaniCharacter
            size={Math.round(px * 0.9)}
            mood={isTyping ? "thinking" : config.face}
            talking={isSpeaking || !!config.talking}
            title="Dani"
          />
        </div>

        {/* Speaking — audio rings */}
        <AnimatePresence>
          {isSpeaking &&
            [0, 1, 2].map((i) => (
              <motion.div
                key={`wave-${i}`}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{
                  scale: [1, 1.5 + i * 0.25, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border-2 border-[#6FF0FF] z-0"
              />
            ))}
        </AnimatePresence>
      </motion.div>
    );
  },
);

DaniAvatar3D.displayName = "DaniAvatar3D";

export default DaniAvatar3D;
