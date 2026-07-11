import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect } from "vitest";
import MessageBubble from "../MessageBubble";

const baseMessage = {
  text: "Hola, necesito ayuda con matemáticas",
  timestamp: new Date().toISOString(),
};

describe("MessageBubble", () => {
  test("renders the message text", () => {
    render(
      <MessageBubble message={baseMessage} isDani={false} darkMode={false} />,
    );
    expect(screen.getByText(baseMessage.text)).toBeInTheDocument();
  });

  test("shows Dani avatar when message is from Dani", () => {
    render(
      <MessageBubble message={baseMessage} isDani={true} darkMode={false} />,
    );
    expect(screen.getByAltText("Dani")).toBeInTheDocument();
  });

  test("does not show avatar when message is from the student", () => {
    render(
      <MessageBubble message={baseMessage} isDani={false} darkMode={false} />,
    );
    expect(screen.queryByAltText("Dani")).not.toBeInTheDocument();
  });

  test('renders "ahora" as relative time for a just-sent message', () => {
    render(
      <MessageBubble message={baseMessage} isDani={false} darkMode={false} />,
    );
    expect(screen.getByText("ahora")).toBeInTheDocument();
  });

  test("preserves line breaks via whitespace-pre-wrap styling", () => {
    render(
      <MessageBubble
        message={{ ...baseMessage, text: "linea1\nlinea2" }}
        isDani={false}
        darkMode={false}
      />,
    );
    expect(screen.getByText(/linea1/).className).toContain(
      "whitespace-pre-wrap",
    );
  });
});
