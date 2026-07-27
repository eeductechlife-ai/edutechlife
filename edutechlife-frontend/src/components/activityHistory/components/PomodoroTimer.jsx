import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useIALabStore } from "../../../store/ialabStore";
import { useTranslation } from "../../../i18n/I18nProvider";

const POMODORO_FOCUS = 25 * 60;
const POMODORO_SHORT_BREAK = 5 * 60;
const POMODORO_LONG_BREAK = 15 * 60;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PomodoroTimer() {
  const { t } = useTranslation();
  const addXp = useIALabStore((s) => s.addXp);

  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(POMODORO_FOCUS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("ialab_pomodoro_sessions") || "[]",
      );
      const today = new Date().toDateString();
      return stored.filter((s) => s.date === today).length;
    } catch {
      return 0;
    }
  });
  const [focusMinutesToday, setFocusMinutesToday] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("ialab_pomodoro_sessions") || "[]",
      );
      const today = new Date().toDateString();
      return stored
        .filter((s) => s.date === today)
        .reduce((sum, s) => sum + s.minutes, 0);
    } catch {
      return 0;
    }
  });
  const [xpToday, setXpToday] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("ialab_pomodoro_xp") || "0",
      );
      return typeof stored === "number" ? stored : 0;
    } catch {
      return 0;
    }
  });

  const intervalRef = useRef(null);

  const getDuration = useCallback(() => {
    switch (mode) {
      case "focus":
        return POMODORO_FOCUS;
      case "shortBreak":
        return POMODORO_SHORT_BREAK;
      case "longBreak":
        return POMODORO_LONG_BREAK;
      default:
        return POMODORO_FOCUS;
    }
  }, [mode]);

  useEffect(() => {
    setTimeLeft(getDuration());
  }, [getDuration]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (mode === "focus") {
              const minutes = Math.round((POMODORO_FOCUS - prev) / 60);
              const today = new Date().toDateString();
              try {
                const stored = JSON.parse(
                  localStorage.getItem("ialab_pomodoro_sessions") || "[]",
                );
                stored.push({ date: today, minutes: 25 });
                localStorage.setItem(
                  "ialab_pomodoro_sessions",
                  JSON.stringify(stored),
                );
                const todaySessions = stored.filter((s) => s.date === today);
                setSessionsToday(todaySessions.length);
                setFocusMinutesToday(
                  todaySessions.reduce((sum, s) => sum + s.minutes, 0),
                );
              } catch {}
              addXp(5);
              try {
                const stored = JSON.parse(
                  localStorage.getItem("ialab_pomodoro_xp") || "0",
                );
                localStorage.setItem(
                  "ialab_pomodoro_xp",
                  JSON.stringify(stored + 5),
                );
                setXpToday((prev) => prev + 5);
              } catch {}
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, addXp]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getDuration());
  };

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
  };

  const progress = 1 - timeLeft / getDuration();

  const modes = [
    { key: "focus", label: t("pomodoro.focus"), duration: 25 },
    { key: "shortBreak", label: t("pomodoro.short_break"), duration: 5 },
    { key: "longBreak", label: t("pomodoro.long_break"), duration: 15 },
  ];

  return (
    <div className="flex flex-col items-center py-4">
      <div className="w-full max-w-xs mx-auto">
        <div className="flex bg-slate-100 rounded-lg p-0.5 mb-6">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => handleModeChange(m.key)}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                mode === m.key
                  ? "bg-white text-petroleum shadow-sm"
                  : "text-slate-500 hover:text-petroleum"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#pomodoroGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient
                id="pomodoroGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#004B63" />
                <stop offset="100%" stopColor="#00BCD4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-petroleum">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={timeLeft === 0}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-semibold hover:shadow-lg hover:shadow-petroleum/20 transition-all disabled:opacity-50"
            >
              <Icon name="fa-play" className="mr-2" />
              {t("pomodoro.start")}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-all"
            >
              <Icon name="fa-pause" className="mr-2" />
              {t("pomodoro.pause")}
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-all"
          >
            <Icon name="fa-rotate" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-petroleum/5">
            <p className="text-lg font-bold text-petroleum">{sessionsToday}</p>
            <p className="text-[10px] text-petroleum/60">
              {t("pomodoro.sessions")}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-petroleum/5">
            <p className="text-lg font-bold text-petroleum">
              {focusMinutesToday}
            </p>
            <p className="text-[10px] text-petroleum/60">
              {t("pomodoro.minutes_focused")}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-petroleum/5">
            <p className="text-lg font-bold text-corporate">{xpToday}</p>
            <p className="text-[10px] text-petroleum/60">
              {t("pomodoro.xp_earned")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer;
