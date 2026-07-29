const { Router } = require('express');
const supabase = require('../../db/supabase');

const router = Router();

const STORAGE = 'https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public';

const resourcesData = {
  module1: [
    { id: 'res1_m1', name: 'Guía de Prompt Engineering', type: 'pdf', url: STORAGE + '/recursos-edutechlife/guia_edutechlife_modulo1.pdf' },
    { id: 'res2_m1', name: 'Template MasterPrompt', type: 'template', url: STORAGE + '/recursos-edutechlife/guia_edutechlife_modulo1.pdf' },
    { id: 'res3_m1', name: 'Infografía Módulo 1', type: 'infographic', url: STORAGE + '/recursos-edutechlife/guia_edutechlife_modulo1.pdf' }
  ],
  module2: [
    { id: 'res1_m2', name: 'Configuración GPTs', type: 'json', url: STORAGE + '/modulo%202%20guia%20de%20intro/Las-Herramientas-Integradas-de-ChatGPT.pdf' },
    { id: 'res2_m2', name: 'Guía ChatGPT Avanzado', type: 'guide', url: STORAGE + '/modulo%202%20guia%20de%20intro/guia_edutechlife_modulo2.pdf' },
    { id: 'res3_m2', name: 'Infografía Módulo 2', type: 'infographic', url: STORAGE + '/modulo%202%20guia%20de%20intro/guia_edutechlife_modulo2.pdf' }
  ],
  module3: [
    { id: 'res1_m3', name: 'Template Investigación', type: 'html', url: STORAGE + '/modulo%203/3%20Gemini_Research_Mastery.pdf' },
    { id: 'res2_m3', name: 'Metodología Deep Research', type: 'guide', url: STORAGE + '/modulo%203/2-%20guia_edutechlife_modulo3_gemini.pdf' },
    { id: 'res3_m3', name: 'Infografía Módulo 3', type: 'infographic', url: STORAGE + '/modulo%203/3-infografia.png' }
  ],
  module4: [
    { id: 'res1_m4', name: 'Workflow NotebookLM', type: 'guide', url: STORAGE + '/guia%204%20nootbook%20lm/6-%20NotebookLM_El_Cuaderno_del_Futuro.pdf' },
    { id: 'res2_m4', name: 'Template Podcast', type: 'template', url: STORAGE + '/guia%204%20nootbook%20lm/3-INFOGRAFIA.jpeg' },
    { id: 'res3_m4', name: 'Infografía Módulo 4', type: 'infographic', url: STORAGE + '/guia%204%20nootbook%20lm/3-INFOGRAFIA.jpeg' }
  ],
  module5: [
    { id: 'res1_m5', name: 'Template Proyecto Final', type: 'template', url: STORAGE + '/modulo%205/2-guia_edutechlife_modulo5.pdf' },
    { id: 'res2_m5', name: 'Plantilla Pitch Deck', type: 'template', url: STORAGE + '/modulo%205/7-Ethical_AI_Mastery.pdf' },
    { id: 'res3_m5', name: 'Infografía Módulo 5', type: 'infographic', url: STORAGE + '/modulo%205/2-guia_edutechlife_modulo5.pdf' }
  ]
};

function isSupabaseReady() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

/**
 * @swagger
 * /api/ialab/resources:
 *   get:
 *     summary: Obtener recursos educativos de IALab
 *     tags: [IALab]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Filtrar por módulo (module1, module2, etc.)
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *           enum: [pdf, template, infographic, json, guide, html]
 *         description: Filtrar por tipo de recurso
 *     responses:
 *       200:
 *         description: Lista de recursos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 resources:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const { moduleId, resourceType } = req.query;

    let filteredResources = [];

    if (isSupabaseReady()) {
      try {
        let topicQuery = supabase.from('module_topics').select('id');
        if (moduleId) {
          const modNum = parseInt(moduleId.replace('module', ''));
          topicQuery = topicQuery.eq('module_id', modNum);
        }
        const { data: topics } = await topicQuery;
        const topicIds = (topics || []).map(t => t.id);

        if (topicIds.length > 0) {
          let resQuery = supabase
            .from('module_resources')
            .select('id, title, type, url, description, sort_order')
            .in('topic_id', topicIds);
          if (resourceType && resourceType !== 'all') {
            resQuery = resQuery.eq('type', resourceType);
          }
          const { data: dbResources, error } = await resQuery.order('sort_order');

          if (!error && dbResources && dbResources.length > 0) {
            filteredResources = dbResources.map((r, i) => ({
              id: r.id || 'res_db_' + i,
              name: r.title,
              type: r.type,
              url: r.url,
              description: r.description || ''
            }));
          }
        }
      } catch (dbErr) {
        console.warn('[IALab Resources] DB fallback to static:', dbErr.message);
      }
    }

    if (filteredResources.length === 0) {
      if (moduleId && resourcesData[moduleId]) {
        filteredResources = resourcesData[moduleId];
      } else {
        Object.values(resourcesData).forEach(mr => { filteredResources.push(...mr); });
      }
      if (resourceType && resourceType !== 'all') {
        filteredResources = filteredResources.filter(r => r.type === resourceType);
      }
    }

    console.log('[IALab Resources] Retrieved ' + filteredResources.length + ' resources');
    res.json({ success: true, resources: filteredResources, total: filteredResources.length, modules: Object.keys(resourcesData) });
  } catch (error) {
    console.error('Error retrieving IALab resources:', error);
    res.status(500).json({ error: 'Failed to retrieve resources', details: error.message });
  }
});

module.exports = router;
