# SmartBoard Design System — Testing Checklist

Complete this checklist to verify the age-adaptive design system is working correctly.

---

## Pre-Testing Setup

- [ ] Run `npm run dev`
- [ ] Open `http://localhost:5173` in Chrome
- [ ] Open DevTools (`F12` or `Cmd+Option+I`)
- [ ] Clear cache (`Cmd+Shift+R` or `Ctrl+Shift+R`)

---

## Visual Testing

### Color Palette Verification

#### Primary (6-9 years)
- [ ] **Primary (#FF6B6B)**: Bright red, used for large buttons (18px+ text)
- [ ] **Secondary (#5B5EA6)**: Bright purple, used for headings and text
- [ ] **Accent (#004B63)**: Dark blue, used for text and contrast
- [ ] **Text (#1F2937)**: Dark gray, readable on white
- [ ] Compare with screenshots in `/docs` or Figma

#### Intermediate (10-13 years)
- [ ] **Primary (#0088CC)**: Professional blue, primary CTA buttons
- [ ] **Secondary (#A78BFA)**: Softer purple, secondary elements
- [ ] **Accent (#06B6D4)**: Cyan, energetic accents
- [ ] **Text (#1F2937)**: Dark gray, good contrast
- [ ] Colors are more balanced than primary palette

#### Secondary (14-16 years)
- [ ] **Primary (#0F766E)**: Teal, sophisticated primary elements
- [ ] **Secondary (#7C3AED)**: Violet, creative secondary elements
- [ ] **Accent (#0284C7)**: Professional blue, technical accents
- [ ] **Text (#111827)**: Almost black, maximum contrast
- [ ] Overall aesthetic is minimal and professional

### Typography Verification

#### Primary (6-9)
- [ ] Font: **Fredoka One** (playful, rounded letterforms)
- [ ] Size: 14px (small), 16px (medium), 18px (large)
- [ ] Line height: 1.8 (generous, easy to read)
- [ ] Weight: 400 (normal weight)

#### Intermediate (10-13)
- [ ] Font: **Poppins** (modern, balanced)
- [ ] Size: 12px (small), 14px (medium), 16px (large)
- [ ] Line height: 1.6 (comfortable)
- [ ] Weight: 600 (semi-bold)

#### Secondary (14-16)
- [ ] Font: **Sora** (sophisticated, minimal)
- [ ] Size: 11px (small), 13px (medium), 14px (large)
- [ ] Line height: 1.5 (compact, professional)
- [ ] Weight: 500 (medium)

### Component Sizing

#### Icon Sizes
- [ ] Primary: 48px ✓
- [ ] Intermediate: 32px ✓
- [ ] Secondary: 24px ✓

#### Touch Targets
- [ ] Primary: 48×48px minimum ✓
- [ ] Intermediate: 44×44px minimum ✓
- [ ] Secondary: 40×40px minimum ✓

#### Button Styling
- [ ] Primary: Thick border (3px), rounded corners (20px)
- [ ] Intermediate: Medium border (2px), moderate radius (16px)
- [ ] Secondary: Thin border (1px), minimal radius (12px)

#### Badge Styling
- [ ] Primary: Large (64px), animated bounce
- [ ] Intermediate: Medium (52px), smooth hover
- [ ] Secondary: Compact (44px), subtle opacity

---

## Animation Testing

### Primary (6-9)
- [ ] Buttons bounce on hover (upward motion)
- [ ] Badges pulse/bounce continuously
- [ ] Cards lift with shadow on hover
- [ ] Feedback messages slide in from left
- [ ] **Duration**: 300ms smooth and playful

### Intermediate (10-13)
- [ ] Buttons translate slightly on hover (1-2px up)
- [ ] Cards have subtle shadow change
- [ ] Smooth opacity transitions
- [ ] Badges gently bob
- [ ] **Duration**: 250ms smooth and natural

### Secondary (14-16)
- [ ] Buttons rely on opacity changes on hover
- [ ] Minimal movement (scale or translate)
- [ ] Professional, quick transitions
- [ ] No unnecessary animations
- [ ] **Duration**: 200ms efficient and fast

---

## Responsive Design Testing

### Desktop (1280px)
- [ ] All layouts render correctly
- [ ] Spacing and sizing look balanced
- [ ] Charts display full width
- [ ] Cards arranged in grid (2-3 columns)
- [ ] No horizontal scrolling

### Tablet (768px)
- [ ] Icons scaled up slightly for visibility
- [ ] Touch targets still 44px minimum
- [ ] Charts responsive and fit width
- [ ] Cards stack to 1-2 columns
- [ ] No horizontal scrolling

### Mobile (375px)
- [ ] Touch targets enlarged (44-48px)
- [ ] Icons larger for visibility
- [ ] Font sizes increased slightly
- [ ] Cards stack single column
- [ ] Padding maintained for comfortable spacing
- [ ] **No horizontal scrolling**

### Test on Real Devices
- [ ] iPhone 12 (375px width) ✓
- [ ] iPad (768px width) ✓
- [ ] Android phone (360px-412px) ✓
- [ ] Landscape orientation ✓

---

## Accessibility Testing

### Keyboard Navigation
- [ ] **Tab**: Moves through all buttons and interactive elements
- [ ] **Shift+Tab**: Moves backward through elements
- [ ] **Enter**: Activates buttons
- [ ] **Space**: Activates buttons/checkboxes
- [ ] **Escape**: Closes modals
- [ ] Tab order is logical and expected
- [ ] **No keyboard trap** — can always escape

### Focus Indicators
- [ ] All buttons have visible focus outline (3px, primary color)
- [ ] Focus outline offset: 2px (doesn't cover content)
- [ ] Outline is dark enough to see (AA minimum 3:1 contrast)
- [ ] Focus state is clear on primary, intermediate, secondary designs

### Screen Reader Testing
- [ ] **NVDA (Windows)**: Read buttons, labels, and content aloud
- [ ] **VoiceOver (Mac)**: Navigate with arrow keys, read context
- [ ] **JAWS**: Test form submission and feedback messages
- [ ] Button labels are descriptive (e.g., "Submit Exam" not just "Submit")
- [ ] Form errors are announced to screen reader

### High Contrast Mode
- [ ] Enable in OS Settings → Accessibility → Display
- [ ] Borders should thicken (@media (prefers-contrast: more))
- [ ] All text should be readable
- [ ] Colors should be distinct and contrasty
- [ ] No information conveyed by color alone

### Reduced Motion Support
- [ ] Enable in OS Settings → Accessibility → Motion
- [ ] **All animations should stop**:
  - [ ] Bounce animations disappear
  - [ ] Hover animations disabled
  - [ ] Fade/slide animations become instant
  - [ ] Progress bars still animate (movement is okay if needed)
- [ ] Functionality unchanged, just visual motion removed

### Dark Mode Testing
- [ ] Add `.dark` class to test wrapper
- [ ] Colors should automatically lighten for contrast
- [ ] No white text on light background
- [ ] Badge colors should be vibrant in dark mode
- [ ] Cards should have dark background
- [ ] Text should be light color (white/light gray)

---

## Color Contrast Testing

### Automated Testing
- [ ] Run validation: `node src/styles/test-color-palettes.mjs`
- [ ] All text colors pass AA contrast (4.5:1 minimum)
- [ ] UI component colors meet 3:1 minimum
- [ ] Primary colors labeled as "large text only" if < 4.5:1

### Manual Testing with WebAIM
- [ ] Visit: https://webaim.org/resources/contrastchecker/
- [ ] Test each palette's primary color on white
- [ ] Verify AA ✓ for intended text sizes
- [ ] Test large text specifically (18px+)

### Test on Each Device's Display
- [ ] Desktop monitor (LED, high brightness)
- [ ] Laptop display (matte, medium brightness)
- [ ] Tablet screen (matte, medium brightness)
- [ ] Smartphone (high brightness, small screen)
- [ ] Colors should remain distinct on all displays

---

## Component-Specific Testing

### PointsRewardsSystem (with AgeAdaptivePointsRewards)

#### Primary
- [ ] Badge emoji large and centered (64px)
- [ ] Border thick and prominent (3px)
- [ ] Tab buttons min-height 48px
- [ ] Animations bounce on hover
- [ ] Reward cards have rounded corners (20px)
- [ ] Colors bright and playful

#### Intermediate
- [ ] Badge size 52px
- [ ] Border 2px (moderate)
- [ ] Tab buttons 44px
- [ ] Smooth transitions on hover
- [ ] Cards have 16px radius
- [ ] Colors balanced

#### Secondary
- [ ] Badge compact (44px)
- [ ] Border minimal (1px)
- [ ] Tab buttons 40px
- [ ] Professional animations
- [ ] Cards minimal (12px radius)
- [ ] Colors sophisticated

### OralExamSimulator (with AgeAdaptiveOralExam)

#### Primary
- [ ] Dani mascot large (120px) and animated
- [ ] Question card has thick border (3px)
- [ ] Options buttons large (48px min-height)
- [ ] Bouncy hover animation
- [ ] Emoji feedback prominent
- [ ] Result score large (2x font size)

#### Intermediate
- [ ] Dani mascot moderate (80px)
- [ ] Question card border 2px
- [ ] Options buttons 44px
- [ ] Smooth hover effect
- [ ] Balanced feedback messaging
- [ ] Result score 1.6x font size

#### Secondary
- [ ] Dani mascot small (60px), less prominent
- [ ] Question card border 1px
- [ ] Options buttons 40px
- [ ] Minimal hover effect
- [ ] Text-focused feedback
- [ ] Result score 1.4x font size

### SmartBoardAnalytics (with AgeAdaptiveAnalytics)

#### Primary
- [ ] Chart height 220px (spacious)
- [ ] Metric cards with 3px border
- [ ] Large icons and labels
- [ ] Bright gradient backgrounds
- [ ] Animated progress bars
- [ ] Empty state has bouncing icon

#### Intermediate
- [ ] Chart height 180px (balanced)
- [ ] Metric cards with 2px border
- [ ] Moderate icon sizes
- [ ] Subtle gradients
- [ ] Smooth progress animations
- [ ] Empty state has subtle icon

#### Secondary
- [ ] Chart height 160px (compact)
- [ ] Metric cards with 1px border
- [ ] Small icons and minimal labels
- [ ] Professional gradients
- [ ] Efficient progress animations
- [ ] Empty state minimal

---

## Browser Compatibility

- [ ] Chrome 90+ ✓
- [ ] Firefox 88+ ✓
- [ ] Safari 14+ ✓
- [ ] Edge 90+ ✓
- [ ] Mobile Safari (iOS 14+) ✓
- [ ] Chrome Android ✓

---

## Performance Testing

### Load Time
- [ ] CSS loads without blocking render
- [ ] Fonts load within 1 second
- [ ] No flash of unstyled text (FOUT)
- [ ] Page interactive within 3 seconds

### Runtime Performance
- [ ] Animations run at 60 FPS (no jank)
- [ ] Hover effects smooth
- [ ] Transitions don't stutter
- [ ] DevTools Performance tab shows no red (jank) frames

### Memory Usage
- [ ] CSS variables don't cause memory leaks
- [ ] Component wrappers don't create extra DOM nodes
- [ ] Animations use GPU-accelerated properties (`transform`, `opacity`)

---

## Dark Mode Deep Dive

- [ ] Test in Chrome DevTools → Rendering → Emulate CSS media feature: prefers-color-scheme
- [ ] All text readable in dark mode (light color)
- [ ] Card backgrounds dark (#1F2937 or #111827)
- [ ] Borders and accents adapted for dark background
- [ ] No inverted colors (colors should get lighter, not inverted)
- [ ] Screenshot mode same in light and dark

---

## Final QA Checklist

### Visual Quality
- [ ] No broken fonts or missing characters
- [ ] No misaligned text or overlapping elements
- [ ] Colors match design specifications
- [ ] Spacing and padding consistent

### Functionality
- [ ] All buttons clickable and responsive
- [ ] Forms submit properly
- [ ] No console errors in DevTools
- [ ] No warnings related to age-based-design.css

### Documentation
- [ ] `SMARTBOARD_DESIGN_SYSTEM.md` is complete
- [ ] `AGE_ADAPTIVE_DESIGN_SUMMARY.md` matches implementation
- [ ] `DESIGN_SYSTEM_QUICKSTART.md` is accurate
- [ ] All code examples compile and work

### Accessibility
- [ ] WCAG 2.1 AA compliance verified
- [ ] All automated checks pass
- [ ] Manual keyboard testing complete
- [ ] Screen reader testing done

---

## Deployment Checklist

Before merging to main:
- [ ] All visual tests pass ✓
- [ ] All accessibility tests pass ✓
- [ ] All responsive tests pass ✓
- [ ] Performance is acceptable (60 FPS)
- [ ] No console errors or warnings
- [ ] Browser compatibility verified
- [ ] Dark mode tested thoroughly
- [ ] Colors validated with WCAG checker
- [ ] Screenshots captured for each age group
- [ ] Documentation is complete and accurate

---

## Feedback & Issues

If you find any issues:

1. **Visual Issue?** → Document in screenshot, note age group and device
2. **Accessibility Issue?** → Use WebAIM contrast checker, note WCAG level
3. **Performance Issue?** → Run DevTools Performance, note frame rate
4. **Browser Bug?** → Note browser version, OS, and steps to reproduce

---

## Sign-Off

Once all tests pass:

- [ ] QA Lead: _____________________ Date: ________
- [ ] Dev Lead: _____________________ Date: ________
- [ ] Designer: _____________________ Date: ________

Ready to merge to production! 🚀
