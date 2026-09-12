import { useIALabStore } from "../ialabStore";
// Attempt counters and their 12h cooldown are stored per account, so clearing
// the bare key leaves the previous test's cooldown in place.
import { scopedRemove } from "@/utils/userScopedStorage";

beforeEach(() => {
  useIALabStore.setState({
    xp: 100,
    streak: 3,
    badges: ["first_lesson"],
    courseProgress: 30,
    courseCompleted: false,
    activeMod: 2,
    visitedModules: [1],
    completedModules: [1],
    moduleProgress: {},
    completedExams: { 1: 85 },
    challengeScores: { 1: 90 },
    completedVideos: ["m1v1"],
    completedInfographics: [],
    completedActivities: [],
    lessonProgress: { 1: { 1: "completed", 2: "completed" } },
    syncStatus: null,
    isUsingJWT: false,
    userId: "test_user",
    userRole: "student",
    isLoadingProgress: true,
    lastActivityDate: new Date().toISOString(),
    forumPostCount: 0,
    forumCommentCount: 0,
  });
  scopedRemove("challenge_attempts_remaining_m1");
  scopedRemove("challenge_next_attempt_m1");
  scopedRemove("exam_attempts_remaining_m1");
  scopedRemove("exam_next_attempt_m1");
});

describe("persistenceSlice — syncFromPersistence", () => {
  test("merges completed exams from persistence", () => {
    const store = useIALabStore.getState();
    store.syncFromPersistence({
      completedExams: { 2: 95 },
      completedModules: [1],
      completedVideos: [],
      completedInfographics: [],
      completedActivities: [],
      challengeScores: {},
      courseProgress: 30,
      gamification: null,
      syncStatus: "synced",
      isUsingJWT: false,
      userId: "test_user",
      isLoading: false,
    });
    const state = useIALabStore.getState();
    expect(state.completedExams[1]).toBe(85);
    expect(state.completedExams[2]).toBe(95);
  });

  test("applies isLoading flag", () => {
    const store = useIALabStore.getState();
    store.syncFromPersistence({
      completedExams: {},
      completedModules: [],
      completedVideos: [],
      completedInfographics: [],
      completedActivities: [],
      challengeScores: {},
      courseProgress: 0,
      gamification: null,
      syncStatus: null,
      isUsingJWT: false,
      userId: null,
      isLoading: false,
    });
    expect(useIALabStore.getState().isLoadingProgress).toBe(false);
  });

  test("regresión 'vuelve a cero': un payload vacío/0 no degrada el avance local", () => {
    const store = useIALabStore.getState();
    store.syncFromPersistence({
      completedExams: {},
      completedModules: [],
      completedVideos: [],
      completedInfographics: [],
      completedActivities: [],
      challengeScores: {},
      completedCommunity: [],
      courseProgress: 0,
      gamification: null,
      syncStatus: null,
      isUsingJWT: false,
      userId: "test_user",
      isLoading: false,
    });
    const s = useIALabStore.getState();
    expect(s.courseProgress).toBe(30);
    expect(s.completedModules).toContain(1);
    expect(s.completedVideos).toContain("m1v1");
    expect(s.completedExams[1]).toBe(85);
    expect(s.challengeScores[1]).toBe(90);
  });

  test("adopta un remoto más nuevo y con más avance (sin perder lo local)", () => {
    const store = useIALabStore.getState();
    store.syncFromPersistence({
      completedExams: { 2: 95 },
      completedModules: [2],
      completedVideos: [],
      completedInfographics: [],
      completedActivities: [],
      challengeScores: { 1: 95 },
      courseProgress: 55,
      gamification: { lastActivityDate: new Date(Date.now() + 60000).toISOString() },
      syncStatus: "synced",
      isUsingJWT: true,
      userId: "test_user",
      isLoading: false,
    });
    const s = useIALabStore.getState();
    expect(s.courseProgress).toBe(55);
    expect(s.completedModules).toEqual(expect.arrayContaining([1, 2]));
    expect(s.challengeScores[1]).toBe(95);
    expect(s.completedExams[1]).toBe(85);
    expect(s.completedExams[2]).toBe(95);
  });

  test("merges gamification data with local state", () => {
    const store = useIALabStore.getState();
    store.syncFromPersistence({
      completedExams: {},
      completedModules: [1],
      completedVideos: [],
      completedInfographics: [],
      completedActivities: [],
      challengeScores: {},
      courseProgress: 30,
      gamification: {
        xp: 200,
        streak: 5,
        badges: ["first_lesson", "streak_3"],
        lastActivityDate: store.lastActivityDate,
        lessonProgress: {},
        checkpointAnswers: {},
        forumPostCount: 0,
        forumCommentCount: 0,
        startDate: null,
      },
      syncStatus: "synced",
      isUsingJWT: false,
      userId: "test_user",
      isLoading: false,
    });
    const state = useIALabStore.getState();
    expect(state.xp).toBe(200);
    expect(state.streak).toBe(5);
    expect(state.badges).toContain("streak_3");
  });
});

describe("persistenceSlice — bookmark CRUD", () => {
  test("addBookmarkedResource adds unique id", () => {
    const store = useIALabStore.getState();
    store.addBookmarkedResource("resource_1");
    expect(store.getBookmarkedResources()).toContain("resource_1");
  });

  test("addBookmarkedResource does not duplicate", () => {
    const store = useIALabStore.getState();
    store.addBookmarkedResource("resource_1");
    store.addBookmarkedResource("resource_1");
    const bookmarks = store.getBookmarkedResources();
    expect(bookmarks.filter((b) => b === "resource_1")).toHaveLength(1);
  });

  test("removeBookmarkedResource removes existing id", () => {
    const store = useIALabStore.getState();
    store.addBookmarkedResource("resource_1");
    store.removeBookmarkedResource("resource_1");
    expect(store.getBookmarkedResources()).not.toContain("resource_1");
  });

  test("toggleBookmark adds then removes", () => {
    const store = useIALabStore.getState();
    store.toggleBookmark("resource_2");
    expect(store.getBookmarkedResources()).toContain("resource_2");
    store.toggleBookmark("resource_2");
    expect(store.getBookmarkedResources()).not.toContain("resource_2");
  });

  test("setBookmarkedResources replaces all bookmarks", () => {
    const store = useIALabStore.getState();
    store.addBookmarkedResource("a");
    store.setBookmarkedResources(["b", "c"]);
    expect(store.getBookmarkedResources()).toEqual(["b", "c"]);
  });
});

describe("persistenceSlice — attempt limits", () => {
  test("getChallengeRemainingAttempts returns 3 initially", () => {
    expect(useIALabStore.getState().getChallengeRemainingAttempts(1)).toBe(3);
  });

  test("decrementChallengeAttempt reduces remaining attempts", () => {
    const store = useIALabStore.getState();
    const remaining = store.decrementChallengeAttempt(1);
    expect(remaining).toBe(2);
  });

  test("canAttemptChallengeRetry returns true initially", () => {
    expect(useIALabStore.getState().canAttemptChallengeRetry(1)).toBe(true);
  });

  test("getExamRemainingAttempts returns 3 initially", () => {
    expect(useIALabStore.getState().getExamRemainingAttempts(1)).toBe(3);
  });

  test("decrementExamAttempt reduces exam attempts", () => {
    const store = useIALabStore.getState();
    const remaining = store.decrementExamAttempt(1);
    expect(remaining).toBe(2);
  });

  test("canAttemptExamRetry returns true initially", () => {
    expect(useIALabStore.getState().canAttemptExamRetry(1)).toBe(true);
  });
});
