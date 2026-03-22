import React, { useState } from 'react';
import { 
  Calculator, 
  Atom, 
  Globe, 
  BookOpen, 
  Code, 
  Music,
  Palette,
  Brain,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  Lock
} from 'lucide-react';

const SubjectGrid = ({ subjects = [], onSelectSubject }) => {
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todas', count: subjects.length },
    { id: 'stem', label: 'STEM', count: subjects.filter(s => s.category === 'stem').length },
    { id: 'humanities', label: 'Humanidades', count: subjects.filter(s => s.category === 'humanities').length },
    { id: 'arts', label: 'Artes', count: subjects.filter(s => s.category === 'arts').length },
    { id: 'tech', label: 'Tecnología', count: subjects.filter(s => s.category === 'tech').length },
  ];

  const getSubjectIcon = (subject) => {
    const icons = {
      mathematics: Calculator,
      physics: Atom,
      chemistry: Atom,
      biology: Brain,
      history: Globe,
      literature: BookOpen,
      programming: Code,
      music: Music,
      art: Palette,
      'data-science': TrendingUp,
    };
    return icons[subject.icon] || BookOpen;
  };

  const getCategoryColor = (category) => {
    const colors = {
      stem: { bg: 'bg-[#66CCCC]/20', text: 'text-[#66CCCC]', border: 'border-[#66CCCC]/30' },
      humanities: { bg: 'bg-[#FFD166]/20', text: 'text-[#FFD166]', border: 'border-[#FFD166]/30' },
      arts: { bg: 'bg-[#FF6B9D]/20', text: 'text-[#FF6B9D]', border: 'border-[#FF6B9D]/30' },
      tech: { bg: 'bg-[#9D4EDD]/20', text: 'text-[#9D4EDD]', border: 'border-[#9D4EDD]/30' },
    };
    return colors[category] || colors.stem;
  };

  const filteredSubjects = selectedCategory === 'all' 
    ? subjects 
    : subjects.filter(subject => subject.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Categories Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#004B63] font-montserrat tracking-tight">
              Materias Disponibles
            </h3>
            <p className="text-sm text-[#64748B] font-open-sans">
              Explora y domina diferentes áreas del conocimiento
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#64748B] font-open-sans">
              {filteredSubjects.length} de {subjects.length} materias
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            const colorConfig = getCategoryColor(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? `${colorConfig.bg} ${colorConfig.border} ${colorConfig.text} font-semibold`
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-open-sans">{category.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-[#E2E8F0]'
                  }`}>
                    {category.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => {
          const Icon = getSubjectIcon(subject);
          const colorConfig = getCategoryColor(subject.category);
          const isHovered = hoveredSubject === subject.id;
          const isCompleted = subject.progress === 100;

          return (
            <div
              key={subject.id}
              className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ${
                isCompleted
                  ? 'border-[#66CCCC] bg-gradient-to-br from-[#66CCCC]/10 to-[#4DA8C4]/5'
                  : 'border-[#E2E8F0] hover:border-[#4DA8C4]/30 bg-white'
              } ${isHovered ? 'transform -translate-y-1 shadow-xl' : ''}`}
              onMouseEnter={() => setHoveredSubject(subject.id)}
              onMouseLeave={() => setHoveredSubject(null)}
              onClick={() => onSelectSubject(subject)}
            >
              {/* Subject Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`relative ${isCompleted ? 'scale-110' : ''} transition-transform duration-300`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        isCompleted
                          ? 'bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4]'
                          : colorConfig.bg
                      }`}>
                        <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : colorConfig.text}`} />
                      </div>
                      
                      {subject.featured && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#FFD166] to-[#FF6B9D] flex items-center justify-center shadow-lg">
                          <span className="text-xs text-white">⭐</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className={`text-lg font-bold font-montserrat tracking-tight text-[#004B63]`}>
                        {subject.name}
                      </h4>
                      <p className="text-sm text-[#64748B] font-open-sans">
                        {subject.teacher}
                      </p>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}>
                    {subject.level}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#64748B] font-open-sans mb-6 line-clamp-2">
                  {subject.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#334155] font-open-sans">
                      Progreso
                    </span>
                    <span className="text-sm font-semibold text-[#66CCCC] font-open-sans">
                      {subject.progress}%
                    </span>
                  </div>
                  
                  <div className="relative h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4]'
                          : 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]'
                      }`}
                      style={{ width: `${subject.progress}%` }}
                    >
                      {isHovered && !isCompleted && (
                        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#004B63] font-montserrat">
                      {subject.lessons}
                    </div>
                    <div className="text-xs text-[#64748B] font-open-sans mt-1">
                      Lecciones
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#004B63] font-montserrat">
                      {subject.quizzes}
                    </div>
                    <div className="text-xs text-[#64748B] font-open-sans mt-1">
                      Quizzes
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#004B63] font-montserrat flex items-center justify-center gap-1">
                      <Zap className="w-4 h-4 text-[#FFD166]" />
                      {subject.xp}
                    </div>
                    <div className="text-xs text-[#64748B] font-open-sans mt-1">
                      XP Total
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className={`px-6 py-4 border-t ${
                isCompleted ? 'border-[#66CCCC]/30' : 'border-[#E2E8F0]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {subject.prerequisites > 0 && !isCompleted && (
                      <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#94A3B8]" />
                        <span className="text-xs text-[#94A3B8] font-open-sans">
                          {subject.prerequisites} req.
                        </span>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#66CCCC]" />
                        <span className="text-xs text-[#66CCCC] font-open-sans font-semibold">
                          Completada
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSubject(subject);
                    }}
                    className={`group relative overflow-hidden px-4 py-2 rounded-full transition-all duration-300 shadow-lg ${
                      isCompleted
                        ? 'bg-[#66CCCC]/20 border border-[#66CCCC]/30 text-[#66CCCC]'
                        : subject.locked
                        ? 'bg-[#F1F5F9] border border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:from-[#66CCCC] hover:to-[#4DA8C4] text-white'
                    }`}
                    disabled={subject.locked}
                  >
                    {!subject.locked && !isCompleted && (
                      <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    )}
                    
                    <div className="relative flex items-center gap-2">
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-semibold font-open-sans">
                            Ver Certificado
                          </span>
                        </>
                      ) : subject.locked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="text-sm font-semibold font-open-sans">
                            Bloqueada
                          </span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span className="text-sm font-semibold font-open-sans">
                            Continuar
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Completion Badge */}
              {isCompleted && (
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -inset-2 bg-[#66CCCC] rounded-full opacity-20 blur-sm"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-[#94A3B8]" />
          </div>
          <h4 className="text-lg font-bold text-[#334155] font-montserrat mb-2">
            No hay materias en esta categoría
          </h4>
          <p className="text-sm text-[#64748B] font-open-sans max-w-md mx-auto">
            Prueba seleccionando otra categoría o completa los prerrequisitos para desbloquear más materias.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-sm font-semibold text-white font-open-sans hover:shadow-lg transition-all duration-300 shadow-lg"
          >
            Ver Todas las Materias
          </button>
        </div>
      )}
    </div>
  );
};

export default SubjectGrid;