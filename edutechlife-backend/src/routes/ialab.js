const { Router } = require('express');
const { chat, validateMessages } = require('../services/deepseek');
const { IALAB_SYSTEM_PROMPT, generateFallbackResult } = require('../services/ialabPrompts');
const { modulesData, modulesList } = require('../data/modules');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const progressStore = new Map();

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

router.post('/progress', (req, res) => {
  const { userId, moduleId, completed, score, timestamp } = req.body;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required and must be a string' });
  }
  if (!moduleId || typeof moduleId !== 'number' || moduleId < 1 || moduleId > 5) {
    return res.status(400).json({ error: 'moduleId must be a number between 1 and 5' });
  }

  try {
    let userProgress = progressStore.get(userId) || {
      userId,
      modules: {},
      overallProgress: 0,
      totalScore: 0,
      completedModules: 0,
      lastUpdated: new Date().toISOString(),
      achievements: []
    };

    userProgress.modules[moduleId] = {
      moduleId,
      completed: completed || false,
      score: score || 0,
      timestamp: timestamp || new Date().toISOString()
    };

    const moduleEntries = Object.values(userProgress.modules);
    userProgress.completedModules = moduleEntries.filter(m => m.completed).length;
    userProgress.overallProgress = Math.round((userProgress.completedModules / 5) * 100);
    userProgress.totalScore = moduleEntries.reduce((sum, m) => sum + (m.score || 0), 0);
    userProgress.lastUpdated = new Date().toISOString();

    if (completed && !userProgress.achievements.includes('module_' + moduleId + '_complete')) {
      userProgress.achievements.push('module_' + moduleId + '_complete');
    }
    if (score >= 4 && !userProgress.achievements.includes('module_' + moduleId + '_excellent')) {
      userProgress.achievements.push('module_' + moduleId + '_excellent');
    }
    if (userProgress.completedModules === 5 && !userProgress.achievements.includes('course_complete')) {
      userProgress.achievements.push('course_complete');
    }

    progressStore.set(userId, userProgress);
    console.log('[IALab Progress] Updated progress for user: ' + userId + ', module: ' + moduleId + ', completed: ' + completed + ', score: ' + score);

    res.json({ success: true, progress: userProgress, message: 'Progress saved successfully' });
  } catch (e) {
    console.error('Error saving IALab progress:', e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/progress/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const userProgress = progressStore.get(userId);
    if (!userProgress) {
      return res.json({
        userId, modules: {}, overallProgress: 0, totalScore: 0,
        completedModules: 0, lastUpdated: null, achievements: [],
        message: 'No progress found for this user'
      });
    }
    res.json(userProgress);
  } catch (e) {
    console.error('Error retrieving IALab progress:', e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/modules/:id', (req, res) => {
  const { id } = req.params;
  const moduleId = parseInt(id);
  if (isNaN(moduleId) || moduleId < 1 || moduleId > 5) {
    return res.status(400).json({ error: 'Module ID must be a number between 1 and 5' });
  }
  const module = modulesData[moduleId];
  if (!module) return res.status(404).json({ error: 'Module not found' });
  res.json(module);
});

router.get('/modules', (req, res) => {
  res.json(modulesList);
});

router.post('/templates', (req, res) => {
  try {
    const { userId, templateName, templateData, category, difficulty } = req.body;
    if (!userId || !templateName || !templateData) {
      return res.status(400).json({ error: 'Missing required fields: userId, templateName, templateData' });
    }
    const templateId = 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const savedTemplate = {
      id: templateId, userId, name: templateName, data: templateData,
      category: category || 'general', difficulty: difficulty || 'intermediate',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), usageCount: 0
    };
    console.log('[IALab Templates] Saved template: ' + templateName + ' for user: ' + userId);
    res.status(201).json({ success: true, message: 'Template saved successfully', template: savedTemplate });
  } catch (error) {
    console.error('Error saving IALab template:', error);
    res.status(500).json({ error: 'Failed to save template', details: error.message });
  }
});

router.get('/templates/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { category, difficulty } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const exampleTemplates = [
      {
        id: 'template_1', userId,
        name: 'Análisis de Mercado IA',
        data: { blocks: [
          { type: 'role', content: 'Eres un analista de mercado especializado en tecnologías emergentes' },
          { type: 'context', content: 'El usuario necesita analizar el mercado de soluciones de IA para educación' },
          { type: 'task', content: 'Proporciona un análisis detallado de tendencias, competidores y oportunidades' }
        ]},
        category: 'business', difficulty: 'intermediate',
        createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z', usageCount: 42
      },
      {
        id: 'template_2', userId,
        name: 'Generador de Contenido Educativo',
        data: { blocks: [
          { type: 'role', content: 'Eres un creador de contenido educativo experto' },
          { type: 'tone', content: 'Usa un tono claro, profesional y accesible' },
          { type: 'task', content: 'Genera contenido educativo sobre [tema] para [audiencia]' }
        ]},
        category: 'content', difficulty: 'beginner',
        createdAt: '2024-01-20T14:45:00Z', updatedAt: '2024-01-20T14:45:00Z', usageCount: 78
      }
    ];

    let filteredTemplates = exampleTemplates;
    if (category && category !== 'all') filteredTemplates = filteredTemplates.filter(t => t.category === category);
    if (difficulty && difficulty !== 'all') filteredTemplates = filteredTemplates.filter(t => t.difficulty === difficulty);

    console.log('[IALab Templates] Retrieved ' + filteredTemplates.length + ' templates for user: ' + userId);
    res.json({ success: true, templates: filteredTemplates, total: filteredTemplates.length });
  } catch (error) {
    console.error('Error retrieving IALab templates:', error);
    res.status(500).json({ error: 'Failed to retrieve templates', details: error.message });
  }
});

router.put('/templates/:templateId', (req, res) => {
  try {
    const { templateId } = req.params;
    const { templateName, templateData, category, difficulty } = req.body;
    if (!templateId) return res.status(400).json({ error: 'Template ID is required' });

    console.log('[IALab Templates] Updated template: ' + templateId + ', new name: ' + templateName);
    res.json({
      success: true, message: 'Template updated successfully',
      template: {
        id: templateId, name: templateName || 'Updated Template',
        data: templateData || {}, category: category || 'general',
        difficulty: difficulty || 'intermediate', updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating IALab template:', error);
    res.status(500).json({ error: 'Failed to update template', details: error.message });
  }
});

router.delete('/templates/:templateId', (req, res) => {
  try {
    const { templateId } = req.params;
    if (!templateId) return res.status(400).json({ error: 'Template ID is required' });
    console.log('[IALab Templates] Deleted template: ' + templateId);
    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting IALab template:', error);
    res.status(500).json({ error: 'Failed to delete template', details: error.message });
  }
});

router.post('/evaluate-prompt', (req, res) => {
  try {
    const { prompt, criteria } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required for evaluation' });

    const evaluationCriteria = criteria || {
      clarity: 'Clarity and specificity',
      structure: 'Logical structure',
      completeness: 'Completeness of information',
      tone: 'Appropriate tone for audience',
      actionability: 'Clear actionable requests'
    };

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

const resourcesData = {
  module1: [
    { id: 'res1_m1', name: 'Guía de Prompt Engineering', type: 'pdf', url: '/ialab-resources/templates/module1/masterprompt-template.md' },
    { id: 'res2_m1', name: 'Template MasterPrompt', type: 'template', url: '/ialab-resources/templates/module1/masterprompt-template.md' },
    { id: 'res3_m1', name: 'Infografía Módulo 1', type: 'infographic', url: '/ialab-resources/infographics/module1-infographic.html' }
  ],
  module2: [
    { id: 'res1_m2', name: 'Configuración GPTs', type: 'json', url: '/ialab-resources/templates/module2/gpt-config-template.json' },
    { id: 'res2_m2', name: 'Guía ChatGPT Avanzado', type: 'guide', url: '/ialab-resources/templates/module2/chatgpt-workflow-guide.md' },
    { id: 'res3_m2', name: 'Infografía Módulo 2', type: 'infographic', url: '/ialab-resources/infographics/module2-infographic.html' }
  ],
  module3: [
    { id: 'res1_m3', name: 'Template Investigación', type: 'html', url: '/ialab-resources/templates/module3/research-template.html' },
    { id: 'res2_m3', name: 'Metodología Deep Research', type: 'guide', url: '/ialab-resources/templates/module3/deep-research-methodology.md' },
    { id: 'res3_m3', name: 'Infografía Módulo 3', type: 'infographic', url: '/ialab-resources/infographics/module3-infographic.html' }
  ],
  module4: [
    { id: 'res1_m4', name: 'Workflow NotebookLM', type: 'guide', url: '/ialab-resources/templates/module4/notebooklm-workflow.md' },
    { id: 'res2_m4', name: 'Template Podcast', type: 'template', url: '/ialab-resources/templates/module4/podcast-template.md' },
    { id: 'res3_m4', name: 'Infografía Módulo 4', type: 'infographic', url: '/ialab-resources/infographics/module4-infographic.html' }
  ],
  module5: [
    { id: 'res1_m5', name: 'Template Proyecto Final', type: 'template', url: '/ialab-resources/templates/module5/final-project-template.md' },
    { id: 'res2_m5', name: 'Plantilla Pitch Deck', type: 'template', url: '/ialab-resources/templates/module5/pitch-deck-template.md' },
    { id: 'res3_m5', name: 'Infografía Módulo 5', type: 'infographic', url: '/ialab-resources/infographics/module5-infographic.html' }
  ]
};

router.get('/resources', (req, res) => {
  try {
    const { moduleId, resourceType } = req.query;

    let filteredResources = [];
    if (moduleId && resourcesData[moduleId]) {
      filteredResources = resourcesData[moduleId];
    } else {
      Object.values(resourcesData).forEach(mr => { filteredResources.push(...mr); });
    }

    if (resourceType && resourceType !== 'all') {
      filteredResources = filteredResources.filter(r => r.type === resourceType);
    }

    console.log('[IALab Resources] Retrieved ' + filteredResources.length + ' resources');
    res.json({ success: true, resources: filteredResources, total: filteredResources.length, modules: Object.keys(resourcesData) });
  } catch (error) {
    console.error('Error retrieving IALab resources:', error);
    res.status(500).json({ error: 'Failed to retrieve resources', details: error.message });
  }
});

module.exports = router;
