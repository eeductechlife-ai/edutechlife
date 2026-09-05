// Entry point for Auth routes.
// All domain logic lives in routes/auth/{oauth,session,sync}.js
// app.js resolves require('./routes/auth') here — no changes needed there.
module.exports = require('./auth/index');
