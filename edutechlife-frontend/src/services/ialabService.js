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

// Helper para detectar errores de aborto y manejarlos silenciosamente
const isAbortError = (error) => error?.name === 'AbortError';

// Servicio de Templates
export const ialabTemplatesService = {
  saveTemplate: async (templateData, signal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
        signal,
      });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error saving template:', error);
      throw error;
    }
  },

  getUserTemplates: async (userId, filters = {}, signal) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/ialab/templates/${userId}${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, { signal });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error fetching user templates:', error);
      throw error;
    }
  },

  updateTemplate: async (templateId, templateData, signal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
        signal,
      });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error updating template:', error);
      throw error;
    }
  },

  deleteTemplate: async (templateId, signal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/templates/${templateId}`, {
        method: 'DELETE',
        signal,
      });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};

// Servicio de Evaluación de Prompts
export const ialabEvaluationService = {
  evaluatePrompt: async (prompt, criteria, signal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/evaluate-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, criteria }),
        signal,
      });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error evaluating prompt:', error);
      throw error;
    }
  },

  evaluatePromptWithIALabCriteria: async (prompt, signal) => {
    const ialabCriteria = {
      clarity: 'Clarity and specificity for AI understanding',
      structure: 'Logical structure and flow',
      completeness: 'Completeness of required information',
      tone: 'Appropriate tone for educational context',
      actionability: 'Clear actionable requests for the AI',
      creativity: 'Innovative approach to prompt design',
      reusability: 'Potential for reuse in different contexts'
    };
    return ialabEvaluationService.evaluatePrompt(prompt, ialabCriteria, signal);
  }
};

// Servicio de Recursos del Curso
export const ialabResourcesService = {
  getResources: async (filters = {}, signal) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.moduleId) queryParams.append('moduleId', filters.moduleId);
      if (filters.resourceType) queryParams.append('resourceType', filters.resourceType);
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/ialab/resources${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, { signal });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  getResourcesByModule: async (moduleId, signal) => {
    return ialabResourcesService.getResources({ moduleId }, signal);
  },

  getResourcesByType: async (resourceType, signal) => {
    return ialabResourcesService.getResources({ resourceType }, signal);
  },

  downloadResource: async (resourceUrl, signal) => {
    try {
      const response = await fetch(resourceUrl, { signal });
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
      if (isAbortError(error)) return;
      console.error('Error downloading resource:', error);
      throw error;
    }
  }
};

// Servicio de Progreso del Curso
export const ialabProgressService = {
  saveProgress: async (progressData, signal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
        signal,
      });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error saving progress:', error);
      throw error;
    }
  },

  getProgress: async (userId, signal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/progress/${userId}`, { signal });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  updateModuleProgress: async (userId, moduleId, completed, score, signal) => {
    const progressData = {
      userId,
      moduleId,
      completed: completed || false,
      score: score || 0,
      timestamp: new Date().toISOString()
    };
    return ialabProgressService.saveProgress(progressData, signal);
  }
};

// Servicio de Generación de Prompts
export const ialabPromptService = {
  generatePrompt: async (templateType, parameters, signal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ialab/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateType, parameters }),
        signal,
      });
      return handleResponse(response);
    } catch (error) {
      if (isAbortError(error)) return;
      console.error('Error generating prompt:', error);
      throw error;
    }
  },

  generateMarketAnalysisPrompt: async (industry, targetAudience, signal) => {
    return ialabPromptService.generatePrompt('market_analysis', {
      industry,
      targetAudience,
      depth: 'comprehensive',
      format: 'executive_report'
    }, signal);
  },

  generateEducationalContentPrompt: async (topic, audience, length, signal) => {
    return ialabPromptService.generatePrompt('educational_content', {
      topic,
      audience,
      length: length || 'medium',
      tone: 'professional_accessible'
    }, signal);
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

    return {
      userId: ialabService.getCurrentUserId(),
      timestamp: new Date().toISOString()
    };
  }
};

export default ialabService;