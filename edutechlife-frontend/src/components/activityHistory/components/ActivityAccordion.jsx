import React from "react";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";

export const SectionLine = () => (
  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-petroleum to-corporate" />
);

export const AccordionSection = React.memo(
  ({ id, title, icon, isOpen, onToggle, children }) => {
    return (
      <div className="mb-4 bg-white rounded-xl border border-slate-200/40 shadow-sm overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/50 transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5">
            {icon && <Icon name={icon} className="text-petroleum text-sm" />}
            <h3 className="text-xs font-bold text-petroleum uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              name="fa-chevron-down"
              className="text-slate-400 text-[10px]"
            />
          </motion.div>
        </button>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="p-4 sm:p-5 pt-0">{children}</div>
        </motion.div>
      </div>
    );
  },
);
