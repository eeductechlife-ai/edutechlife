#!/usr/bin/env node
// Automation script to trigger QA PDFs generation in development.
const ENDPOINT = process.env.QA_PDFS_ENDPOINT || 'http://localhost:3000/qa/generate-pdfs';
async function main() {
  let fetchFn;
  try {
    fetchFn = globalThis.fetch;
  } catch (e) {
    fetchFn = null;
  }
  if (typeof fetchFn !== 'function') {
    console.error('Fetch API not available in this Node version. Please run on Node 18+ or install node-fetch.');
    process.exit(2);
  }
  try {
    const res = await fetchFn(ENDPOINT, { method: 'POST' });
    if (!res.ok) {
      console.error('QA PDFs endpoint responded with', res.status, res.statusText);
      process.exit(3);
    }
    const data = await res.text();
    console.log('QA PDFs generation triggered:', data);
  } catch (e) {
    console.error('Error triggering QA PDFs generation:', e);
    process.exit(4);
  }
}
main();
