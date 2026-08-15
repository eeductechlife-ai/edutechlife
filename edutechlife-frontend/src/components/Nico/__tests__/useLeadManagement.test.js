import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLeadManagement from "../../../hooks/useLeadManagement";

describe("useLeadManagement", () => {
  beforeEach(() => localStorage.clear());

  it("expone saveLead como alias de createLead y setea currentLead", () => {
    const { result } = renderHook(() => useLeadManagement());
    expect(typeof result.current.saveLead).toBe("function");
    act(() => {
      const id = result.current.saveLead({
        nombre: "QA Test",
        telefono: "+573001112233",
        email: "qa@example.com",
        motivo: "Interés general",
        messages: [],
      });
      expect(id).toMatch(/^lead_/);
    });
    expect(result.current.leads).toHaveLength(1);
    expect(result.current.currentLead?.datos?.nombre).toBe("QA Test");
    expect(result.current.currentLead?.datos?.email).toBe("qa@example.com");
  });

  it("updateLeadInfo mergea datos en el lead actual", () => {
    const { result } = renderHook(() => useLeadManagement());
    act(() => {
      result.current.saveLead({
        nombre: "QA Test",
        email: "qa@example.com",
        messages: [],
      });
      result.current.updateLeadInfo({ estado: "contactado" });
    });
    expect(result.current.currentLead?.estado).toBe("contactado");
  });

  it("persiste leads en localStorage", () => {
    const { result } = renderHook(() => useLeadManagement());
    act(() => {
      result.current.saveLead({
        nombre: "QA Test",
        email: "qa@example.com",
        messages: [],
      });
    });
    const raw = localStorage.getItem("edutechlife_leads");
    expect(JSON.parse(raw)).toHaveLength(1);
  });
});
