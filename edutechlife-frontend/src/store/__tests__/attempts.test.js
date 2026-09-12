import { useIALabStore } from "../ialabStore";

/**
 * Política de intentos (confirmada con el usuario):
 *   - 3 intentos seguidos, sin espera entre uno y otro.
 *   - Al agotar los 3 se bloquea y se recargan 3 más tras 12h.
 * Antes el cooldown se escribía en cada intento, así que el primer reintento
 * quedaba bloqueado para siempre.
 */

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

beforeEach(() => {
  localStorage.clear();
  useIALabStore.setState({ userRole: "student" });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("límite de intentos (challenge y exam)", () => {
  test("exam: 3 intentos seguidos sin espera entre ellos", () => {
    const s = useIALabStore.getState();

    expect(s.getExamRemainingAttempts(1)).toBe(3);

    expect(s.decrementExamAttempt(1)).toBe(2);
    expect(s.canAttemptExamRetry(1)).toBe(true);
    expect(s.getExamNextAttemptTime(1)).toBeNull();

    expect(s.decrementExamAttempt(1)).toBe(1);
    expect(s.canAttemptExamRetry(1)).toBe(true);
    expect(s.getExamNextAttemptTime(1)).toBeNull();
  });

  test("exam: al agotar el 3º se bloquea y se recarga a las 12h", () => {
    const s = useIALabStore.getState();
    s.decrementExamAttempt(1);
    s.decrementExamAttempt(1);
    expect(s.decrementExamAttempt(1)).toBe(0);

    expect(s.getExamRemainingAttempts(1)).toBe(0);
    expect(s.canAttemptExamRetry(1)).toBe(false);

    const next = s.getExamNextAttemptTime(1);
    expect(next).toBeGreaterThan(Date.now());
    expect(next - Date.now()).toBeLessThanOrEqual(TWELVE_HOURS);

    vi.spyOn(Date, "now").mockReturnValue(next + 1000);

    expect(s.getExamRemainingAttempts(1)).toBe(3);
    expect(s.canAttemptExamRetry(1)).toBe(true);
    expect(s.getExamNextAttemptTime(1)).toBeNull();
    expect(s.decrementExamAttempt(1)).toBe(2);
  });

  test("challenge usa el mismo motor de 3 intentos", () => {
    const s = useIALabStore.getState();

    expect(s.getChallengeRemainingAttempts(2)).toBe(3);
    expect(s.canAttemptChallengeRetry(2)).toBe(true);

    s.decrementChallengeAttempt(2);
    expect(s.getChallengeRemainingAttempts(2)).toBe(2);
    expect(s.getNextAttemptTime(2)).toBeNull();
    expect(s.canAttemptChallengeRetry(2)).toBe(true);

    s.decrementChallengeAttempt(2);
    s.decrementChallengeAttempt(2);
    expect(s.getChallengeRemainingAttempts(2)).toBe(0);
    expect(s.canAttemptChallengeRetry(2)).toBe(false);
    expect(s.getNextAttemptTime(2)).toBeGreaterThan(Date.now());
  });

  test("el cooldown se guarda por módulo", () => {
    const s = useIALabStore.getState();
    s.decrementExamAttempt(1);
    s.decrementExamAttempt(1);
    s.decrementExamAttempt(1);

    expect(s.canAttemptExamRetry(1)).toBe(false);
    expect(s.canAttemptExamRetry(2)).toBe(true);
  });

  test("admin no consume intentos", () => {
    useIALabStore.setState({ userRole: "admin" });
    const s = useIALabStore.getState();

    expect(s.getExamRemainingAttempts(1)).toBe(99);
    expect(s.decrementExamAttempt(1)).toBe(99);
    expect(s.canAttemptExamRetry(1)).toBe(true);
    expect(s.getExamNextAttemptTime(1)).toBeNull();
  });
});
