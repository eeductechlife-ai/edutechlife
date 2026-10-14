import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  elegirPlanIngenIA,
  resolveLandingPlanId,
} from "../ingenia/ingeniaPlanCheckout";

describe("resolveLandingPlanId", () => {
  it("mapea las tarjetas de la landing a los ids del backend", () => {
    expect(resolveLandingPlanId("base")).toBe("smartboard_premium");
    expect(resolveLandingPlanId("personalizado")).toBe(
      "ingenia_acompanamiento",
    );
    expect(resolveLandingPlanId("gratis")).toBe("gratis");
  });
});

describe("elegirPlanIngenIA", () => {
  let deps;

  beforeEach(() => {
    deps = {
      isSignedIn: true,
      startCheckout: vi.fn().mockResolvedValue({
        url: "https://checkout.wompi.co/p/abc",
      }),
      onSignIn: vi.fn(),
      onRegister: vi.fn(),
      onValoracion: vi.fn(),
      redirect: vi.fn(),
      onError: vi.fn(),
      logError: vi.fn(),
    };
  });

  describe("plan Base (smartboard_premium)", () => {
    it("con sesión: pide el checkout y redirige a Wompi", async () => {
      await elegirPlanIngenIA({ planId: "smartboard_premium", ...deps });

      expect(deps.startCheckout).toHaveBeenCalledWith("smartboard_premium");
      expect(deps.redirect).toHaveBeenCalledWith(
        "https://checkout.wompi.co/p/abc",
      );
      expect(deps.onSignIn).not.toHaveBeenCalled();
      expect(deps.onRegister).not.toHaveBeenCalled();
    });

    it("sin sesión: va a registro/ingreso y no cobra", async () => {
      deps.isSignedIn = false;
      await elegirPlanIngenIA({ planId: "smartboard_premium", ...deps });

      expect(deps.onSignIn).toHaveBeenCalledTimes(1);
      expect(deps.startCheckout).not.toHaveBeenCalled();
      expect(deps.redirect).not.toHaveBeenCalled();
    });
  });

  describe("plan Fundador (ingenia_fundador)", () => {
    it("con sesión: pide el checkout del Fundador y redirige a Wompi", async () => {
      await elegirPlanIngenIA({ planId: "ingenia_fundador", ...deps });

      expect(deps.startCheckout).toHaveBeenCalledWith("ingenia_fundador");
      expect(deps.redirect).toHaveBeenCalledWith(
        "https://checkout.wompi.co/p/abc",
      );
    });

    it("sin sesión: va a registro/ingreso y no cobra", async () => {
      deps.isSignedIn = false;
      await elegirPlanIngenIA({ planId: "ingenia_fundador", ...deps });

      expect(deps.onSignIn).toHaveBeenCalledTimes(1);
      expect(deps.startCheckout).not.toHaveBeenCalled();
    });
  });

  describe("planes personalizados: valoración gratis antes de cualquier cobro", () => {
    it.each(["ingenia_acompanamiento", "ingenia_intensivo"])(
      "%s con sesión: va a la valoración y no llama al checkout",
      async (planId) => {
        await elegirPlanIngenIA({ planId, ...deps });

        expect(deps.onValoracion).toHaveBeenCalledTimes(1);
        expect(deps.startCheckout).not.toHaveBeenCalled();
        expect(deps.redirect).not.toHaveBeenCalled();
        expect(deps.onSignIn).not.toHaveBeenCalled();
      },
    );

    it.each(["ingenia_acompanamiento", "ingenia_intensivo"])(
      "%s sin sesión: va a la valoración, sin pedir ingreso",
      async (planId) => {
        deps.isSignedIn = false;
        await elegirPlanIngenIA({ planId, ...deps });

        expect(deps.onValoracion).toHaveBeenCalledTimes(1);
        expect(deps.onSignIn).not.toHaveBeenCalled();
        expect(deps.startCheckout).not.toHaveBeenCalled();
      },
    );
  });

  describe("errores del checkout", () => {
    it("si el checkout falla: avisa con onError y conserva el registro del error", async () => {
      const error = new Error("Wompi caído");
      deps.startCheckout.mockRejectedValue(error);
      await elegirPlanIngenIA({ planId: "smartboard_premium", ...deps });

      expect(deps.onError).toHaveBeenCalledTimes(1);
      expect(deps.logError).toHaveBeenCalledWith("Error:", error);
      expect(deps.redirect).not.toHaveBeenCalled();
    });

    it("si la respuesta no trae URL: avisa con onError y no redirige", async () => {
      deps.startCheckout.mockResolvedValue({});
      await elegirPlanIngenIA({ planId: "smartboard_premium", ...deps });

      expect(deps.onError).toHaveBeenCalledTimes(1);
      expect(deps.redirect).not.toHaveBeenCalled();
    });
  });

  describe("otros planes", () => {
    it.each([true, false])(
      "plan sin pago directo (isSignedIn=%s): mantiene el registro de siempre",
      async (isSignedIn) => {
        deps.isSignedIn = isSignedIn;
        await elegirPlanIngenIA({ planId: "gratis", ...deps });

        expect(deps.onRegister).toHaveBeenCalledTimes(1);
        expect(deps.startCheckout).not.toHaveBeenCalled();
        expect(deps.onSignIn).not.toHaveBeenCalled();
        expect(deps.onValoracion).not.toHaveBeenCalled();
      },
    );
  });
});
