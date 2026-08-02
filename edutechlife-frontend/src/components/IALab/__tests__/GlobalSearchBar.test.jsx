import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import GlobalSearchBar from "../GlobalSearchBar";

const mockSetActiveMod = vi.fn();
const mockOpenResourceById = vi.fn();

const mockModules = [
  { id: 1, title: "Ingeniería de Prompts" },
  { id: 2, title: "Fundamentos de IA" },
];

vi.mock("@/utils/iconMapping", () => ({
  Icon: ({ name, className }) => null,
}));

// Este mock reproducía la forma que el componente creía leer (`accordion` con
// los recursos anidados). Esa forma no existe en el catálogo real, así que el
// mock validaba un contrato roto y ocultaba que la búsqueda nunca encontraba
// temas ni recursos. Ahora refleja las fuentes reales: los temas salen de
// `overviewData.topics` y los recursos se buscan por título de tema.
vi.mock("@/components/IALab/constants/moduleContent", () => ({
  getModuleOverviewData: (modId) =>
    modId === 1
      ? { topics: [{ title: "Introducción a la IA" }] }
      : { topics: [] },
}));

vi.mock("@/components/IALab/constants/moduleResources", () => ({
  getResourcesForTopic: (topicTitle) =>
    topicTitle === "Introducción a la IA"
      ? {
          resources: [
            { id: "r1", title: "Video Intro", type: "video" },
            { id: "r2", title: "Documento PDF", type: "document" },
          ],
        }
      : null,
}));

vi.mock("@/context/IALabContext", () => ({
  useIALabProgressContext: () => ({
    modules: mockModules,
    activeMod: 1,
    setActiveMod: mockSetActiveMod,
    openResourceById: mockOpenResourceById,
  }),
}));

describe("GlobalSearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders search input", () => {
    render(<GlobalSearchBar />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  test("search input updates on typing", () => {
    render(<GlobalSearchBar />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "ingeniería" } });
    expect(input).toHaveValue("ingeniería");
  });

  test("shows results when available", async () => {
    render(<GlobalSearchBar />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "Introducción" } });
    await waitFor(() => {
      expect(screen.getByText("Introducción a la IA")).toBeInTheDocument();
    });
  });
});
