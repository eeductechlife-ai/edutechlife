import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import SidebarToggleCue from "./SidebarToggleCue";

describe("SidebarToggleCue", () => {
  it("renderiza un aviso decorativo con ping y soporte de reduced-motion", () => {
    const { container } = render(<SidebarToggleCue size="expanded" />);
    const root = screen.getByTestId("sidebar-toggle-cue");
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".animate-ping")).toBeInTheDocument();
    expect(
      container.querySelector(".motion-reduce\\:animate-none"),
    ).toBeInTheDocument();
  });

  it("no intercepta clics (pointer-events-none)", () => {
    const { container } = render(<SidebarToggleCue size="collapsed" />);
    expect(container.querySelector(".pointer-events-none")).toBeInTheDocument();
  });

  it("acepta variante de tamaño sin romper", () => {
    render(<SidebarToggleCue size="collapsed" />);
    expect(screen.getByTestId("sidebar-toggle-cue")).toBeInTheDocument();
  });
});
