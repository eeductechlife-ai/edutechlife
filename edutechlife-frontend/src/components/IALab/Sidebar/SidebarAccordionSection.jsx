import React, { useState } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { cn } from '../../forum/forumDesignSystem';
import { CompactTypography } from '../GlassDesignSystem';
import { 
  ChevronDown,
  Play,
  FileText,
  Code,
  Clipboard,
  ChartBar,
  Video,
  BookOpen,
  Download,
  ExternalLink,
  Clock,
  Award,
  Zap
} from 'lucide-react';

/**
 * SidebarAccordionSection - Acordeón premium reutilizable para secciones colapsables
 * 
 * @param {Object} props
 * @param {string} props.title - Título de la sección
 * @param {string} props.icon - Nombre del icono FontAwesome o componente React
 * @param {boolean} props.defaultOpen - Estado inicial abierto/cerrado
 * @param {Array} props.items - Lista de items a mostrar
 * @param {string} props.type - Tipo de contenido ('videos' | 'recursos' | 'custom')
 * @param {Function} props.onItemClick - Callback al hacer click en item
 * @param {string} props.className - Clases CSS adicionales
 */
const SidebarAccordionSection = ({
  title = "Sección",
  icon = "fa-folder",
  defaultOpen = false,
  items = [],
  type = 'custom',
  onItemClick,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Mapeo de iconos por tipo de contenido
  const getIconForType = (itemType, index) => {
    const iconMap = {
      videos: {
        icon: <Play className="w-3.5 h-3.5" />,
        color: "text-[#004B63]",
        bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10"
      },
      recursos: {
        pdf: { icon: <FileText className="w-3.5 h-3.5" />, color: "text-[#004B63]", bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10" },
        documento: { icon: <FileText className="w-3.5 h-3.5" />, color: "text-[#004B63]", bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10" },
        document: { icon: <FileText className="w-3.5 h-3.5" />, color: "text-[#004B63]", bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10" },
        json: { icon: <Code className="w-3.5 h-3.5" />, color: "text-[#004B63]", bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10" },
        templates: { icon: <Clipboard className="w-3.5 h-3.5" />, color: "text-[#004B63]", bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10" },
        caseStudies: { icon: <ChartBar className="w-3.5 h-3.5" />, color: "text-[#004B63]", bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10" },
        default: { icon: <BookOpen className="w-3.5 h-3.5" />, color: "text-[#004B63]", bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10" }
      },
      custom: {
        icon: <Zap className="w-3.5 h-3.5" />,
        color: "text-[#004B63]",
        bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10"
      }
    };

    if (type === 'videos') return iconMap.videos;
    if (type === 'recursos') {
      const resourceType = itemType?.toLowerCase() || 'default';
      return iconMap.recursos[resourceType] || iconMap.recursos.default;
    }
    return iconMap.custom;
  };

  // Mapeo de badges por nivel
  const getLevelBadge = (level) => {
    const levelConfig = {
      principiante: { color: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5", label: "Principiante" },
      intermedio: { color: "text-amber-600", bg: "bg-gradient-to-br from-amber-500/10 to-amber-600/5", label: "Intermedio" },
      avanzado: { color: "text-purple-600", bg: "bg-gradient-to-br from-purple-500/10 to-purple-600/5", label: "Avanzado" },
      experto: { color: "text-rose-600", bg: "bg-gradient-to-br from-rose-500/10 to-rose-600/5", label: "Experto" }
    };
    return levelConfig[level?.toLowerCase()] || { color: "text-slate-600", bg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10", label: level };
  };

  // Renderizar item individual
  const renderItem = (item, index) => {
    const iconConfig = getIconForType(item.type, index);
    const levelBadge = getLevelBadge(item.level);

    return (
      <button
        key={item.id || index}
        onClick={() => onItemClick?.(item)}
        className={cn(
          "w-full flex items-start gap-2.5",
          "p-2.5 rounded-lg",
          "bg-white",
          "border border-slate-200/60 border-l-4 border-l-[#004B63]",
          "shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50",
          "transition-all duration-300",
          "text-left",
          "group"
        )}
        aria-label={`${item.title} - ${item.duration || item.size || ''}`}
      >
        {/* Icono */}
        <div className={cn(
          "p-1.5 rounded-lg flex-shrink-0",
          iconConfig.bg,
          iconConfig.color
        )}>
          {iconConfig.icon}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={cn(
              CompactTypography.BODY,
              "text-slate-700 font-medium truncate",
              "group-hover:text-slate-800"
            )}>
              {item.title}
            </h4>
            
            {/* Acción rápida */}
            {item.action && (
              <div className={cn(
                "p-1 rounded",
                "text-slate-400",
                "group-hover:text-cyan-600",
                "transition-colors duration-150"
              )}>
                {item.action === 'download' && <Download className="w-3.5 h-3.5" />}
                {item.action === 'play' && <Play className="w-3.5 h-3.5" />}
                {item.action === 'open' && <ExternalLink className="w-3.5 h-3.5" />}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-1">
            {/* Badge de nivel/tipo */}
            {(item.level || item.type) && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs font-medium",
                levelBadge.bg,
                levelBadge.color
              )}>
                {levelBadge.label || item.type}
              </span>
            )}

            {/* Duración/tamaño */}
            {(item.duration || item.size) && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className={cn(
                  CompactTypography.MICRO,
                  "text-slate-500"
                )}>
                  {item.duration || item.size}
                </span>
              </div>
            )}

            {/* Badge de popularidad */}
            {item.popular && (
              <div className="flex items-center gap-0.5">
                <Award className="w-3 h-3 text-amber-500" />
                <span className={cn(
                  CompactTypography.MICRO,
                  "text-amber-600 font-medium"
                )}>
                  Popular
                </span>
              </div>
            )}
          </div>

          {/* Descripción (opcional) */}
          {item.description && (
            <p className={cn(
              CompactTypography.TINY,
              "text-slate-500 mt-1 line-clamp-2"
            )}>
              {item.description}
            </p>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header del acordeón */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between",
          "p-2.5 rounded-xl",
          "bg-white",
          "border border-slate-200/60 border-l-4 border-l-[#004B63]",
          "shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50",
          "transition-all duration-300",
          "group"
        )}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-2.5">
          {/* Icono de sección */}
          <div className={cn(
            "p-1.5 rounded-lg",
            "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10",
            "text-[#004B63]"
          )}>
            {typeof icon === 'string' ? (
              <Icon name={icon} className="w-3.5 h-3.5" />
            ) : (
              icon
            )}
          </div>

          {/* Título */}
          <h3 className={cn(
            CompactTypography.SUBHEADING,
            "text-slate-800 font-semibold",
            "group-hover:text-slate-900"
          )}>
            {title}
          </h3>

          {/* Contador de items */}
          <span className={cn(
            "px-1.5 py-0.5 rounded text-xs font-medium",
            "bg-slate-100 text-slate-600"
          )}>
            {items.length}
          </span>
        </div>

        {/* Chevron animado */}
        <ChevronDown className={cn(
          "w-4 h-4 text-slate-400",
          "transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {/* Contenido del acordeón */}
      <div
        id={`accordion-content-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={cn(
          "overflow-hidden",
          "transition-all duration-200",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1.5 pt-1">
          {items.length > 0 ? (
            items.map((item, index) => renderItem(item, index))
          ) : (
            <div className={cn(
              "p-3 rounded-lg",
              "bg-slate-50/50",
              "border border-slate-200/60",
              "text-center"
            )}>
              <p className={cn(
                CompactTypography.TINY,
                "text-slate-500"
              )}>
                No hay {title.toLowerCase()} disponibles
              </p>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        {items.length > 0 && (
          <div className={cn(
            "flex items-center justify-between",
            "pt-2 mt-2",
            "border-t border-slate-200/60"
          )}>
            <button className={cn(
              CompactTypography.TINY,
              "text-cyan-600 hover:text-cyan-700",
              "flex items-center gap-1",
              "transition-colors duration-150"
            )}>
              <Download className="w-3 h-3" />
              Descargar todos
            </button>

            <button className={cn(
              CompactTypography.TINY,
              "text-slate-600 hover:text-slate-800",
              "flex items-center gap-1",
              "transition-colors duration-150"
            )}>
              <ExternalLink className="w-3 h-3" />
              Ver más
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarAccordionSection;