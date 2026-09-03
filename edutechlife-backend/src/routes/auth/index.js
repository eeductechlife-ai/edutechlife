const { Router } = require('express');

const oauthRoutes = require('./oauth');
const sessionRoutes = require('./session');
const syncRoutes = require('./sync');

const router = Router();

router.use(oauthRoutes);
router.use(sessionRoutes);
router.use(syncRoutes);

module.exports = router;
