import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import { supabase } from '../../lib/supabase';
import { Icon } from '../../utils/iconMapping.jsx';
import IALabEvaluationResults from './IALabEvaluationResults';

const ChallengeResultViewer = ({ moduleId, onClose, onRetry }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    if (!user?.id || !moduleId) return;

    const loadEvaluation = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('completed_lessons, score')
          .eq('user_id', user.id)
          .eq('module_id', moduleId)
          .eq('activity_type', 'challenge')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const lessons = data.completed_lessons || {};
          setEvaluation({
            notaGlobal: data.score || 80,
            nota_ej1: lessons.nota_ej1 || 0,
            nota_ej2: lessons.nota_ej2 || 0,
            nota_ej3: lessons.nota_ej3 || 0,
            feedback_ej1: lessons.feedback_ej1 || 'Sin feedback disponible.',
            feedback_ej2: lessons.feedback_ej2 || 'Sin feedback disponible.',
            feedback_ej3: lessons.feedback_ej3 || 'Sin feedback disponible.',
          });
        } else {
          setEvaluation({
            notaGlobal: 80,
            nota_ej1: 0, nota_ej2: 0, nota_ej3: 0,
            feedback_ej1: 'No hay feedback almacenado.',
            feedback_ej2: 'No hay feedback almacenado.',
            feedback_ej3: 'No hay feedback almacenado.',
          });
        }
      } catch (err) {
        console.error('[CHALLENGE_RESULT] Error loading:', err);
        setEvaluation({
          notaGlobal: 80,
          nota_ej1: 0, nota_ej2: 0, nota_ej3: 0,
          feedback_ej1: 'Error al cargar feedback.',
          feedback_ej2: 'Error al cargar feedback.',
          feedback_ej3: 'Error al cargar feedback.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [user?.id, moduleId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-[#004B63] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-500">Cargando resultado del desafío...</p>
        </div>
      </div>
    );
  }

  if (evaluation) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-10 pb-10 bg-black/40 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200 mx-4">
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200/60 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="fa-trophy" className="text-emerald-500 text-lg" />
              <h3 className="text-sm font-bold text-slate-800 font-montserrat">Resultado del Desafío - Módulo {moduleId}</h3>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200">
              <Icon name="fa-times" className="text-slate-500 text-sm" />
            </button>
          </div>
          <IALabEvaluationResults evaluation={evaluation} onClose={onClose} onRetry={onRetry} />
        </div>
      </div>
    );
  }

  return null;
};

export default ChallengeResultViewer;
