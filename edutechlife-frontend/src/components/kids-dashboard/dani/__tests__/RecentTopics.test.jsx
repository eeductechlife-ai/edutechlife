import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi } from "vitest";
import RecentTopics from "../RecentTopics";

describe("RecentTopics", () => {
  test("renders nothing when there are no topics", () => {
    const { container } = render(
      <RecentTopics topics={[]} onTopicClick={vi.fn()} darkMode={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when topics is null/undefined", () => {
    const { container } = render(
      <RecentTopics topics={null} onTopicClick={vi.fn()} darkMode={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders a chip per topic with its icon and label", () => {
    const topics = [
      { topic: "Matemáticas", icon: "📐", count: 3 },
      { topic: "Historia", icon: "🌍", count: 1 },
    ];
    render(
      <RecentTopics topics={topics} onTopicClick={vi.fn()} darkMode={false} />,
    );
    expect(screen.getByText(/📐 Matemáticas/)).toBeInTheDocument();
    expect(screen.getByText(/🌍 Historia/)).toBeInTheDocument();
  });

  test("falls back to a pin icon when a topic has none", () => {
    const topics = [{ topic: "Arte", count: 1 }];
    render(
      <RecentTopics topics={topics} onTopicClick={vi.fn()} darkMode={false} />,
    );
    expect(screen.getByText(/📌 Arte/)).toBeInTheDocument();
  });

  test("shows only the last 5 topics when more are provided", () => {
    const topics = Array.from({ length: 7 }, (_, i) => ({
      topic: `Tema${i}`,
      icon: "📌",
      count: 1,
    }));
    render(
      <RecentTopics topics={topics} onTopicClick={vi.fn()} darkMode={false} />,
    );
    expect(screen.queryByText(/Tema0/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tema1/)).not.toBeInTheDocument();
    expect(screen.getByText(/Tema2/)).toBeInTheDocument();
    expect(screen.getByText(/Tema6/)).toBeInTheDocument();
  });

  test("calls onTopicClick with the topic name when a chip is clicked", () => {
    const onTopicClick = vi.fn();
    const topics = [{ topic: "Matemáticas", icon: "📐", count: 2 }];
    render(
      <RecentTopics
        topics={topics}
        onTopicClick={onTopicClick}
        darkMode={false}
      />,
    );
    fireEvent.click(screen.getByText(/📐 Matemáticas/));
    expect(onTopicClick).toHaveBeenCalledWith("Matemáticas");
  });
});
