import { retryAsync } from "../retryAsync";

afterEach(() => {
  vi.useRealTimers();
});

describe("retryAsync", () => {
  test("no reintenta si el primer intento funciona", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    await expect(retryAsync(fn)).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("reintenta una vez y resuelve si el segundo intento funciona", async () => {
    vi.useFakeTimers();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("transient"))
      .mockResolvedValueOnce("ok");

    const promise = retryAsync(fn, { retries: 1, delayMs: 10 });
    await vi.advanceTimersByTimeAsync(20);

    await expect(promise).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("propaga el error tras agotar los reintentos", async () => {
    vi.useFakeTimers();
    const fn = vi.fn().mockRejectedValue(new Error("down"));

    const promise = retryAsync(fn, { retries: 1, delayMs: 10 });
    const assertion = expect(promise).rejects.toThrow("down");
    await vi.advanceTimersByTimeAsync(20);
    await assertion;

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
