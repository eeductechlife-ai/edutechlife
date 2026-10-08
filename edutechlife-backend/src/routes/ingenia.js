// Entry point for IngenIA routes.
// All domain logic lives in routes/ingenia/{chat,core,parental-consent,...}.js
// app.js resolves require('./routes/ingenia') here — no changes needed there.
module.exports = require('./ingenia/index');
