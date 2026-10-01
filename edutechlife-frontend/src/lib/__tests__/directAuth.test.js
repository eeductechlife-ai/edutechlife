import { describe, it, expect, vi, beforeEach } from "vitest";

const auth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(() => Promise.resolve({})),
};
const maybeSingle = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth,
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }),
  }),
}));

const { isBackendUnavailable, directSignUp, directSignIn } = await import(
  "../directAuth"
);

const res = (status, type = "application/json") => ({
  status,
  headers: { get: () => type },
});
const session = { access_token: "at", refresh_token: "rt" };

beforeEach(() => vi.clearAllMocks());

describe("isBackendUnavailable", () => {
  it("detecta backend caído", () => {
    expect(isBackendUnavailable(null)).toBe(true);
    expect(isBackendUnavailable(res(503, "text/html"))).toBe(true);
    expect(isBackendUnavailable(res(502))).toBe(true);
  });
  it("respeta respuestas JSON del backend", () => {
    expect(isBackendUnavailable(res(200))).toBe(false);
    expect(isBackendUnavailable(res(409))).toBe(false);
  });
});

describe("directSignUp", () => {
  it("crea la cuenta con los metadatos del producto", async () => {
    auth.signUp.mockResolvedValue({
      data: { session, user: { id: "u1", email: "a@b.co", identities: [{}] } },
      error: null,
    });
    const r = await directSignUp({
      email: "a@b.co",
      password: "x".repeat(10),
      username: "ana",
      firstName: "Ana",
      lastName: "B",
      accountType: "ialab",
    });
    expect(r.token).toBe("at");
    const meta = auth.signUp.mock.calls[0][0].options.data;
    expect(meta).toMatchObject({
      account_type: "ialab",
      registration_source: "ialab_signup",
    });
  });
  it("marca correo duplicado", async () => {
    auth.signUp.mockResolvedValue({
      data: { session: null, user: { id: "u1", identities: [] } },
      error: null,
    });
    await expect(
      directSignUp({ email: "a@b.co", password: "x".repeat(10) }),
    ).rejects.toMatchObject({ code: "email_already_registered" });
  });
});

describe("directSignIn", () => {
  it("rechaza usernames (requieren backend)", async () => {
    await expect(directSignIn("ana", "pw")).rejects.toMatchObject({
      code: "username_requires_backend",
    });
  });
  it("entrega sesión a estudiantes", async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { session, user: { id: "u1", email: "a@b.co" } },
      error: null,
    });
    maybeSingle.mockResolvedValue({
      data: { user_type: "student", mfa_enabled: false },
      error: null,
    });
    const r = await directSignIn("A@b.co", "pw");
    expect(r.token).toBe("at");
  });
  it("no omite el MFA de cuentas protegidas", async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { session, user: { id: "u1" } },
      error: null,
    });
    maybeSingle.mockResolvedValue({
      data: { user_type: "admin", mfa_enabled: true },
      error: null,
    });
    await expect(directSignIn("a@b.co", "pw")).rejects.toMatchObject({
      code: "mfa_requires_backend",
    });
    expect(auth.signOut).toHaveBeenCalled();
  });
  it("falla cerrado si no puede leer el perfil", async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { session, user: { id: "u1" } },
      error: null,
    });
    maybeSingle.mockResolvedValue({ data: null, error: { message: "x" } });
    await expect(directSignIn("a@b.co", "pw")).rejects.toMatchObject({
      code: "mfa_requires_backend",
    });
  });
  it("credenciales inválidas", async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: {},
      error: { message: "Invalid login credentials" },
    });
    await expect(directSignIn("a@b.co", "pw")).rejects.toMatchObject({
      code: "invalid_credentials",
    });
  });
});
