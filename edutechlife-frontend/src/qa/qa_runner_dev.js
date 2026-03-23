// Development QA runner for Diagnóstico VAK PDFs
// Provides a lightweight entry to trigger QA PDF generation in dev envs

export function initQADevRunner() {
  if (typeof window !== 'undefined' && typeof window.generateTwoQA_PDFs === 'function') {
    console.info('QA Dev Runner ready. Call runQA() to generate QA PDFs.');
  } else {
    console.info('QA Dev Runner not available in this environment.');
  }
}

export async function runQA() {
  if (typeof window !== 'undefined' && typeof window.generateTwoQA_PDFs === 'function') {
    try {
      await window.generateTwoQA_PDFs();
      console.info('QA PDFs generation attempted.');
    } catch (e) {
      console.error('QA PDFs generation failed:', e);
    }
  } else {
    console.warn('QA PDF generator is not available in this environment.');
  }
}
