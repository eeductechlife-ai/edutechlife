const SEPARATOR_CELL = /^:?-{3,}:?$/;

// AI-generated questions sometimes embed a markdown table, often flattened
// onto a single line ("| a | b | |---|---| | 1 | 2 |").
export function splitQuestionTable(text) {
  if (typeof text !== "string" || !/\|\s*:?-{3,}/.test(text)) {
    return { before: text, table: null, after: "" };
  }
  const start = text.indexOf("|");
  const end = text.lastIndexOf("|");
  const cells = text
    .slice(start, end + 1)
    .split("|")
    .map((c) => c.trim());

  const rows = [];
  let row = [];
  for (let i = 1; i < cells.length; i++) {
    if (cells[i] === "") {
      if (row.length) rows.push(row);
      row = [];
    } else {
      row.push(cells[i]);
    }
  }
  if (row.length) rows.push(row);

  const dataRows = rows.filter((r) => !r.every((c) => SEPARATOR_CELL.test(c)));
  if (dataRows.length < 2) return { before: text, table: null, after: "" };

  return {
    before: text.slice(0, start).trim(),
    table: { header: dataRows[0], rows: dataRows.slice(1) },
    after: text.slice(end + 1).trim(),
  };
}

export function questionToSpeech(text) {
  const { before, table, after } = splitQuestionTable(text);
  if (!table) return text;
  const lines = table.rows.map((r) =>
    r.map((cell, i) => `${table.header[i] ?? ""} ${cell}`.trim()).join(", "),
  );
  return [before, lines.join(". "), after].filter(Boolean).join(" ");
}
