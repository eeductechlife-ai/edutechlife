import { useState } from "react";
import PropTypes from "prop-types";
import {
  AlertTriangle,
  Bookmark,
  Box,
  Brain,
  Clock,
  FileDown,
  GitBranch,
  Layers,
  Lightbulb,
  Lock,
  MessageSquare,
  Scale,
  Share2,
  ShieldCheck,
  Signature,
  UserCheck,
} from "lucide-react";

// Tarjetas de conceptos clave: qué es, un ejemplo y por qué importa.
// En móvil empiezan plegadas para que el OVA no quede tan largo; en pantallas grandes, abiertas.
const ICONS = {
  AlertTriangle,
  Bookmark,
  Box,
  Brain,
  Clock,
  FileDown,
  GitBranch,
  Layers,
  Lock,
  MessageSquare,
  Scale,
  Share2,
  ShieldCheck,
  Signature,
  UserCheck,
};
const isDesktop = () =>
  typeof window === "undefined" ||
  !window.matchMedia ||
  window.matchMedia("(min-width: 640px)").matches;

export default function ConceptCards({ title, items }) {
  const [open, setOpen] = useState(isDesktop);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 p-4 font-extrabold text-slate-900 dark:text-white">
        <Lightbulb
          className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-300"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">{title}</span>
        <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-bold text-cyan-800 dark:bg-slate-800 dark:text-cyan-300">
          {items.length}
        </span>
      </summary>
      <div className="grid gap-3 p-4 pt-0 sm:grid-cols-2">
        {items.map((c) => {
          const Icon = ICONS[c.icon] || Layers;
          return (
            <article
              key={c.t}
              className="relative overflow-hidden rounded-xl border border-slate-200 p-3 dark:border-slate-700"
            >
              <span
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-600 to-cyan-300"
                aria-hidden="true"
              />
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-slate-800 dark:text-cyan-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    {c.t}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {c.what}
                  </p>
                  <p className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {c.example}
                  </p>
                  <p className="text-xs font-semibold text-cyan-800 dark:text-cyan-300">
                    {c.why}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </details>
  );
}

ConceptCards.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      t: PropTypes.string.isRequired,
      icon: PropTypes.string,
      what: PropTypes.string.isRequired,
      example: PropTypes.string.isRequired,
      why: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
