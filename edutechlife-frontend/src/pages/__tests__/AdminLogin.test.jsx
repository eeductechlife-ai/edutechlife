/**
 * AdminLogin Page Tests
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import AdminLogin from "../AdminLogin";

// Mock createSupabaseClient
jest.mock("../../lib/supabase", () => ({
  createSupabaseClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
    },
  })),
}));

// Mock fetch
global.fetch = jest.fn();

describe("AdminLogin Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    sessionStorage.clear();
  });

  test("renders login form with email and password fields", () => {
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>,
    );

    expect(screen.getByText("Admin Portal")).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test("submit button is disabled when fields are empty", () => {
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  test("submit button is enabled when fields are filled", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "admin@example.com");
    await user.type(passwordInput, "password123");

    expect(submitButton).not.toBeDisabled();
  });

  test("displays error message on failed login", async () => {
    const { createSupabaseClient } = require("../../lib/supabase");
    createSupabaseClient.mockReturnValue({
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { session: null },
          error: { message: "Invalid credentials" },
        }),
      },
    });

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>,
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "admin@example.com",
    );
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("clears token from sessionStorage on error", async () => {
    const { createSupabaseClient } = require("../../lib/supabase");
    createSupabaseClient.mockReturnValue({
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { session: { access_token: "token" } },
          error: null,
        }),
      },
    });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
    });

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>,
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "notadmin@example.com",
    );
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("auth_token")).toBeNull();
    });
  });
});
