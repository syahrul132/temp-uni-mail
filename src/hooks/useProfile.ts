import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export const useProfile = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data.map((r) => r.role);
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`profile:${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `user_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["profile", user.id] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc]);

  const profile = profileQuery.data;
  const isPremium = !!profile?.unlimited_until && new Date(profile.unlimited_until) > new Date();
  const isAdmin = rolesQuery.data?.includes("admin") ?? false;

  return {
    profile,
    balance: profile?.balance ?? 0,
    unlimitedUntil: profile?.unlimited_until ?? null,
    isPremium,
    isAdmin,
    isLoading: profileQuery.isLoading || rolesQuery.isLoading,
  };
};
