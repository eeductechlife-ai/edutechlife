import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VakPendingBanner from "../VakPendingBanner";
import { savePendingVakResult } from "../../../../utils/vakPendingResult";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_, tag) =>
          ({ children, initial, animate, ...rest }) =>
            React.createElement(tag, rest, children),
      },
    ),
  };
});

const pending = () =>
  savePendingVakResult({
    scores: { visual: 40, auditivo: 35, kinestesico: 25 },
    predominantStyle: "visual",
    secondaryStyle: "auditivo",
  });

describe("VakPendingBanner", () => {
  beforeEach(() => localStorage.clear());

  it("shows nothing when there is no pending result", () => {
    const { container } = render(
      <VakPendingBanner vakResult={null} onImport={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows nothing when the student already has an ADN", () => {
    pending();
    const { container } = render(
      <VakPendingBanner
        vakResult={{ predominantStyle: "visual" }}
        onImport={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("asks first and imports the result only when the student says it is theirs", () => {
    pending();
    const onImport = vi.fn();
    render(<VakPendingBanner vakResult={null} onImport={onImport} />);

    expect(screen.getByText(/Visual y Auditivo/)).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Sí, es mío" }));
    expect(onImport).toHaveBeenCalledTimes(1);
    expect(onImport.mock.calls[0][0]).toMatchObject({
      scores: { visual: 40, auditivo: 35, kinestesico: 25 },
      predominantStyle: "visual",
      secondaryStyle: "auditivo",
    });
    expect(localStorage.getItem("edutechlife_vak_pending")).toBeNull();
  });

  it("discards the result when it is not theirs", () => {
    pending();
    const onImport = vi.fn();
    render(<VakPendingBanner vakResult={null} onImport={onImport} />);

    fireEvent.click(screen.getByRole("button", { name: "No, lo haré yo" }));
    expect(onImport).not.toHaveBeenCalled();
    expect(localStorage.getItem("edutechlife_vak_pending")).toBeNull();
  });
});
