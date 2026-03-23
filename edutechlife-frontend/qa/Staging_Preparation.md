# Staging Preparation for Diagnóstico VAK QA

- Create a dedicated staging branch (e.g., feature/diagnostico-vak-qa-staging)
- Deploy QA-enabled routes and ensure qa_demo path remains isolated from production
- Configure QA data endpoints to use a sandbox/mock service
- Run end-to-end tests: PDF generation, download, and QR validation in staging
- Validate cross-browser behavior in a staging environment that mimics production
- Document any feature flags or toggles required for staging
- Branching and QA routes
- Branching and QA routes
- Branching and QA routes
  - Create staging branch: feature/diagnostico-vak-qa-staging
  - Ensure QA routes are enabled in staging (qa_demo or equivalent)
  - Point QA data endpoints to sandbox/mock services in staging
- Quick Start for Staging
  - Deploy to staging environment (matching production but using QA data)
  - Set QA_ENDPOINT or QA_API_BASE_URL to a staging sandbox, e.g. https://staging.edutechlife.co
  - Verify that the UI /qa/demo path is available and isolated from production data
  - Run the end-to-end checks: PDF generation, download, and QR validation in staging
  - Capture evidence (screenshots, logs, PDFs) and add to QA runbook

- Validation plan
  - Run end-to-end checks: PDF generation, download, and QR validation in staging
  - Verify cross-browser rendering on a staging environment that mirrors production
  - Capture evidence and logs for the QA status report

- Rollout readiness
  - Document required feature flags and toggles for staging to production
  - Prepare rollback steps if QA fails in staging (kill switch)
