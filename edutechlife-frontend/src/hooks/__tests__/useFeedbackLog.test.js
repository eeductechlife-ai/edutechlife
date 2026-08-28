import { describe, it, expect, vi } from "vitest";

const mockInsert = vi.fn().mockResolvedValue({ error: null });
vi.mock("../../lib/supabase", () => ({
  supabase: {
    from: () => ({ insert: mockInsert }),
  },
}));
vi.mock("../../context/SmartBoardKidsContext", () => ({
  useSmartBoardKids: () => ({
    supabaseQueries: { studentData: { data: { id: "student-123" } } },
  }),
}));

describe("useFeedbackLog", () => {
  it("calls supabase insert with correct shape", async () => {
    const { renderHook } = await import("@testing-library/react");
    const { useFeedbackLog } = await import("../useFeedbackLog");
    const { result } = renderHook(() => useFeedbackLog());

    await result.current.logFeedback({
      activity: "oral_exam",
      emotion: "happy",
      score: 85,
      context: { subject: "math" },
    });

    expect(mockInsert).toHaveBeenCalledWith({
      student_id: "student-123",
      activity: "oral_exam",
      emotion: "happy",
      score: 85,
      context: { subject: "math" },
    });
  });

  it("handles null score gracefully", async () => {
    const { renderHook } = await import("@testing-library/react");
    const { useFeedbackLog } = await import("../useFeedbackLog");
    const { result } = renderHook(() => useFeedbackLog());

    await result.current.logFeedback({
      activity: "flashcard",
      emotion: "neutral",
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        activity: "flashcard",
        emotion: "neutral",
        score: null,
      }),
    );
  });
});
