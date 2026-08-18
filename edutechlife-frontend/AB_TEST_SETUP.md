# A/B Test: SmartBoard Copy Optimization
## Experiment: outcome-focused vs generic messaging

### Test Overview
- **Experiment ID:** `smartboard-copy-v1`
- **Start Date:** 2026-08-18
- **Duration:** 14 days (or 95% confidence)
- **Traffic Split:** 50/50 (Control vs Treatment)
- **Target Metric:** Conversion rate (CTA clicks)

### Variants

#### Control (A)
- Original benefits: "Plan personalizado", "Habilidades tecnológicas", "Puntos y recompensas", etc.
- Generic messaging
- **Expected baseline:** Current conversion

#### Treatment (B)
- NEW outcome-focused benefits: "Mejora de calificaciones (+2 puntos)", "Recupera su confianza", "Reportes semanales", etc.
- Specific, parent-centric messaging
- **Expected uplift:** +15-25% conversion

### Implementation

#### Variant Assignment
```javascript
// Hook: useABExperiment()
- 50/50 random split
- Stored in localStorage (persistent per user)
- Tracked on first visit
```

#### Events Tracked

**Experiment Assignment:**
```
Event: experiment_assigned
Data: {
  experiment_id: "smartboard-copy-v1",
  variant: "control" | "treatment",
  locale: "es" | "en" | "pt",
  timestamp: ISO8601
}
```

**CTA Conversions:**
```
Event: conversion
Data: {
  experiment_id: "smartboard-copy-v1",
  variant: "control" | "treatment",
  conversion_type: "cta_click",
  section: "¿Qué es?" | "Beneficios" | ... etc
  timestamp: ISO8601
}
```

**Engagement:**
```
Event: section_view
Data: {
  experiment_id: "smartboard-copy-v1",
  variant: "control" | "treatment",
  section: section_name,
  time_on_section: seconds,
  timestamp: ISO8601
}
```

### Google Analytics 4 Setup

#### 1. Create Experiment in GA4
```
GA4 > Experiments > Create > A/B Test
- Name: "SmartBoard Copy Test"
- Hypothesis: "Outcome-focused copy increases conversion"
- Primary metric: conversion_event (CTA clicks)
- Sample size: Auto (need ~1000 conversions per variant)
```

#### 2. Segments
- By variant (automatic via event data)
- By locale (es, en, pt)
- By device (mobile, desktop, tablet)
- By section (¿Qué es?, Beneficios, etc)

#### 3. Key Metrics to Monitor
- **Conversion Rate:** CTA clicks / total visitors
- **Engagement Time:** avg time on page (by variant)
- **Section Completion:** % reaching end (by variant)
- **Signup Rate:** actual signups (if available)

### Timeline

**Days 1-3:** Monitor sample size
- Ensure both variants have equal traffic
- Check event tracking working (GA4 Realtime)

**Days 4-7:** Early signals
- Look for directional trends (not yet statistical)
- Monitor bounce rates, time-on-page

**Days 8-14:** Statistical Significance
- Run until 95% confidence
- Stop early if clear winner at 95%

### Success Criteria

| Scenario | Action |
|----------|--------|
| **Treatment > Control (95% conf)** | ✅ Merge to main (full deploy) |
| **Control > Treatment (95% conf)** | 🔄 Iterate on copy, run new test |
| **No clear winner (no sig)** | 🔄 Extend test 7 days OR add testimonials + re-test |
| **Treatment = Control ±5%** | ✅ Merge (outcome-focused doesn't hurt) |

### Code Integration

#### Enable Experiment
```javascript
// src/hooks/useABExperiment.js
const { variant, isTreatment, isControl } = useABExperiment();

// Control (A): Use original data
if (isControl) {
  beneficios = ORIGINAL_BENEFICIOS;
}

// Treatment (B): Use outcome-focused data
if (isTreatment) {
  beneficios = NEW_OUTCOME_FOCUSED_BENEFICIOS;
}
```

#### Track Conversions
```javascript
import { trackConversion } from '../hooks/useABExperiment';

const handleCta = () => {
  trackConversion("cta_click", {
    section: "Beneficios",
    button: "Quiero probarlo",
  });
  navigate("/sign-up/smartboard");
};
```

### Analysis Plan

**After 14 days:**
1. Export data from GA4
2. Calculate: Conversion Rate per variant
3. Run chi-square test (significance)
4. Segment by: locale, device, section
5. Write findings (1-pager)
6. Decision: Merge or iterate

### Team Alerts

- Daily check (first 3 days): Sample parity
- Midpoint check (day 7): Directional trends
- Final check (day 14): Significance + decision

---

**Experiment Owner:** Claude AI
**Date Created:** 2026-08-18
**Last Updated:** 2026-08-18
