import React, { useState } from 'react';
import { ChevronRight, Download, Share2, BookOpen, Target, TrendingUp, Users, Clock, Building, Globe } from 'lucide-react';

const CaseStudies = () => {
  const [selectedCase, setSelectedCase] = useState(0);
  const [filter, setFilter] = useState('all');
  const [bookmarkedCases, setBookmarkedCases] = useState([]);
  
  const caseStudies = [
    {
      id: 1,
      title: "Transformación Digital en Retail",
      company: "FashionForward Inc.",
      industry: "Retail & E-commerce",
      duration: "6 meses",
      teamSize: "12 personas",
      challenge: "Baja conversión en tienda online y falta de personalización",
      solution: "Implementación de sistema de recomendación con IA y chatbot 24/7",
      results: [
        "Aumento del 45% en conversiones",
        "Reducción del 60% en tickets de soporte",
        "ROI del 320% en 6 meses"
      ],
      technologies: ["TensorFlow", "React", "Node.js", "MongoDB"],
      lessons: [
        "La calidad de datos es crítica para modelos de recomendación",
        "La integración progresiva reduce resistencia al cambio",
        "El entrenamiento continuo del equipo es esencial"
      ],
      resources: [
        "Reporte completo (PDF)",
        "Dashboard de métricas",
        "Código de ejemplo",
        "Plantilla de implementación"
      ],
      color: "from-[#2D7A94] to-[#4DA8C4]",
      difficulty: "Intermedio",
      completed: true
    },
    {
      id: 2,
      title: "Automatización de Procesos Financieros",
      company: "GlobalBank Corp.",
      industry: "Banca & Finanzas",
      duration: "9 meses",
      teamSize: "8 personas",
      challenge: "Procesamiento manual de 5000+ facturas mensuales con errores del 15%",
      solution: "Sistema de OCR con IA y flujos de trabajo automatizados",
      results: [
        "Reducción del 90% en tiempo de procesamiento",
        "Error reducido al 0.5%",
        "Ahorro anual de $2.5M"
      ],
      technologies: ["OpenCV", "Python", "FastAPI", "PostgreSQL"],
      lessons: [
        "La validación humana sigue siendo necesaria en casos críticos",
        "La escalabilidad debe considerarse desde el diseño",
        "La documentación de procesos existentes es fundamental"
      ],
      resources: [
        "Caso de estudio detallado",
        "Arquitectura del sistema",
        "Métricas de performance",
        "Guía de implementación"
      ],
      color: "from-[#4DA8C4] to-[#66CCCC]",
      difficulty: "Avanzado",
      completed: true
    },
    {
      id: 3,
      title: "Optimización de Cadena de Suministro",
      company: "LogiTech Solutions",
      industry: "Logística",
      duration: "4 meses",
      teamSize: "6 personas",
      challenge: "Ineficiencias en rutas de entrega que aumentaban costos en 25%",
      solution: "Algoritmos de optimización con aprendizaje por refuerzo",
      results: [
        "Reducción del 18% en costos de combustible",
        "Mejora del 30% en tiempos de entrega",
        "Satisfacción del cliente aumentada al 95%"
      ],
      technologies: ["PyTorch", "Django", "Redis", "Docker"],
      lessons: [
        "Los datos en tiempo real son cruciales para la optimización",
        "La simulación previa a implementación reduce riesgos",
        "La colaboración interdepartamental acelera la adopción"
      ],
      resources: [
        "Análisis de datos completo",
        "Modelo predictivo",
        "Dashboard operativo",
        "Checklist de implementación"
      ],
      color: "from-[#66CCCC] to-[#B2D8E5]",
      difficulty: "Intermedio",
      completed: false
    },
    {
      id: 4,
      title: "Personalización de Contenido Educativo",
      company: "EduTech Academy",
      industry: "Educación",
      duration: "5 meses",
      teamSize: "10 personas",
      challenge: "Tasa de abandono del 40% en cursos online",
      solution: "Sistema de recomendación personalizado basado en estilo de aprendizaje",
      results: [
        "Reducción del abandono al 15%",
        "Aumento del 35% en completación de cursos",
        "Satisfacción estudiantil del 92%"
      ],
      technologies: ["Scikit-learn", "Vue.js", "Express", "MySQL"],
      lessons: [
        "Los modelos de aprendizaje deben adaptarse a diferentes estilos",
        "El feedback continuo mejora las recomendaciones",
        "La privacidad de datos es prioritaria en educación"
      ],
      resources: [
        "Estudio de impacto",
        "Algoritmo de recomendación",
        "Encuestas de satisfacción",
        "Guía pedagógica"
      ],
      color: "from-[#B2D8E5] to-[#2D7A94]",
      difficulty: "Principiante",
      completed: true
    }
  ];
  
  const industries = ['all', 'Retail & E-commerce', 'Banca & Finanzas', 'Logística', 'Educación'];
  const difficulties = ['all', 'Principiante', 'Intermedio', 'Avanzado'];
  
  const filteredCases = caseStudies.filter(caseStudy => {
    if (filter === 'all') return true;
    if (industries.includes(filter)) return caseStudy.industry === filter;
    if (difficulties.includes(filter)) return caseStudy.difficulty === filter;
    return true;
  });
  
  const toggleBookmark = (caseId) => {
    if (bookmarkedCases.includes(caseId)) {
      setBookmarkedCases(bookmarkedCases.filter(id => id !== caseId));
    } else {
      setBookmarkedCases([...bookmarkedCases, caseId]);
    }
  };
  
  const currentCase = filteredCases[selectedCase] || caseStudies[0];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2D7A94] font-montserrat mb-2">
            Casos de Estudio Reales
          </h1>
          <p className="text-gray-600 font-open-sans">
            Aprende de implementaciones reales de IA en diferentes industrias. Cada caso incluye desafíos, soluciones, resultados y lecciones aprendidas.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-open-sans">Filtrar por industria</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D7A94] focus:border-transparent font-open-sans"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'Todas las industrias' : industry}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-open-sans">Filtrar por dificultad</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D7A94] focus:border-transparent font-open-sans"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'Todas las dificultades' : difficulty}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-open-sans"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${currentCase.color}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Building className="w-5 h-5 text-[#2D7A94]" />
                      <span className="font-medium text-gray-700 font-open-sans">{currentCase.company}</span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full font-open-sans">
                        {currentCase.industry}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 font-montserrat">{currentCase.title}</h2>
                  </div>
                  
                  <button
                    onClick={() => toggleBookmark(currentCase.id)}
                    className={`p-2 rounded-full ${
                      bookmarkedCases.includes(currentCase.id)
                        ? 'bg-[#B2D8E5] text-[#2D7A94]'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <BookOpen className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 text-[#2D7A94]" />
                      <span className="text-sm text-gray-600 font-open-sans">Duración</span>
                    </div>
                    <p className="font-bold text-gray-800 font-open-sans">{currentCase.duration}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="w-4 h-4 text-[#2D7A94]" />
                      <span className="text-sm text-gray-600 font-open-sans">Equipo</span>
                    </div>
                    <p className="font-bold text-gray-800 font-open-sans">{currentCase.teamSize}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Target className="w-4 h-4 text-[#2D7A94]" />
                      <span className="text-sm text-gray-600 font-open-sans">Dificultad</span>
                    </div>
                    <p className="font-bold text-gray-800 font-open-sans">{currentCase.difficulty}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-[#2D7A94]" />
                      <span className="text-sm text-gray-600 font-open-sans">Estado</span>
                    </div>
                    <p className={`font-bold ${currentCase.completed ? 'text-green-600' : 'text-amber-600'} font-open-sans`}>
                      {currentCase.completed ? 'Completado' : 'En progreso'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 font-montserrat flex items-center">
                      <Target className="w-5 h-5 mr-2 text-[#2D7A94]" />
                      Desafío Principal
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg font-open-sans">
                      {currentCase.challenge}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 font-montserrat flex items-center">
                      <ChevronRight className="w-5 h-5 mr-2 text-[#2D7A94]" />
                      Solución Implementada
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg font-open-sans">
                      {currentCase.solution}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 font-montserrat">Resultados Clave</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentCase.results.map((result, index) => (
                        <div key={index} className="bg-gradient-to-br from-[#B2D8E5] to-white p-4 rounded-lg">
                          <p className="font-medium text-gray-800 font-open-sans">{result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 font-montserrat">Lecciones Aprendidas</h3>
                    <div className="space-y-2">
                      {currentCase.lessons.map((lesson, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-gray-700 font-open-sans">{lesson}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 font-montserrat">Tecnologías Utilizadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentCase.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium font-open-sans"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 font-montserrat">Recursos Disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentCase.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="font-medium text-gray-800 font-open-sans">{resource}</span>
                          <Download className="w-4 h-4 text-gray-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-open-sans">
                    <Share2 className="w-4 h-4" />
                    <span>Compartir caso</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white rounded-lg hover:from-[#4DA8C4] hover:to-[#66CCCC] transition-all font-open-sans">
                    <Download className="w-4 h-4" />
                    <span>Descargar kit completo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Todos los Casos</h3>
              <div className="space-y-4">
                {filteredCases.map((caseStudy, index) => (
                  <div
                    key={caseStudy.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedCase === index
                        ? 'bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCase(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Building className="w-4 h-4" />
                          <span className="font-medium font-open-sans">{caseStudy.company}</span>
                        </div>
                        <h4 className="font-bold font-montserrat">{caseStudy.title}</h4>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            caseStudy.completed
                              ? 'bg-green-100 text-green-600'
                              : 'bg-amber-100 text-amber-600'
                          } font-open-sans`}>
                            {caseStudy.completed ? 'Completado' : 'En progreso'}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full font-open-sans">
                            {caseStudy.difficulty}
                          </span>
                        </div>
                      </div>
                      {bookmarkedCases.includes(caseStudy.id) && (
                        <BookOpen className="w-4 h-4 text-[#2D7A94]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Estadísticas</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1 font-open-sans">
                    <span>Casos completados</span>
                    <span>{caseStudies.filter(c => c.completed).length} / {caseStudies.length}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full"
                      style={{ width: `${(caseStudies.filter(c => c.completed).length / caseStudies.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 font-open-sans">Industrias cubiertas</p>
                    <p className="text-2xl font-bold text-[#2D7A94] font-montserrat">4</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 font-open-sans">Lecciones clave</p>
                    <p className="text-2xl font-bold text-[#2D7A94] font-montserrat">16</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-2 font-montserrat">Próximos casos</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600 font-open-sans">
                      <Globe className="w-4 h-4 mr-2" />
                      IA en Salud - Hospital Regional
                    </li>
                    <li className="flex items-center text-sm text-gray-600 font-open-sans">
                      <Globe className="w-4 h-4 mr-2" />
                      Agricultura de Precisión - AgroTech
                    </li>
                    <li className="flex items-center text-sm text-gray-600 font-open-sans">
                      <Globe className="w-4 h-4 mr-2" />
                      Energía Renovable - SolarGrid
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Cómo Aprovechar al Máximo</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Lee el caso completo antes de revisar la solución
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Identifica cómo aplicar las lecciones a tu contexto
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Utiliza los recursos descargables como referencia
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Compara diferentes enfoques entre casos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-open-sans">
            <strong>Metodología VAK:</strong> Estos casos de estudio combinan elementos visuales (diagramas, datos), 
            auditivos (explicaciones detalladas) y kinestésicos (recursos prácticos descargables) para un aprendizaje integral.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;