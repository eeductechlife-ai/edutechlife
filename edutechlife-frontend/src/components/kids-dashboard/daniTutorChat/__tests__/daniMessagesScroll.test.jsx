import React, { createRef } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi } from "vitest";
import DaniChatMessages from "../components/DaniChatMessages";
import { scrollMessagesToBottom } from "../../dani/chatUtils";

const history = [
  {
    role: "assistant",
    text: "¡Hola! Soy Dani, tu tutora de estudio.",
    timestamp: new Date().toISOString(),
  },
];

const renderMessages = () => {
  const messagesEndRef = createRef();
  render(
    <DaniChatMessages
      daniChatHistory={history}
      streamingMessage={null}
      isTyping={false}
      darkMode={false}
      messagesEndRef={messagesEndRef}
    />,
  );
  return messagesEndRef;
};

describe("DaniChatMessages scroll confinement", () => {
  test("messagesEndRef lives inside the scrollable messages container", () => {
    const messagesEndRef = renderMessages();
    expect(messagesEndRef.current).not.toBeNull();
    expect(messagesEndRef.current.parentElement.className).toContain(
      "overflow-y-auto",
    );
  });

  test("scrolls only the container, never propagates via scrollIntoView", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const messagesEndRef = renderMessages();
    const container = messagesEndRef.current.parentElement;
    container.scrollTo = vi.fn();

    scrollMessagesToBottom(container);

    expect(container.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
