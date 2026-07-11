import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect } from "vitest";
import VideoEmbed from "../VideoEmbed";

describe("VideoEmbed", () => {
  test("renders nothing when videoData has no url", () => {
    const { container } = render(
      <VideoEmbed videoData={null} darkMode={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when the url has no recognizable YouTube id", () => {
    const { container } = render(
      <VideoEmbed
        videoData={{ url: "https://example.com/not-youtube" }}
        darkMode={false}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("shows a thumbnail with title before the video is loaded", () => {
    render(
      <VideoEmbed
        videoData={{
          url: "https://www.youtube.com/watch?v=abcdefghijk",
          title: "Fracciones explicadas",
        }}
        darkMode={false}
      />,
    );
    expect(screen.getByText("Fracciones explicadas")).toBeInTheDocument();
    expect(
      screen.queryByTitle("Fracciones explicadas"),
    ).not.toBeInTheDocument();
  });

  test("falls back to default title text when none is provided", () => {
    render(
      <VideoEmbed
        videoData={{ url: "https://youtu.be/abcdefghijk" }}
        darkMode={false}
      />,
    );
    expect(screen.getByText("Ver video")).toBeInTheDocument();
  });

  test("loads the iframe embed after clicking the thumbnail", () => {
    render(
      <VideoEmbed
        videoData={{
          url: "https://www.youtube.com/watch?v=abcdefghijk",
          title: "Fracciones explicadas",
        }}
        darkMode={false}
      />,
    );
    fireEvent.click(screen.getByText("Fracciones explicadas"));
    const iframe = screen.getByTitle("Fracciones explicadas");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/abcdefghijk",
    );
  });

  test("extracts the video id from an embed-style url", () => {
    render(
      <VideoEmbed
        videoData={{
          url: "https://www.youtube.com/embed/abcdefghijk",
          title: "t",
        }}
        darkMode={false}
      />,
    );
    fireEvent.click(screen.getByText("t"));
    expect(screen.getByTitle("t")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/abcdefghijk",
    );
  });
});
