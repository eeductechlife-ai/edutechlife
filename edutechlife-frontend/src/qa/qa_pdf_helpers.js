// QA helpers for Diagnóstico VAK PDFs
// Provides two sample QA profiles and generates two PDFs using html2pdf.
// Designed for QA in development. Call generateTwoQA_PDFs() from browser console.

import html2pdf from 'html2pdf.js';

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

function buildQAPDFHTML(profile) {
  const qrData = encodeURIComponent(
    `https://edutechlife.co/diagnosis/vak/results?payload=${encodeURIComponent(JSON.stringify({
      studentName: `${profile.student.firstName} ${profile.student.lastName}`,
      date: isoDateStamp(),
      predominantStyle: profile.name,
      percentage: Math.round((profile.counts.correct / profile.counts.totals) * 100),
    }))}`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
  const percentage = Math.round((profile.counts.correct / profile.counts.totals) * 100);

  return `
    <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: 0 auto; color: #333;">
      <div style="text-align: center; border-bottom: 3px solid #004B63; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #004B63; margin: 0; font-size: 22px;">EdutechLife</h1>
        <p style="color: #4DA8C4; margin: 5px 0 0 0; font-size: 13px;">Inteligencia Cognitiva</p>
      </div>

      <h2 style="color: #004B63; text-align: center; font-size: 18px;">Dictamen Psicopedagógico VAK</h2>

      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr>
          <td style="padding: 6px 10px; font-weight: bold; color: #004B63; width: 140px;">Estudiante:</td>
          <td style="padding: 6px 10px;">${profile.student.firstName} ${profile.student.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px; font-weight: bold; color: #004B63;">Fecha:</td>
          <td style="padding: 6px 10px;">${isoDateStamp()}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px; font-weight: bold; color: #004B63;">Puntaje:</td>
          <td style="padding: 6px 10px;">${profile.counts.correct}/${profile.counts.totals} (${percentage}%)</td>
        </tr>
      </table>

      <div style="background: linear-gradient(135deg, #004B63, #4DA8C4); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0;">
        <strong style="font-size: 16px;">${profile.name}</strong>
        <p style="margin: 5px 0 0 0; font-size: 13px;">${percentage}% - ${profile.profile.description}</p>
      </div>

      <div style="margin: 15px 0;">
        <h3 style="color: #004B63; font-size: 14px; margin-bottom: 8px;">Estrategias Recomendadas</h3>
        <ol style="margin: 0; padding-left: 20px;">
          ${profile.profile.strategies.map(s => `<li style="margin-bottom: 5px; font-size: 12px;">${s}</li>`).join('')}
        </ol>
      </div>

      <div style="margin-top: 25px; padding-top: 12px; border-top: 1px dashed #ccc; text-align: center; font-size: 9px; color: #999;">
        <img src="${qrUrl}" alt="QR" style="width: 70px; height: 70px; margin-bottom: 6px;" />
        <p style="margin: 0 0 2px 0;">Documento generado por EdutechLife • Inteligencia Cognitiva</p>
        <p style="margin: 0;">Ley 1581 de 2012 | Habeas Data | edutechlife.co</p>
      </div>
    </div>
  `;
}

export async function generateTwoQA_PDFs() {
  const dateIso = isoDateStamp();
  const items = [
    { data: QA_SAMPLE_PROFILES[0], filename: `Diagnostico_VAK_QA_USUARIO_${dateIso}.pdf` },
    { data: QA_SAMPLE_PROFILES[1], filename: `Diagnostico_VAK_QA_USUARIO_2_${dateIso}.pdf` },
  ];

  for (const item of items) {
    try {
      const html = buildQAPDFHTML(item.data);
      const el = document.createElement('div');
      el.innerHTML = html;
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.style.top = '0';
      document.body.appendChild(el);

      await html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: item.filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(el).save();

      document.body.removeChild(el);
      console.info(`✅ QA PDF generated: ${item.filename}`);
    } catch (e) {
      console.error(`❌ Failed to generate QA PDF ${item.filename}:`, e);
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
