import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserMenu, { getInitials } from "../UserMenu";

const setGradeLevel = vi.fn();
const setSchoolName = vi.fn();

vi.mock("../../../context/IngenIAKidsContext", () => ({
  useIngenIAKids: () => ({
    gradeLevel: null,
    setGradeLevel,
    setSchoolName,
  }),
}));

vi.mock("../../../hooks/useStudentProfileIngenIA", () => ({
  useStudentProfileIngenIA: vi.fn(() => ({ profile: null })),
}));

const { useStudentProfileIngenIA } =
  await import("../../../hooks/useStudentProfileIngenIA");

const renderMenu = (props = {}) =>
  render(
    <UserMenu
      authToken="token-123"
      studentName="Juan Pérez"
      darkMode={false}
      onTabChange={vi.fn()}
      {...props}
    />,
  );

describe("UserMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStudentProfileIngenIA.mockReturnValue({ profile: null });
  });

  it("shows the student's initials when there is no avatar", () => {
    renderMenu();
    const btn = screen.getByRole("button", { name: "Ir a Mi Perfil" });
    expect(btn.textContent).toBe("JP");
  });

  it("shows the avatar image when the profile has one", () => {
    useStudentProfileIngenIA.mockReturnValue({
      profile: { name: "Ana", avatarUrl: "https://example.com/a.png" },
    });
    renderMenu();
    expect(screen.getByRole("img", { name: "Ana" })).toBeTruthy();
  });

  it("opens Mi Perfil on click", () => {
    const onTabChange = vi.fn();
    renderMenu({ onTabChange });
    fireEvent.click(screen.getByRole("button", { name: "Ir a Mi Perfil" }));
    expect(onTabChange).toHaveBeenCalledWith("perfil");
  });

  it("syncs grade and school from the saved profile", () => {
    useStudentProfileIngenIA.mockReturnValue({
      profile: { grade: "7", school: "Colegio Andino" },
    });
    renderMenu();
    expect(setGradeLevel).toHaveBeenCalledWith(7);
    expect(setSchoolName).toHaveBeenCalledWith("Colegio Andino");
  });

  it("ignores grades outside 1-11", () => {
    useStudentProfileIngenIA.mockReturnValue({ profile: { grade: "15" } });
    renderMenu();
    expect(setGradeLevel).not.toHaveBeenCalled();
  });
});

describe("getInitials", () => {
  it("builds initials with a fallback", () => {
    expect(getInitials("Juan Pérez")).toBe("JP");
    expect(getInitials("ana")).toBe("A");
    expect(getInitials("")).toBe("S");
    expect(getInitials(null)).toBe("S");
  });
});
