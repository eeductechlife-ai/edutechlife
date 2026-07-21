import { describe, test, expect, vi } from "vitest";
import { checkAppointmentResponse } from "../nicoIntentMatcher";

describe("checkAppointmentResponse", () => {
  test("returns handled false when last message is not an appointment prompt", () => {
    const messages = [{ role: "assistant", content: "Hola, soy Nico" }];
    const result = checkAppointmentResponse(
      "quiero agendar",
      messages,
      vi.fn(),
      {},
      vi.fn(),
    );
    expect(result).toEqual({ handled: false });
  });

  test("returns handled true with schedule action for positive response", () => {
    const messages = [
      {
        role: "assistant",
        content: "¿Quieres agendar una llamada?",
        isAppointmentPrompt: true,
      },
    ];
    const showScheduler = vi.fn();
    const setIsLoading = vi.fn();

    const result = checkAppointmentResponse(
      "sí, quiero agendar",
      messages,
      showScheduler,
      {},
      setIsLoading,
    );

    expect(result).toEqual({ handled: true, action: "schedule" });
    expect(setIsLoading).toHaveBeenCalledWith(false);
    expect(showScheduler).toHaveBeenCalledWith(
      expect.objectContaining({ interest: "Consulta general" }),
    );
  });

  test("extracts lead name from a recent lead-success message", () => {
    const messages = [
      {
        role: "assistant",
        content: "Perfecto Carlos,",
        isLeadSuccess: true,
      },
      {
        role: "assistant",
        content: "¿Te gustaría agendar?",
        isAppointmentPrompt: true,
      },
    ];
    const showScheduler = vi.fn();

    checkAppointmentResponse("claro", messages, showScheduler, {}, vi.fn());

    expect(showScheduler).toHaveBeenCalledWith(
      expect.objectContaining({
        leadData: { nombreCompleto: "Carlos" },
      }),
    );
  });

  test("uses interest from memory when available", () => {
    const messages = [
      {
        role: "assistant",
        content: "¿Quieres agendar?",
        isAppointmentPrompt: true,
      },
    ];
    const showScheduler = vi.fn();
    const memory = { userProfile: { interests: ["Matemáticas"] } };

    checkAppointmentResponse("por supuesto", messages, showScheduler, memory, vi.fn());

    expect(showScheduler).toHaveBeenCalledWith(
      expect.objectContaining({ interest: "Matemáticas" }),
    );
  });

  test("returns handled false for negative response", () => {
    const messages = [
      {
        role: "assistant",
        content: "¿Quieres agendar?",
        isAppointmentPrompt: true,
      },
    ];
    const result = checkAppointmentResponse(
      "no gracias",
      messages,
      vi.fn(),
      {},
      vi.fn(),
    );
    expect(result).toEqual({ handled: false });
  });

  test("returns handled false for empty string", () => {
    const messages = [
      {
        role: "assistant",
        content: "¿Quieres agendar?",
        isAppointmentPrompt: true,
      },
    ];
    const result = checkAppointmentResponse(
      "",
      messages,
      vi.fn(),
      {},
      vi.fn(),
    );
    expect(result).toEqual({ handled: false });
  });

  test("returns handled false when no intent keyword matches", () => {
    const messages = [
      {
        role: "assistant",
        content: "¿Quieres agendar?",
        isAppointmentPrompt: true,
      },
    ];
    const result = checkAppointmentResponse(
      "háblame de VAK",
      messages,
      vi.fn(),
      {},
      vi.fn(),
    );
    expect(result).toEqual({ handled: false });
  });
});
