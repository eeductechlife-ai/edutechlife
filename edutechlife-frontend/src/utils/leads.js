import * as XLSX from 'xlsx';

const STORAGE_KEY = 'edutechlife_leads';

export const LEAD_STATUS = {
  NUEVO: 'nuevo',
  EN_PROCESO: 'en_proceso',
  CONTACTADO: 'contactado',
  CONVERTIDO: 'convertido',
  NO_INTERESADO: 'no_interesado'
};

export const LEAD_INTEREST = {
  DIAGNOSTICO_VAK: 'diagnostico_vak',
  CURSOS: 'cursos',
  METODOLOGIA: 'metodologia',
  PRECIOS: 'precios',
  GENERAL: 'general',
  OTRO: 'otro'
};

const TRIGGER_WORDS = [
  'precio', 'cuesta', 'cotización', 'cuánto', 'cuanto',
  'interesa', 'quiero', 'me gustaría', 'quisiera',
  'cómo funciona', 'contactar', 'asesor', 'asesoría',
  'inscribirme', 'matricular', 'comprar', 'adquirir',
  'servicio', 'planes', 'suscripción', 'suscripcion',
  'demo', 'prueba', 'estudiar', 'aprender',
  'niño', 'niña', 'estudiante', 'colegio', 'escuela',
  'steam', 'vak', 'diagnóstico', 'diagnostico'
];

export const detectInterest = (message) => {
  if (!message) return null;
  
  const lowerMessage = message.toLowerCase();
  
  const interestMapping = {
    diagnostico: LEAD_INTEREST.DIAGNOSTICO_VAK,
    'diagnóstico': LEAD_INTEREST.DIAGNOSTICO_VAK,
    vak: LEAD_INTEREST.DIAGNOSTICO_VAK,
    steam: LEAD_INTEREST.METODOLOGIA,
    metodología: LEAD_INTEREST.METODOLOGIA,
    metodologia: LEAD_INTEREST.METODOLOGIA,
    curso: LEAD_INTEREST.CURSOS,
    cursos: LEAD_INTEREST.CURSOS,
    clase: LEAD_INTEREST.CURSOS,
    precio: LEAD_INTEREST.PRECIOS,
    cuesta: LEAD_INTEREST.PRECIOS,
    cuanto: LEAD_INTEREST.PRECIOS,
    cuánto: LEAD_INTEREST.PRECIOS,
    plan: LEAD_INTEREST.PRECIOS,
    plans: LEAD_INTEREST.PRECIOS,
  };

  for (const [key, value] of Object.entries(interestMapping)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }

  if (TRIGGER_WORDS.some(word => lowerMessage.includes(word))) {
    return LEAD_INTEREST.GENERAL;
  }

  return null;
};

export const shouldPromptForLead = (messageCount, hasInterest, hasLeadData) => {
  if (hasLeadData) return false;
  if (messageCount < 3) return false;
  return hasInterest;
};

export const saveLead = (leadData) => {
  try {
    const now = new Date();
    const lead = {
      id: `lead_${Date.now()}`,
      fecha: now.toLocaleDateString('es-CO'),
      hora: now.toLocaleTimeString('es-CO'),
      fechaCompleta: now.toISOString(),
      nombre: leadData.nombre || '',
      email: leadData.email || '',
      telefono: leadData.telefono || '',
      interes: leadData.interes || LEAD_INTEREST.GENERAL,
      tema: leadData.tema || '',
      estado: LEAD_STATUS.NUEVO,
      notas: ''
    };

    const existingData = localStorage.getItem(STORAGE_KEY);
    let leads = existingData ? JSON.parse(existingData) : [];
    
    leads.push(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    
    downloadLeadExcel(lead);
    
    console.log('[LEAD] Lead guardado:', lead);
    return { success: true, lead };
  } catch (error) {
    console.error('[LEAD] Error al guardar:', error);
    return { success: false, error };
  }
};

export const downloadLeadExcel = (lead) => {
  try {
    const data = [{
      'Fecha': lead.fecha,
      'Hora': lead.hora,
      'Nombre': lead.nombre,
      'Email': lead.email,
      'Teléfono': lead.telefono,
      'Interés': formatInterest(lead.interes),
      'Tema': lead.tema,
      'Estado': lead.estado
    }];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    
    const filename = `Lead-${lead.nombre.replace(/\s+/g, '_')}-${lead.fecha.replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    console.log('[LEAD] Excel descargado:', filename);
    return true;
  } catch (error) {
    console.error('[LEAD] Error al descargar Excel:', error);
    return false;
  }
};

export const downloadAllLeadsExcel = () => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const leads = existingData ? JSON.parse(existingData) : [];
    
    if (leads.length === 0) {
      alert('No hay leads guardados');
      return false;
    }

    const data = leads.map(lead => ({
      'Fecha': lead.fecha,
      'Hora': lead.hora,
      'Nombre': lead.nombre,
      'Email': lead.email,
      'Teléfono': lead.telefono,
      'Interés': formatInterest(lead.interes),
      'Tema': lead.tema,
      'Estado': lead.estado
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Todos los Leads');
    
    const filename = `Leads-Edutechlife-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    console.log('[LEAD] Excel completo descargado');
    return true;
  } catch (error) {
    console.error('[LEAD] Error al descargar Excel completo:', error);
    return false;
  }
};

export const getLeads = () => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error('[LEAD] Error al obtener leads:', error);
    return [];
  }
};

export const updateLeadStatus = (leadId, newStatus) => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    let leads = existingData ? JSON.parse(existingData) : [];
    
    leads = leads.map(lead => 
      lead.id === leadId ? { ...lead, estado: newStatus } : lead
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return true;
  } catch (error) {
    console.error('[LEAD] Error al actualizar estado:', error);
    return false;
  }
};

const formatInterest = (interes) => {
  const mapping = {
    [LEAD_INTEREST.DIAGNOSTICO_VAK]: 'Diagnóstico VAK',
    [LEAD_INTEREST.CURSOS]: 'Cursos',
    [LEAD_INTEREST.METODOLOGIA]: 'Metodología',
    [LEAD_INTEREST.PRECIOS]: 'Precios',
    [LEAD_INTEREST.GENERAL]: 'Consulta General',
    [LEAD_INTEREST.OTRO]: 'Otro'
  };
  return mapping[interes] || 'No especificado';
};

export const getInterestLabel = (interes) => {
  return formatInterest(interes);
};
