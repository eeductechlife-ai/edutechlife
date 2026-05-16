import { motion } from 'framer-motion';

const HeroIpad = ({ mousePos }) => {
  const screenParticles = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl relative"
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px',
          willChange: 'transform',
          transform: `rotateX(${(mousePos.y - 0.5) * -12}deg) rotateY(${(mousePos.x - 0.5) * 12}deg) scale(${1 + Math.abs(mousePos.x - 0.5) * 0.04})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <motion.div
          animate={{
            y: [0, -18, 0, -10, 0],
            scale: [1, 1.005, 0.998, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="absolute -inset-32 md:-inset-48 rounded-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(77,168,196,0.35) 0%, rgba(102,204,204,0.12) 30%, rgba(0,188,212,0.04) 60%, transparent 80%)' }}
            animate={{ scale: [1, 1.2, 0.95, 1], opacity: [0.4, 1, 0.6, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full border border-primary-light/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15], rotate: [0, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />

          {[1,2,3,4,5,6,7,8].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary-dark/25"
              style={{
                width: i % 2 === 0 ? 3 : 2,
                height: i % 2 === 0 ? 3 : 2,
                left: `${5 + i * 11}%`,
                top: `${i * 12 % 80}%`,
              }}
              animate={{ y: [0, -30 - i * 5, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
            />
          ))}

          <div className="relative group" style={{
            padding: '14px',
            borderRadius: '48px',
            background: 'linear-gradient(165deg, #3E3E46 0%, #2E2E36 15%, #22222A 40%, #18181E 50%, #1E1E26 60%, #282830 75%, #3A3A42 85%, #42424A 100%)',
            boxShadow: `
              0 60px 150px rgba(0,0,0,0.7),
              0 30px 60px rgba(0,0,0,0.5),
              0 0 0 1px rgba(255,255,255,0.06),
              inset 0 2px 0 rgba(255,255,255,0.12),
              inset 0 -2px 0 rgba(0,0,0,0.4),
              inset 0 5px 30px rgba(0,0,0,0.2)
            `,
          }}>
            <div className="absolute inset-[4px] rounded-[44px] pointer-events-none z-50"
              style={{ boxShadow: 'inset 0 1.5px 1px rgba(255,255,255,0.08), inset 0 -1.5px 1px rgba(0,0,0,0.2), inset 1.5px 0 0.5px rgba(255,255,255,0.03), inset -1.5px 0 0.5px rgba(0,0,0,0.1)' }}
            />

            <div className="absolute top-[4px] left-[18%] right-[18%] h-[1px] rounded-full pointer-events-none z-50"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%, transparent 100%)' }}
            />

            <div className="absolute right-[4px] top-[20%] bottom-[20%] w-[1px] rounded-full pointer-events-none z-50"
              style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }}
            />

            <div className="absolute inset-0 rounded-[48px] z-50 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute inset-0 rounded-[48px]"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.06) 44%, transparent 50%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="relative rounded-[26px] overflow-hidden"
              style={{
                background: '#000',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 3px 12px rgba(0,0,0,0.6)',
              }}
            >
              <div className="absolute inset-[2px] rounded-[24px] z-15 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.8)' }}
              />

              <motion.div
                className="absolute inset-0 rounded-[26px] z-20 pointer-events-none"
                animate={{ background: [
                  'linear-gradient(135deg, rgba(77,168,196,0.18) 0%, transparent 40%, rgba(102,204,204,0.12) 60%, transparent 100%)',
                  'linear-gradient(135deg, rgba(102,204,204,0.15) 0%, transparent 40%, rgba(77,168,196,0.18) 60%, transparent 100%)',
                  'linear-gradient(135deg, rgba(0,188,212,0.12) 0%, transparent 40%, rgba(102,204,204,0.15) 60%, transparent 100%)',
                  'linear-gradient(135deg, rgba(77,168,196,0.18) 0%, transparent 40%, rgba(102,204,204,0.12) 60%, transparent 100%)',
                ]}}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent z-10 pointer-events-none" />
              <motion.div
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary-light/40 to-transparent z-20 pointer-events-none"
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                {screenParticles.map((i) => (
                  <motion.div key={i} className="absolute rounded-full bg-primary-dark/20"
                    style={{
                      width: i % 3 === 0 ? 1.5 : 1,
                      height: i % 3 === 0 ? 1.5 : 1,
                      left: `${8 + i * 10.5}%`,
                      top: `${15 + (i * 11) % 70}%`,
                    }}
                    animate={{ y: [0, -25 - i * 3, 0], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                  />
                ))}
              </div>
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)' }}
              />
              <div className="absolute inset-0 rounded-[26px] z-10 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 50px rgba(77,168,196,0.08), 0 0 30px rgba(77,168,196,0.05)' }}
              />

              <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md border border-white/10">
                <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Demo</span>
              </div>

              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-auto block"
                poster="/images/ialab-demo-poster.png"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                  imageRendering: 'auto',
                }}
              >
                <source src="/dashboard.mp4" type="video/mp4" />
                <source src="/dashboard.mov" type="video/quicktime" />
              </video>
              <div className="hidden absolute inset-0 z-30 items-center justify-center bg-slate-900 rounded-[26px]" style={{ display: 'none' }}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  </div>
                  <p className="text-sm text-white/80 font-medium">Demo IALab</p>
                  <p className="text-xs text-white/50 mt-1">Video disponible en desktop</p>
                </div>
              </div>

              <div className="absolute inset-0 z-25 pointer-events-none"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 20%, transparent 65%, rgba(100,170,240,0.025) 100%)' }}
              />
              <div className="absolute inset-0 z-24 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.08) 100%)' }}
              />
            </div>

            <div className="absolute top-[26px] left-1/2 -translate-x-1/2 z-55">
              <div className="w-[8px] h-[8px] rounded-full relative"
                style={{
                  background: 'radial-gradient(circle at 38% 35%, #1E1E30 0%, #0A0A12 60%, #000 100%)',
                  boxShadow: '0 0 0 0.5px rgba(255,255,255,0.08), 0 0 3px rgba(0,0,0,0.8), inset 0 0 1px rgba(255,255,255,0.05)',
                }}
              >
                <div className="w-[3px] h-[3px] rounded-full mx-auto mt-[1.5px]"
                  style={{ background: '#0E0E1A', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.05)' }}
                />
                <div className="absolute -top-[1px] -left-[1px] w-[3px] h-[2px] rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 100%)' }}
                />
              </div>
            </div>

            <div className="absolute -bottom-2 left-[5%] right-[5%] h-4 rounded-full pointer-events-none z-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)',
                filter: 'blur(4px)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroIpad;
