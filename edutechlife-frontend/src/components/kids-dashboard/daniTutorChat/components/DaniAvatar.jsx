import { memo } from "react";
import { motion } from "framer-motion";

const DaniAvatar = memo(
  ({ studentAge = 10, isThinking = false, size = "lg" }) => {
    // Determine avatar style based on age
    const getAvatarStyle = () => {
      if (studentAge <= 9) return "cartoon";
      if (studentAge <= 13) return "smart";
      return "professional";
    };

    const avatarStyle = getAvatarStyle();

    const sizeMap = {
      sm: { container: 40, emoji: 24 },
      md: { container: 56, emoji: 32 },
      lg: { container: 80, emoji: 48 },
    };

    const { container, emoji } = sizeMap[size];

    // Animation for thinking state
    const breathingAnimation = {
      scale: isThinking ? [1, 1.05, 1] : 1,
      transition: {
        duration: 2,
        repeat: isThinking ? Infinity : 0,
        ease: "easeInOut",
      },
    };

    const renderAvatar = () => {
      switch (avatarStyle) {
        case "cartoon":
          // Cartoon avatar for ages 6-9: Friendly, colorful
          return (
            <svg
              width={container}
              height={container}
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head */}
              <circle cx="40" cy="40" r="32" fill="#06B6D4" opacity="0.2" />
              <circle cx="40" cy="35" r="28" fill="#06B6D4" />

              {/* Eyes - Big and friendly */}
              <circle cx="32" cy="30" r="6" fill="white" />
              <circle cx="48" cy="30" r="6" fill="white" />
              <circle cx="32" cy="30" r="3.5" fill="#1E293B" />
              <circle cx="48" cy="30" r="3.5" fill="#1E293B" />

              {/* Eyebrows - Happy */}
              <path
                d="M 26 24 Q 32 22 38 24"
                stroke="#1E293B"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 42 24 Q 48 22 54 24"
                stroke="#1E293B"
                strokeWidth="2"
                fill="none"
              />

              {/* Smile - Big and cheerful */}
              <path
                d="M 28 48 Q 40 58 52 48"
                stroke="#1E293B"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Rosy cheeks */}
              <circle cx="18" cy="40" r="5" fill="#FB7185" opacity="0.4" />
              <circle cx="62" cy="40" r="5" fill="#FB7185" opacity="0.4" />

              {/* Star accent */}
              <g transform="translate(60, 15)">
                <path
                  d="M 0 -8 L 2.4 -2.4 L 8 -1.2 L 3.2 3.2 L 4.8 8.8 L 0 5.6 L -4.8 8.8 L -3.2 3.2 L -8 -1.2 L -2.4 -2.4 Z"
                  fill="#FCD34D"
                />
              </g>
            </svg>
          );

        case "smart":
          // Smart avatar for ages 10-13: Intelligent but friendly
          return (
            <svg
              width={container}
              height={container}
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head background */}
              <circle cx="40" cy="40" r="32" fill="#0EA5E9" opacity="0.15" />
              <circle cx="40" cy="35" r="28" fill="#0EA5E9" />

              {/* Eyes - Smart and attentive */}
              <rect x="28" y="26" width="8" height="10" rx="2" fill="white" />
              <rect x="44" y="26" width="8" height="10" rx="2" fill="white" />
              <circle cx="32" cy="31" r="3" fill="#1E293B" />
              <circle cx="48" cy="31" r="3" fill="#1E293B" />

              {/* Eyebrows - Confident */}
              <rect x="25" y="20" width="12" height="2" rx="1" fill="#1E293B" />
              <rect x="43" y="20" width="12" height="2" rx="1" fill="#1E293B" />

              {/* Smile - Confident and warm */}
              <path
                d="M 28 50 Q 40 56 52 50"
                stroke="#1E293B"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Technology accent - circuit */}
              <circle cx="70" cy="20" r="6" fill="#F97316" opacity="0.7" />
              <path
                d="M 60 20 L 65 20"
                stroke="#F97316"
                strokeWidth="1"
                opacity="0.7"
              />
              <path
                d="M 75 20 L 80 20"
                stroke="#F97316"
                strokeWidth="1"
                opacity="0.7"
              />
            </svg>
          );

        case "professional":
          // Professional avatar for ages 14-16: Mentor-like, modern
          return (
            <svg
              width={container}
              height={container}
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head background */}
              <circle cx="40" cy="40" r="32" fill="#6366F1" opacity="0.15" />
              <circle cx="40" cy="35" r="28" fill="#6366F1" />

              {/* Professional eyes - Focused */}
              <ellipse cx="32" cy="32" rx="5" ry="6" fill="white" />
              <ellipse cx="48" cy="32" rx="5" ry="6" fill="white" />
              <circle cx="32" cy="32" r="2.5" fill="#1E293B" />
              <circle cx="48" cy="32" r="2.5" fill="#1E293B" />

              {/* Subtle eyebrows - Professional */}
              <path
                d="M 26 26 L 36 25"
                stroke="#1E293B"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M 44 25 L 54 26"
                stroke="#1E293B"
                strokeWidth="1.5"
                opacity="0.6"
              />

              {/* Slight smile - Approachable */}
              <path
                d="M 30 50 Q 40 54 50 50"
                stroke="#1E293B"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Professional badge */}
              <circle cx="68" cy="22" r="7" fill="#F97316" />
              <text
                x="68"
                y="27"
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
              >
                ✓
              </text>
            </svg>
          );

        default:
          return null;
      }
    };

    return (
      <motion.div
        animate={breathingAnimation}
        className="dani-avatar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderAvatar()}

        {/* Thinking indicator */}
        {isThinking && (
          <motion.div
            className="dani-thinking-indicator"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: "absolute",
              bottom: -12,
              fontSize: "12px",
            }}
          >
            ✨
          </motion.div>
        )}
      </motion.div>
    );
  },
);

DaniAvatar.displayName = "DaniAvatar";

export default DaniAvatar;
