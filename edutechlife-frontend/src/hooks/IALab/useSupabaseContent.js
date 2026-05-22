import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { moduleContent as hardcodedContent } from '../../components/IALab/constants/moduleContent';
import { moduleResources as hardcodedResources } from '../../components/IALab/constants/moduleResources';

const CACHE_KEY = 'ialab_content_cache';
const CACHE_DURATION = 5 * 60 * 1000;

function getCache(key) {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}_${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_KEY}_${key}`);
      return null;
    }
    return data;
  } catch { return null; }
}

function setCache(key, data) {
  try {
    localStorage.setItem(`${CACHE_KEY}_${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota exceeded, ignore */ }
}

export function useSupabaseContent() {
  const [moduleContent, setModuleContent] = useState(hardcodedContent);
  const [moduleResources, setModuleResources] = useState(hardcodedResources);
  const [loading, setLoading] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [error, setError] = useState(null);

  const loadContent = useCallback(async (cancelledRef) => {
    setError(null);

    const cached = getCache('moduleContent');
    if (cached) {
      setModuleContent(cached);
      setModuleResources(getCache('moduleResources') || hardcodedResources);
      setFromCache(true);
      return;
    }

    setLoading(true);

    try {
      const { data: modules, error: modErr } = await supabase
        .from('module_content')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (modErr) throw modErr;

      if (modules && modules.length > 0) {
        const { data: lessons } = await supabase
          .from('module_lessons')
          .select('*')
          .eq('is_active', true)
          .order('lesson_index');

        const { data: topics } = await supabase
          .from('module_topics')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        const topicIds = (topics || []).map(t => t.id);
        const { data: resources } = topicIds.length > 0 ? await supabase
          .from('module_resources')
          .select('*')
          .in('topic_id', topicIds)
          .eq('is_active', true)
          .order('sort_order') : { data: [] };

        const built = {};
        for (const mod of modules) {
          const modLessons = (lessons || []).filter(l => l.module_id === mod.id);
          const modTopics = (topics || []).filter(t => t.module_id === mod.id);
          const resMap = {};
          for (const r of resources || []) {
            if (!resMap[r.topic_id]) resMap[r.topic_id] = [];
            resMap[r.topic_id].push(r);
          }
          const resourcesByTopic = {};
          for (const t of modTopics) {
            resourcesByTopic[t.title] = { title: t.title, description: t.description, learningObjectives: t.learning_objectives || [], estimatedTime: t.estimated_time, difficulty: t.difficulty, resources: resMap[t.id] || [] };
          }
          built[mod.id] = {
            objective: mod.objective,
            learningPoints: mod.learning_points || [],
            overviewData: mod.overview_data,
            lessons: modLessons.map(l => ({
              id: l.lesson_index,
              title: l.title,
              description: l.description,
              detailedDescription: l.detailed_description,
              duration: l.duration,
              format: l.format,
              icon: l.icon,
              badgeColor: l.badge_color,
              themeColor: l.theme_color
            })),
            accordionContent: modLessons.reduce((acc, l) => {
              acc[l.lesson_index] = l.accordion_content || {};
              return acc;
            }, {})
          };
        }
        setModuleContent(built);
        setModuleResources(resourcesByTopic);
        setCache('moduleContent', built);
        setCache('moduleResources', resourcesByTopic);
      }
    } catch (err) {
      console.warn('[useSupabaseContent] Error fetching from Supabase, using hardcoded fallback:', err.message);
      setError(err.message);
      setModuleContent(hardcodedContent);
      setModuleResources(hardcodedResources);
    } finally {
      if (!cancelledRef?.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const ref = { current: false };
    loadContent(ref);
    return () => { cancelled = true; ref.current = true; };
  }, [loadContent]);

  return { moduleContent, moduleResources, loading, fromCache, error, reload: loadContent };
}

export function useSupabaseQuiz(moduleId) {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('module_id', moduleId)
          .eq('is_active', true)
          .order('sort_order');
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setQuestions(data.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correct_answer,
            topic: q.topic,
            difficulty: q.difficulty,
            feedback: q.feedback
          })));
        }
      } catch (err) {
        console.warn('[useSupabaseQuiz] Error, using hardcoded:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (moduleId) fetchQuestions();
    else setLoading(false);
    return () => { cancelled = true; };
  }, [moduleId]);

  return { questions: questions || null, loading };
}
