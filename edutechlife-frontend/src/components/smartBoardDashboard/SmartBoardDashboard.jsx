import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarNavigation from "@/components/SidebarNavigation";
import useStudentProgress from "./useStudentProgress";
import { generateReportData, downloadReport } from "./reportGenerator";
import HomeView from "./components/HomeView";
import MissionsView from "./components/MissionsView";
import SubjectsView from "./components/SubjectsView";
import IALabView from "./components/IALabView";
import ProgressView from "./components/ProgressView";
import ReportModal from "./components/ReportModal";
import WeeklyScheduleView from "@/components/kids-dashboard/schedule/WeeklyScheduleView";
import { useSmartBoardKidsSafe } from "@/context/SmartBoardKidsContext";

const SmartBoardDashboard = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState("inicio");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  const smartBoard = useSmartBoardKidsSafe();

  const {
    userXP,
    setUserXP,
    userLevel,
    streakDays,
    missions,
    subjects,
    studentData,
    sessionStartRef,
    trackInteraction,
    handleMissionStart,
    handleMissionComplete,
  } = useStudentProgress();

  const handleSubjectClick = useCallback(
    (subject) => {
      if (!subject.locked) {
        trackInteraction("topicsExplored", [
          ...(studentData.topicsExplored || []),
          subject.name,
        ]);
        // Create session for this subject in Supabase
        if (smartBoard?.createSession) {
          smartBoard.createSession(subject.name, "lesson");
        }
        setActiveTab("materias");
      }
    },
    [trackInteraction, studentData.topicsExplored, smartBoard],
  );

  const generateStudentReport = useCallback(() => {
    const data = generateReportData({
      studentName: "Estudiante",
      studentData,
      userXP,
      userLevel,
      streakDays,
      subjects,
      sessionStartRef,
    });
    setReportData(data);
    setShowReportModal(true);
  }, [studentData, userXP, userLevel, streakDays, subjects, sessionStartRef]);

  const downloadStudentReport = useCallback(() => {
    downloadReport({ reportData, studentName: "Estudiante", subjects });
  }, [reportData, subjects]);

  const renderActiveView = useMemo(() => {
    const views = {
      inicio: (
        <HomeView
          studentName="Estudiante"
          missions={missions}
          subjects={subjects}
          userLevel={userLevel}
          onNavigate={setActiveTab}
          onMissionStart={handleMissionStart}
          onMissionComplete={handleMissionComplete}
          onGenerateReport={generateStudentReport}
        />
      ),
      horario: (
        <div className="w-full">
          <h2 className="text-2xl font-bold text-[#004B63] mb-6">Mi Horario</h2>
          <WeeklyScheduleView />
        </div>
      ),
      misiones: (
        <MissionsView
          missions={missions}
          onMissionStart={handleMissionStart}
          onMissionComplete={handleMissionComplete}
          onNavigate={setActiveTab}
        />
      ),
      materias: (
        <SubjectsView
          subjects={subjects}
          onSelectSubject={handleSubjectClick}
          onNavigate={setActiveTab}
        />
      ),
      "lab-ia": <IALabView onNavigate={onNavigate} />,
      progreso: (
        <ProgressView
          userXP={userXP}
          userLevel={userLevel}
          streakDays={streakDays}
          subjects={subjects}
          studentData={studentData}
          onGenerateReport={generateStudentReport}
        />
      ),
    };

    return views[activeTab] || views.inicio;
  }, [
    activeTab,
    missions,
    subjects,
    userLevel,
    userXP,
    streakDays,
    studentData,
    handleMissionStart,
    handleMissionComplete,
    handleSubjectClick,
    generateStudentReport,
    onNavigate,
  ]);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="flex h-screen relative z-10 flex-col md:flex-row">
        <div className="w-full md:w-80 md:flex-shrink-0 md:border-r md:border-[#E2E8F0] md:shadow-lg bg-white border-b md:border-b-0 md:h-screen overflow-y-auto md:overflow-y-auto">
          <SidebarNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNavigate={onNavigate}
            onRouteNavigate={onNavigate}
            onLogout={onLogout}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {renderActiveView}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        show={showReportModal}
        reportData={reportData}
        subjects={subjects}
        studentName="Estudiante"
        onClose={() => setShowReportModal(false)}
        onDownload={downloadStudentReport}
      />
    </div>
  );
};

export default SmartBoardDashboard;
