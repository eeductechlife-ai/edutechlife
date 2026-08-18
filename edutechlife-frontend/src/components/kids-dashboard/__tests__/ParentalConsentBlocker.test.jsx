import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParentalConsentBlocker } from "../ParentalConsentBlocker";

// Mock hooks
vi.mock("../../../hooks/useAuthIdentity", () => ({
  useAuthIdentity: vi.fn(),
  signOutUser: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

import { useAuthIdentity, signOutUser } from "../../../hooks/useAuthIdentity";
import { useNavigate } from "react-router-dom";

/**
 * ParentalConsentBlocker Test Suite
 *
 * CRITICAL: This component gates access to SmartBoard for minors.
 * 100% coverage required — unauthorized access to children's data is a security violation.
 *
 * States:
 *   loading   → skeleton (Supabase check in progress)
 *   open      → render children (verified, adult, or no age recorded)
 *   pending   → "waiting for parent" message + 24h countdown
 *   required  → parental consent request modal
 */
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
    it("renders skeleton while checking parental consent status", () => {
      // Simulate loading state: fetch hangs
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <ParentalConsentBlocker>
          <div>Dashboard</div>
        </ParentalConsentBlocker>,
      );

      expect(
        screen.getByText(/smart board/i, { exact: false }),
      ).toBeInTheDocument();
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

      // Should not render children while auth is loading
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });

    it("returns early if not signed in", () => {
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

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Verified Status (Open Access)", () => {
    it("renders children when verification_status is verified", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "verified",
          student_age: 14,
        }),
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

    it("renders children for adults (age >= 18)", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 25,
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Adult Dashboard</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText("Adult Dashboard")).toBeInTheDocument();
      });
    });

    it("renders children when age is not recorded (fallback to adult)", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "required",
          student_age: null,
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Default Dashboard</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText("Default Dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Minor Protection (age < 18)", () => {
    it("blocks unverified minors and shows consent request modal", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "required",
          student_age: 14,
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/parental consent/i)).toBeInTheDocument();
      });

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("shows pending state with countdown when verification is pending", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 14,
          pending_email: "parent@example.com",
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/esperando/i)).toBeInTheDocument();
      });

      // Should show countdown timer
      expect(screen.getByText(/h \d+m \d+s/)).toBeInTheDocument();
    });
  });

  describe("Fail-Secure on Backend Error", () => {
    it("blocks access when backend returns 500 error", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

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

    it("logs security warning on backend failure", async () => {
      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error("Network error"));

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(consoleWarn).toHaveBeenCalledWith(
          expect.stringContaining("Backend error - blocking access"),
        );
      });

      consoleWarn.mockRestore();
    });
  });

  describe("Polling for Verification", () => {
    it("polls verification status every 10s when pending", async () => {
      vi.useFakeTimers();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 14,
          pending_email: "parent@example.com",
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/esperando/i)).toBeInTheDocument();
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Advance 10 seconds
      vi.advanceTimersByTime(10000);

      // Should poll again
      expect(mockFetch).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it("stops polling and opens access when verification completes", async () => {
      vi.useFakeTimers();

      // Start pending
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 14,
          pending_email: "parent@example.com",
        }),
      });

      const { rerender } = render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/esperando/i)).toBeInTheDocument();
      });

      // Parent verifies — update mock response
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "verified",
          student_age: 14,
        }),
      });

      // Advance 10s for poll
      vi.advanceTimersByTime(10000);

      // Now content should be visible
      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe("Consent Request Flow", () => {
    it("submits parent email when requesting consent", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "required",
          student_age: 14,
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/parental consent/i)).toBeInTheDocument();
      });

      // Find and fill email input
      const emailInput = screen.getByPlaceholderText(/email/i);
      await userEvent.type(emailInput, "parent@example.com");

      // Submit
      const submitButton = screen.getByRole("button", {
        name: /enviar|submit/i,
      });
      await userEvent.click(submitButton);

      // Should POST to consent endpoint
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("/parental-consent"),
          expect.objectContaining({
            method: "POST",
            body: expect.stringContaining("parent@example.com"),
          }),
        );
      });
    });

    it("transitions to pending state after consent request", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "required",
          student_age: 14,
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/parental consent/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByPlaceholderText(/email/i);
      await userEvent.type(emailInput, "parent@example.com");

      // Update mock to return pending after POST
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 14,
        }),
      });

      const submitButton = screen.getByRole("button", {
        name: /enviar|submit/i,
      });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/esperando/i)).toBeInTheDocument();
      });
    });

    it("allows resending consent email", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 14,
          pending_email: "parent@example.com",
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/esperando/i)).toBeInTheDocument();
      });

      const resendButton = screen.getByRole("button", { name: /reenviar/i });
      await userEvent.click(resendButton);

      // Should POST again
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("/parental-consent"),
          expect.objectContaining({ method: "POST" }),
        );
      });
    });
  });

  describe("Logout Functionality", () => {
    it("allows logout from consent blocking screen", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "required",
          student_age: 14,
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/parental consent/i)).toBeInTheDocument();
      });

      const logoutButton = screen.getByRole("button", {
        name: /cerrar sesión|logout|sign out/i,
      });
      await userEvent.click(logoutButton);

      await waitFor(() => {
        expect(signOutUser).toHaveBeenCalledWith("/", mockNavigate);
      });
    });
  });

  describe("24-Hour Countdown", () => {
    it("shows countdown timer in pending state", async () => {
      vi.useFakeTimers();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 14,
          pending_email: "parent@example.com",
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/esperando/i)).toBeInTheDocument();
      });

      // Should show 24h countdown
      expect(screen.getByText(/24h 0m 0s/)).toBeInTheDocument();

      vi.useRealTimers();
    });

    it("decrements countdown every second", async () => {
      vi.useFakeTimers();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 14,
          pending_email: "parent@example.com",
        }),
      });

      render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/24h 0m 0s/)).toBeInTheDocument();
      });

      // Advance 60 seconds
      vi.advanceTimersByTime(60000);

      // Should show 23h 59m 0s
      await waitFor(() => {
        expect(screen.getByText(/23h 59m 0s/)).toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe("Cleanup", () => {
    it("clears intervals on unmount", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          verification_status: "pending",
          student_age: 14,
          pending_email: "parent@example.com",
        }),
      });

      const { unmount } = render(
        <ParentalConsentBlocker>
          <div>Protected Content</div>
        </ParentalConsentBlocker>,
      );

      await waitFor(() => {
        expect(screen.getByText(/esperando/i)).toBeInTheDocument();
      });

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });
  });
});
