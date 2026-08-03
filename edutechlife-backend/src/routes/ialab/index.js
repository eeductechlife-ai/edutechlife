const { Router } = require('express');
const supabase = require('../../db/supabase');
const { modulesData, modulesList } = require('../../data/modules');
const { saveProgress, getProgress } = require('../../controllers/ialab/progressController');
const { createTemplate, getTemplates, updateTemplate, deleteTemplate } = require('../../controllers/ialab/templatesController');
const { examSubmissionLimiter, challengeSubmissionLimiter } = require('../../middleware/rateLimiter');

const router = Router();

function isSupabaseReady() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

// Sub-routers
router.use('/prompts', require('./prompts'));
router.use('/evaluate-prompt', require('./evaluate'));
router.use('/resources', require('./resources'));

router.post('/progress', examSubmissionLimiter, saveProgress);
router.get('/progress/:userId', getProgress);

router.get('/modules', (req, res) => {
  res.json(modulesList);
});

router.get('/modules/:id', async (req, res) => {
  const { id } = req.params;
  const moduleId = parseInt(id);
  if (isNaN(moduleId) || moduleId < 1 || moduleId > 5) {
    return res.status(400).json({ error: 'Module ID must be a number between 1 and 5' });
  }

  if (isSupabaseReady()) {
    try {
      const { data: fullModule, error } = await supabase
        .rpc('get_module_full', { module_id: moduleId });

      if (!error && fullModule && fullModule.module) {
        return res.json(fullModule);
      }
    } catch (dbErr) {
      console.warn('[IALab Modules] DB fallback for module ' + moduleId + ':', dbErr.message);
    }
  }

  const module = modulesData[moduleId];
  if (!module) return res.status(404).json({ error: 'Module not found' });
  res.json(module);
});

router.post('/templates', createTemplate);
router.get('/templates/:userId', getTemplates);
router.put('/templates/:templateId', updateTemplate);
router.delete('/templates/:templateId', deleteTemplate);

module.exports = router;
