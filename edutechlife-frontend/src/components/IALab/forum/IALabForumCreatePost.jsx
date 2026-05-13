import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useAuth } from '../../../context/AuthContext';
import useForumPosts, { POST_CATEGORIES } from '../../../hooks/IALab/forum/useForumPosts';

const IALabForumCreatePost = ({ onClose, onCreated }) => {
  const { user } = useAuth();
  const { createPost } = useForumPosts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('discussion');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const result = await createPost({ title: title.trim(), content: content.trim(), category, tags });

    if (result.success) {
      onCreated?.();
    } else {
      setError(result.error || 'Error al crear el post');
    }
    setIsSubmitting(false);
  }, [title, content, category, tagsInput, createPost, onCreated]);

  const categoryOptions = POST_CATEGORIES.filter(c => c.id !== 'all');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center">
              <Icon name="fa-plus" className="text-white text-xs" />
            </div>
            <h3 className="text-base font-bold text-petroleum dark:text-[#4DA8C4]">Nuevo Post</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
            <Icon name="fa-xmark" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            {categoryOptions.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCategory(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                  category === opt.id
                    ? 'bg-petroleum text-white border-petroleum'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-petroleum/30'
                }`}
              >
                <Icon name={opt.icon} className="text-[10px]" />
                {opt.label}
              </button>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de tu publicación"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-corporate/20 focus:border-corporate/30 transition-all"
              maxLength={200}
              autoFocus
            />
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu contenido aquí... Comparte tu experiencia, haz una pregunta o inicia una discusión."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-corporate/20 focus:border-corporate/30 transition-all resize-none"
              rows={5}
              maxLength={5000}
            />
            <div className="flex justify-end mt-1">
              <span className={`text-[10px] font-medium ${content.length > 4500 ? 'text-amber-500' : 'text-slate-400'}`}>
                {content.length}/5000
              </span>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Etiquetas (separadas por coma): IA, Prompts, ChatGPT"
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-corporate/20 focus:border-corporate/30 transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Icon name="fa-paper-plane" className="text-xs" />
                  Publicar
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default IALabForumCreatePost;
