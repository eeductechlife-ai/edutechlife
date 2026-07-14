import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { MODULE_CONFIG } from "./moduleConfig";
import {
  generateExercises as apiGenerateExercises,
  evaluateAnswers as apiEvaluateAnswers,
} from "./api";
import {
  getAuthDb,
  saveGradeToSupabase as apiSaveGradeToSupabase,
} from "./supabase";

const useIALabEvaluation = (moduleId = 1, locale = "es") => {
  const { user } = useAuth();
  const abortRef = useRef(null);
  const config = MODULE_CONFIG[moduleId] || MODULE_CONFIG[1];

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const [state, setState] = useState({
    step: 1,
    exercises: null,
    responses: { ej1: "", ej2: "", ej3: "", ej4: "" },
    evaluation: null,
    loading: false,
    error: null,
    fallbackMode: false,
  });

  const generateExercises = useCallback(
    async (overridelocale) => {
      const activeLocale = overridelocale || locale;
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        fallbackMode: false,
      }));

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const exercises = await apiGenerateExercises({
          config,
          locale: activeLocale,
          signal: controller.signal,
        });

        setState((prev) => ({
          ...prev,
          exercises,
          loading: false,
          step: 1,
        }));
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error generando ejercicios:", error);

        const fallbackExercises = config.fallbackExercises(activeLocale);
        setState((prev) => ({
          ...prev,
          exercises: fallbackExercises,
          loading: false,
          step: 1,
          fallbackMode: true,
        }));
      }
    },
    [locale, config],
  );

  const evaluateAnswers = useCallback(
    async (responses) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const evaluation = await apiEvaluateAnswers({
          config,
          exercises: state.exercises,
          responses,
          signal: controller.signal,
        });

        setState((prev) => ({
          ...prev,
          evaluation,
          loading: false,
        }));

        return evaluation;
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error evaluando respuestas:", error);

        const fallbackEvaluation = config.localEvaluate(responses);
        setState((prev) => ({
          ...prev,
          evaluation: fallbackEvaluation,
          loading: false,
          fallbackMode: true,
        }));

        return fallbackEvaluation;
      }
    },
    [state.exercises, config],
  );

  const saveGradeToSupabase = useCallback(
    async (evaluation, modId) => {
      return apiSaveGradeToSupabase({
        user,
        moduleId: modId || moduleId,
        getAuthDb,
        evaluation,
      });
    },
    [user, getAuthDb, moduleId],
  );

  const setStep = useCallback((step) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const setResponse = useCallback((exerciseKey, response) => {
    setState((prev) => ({
      ...prev,
      responses: { ...prev.responses, [exerciseKey]: response },
    }));
  }, []);

  const resetEvaluation = useCallback(() => {
    setState({
      step: 1,
      exercises: null,
      responses: { ej1: "", ej2: "", ej3: "", ej4: "" },
      evaluation: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    state,
    generateExercises,
    evaluateAnswers,
    saveGradeToSupabase,
    setStep,
    setResponse,
    resetEvaluation,
    config,
  };
};

export default useIALabEvaluation;
