const STORAGE_KEY = 'edutechlife_chat_session';

const MAX_HISTORY_MESSAGES = 10;

export const saveSessionData = (data) => {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    const sessionData = existing ? JSON.parse(existing) : {};
    
    const updated = { ...sessionData, ...data, lastUpdate: new Date().toISOString() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('[ChatMemory] Error saving session:', error);
    return false;
  }
};

export const getSessionData = () => {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : {};
  } catch (error) {
    console.error('[ChatMemory] Error getting session:', error);
    return {};
  }
};

export const addToHistory = (role, text) => {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    let sessionData = existing ? JSON.parse(existing) : { history: [] };
    
    const newMessage = { role, text, timestamp: new Date().toISOString() };
    
    let history = [...(sessionData.history || []), newMessage];
    
    if (history.length > MAX_HISTORY_MESSAGES * 2) {
      history = history.slice(-MAX_HISTORY_MESSAGES * 2);
    }
    
    sessionData.history = history;
    sessionData.lastUpdate = new Date().toISOString();
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    return true;
  } catch (error) {
    console.error('[ChatMemory] Error adding to history:', error);
    return false;
  }
};

export const getHistory = () => {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    const sessionData = existing ? JSON.parse(existing) : {};
    return sessionData.history || [];
  } catch (error) {
    console.error('[ChatMemory] Error getting history:', error);
    return [];
  }
};

export const clearSession = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('[ChatMemory] Error clearing session:', error);
    return false;
  }
};

export const getLeadData = () => {
  try {
    const leadsData = localStorage.getItem('edutechlife_leads');
    if (leadsData) {
      const leads = JSON.parse(leadsData);
      if (leads.length > 0) {
        const lastLead = leads[leads.length - 1];
        return {
          nombre: lastLead.nombre,
          email: lastLead.email,
          telefono: lastLead.telefono,
          interes: lastLead.interes,
          tema: lastLead.tema
        };
      }
    }
    return null;
  } catch (error) {
    console.error('[ChatMemory] Error getting lead data:', error);
    return null;
  }
};

export const buildContextPrompt = () => {
  const history = getHistory();
  const leadData = getLeadData();
  
  let contextPrompt = '';
  
  if (leadData && leadData.nombre) {
    contextPrompt += `DATOS DEL CLIENTE:\n`;
    contextPrompt += `- Nombre: ${leadData.nombre}\n`;
    if (leadData.email) contextPrompt += `- Email: ${leadData.email}\n`;
    if (leadData.telefono) contextPrompt += `- Teléfono: ${leadData.telefono}\n`;
    if (leadData.interes) contextPrompt += `- Interés: ${leadData.interes}\n`;
    if (leadData.tema) contextPrompt += `- Tema de consulta: ${leadData.tema}\n`;
    contextPrompt += `\n`;
  }
  
  if (history.length > 0) {
    contextPrompt += `CONVERSACIÓN ANTERIOR:\n`;
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      const label = msg.role === 'user' ? 'Usuario' : 'Nico';
      contextPrompt += `${label}: ${msg.text}\n`;
    });
  }
  
  return contextPrompt;
};
