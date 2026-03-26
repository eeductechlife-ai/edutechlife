import React, { useState, useEffect } from 'react';
import { Users, Download, Trash2, Search, Phone, Mail, FileText, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'edutechlife_nico_leads';

const LeadsManager = ({ onClose }) => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLeads(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading leads:', e);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Nombre', 'Teléfono', 'Email', 'Motivo', 'Estado', 'Fecha', 'Fuente'];
    const rows = leads.map(lead => [
      lead.nombre || '',
      lead.telefono || '',
      lead.email || '',
      lead.motivo || '',
      lead.stage || '',
      lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '',
      lead.source || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_edutechlife_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteLead = (id) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAllLeads = () => {
    if (window.confirm('¿Estás seguro de eliminar todos los leads? Esta acción no se puede deshacer.')) {
      setLeads([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getStatusBadge = (stage) => {
    const styles = {
      cerrado: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      pendiente: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
      inicio: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: AlertCircle }
    };
    const style = styles[stage] || styles.inicio;
    const Icon = style.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-3 h-3" />
        {stage === 'cerrado' ? 'Cerrado' : stage === 'pendiente' ? 'Pendiente' : 'Nuevo'}
      </span>
    );
  };

  const filteredLeads = leads.filter(lead => {
    const term = searchTerm.toLowerCase();
    return (
      (lead.nombre || '').toLowerCase().includes(term) ||
      (lead.telefono || '').toLowerCase().includes(term) ||
      (lead.email || '').toLowerCase().includes(term) ||
      (lead.motivo || '').toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#4DA8C4] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Leads de Nico</h2>
            <p className="text-sm text-[#66CCCC]">{leads.length} Leads registrados</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-[#66CCCC] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#66CCCC]" />
          <input
            type="text"
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A1628]/80 border border-[#4DA8C4]/30 rounded-lg text-white placeholder-[#66CCCC] focus:outline-none focus:border-[#4DA8C4] text-sm"
          />
        </div>
        <button
          onClick={exportToCSV}
          disabled={leads.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-lg text-[#0A1628] font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
        {leads.length > 0 && (
          <button
            onClick={clearAllLeads}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-medium text-sm hover:bg-red-500/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <Users className="w-16 h-16 text-[#4DA8C4]/30 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No hay leads registrados</h3>
          <p className="text-sm text-[#66CCCC] max-w-xs">
            Los leads se registrarán automáticamente cuando los usuarios muestren interés en comprar servicios.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id || lead.createdAt}
              className="p-4 bg-[#0A1628]/60 border border-[#4DA8C4]/20 rounded-xl hover:border-[#4DA8C4]/40 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold">{lead.nombre || 'Sin nombre'}</h4>
                  <p className="text-xs text-[#66CCCC]">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : 'Fecha unknown'}
                  </p>
                </div>
                {getStatusBadge(lead.stage)}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                {lead.telefono && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="truncate">{lead.telefono}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
              </div>
              
              {lead.motivo && (
                <div className="mt-3 pt-3 border-t border-[#4DA8C4]/20">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-[#4DA8C4] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-400 line-clamp-2">{lead.motivo}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => deleteLead(lead.id || lead.createdAt)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Eliminar lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsManager;