import { describe, it, expect } from "vitest";
import { getUserInfo } from "../userInfo";

describe("getUserInfo", () => {
  it("usa first_name + last_name cuando existen", () => {
    expect(
      getUserInfo({ first_name: "Ana", last_name: "Gómez" }).displayName,
    ).toBe("Ana Gómez");
  });

  it("cae a full_name (tabla profiles) antes que al prefijo del correo", () => {
    const info = getUserInfo({
      full_name: "john brl",
      email: "edison@gmail.com",
    });
    expect(info.displayName).toBe("john brl");
    expect(info.initials).toBe("JB");
  });

  it("ignora un full_name que es un correo", () => {
    expect(
      getUserInfo({ full_name: "x@y.com", email: "edison@gmail.com" })
        .displayName,
    ).toBe("Edison");
  });

  it("sin datos usa el prefijo del correo", () => {
    expect(getUserInfo(null, "edison@gmail.com").displayName).toBe("Edison");
  });
});
