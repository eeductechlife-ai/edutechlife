import { lazy, Suspense, useEffect } from "react";
import { PageLoader } from "../components/LoadingScreen";

// DEV ONLY — renders the parent dashboard with a fictional family so the UI
// can be reviewed without signing in. Registered only when import.meta.env.DEV.
const IngenIAParentDashboard = lazy(
  () => import("../components/pages/ingenIAParentDashboard"),
);

const STUDENT_ID = "dev-student-preview";

function seedLocalStorage() {
  const sfx = `_${STUDENT_ID}`;
  const set = (k, v) => {
    try {
      if (typeof v === "string") localStorage.setItem(k, v);
      else localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };

  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };

  set("student_id", STUDENT_ID);
  set("student_email", "sofia.dev@ejemplo.co");
  set("student_name", "Sofía Martínez");
  set("parent_name", "Carlos Martínez");
  set(`edutechlife_points${sfx}`, "620");
  set(`edutechlife_minutes${sfx}`, "185");
  set(`edutechlife_points_history${sfx}`, [
    {
      id: "h1",
      points: 100,
      reason: "Reto Matemáticas (80%)",
      timestamp: daysAgo(3),
      category: "challenge",
    },
    {
      id: "h2",
      points: 50,
      reason: "Misión completada",
      timestamp: daysAgo(2),
      category: "mission",
    },
    {
      id: "h3",
      points: 80,
      reason: "Examen Lenguaje",
      timestamp: daysAgo(1),
      category: "exam",
    },
    {
      id: "h4",
      points: 60,
      reason: "Reto Inglés (70%)",
      timestamp: daysAgo(0),
      category: "challenge",
    },
  ]);
  set(`edutechlife_streak${sfx}`, {
    current: 4,
    longest: 7,
    lastActive: daysAgo(0),
  });
  set(`edutechlife_missions${sfx}`, [
    {
      id: "m1",
      title: "Resolver 5 retos de Matemáticas",
      completed: true,
      points: 100,
    },
    { id: "m2", title: "Leer el artículo de IA", completed: true, points: 50 },
    {
      id: "m3",
      title: "Completar diagnóstico VAK",
      completed: false,
      points: 80,
    },
  ]);
  set(`edutechlife_subjects${sfx}`, [
    {
      id: "matematicas",
      name: "Matemáticas",
      progress: 68,
      gradeScore: 3.4,
      trend: { delta: 0.2 },
    },
    {
      id: "lenguaje",
      name: "Lenguaje",
      progress: 80,
      gradeScore: 4.0,
      trend: { delta: 0.1 },
    },
    {
      id: "ciencias",
      name: "Ciencias",
      progress: 76,
      gradeScore: 3.8,
      trend: { delta: 0.0 },
    },
    {
      id: "ingles",
      name: "Inglés",
      progress: 66,
      gradeScore: 3.3,
      trend: { delta: -0.2 },
    },
    {
      id: "historia",
      name: "Sociales",
      progress: 86,
      gradeScore: 4.3,
      trend: { delta: 0.1 },
    },
  ]);
  set(`edutechlife_sessions${sfx}`, [
    { id: "s1", subject: "Matemáticas", duration: 30, timestamp: daysAgo(1) },
    { id: "s2", subject: "Inglés", duration: 25, timestamp: daysAgo(0) },
  ]);
  set(`edutechlife_vak${sfx}`, {
    dominant: "visual",
    scores: { visual: 72, auditory: 55, kinesthetic: 48 },
  });
  set(`edutechlife_calendar${sfx}`, [
    {
      id: "ev1",
      title: "Examen Matemáticas",
      date: new Date(Date.now() + 3 * 86400000).toISOString(),
      subject: "matematicas",
    },
  ]);
}

export default function DevIngenIAParentPreview() {
  useEffect(() => {
    seedLocalStorage();
  }, []);

  return (
    <>
      <div className="fixed left-2 bottom-24 z-[200] px-2 py-0.5 rounded-md bg-amber-400/90 text-[9px] font-black text-amber-950 whitespace-nowrap pointer-events-none">
        VISTA PADRE · datos de ejemplo
      </div>
      <Suspense fallback={<PageLoader message="Cargando vista de padre…" />}>
        <IngenIAParentDashboard />
      </Suspense>
    </>
  );
}
