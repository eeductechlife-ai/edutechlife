export const exportProgressPDF = async ({
  t,
  courseProgress,
  level,
  xp,
  streak,
  totalLessonsCompleted,
  totalLessonsCount,
  sessionStats,
  daysActive,
  studyHours,
  studyMins,
  daysSinceStart,
  estimatedEndDate,
  moduleScores,
  completedModules,
  lessonProgress,
  MODULE_RESOURCES,
  ALL_LESSONS,
  activitiesData,
  totalVideos,
  totalVideosTarget,
  totalInfographics,
  totalInfographicsTarget,
  totalExams,
  totalChallenges,
  forumPostCount,
  forumCommentCount,
  badges,
  weakestModule,
  getLevelProgress,
  getXpForNextLevel,
  MODULE_NAMES,
}) => {
  const jsPDF = (await import("jspdf")).default;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PW = 210,
    PH = 297,
    ML = 14,
    MR = 14,
    MT = 22,
    MB = 14;
  const CW = PW - ML - MR;
  const CP = [0, 75, 99],
    CC = [0, 188, 212],
    CG = [100, 116, 139],
    CD = [30, 41, 59];
  let cy = MT;
  const pageCount = () => doc.internal.getNumberOfPages();
  let currentPage = 1;

  const addFooter = () => {
    const pn = pageCount();
    doc.setFontSize(7);
    doc.setTextColor(...CG);
    doc.text(t("activity.pdf.title"), ML, PH - MB);
    doc.text(t("activity.pdf.page", { n: pn }), PW - MR, PH - MB, {
      align: "right",
    });
    doc.setDrawColor(...CP);
    doc.setLineWidth(0.2);
    doc.line(ML, PH - MB - 3, PW - MR, PH - MB - 3);
  };

  const drawHeader = () => {
    currentPage = pageCount();
    doc.setFillColor(...CP);
    doc.rect(0, 0, PW, 17, "F");
    doc.setFillColor(...CC);
    doc.rect(0, 17, PW, 0.4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("EDUTECHLIFE", ML, 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(
      new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      PW - MR,
      11,
      { align: "right" },
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(220, 250, 255);
    doc.text(t("activity.title"), ML, 15.5);
    cy = 22;
  };

  const checkPage = (mm) => {
    if (cy + mm > PH - MB - 12) {
      addFooter();
      doc.addPage();
      drawHeader();
    }
  };

  const sectionTitle = (text) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...CP);
    doc.text(text, ML, cy);
    doc.setFillColor(...CC);
    doc.rect(ML, cy + 1, 28, 0.3, "F");
    cy += 6.5;
  };

  const tableRow = (cols, y, header) => {
    if (header) {
      doc.setFillColor(...CP);
      doc.rect(ML, y - 3.5, CW, 5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...CD);
    }
    let x = ML + 1.5;
    cols.forEach(([text, w]) => {
      doc.text(String(text).slice(0, Math.floor(w / 1.6)), x, y, {
        align: "left",
      });
      x += w;
    });
    if (header) doc.setDrawColor(...CC);
    else doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.15);
    doc.line(ML, y + 1.5, PW - MR, y + 1.5);
    return y + 5;
  };

  const progressBar = (pct, y, color) => {
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(ML, y, CW, 2, 0.5, 0.5, "F");
    doc.setFillColor(...color);
    const w = Math.max(2, (CW * Math.min(pct, 100)) / 100);
    doc.roundedRect(ML, y, w, 2, 0.5, 0.5, "F");
  };

  // ===== PAGE 1 =====
  drawHeader();

  // -- Resumen General --
  sectionTitle(t("activity.pdf.section_general"));
  checkPage(25);

  const cards = [
    {
      label: t("activity.stats.progress").toUpperCase(),
      val: `${Math.round(courseProgress)}%`,
    },
    { label: t("kid.points_rewards.level").toUpperCase(), val: String(level) },
    {
      label: "XP " + t("activity.stats.total_label").toUpperCase(),
      val: String(xp),
    },
    {
      label: t("activity.stats.weekly_chart_label").toUpperCase(),
      val: `${streak}d`,
    },
    {
      label: t("activity.stats.lessons").toUpperCase(),
      val: `${totalLessonsCompleted}/${totalLessonsCount}`,
    },
  ];
  const cw = (CW - 8) / 5;
  cards.forEach((c, i) => {
    const cx = ML + i * (cw + 2);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(cx, cy - 1, cw, 11, 0.8, 0.8, "F");
    doc.setDrawColor(...CC);
    doc.setLineWidth(0.15);
    doc.roundedRect(cx, cy - 1, cw, 11, 0.8, 0.8, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(...CG);
    doc.text(c.label, cx + 1.5, cy + 2.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...CP);
    doc.text(c.val, cx + 1.5, cy + 8.5);
  });
  cy += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...CD);
  doc.text(
    `${t("activity.stats.sessions_label")}: ${sessionStats.sessionCount} · ${t("activity.stats.days_active")}: ${daysActive} · ${t("activity.stats.study_time")}: ${t("activity.hours_minutes", { hours: studyHours, minutes: studyMins })} · ${t("activity.stats.weekly_chart_label")}: ${daysSinceStart || 0} ${t("activity.stats.days_active").toLowerCase()}${estimatedEndDate ? ` · ${t("activity.pdf.section_recommendation")}: ${estimatedEndDate}` : ""}`,
    ML,
    cy,
  );
  cy += 8;

  // -- Progreso por Módulo --
  sectionTitle(t("activity.pdf.section_modules"));
  const mCols = [
    [t("activity.pdf.section_modules"), 42],
    [t("activity.stats.by_module"), 14],
    [t("activity.config.exam"), 14],
    [t("activity.config.challenge"), 14],
    [t("activity.stats.weekly_chart_label"), 22],
    ["", CW - 42 - 14 - 14 - 14 - 22],
  ];
  cy = tableRow(mCols, cy, true);

  moduleScores.forEach((mod, i) => {
    checkPage(8);
    const passed = mod.score >= 80;
    const state = completedModules.includes(mod.id)
      ? t("activity.pdf.status_completed")
      : t("activity.pdf.status_in_progress");
    const stripe = i % 2 === 1;
    if (stripe) {
      doc.setFillColor(248, 250, 252);
      doc.rect(ML, cy - 3.5, CW, 5.5, "F");
    }
    cy = tableRow(
      [
        [mod.title, 42],
        [`${mod.score}%`, 14],
        [`${mod.examScore}%`, 14],
        [`${mod.challengeScore}%`, 14],
        [state, 22],
      ],
      cy,
      false,
    );
    const barC = passed
      ? [16, 185, 129]
      : mod.score >= 60
        ? [245, 158, 11]
        : [148, 163, 184];
    progressBar(mod.score, cy - 0.5, barC);
    cy += 1.5;
  });
  cy += 4;

  // -- Lecciones por Módulo --
  checkPage(20);
  sectionTitle(t("activity.pdf.section_lessons"));
  const lCols = [
    [t("activity.pdf.section_modules"), 42],
    [t("activity.stats.lessons"), 22],
    [t("activity.stats.range_all"), 14],
    [t("activity.stats.weekly_chart_label"), CW - 42 - 22 - 14],
  ];
  cy = tableRow(lCols, cy, true);
  MODULE_RESOURCES.forEach((cfg, i) => {
    const modLess = lessonProgress?.[cfg.id] || {};
    const done = Object.values(modLess).filter((s) => s === "completed").length;
    const total = ALL_LESSONS?.[cfg.id]?.length || 0;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const stripe = i % 2 === 1;
    if (stripe) {
      doc.setFillColor(248, 250, 252);
      doc.rect(ML, cy - 3.5, CW, 5.5, "F");
    }
    cy = tableRow(
      [
        [cfg.title, 42],
        [String(done), 22],
        [String(total), 14],
      ],
      cy,
      false,
    );
    const lBarC =
      pct >= 80 ? [16, 185, 129] : pct >= 50 ? [245, 158, 11] : [148, 163, 184];
    progressBar(pct, cy - 0.5, lBarC);
    cy += 1.5;
  });
  cy += 4;
  addFooter();

  // ===== PAGE 2 =====
  doc.addPage();
  drawHeader();

  // -- Actividades Recientes --
  sectionTitle(t("activity.pdf.section_recent"));
  const aCols = [
    [t("activity.config.lesson"), 55],
    [t("activity.pdf.section_modules"), 50],
    [t("activity.stats.by_module"), 13],
    [t("activity.stats.weekly_chart_label"), CW - 55 - 50 - 13],
  ];
  cy = tableRow(aCols, cy, true);

  const topActs = activitiesData.slice(0, 30);
  if (topActs.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...CG);
    doc.text(t("activity.pdf.no_activities"), ML, cy + 4);
    cy += 8;
  } else {
    topActs.forEach((act, i) => {
      checkPage(5);
      const mn = MODULE_NAMES[act.module_id] || `Módulo ${act.module_id}`;
      const ds = act.completed_at
        ? new Date(act.completed_at).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
      const stripe = i % 2 === 1;
      if (stripe) {
        doc.setFillColor(248, 250, 252);
        doc.rect(ML, cy - 3.5, CW, 5, "F");
      }
      cy = tableRow(
        [
          [act.title.slice(0, 42), 55],
          [mn.slice(0, 35), 50],
          [act.score ? `${act.score}%` : "✓", 13],
          [ds, CW - 55 - 50 - 13],
        ],
        cy,
        false,
      );
    });
  }
  cy += 6;

  // -- Estadísticas --
  checkPage(35);
  sectionTitle(t("activity.pdf.section_resources"));
  const sCols = [
    [t("activity.config.resource"), 40],
    [t("activity.stats.by_module"), 30],
    [t("activity.stats.weekly_chart_label"), CW - 40 - 30],
  ];
  cy = tableRow(sCols, cy, true);
  const statsR = [
    [
      t("activity.config.video"),
      `${totalVideos}/${totalVideosTarget}`,
      totalVideosTarget > 0 ? totalVideos / totalVideosTarget : 0,
    ],
    [
      t("activity.config.infographic"),
      `${totalInfographics}/${totalInfographicsTarget}`,
      totalInfographicsTarget > 0
        ? totalInfographics / totalInfographicsTarget
        : 0,
    ],
    [t("activity.config.exam"), `${totalExams}/5`, totalExams / 5],
    [
      t("activity.config.challenge"),
      `${totalChallenges}/5`,
      totalChallenges / 5,
    ],
    ["Foro (posts)", String(forumPostCount || 0), 0],
    ["Foro (comentarios)", String(forumCommentCount || 0), 0],
    [t("activity.stats.achievements"), String(badges?.length || 0), 0],
  ];
  statsR.forEach(([label, val, pct], i) => {
    const stripe = i % 2 === 1;
    if (stripe) {
      doc.setFillColor(248, 250, 252);
      doc.rect(ML, cy - 3.5, CW, 5, "F");
    }
    cy = tableRow(
      [
        [label, 40],
        [String(val), 30],
      ],
      cy,
      false,
    );
    if (pct > 0) {
      const sbC =
        pct >= 0.8
          ? [16, 185, 129]
          : pct >= 0.5
            ? [245, 158, 11]
            : [148, 163, 184];
      progressBar(pct * 100, cy - 0.5, sbC);
    }
    cy += 1.5;
  });
  cy += 4;

  // -- Recomendación --
  if (weakestModule && weakestModule.score < 80) {
    checkPage(12);
    sectionTitle(t("activity.pdf.section_recommendation"));
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...CD);
    doc.text(
      `Tu módulo con menor rendimiento es "${weakestModule.title}" (${weakestModule.score}%).`,
      ML,
      cy,
    );
    cy += 4;
    doc.text(
      "Enfócate en repasar los videos, infografías y completar el examen y desafío pendientes para mejorar tu promedio general.",
      ML,
      cy,
      { maxWidth: CW },
    );
    cy += 6;
  }

  // -- XP & Nivel --
  checkPage(12);
  sectionTitle(t("activity.pdf.section_xp"));
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...CD);
  doc.text(`Nivel actual: ${level} · XP total: ${xp}`, ML, cy);
  cy += 4;
  const xpPct = getLevelProgress ? getLevelProgress() : 50;
  const nextLvl = getXpForNextLevel ? getXpForNextLevel() : 0;
  doc.text(
    `${t("activity.pdf.section_xp")}: ${Math.round(xpPct)}% (${xp}/${nextLvl > 0 ? nextLvl : "—"} XP)`,
    ML,
    cy,
  );
  cy += 4;
  progressBar(xpPct, cy, CP);
  cy += 6;

  addFooter();
  doc.save(`historial_ialab_${new Date().toISOString().slice(0, 10)}.pdf`);
};
