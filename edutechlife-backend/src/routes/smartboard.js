// Entry point for IngenIA routes.
// All domain logic lives in routes/smartboard/{chat,core,parental-consent,...}.js
// app.js resolves require('./routes/smartboard') here — no changes needed there.
module.exports = require('./smartboard/index');
