import { useState, useEffect, useRef, useCallback } from 'react';
import { callDeepseek } from '@/utils/api';

const INITIAL_STUDENT_DATA = {
  sessionStart: new Date(),
  interactions: 0,
  questionsAsked: 0,
  missionsCompleted: 0,
  timeSpent: 0,
  topicsExplored: [],
  moodHistory: [],
  learningStyle: null,
  lastActive: new Date()
};

const MISSION_TEMPLATES = [
  { id: 1, title: 'Completa tu Diagnóstico VAK', description: 'Descubre tu estilo de aprendizaje preferido', type: 'quiz', difficulty: 'easy', duration: 15, xpReward: 100, progress: 100, completed: true, locked: false, featured: true, collaborative: false, skills: ['Auto-conocimiento', 'Metacognición'], badgeReward: 'Explorador VAK', streakBonus: 10, prerequisites: [] },
  { id: 2, title: 'Sube tu primer documento', description: 'Analiza un documento con Valeria IA', type: 'project', difficulty: 'medium', duration: 30, xpReward: 150, progress: 60, completed: false, locked: false, featured: false, collaborative: true, skills: ['Análisis de texto', 'IA aplicada'], badgeReward: 'Analista Digital', streakBonus: 15, prerequisites: [] },
  { id: 3, title: 'Módulo de Prompt Engineering', description: 'Domina la comunicación con IA', type: 'challenge', difficulty: 'hard', duration: 45, xpReward: 200, progress: 0, completed: false, locked: true, featured: true, collaborative: false, skills: ['Prompt engineering', 'Comunicación IA'], badgeReward: 'Maestro de Prompts', streakBonus: 20, prerequisites: [], requiredLevel: 5 },
  { id: 4, title: 'Proyecto colaborativo de ciencias', description: 'Trabaja en equipo para resolver problemas', type: 'collaboration', difficulty: 'medium', duration: 60, xpReward: 180, progress: 30, completed: false, locked: false, featured: false, collaborative: true, skills: ['Trabajo en equipo', 'Método científico'], badgeReward: 'Científico Colaborativo', streakBonus: 25, prerequisites: [] },
  { id: 5, title: 'Creación de portfolio digital', description: 'Desarrolla tu portfolio digital', type: 'creative', difficulty: 'expert', duration: 90, xpReward: 300, progress: 0, completed: false, locked: true, featured: true, collaborative: false, skills: ['Diseño digital', 'Storytelling'], badgeReward: 'Creador Digital', streakBonus: 30, prerequisites: [], requiredLevel: 8 }
];

const SUBJECT_TEMPLATES = [
  { id: 'matematicas', name: 'Matemáticas Avanzadas', icon: 'mathematics', category: 'stem', level: 'Avanzado', teacher: 'Prof. Elena Rodríguez', description: 'Domina conceptos matemáticos complejos', progress: 75, lessons: 24, quizzes: 12, xp: 1200, prerequisites: 0, locked: false, featured: true },
  { id: 'fisica', name: 'Física Moderna', icon: 'physics', category: 'stem', level: 'Intermedio', teacher: 'Dr. Carlos Méndez', description: 'Explora los fundamentos de la física', progress: 60, lessons: 18, quizzes: 9, xp: 900, prerequisites: 1, locked: false, featured: true },
  { id: 'quimica', name: 'Química Avanzada', icon: 'chemistry', category: 'stem', level: 'Avanzado', teacher: 'Dra. María López', description: 'Química orgánica e inorgánica', progress: 45, lessons: 20, quizzes: 10, xp: 1000, prerequisites: 1, locked: false, featured: false },
  { id: 'literatura', name: 'Literatura Contemporánea', icon: 'literature', category: 'humanidades', level: 'Intermedio', teacher: 'Prof. Ana Torres', description: 'Análisis de obras contemporáneas', progress: 85, lessons: 16, quizzes: 8, xp: 800, prerequisites: 0, locked: false, featured: true },
  { id: 'historia', name: 'Historia Universal', icon: 'history', category: 'humanidades', level: 'Principiante', teacher: 'Prof. Roberto Díaz', description: 'Historia desde el origen hasta hoy', progress: 30, lessons: 22, quizzes: 11, xp: 1100, prerequisites: 0, locked: false, featured: false },
  { id: 'biologia', name: 'Biología Molecular', icon: 'biology', category: 'stem', level: 'Avanzado', teacher: 'Dr. Javier Ruiz', description: 'Estudio a nivel molecular', progress: 50, lessons: 20, quizzes: 10, xp: 1000, prerequisites: 2, locked: true, featured: false }
];

export default function useStudentProgress() {
  const [userXP, setUserXP] = useState(1250);
  const [userLevel, setUserLevel] = useState(3);
  const [streakDays, setStreakDays] = useState(7);
  const [missions, setMissions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentData, setStudentData] = useState(INITIAL_STUDENT_DATA);

  const sessionStartRef = useRef(new Date());

  useEffect(() => {
    const savedData = localStorage.getItem('edutechlife_student_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setStudentData(prev => ({ ...prev, ...parsed }));
      } catch {
        // ignore
      }
    }

    setMissions(MISSION_TEMPLATES);
    setSubjects(SUBJECT_TEMPLATES);

    const timer = setInterval(() => {
      setStudentData(prev => ({
        ...prev,
        timeSpent: Math.floor((new Date() - sessionStartRef.current) / 1000 / 60)
      }));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('edutechlife_student_data', JSON.stringify({
      ...studentData,
      lastActive: new Date()
    }));
  }, [studentData]);

  const trackInteraction = useCallback((type, data = {}) => {
    setStudentData(prev => ({
      ...prev,
      interactions: prev.interactions + 1,
      [type]: (prev[type] || 0) + 1,
      lastActive: new Date()
    }));
  }, []);

  const handleMissionStart = useCallback((mission) => {
    if (!mission.locked) {
      trackInteraction('missionsStarted');
    }
  }, [trackInteraction]);

  const handleMissionComplete = useCallback((mission) => {
    if (mission.completed) {
      trackInteraction('missionsCompleted');
      setUserXP(prev => prev + mission.xpReward);
      const newLevel = Math.floor((userXP + mission.xpReward) / 500) + 1;
      if (newLevel > userLevel) setUserLevel(newLevel);
    }
  }, [trackInteraction, userXP, userLevel]);

  const handleValeriaQuestion = useCallback((question) => {
    trackInteraction('questionsAsked');
    callDeepseek(
      `Estudiante pregunta: ${question}`,
      'Eres Valeria, tutora virtual de Edutechlife. Responde de forma cálida, empática y en español latino. Usa emojis ocasionales. Mantén las respuestas cortas (2-3 oraciones máximo).',
      false
    );
  }, [trackInteraction]);

  return {
    userXP, setUserXP,
    userLevel, setUserLevel,
    streakDays, setStreakDays,
    missions, setMissions,
    subjects, setSubjects,
    studentData, setStudentData,
    sessionStartRef,
    trackInteraction,
    handleMissionStart,
    handleMissionComplete,
    handleValeriaQuestion
  };
}
