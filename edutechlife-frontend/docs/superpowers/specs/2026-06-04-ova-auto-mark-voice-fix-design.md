# OVA Auto-Mark, Voice Fix & Certificate Removal

## 1. Remove Certificates from OVAs
- OVAEtica: Clean up unused translation keys (`certificate_badge`, `certificate_subtitle`, etc.)
- All other OVAs already handled in previous sessions

## 2. Auto-Mark on Last Page (60% threshold)

| OVA | Type | Threshold | Mechanism |
|-----|------|-----------|-----------|
| OVAChatGPTTools | Quiz 5Q | 3/5 | useEffect on results screen |
| OVANotebookLab | Quiz 7Q | 5/7 | useEffect on results screen |
| OVANotebookSimulator | Quiz 7Q | 5/7 | useEffect on results screen |
| OVAEtica | Quiz 5Q | 3/5 | Already auto (clean button) |
| OVABuildGPT | Quiz 4Q | 3/4 | Already auto via QuizScreen |
| OvaEdutechlife | Quiz 4Q | 3/4 | useEffect on results |
| QueEsPrompt_OVA_Original | Quiz 5Q | 3/5 | Add useEffect |
| OVAEcosystemGuide | Content | — | useEffect on m8 |
| OVAEthicalDilemmas | Dilemmas | — | useEffect on principles |
| OVAPodcastStudio | Checklist | All checked | useEffect |
| OVARiskSimulator | Game | All stars | useEffect |
| OVABiasLab | Game | All matched | useEffect |
| OVANotebookPodcastGuide | Mix 180pts | 100pts | useEffect on certificate |
| OVAIntroPrompt | Content | — | Already auto on m8 |

Remove all manual "Mark Complete" buttons.

## 3. Voice Fix

### speech.js
- Remove `nativePitch: 0.9`
- Remove female-voice pitch hack (line 251-254)
- Set speakingRate: 1.1
- Change API_BASE_URL default to http://localhost:3001

### Duplication fixes
- OVAIntroPrompt FinalChallenge: Remove VoiceReader button (keep auto-play)
- OVANotebookPodcastGuide: Remove handleNarrate button (keep OVAValerioBar)

## Files to Modify
1. speech.js
2. OVAIntroPrompt.jsx
3. OVANotebookPodcastGuide.jsx
4-16. All OVA components for auto-mark useEffect + button removal
