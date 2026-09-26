import { splitQuestionTable, prettyMath } from "./questionTable";

export default function QuestionText({ text, className = "", darkMode }) {
  const { before, table, after } = splitQuestionTable(text);
  if (!table) return <p className={className}>{prettyMath(text)}</p>;

  const border = darkMode ? "border-[#334155]" : "border-[#E2E8F0]";
  const headBg = darkMode ? "bg-[#0F172A]" : "bg-[#F1F5F9]";

  return (
    <div className="space-y-3">
      {before && <p className={className}>{prettyMath(before)}</p>}
      <div className="overflow-x-auto">
        <table
          className={`min-w-[60%] text-sm border ${border} rounded-lg overflow-hidden`}
        >
          <thead className={headBg}>
            <tr>
              {table.header.map((h, i) => (
                <th
                  key={i}
                  className={`px-3 py-2 text-left font-bold border-b ${border}`}
                >
                  {prettyMath(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-1.5 border-b ${border} tabular-nums`}
                  >
                    {prettyMath(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {after && <p className={className}>{prettyMath(after)}</p>}
    </div>
  );
}
