import { render, screen } from "@testing-library/react";
import ToolWorkspace from "../workspace/ToolWorkspace";

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es", setLocale: vi.fn() }),
}));

vi.mock("../../IALabModuleHeader", () => ({
  TOOL_LOGOS: {
    chatgpt: () => <svg data-testid="logo-chatgpt" aria-hidden="true" />,
    gemini: () => <svg data-testid="logo-gemini" aria-hidden="true" />,
    notebooklm: () => <svg data-testid="logo-notebooklm" aria-hidden="true" />,
  },
  __esModule: true,
}));

const defaultProps = {
  theme: "chatgpt",
  activeMod: 2,
  viewSection: null,
  onNewChat: vi.fn(),
  onSelectTopic: vi.fn(),
};

describe("ToolWorkspace", () => {
  test("tema desconocido: renderiza hijos sin wrapper", () => {
    const { container } = render(
      <ToolWorkspace {...defaultProps} theme="default">
        <p>contenido</p>
      </ToolWorkspace>,
    );
    expect(
      container.querySelector('[data-testid^="tool-workspace"]'),
    ).toBeNull();
    expect(screen.getByText("contenido")).toBeInTheDocument();
  });

  test("contenido del módulo se monta dentro del workspace completo", () => {
    render(
      <ToolWorkspace {...defaultProps}>
        <p>sección de temas</p>
      </ToolWorkspace>,
    );
    expect(screen.getByTestId("tool-workspace-chatgpt")).toBeInTheDocument();
    expect(screen.getByTestId("tool-workspace-rail")).toBeInTheDocument();
    expect(screen.getByTestId("tool-workspace-composer")).toBeInTheDocument();
    expect(screen.getByText("sección de temas")).toBeInTheDocument();
  });

  test("composer es decorativo: input readOnly y enviar deshabilitado", () => {
    render(
      <ToolWorkspace {...defaultProps}>
        <p>x</p>
      </ToolWorkspace>,
    );
    const input = screen.getByLabelText("ialab.workspace.composer_label");
    expect(input).toHaveAttribute("readonly");
    const send = screen.getByRole("button", {
      name: "ialab.workspace.composer_send",
    });
    expect(send).toBeDisabled();
  });

  test("el rail muestra tópicos reales del módulo 2", () => {
    render(
      <ToolWorkspace {...defaultProps} viewSection="contenido">
        <p>x</p>
      </ToolWorkspace>,
    );
    expect(
      screen.getByTestId("tool-workspace-topics").children.length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("ialab.workspace.topics_label"),
    ).toBeInTheDocument();
  });

  test("clic en topic navega a contenido", () => {
    render(
      <ToolWorkspace {...defaultProps}>
        <p>x</p>
      </ToolWorkspace>,
    );
    const firstTopic = screen
      .getByTestId("tool-workspace-topics")
      .querySelector("button");
    firstTopic.click();
    expect(defaultProps.onSelectTopic).toHaveBeenCalled();
  });

  test("nuevo chat restablece la vista", () => {
    render(
      <ToolWorkspace {...defaultProps}>
        <p>x</p>
      </ToolWorkspace>,
    );
    const [newChatBtn] = screen.getAllByRole("button", {
      name: "ialab.workspace.chatgpt.new_chat",
    });
    newChatBtn.click();
    expect(defaultProps.onNewChat).toHaveBeenCalled();
  });
});
