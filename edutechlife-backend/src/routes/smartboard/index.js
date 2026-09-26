const { Router } = require('express');

const coreRoutes = require('./core');
const chatRoutes = require('./chat');
const daniPhotoRoutes = require('./daniPhoto');
const parentalConsentRoutes = require('./parental-consent');
const studentProfileRoutes = require('./student-profile');
const progressRoutes = require('./progress');
const adaptiveRoutes = require('./adaptive');
const parentInsightsRoutes = require('./parent-insights');
const gamificationRoutes = require('./gamification');
const scanRoutes = require('./scan');
const videoRoutes = require('./videos');

const router = Router();

router.use(coreRoutes);
router.use(chatRoutes);
router.use(daniPhotoRoutes);
router.use(parentalConsentRoutes);
router.use(studentProfileRoutes);
router.use(progressRoutes);
router.use(adaptiveRoutes);
router.use(parentInsightsRoutes);
router.use(gamificationRoutes);
router.use(scanRoutes);
router.use(videoRoutes);

module.exports = router;
