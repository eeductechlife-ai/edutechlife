const architectures = {
  basica: {
    nodes: [
      { id: 'users', x: 50, y: 50, label: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z', color: '#4DA8C4' },
      { id: 'web', x: 50, y: 160, label: 'Web / App', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418', color: '#4DA8C4' },
      { id: 'chatbot', x: 200, y: 105, label: 'Chatbot IA', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: '#66CCCC' },
      { id: 'reports', x: 200, y: 210, label: 'Reportes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: '#66CCCC' },
      { id: 'notif', x: 350, y: 105, label: 'Notificaciones', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: '#4DA8C4' },
      { id: 'crm', x: 350, y: 210, label: 'CRM', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z', color: '#004B63' },
    ],
    edges: [
      { from: 'users', to: 'web' },
      { from: 'web', to: 'chatbot' },
      { from: 'web', to: 'reports' },
      { from: 'chatbot', to: 'notif' },
      { from: 'reports', to: 'crm' },
    ],
  },
  intermedia: {
    nodes: [
      { id: 'users', x: 50, y: 80, label: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197', color: '#4DA8C4' },
      { id: 'api', x: 50, y: 220, label: 'API Gateway', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', color: '#004B63' },
      { id: 'ia', x: 200, y: 80, label: 'IA Predictiva', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#66CCCC' },
      { id: 'dashboard', x: 200, y: 220, label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: '#4DA8C4' },
      { id: 'recommend', x: 350, y: 80, label: 'Recomendador', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z', color: '#66CCCC' },
      { id: 'ml', x: 350, y: 220, label: 'ML Engine', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', color: '#004B63' },
    ],
    edges: [
      { from: 'users', to: 'api' },
      { from: 'api', to: 'ia' },
      { from: 'api', to: 'dashboard' },
      { from: 'ia', to: 'recommend' },
      { from: 'ia', to: 'ml' },
      { from: 'dashboard', to: 'ml' },
    ],
  },
  avanzada: {
    nodes: [
      { id: 'users', x: 30, y: 60, label: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292', color: '#4DA8C4' },
      { id: 'erp', x: 30, y: 200, label: 'ERP', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4', color: '#004B63' },
      { id: 'agents', x: 180, y: 60, label: 'Multi-Agentes', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#66CCCC' },
      { id: 'analytics', x: 180, y: 200, label: 'Analítica Tiempo Real', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z', color: '#4DA8C4' },
      { id: 'ml', x: 330, y: 60, label: 'ML/Aprendizaje', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#66CCCC' },
      { id: 'e2e', x: 330, y: 200, label: 'E2E Automation', icon: 'M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3', color: '#004B63' },
    ],
    edges: [
      { from: 'users', to: 'agents' },
      { from: 'erp', to: 'agents' },
      { from: 'erp', to: 'analytics' },
      { from: 'agents', to: 'ml' },
      { from: 'agents', to: 'e2e' },
      { from: 'analytics', to: 'e2e' },
      { from: 'ml', to: 'analytics' },
    ],
  },
};

const ArchitectureSVG = ({ data, title, description }) => {
  const w = 450;
  const h = 290;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6">
      {title && <h4 className="text-sm font-bold text-[#004B63] mb-1">{title}</h4>}
      {description && <p className="text-xs text-slate-500 mb-4">{description}</p>}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-[450px] h-auto mx-auto" xmlns="http://www.w3.org/2000/svg">
        {data.edges.map((edge, i) => {
          const from = data.nodes.find(n => n.id === edge.from);
          const to = data.nodes.find(n => n.id === edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x + 35}
              y1={from.y + 20}
              x2={to.x}
              y2={to.y + 20}
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          );
        })}
        {data.nodes.map((node, i) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width="70"
              height="40"
              rx="10"
              fill={node.color}
              opacity="0.95"
              className="transition-opacity hover:opacity-100"
            />
            <text
              x={node.x + 35}
              y={node.y + 16}
              textAnchor="middle"
              fill="white"
              fontSize="7"
              fontWeight="600"
              fontFamily="Montserrat, sans-serif"
            >
              {node.label}
            </text>
            {/* Mini icon dot */}
            <circle cx={node.x + 35} cy={node.y + 28} r="4" fill="white" opacity="0.3" />
          </g>
        ))}
      </svg>
    </div>
  );
};

const AutomationArchitectureViewer = ({ architectures: archs, selectedArchitecture }) => {
  const data = archs?.find(a => a.id === selectedArchitecture?.id);
  const key = selectedArchitecture?.id || 'basica';
  const archData = architectures[key] || architectures.basica;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {Object.entries(architectures).map(([id, arch]) => {
        const isActive = id === key;
        const archInfo = archs?.find(a => a.id === id);
        return (
          <ArchitectureSVG
            key={id}
            data={arch}
            title={archInfo?.nombre || id}
            description={archInfo?.descripcion || ''}
          />
        );
      })}
    </div>
  );
};

export default AutomationArchitectureViewer;
