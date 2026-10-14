import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  elegirPlanIngenIA,
  INGENIA_SIGNUP_FOR_PLAN,
} from "../ingenia/ingeniaPlanCheckout";

describe("elegirPlanIngenIA", () => {
  let deps;

  beforeEach(() => {
    deps = {
      isSignedIn: true,
      startCheckout: vi.fn().mockResolvedValue({
        url: "https://checkout.wompi.co/p/abc",
      }),
      navigate: vi.fn(),
      onRegister: vi.fn(),
      redirect: vi.fn(),
      onError: vi.fn(),
      logError: vi.fn(),
    };
  });

  it("sin sesión en plan de pago: va a registro con returnTo a la landing y no cobra", async () => {
    deps.isSignedIn = false;
    await elegirPlanIngenIA({ planId: "base", ...deps });

    expect(deps.navigate).toHaveBeenCalledWith(
      "/sign-up/ingenia?returnTo=/conoce-ingenia",
    );
    expect(INGENIA_SIGNUP_FOR_PLAN).toBe(
      "/sign-up/ingenia?returnTo=/conoce-ingenia",
    );
    expect(deps.startCheckout).not.toHaveBeenCalled();
    expect(deps.redirect).not.toHaveBeenCalled();
  });

  it("con sesión en plan Base: pide el checkout del plan del backend y redirige a Wompi", async () => {
    await elegirPlanIngenIA({ planId: "base", ...deps });

    expect(deps.startCheckout).toHaveBeenCalledWith("smartboard_premium");
    expect(deps.redirect).toHaveBeenCalledWith(
      "https://checkout.wompi.co/p/abc",
    );
    expect(deps.navigate).not.toHaveBeenCalled();
    expect(deps.onRegister).not.toHaveBeenCalled();
  });

  it("con sesión en plan Personalizado: pide el checkout de Acompañamiento", async () => {
    await elegirPlanIngenIA({ planId: "personalizado", ...deps });

    expect(deps.startCheckout).toHaveBeenCalledWith("ingenia_acompanamiento");
    expect(deps.redirect).toHaveBeenCalledWith(
      "https://checkout.wompi.co/p/abc",
    );
  });

  it("si el checkout falla: avisa con onError y conserva el registro del error", async () => {
    const error = new Error("Wompi caído");
    deps.startCheckout.mockRejectedValue(error);
    await elegirPlanIngenIA({ planId: "base", ...deps });

    expect(deps.onError).toHaveBeenCalledTimes(1);
    expect(deps.logError).toHaveBeenCalledWith("Error:", error);
    expect(deps.redirect).not.toHaveBeenCalled();
  });

  it("si la respuesta no trae URL: avisa con onError y no redirige", async () => {
    deps.startCheckout.mockResolvedValue({});
    await elegirPlanIngenIA({ planId: "base", ...deps });

    expect(deps.onError).toHaveBeenCalledTimes(1);
    expect(deps.redirect).not.toHaveBeenCalled();
  });

  it("plan sin pago directo (gratis o sin id conocido): mantiene el registro de siempre", async () => {
    await elegirPlanIngenIA({ planId: "gratis", ...deps });

    expect(deps.onRegister).toHaveBeenCalledTimes(1);
    expect(deps.startCheckout).not.toHaveBeenCalled();
    expect(deps.navigate).not.toHaveBeenCalled();
  });

  it("plan sin pago directo también en modo sin sesión: registro de siempre", async () => {
    deps.isSignedIn = false;
    await elegirPlanIngenIA({ planId: "gratis", ...deps });

    expect(deps.onRegister).toHaveBeenCalledTimes(1);
    expect(deps.navigate).not.toHaveBeenCalled();
  });
});
