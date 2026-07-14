import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DocumentPreviewScreen from "../screens/DocumentPreviewScreen";

const DummyIcon = (props) => <svg data-testid="style-icon" {...props} />;
const getIconComponent = () => DummyIcon;

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
  getIconComponent,
};

describe("DocumentPreviewScreen", () => {
  it("renders a safe fallback when there is no diagnosis", () => {
    render(<DocumentPreviewScreen {...baseProps} diagnosis={null} />);
    expect(
      screen.getByText("vak.ui.no_diagnosis_display"),
    ).toBeInTheDocument();
  });

  it("renders the student's data when a diagnosis is provided", () => {
    render(<DocumentPreviewScreen {...baseProps} />);
    expect(screen.getAllByText("Ana Pérez").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("style-icon").length).toBeGreaterThan(0);
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
