const { Router } = require('express');
const { chat } = require('../services/deepseek');
const { IALAB_SYSTEM_PROMPT, generateFallbackResult } = require('../services/ialabPrompts');
const { modulesData, modulesList } = require('../data/modules');
const supabase = require('../db/supabase');
const { saveProgress, getProgress } = require('../controllers/ialab/progressController');
const { createTemplate, getTemplates, updateTemplate, deleteTemplate } = require('../controllers/ialab/templatesController');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

function isSupabaseReady() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

router.post('/prompts', async (req, res) => {
  const { prompt, templateType = 'general' } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
  }
  if (prompt.length > 2000) {
    return res.status(400).json({ error: 'Prompt too long (max 2000 characters for IALab)' });
  }
  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const startTime = Date.now();
  const systemPrompt = IALAB_SYSTEM_PROMPT.replace('{templateType}', templateType);

  try {
    const data = await chat(DEEPSEEK_API_KEY, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Genera un MasterPrompt para: "' + prompt + '"' }
      ],
      isJson: true,
      temperature: process.env.IALAB_TEMPERATURE || 0.7,
      maxTokens: process.env.IALAB_MAX_TOKENS || 800,
      model: 'deepseek-chat'
    });

    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from API' });

    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
      if (!parsedResult.masterPrompt || !parsedResult.feedback) {
        throw new Error('Invalid response structure from AI');
      }
      parsedResult.templateType = templateType;
      parsedResult.originalPrompt = prompt;
      parsedResult.timestamp = new Date().toISOString();
      parsedResult.responseTime = Date.now() - startTime;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      parsedResult = generateFallbackResult(prompt, templateType, startTime);
    }

    console.log('[IALab Prompts] Generated prompt for template: ' + templateType + ' | Time: ' + (Date.now() - startTime) + 'ms');
    res.json(parsedResult);
  } catch (e) {
    console.error('Error in IALab prompts endpoint:', e);
    res.status(500).json({
      error: e.message,
      fallback: {
        masterPrompt: 'Genera un prompt profesional para: ' + prompt + '. Sé específico con el contexto y formato de respuesta.',
        feedback: 'Error en la generación. Revisa tu prompt e intenta de nuevo.',
        difficulty: 'beginner',
        templateType: templateType
      }
    });
  }
});

router.post('/progress', saveProgress);

router.get('/progress/:userId', getProgress);

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

router.get('/modules', (req, res) => {
  res.json(modulesList);
});

router.post('/templates', createTemplate);
router.get('/templates/:userId', getTemplates);
router.put('/templates/:templateId', updateTemplate);
router.delete('/templates/:templateId', deleteTemplate);

router.post('/evaluate-prompt', (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required for evaluation' });

    const wordCount = prompt.split(/\s+/).length;
    const hasRole = /eres|you are/i.test(prompt);
    const hasTask = /tarea|task/i.test(prompt);
    const hasConstraints = /evita|avoid/i.test(prompt);

    const scores = {
      clarity: Math.min(10, Math.floor(wordCount / 50) + (hasRole ? 3 : 0)),
      structure: Math.min(10, (hasRole && hasTask && hasConstraints) ? 9 : 6),
      completeness: Math.min(10, Math.floor(prompt.length / 200)),
      tone: 8,
      actionability: hasTask ? 9 : 5
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    const feedback = [];
    if (wordCount < 50) feedback.push('Considera agregar más detalles al prompt');
    if (!hasRole) feedback.push('Agrega un rol específico para el asistente de IA');
    if (!hasTask) feedback.push('Define claramente la tarea principal');
    if (!hasConstraints) feedback.push('Considera agregar restricciones para mejores resultados');

    console.log('[IALab Evaluation] Evaluated prompt of ' + wordCount + ' words, score: ' + totalScore.toFixed(1) + '/10');
    res.json({
      success: true,
      evaluation: {
        scores, totalScore: totalScore.toFixed(1),
        metrics: { length: prompt.length, wordCount, hasRole, hasTask, hasConstraints },
        feedback,
        grade: totalScore >= 8 ? 'Excelente' : totalScore >= 6 ? 'Bueno' : 'Necesita mejora',
        suggestions: [
          'Usa un rol específico para el asistente',
          'Define la tarea principal claramente',
          'Incluye ejemplos concretos cuando sea posible',
          'Especifica el formato de respuesta deseado'
        ]
      }
    });
  } catch (error) {
    console.error('Error evaluating prompt:', error);
    res.status(500).json({ error: 'Failed to evaluate prompt', details: error.message });
  }
});

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

router.get('/resources', async (req, res) => {
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
