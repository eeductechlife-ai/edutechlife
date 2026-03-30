import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Typography, 
  Button,
  Progress 
} from '../../../design-system/components';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const AnalyticsDashboard = ({ 
  timeRange = '7d', // 7d, 30d, 90d, 1y
  onTimeRangeChange 
}) => {
  const [metrics, setMetrics] = useState({
    totalDiagnoses: 0,
    completionRate: 0,
    avgTimeToComplete: 0,
    conversionRate: 0,
    voiceUsageRate: 0,
    topDominantStyle: null,
    dailyTrends: [],
    styleDistribution: [],
    demographicData: [],
    engagementMetrics: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Datos de ejemplo para el dashboard
  const mockData = useMemo(() => ({
    totalDiagnoses: 1247,
    completionRate: 78.5,
    avgTimeToComplete: 4.2, // minutos
    conversionRate: 32.4, // % que agenda consulta
    voiceUsageRate: 45.3,
    topDominantStyle: { name: 'APRENDIZ VISUAL', percentage: 42.3 },
    
    dailyTrends: Array.from({ length: 7 }, (_, i) => ({
      date: `Día ${i + 1}`,
      diagnoses: Math.floor(Math.random() * 50) + 30,
      completions: Math.floor(Math.random() * 40) + 25,
      conversions: Math.floor(Math.random() * 15) + 8
    })),
    
    styleDistribution: [
      { name: 'Visual', value: 42, color: '#4DA8C4' },
      { name: 'Auditivo', value: 28, color: '#66CCCC' },
      { name: 'Kinestésico', value: 30, color: '#FF6B9D' }
    ],
    
    demographicData: [
      { age: '8-11', count: 320, percentage: 25.7 },
      { age: '12-14', count: 450, percentage: 36.1 },
      { age: '15-16', count: 477, percentage: 38.2 }
    ],
    
    engagementMetrics: {
      avgQuestionsAnswered: 9.2,
      avgTimePerQuestion: 28, // segundos
      dropOffPoints: [
        { question: 1, dropOff: 5.2 },
        { question: 5, dropOff: 12.8 },
        { question: 10, dropOff: 21.5 }
      ],
      deviceBreakdown: [
        { device: 'Mobile', percentage: 68.4 },
        { device: 'Desktop', percentage: 28.9 },
        { device: 'Tablet', percentage: 2.7 }
      ]
    },
    
    revenueMetrics: {
      totalRevenue: 28450,
      avgRevenuePerUser: 22.8,
      conversionFunnel: [
        { stage: 'Diagnóstico', users: 1247, percentage: 100 },
        { stage: 'Lead Captured', users: 892, percentage: 71.5 },
        { stage: 'Consultation', users: 404, percentage: 32.4 },
        { stage: 'Conversion', users: 178, percentage: 14.3 }
      ]
    }
  }), []);

  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setMetrics(mockData);
      setLoading(false);
    };
    
    loadData();
  }, [timeRange, mockData]);

  const renderMetricCard = (title, value, unit = '', change = null, icon = null) => (
    <Card variant="glass" padding="md" className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <Typography variant="body2" color="sub" className="mb-1">
            {title}
          </Typography>
          <Typography variant="h3" className="mb-2">
            {loading ? '...' : value}{unit}
          </Typography>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              change > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-premium">
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard(
          'Diagnósticos Totales',
          metrics.totalDiagnoses.toLocaleString(),
          '',
          12.4,
          '📊'
        )}
        {renderMetricCard(
          'Tasa de Completación',
          metrics.completionRate.toFixed(1),
          '%',
          5.2,
          '✅'
        )}
        {renderMetricCard(
          'Tiempo Promedio',
          metrics.avgTimeToComplete.toFixed(1),
          ' min',
          -2.1,
          '⏱️'
        )}
        {renderMetricCard(
          'Tasa de Conversión',
          metrics.conversionRate.toFixed(1),
          '%',
          8.7,
          '💰'
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="md">
          <Typography variant="h5" className="mb-4">
            Tendencia Diaria
          </Typography>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                    border: '1px solid rgba(77, 168, 196, 0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="diagnoses" 
                  stroke="#4DA8C4" 
                  fill="url(#colorDiagnoses)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="completions" 
                  stroke="#66CCCC" 
                  fill="url(#colorCompletions)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorDiagnoses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4DA8C4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4DA8C4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66CCCC" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#66CCCC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="glass" padding="md">
          <Typography variant="h5" className="mb-4">
            Distribución de Estilos
          </Typography>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.styleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.styleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                    border: '1px solid rgba(77, 168, 196, 0.3)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="md">
          <Typography variant="h5" className="mb-4">
            Distribución por Edad
          </Typography>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.demographicData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="age" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                    border: '1px solid rgba(77, 168, 196, 0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#4DA8C4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="glass" padding="md">
          <Typography variant="h5" className="mb-4">
            Funnel de Conversión
          </Typography>
          <div className="space-y-4">
            {metrics.revenueMetrics?.conversionFunnel?.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="body2">{stage.stage}</Typography>
                  <Typography variant="body2" weight="medium">
                    {stage.users} ({stage.percentage}%)
                  </Typography>
                </div>
                <Progress 
                  value={stage.percentage} 
                  variant="gradient"
                  size="sm"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderEngagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderMetricCard(
          'Preguntas Promedio',
          metrics.engagementMetrics?.avgQuestionsAnswered?.toFixed(1),
          '/10',
          3.2,
          '❓'
        )}
        {renderMetricCard(
          'Tiempo por Pregunta',
          metrics.engagementMetrics?.avgTimePerQuestion,
          's',
          -1.8,
          '⏳'
        )}
        {renderMetricCard(
          'Uso de Voz',
          metrics.voiceUsageRate.toFixed(1),
          '%',
          15.7,
          '🔊'
        )}
      </div>

      <Card variant="glass" padding="md">
        <Typography variant="h5" className="mb-4">
          Puntos de Abandono
        </Typography>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.engagementMetrics?.dropOffPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="question" 
                stroke="#94A3B8"
                label={{ value: 'Número de Pregunta', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="#94A3B8"
                label={{ value: '% de Abandono', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 22, 40, 0.9)',
                  border: '1px solid rgba(77, 168, 196, 0.3)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="dropOff" 
                stroke="#FF6B9D" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card variant="glass" padding="md">
        <Typography variant="h5" className="mb-4">
          Dispositivos Utilizados
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.engagementMetrics?.deviceBreakdown?.map((device, index) => (
            <div key={device.device} className="text-center">
              <div className="text-3xl mb-2">
                {device.device === 'Mobile' && '📱'}
                {device.device === 'Desktop' && '💻'}
                {device.device === 'Tablet' && '📟'}
              </div>
              <Typography variant="h4">{device.percentage}%</Typography>
              <Typography variant="body2" color="sub">{device.device}</Typography>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderMetricCard(
          'Ingresos Totales',
          `$${metrics.revenueMetrics?.totalRevenue?.toLocaleString()}`,
          '',
          18.3,
          '💰'
        )}
        {renderMetricCard(
          'ARPU',
          `$${metrics.revenueMetrics?.avgRevenuePerUser?.toFixed(2)}`,
          '',
          5.6,
          '📈'
        )}
        {renderMetricCard(
          'CAC',
          '$8.42',
          '',
          -3.2,
          '🎯'
        )}
      </div>

      <Card variant="glass" padding="md">
        <Typography variant="h5" className="mb-4">
          ROI por Canal
        </Typography>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-glass">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-sub">Canal</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-sub">Inversión</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-sub">Ingresos</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-sub">ROI</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-sub">CAC</th>
              </tr>
            </thead>
            <tbody>
              {[
                { channel: 'Google Ads', investment: 2450, revenue: 8920, roi: 364, cac: 12.4 },
                { channel: 'Facebook', investment: 1820, revenue: 6540, roi: 359, cac: 9.8 },
                { channel: 'Instagram', investment: 1560, revenue: 5230, roi: 335, cac: 11.2 },
                { channel: 'Email', investment: 420, revenue: 2840, roi: 676, cac: 4.2 },
                { channel: 'Referidos', investment: 180, revenue: 2150, roi: 1194, cac: 3.1 }
              ].map((row, index) => (
                <tr key={index} className="border-b border-border-glass/30 hover:bg-bg-glass/30">
                  <td className="py-3 px-4">{row.channel}</td>
                  <td className="py-3 px-4">${row.investment.toLocaleString()}</td>
                  <td className="py-3 px-4">${row.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                      {row.roi}%
                    </span>
                  </td>
                  <td className="py-3 px-4">${row.cac}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderExportOptions = () => (
    <Card variant="glass" padding="md">
      <Typography variant="h5" className="mb-4">
        Exportar Datos
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          fullWidth
          onClick={() => console.log('Export CSV')}
        >
          📥 CSV
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={() => console.log('Export PDF')}
        >
          📄 PDF Report
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={() => console.log('Export JSON')}
        >
          📊 JSON
        </Button>
      </div>
      
      <div className="mt-6 pt-6 border-t border-border-glass">
        <Typography variant="h6" className="mb-3">
          Programar Reportes
        </Typography>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Typography variant="body2">Reporte Diario</Typography>
            <div className="w-8 h-4 bg-primary rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body2">Reporte Semanal</Typography>
            <div className="w-8 h-4 bg-border-glass rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute left-0" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body2">Alertas de KPIs</Typography>
            <div className="w-8 h-4 bg-primary rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark to-navy p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <Typography variant="h1" gradient className="mb-2">
              Analytics Dashboard
            </Typography>
            <Typography variant="body" color="sub">
              Métricas y insights del diagnóstico VAK
            </Typography>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange?.(e.target.value)}
              className="px-4 py-2 bg-bg-glass border border-border-glass rounded-premium text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
            
            <Button variant="primary">
              🔄 Actualizar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-border-glass">
          {['overview', 'engagement', 'revenue', 'export'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-sub hover:text-text-main'
              }`}
            >
              {tab === 'overview' && '📊 Resumen'}
              {tab === 'engagement' && '🎯 Engagement'}
              {tab === 'revenue' && '💰 Ingresos'}
              {tab === 'export' && '📤 Exportar'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <Typography variant="body" color="sub">
              Cargando métricas...
            </Typography>
          </div>
        </div>
      ) : (
        <>
          {/* Content */}
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'engagement' && renderEngagement()}
          {activeTab === 'revenue' && renderRevenue()}
          {activeTab === 'export' && renderExportOptions()}

          {/* Insights Section */}
          <Card variant="glass" padding="md" className="mt-6">
            <Typography variant="h5" className="mb-4">
              💡 Insights Recomendados
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-premium border border-primary/20">
                <Typography variant="body2" weight="medium" className="mb-2">
                  Optimizar Pregunta 5
                </Typography>
                <Typography variant="body2" color="sub" className="text-sm">
                  Mayor tasa de abandono (12.8%). Considerar reformular.
                </Typography>
              </div>
              <div className="p-4 bg-accent/5 rounded-premium border border-accent/20">
                <Typography variant="body2" weight="medium" className="mb-2">
                  Incrementar Uso de Voz
                </Typography>
                <Typography variant="body2" color="sub" className="text-sm">
                  Usuarios con voz activada tienen 23% mayor completación.
                </Typography>
              </div>
              <div className="p-4 bg-success/5 rounded-premium border border-success/20">
                <Typography variant="body2" weight="medium" className="mb-2">
                  Segmentar por Edad
                </Typography>
                <Typography variant="body2" color="sub" className="text-sm">
                  Grupo 15-16 años tiene 42% mayor tasa de conversión.
                </Typography>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;