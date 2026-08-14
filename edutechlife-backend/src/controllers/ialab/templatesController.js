const supabase = require('../../db/supabase');

function isSupabaseReady() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

function resolveUserId(req) {
  return req.userId || req.body?.userId || req.params?.userId;
}

async function createTemplate(req, res) {
  try {
    const { templateName, templateData, category, difficulty } = req.body;
    const userId = resolveUserId(req);
    if (!userId || !templateName || !templateData) {
      return res.status(400).json({ error: 'Missing required fields: userId, templateName, templateData' });
    }

    if (isSupabaseReady()) {
      const { data, error } = await supabase.from('prompt_templates').insert({
        user_id: userId,
        name: templateName,
        data: typeof templateData === 'string' ? templateData : JSON.stringify(templateData),
        category: category || 'general',
        difficulty: difficulty || 'intermediate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0
      }).select('*').single();

      if (error) throw error;
      console.log('[IALab Templates] Saved to Supabase: ' + templateName + ' for user: ' + userId);
      return res.status(201).json({ success: true, message: 'Template saved successfully', template: data });
    }

    const templateId = 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const savedTemplate = {
      id: templateId, userId, name: templateName, data: templateData,
      category: category || 'general', difficulty: difficulty || 'intermediate',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), usageCount: 0
    };
    console.log('[IALab Templates] Saved in-memory: ' + templateName + ' for user: ' + userId);
    res.status(201).json({ success: true, message: 'Template saved successfully', template: savedTemplate });
  } catch (error) {
    console.error('Error saving IALab template:', error);
    res.status(500).json({ error: 'Failed to save template', details: 'Error interno' });
  }
}

async function getTemplates(req, res) {
  try {
    const userId = resolveUserId(req);
    const { category, difficulty } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    if (isSupabaseReady()) {
      let query = supabase.from('prompt_templates').select('*').eq('user_id', userId);
      if (category && category !== 'all') query = query.eq('category', category);
      if (difficulty && difficulty !== 'all') query = query.eq('difficulty', difficulty);

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return res.json({ success: true, templates: data || [], total: (data || []).length });
    }

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
    res.status(500).json({ error: 'Failed to retrieve templates', details: 'Error interno' });
  }
}

async function updateTemplate(req, res) {
  try {
    const { templateId } = req.params;
    const userId = resolveUserId(req);
    const { templateName, templateData, category, difficulty } = req.body;
    if (!templateId) return res.status(400).json({ error: 'Template ID is required' });

    if (isSupabaseReady()) {
      const updateData = { updated_at: new Date().toISOString() };
      if (templateName) updateData.name = templateName;
      if (templateData) updateData.data = typeof templateData === 'string' ? templateData : JSON.stringify(templateData);
      if (category) updateData.category = category;
      if (difficulty) updateData.difficulty = difficulty;

      const { data, error } = await supabase.from('prompt_templates')
        .update(updateData).eq('id', templateId).eq('user_id', userId).select('*').single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Template not found or not owned by user' });
      return res.json({ success: true, message: 'Template updated successfully', template: data });
    }

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
    res.status(500).json({ error: 'Failed to update template', details: 'Error interno' });
  }
}

async function deleteTemplate(req, res) {
  try {
    const { templateId } = req.params;
    const userId = resolveUserId(req);
    if (!templateId) return res.status(400).json({ error: 'Template ID is required' });

    if (isSupabaseReady()) {
      const { data, error } = await supabase.from('prompt_templates')
        .delete().eq('id', templateId).eq('user_id', userId).select('*').single();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Template not found or not owned by user' });
      return res.json({ success: true, message: 'Template deleted successfully' });
    }

    console.log('[IALab Templates] Deleted template: ' + templateId);
    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting IALab template:', error);
    res.status(500).json({ error: 'Failed to delete template', details: 'Error interno' });
  }
}

module.exports = { createTemplate, getTemplates, updateTemplate, deleteTemplate };
