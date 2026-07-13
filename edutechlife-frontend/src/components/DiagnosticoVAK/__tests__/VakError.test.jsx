import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi } from "vitest";
import VakError from "../VakError";

describe("VakError", () => {
  test("renders the error message", () => {
    render(<VakError onRestart={vi.fn()} />);
    expect(
      screen.getByText("vak.ui.error_loading_diagnosis"),
    ).toBeInTheDocument();
  });

  test("renders a restart button", () => {
    render(<VakError onRestart={vi.fn()} />);
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("vak.ui.restart_btn");
  });

  test("calls onRestart when the restart button is clicked", () => {
    const onRestart = vi.fn();
    render(<VakError onRestart={onRestart} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  test("does not throw when onRestart is not provided", () => {
    render(<VakError />);
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });
});
