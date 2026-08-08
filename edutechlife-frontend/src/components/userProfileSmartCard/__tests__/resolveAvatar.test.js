import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ls } from "../../../utils/ialab";
import { LS_KEYS } from "../../../constants/ialab";
import { resolveAvatarUrl, useAvatarUrl } from "../resolveAvatar";

vi.mock("../../../utils/ialab", () => ({
  ls: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("resolveAvatarUrl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("prefers the locally-saved avatar (what ChangeAvatarModal writes)", () => {
    ls.get.mockReturnValue("data:image/png;base64,ABC");
    const result = resolveAvatarUrl({ avatar_url: "https://cdn/x.png" });
    expect(result).toBe("data:image/png;base64,ABC");
  });

  it("falls back to profile.avatar_url when nothing is saved locally", () => {
    ls.get.mockReturnValue(null);
    const result = resolveAvatarUrl({ avatar_url: "https://cdn/x.png" });
    expect(result).toBe("https://cdn/x.png");
  });

  it("returns null when neither source has an avatar", () => {
    ls.get.mockReturnValue(null);
    expect(resolveAvatarUrl({ avatar_url: null })).toBeNull();
    expect(resolveAvatarUrl(null)).toBeNull();
  });

  it("reads the same scoped key used by ChangeAvatarModal", () => {
    resolveAvatarUrl({});
    expect(ls.get).toHaveBeenCalledWith(LS_KEYS.AVATAR, null);
  });
});

describe("useAvatarUrl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("re-reads localStorage when the avatar-updated event fires", () => {
    ls.get.mockReturnValue("data:image/png;base64,OLD");
    const { result } = renderHook(() => useAvatarUrl(null));
    expect(result.current).toBe("data:image/png;base64,OLD");

    ls.get.mockReturnValue("data:image/png;base64,NEW");
    act(() => {
      window.dispatchEvent(new CustomEvent("avatar-updated"));
    });
    expect(result.current).toBe("data:image/png;base64,NEW");
  });
});
