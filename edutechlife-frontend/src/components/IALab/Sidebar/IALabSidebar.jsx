import React from 'react';
import { cn } from '../../forum/forumDesignSystem';
import { GlassPanel } from '../GlassDesignSystem';
import SidebarProgressCircle from './SidebarProgressCircle';
import SidebarModuleList from './SidebarModuleList';
import SidebarAccordionSection from './SidebarAccordionSection';
import SidebarCourseDetails from './SidebarCourseDetails';
import SidebarUserSection from './SidebarUserSection';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * IALabSidebar - Componente presentacional premium del sidebar
 * Integra todos los componentes base con diseño glassmorphism evolutivo
 * 
 * @param {Object} props
 * @param {Object} props.data - Datos para renderizar componentes
 * @param {Object} props.handlers - Handlers para interacciones
 */
const IALabSidebar = ({ data, handlers }) => {
  const {
    progress,
    completedModules,
    totalModules,
    modules,
    activeMod,
    sections,
    course,
    user,
    isMobile,
    isCollapsed
  } = data;

  const {
    onModuleSelect,
    onSectionToggle,
    onSectionItemClick,
    onUserSettings,
    onSignOut,
    onToggleSidebar,
    isModuleLocked
  } = handlers;

  // Si está colapsado en mobile, mostrar solo botón de toggle
  if (isMobile && isCollapsed) {
    return (
      <button
        onClick={onToggleSidebar}
        className={cn(
          "fixed top-4 left-4 z-50",
          "p-2.5 rounded-xl",
          "bg-white/85 backdrop-blur-md",
          "border border-cyan-100/50",
          "shadow-[0_8px_30px_rgba(0,188,212,0.12)]",
          "text-cyan-600",
          "hover:bg-white/90",
          "transition-all duration-200"
        )}
        aria-label="Abrir sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
    );
  }

  return (
    <aside className={cn(
      GlassPanel.ELEVATED,
      "w-64 flex-shrink-0",
      "h-screen overflow-y-auto",
      "border-r border-cyan-100/50",
      "transition-all duration-300",
      isMobile && [
        "fixed top-0 left-0 z-40",
        "shadow-[0_0_50px_rgba(0,75,99,0.15)]",
        "backdrop-blur-xl"
      ],
      isCollapsed && "transform -translate-x-full"
    )}>
      {/* Header del sidebar (solo en mobile) */}
      {isMobile && (
        <div className={cn(
          "flex items-center justify-between",
          "px-4 py-3",
          "border-b border-cyan-100/50",
          "bg-white/90 backdrop-blur-md"
        )}>
          <h2 className={cn(
            "text-sm font-bold text-slate-800"
          )}>
            Navegación
          </h2>
          <button
            onClick={onToggleSidebar}
            className={cn(
              "p-1.5 rounded-lg",
              "text-slate-600 hover:text-slate-800",
              "hover:bg-white/60",
              "transition-all duration-150"
            )}
            aria-label="Cerrar sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contenido principal */}
      <div className="p-4 space-y-4">
        {/* Botón de colapsar (desktop) */}
        {!isMobile && (
          <button
            onClick={onToggleSidebar}
            className={cn(
              "w-full flex items-center justify-center gap-1.5",
              "p-2 rounded-lg mb-2",
              "bg-white/60 backdrop-blur-sm",
              "border border-white/30",
              "text-slate-600 text-sm font-medium",
              "hover:bg-white/80",
              "transition-all duration-150"
            )}
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Expandir</span>
              </>
            ) : (
              <>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Colapsar</span>
              </>
            )}
          </button>
        )}

        {/* Progress Circle */}
        <SidebarProgressCircle
          progress={progress}
          completedModules={completedModules.length}
          totalModules={totalModules}
        />

        {/* Module List */}
        <div className={cn(
          "p-3 rounded-xl",
          "bg-white/60 backdrop-blur-sm",
          "border border-white/30"
        )}>
          <SidebarModuleList
            modules={modules}
            activeMod={activeMod}
            completedModules={completedModules}
            onModuleSelect={onModuleSelect}
            isModuleLocked={isModuleLocked}
          />
        </div>

        {/* Videos Section */}
        <SidebarAccordionSection
          title={sections.videos.title}
          icon={sections.videos.icon}
          defaultOpen={sections.videos.isOpen}
          items={sections.videos.items}
          type="videos"
          onItemClick={onSectionItemClick}
          className="cursor-pointer"
          onClick={() => onSectionToggle('videos')}
        />

        {/* Recursos Section */}
        <SidebarAccordionSection
          title={sections.recursos.title}
          icon={sections.recursos.icon}
          defaultOpen={sections.recursos.isOpen}
          items={sections.recursos.items}
          type="recursos"
          onItemClick={onSectionItemClick}
          className="cursor-pointer"
          onClick={() => onSectionToggle('recursos')}
        />

        {/* Course Details */}
        <div className={cn(
          "p-3 rounded-xl",
          "bg-white/60 backdrop-blur-sm",
          "border border-white/30"
        )}>
          <SidebarCourseDetails
            course={course}
          />
        </div>

        {/* User Section */}
        <div className={cn(
          "p-3 rounded-xl",
          "bg-white/60 backdrop-blur-sm",
          "border border-white/30"
        )}>
          <SidebarUserSection
            user={user}
            onSettings={onUserSettings}
            onSignOut={onSignOut}
          />
        </div>

        {/* Footer del sidebar */}
        <div className={cn(
          "pt-4 mt-4",
          "border-t border-cyan-100/50"
        )}>
          <p className={cn(
            "text-xs text-center text-slate-500"
          )}>
            Edutechlife © 2024
          </p>
          <p className={cn(
            "text-[10px] text-center text-slate-400 mt-1"
          )}>
            v2.1.0 • Dashboard Premium
          </p>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onToggleSidebar}
          aria-hidden="true"
        />
      )}
    </aside>
  );
};

export default IALabSidebar;