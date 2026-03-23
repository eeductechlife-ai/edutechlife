# QA Runbook - Step 3C & 3D (Diagnóstico VAK PDFs)

Purpose
- Provide a consolidated guide to finalize Step 3C (QA documentation) and Step 3D (staging prep) for Diagnóstico VAK PDFs.

Prereqs
- Development environment with QA PDFs generation supported (window.exportPDF if using browser-based generation)
- QA endpoints available or mocked for staging
- Access to branch creation on staging and QA routes enabled

Test Matrix (profiles)
- Perfil A ( ana López )
- Perfil B ( miguel Santos )
- Optional: Perfil C ( si se habilita )

Execution Steps
- 3C: QA Documentation
  1. Open QA_Guide_3C.md and confirm test cases align with implemented UI and PDF template
  2. Run the QA PDFs generation (manual or via npm script qa:pdfs) in dev
  3. Validate two QA PDFs exist: Diagnostico_VAK_QA_USUARIO_YYYY-MM-DD.pdf and Diagnostico_VAK_QA_USUARIO_2_YYYY-MM-DD.pdf
  4. Verify PDF content against acceptance criteria in QA_Guide_3C.md
  5. Capture evidence: screenshots, browser logs, PDF exports
  6. Update the QA_run log (optional) with results

- 3D: Staging Preparation
  1. Create or switch to staging branch (example: feature/diagnostico-vak-qa-staging)
  2. Enable QA routes (qa_demo or staging equivalents) and ensure endpoints point to sandbox
  3. Run end-to-end checks: generate PDFs, download from UI, scan QR
  4. Confirm cross-browser rendering in staging (Chrome/Firefox/Safari)
  5. Document any deviations and adjust templates if needed

Documentation & Evidence
- Update QA_Guide_3C.md with any deviations found during 3C and 3D
- Create a single combined QA status record for 3B-3D

Acceptance Criteria (3C/3D)
- All steps completed with validated PDFs and QA evidence
- No production impact; qa_demo is isolated
- Staging reflects final QA setup and can be used for pre-production validation
