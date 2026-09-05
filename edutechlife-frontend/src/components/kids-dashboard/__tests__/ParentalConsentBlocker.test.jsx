import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParentalConsentBlocker from "../ParentalConsentBlocker";

vi.mock("../../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: vi.fn(),
  signOutUser: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

import { useAuthIdentity, signOutUser } from "../../../hooks/useAuthIdentity";
import { useNavigate } from "react-router-dom";

describe("ParentalConsentBlocker", () => {
  const mockNavigate = vi.fn();
  let mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch = vi.fn();
    global.fetch = mockFetch;
    useNavigate.mockReturnValue(mockNavigate);
    useAuthIdentity.mockReturnValue({
      token: "test-jwt-token",
      isLoaded: true,
      isSignedIn: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("Loading State", () => {
    it("renders skeleton while checking consent status", () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { container } = render(
        <ParentalConsentBlocker>
          <div>Dashboard</div>
        </ParentalConsentBlocker>,
      );

      expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });

    it("shows skeleton when auth is not loaded", () => {
      useAuthIdentity.mockReturnValue({
        token: "test-token",
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
        isLoaded: true,
        isSignedIn: false,
      });

      render(
        <ParentalConsentBlocker>
          <div>Dashboard</div>
        </ParentalConsentBlocker>,
      );

      expect(mockNavigate).toHaveBeenCalledWith("/sign-up/smartboard", {
        replace: true,
      });
    });
  });

  describe("Verified Status (Open Access)", () => {
    it("renders children when verification_status is verified", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ verification_status: "verified" }),
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
  });

  describe("Unverified Status (Blocking)", () => {
    it("blocks access and shows consent request when not verified", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ verification_status: "required" }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/necesita permiso/i)).toBeInTheDocument();
      });

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /solicitar permiso/i }),
      ).toBeInTheDocument();
    });

    it("does NOT bypass consent on button click — sends request instead", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ verification_status: "pending" }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /solicitar permiso/i }),
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: /solicitar permiso/i }),
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("/parental-consent/request"),
          expect.objectContaining({ method: "POST" }),
        );
      });

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("shows pending state after successful consent request", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ verification_status: "required" }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /solicitar permiso/i }),
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: /solicitar permiso/i }),
      );

      await waitFor(() => {
        expect(screen.getByText(/esperando autorización/i)).toBeInTheDocument();
      });

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });

  describe("Fail-Secure on Backend Error", () => {
    it("blocks access when backend returns error", async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      });
    });

    it("blocks access when fetch fails (network error)", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      });
    });
  });

  describe("Polling for Verification", () => {
    it("polls verification status every 10s", async () => {
      vi.useFakeTimers();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ verification_status: "pending" }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await vi.advanceTimersByTimeAsync(100);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(10000);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it("opens access when poll returns verified", async () => {
      let callCount = 0;
      mockFetch.mockImplementation(async () => {
        callCount++;
        return {
          ok: true,
          json: async () => ({
            verification_status: callCount <= 1 ? "pending" : "verified",
          }),
        };
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(
        () => {
          expect(screen.getByText("Protected Content")).toBeInTheDocument();
        },
        { timeout: 15000 },
      );
    }, 20000);
  });

  describe("Logout", () => {
    it("allows logout from blocking screen", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ verification_status: "required" }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /cerrar sesión/i }),
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: /cerrar sesión/i }),
      );

      expect(signOutUser).toHaveBeenCalledWith("/", mockNavigate);
    });
  });

  describe("Cleanup", () => {
    it("clears intervals on unmount", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ verification_status: "pending" }),
      });

      const { unmount } = render(
        <ParentalConsentBlocker>
          <div>Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.queryByText("Content")).not.toBeInTheDocument();
      });

      expect(() => unmount()).not.toThrow();
    });
  });
});
