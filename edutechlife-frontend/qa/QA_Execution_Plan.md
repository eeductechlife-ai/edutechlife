QA Execution Plan for Diagnóstico VAK

- Step 3B: QA final
  - Tighten PDF template finetuning
    - Adjust margins, typography, and spacing for cross-browser consistency
    - Confirm QR is anchored in the footer and remains legible at various DPI
  - QA PDFs
    - Generate two additional QA PDFs populated with distinct profile data (e.g., Perfil A and Perfil B)
    - Filenames:
      - Diagnostico_VAK_QA_USUARIO_YYYY-MM-DD.pdf
      - Diagnostico_VAK_QA_USUARIO_2_YYYY-MM-DD.pdf
  - Validation checks
    - Ensure the PDF download works from the UI results page
    - Validate the embedded URL in the QR points to the correct results service (base https://edutechlife.co/)
    - Confirm the QR decodes reliably with common scanners
  - Cross-browser checks
    - Open the PDFs in Chrome, Firefox, and Safari to verify rendering and QR readability
  - Documentation touch
    - Update a concise QA checklist for Step 3B (fields, layout, QR, download, naming)

- Step 3C: QA documentation
  - Create a lightweight QA guide
    - Checkpoints for the PDF template, QR, and data population
    - Acceptance criteria and pass/fail conditions
  - Include test cases and expected results for the two new QA PDFs

- Step 3D: Staging prep
- Step 3D: Staging prep
+ Step 3D: Staging prep
  - Prepare a staging branch/space with QA-enabled routes
  - Run end-to-end checks (PDF generation, download, and QR validation in staging)

- Step 3D: Deployment plan
  - Outline deployment steps to production after QA passes
  - Define rollback/kill-switch steps in case of issues
  - Document the user-facing impact and any feature flags

- Step 3D: Deployment plan
  - Outline deployment steps to production after QA passes
  - Define rollback/kill-switch steps in case of issues
  - Document the user-facing impact and any feature flags
