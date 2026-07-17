import { useState, useCallback } from "react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { getTips } from "./examUtils";

export default function useExamPrep() {
  const {
    vakResult,
    setDocumentForDani,
    exams,
    setExams,
    examMaterials,
    setExamMaterials,
  } = useSmartBoardKids();

  const [mode, setMode] = useState("list");
  const [detailId, setDetailId] = useState(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("matematicas");
  const [date, setDate] = useState("");
  const [grade, setGrade] = useState(70);

  const addExam = useCallback(() => {
    if (!name.trim() || !date) return;
    setExams((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        subject,
        date,
        desiredGrade: Math.min(100, Math.max(0, grade)),
        studyProgress: 0,
        createdAt: new Date().toISOString(),
      },
    ]);
    setName("");
    setDate("");
    setGrade(70);
    setMode("list");
  }, [name, subject, date, grade, setExams]);

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
    subject, setSubject,
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
  };
}
