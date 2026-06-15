# Valerio Avatar Premium - Design Spec

## Overview
Premium 2026-level SVG avatar for Valerio AI assistant. Realistic professor style with beard, modern tech aesthetic, and smooth Framer Motion animations.

## Visual Style
- **Style**: Realistic stylized 3D look (not flat cartoon)
- **Character**: Professor, ~40 years old, male
- **Hair**: Wavy, dark brown with subtle gray highlights, styled upward
- **Beard**: Full but well-groomed, dark brown/gray mix, defined shape
- **Eyes**: Brown, expressive, with proper eyelid crease and lashes
- **Skin**: Warm tone (#D4A574 base), with natural blush zones
- **Clothing**: Blue shirt collar visible, no tie, casual professional
- **Expression**: Friendly, approachable, slight smile

## Color Palette
- **Skin base**: #D4A574
- **Skin shadow**: #B8896A
- **Hair**: #3D2E20 (base), #5A3723 (highlights)
- **Beard**: #4A3828 (base), #6B5038 (gray tones)
- **Eyes**: #6B5038 (iris), #3D2E20 (pupil)
- **Lips**: #C97B6D
- **Shirt**: #004B63 (primary), #00BCD4 (accent)
- **Bubble glow**: #00BCD4, #004B63

## SVG Structure (Layer Order)
```
<svg viewBox="0 0 200 200">
  <defs>
    <!-- Skin gradient: radial, light top-left → dark bottom-right -->
    <radialGradient id="skin" cx="38%" cy="35%" r="65%">
      <stop offset="0%" stopColor="#EDCBA5"/>
      <stop offset="45%" stopColor="#D4A574"/>
      <stop offset="100%" stopColor="#B8896A"/>
    </radialGradient>
    
    <!-- Hair gradient: vertical, highlights at top -->
    <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5A3723"/>  <!-- highlight -->
      <stop offset="40%" stopColor="#3D2E20"/> <!-- base -->
      <stop offset="100%" stopColor="#2C1810"/> <!-- shadow -->
    </linearGradient>
    
    <!-- Iris gradient: radial with limbal ring -->
    <radialGradient id="iris" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stopColor="#8B7355"/>
      <stop offset="60%" stopColor="#6B5038"/>
      <stop offset="90%" stopColor="#3D2E20"/>  <!-- limbal ring -->
      <stop offset="100%" stopColor="#1A1A1A"/>
    </radialGradient>
    
    <!-- Blush gradient -->
    <radialGradient id="blush" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#E8ADA0" stopOpacity=".15"/>
      <stop offset="100%" stopColor="#E8ADA0" stopOpacity="0"/>
    </radialGradient>
    
    <!-- Filters -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity=".12"/>
    </filter>
  </defs>
  
  <!-- 1. Background glow (state-dependent color) -->
  <circle cx="100" cy="100" r="98" fill="rgba(0,188,212,.08)" filter="url(#glow)"/>
  
  <!-- 2. Glass bubble - outer ring with gradient -->
  <circle cx="100" cy="100" r="92" fill="none" stroke="url(#bubbleGrad)" stroke-width="2.5"/>
  
  <!-- 3. Glass bubble - inner reflection (top-left highlight) -->
  <ellipse cx="75" cy="65" rx="35" ry="20" fill="rgba(255,255,255,.12)" transform="rotate(-20 75 65)"/>
  
  <!-- 4. Hair back layer (behind face) -->
  <path d="M55,45 C45,25 50,10 70,8 C85,6 115,6 130,8 C150,10 155,25 145,45 C140,35 125,25 105,22 C90,20 70,20 60,28 C55,32 52,40 55,45Z" fill="url(#hair)" filter="url(#shadow)"/>
  
  <!-- 5. Hair side layers (volume) -->
  <path d="M52,42 C48,55 47,70 50,80 C48,75 46,65 48,55Z" fill="url(#hair)"/>
  <path d="M148,42 C152,55 153,70 150,80 C152,75 154,65 152,55Z" fill="url(#hair)"/>
  
  <!-- 6. Ears -->
  <ellipse cx="52" cy="58" rx="8" ry="12" fill="url(#skin)"/>
  <ellipse cx="148" cy="58" rx="8" ry="12" fill="url(#skin)"/>
  <ellipse cx="52" cy="58" rx="5" ry="8" fill="rgba(184,137,106,.3)"/>
  <ellipse cx="148" cy="58" rx="5" ry="8" fill="rgba(184,137,106,.3)"/>
  
  <!-- 7. Neck -->
  <path d="M82,105 C80,115 78,128 80,138 L120,138 C122,128 120,115 118,105Z" fill="url(#skin)"/>
  <ellipse cx="100" cy="120" rx="14" ry="4" fill="rgba(0,0,0,.06)"/>
  
  <!-- 8. Shirt collar (no tie) -->
  <path d="M75,130 C78,125 85,118 100,115 C115,118 122,125 125,130 L130,145 L70,145Z" fill="#004B63"/>
  <path d="M88,125 L95,118 L100,120 L105,118 L112,125" fill="none" stroke="#00BCD4" stroke-width="1" opacity=".4"/>
  
  <!-- 9. Face shape (bezier, not ellipse) - widest at cheekbones -->
  <path d="M60,50 C55,60 52,75 55,90 C58,100 65,108 80,112 C90,114 110,114 120,112 C135,108 142,100 145,90 C148,75 145,60 140,50 C135,42 120,38 100,38 C80,38 65,42 60,50Z" fill="url(#skin)" filter="url(#shadow)"/>
  
  <!-- 10. 3D face lighting (8 zones) -->
  <!-- Forehead highlight -->
  <ellipse cx="100" cy="48" rx="20" ry="12" fill="rgba(255,255,255,.08)"/>
  <!-- Left cheek shadow -->
  <ellipse cx="70" cy="75" rx="12" ry="8" fill="rgba(0,0,0,.04)"/>
  <!-- Right cheek shadow -->
  <ellipse cx="130" cy="75" rx="12" ry="8" fill="rgba(0,0,0,.04)"/>
  <!-- Nose bridge highlight -->
  <ellipse cx="100" cy="65" rx="6" ry="15" fill="rgba(255,255,255,.06)"/>
  <!-- Under-eye area -->
  <ellipse cx="82" cy="62" rx="10" ry="4" fill="rgba(255,255,255,.04)"/>
  <ellipse cx="118" cy="62" rx="10" ry="4" fill="rgba(255,255,255,.04)"/>
  <!-- Jaw shadow -->
  <path d="M65,95 C75,105 125,105 135,95 C130,100 70,100 65,95Z" fill="rgba(0,0,0,.04)"/>
  <!-- Chin highlight -->
  <ellipse cx="100" cy="108" rx="8" ry="4" fill="rgba(255,255,255,.05)"/>
  
  <!-- 11. Eyes (with sclera, iris, pupil, highlights, eyelid crease) -->
  <!-- Left eye -->
  <g>
    <ellipse cx="82" cy="60" rx="12" ry="8" fill="#F8F4EE"/>
    <circle cx="82" cy="60" r="5.5" fill="url(#iris)"/>
    <circle cx="82" cy="60" r="2.8" fill="#1A1A1A"/>
    <circle cx="80" cy="58" r="1.8" fill="rgba(255,255,255,.85)"/>
    <circle cx="84" cy="61" r="0.8" fill="rgba(255,255,255,.4)"/>
    <!-- Eyelid crease -->
    <path d="M70,55 Q82,50 94,55" fill="none" stroke="rgba(60,40,25,.15)" strokeWidth="1"/>
    <!-- Lower lash line -->
    <path d="M72,65 Q82,68 92,65" fill="none" stroke="rgba(60,40,25,.1)" strokeWidth="0.5"/>
  </g>
  
  <!-- Right eye -->
  <g>
    <ellipse cx="118" cy="60" rx="12" ry="8" fill="#F8F4EE"/>
    <circle cx="118" cy="60" r="5.5" fill="url(#iris)"/>
    <circle cx="118" cy="60" r="2.8" fill="#1A1A1A"/>
    <circle cx="116" cy="58" r="1.8" fill="rgba(255,255,255,.85)"/>
    <circle cx="120" cy="61" r="0.8" fill="rgba(255,255,255,.4)"/>
    <path d="M106,55 Q118,50 130,55" fill="none" stroke="rgba(60,40,25,.15)" strokeWidth="1"/>
    <path d="M108,65 Q118,68 128,65" fill="none" stroke="rgba(60,40,25,.1)" strokeWidth="0.5"/>
  </g>
  
  <!-- 12. Eyebrows (thick, defined) -->
  <path d="M68,48 Q75,44 88,47" fill="none" stroke="#3D2E20" strokeWidth="2.5" strokeLinecap="round"/>
  <path d="M112,47 Q125,44 132,48" fill="none" stroke="#3D2E20" strokeWidth="2.5" strokeLinecap="round"/>
  
  <!-- 13. Nose (subtle, realistic) -->
  <path d="M100,55 Q98,70 95,80 Q100,84 105,80 Q102,70 100,55" fill="none" stroke="rgba(160,120,85,.25)" strokeWidth="1.2" strokeLinecap="round"/>
  <ellipse cx="95" cy="82" rx="2.5" ry="1.5" fill="rgba(160,120,85,.12)"/>
  <ellipse cx="105" cy="82" rx="2.5" ry="1.5" fill="rgba(160,120,85,.12)"/>
  
  <!-- 14. Mouth (with upper lip Cupid's bow) -->
  <path d="M88,92 Q94,88 100,90 Q106,88 112,92" fill="none" stroke="#C97B6D" strokeWidth="1.8" strokeLinecap="round"/>
  <path d="M90,93 Q100,98 110,93" fill="none" stroke="#B86556" strokeWidth="1.2" strokeLinecap="round"/>
  <!-- Lip highlight -->
  <ellipse cx="100" cy="89" rx="6" ry="2" fill="rgba(255,255,255,.06)"/>
  
  <!-- 15. Beard (multiple layers for texture) -->
  <!-- Base layer -->
  <path d="M65,85 C68,95 75,105 85,110 C92,113 108,113 115,110 C125,105 132,95 135,85 C130,90 120,95 100,95 C80,95 70,90 65,85Z" fill="rgba(74,56,40,.12)"/>
  <!-- Texture strokes -->
  <path d="M75,88 C78,92 82,95 88,97" fill="none" stroke="rgba(74,56,40,.08)" strokeWidth="0.8"/>
  <path d="M125,88 C122,92 118,95 112,97" fill="none" stroke="rgba(74,56,40,.08)" strokeWidth="0.8"/>
  <path d="M85,95 C90,100 95,103 100,105" fill="none" stroke="rgba(74,56,40,.06)" strokeWidth="0.6"/>
  <path d="M115,95 C110,100 105,103 100,105" fill="none" stroke="rgba(74,56,40,.06)" strokeWidth="0.6"/>
  
  <!-- 16. Blush (natural warmth) -->
  <ellipse cx="75" cy="80" rx="10" ry="6" fill="url(#blush)" opacity=".1"/>
  <ellipse cx="125" cy="80" rx="10" ry="6" fill="url(#blush)" opacity=".1"/>
</svg>
```

## Animations (Framer Motion)
1. **Breath**: Gentle Y oscillation (±2px, 4s cycle, easeInOut)
2. **Sway**: Subtle X movement (±1px, 6s cycle, easeInOut)
3. **Blink**: Eyelid scaleY animation (spring: stiffness=500, damping=18, duration=0.06 close)
4. **Speaking mouth**: Path morphing between 6 phoneme states (M, open, O, smile, neutral, wide)
5. **Thinking dots**: 3 dots above head with staggered bounce animation
6. **Listening pulse**: Outer ring pulse animation
7. **Particle aura**: 10 floating dots around bubble (state-dependent opacity: idle=.06, listening=.1, speaking=.2)

## State Colors
- **idle**: Blue (#004B63)
- **listening**: Green (#10B981)
- **thinking**: Purple (#8B5CF6)
- **speaking**: Cyan (#0EA5E9)

## Technical Constraints
- Zero new packages (framer-motion, React already available)
- Same external API: `props (state, size, enable3DTilt)`
- `window.valerioSpeak` and `window.__valerioStateRef` preserved
- SVG + Framer Motion (no Canvas)
- Build takes ~1-2min due to 12k+ line CSS

## Success Criteria
- Looks genuinely premium and modern (2026 level)
- Smooth animations at 60fps
- All states (idle, listening, thinking, speaking) have distinct visual feedback
- 3D tilt effect on hover
- Professional professor appearance with beard
- No flat/cartoonish look
