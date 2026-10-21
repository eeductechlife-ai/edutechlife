import { describe, it, expect, vi } from "vitest";
import { fetchPerfilesPublicos } from "../perfilesPublicos";

function clienteFalso(respuesta) {
  return { rpc: vi.fn(async () => respuesta) };
}

describe("fetchPerfilesPublicos", () => {
  it("devuelve un mapa id → perfil con la respuesta de la función", async () => {
    const supabase = clienteFalso({
      data: [{ id: "a", full_name: "Ana", avatar_url: null }],
      error: null,
    });
    const r = await fetchPerfilesPublicos(supabase, ["a"]);
    expect(supabase.rpc).toHaveBeenCalledWith("perfiles_publicos", {
      p_ids: ["a"],
    });
    expect(r).toEqual({ a: { id: "a", full_name: "Ana", avatar_url: null } });
  });

  it("no envía ids repetidos ni vacíos", async () => {
    const supabase = clienteFalso({ data: [], error: null });
    await fetchPerfilesPublicos(supabase, ["a", "a", "", null, "b"]);
    expect(supabase.rpc).toHaveBeenCalledWith("perfiles_publicos", {
      p_ids: ["a", "b"],
    });
  });

  it("parte en lotes de 200", async () => {
    const supabase = clienteFalso({ data: [], error: null });
    const ids = Array.from({ length: 450 }, (_, i) => `u${i}`);
    await fetchPerfilesPublicos(supabase, ids);
    expect(supabase.rpc).toHaveBeenCalledTimes(3);
    expect(supabase.rpc.mock.calls[0][1].p_ids).toHaveLength(200);
    expect(supabase.rpc.mock.calls[2][1].p_ids).toHaveLength(50);
  });

  it("un error no rompe la vista: devuelve lo que haya y avisa", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const supabase = clienteFalso({ data: null, error: { message: "boom" } });
    await expect(fetchPerfilesPublicos(supabase, ["a"])).resolves.toEqual({});
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("sin ids no llama a la base", async () => {
    const supabase = clienteFalso({ data: [], error: null });
    expect(await fetchPerfilesPublicos(supabase, [])).toEqual({});
    expect(supabase.rpc).not.toHaveBeenCalled();
  });
});
