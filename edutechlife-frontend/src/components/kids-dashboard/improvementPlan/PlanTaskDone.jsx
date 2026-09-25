import { useEffect, useState } from "react";
import { useIngenIAKidsSafe } from "../../../context/IngenIAKidsContext";
import { takePendingPlanTask } from "../practicarHub/practicarHandoff";
import { markStoredActivityDone } from "./useImprovementPlan";

/** When a Retos / EduCards session opened from "Mi Plan" ends, tick that task. */
export function usePlanTaskOnFinish(tool, finished) {
  const userId = useIngenIAKidsSafe()?.userId;
  const [task, setTask] = useState(null);
  useEffect(() => {
    if (!finished) return;
    const pending = takePendingPlanTask(tool);
    if (!pending) return;
    const { week, act } = pending.planRef;
    if (markStoredActivityDone(userId, week, act)) setTask(pending);
  }, [finished, tool, userId]);
  return task;
}

export function PlanTaskDoneBanner({ task, onTabChange }) {
  if (!task) return null;
  return (
    <div
      role="status"
      className="rounded-2xl border-2 border-green-300 bg-green-50 p-3 flex items-center gap-3"
    >
      <span className="text-2xl" aria-hidden="true">
        📋
      </span>
      <p className="!m-0 flex-1 min-w-0 text-sm font-bold text-green-800 leading-snug">
        ¡Tarea de tu plan completada! ✅
      </p>
      {onTabChange && (
        <button
          type="button"
          onClick={() => onTabChange("plan")}
          className="shrink-0 min-h-[40px] px-3 rounded-xl text-xs font-black text-white bg-green-500"
        >
          Ver mi plan →
        </button>
      )}
    </div>
  );
}
