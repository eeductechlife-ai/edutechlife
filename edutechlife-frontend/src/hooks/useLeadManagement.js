import { useState, useCallback } from 'react';

const LEADS_STORAGE_KEY = 'edutechlife_leads';

export function useLeadManagement() {
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem(LEADS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading leads:', e);
    }
    return [];
  });

  const saveLeads = useCallback((newLeads) => {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(newLeads));
    } catch (e) {
      console.error('Error saving leads:', e);
    }
  }, []);

  const createLead = useCallback((leadData) => {
    const newLead = {
      id: `lead_${Date.now()}`,
      timestamp: new Date().toISOString(),
      datos: {
        nombre: leadData.nombre || null,
        telefono: leadData.telefono || null,
        email: leadData.email || null,
        motivo: leadData.motivo || null,
      },
      messages: leadData.messages || [],
      estado: 'completado',
      source: 'nico_chat',
    };

    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
    
    return newLead.id;
  }, [leads, saveLeads]);

  const addMessageToLead = useCallback((leadId, message) => {
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          messages: [...lead.messages, message],
        };
      }
      return lead;
    });
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
  }, [leads, saveLeads]);

  const getLeadById = useCallback((leadId) => {
    return leads.find(lead => lead.id === leadId);
  }, [leads]);

  const getAllLeads = useCallback(() => {
    return leads;
  }, [leads]);

  const getLeadsByDate = useCallback((date) => {
    return leads.filter(lead => 
      lead.timestamp.startsWith(date)
    );
  }, [leads]);

  const exportLeadsToCSV = useCallback(() => {
    const headers = ['ID', 'Fecha', 'Nombre', 'Teléfono', 'Email', 'Motivo', 'Estado'];
    const rows = leads.map(lead => [
      lead.id,
      new Date(lead.timestamp).toLocaleString('es-CO'),
      lead.datos.nombre || '',
      lead.datos.telefono || '',
      lead.datos.email || '',
      lead.datos.motivo || '',
      lead.estado,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_edutechlife_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [leads]);

  const clearAllLeads = useCallback(() => {
    setLeads([]);
    saveLeads([]);
  }, [saveLeads]);

  const deleteLead = useCallback((leadId) => {
    const updatedLeads = leads.filter(lead => lead.id !== leadId);
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
  }, [leads, saveLeads]);

  return {
    leads,
    createLead,
    addMessageToLead,
    getLeadById,
    getAllLeads,
    getLeadsByDate,
    exportLeadsToCSV,
    clearAllLeads,
    deleteLead,
  };
}

export default useLeadManagement;
