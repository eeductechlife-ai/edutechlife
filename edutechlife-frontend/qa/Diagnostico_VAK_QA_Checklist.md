Diagnostico VAK QA Checklist

- [ ] PDF template margins and spacing are consistent across Chrome/Firefox/Safari
- [ ] QR code is anchored in the footer and legible at various DPIs
- [ ] URL embedded in QR points to https://edutechlife.co/
- [ ] PDF includes student name, date, profile color, counts, profile description, and 3 strategies
- [ ] Two QA PDFs generated:
  - Diagnostico_VAK_QA_USUARIO_YYYY-MM-DD.pdf
  - Diagnostico_VAK_QA_USUARIO_2_YYYY-MM-DD.pdf
- [ ] Download button on results UI triggers PDF download
- [ ] When QA mode is enabled, production flows are not affected
- [ ] Cross-browser: verify in Chrome, Firefox, Safari
- [ ] No inclusion of answer summaries in PDF
- [ ] QA route qa_demo remains isolated from production
