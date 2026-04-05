import React, { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, Bookmark, Download, Share2, Maximize2, CheckCircle, Code, Terminal, Database, Cpu, FileCode, Settings, Zap, ChevronRight, ChevronLeft } from 'lucide-react';

const StepByStepTutorials = () => {
  const [selectedTutorial, setSelectedTutorial] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showCode, setShowCode] = useState(true);
  const [showResources, setShowResources] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('python');
  
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  
  const tutorials = [
    {
      id: 1,
      title: "Creando tu Primer Modelo de ML",
      description: "Desde cero hasta tu primera predicción",
      category: "Machine Learning",
      difficulty: "Principiante",
      duration: "28:45",
      totalSteps: 8,
      videoUrl: "/ialab-resources/tutorials/first-ml-model.mp4",
      steps: [
        {
          step: 1,
          title: "Configuración del Entorno",
          description: "Instalación de Python y bibliotecas esenciales",
          duration: "3:20",
          videoTimestamp: 0,
          code: `# Instalar bibliotecas esenciales
pip install numpy pandas scikit-learn matplotlib

# Verificar instalación
import numpy as np
import pandas as pd
print("¡Todo listo para comenzar!")`,
          resources: ["Guía de instalación", "Cheatsheet de Python", "Enlaces oficiales"]
        },
        {
          step: 2,
          title: "Carga y Exploración de Datos",
          description: "Importar dataset y realizar análisis exploratorio",
          duration: "4:15",
          videoTimestamp: 200,
          code: `import pandas as pd
import matplotlib.pyplot as plt

# Cargar dataset
df = pd.read_csv('datos.csv')

# Explorar datos
print(df.head())
print(df.info())
print(df.describe())

# Visualización básica
df.hist(figsize=(10, 8))
plt.show()`,
          resources: ["Dataset de ejemplo", "Guía de pandas", "Plantilla de análisis"]
        },
        {
          step: 3,
          title: "Preprocesamiento de Datos",
          description: "Limpieza y preparación para el modelo",
          duration: "5:30",
          videoTimestamp: 455,
          code: `from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Manejar valores nulos
df = df.dropna()

# Separar características y objetivo
X = df.drop('target', axis=1)
y = df['target']

# Escalar características
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Dividir en train/test
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)`,
          resources: ["Guía de preprocesamiento", "Cheatsheet de scikit-learn", "Ejemplos de limpieza"]
        },
        {
          step: 4,
          title: "Selección del Modelo",
          description: "Elegir el algoritmo adecuado para el problema",
          duration: "3:45",
          videoTimestamp: 785,
          code: `from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# Modelos a evaluar
models = {
    'Logistic Regression': LogisticRegression(),
    'Decision Tree': DecisionTreeClassifier(),
    'Random Forest': RandomForestClassifier()
}`,
          resources: ["Guía de selección de modelos", "Comparativa de algoritmos", "Decision tree"]
        },
        {
          step: 5,
          title: "Entrenamiento del Modelo",
          description: "Ajustar el modelo a los datos de entrenamiento",
          duration: "4:20",
          videoTimestamp: 980,
          code: `# Entrenar cada modelo
trained_models = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    trained_models[name] = model
    print(f"{name} entrenado exitosamente")`,
          resources: ["Guía de entrenamiento", "Métricas de evaluación", "Optimización de hiperparámetros"]
        },
        {
          step: 6,
          title: "Evaluación del Modelo",
          description: "Medir el rendimiento con métricas adecuadas",
          duration: "5:10",
          videoTimestamp: 1220,
          code: `from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Evaluar cada modelo
results = {}
for name, model in trained_models.items():
    y_pred = model.predict(X_test)
    
    results[name] = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred),
        'recall': recall_score(y_test, y_pred),
        'f1': f1_score(y_test, y_pred)
    }
    
    print(f"{name}: {results[name]}")`,
          resources: ["Guía de métricas", "Interpretación de resultados", "Visualización de métricas"]
        },
        {
          step: 7,
          title: "Optimización del Modelo",
          description: "Mejorar rendimiento con ajuste de hiperparámetros",
          duration: "6:15",
          videoTimestamp: 1530,
          code: `from sklearn.model_selection import GridSearchCV

# Definir parámetros para Random Forest
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, 30],
    'min_samples_split': [2, 5, 10]
}

# Búsqueda de mejores parámetros
grid_search = GridSearchCV(
    RandomForestClassifier(),
    param_grid,
    cv=5,
    scoring='accuracy'
)

grid_search.fit(X_train, y_train)

print("Mejores parámetros:", grid_search.best_params_)
print("Mejor score:", grid_search.best_score_)`,
          resources: ["Guía de GridSearch", "Optimización avanzada", "Técnicas de validación"]
        },
        {
          step: 8,
          title: "Despliegue y Uso",
          description: "Guardar modelo y hacer predicciones",
          duration: "2:50",
          videoTimestamp: 1965,
          code: `import joblib
import numpy as np

# Guardar el mejor modelo
best_model = grid_search.best_estimator_
joblib.dump(best_model, 'mejor_modelo.pkl')

# Cargar y usar el modelo
loaded_model = joblib.load('mejor_modelo.pkl')

# Hacer una predicción
nuevo_dato = np.array([[1.2, 3.4, 5.6, 7.8]])
prediccion = loaded_model.predict(nuevo_dato)
print(f"Predicción: {prediccion[0]}")`,
          resources: ["Guía de despliegue", "API Flask para modelos", "Monitorización en producción"]
        }
      ],
      prerequisites: ["Python básico", "Conceptos de datos", "Algebra lineal básica"],
      learningOutcomes: [
        "Crear pipeline completo de ML",
        "Evaluar modelos con métricas apropiadas",
        "Optimizar hiperparámetros",
        "Desplegar modelo para producción"
      ],
      color: "from-[#2D7A94] to-[#4DA8C4]"
    },
    {
      id: 2,
      title: "Desarrollo de API REST con FastAPI",
      description: "Backend moderno para aplicaciones de IA",
      category: "Backend Development",
      difficulty: "Intermedio",
      duration: "35:20",
      totalSteps: 6,
      videoUrl: "/ialab-resources/tutorials/fastapi-rest-api.mp4",
      steps: [
        {
          step: 1,
          title: "Configuración del Proyecto",
          description: "Estructura inicial y dependencias",
          duration: "4:10",
          videoTimestamp: 0,
          code: `# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\\Scripts\\activate

# Instalar FastAPI y dependencias
pip install fastapi uvicorn sqlalchemy pydantic

# Estructura del proyecto
# - app/
#   - main.py
#   - models.py
#   - schemas.py
#   - crud.py
#   - database.py
# requirements.txt`,
          resources: ["Guía de FastAPI", "Plantilla de proyecto", "Documentación oficial"]
        },
        {
          step: 2,
          title: "Modelos de Datos con SQLAlchemy",
          description: "Definir esquemas de base de datos",
          duration: "6:25",
          videoTimestamp: 250,
          code: `from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    input_data = Column(String, nullable=False)
    prediction = Column(String, nullable=False)
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Prediction(id={self.id}, prediction={self.prediction})>"`,
          resources: ["Guía de SQLAlchemy", "Esquemas de base de datos", "Modelos avanzados"]
        }
      ],
      prerequisites: ["Python intermedio", "Conceptos de APIs", "Bases de datos"],
      learningOutcomes: [
        "Crear API REST completa",
        "Integrar modelos de ML",
        "Manejar autenticación",
        "Documentación automática"
      ],
      color: "from-[#4DA8C4] to-[#66CCCC]"
    }
  ];
  
  const currentTutorial = tutorials[selectedTutorial];
  const currentStepData = currentTutorial?.steps[currentStep];
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleProgressClick = (e) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const markStepAsCompleted = (stepNumber) => {
    const stepId = `${selectedTutorial}-${stepNumber}`;
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };
  
  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    if (videoRef.current && currentTutorial.steps[stepIndex].videoTimestamp) {
      videoRef.current.currentTime = currentTutorial.steps[stepIndex].videoTimestamp;
    }
  };
  
  const nextStep = () => {
    if (currentStep < currentTutorial.steps.length - 1) {
      goToStep(currentStep + 1);
      markStepAsCompleted(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2D7A94] font-montserrat mb-2">
            Tutoriales Paso a Paso
          </h1>
          <p className="text-gray-600 font-open-sans">
            Aprende habilidades prácticas de IA con tutoriales detallados que te guían desde cero hasta proyectos completos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${currentTutorial?.color}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white font-open-sans">
                        {currentTutorial?.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 font-open-sans">
                        {currentTutorial?.difficulty}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 font-montserrat">{currentTutorial?.title}</h2>
                    <p className="text-gray-600 mt-1 font-open-sans">{currentTutorial?.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform"
                             onClick={handlePlayPause}>
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <p className="text-white font-open-sans">Paso {currentStep + 1}: {currentStepData?.title}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="relative h-2 bg-gray-200 rounded-full mb-2 cursor-pointer" ref={progressRef} onClick={handleProgressClick}>
                      <div 
                        className="absolute h-full bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full"
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 font-open-sans">
                      <span>{formatTime(currentTime)}</span>
                      <span>{currentStepData?.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-gray-700" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                      <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                        <SkipBack className="w-5 h-5 text-gray-700" />
                      </button>
                      <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                        <SkipForward className="w-5 h-5 text-gray-700" />
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-gray-600" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-20 accent-[#2D7A94]"
                        />
                      </div>
                      
                      <select
                        value={playbackRate}
                        onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-lg font-open-sans"
                      >
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1.0">1.0x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2.0">2.0x</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Maximize2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => { setShowCode(true); setShowResources(false); }}
                      className={`pb-3 px-1 font-medium transition-colors ${
                        showCode
                          ? 'text-[#2D7A94] border-b-2 border-[#2D7A94]'
                          : 'text-gray-500 hover:text-gray-700'
                      } font-open-sans`}
                    >
                      <Code className="w-4 h-4 inline mr-2" />
                      Código
                    </button>
                    <button
                      onClick={() => { setShowCode(false); setShowResources(true); }}
                      className={`pb-3 px-1 font-medium transition-colors ${
                        showResources
                          ? 'text-[#2D7A94] border-b-2 border-[#2D7A94]'
                          : 'text-gray-500 hover:text-gray-700'
                      } font-open-sans`}
                    >
                      <FileCode className="w-4 h-4 inline mr-2" />
                      Recursos
                    </button>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 font-montserrat">
                    Paso {currentStep + 1}: {currentStepData?.title}
                  </h3>
                  <p className="text-gray-700 mb-4 font-open-sans">{currentStepData?.description}</p>
                  
                  {showCode && currentStepData?.code && (
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                        <div className="flex items-center space-x-2">
                          <Terminal className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 font-mono text-sm">{codeLanguage}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(currentStepData.code)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-open-sans"
                        >
                          Copiar código
                        </button>
                      </div>
                      <pre className="p-4 text-gray-100 overflow-x-auto font-jetbrains-mono text-sm">
                        {currentStepData.code}
                      </pre>
                    </div>
                  )}
                  
                  {showResources && currentStepData?.resources && (
                    <div className="space-y-3">
                      {currentStepData.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-[#B2D8E5] flex items-center justify-center">
                              <FileCode className="w-4 h-4 text-[#2D7A94]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 font-open-sans">{resource}</p>
                              <p className="text-sm text-gray-600 font-open-sans">PDF • Gratuito</p>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-gray-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } font-open-sans`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Paso anterior</span>
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => markStepAsCompleted(currentStep)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        completedSteps.includes(`${selectedTutorial}-${currentStep}`)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      } font-open-sans`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {completedSteps.includes(`${selectedTutorial}-${currentStep}`)
                          ? 'Completado'
                          : 'Marcar como completado'}
                      </span>
                    </button>
                    
                    <button
                      onClick={nextStep}
                      disabled={currentStep === currentTutorial?.steps.length - 1}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                        currentStep === currentTutorial?.steps.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white hover:from-[#4DA8C4] hover:to-[#66CCCC]'
                      } font-open-sans`}
                    >
                      <span>Siguiente paso</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Resultados de Aprendizaje</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTutorial?.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-gray-700 font-open-sans">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Todos los Tutoriales</h3>
              <div className="space-y-4">
                {tutorials.map((tutorial, index) => (
                  <div
                    key={tutorial.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedTutorial === index
                        ? 'bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedTutorial(index);
                      setCurrentStep(0);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Code className="w-4 h-4" />
                          <span className="font-medium font-open-sans">{tutorial.category}</span>
                        </div>
                        <h4 className="font-bold font-montserrat">{tutorial.title}</h4>
                        <p className={`text-sm mt-1 ${selectedTutorial === index ? 'text-gray-200' : 'text-gray-600'} font-open-sans`}>
                          {tutorial.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="flex items-center space-x-1 text-sm font-open-sans">
                            <Clock className="w-3 h-3" />
                            <span>{tutorial.duration}</span>
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full font-open-sans">
                            {tutorial.difficulty}
                          </span>
                          <span className="text-sm font-open-sans">{tutorial.totalSteps} pasos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Pasos del Tutorial</h3>
              <div className="space-y-2">
                {currentTutorial?.steps.map((step, index) => (
                  <div
                    key={step.step}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === index
                        ? 'bg-[#B2D8E5] border-l-4 border-[#2D7A94]'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => goToStep(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          completedSteps.includes(`${selectedTutorial}-${index}`)
                            ? 'bg-green-100 text-green-600'
                            : currentStep === index
                            ? 'bg-[#2D7A94] text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {completedSteps.includes(`${selectedTutorial}-${index}`) ? '✓' : step.step}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 font-open-sans">{step.title}</p>
                          <p className="text-sm text-gray-600 font-open-sans">{step.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-open-sans">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Tu Progreso</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1 font-open-sans">
                    <span>Pasos completados</span>
                    <span>
                      {completedSteps.filter(id => id.startsWith(`${selectedTutorial}-`)).length} / {currentTutorial?.steps.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full"
                      style={{ 
                        width: `${(completedSteps.filter(id => id.startsWith(`${selectedTutorial}-`)).length / currentTutorial?.steps.length) * 100 || 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-700 mb-2 font-montserrat">Prerrequisitos</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentTutorial?.prerequisites.map((prereq, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium font-open-sans"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-open-sans">
                      <Download className="w-4 h-4" />
                      <span>Descargar código</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-open-sans">
                      <Settings className="w-4 h-4" />
                      <span>Proyecto final</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Consejos Prácticos</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Ejecuta cada paso de código para ver los resultados en tiempo real
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Modifica el código para experimentar y entender mejor los conceptos
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Toma notas sobre errores y soluciones para referencia futura
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Completa los ejercicios adicionales para reforzar el aprendizaje
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-open-sans">
            <strong>Metodología VAK:</strong> Estos tutoriales combinan aprendizaje visual (video), auditivo (explicaciones) 
            y kinestésico (codificación práctica) para desarrollar habilidades reales mediante la práctica directa.
          </p>
        </div>
      </div>
      
      <video
        ref={videoRef}
        src={currentTutorial?.videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        className="hidden"
      />
    </div>
  );
};

export default StepByStepTutorials;