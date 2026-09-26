import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ParentalConsentBlocker from "../ParentalConsentBlocker";

vi.mock("../../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

const mockSend = vi.fn().mockResolvedValue(undefined);
const mockChannel = vi.fn(() => ({ send: mockSend }));
vi.mock("../../../lib/supabase", () => ({
  supabase: { channel: (...args) => mockChannel(...args) },
}));

import { useAuthIdentity } from "../../../hooks/useAuthIdentity";
import { useNavigate } from "react-router-dom";

/**
 * Desde 2026-09, ParentalConsentBlocker ya no bloquea al estudiante a la
 * espera de que el padre apruebe en vivo: entra directo, se notifica al
 * padre por realtime, y la solicitud de consentimiento única (si no existe
 * aún) se dispara en segundo plano sin condicionar el acceso.
 */
describe("ParentalConsentBlocker", () => {
  const mockNavigate = vi.fn();
  let mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ verification_status: "verified" }),
    });
    global.fetch = mockFetch;
    useNavigate.mockReturnValue(mockNavigate);
    useAuthIdentity.mockReturnValue({
      token: "test-jwt-token",
      userId: "student-123",
      isLoaded: true,
      isSignedIn: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("shows skeleton while auth is not loaded", () => {
    useAuthIdentity.mockReturnValue({
      token: null,
      userId: null,
      isLoaded: false,
      isSignedIn: false,
    });

    render(
      <ParentalConsentBlocker>
        <div>Dashboard</div>
      </ParentalConsentBlocker>,
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("redirects to sign-up if not signed in", () => {
    useAuthIdentity.mockReturnValue({
      token: null,
      userId: null,
      isLoaded: true,
      isSignedIn: false,
    });

    render(
      <ParentalConsentBlocker>
        <div>Dashboard</div>
      </ParentalConsentBlocker>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/sign-up/ingenia", {
      replace: true,
    });
  });

  it("renders children immediately once signed in — never shows a blocking gate", async () => {
    render(
      <ParentalConsentBlocker>
        <div>Dashboard Content</div>
      </ParentalConsentBlocker>,
    );

    await waitFor(() => {
      expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    });

    expect(screen.queryByText(/necesita permiso/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/esperando/i)).not.toBeInTheDocument();
  });

  it("renders children immediately even when consent has never been requested", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ verification_status: "none" }),
    });

    render(
      <ParentalConsentBlocker>
        <div>Dashboard Content</div>
      </ParentalConsentBlocker>,
    );

    await waitFor(() => {
      expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    });
  });

  it("renders children immediately even when the status check fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(
      <ParentalConsentBlocker>
        <div>Dashboard Content</div>
      </ParentalConsentBlocker>,
    );

    await waitFor(() => {
      expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    });
  });

  it("notifies the parent in realtime as soon as the student enters", async () => {
    render(
      <ParentalConsentBlocker>
        <div>Dashboard Content</div>
      </ParentalConsentBlocker>,
    );

    await waitFor(() => {
      expect(mockChannel).toHaveBeenCalledWith("parent-updates-student-123");
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "broadcast",
        event: "student_session",
        payload: expect.objectContaining({
          type: "session_started",
          student_id: "student-123",
        }),
      }),
    );
  });

  it("triggers the one-time background consent request when none exists yet", async () => {
    mockFetch.mockImplementation(async (url) => {
      if (String(url).includes("/parental-consent/status")) {
        return {
          ok: true,
          json: async () => ({ verification_status: "none" }),
        };
      }
      return { ok: true, json: async () => ({}) };
    });

    render(
      <ParentalConsentBlocker>
        <div>Dashboard Content</div>
      </ParentalConsentBlocker>,
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/parental-consent/request"),
        expect.objectContaining({ method: "POST" }),
      );
    });

    // Never blocked while the background request was in flight.
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("does not re-request consent when one already exists (pending or verified)", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ verification_status: "pending" }),
    });

    render(
      <ParentalConsentBlocker>
        <div>Dashboard Content</div>
      </ParentalConsentBlocker>,
    );

    await waitFor(() => {
      expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    });

    expect(mockFetch).not.toHaveBeenCalledWith(
      expect.stringContaining("/parental-consent/request"),
      expect.anything(),
    );
  });
});
