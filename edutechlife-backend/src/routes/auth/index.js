const { Router } = require('express');

const oauthRoutes = require('./oauth');
const sessionRoutes = require('./session');
const syncRoutes = require('./sync');
const mfaRoutes = require('./mfa');
const parentEntityRoutes = require('./parentEntity');

const router = Router();

router.use(oauthRoutes);
router.use(sessionRoutes);
router.use(syncRoutes);
router.use(mfaRoutes);
router.use(parentEntityRoutes);

module.exports = router;
