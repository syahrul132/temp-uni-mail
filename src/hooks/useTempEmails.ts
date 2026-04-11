import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const generateRandomEmail = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${result}@adzstore.my.id`;
};

export const useTempEmails = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ["temp-emails", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("temp_emails")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createEmail = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("temp_emails")
        .insert({ user_id: user!.id, email_address: generateRandomEmail() })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["temp-emails"] }),
  });

  return { emails, isLoading, createEmail };
};
