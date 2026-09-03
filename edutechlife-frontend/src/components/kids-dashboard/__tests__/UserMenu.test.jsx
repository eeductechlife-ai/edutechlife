import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserMenu, { getInitials } from "../UserMenu";

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("../../../context/SmartBoardKidsContext", () => ({
  useSmartBoardKids: () => ({
    toggleDarkMode: vi.fn(),
    gradeLevel: null,
    setGradeLevel: vi.fn(),
    setSchoolName: vi.fn(),
    darkMode: false,
  }),
}));

vi.mock("../../../hooks/useStudentProfileSmartBoard", () => ({
  useStudentProfileSmartBoard: vi.fn(() => ({
    profile: null,
    loading: false,
    error: null,
    updateProfile: vi.fn().mockResolvedValue(true),
    uploadAvatar: vi.fn().mockResolvedValue(true),
    removeAvatar: vi.fn().mockResolvedValue(true),
    refetch: vi.fn(),
  })),
}));

const { useStudentProfileSmartBoard } =
  await import("../../../hooks/useStudentProfileSmartBoard");

const renderMenu = (props = {}) =>
  render(
    <UserMenu
      authToken="token-123"
      studentName="Juan"
      darkMode={false}
      onTabChange={vi.fn()}
      onLogout={vi.fn()}
      {...props}
    />,
  );

describe("UserMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders trigger with initials when no avatar", () => {
    renderMenu();
    expect(
      screen.getByRole("button", { name: "kid.user.open_menu" }),
    ).toBeTruthy();
  });

  it("opens dropdown and shows student data", async () => {
    useStudentProfileSmartBoard.mockReturnValue({
      profile: {
        name: "Juan Pérez",
        age: 12,
        vakStyle: "visual",
        school: "Colegio Mayor",
        grade: "6B",
        avatarUrl: null,
      },
      loading: false,
      error: null,
      updateProfile: vi.fn().mockResolvedValue(true),
      uploadAvatar: vi.fn().mockResolvedValue(true),
      removeAvatar: vi.fn().mockResolvedValue(true),
      refetch: vi.fn(),
    });

    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "kid.user.open_menu" }));

    expect(await screen.findByText("Juan Pérez")).toBeTruthy();
    expect(screen.getByText("kid.user.age_value")).toBeTruthy();
    expect(screen.queryByText("kid.user.no_profile_data")).toBeNull();
    expect(screen.getByText("kid.user.smartboard_profile")).toBeTruthy();
  });

  it("shows initials derived from the name", () => {
    expect(getInitials("Juan Pérez")).toBe("JP");
    expect(getInitials("ana")).toBe("A");
    expect(getInitials("")).toBe("S");
    expect(getInitials(null)).toBe("S");
  });

  it("calls onTabChange with progreso when clicking progress", async () => {
    const onTabChange = vi.fn();
    renderMenu({ onTabChange });

    fireEvent.click(screen.getByRole("button", { name: "kid.user.open_menu" }));
    const progressBtn = await screen.findByRole("button", {
      name: "kid.user.progress",
    });
    fireEvent.click(progressBtn);

    expect(onTabChange).toHaveBeenCalledWith("progreso");
  });

  it("calls onLogout when clicking logout", async () => {
    const onLogout = vi.fn();
    renderMenu({ onLogout });

    fireEvent.click(screen.getByRole("button", { name: "kid.user.open_menu" }));
    const logoutBtn = await screen.findByRole("button", {
      name: "kid.user.logout",
    });
    fireEvent.click(logoutBtn);

    expect(onLogout).toHaveBeenCalled();
  });

  it("opens edit modal with name field", async () => {
    useStudentProfileSmartBoard.mockReturnValue({
      profile: {
        name: "Juan",
        age: 12,
        vakStyle: "visual",
        school: "Colegio Mayor",
        grade: "6B",
        avatarUrl: null,
      },
      loading: false,
      error: null,
      updateProfile: vi.fn().mockResolvedValue(true),
      uploadAvatar: vi.fn().mockResolvedValue(true),
      removeAvatar: vi.fn().mockResolvedValue(true),
      refetch: vi.fn(),
    });

    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "kid.user.open_menu" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "kid.user.edit_profile" }),
    );

    expect(await screen.findByText("kid.user.edit_profile_title")).toBeTruthy();
    expect(screen.getByText("kid.user.fullname")).toBeTruthy();
    expect(screen.getByDisplayValue("Juan")).toBeTruthy();
    expect(screen.getByText("kid.user.avatar_upload")).toBeTruthy();
  });

  it("saves profile changes via updateProfile", async () => {
    const updateProfile = vi.fn().mockResolvedValue(true);
    useStudentProfileSmartBoard.mockReturnValue({
      profile: {
        name: "Juan",
        age: 30,
        vakStyle: "visual",
        school: "Colegio Mayor",
        grade: "6B",
        avatarUrl: null,
      },
      loading: false,
      error: null,
      updateProfile,
      uploadAvatar: vi.fn().mockResolvedValue(true),
      removeAvatar: vi.fn().mockResolvedValue(true),
      refetch: vi.fn(),
    });

    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "kid.user.open_menu" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "kid.user.edit_profile" }),
    );

    const nameInput = await screen.findByDisplayValue("Juan");
    fireEvent.change(nameInput, { target: { value: "Juan Pérez" } });

    fireEvent.click(screen.getByRole("button", { name: "kid.user.save" }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Juan Pérez" }),
      );
    });
  });
});
