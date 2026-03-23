# QA Guide - Step 3C: Documentation & Cases (Diagnóstico VAK PDFs)

- Purpose: formalize QA checks, acceptance criteria, and test cases for the two QA PDFs generated in Step 3B.
- Scope: PDF template, QR, data population, and download behavior.

## Test areas
- PDF template integrity: margins, typography, spacing across browsers (Chrome, Firefox, Safari)
- QR in footer: legibility, anchored position, scanners readability
- QR target: URL must be https://edutechlife.co/
- Content coverage: student name, date, profile color, counts, profile description, 3 strategies
- File naming: Diagnostico_VAK_QA_USUARIO_YYYY-MM-DD.pdf and Diagnostico_VAK_QA_USUARIO_2_YYYY-MM-DD.pdf
- Download behavior: UI results page triggers PDF download
- QA mode isolation: no impact on production data or flows
- Coverage: two QA PDFs with distinct profiles (A and B)

## Acceptance criteria
- All fields render correctly; no missing data blocks
- QR decodes correctly and routes to the expected URL
- PDFs render consistently in Chrome/Firefox/Safari
- No answers resume or summary included in the PDFs
- QA PDFs generation does not affect production

## Test cases (examples)
- Test 1: Open Diagnostico_VAK_QA_USUARIO_YYYY-MM-DD.pdf and verify metadata and 3 strategies exist
- Test 2: Open Diagnostico_VAK_QA_USUARIO_2_YYYY-MM-DD.pdf and verify alternate profile data renders
- Test 3: Scan the QR and ensure it points to https://edutechlife.co/
- Test 4: Trigger PDF download from UI and confirm file download

## Test Data (QA Profiles)
- Perfil A: Ana López, color teal, counts totales 10, correct 7, incorrect 3
- Perfil B: Miguel Santos, color violet, counts totales 10, correct 4, incorrect 6
- Descripciones y estrategias ya definidas en QA_SAMPLE_PROFILES

## Execution Notes
- Pre-conditions: QA PDFs generator (exportPDF) available in dev; browser window exposure configured
- Execution flow: follow Test Cases; capture evidence (screenshots, logs, PDFs)
- Post-conditions: QA PDFs exist and can be downloaded from UI without affecting production

## Evidence & Artifacts
- Screenshots of rendered PDFs in Chrome/Firefox/Safari
- QR scan results showing URL https://edutechlife.co/
- Console logs and any errors during generation
- PDFs downloaded via UI verify file integrity

## Exit Criteria & Sign-off
- All tests pass according to Acceptance Criteria
- QA evidence collected and stored in the repository or CI artifacts
- QA Runbook updated with outcomes and any deviations
- Sign-off by QA owner with date

## Artifacts
- Generated PDFs: two QA PDFs with dates in the filename
- Reports/notes: QA execution log (optional)
