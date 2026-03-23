import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Calculator, Atom, Globe, BookOpen, Code, Music, Palette, Brain, TrendingUp, CheckCircle, PlayCircle, Lock, Zap
} from 'lucide-react';

const TiltCard = ({ children, isCompleted, isHovered, onMouseEnter, onMouseLeave, onClick }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
    
    // Rotate max 7.5 degrees based on mouse position
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = (e) => {
        x.set(0);
        y.set(0);
        onMouseLeave(e);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={`cursor-pointer w-full h-full relative`}
        >
            <motion.div 
                style={{ rotateX, rotateY }}
                className={`relative rounded-2xl overflow-hidden transition-colors duration-500 h-full border-beam-card ${
                    isCompleted
                      ? 'bg-gradient-to-br from-[#66CCCC]/10 to-[#4DA8C4]/5 shadow-[0_0_20px_rgba(102,204,204,0.2)]'
                      : 'hover:bg-[#0A1628]/60 bg-[#0A1628]/40 backdrop-blur-md'
                  } ${isHovered ? 'shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-10' : ''}`}
            >
                {/* 3D Pop container */}
                <div style={{ transform: isHovered ? "translateZ(30px)" : "translateZ(0px)", transition: "transform 0.3s ease" }} className="h-full flex flex-col">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
};

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
      mathematics: Calculator, physics: Atom, chemistry: Atom, biology: Brain,
      history: Globe, literature: BookOpen, programming: Code, music: Music,
      art: Palette, 'data-science': TrendingUp,
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
      <div className="mb-10 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black font-montserrat tracking-wide">
              Módulos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">Neuronales</span>
            </h3>
            <p className="text-sm text-gray-400 font-open-sans mt-1">
              Explora y domina sistemas complejos del conocimiento
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 font-open-sans bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              {filteredSubjects.length} de {subjects.length} activos
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            const colorConfig = getCategoryColor(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group px-5 py-3 rounded-xl border transition-all duration-300 btn-glow shadow-none ${
                  isActive
                    ? `${colorConfig.bg} ${colorConfig.border} ${colorConfig.text} font-bold`
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-open-sans tracking-wide">{category.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 group-hover:bg-white/20'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSubjects.map((subject) => {
          const Icon = getSubjectIcon(subject);
          const colorConfig = getCategoryColor(subject.category);
          const isHovered = hoveredSubject === subject.id;
          const isCompleted = subject.progress === 100;

          return (
            <TiltCard
                key={subject.id}
                isCompleted={isCompleted}
                isHovered={isHovered}
                onMouseEnter={() => setHoveredSubject(subject.id)}
                onMouseLeave={() => setHoveredSubject(null)}
                onClick={() => onSelectSubject(subject)}
            >
              {/* Subject Header */}
              <div className="p-6 flex-grow">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-md ${
                        isCompleted
                          ? 'bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4]'
                          : colorConfig.bg
                      }`}>
                        <Icon className={`w-7 h-7 ${isCompleted ? 'text-white' : colorConfig.text}`} />
                      </div>
                      
                      {subject.featured && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD166] to-[#FF6B9D] flex items-center justify-center shadow-[0_0_10px_rgba(255,107,157,0.5)] border border-white/20">
                          <span className="text-xs text-white">⭐</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className={`text-lg font-black font-montserrat tracking-tight text-white drop-shadow-md`}>
                        {subject.name}
                      </h4>
                      <p className="text-sm text-gray-400 font-open-sans">
                        {subject.teacher}
                      </p>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}>
                    {subject.level}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 font-open-sans mb-6 line-clamp-2 leading-relaxed">
                  {subject.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-300 font-montserrat uppercase tracking-wider">
                      Sincronización
                    </span>
                    <span className="text-sm font-black text-[#66CCCC] font-mono">
                      {subject.progress}%
                    </span>
                  </div>
                  
                  <div className="relative h-2 rounded-full bg-white/10 overflow-hidden shadow-inner flex items-center">
                    <div 
                      className={`absolute left-0 h-full rounded-full transition-all duration-1000 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] shadow-[0_0_10px_#66CCCC]'
                          : 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] shadow-[0_0_10px_#4DA8C4]'
                      }`}
                      style={{ width: `${subject.progress}%` }}
                    >
                      {isHovered && !isCompleted && (
                        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4 mt-auto">
                  <div className="text-center">
                    <div className="text-xl font-black text-white font-montserrat drop-shadow-md">
                      {subject.lessons}
                    </div>
                    <div className="text-[10px] text-gray-400 font-open-sans mt-1 uppercase tracking-widest">
                      Nodos
                    </div>
                  </div>
                  
                  <div className="text-center border-l border-white/10">
                    <div className="text-xl font-black text-white font-montserrat drop-shadow-md">
                      {subject.quizzes}
                    </div>
                    <div className="text-[10px] text-gray-400 font-open-sans mt-1 uppercase tracking-widest">
                      Pruebas
                    </div>
                  </div>
                  
                  <div className="text-center border-l border-white/10">
                    <div className="text-xl font-black text-[#FFD166] font-montserrat flex items-center justify-center gap-1 drop-shadow-md">
                      <Zap className="w-4 h-4" />
                      {subject.xp}
                    </div>
                    <div className="text-[10px] text-gray-400 font-open-sans mt-1 uppercase tracking-widest">
                      Energía
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className={`px-6 py-4 border-t relative overflow-hidden backdrop-blur-md ${
                isCompleted ? 'border-[#66CCCC]/30 bg-[#66CCCC]/5' : 'border-white/10 bg-white/5'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {subject.prerequisites > 0 && !isCompleted && (
                      <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
                        <Lock className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] text-gray-400 font-montserrat tracking-widest uppercase">
                          {subject.prerequisites} req.
                        </span>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#66CCCC]" />
                        <span className="text-xs text-[#66CCCC] font-montserrat font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(102,204,204,0.3)]">
                          Certificado
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSubject(subject);
                    }}
                    className={`group btn-glow relative overflow-hidden px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg ${
                      isCompleted
                        ? 'border border-[#66CCCC]/50 text-[#66CCCC]'
                        : subject.locked
                        ? 'border border-white/10 text-gray-500 cursor-not-allowed opacity-50'
                        : 'border hover:border-[#4DA8C4]/80 text-white'
                    }`}
                    disabled={subject.locked}
                  >
                    <div className="relative flex items-center gap-2">
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-bold font-montserrat">
                            Revisar
                          </span>
                        </>
                      ) : subject.locked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="text-sm font-bold font-montserrat">
                            Codificado
                          </span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 text-[#4DA8C4]" />
                          <span className="text-sm font-bold font-montserrat tracking-wide">
                            Inicializar
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <div className="hyper-glass p-12 rounded-3xl border border-white/10 text-center shadow-[0_0_30px_rgba(0,0,0,0.3)] mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#004B63]/20 to-transparent pointer-events-none" />
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10 backdrop-blur-md">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-xl font-black text-white font-montserrat mb-3 relative z-10 tracking-wide">
            Sin Módulos Activos
          </h4>
          <p className="text-sm text-gray-400 font-open-sans max-w-md mx-auto relative z-10">
            Los módulos de esta área cognitiva aún no están codificados. Modifica los filtros o expande tu base de datos central.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-8 px-6 py-3 rounded-full btn-glow text-sm font-bold text-white font-montserrat relative z-10"
          >
            Restaurar Conexión (Todas)
          </button>
        </div>
      )}
    </div>
  );
};

export default SubjectGrid;