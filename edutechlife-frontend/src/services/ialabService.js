// Servicio para interactuar con los endpoints de IALab del backend

const API_BASE_URL = 'http://localhost:3001/api';

// Función para manejar errores de fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status}`
    }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Servicio de Templates
export const ialabTemplatesService = {
  // Guardar un nuevo template
  saveTemplate: async (templateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  },

  // Obtener templates de un usuario
  getUserTemplates: async (userId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/ialab/templates/${userId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching user templates:', error);
      throw error;
    }
  },

  // Actualizar un template existente
  updateTemplate: async (templateId, templateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Eliminar un template
  deleteTemplate: async (templateId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/templates/${templateId}`, {
        method: 'DELETE',
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};

// Servicio de Evaluación de Prompts
export const ialabEvaluationService = {
  // Evaluar un prompt automáticamente
  evaluatePrompt: async (prompt, criteria) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/evaluate-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, criteria }),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error evaluating prompt:', error);
      throw error;
    }
  },

  // Evaluar prompt con criterios específicos de IALab
  evaluatePromptWithIALabCriteria: async (prompt) => {
    const ialabCriteria = {
      clarity: 'Clarity and specificity for AI understanding',
      structure: 'Logical structure and flow',
      completeness: 'Completeness of required information',
      tone: 'Appropriate tone for educational context',
      actionability: 'Clear actionable requests for the AI',
      creativity: 'Innovative approach to prompt design',
      reusability: 'Potential for reuse in different contexts'
    };

    return ialabEvaluationService.evaluatePrompt(prompt, ialabCriteria);
  }
};

// Servicio de Recursos del Curso
export const ialabResourcesService = {
  // Obtener recursos del curso
  getResources: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.moduleId) queryParams.append('moduleId', filters.moduleId);
      if (filters.resourceType) queryParams.append('resourceType', filters.resourceType);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/ialab/resources${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Obtener recursos por módulo
  getResourcesByModule: async (moduleId) => {
    return ialabResourcesService.getResources({ moduleId });
  },

  // Obtener recursos por tipo
  getResourcesByType: async (resourceType) => {
    return ialabResourcesService.getResources({ resourceType });
  },

  // Descargar un recurso
  downloadResource: async (resourceUrl) => {
    try {
      const response = await fetch(resourceUrl);
      if (!response.ok) {
        throw new Error(`Failed to download resource: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resourceUrl.split('/').pop() || 'resource';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Resource downloaded successfully' };
    } catch (error) {
      console.error('Error downloading resource:', error);
      throw error;
    }
  }
};

// Servicio de Progreso del Curso
export const ialabProgressService = {
  // Guardar progreso del usuario
  saveProgress: async (progressData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  },

  // Obtener progreso del usuario
  getProgress: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/progress/${userId}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  // Actualizar progreso de un módulo
  updateModuleProgress: async (userId, moduleId, completed, score) => {
    const progressData = {
      userId,
      moduleId,
      completed: completed || false,
      score: score || 0,
      timestamp: new Date().toISOString()
    };

    return ialabProgressService.saveProgress(progressData);
  }
};

// Servicio de Generación de Prompts
export const ialabPromptService = {
  // Generar prompt especializado
  generatePrompt: async (templateType, parameters) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateType, parameters }),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw error;
    }
  },

  // Generar prompt para análisis de mercado
  generateMarketAnalysisPrompt: async (industry, targetAudience) => {
    return ialabPromptService.generatePrompt('market_analysis', {
      industry,
      targetAudience,
      depth: 'comprehensive',
      format: 'executive_report'
    });
  },

  // Generar prompt para contenido educativo
  generateEducationalContentPrompt: async (topic, audience, length) => {
    return ialabPromptService.generatePrompt('educational_content', {
      topic,
      audience,
      length: length || 'medium',
      tone: 'professional_accessible'
    });
  }
};

// Servicio unificado de IALab
const ialabService = {
  templates: ialabTemplatesService,
  evaluation: ialabEvaluationService,
  resources: ialabResourcesService,
  progress: ialabProgressService,
  prompts: ialabPromptService,

  // Métodos de utilidad
  getCurrentUserId: () => {
    // En un sistema real, esto vendría de la autenticación
    // Por ahora, usamos un ID de usuario simulado
    const storedUserId = localStorage.getItem('ialab_user_id');
    if (!storedUserId) {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ialab_user_id', newUserId);
      return newUserId;
    }
    return storedUserId;
  },

  // Inicializar servicios
  initialize: () => {
    console.log('IALab Service initialized');
    return {
      userId: ialabService.getCurrentUserId(),
      timestamp: new Date().toISOString()
    };
  }
};

export default ialabService;