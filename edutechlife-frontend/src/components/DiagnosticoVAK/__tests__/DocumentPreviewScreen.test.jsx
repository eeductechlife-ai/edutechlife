import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DocumentPreviewScreen from "../screens/DocumentPreviewScreen";

// Mock all heavy sub-section components to reduce per-fork heap usage.
// Without these mocks the module graph loads 9+ sections + vakStyles + vakIcons
// and exhausts the 4 GB GitHub Actions heap limit.
vi.mock("../screens/documentSections/HeaderSection", () => ({
  default: () => <div data-testid="header-section" />,
}));
vi.mock("../screens/documentSections/StudentInfoSection", () => ({
  default: () => <div data-testid="student-info-section" />,
}));
vi.mock("../screens/documentSections/GuardianSection", () => ({
  default: () => <div data-testid="guardian-section" />,
}));
vi.mock("../screens/documentSections/ResultHeroSection", () => ({
  default: () => <div data-testid="result-hero-section" />,
}));
vi.mock("../screens/documentSections/CharacteristicsSection", () => ({
  default: () => <div data-testid="characteristics-section" />,
}));
vi.mock("../screens/documentSections/CareersSection", () => ({
  default: () => <div data-testid="careers-section" />,
}));
vi.mock("../screens/documentSections/ParentTipsSection", () => ({
  default: () => <div data-testid="parent-tips-section" />,
}));
vi.mock("../screens/documentSections/ValentinaCommentarySection", () => ({
  default: () => <div data-testid="valentina-section" />,
}));
vi.mock("../screens/documentSections/QRSection", () => ({
  default: () => <div data-testid="qr-section" />,
}));
vi.mock("../screens/documentSections/FooterSection", () => ({
  default: () => <div data-testid="footer-section" />,
}));
vi.mock("../screens/documentActions", () => ({
  default: ({ onBack, generatePDF, pdfLoading }) => (
    <div data-testid="document-actions">
      <button onClick={onBack}>vak.ui.back_to_results</button>
      <button onClick={generatePDF} disabled={pdfLoading}>
        vak.ui.download_pdf_btn
      </button>
    </div>
  ),
}));
vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k }),
}));
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children, ...rest }) => <div {...rest}>{children}</div>,
    },
  ),
  AnimatePresence: ({ children }) => children,
}));

const DummyIcon = (props) => <svg data-testid="style-icon" {...props} />;

const baseDiagnosis = {
  studentName: "Ana Pérez",
  studentAge: "12",
  studentEmail: "ana@example.com",
  studentMood: "feliz",
  parentName: "Carlos Pérez",
  parentPhone: "3001234567",
  parentEmail: "carlos@example.com",
  date: "2026-07-14",
  percentage: 80,
  predominantStyle: "visual",
  counts: { visual: 8, auditivo: 1, kinestesico: 1 },
  styleDetails: {
    icon: "Eye",
    name: "Visual",
    description: "Aprende mejor viendo.",
    strategies: ["Usa mapas mentales", "Subraya con colores"],
    tip: "Convierte apuntes en diagramas.",
  },
};

const baseProps = {
  diagnosis: baseDiagnosis,
  studentName: "Ana Pérez",
  studentAge: "12",
  studentEmail: "ana@example.com",
  studentMood: "feliz",
  parentName: "Carlos Pérez",
  parentPhone: "3001234567",
  parentEmail: "carlos@example.com",
  generatePDF: vi.fn(),
  pdfLoading: false,
  onBack: vi.fn(),
  getIconComponent: () => DummyIcon,
};

describe("DocumentPreviewScreen", () => {
  it("renders a safe fallback when there is no diagnosis", () => {
    render(<DocumentPreviewScreen {...baseProps} diagnosis={null} />);
    expect(screen.getByText("vak.ui.no_diagnosis_display")).toBeInTheDocument();
  });

  it("renders the student's data when a diagnosis is provided", () => {
    render(<DocumentPreviewScreen {...baseProps} />);
    // With mocked sections the component still renders the actions area.
    expect(screen.getByTestId("document-actions")).toBeInTheDocument();
  });

  it("calls onBack when the back control is triggered", () => {
    const onBack = vi.fn();
    render(<DocumentPreviewScreen {...baseProps} onBack={onBack} />);
    fireEvent.click(screen.getByText("vak.ui.back_to_results"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls generatePDF when the download control is triggered", () => {
    const generatePDF = vi.fn();
    render(<DocumentPreviewScreen {...baseProps} generatePDF={generatePDF} />);
    fireEvent.click(screen.getByText("vak.ui.download_pdf_btn"));
    expect(generatePDF).toHaveBeenCalledTimes(1);
  });
});
