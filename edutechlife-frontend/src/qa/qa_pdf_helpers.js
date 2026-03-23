// QA helpers for Diagnóstico VAK PDFs
// Provides two sample QA profiles and a hook to generate two PDFs if an
// exportPDF function is available in the runtime (development environment).
// It is designed for QA in development and should not run in production.

export const QA_SAMPLE_PROFILES = [
  {
    name: "Perfil A",
    color: "teal",
    student: { firstName: "Ana", lastName: "López" },
    counts: { totals: 10, correct: 7, incorrect: 3 },
    profile: {
      description: "Perfil orientado a acciones rápidas; foco en resultados.",
      strategies: [
        "Guía breve y acciones concretas",
        "Refuerzo positivo rápido",
        "Recordatorios visuales",
      ],
    },
  },
  {
    name: "Perfil B",
    color: "violet",
    student: { firstName: "Miguel", lastName: "Santos" },
    counts: { totals: 10, correct: 4, incorrect: 6 },
    profile: {
      description: "Perfil analítico; requiere explicación detallada.",
      strategies: [
        "Desglose paso a paso",
        "Notas y gráficos",
        "Checklists",
      ],
    },
  },
];

function isoDateStamp() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export async function generateTwoQA_PDFs() {
  const dateIso = isoDateStamp();
  const items = [
    { data: QA_SAMPLE_PROFILES[0], filename: `Diagnostico_VAK_QA_USUARIO_${dateIso}.pdf` },
    { data: QA_SAMPLE_PROFILES[1], filename: `Diagnostico_VAK_QA_USUARIO_2_${dateIso}.pdf` },
  ];
  const exporter = (typeof window !== "undefined" && typeof window.exportPDF === "function")
    ? window.exportPDF
    : null;

  if (!exporter) {
    console.warn("exportPDF is not available in this environment. QA PDFs generation is skipped.");
    return;
  }
  for (const item of items) {
    // The exporter is expected to accept a data payload and a filename.
    // Adapt this call to your actual PDF exporter API.
    try {
      await exporter(item.data, item.filename);
      console.info(`QA PDF generated: ${item.filename}`);
    } catch (e) {
      console.error(`Failed to generate QA PDF ${item.filename}:`, e);
    }
  }
}

// Expose on window for QA runner in development environments (browser)
if (typeof window !== 'undefined') {
  try {
    window.generateTwoQA_PDFs = generateTwoQA_PDFs;
  } catch (e) {
    // ignore if window is not writable
  }
  try {
    window.QA_SAMPLE_PROFILES = QA_SAMPLE_PROFILES;
  } catch (e) {
    // ignore
  }
}
