import React, { createContext, useState, useContext, useEffect } from 'react';

const StudentContext = createContext();

const StudentProvider = ({ children }) => {
  const [studentInfo, setStudentInfo] = useState(() => {
    // Cargar información del estudiante desde localStorage al iniciar
    const saved = localStorage.getItem('edutechlife_student_info');
    return saved ? JSON.parse(saved) : {
      name: '',
      age: '',
      email: '',
      phone: '',
      mood: 'neutral',
      diagnosis: null,
      lastActivity: null,
      conversationHistory: []
    };
  });

  const [valentinaEnabled, setValentinaEnabled] = useState(() => {
    const saved = localStorage.getItem('edutechlife_valentina_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('edutechlife_voice_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  // Persistir cambios en localStorage
  useEffect(() => {
    localStorage.setItem('edutechlife_student_info', JSON.stringify(studentInfo));
  }, [studentInfo]);

  useEffect(() => {
    localStorage.setItem('edutechlife_valentina_enabled', JSON.stringify(valentinaEnabled));
  }, [valentinaEnabled]);

  useEffect(() => {
    localStorage.setItem('edutechlife_voice_enabled', JSON.stringify(voiceEnabled));
  }, [voiceEnabled]);

  const updateStudentInfo = (info) => {
    setStudentInfo(prev => ({
      ...prev,
      ...info,
      lastActivity: new Date().toISOString()
    }));
  };

  const clearStudentInfo = () => {
    setStudentInfo({
      name: '',
      age: '',
      email: '',
      phone: '',
      mood: 'neutral',
      diagnosis: null,
      lastActivity: null,
      conversationHistory: []
    });
  };

  const toggleValentina = () => {
    setValentinaEnabled(prev => !prev);
  };

  const addToConversationHistory = (message, sender) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      sender,
      read: false
    };
    
    setStudentInfo(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, newEntry].slice(-50) // Mantener solo las últimas 50
    }));
  };

  const clearConversationHistory = () => {
    setStudentInfo(prev => ({
      ...prev,
      conversationHistory: []
    }));
  };

  const markConversationAsRead = (messageId) => {
    setStudentInfo(prev => ({
      ...prev,
      conversationHistory: prev.conversationHistory.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    }));
  };

  const value = {
    studentInfo,
    updateStudentInfo,
    clearStudentInfo,
    valentinaEnabled,
    toggleValentina,
    setValentinaEnabled,
    voiceEnabled,
    setVoiceEnabled,
    addToConversationHistory,
    clearConversationHistory,
    markConversationAsRead
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

// Hook personalizado para usar el contexto
const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export { StudentContext, StudentProvider, useStudent };