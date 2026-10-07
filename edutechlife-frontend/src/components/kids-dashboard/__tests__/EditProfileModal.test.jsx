import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfileModal from "../EditProfileModal";

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_, tag) =>
          ({ children, initial, animate, exit, transition, ...rest }) =>
            React.createElement(tag, rest, children),
      },
    ),
  };
});

const setup = (profile = {}) => {
  const props = {
    profile: { name: "Ana", ...profile },
    studentName: "Ana",
    displayName: "Ana",
    avatarUrl: "",
    updateProfile: vi.fn().mockResolvedValue({ ok: true }),
    uploadAvatar: vi.fn(),
    removeAvatar: vi.fn(),
    onClose: vi.fn(),
    onSaveSuccess: vi.fn(),
  };
  render(<EditProfileModal {...props} />);
  return props;
};

const pick = (label, value) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const save = () => fireEvent.click(screen.getByText("kid.user.save"));

describe("EditProfileModal: edad y grado", () => {
  beforeEach(() => vi.clearAllMocks());

  it("ofrece listas cerradas: 8–16 años y 3.º–11.º", () => {
    setup();
    const ages = [
      ...screen.getByLabelText("kid.user.age").querySelectorAll("option"),
    ];
    const grades = [
      ...screen.getByLabelText("kid.user.grade").querySelectorAll("option"),
    ];
    expect(ages.map((o) => o.value).filter(Boolean)).toEqual([
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
    ]);
    expect(grades.map((o) => o.value).filter(Boolean)).toEqual([
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
    ]);
  });

  it("muestra la edad y el grado guardados", () => {
    setup({ age: 12, grade: "7" });
    expect(screen.getByLabelText("kid.user.age").value).toBe("12");
    expect(screen.getByLabelText("kid.user.grade").value).toBe("7");
  });

  it("un curso como «6B» se lee como 6.º; un valor fuera de la lista queda vacío", () => {
    setup({ age: 12, grade: "6B" });
    expect(screen.getByLabelText("kid.user.grade").value).toBe("6");
  });

  it("un grado fuera de 3.º–11.º queda vacío y se pide de nuevo", () => {
    setup({ age: 12, grade: "1" });
    expect(screen.getByLabelText("kid.user.grade").value).toBe("");
  });

  it("avisa al instante cuando edad y grado no cuadran (12 años, 9.º)", () => {
    setup();
    pick("kid.user.age", "12");
    pick("kid.user.grade", "9");
    expect(screen.getByRole("alert").textContent).toBe(
      "A los 12 años lo habitual es 6.º o 7.º. Revisa la edad o el grado.",
    );
  });

  it("no guarda una pareja incoherente y explica por qué", async () => {
    const props = setup();
    pick("kid.user.age", "12");
    pick("kid.user.grade", "9");
    save();
    await waitFor(() =>
      expect(
        screen.getAllByText(/A los 12 años lo habitual es 6.º o 7.º/).length,
      ).toBeGreaterThan(0),
    );
    expect(props.updateProfile).not.toHaveBeenCalled();
  });

  it("guarda una pareja válida con edad numérica y grado en texto", async () => {
    const props = setup();
    pick("kid.user.age", "12");
    pick("kid.user.grade", "7");
    save();
    await waitFor(() => expect(props.updateProfile).toHaveBeenCalled());
    expect(props.updateProfile.mock.calls[0][0]).toMatchObject({
      age: 12,
      grade: "7",
    });
  });

  it("cambiar solo el nombre no se bloquea por un perfil antiguo sin edad ni grado", async () => {
    const props = setup();
    fireEvent.change(screen.getByLabelText("kid.user.fullname"), {
      target: { value: "Ana María" },
    });
    save();
    await waitFor(() => expect(props.updateProfile).toHaveBeenCalled());
    expect(props.updateProfile.mock.calls[0][0]).toEqual({ name: "Ana María" });
  });

  it("si solo se toca la edad, se exige también el grado", async () => {
    const props = setup();
    pick("kid.user.age", "12");
    save();
    await waitFor(() =>
      expect(screen.getByText(/Elige un grado entre 3.º y 11.º/)).toBeTruthy(),
    );
    expect(props.updateProfile).not.toHaveBeenCalled();
  });
});
