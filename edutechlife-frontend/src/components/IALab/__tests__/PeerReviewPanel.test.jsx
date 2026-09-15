import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

const state = { enabled: false, assignments: [], loading: false, submitReview: vi.fn() };
vi.mock("../../../hooks/IALab/usePeerReview", () => ({
  default: () => state,
}));
vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k }),
}));
vi.mock("../../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => React.createElement("span", { "data-icon": name }),
}));

import PeerReviewPanel from "../PeerReviewPanel";

beforeEach(() => {
  state.enabled = false;
  state.assignments = [];
  state.loading = false;
});

describe("PeerReviewPanel (Fase B — flag)", () => {
  it("no renderiza nada si el flag está apagado", () => {
    const { container } = render(<PeerReviewPanel userId="u1" moduleId={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("con el flag encendido y sin asignaciones muestra el estado vacío", () => {
    state.enabled = true;
    render(<PeerReviewPanel userId="u1" moduleId={1} />);
    expect(screen.getByTestId("peer-review-panel")).toBeInTheDocument();
    expect(screen.getByText("peer_review.empty")).toBeInTheDocument();
  });

  it("con asignaciones muestra la acción de revisar", () => {
    state.enabled = true;
    state.assignments = [{ id: "a1", module_id: 2, status: "pending" }];
    render(<PeerReviewPanel userId="u1" moduleId={2} />);
    expect(screen.getByText("peer_review.review")).toBeInTheDocument();
  });
});
