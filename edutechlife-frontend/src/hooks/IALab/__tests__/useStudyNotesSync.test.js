import { renderHook, act } from "@testing-library/react";
import { useStudyNotesSync } from "../useStudyNotesSync";

// The hook uses useSupabase (Supabase-native auth, not Clerk).
// Build a mock client whose methods return proper Promises.
function buildMockSupabase() {
  return {
    from: vi.fn(() => ({
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  };
}

const mockSupabase = { client: null };

const mockUseSupabase = vi.fn();
vi.mock("../../useSupabase", () => ({
  useSupabase: () => mockUseSupabase(),
}));

let localStorageStore = {};

beforeEach(() => {
  mockSupabase.client = buildMockSupabase();
  mockUseSupabase.mockReturnValue({
    supabase: mockSupabase.client,
    userId: "user-123",
    isLoading: false,
  });
  localStorageStore = {};

  vi.spyOn(Storage.prototype, "getItem").mockImplementation(
    (key) => localStorageStore[key] || null,
  );
  vi.spyOn(Storage.prototype, "setItem").mockImplementation((key, val) => {
    localStorageStore[key] = val;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("useStudyNotesSync", () => {
  test("returns initial state", () => {
    const { result } = renderHook(() => useStudyNotesSync());

    // isConnected = !!supabase && !!userId — both provided by the mock → true.
    expect(result.current.isConnected).toBe(true);
    expect(result.current.lastSync).toBeNull();
  });

  test("has all expected functions", () => {
    const { result } = renderHook(() => useStudyNotesSync());

    expect(result.current.syncModuleNote).toBeInstanceOf(Function);
    expect(result.current.syncDayNote).toBeInstanceOf(Function);
    expect(result.current.syncModuleNotes).toBeInstanceOf(Function);
    expect(result.current.syncDayNotes).toBeInstanceOf(Function);
  });

  test("initializes with Supabase client and reports connected", async () => {
    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isConnected).toBe(true);
  });

  test("syncModuleNote calls upsert after debounce", async () => {
    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const initialCalls = mockSupabase.client.from.mock.calls.length;

    act(() => {
      result.current.syncModuleNote("1", "my note");
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 2500));
    });

    expect(mockSupabase.client.from.mock.calls.length).toBeGreaterThan(
      initialCalls,
    );
  });

  test("syncDayNote calls upsert after debounce", async () => {
    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const initialCalls = mockSupabase.client.from.mock.calls.length;

    act(() => {
      result.current.syncDayNote("2024-01-01", "day notes");
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 2500));
    });

    expect(mockSupabase.client.from.mock.calls.length).toBeGreaterThan(
      initialCalls,
    );
  });

  test("syncModuleNotes upserts all non-empty module notes", async () => {
    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const notes = { 1: "module 1 notes", 2: "", 3: "module 3 notes" };

    await act(async () => {
      await result.current.syncModuleNotes(notes);
    });

    expect(mockSupabase.client.from).toHaveBeenCalledWith("study_notes");
    expect(result.current.lastSync).toBeTruthy();
  });

  test("syncDayNotes upserts all non-empty day notes", async () => {
    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const dayNotes = { "2024-01-01": "day 1", "2024-01-02": "" };

    await act(async () => {
      await result.current.syncDayNotes(dayNotes);
    });

    expect(mockSupabase.client.from).toHaveBeenCalledWith("study_notes");
  });

  test("updates lastSync after successful sync", async () => {
    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.lastSync).toBeNull();

    await act(async () => {
      await result.current.syncModuleNotes({ 1: "test" });
    });

    expect(result.current.lastSync).toBeInstanceOf(Date);
  });

  test("merges remote notes into localStorage on init", async () => {
    mockSupabase.client = buildMockSupabase();
    mockSupabase.client.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() =>
          Promise.resolve({
            data: [
              { note_type: "module", key: "1", content: "remote note" },
              {
                note_type: "day",
                key: "2024-01-01",
                content: "remote day note",
              },
            ],
            error: null,
          }),
        ),
      })),
    }));
    mockUseSupabase.mockReturnValue({
      supabase: mockSupabase.client,
      userId: "user-123",
      isLoading: false,
    });

    renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const storedNotes = JSON.parse(localStorageStore["ialab_notes"] || "{}");
    expect(storedNotes["1"]).toBe("remote note");

    const storedDayNotes = JSON.parse(
      localStorageStore["ialab_day_notes"] || "{}",
    );
    expect(storedDayNotes["2024-01-01"]).toBe("remote day note");
  });

  test("handles null/empty remote notes gracefully", async () => {
    mockSupabase.client = buildMockSupabase();
    mockSupabase.client.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    }));
    mockUseSupabase.mockReturnValue({
      supabase: mockSupabase.client,
      userId: "user-123",
      isLoading: false,
    });

    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isConnected).toBe(true);
  });

  test("reports disconnected when userId is null", async () => {
    mockUseSupabase.mockReturnValue({
      supabase: mockSupabase.client,
      userId: null,
      isLoading: false,
    });

    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isConnected).toBe(false);
  });

  test("reports disconnected when supabase client is null", async () => {
    mockUseSupabase.mockReturnValue({
      supabase: null,
      userId: "user-123",
      isLoading: false,
    });

    const { result } = renderHook(() => useStudyNotesSync());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isConnected).toBe(false);
  });

  test("debounce ref is cleaned up on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const { result, unmount } = renderHook(() => useStudyNotesSync());
    act(() => {
      result.current.syncModuleNote("1", "my note");
    });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
