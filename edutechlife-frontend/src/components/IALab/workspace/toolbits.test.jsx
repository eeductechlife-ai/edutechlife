import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ConversationItem } from "./toolbits";

describe("ConversationItem — título del tema", () => {
  it("no trunca el título: permite verlo completo (sin 'truncate')", () => {
    render(
      <ConversationItem
        title="Los Fundamentos del Artesano: ¿Qué es la IA Generativa?"
        subtitle="20 min"
        icon="M0 0h24v24H0z"
      />,
    );
    const el = screen.getByText(
      "Los Fundamentos del Artesano: ¿Qué es la IA Generativa?",
    );
    expect(el.className).not.toContain("truncate");
  });
});
