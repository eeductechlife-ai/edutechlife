import PropTypes from "prop-types";
import { BookOpen } from "lucide-react";

// Glosario breve de un OVA: términos clave que el alumno necesita antes de seguir.
const GlossaryPanel = ({ title, terms }) => (
  <section
    aria-label={title}
    className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
  >
    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
      <BookOpen className="h-4 w-4" aria-hidden="true" />
      {title}
    </h3>
    <dl className="grid gap-3 sm:grid-cols-2">
      {terms.map((item) => (
        <div key={item.term}>
          <dt className="font-semibold text-slate-900 dark:text-white">
            {item.term}
          </dt>
          <dd className="text-sm text-slate-600 dark:text-slate-300">
            {item.def}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

GlossaryPanel.propTypes = {
  title: PropTypes.string.isRequired,
  terms: PropTypes.arrayOf(
    PropTypes.shape({
      term: PropTypes.string.isRequired,
      def: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default GlossaryPanel;
