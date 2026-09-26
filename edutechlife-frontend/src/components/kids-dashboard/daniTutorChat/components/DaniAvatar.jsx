import { memo } from "react";
import DaniCharacter from "../../dani/DaniCharacter";

// Chat avatar for Dani: the v3 brand character inside a round navy chip.
// `studentAge` is kept for API compatibility — the v3 design is shared by all ages (6–16).
const SIZES = { sm: 40, md: 56, lg: 80 };

const DaniAvatar = memo(
  // eslint-disable-next-line no-unused-vars
  ({
    studentAge = 10,
    isThinking = false,
    isSpeaking = false,
    size = "lg",
  }) => {
    const px = SIZES[size] || SIZES.lg;
    return (
      <div
        className="dani-avatar relative flex items-center justify-center rounded-full flex-shrink-0"
        style={{
          width: px,
          height: px,
          background:
            "radial-gradient(circle at 35% 30%, #1E3F73 0%, #0B1D3A 70%)",
          boxShadow:
            "0 0 0 2px rgba(111,240,255,0.45), 0 4px 14px rgba(3,10,30,0.35)",
        }}
      >
        <DaniCharacter
          size={Math.round(px * 0.9)}
          mood={isThinking ? "thinking" : "happy"}
          talking={isSpeaking}
          title="Dani"
        />
      </div>
    );
  },
);

DaniAvatar.displayName = "DaniAvatar";

export default DaniAvatar;
