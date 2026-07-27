import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export function useStudyGroups(moduleId) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myMemberships, setMyMemberships] = useState({});

  const loadGroups = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("study_groups")
        .select("*, members:study_group_members(user_id, role, joined_at)")
        .eq("module_id", moduleId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (err) throw err;
      setGroups(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, moduleId]);

  const loadMyMemberships = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error: err } = await supabase
        .from("study_group_members")
        .select("group_id")
        .eq("user_id", user.id);

      if (err) throw err;
      const map = {};
      (data || []).forEach((m) => {
        map[m.group_id] = true;
      });
      setMyMemberships(map);
    } catch {}
  }, [user]);

  useEffect(() => {
    loadGroups();
    loadMyMemberships();
  }, [loadGroups, loadMyMemberships]);

  const createGroup = useCallback(
    async (name, description) => {
      if (!user) return { success: false, error: "Not authenticated" };
      try {
        const { data, error: err } = await supabase
          .from("study_groups")
          .insert({
            name,
            description,
            module_id: moduleId,
            created_by: user.id,
          })
          .select()
          .single();

        if (err) throw err;

        if (data) {
          await supabase
            .from("study_group_members")
            .insert({ group_id: data.id, user_id: user.id, role: "creator" });
        }

        await loadGroups();
        await loadMyMemberships();
        return { success: true, group: data };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [user, moduleId, loadGroups, loadMyMemberships],
  );

  const joinGroup = useCallback(
    async (groupId) => {
      if (!user) return { success: false, error: "Not authenticated" };
      try {
        const { error: err } = await supabase
          .from("study_group_members")
          .insert({ group_id: groupId, user_id: user.id, role: "member" });

        if (err) throw err;
        await loadGroups();
        await loadMyMemberships();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [user, loadGroups, loadMyMemberships],
  );

  const leaveGroup = useCallback(
    async (groupId) => {
      if (!user) return;
      try {
        await supabase
          .from("study_group_members")
          .delete()
          .eq("group_id", groupId)
          .eq("user_id", user.id);

        await loadGroups();
        await loadMyMemberships();
      } catch {}
    },
    [user, loadGroups, loadMyMemberships],
  );

  return {
    groups,
    isLoading,
    error,
    myMemberships,
    createGroup,
    joinGroup,
    leaveGroup,
    refresh: loadGroups,
  };
}
