import { useState, useCallback, useEffect, useRef } from "react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { getTips } from "./examUtils";
import useTimetable from "../../../hooks/useTimetable";

// Mon=1 … Sun=7 (matches migration 042).
const isoDayFromDate = (yyyyMmDd) => {
  if (!yyyyMmDd) return null;
  const d = new Date(`${yyyyMmDd}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const js = d.getDay();
  return js === 0 ? 7 : js;
};

export default function useExamPrep() {
  const {
    vakResult,
    setDocumentForDani,
    exams,
    setExams,
    examMaterials,
    setExamMaterials,
  } = useSmartBoardKids();

  // Timetable integration: enables subject autocomplete + DB persistence.
  // Errors here must never break the local exam flow (DB may be missing).
  const { slots, addExam: persistExamToDb } = useTimetable();

  const [mode, setMode] = useState("list");
  const [detailId, setDetailId] = useState(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("matematicas");
  const [date, setDate] = useState("");
  const [grade, setGrade] = useState(70);
  const [suggestedSubject, setSuggestedSubject] = useState(null);
  const subjectManuallyPickedRef = useRef(false);

  // When the student picks a date, suggest a subject from that day's classes.
  // Only overrides `subject` if the student has not manually chosen one yet.
  useEffect(() => {
    const day = isoDayFromDate(date);
    if (!day || !slots?.length) {
      setSuggestedSubject(null);
      return;
    }
    const daySlots = slots.filter((s) => s.day_of_week === day);
    if (!daySlots.length) {
      setSuggestedSubject(null);
      return;
    }
    // Prefer the first slot of the day; the exam is likely the day's headline.
    const pick = daySlots[0];
    setSuggestedSubject({
      subject: pick.subject,
      label: pick.subject_label || pick.subject,
    });
    if (!subjectManuallyPickedRef.current) {
      setSubject(pick.subject);
    }
  }, [date, slots]);

  const chooseSubject = useCallback((next) => {
    subjectManuallyPickedRef.current = true;
    setSubject(next);
  }, []);

  const addExam = useCallback(() => {
    if (!name.trim() || !date) return;
    const localExam = {
      id: Date.now(),
      name: name.trim(),
      subject,
      date,
      desiredGrade: Math.min(100, Math.max(0, grade)),
      studyProgress: 0,
      createdAt: new Date().toISOString(),
    };
    setExams((prev) => [...prev, localExam]);
    // Fire-and-forget DB persist. Never blocks the UI, never breaks it.
    persistExamToDb({
      subject,
      exam_name: localExam.name,
      exam_date: date,
      desired_grade: localExam.desiredGrade,
      source: "manual",
    }).catch((e) =>
      console.warn("[exam] DB persist failed (kept locally):", e?.message),
    );
    setName("");
    setDate("");
    setGrade(70);
    subjectManuallyPickedRef.current = false;
    setSuggestedSubject(null);
    setMode("list");
  }, [name, subject, date, grade, setExams, persistExamToDb]);

  const deleteExam = useCallback(
    (id) => {
      setExams((prev) => prev.filter((e) => e.id !== id));
      setExamMaterials((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (detailId === id) {
        setMode("list");
        setDetailId(null);
      }
    },
    [detailId, setExams, setExamMaterials],
  );

  const handleUploadMaterial = useCallback(
    (examId, analysis) => {
      setExamMaterials((prev) => ({
        ...prev,
        [examId]: [
          ...(prev[examId] || []),
          { ...analysis, uploadedAt: new Date().toISOString() },
        ],
      }));
    },
    [setExamMaterials],
  );

  const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const detailExam = exams.find((e) => e.id === detailId);
  const tips = detailExam ? getTips(vakResult) : [];
  const detailMaterials = detailId ? examMaterials[detailId] || [] : [];

  return {
    mode, setMode,
    detailId, setDetailId,
    name, setName,
    subject, setSubject: chooseSubject,
    date, setDate,
    grade, setGrade,
    addExam,
    deleteExam,
    handleUploadMaterial,
    sorted,
    detailExam,
    tips,
    detailMaterials,
    setDocumentForDani,
    suggestedSubject,
  };
}
