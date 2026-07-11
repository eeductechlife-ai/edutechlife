import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi } from "vitest";
import QuickActions from "../QuickActions";

describe("QuickActions", () => {
  test("renders all six quick action buttons", () => {
    render(<QuickActions onAction={vi.fn()} darkMode={false} />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  test("renders expected labels", () => {
    render(<QuickActions onAction={vi.fn()} darkMode={false} />);
    expect(screen.getByText("Ayuda con tarea")).toBeInTheDocument();
    expect(screen.getByText("Dime algo motivador")).toBeInTheDocument();
    expect(screen.getByText("Mi estilo VAK")).toBeInTheDocument();
    expect(screen.getByText("Qué debo hacer hoy")).toBeInTheDocument();
    expect(screen.getByText("Explícame un tema")).toBeInTheDocument();
    expect(screen.getByText("Apoyo emocional")).toBeInTheDocument();
  });

  test("calls onAction with the action value when a button is clicked", () => {
    const onAction = vi.fn();
    render(<QuickActions onAction={onAction} darkMode={false} />);
    fireEvent.click(screen.getByText("Ayuda con tarea"));
    expect(onAction).toHaveBeenCalledWith("ayuda_tarea");
  });

  test("calls onAction with the correct value for each button", () => {
    const onAction = vi.fn();
    render(<QuickActions onAction={onAction} darkMode={false} />);
    fireEvent.click(screen.getByText("Mi estilo VAK"));
    expect(onAction).toHaveBeenCalledWith("vak_estrategias");
  });
});
