import { memo } from 'react';
import { motion } from 'framer-motion';

const GlitchText = ({ 
  text, 
  className = '',
  enableOnHover = false,
  glitchSpeed = 0.1,
  colors = {
    primary: '#4DA8C4',
    secondary: '#66CCCC',
  }
}) => {
  const letterVariants = {
    initial: { opacity: 0 },
    animate: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.02,
      },
    }),
  };

  const glitchChars = ['!', '@', '#', '$', '%', '&', '*', '?', '0', '1'];

  const getGlitchChar = (index) => {
    return glitchChars[index % glitchChars.length];
  };

  if (enableOnHover) {
    return (
      <span 
        className={`inline-block relative cursor-default ${className}`}
        data-text={text}
      >
        <motion.span
          className="relative z-10"
          initial="initial"
          whileHover="animate"
        >
          {text.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
        
        <span 
          className="absolute inset-0 text-cyan-400 opacity-0 hover:opacity-70"
          aria-hidden="true"
          style={{ 
            animation: `glitch-skew ${glitchSpeed}s steps(10) infinite`,
            clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          }}
        >
          {text.split('').map((char, i) => (
            <span key={i}>{char === ' ' ? '\u00A0' : getGlitchChar(i)}</span>
          ))}
        </span>
        
        <span 
          className="absolute inset-0 text-mint-400 opacity-0 hover:opacity-70"
          aria-hidden="true"
          style={{ 
            animation: `glitch-skew-reverse ${glitchSpeed}s steps(10) infinite`,
            clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          }}
        >
          {text.split('').map((char, i) => (
            <span key={i}>{char === ' ' ? '\u00A0' : getGlitchChar(i + 5)}</span>
          ))}
        </span>

        <style>{`
          @keyframes glitch-skew {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 1px); }
            40% { transform: translate(2px, -1px); }
            60% { transform: translate(-1px, 2px); }
            80% { transform: translate(1px, -2px); }
          }
          @keyframes glitch-skew-reverse {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(2px, -1px); }
            40% { transform: translate(-2px, 1px); }
            60% { transform: translate(1px, -2px); }
            80% { transform: translate(-1px, 2px); }
          }
        `}</style>
      </span>
    );
  }

  return (
    <span 
      className={`inline-block relative ${className}`}
      data-text={text}
    >
      <span className="relative z-10">{text}</span>
      
      <span 
        className="absolute inset-0 text-cyan-400 opacity-50"
        aria-hidden="true"
        style={{ 
          animation: `glitch-skew ${glitchSpeed}s steps(10) infinite`,
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
        }}
      >
        {text.split('').map((char, i) => (
          <span key={i}>{char === ' ' ? '\u00A0' : getGlitchChar(i)}</span>
        ))}
      </span>
      
      <span 
        className="absolute inset-0 text-mint-400 opacity-50"
        aria-hidden="true"
        style={{ 
          animation: `glitch-skew-reverse ${glitchSpeed}s steps(10) infinite`,
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
        }}
      >
        {text.split('').map((char, i) => (
          <span key={i}>{char === ' ' ? '\u00A0' : getGlitchChar(i + 5)}</span>
        ))}
      </span>

      <style>{`
        @keyframes glitch-skew {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, 2px); }
          80% { transform: translate(1px, -2px); }
        }
        @keyframes glitch-skew-reverse {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -1px); }
          40% { transform: translate(-2px, 1px); }
          60% { transform: translate(1px, -2px); }
          80% { transform: translate(-1px, 2px); }
        }
      `}</style>
    </span>
  );
};

GlitchText.displayName = 'GlitchText';

export default memo(GlitchText);
