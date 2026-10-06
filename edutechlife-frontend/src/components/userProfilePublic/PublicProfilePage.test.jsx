import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import es from "../../i18n/es.json";
import { BackToCourseButton } from "./PublicProfilePage";

const t = (k) => es[k] ?? k;

describe("PublicProfilePage — volver al curso", () => {
  it("el botón navega a /ialab aunque no haya historial (entrada por enlace directo)", () => {
    render(
      <MemoryRouter initialEntries={["/profile/abc"]}>
        <Routes>
          <Route
            path="/profile/:id"
            element={<BackToCourseButton t={t} fullWidth />}
          />
          <Route path="/ialab" element={<div>CURSO</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const btn = screen.getByRole("button", { name: "Volver al curso" });
    // Área táctil mínima de 44px en móvil.
    expect(btn.className).toContain("min-h-[44px]");
    fireEvent.click(btn);
    expect(screen.getByText("CURSO")).toBeInTheDocument();
  });

  it("las claves de i18n usadas existen (antes se veía 'common.back' crudo)", () => {
    for (const k of [
      "profile.back_to_course",
      "common.back",
      "common.user_not_found",
    ]) {
      expect(es[k]).toBeTruthy();
    }
  });
});
