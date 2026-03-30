import React, { useState } from 'react';

const VAKDiagnosisSimple = () => {
  const [step, setStep] = useState(0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Diagnóstico VAK Premium
        </h1>
        <p className="text-gray-600 mb-6">
          Descubre tu estilo de aprendizaje preferido
        </p>
        
        {step === 0 && (
          <div>
            <p className="mb-4">Paso 1: Información básica</p>
            <button 
              onClick={() => setStep(1)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Comenzar
            </button>
          </div>
        )}
        
        {step === 1 && (
          <div>
            <p className="mb-4">Paso 2: Preguntas</p>
            <button 
              onClick={() => setStep(2)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Siguiente
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <p className="mb-4">Paso 3: Resultados</p>
            <button 
              onClick={() => setStep(0)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Reiniciar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VAKDiagnosisSimple;