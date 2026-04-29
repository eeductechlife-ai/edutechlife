import React from 'react';
import { cn } from '../../forum/forumDesignSystem';
import { CompactTypography } from '../GlassDesignSystem';
import { 
  Clock, 
  TrendingUp, 
  Video, 
  Briefcase,
  Users,
  Award,
  BarChart3,
  Target,
  Zap,
  Star
} from 'lucide-react';

/**
 * SidebarCourseDetails - Grid compacto de detalles del curso
 * Componente presentacional para mostrar métricas clave del curso
 * 
 * @param {Object} props
 * @param {Object} props.course - Datos del curso actual
 * @param {string} props.className - Clases CSS adicionales
 */
const SidebarCourseDetails = ({ 
  course = {},
  className = ''
}) => {
  // Datos por defecto
  const courseData = {
    duration: course.duration || "2h 30min",
    level: course.level || "Intermedio",
    videos: course.videos || "12 videos",
    projects: course.projects || "3 proyectos",
    students: course.students || "1,234",
    rating: course.rating || "4.8",
    completionRate: course.completionRate || "87%",
    ...course
  };

  // Items de detalles del curso
  const detailItems = [
    {
      id: 'duration',
      label: 'Duración',
      value: courseData.duration,
      icon: <Clock className="w-3.5 h-3.5" />,
      color: 'text-cyan-600',
      bg: 'bg-cyan-500/10',
      description: 'Tiempo total estimado'
    },
    {
      id: 'level',
      label: 'Nivel',
      value: courseData.level,
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      description: 'Dificultad del curso'
    },
    {
      id: 'videos',
      label: 'Videos',
      value: courseData.videos,
      icon: <Video className="w-3.5 h-3.5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
      description: 'Contenido en video'
    },
    {
      id: 'projects',
      label: 'Proyectos',
      value: courseData.projects,
      icon: <Briefcase className="w-3.5 h-3.5" />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      description: 'Proyectos prácticos'
    },
    {
      id: 'students',
      label: 'Estudiantes',
      value: courseData.students,
      icon: <Users className="w-3.5 h-3.5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      description: 'Total inscritos'
    },
    {
      id: 'rating',
      label: 'Rating',
      value: courseData.rating,
      icon: <Star className="w-3.5 h-3.5" />,
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      description: 'Puntuación promedio'
    }
  ];

  // Renderizar item de detalle
  const renderDetailItem = (item) => (
    <div
      key={item.id}
      className={cn(
        "flex items-center justify-between",
        "p-2.5 rounded-lg",
        "bg-slate-50",
        "border border-slate-100",
        "hover:bg-slate-100",
        "transition-all duration-150",
        "group"
      )}
      title={item.description}
    >
      <div className="flex items-center gap-2.5">
        {/* Icono */}
        <div className={cn(
          "p-1.5 rounded-md",
          item.bg,
          item.color
        )}>
          {item.icon}
        </div>

        {/* Label */}
        <div>
          <div className={cn(
            CompactTypography.TINY,
            "text-slate-600 font-medium"
          )}>
            {item.label}
          </div>
          <div className={cn(
            CompactTypography.MICRO,
            "text-slate-500 mt-0.5"
          )}>
            {item.description}
          </div>
        </div>
      </div>

      {/* Valor */}
      <div className={cn(
        CompactTypography.SUBHEADING,
        "text-slate-800 font-bold",
        "group-hover:text-slate-900"
      )}>
        {item.value}
      </div>
    </div>
  );

  // Métricas adicionales
  const metrics = [
    {
      id: 'completion',
      label: 'Tasa de completación',
      value: courseData.completionRate,
      trend: 'up',
      change: '+5%',
      icon: <Target className="w-3 h-3" />
    },
    {
      id: 'engagement',
      label: 'Engagement',
      value: '92%',
      trend: 'up',
      change: '+3%',
      icon: <Zap className="w-3 h-3" />
    },
    {
      id: 'satisfaction',
      label: 'Satisfacción',
      value: '4.9/5',
      trend: 'stable',
      change: '0%',
      icon: <Award className="w-3 h-3" />
    }
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header de sección */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-1.5 rounded-md",
          "bg-cyan-500/10",
          "text-cyan-600"
        )}>
          <BarChart3 className="w-4 h-4" />
        </div>
        <h3 className={cn(
          CompactTypography.SUBHEADING,
          "text-slate-800 font-semibold"
        )}>
          Detalles del Curso
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-transparent" />
      </div>

      {/* Grid de detalles */}
      <div className="grid grid-cols-1 gap-1.5">
        {detailItems.map(item => renderDetailItem(item))}
      </div>

      {/* Métricas adicionales */}
      <div className={cn(
        "p-3 rounded-xl",
        "bg-gradient-to-br from-cyan-50 to-white",
        "border border-cyan-100"
      )}>
        <h4 className={cn(
          CompactTypography.SUBHEADING,
          "text-slate-800 font-semibold mb-2",
          "flex items-center gap-1.5"
        )}>
          <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
          Métricas Clave
        </h4>

        <div className="space-y-2">
          {metrics.map(metric => (
            <div key={metric.id} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "p-1 rounded",
                  metric.trend === 'up' ? "bg-emerald-500/10 text-emerald-600" :
                  metric.trend === 'down' ? "bg-rose-500/10 text-rose-600" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {metric.icon}
                </div>
                <span className={cn(
                  CompactTypography.TINY,
                  "text-slate-600"
                )}>
                  {metric.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={cn(
                  CompactTypography.SUBHEADING,
                  "text-slate-800 font-bold"
                )}>
                  {metric.value}
                </span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-xs font-medium",
                  metric.trend === 'up' ? "bg-emerald-500/10 text-emerald-600" :
                  metric.trend === 'down' ? "bg-rose-500/10 text-rose-600" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer con insights */}
        <div className={cn(
          "mt-3 pt-2",
          "border-t border-cyan-100"
        )}>
          <p className={cn(
            CompactTypography.MICRO,
            "text-slate-500 italic"
          )}>
            Basado en datos de {courseData.students} estudiantes
          </p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 gap-2">
        <button className={cn(
          "flex items-center justify-center gap-1.5",
          "p-2 rounded-lg",
          "bg-slate-50",
          "border border-slate-100",
          "text-slate-700 text-sm font-medium",
          "hover:bg-slate-100",
          "transition-all duration-150"
        )}>
          <Download className="w-3.5 h-3.5" />
          Programa
        </button>

        <button className={cn(
          "flex items-center justify-center gap-1.5",
          "p-2 rounded-lg",
          "bg-gradient-to-r from-cyan-600/10 to-cyan-500/10",
          "border border-cyan-500/20",
          "text-cyan-600 text-sm font-medium",
          "hover:from-cyan-600/15 hover:to-cyan-500/15",
          "transition-all duration-150"
        )}>
          <Share2 className="w-3.5 h-3.5" />
          Compartir
        </button>
      </div>
    </div>
  );
};

// Importar iconos adicionales
import { Download, Share2 } from 'lucide-react';

export default SidebarCourseDetails;