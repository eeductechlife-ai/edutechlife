import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'edutechlife_valeria_memory';

const DEFAULT_MEMORY = {
  userName: null,
  userProfile: {
    learningStyle: null,
    interests: [],
    mood: 'happy',
    level: 1,
    xp: 0,
  },
  conversationHistory: [],
  factsAboutUser: [],
  lastConversation: null,
  conversationCount: 0,
  preferences: {
    voiceEnabled: true,
    captionsEnabled: true,
    conversationMode: false,
  },
  goals: [],
  challenges: [],
};

export function useConversationMemory(options = {}) {
  const { 
    persistKey = STORAGE_KEY,
    maxHistoryLength = 50,
    maxFactsLength = 100,
  } = options;

  const [memory, setMemory] = useState(() => {
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_MEMORY, ...parsed };
      }
    } catch (e) {
      console.error('Error loading memory:', e);
    }
    return { ...DEFAULT_MEMORY };
  });

  const [currentContext, setCurrentContext] = useState('');
  const memoryRef = useRef(memory);

  useEffect(() => {
    memoryRef.current = memory;
  }, [memory]);

  useEffect(() => {
    try {
      localStorage.setItem(persistKey, JSON.stringify(memory));
    } catch (e) {
      console.error('Error saving memory:', e);
    }
  }, [memory, persistKey]);

  const extractName = useCallback((text) => {
    const namePatterns = [
      /me llamo\s+([A-Za-zÁ-ú]+)/i,
      /soy\s+([A-Za-zÁ-ú]+)/i,
      /mi nombre es\s+([A-Za-zÁ-ú]+)/i,
      /(?:llámame|dime|digame|digeme)\s+([A-Za-zÁ-ú]+)/i,
      /yo soy\s+([A-Za-zÁ-ú]+)/i,
      /^([A-Za-zÁ-ú]+)\s+(?:es mi nombre|es mi)/i,
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }, []);

  const extractFacts = useCallback((text) => {
    const facts = [];
    const lowerText = text.toLowerCase();

    const factPatterns = [
      { pattern: /(?:me gusta|gusta|nose|amo|apasionad[oa])\s+(.+?)(?:\.|,|$)/gi, type: 'likes' },
      { pattern: /(?:estoy|toy)\s+(?:estudiando|trabajando|en)\s+(.+?)(?:\.|,|$)/gi, type: 'studying' },
      { pattern: /(?:tengo|siento)\s+(.+?años)/gi, type: 'age' },
      { pattern: /(?:voy|vamos)\s+(?:a|bien|mal|en)\s+(.+?)(?:\.|,|$)/gi, type: 'plans' },
    ];

    for (const { pattern, type } of factPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].length > 2 && match[1].length < 50) {
          facts.push({
            type,
            content: match[1].trim(),
            timestamp: Date.now(),
          });
        }
      }
    }

    return facts;
  }, []);

  const saveMemory = useCallback((newMemory) => {
    setMemory(prev => {
      const updated = { ...prev, ...newMemory };
      if (updated.conversationHistory.length > maxHistoryLength) {
        updated.conversationHistory = updated.conversationHistory.slice(-maxHistoryLength);
      }
      if (updated.factsAboutUser.length > maxFactsLength) {
        updated.factsAboutUser = updated.factsAboutUser.slice(-maxFactsLength);
      }
      return updated;
    });
  }, [maxHistoryLength, maxFactsLength]);

  const addToHistory = useCallback((role, content) => {
    saveMemory({
      conversationHistory: [
        ...memoryRef.current.conversationHistory,
        { role, content, timestamp: Date.now() }
      ],
      lastConversation: { role, content, timestamp: Date.now() },
    });
  }, [saveMemory]);

  const setUserName = useCallback((name) => {
    if (name) {
      saveMemory({ userName: name });
    }
  }, [saveMemory]);

  const updateUserProfile = useCallback((updates) => {
    saveMemory({
      userProfile: { ...memoryRef.current.userProfile, ...updates }
    });
  }, [saveMemory]);

  const setLearningStyle = useCallback((style) => {
    updateUserProfile({ learningStyle: style });
  }, [updateUserProfile]);

  const setMood = useCallback((mood) => {
    updateUserProfile({ mood });
  }, [updateUserProfile]);

  const addInterest = useCallback((interest) => {
    const currentInterests = memoryRef.current.userProfile.interests;
    if (!currentInterests.includes(interest)) {
      updateUserProfile({ interests: [...currentInterests, interest] });
    }
  }, [updateUserProfile]);

  const addGoal = useCallback((goal) => {
    const currentGoals = memoryRef.current.goals;
    if (!currentGoals.includes(goal)) {
      saveMemory({ goals: [...currentGoals, goal] });
    }
  }, [saveMemory]);

  const addChallenge = useCallback((challenge) => {
    saveMemory({
      challenges: [...memoryRef.current.challenges, { content: challenge, timestamp: Date.now() }]
    });
  }, [saveMemory]);

  const generateContext = useCallback(() => {
    const mem = memoryRef.current;
    let context = '';

    if (mem.userName) {
      context += `El usuario se llama ${mem.userName}. `;
    }

    if (mem.userProfile.learningStyle) {
      context += `Su estilo de aprendizaje es ${mem.userProfile.learningStyle}. `;
    }

    if (mem.userProfile.interests.length > 0) {
      context += `Le interesan: ${mem.userProfile.interests.join(', ')}. `;
    }

    if (mem.goals.length > 0) {
      context += `Sus objetivos son: ${mem.goals.join(', ')}. `;
    }

    if (mem.conversationCount > 0) {
      context += `Esta es la conversación número ${mem.conversationCount + 1}. `;
    }

    if (mem.factsAboutUser.length > 0) {
      const recentFacts = mem.factsAboutUser.slice(-5);
      context += `Datos recientes del usuario: ${recentFacts.map(f => f.content).join('. ')}. `;
    }

    return context;
  }, []);

  const processMessage = useCallback((role, content) => {
    if (role === 'user') {
      const name = extractName(content);
      if (name) {
        setUserName(name);
      }

      const facts = extractFacts(content);
      if (facts.length > 0) {
        saveMemory({
          factsAboutUser: [...memoryRef.current.factsAboutUser, ...facts]
        });
      }

      const lowerContent = content.toLowerCase();
      if (lowerContent.includes('quiero aprender') || lowerContent.includes('quiero saber')) {
        const topicMatch = content.match(/(?:aprender|saber|conocer)\s+(?:sobre|de|que es|cómo)\s+(.+?)(?:\.|,|$)/i);
        if (topicMatch) {
          addInterest(topicMatch[1]);
        }
      }
    }

    addToHistory(role, content);
  }, [extractName, extractFacts, setUserName, saveMemory, addToHistory, addInterest]);

  const incrementConversationCount = useCallback(() => {
    saveMemory({ conversationCount: memoryRef.current.conversationCount + 1 });
  }, [saveMemory]);

  const clearMemory = useCallback(() => {
    saveMemory(DEFAULT_MEMORY);
  }, [saveMemory]);

  const getRecentHistory = useCallback((count = 10) => {
    return memoryRef.current.conversationHistory.slice(-count);
  }, []);

  const getContextualPrompt = useCallback(() => {
    return generateContext();
  }, [generateContext]);

  return {
    memory,
    currentContext,
    setUserName,
    updateUserProfile,
    setLearningStyle,
    setMood,
    addInterest,
    addGoal,
    addChallenge,
    addToHistory,
    processMessage,
    incrementConversationCount,
    generateContext,
    getRecentHistory,
    getContextualPrompt,
    clearMemory,
  };
}

export default useConversationMemory;
