import { motion } from 'framer-motion';
import { CATEGORIES } from '../../data/newsData';

export default function CategoryTabs({ active, onChange, counts }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className="relative px-4 py-2 rounded-full text-sm font-semibold transition-all overflow-hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {active === cat.id && (
            <motion.div
              layoutId="activeCategoryBg"
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: cat.color }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}
          <span
            className={`relative z-10 ${
              active === cat.id ? 'text-white' : 'text-[#64748B]'
            }`}
          >
            {cat.label}
            {counts?.[cat.id] !== undefined && (
              <span className={`ml-1.5 text-xs ${active === cat.id ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                ({counts[cat.id]})
              </span>
            )}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
