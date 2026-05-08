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

export class InsufficientCreditsError extends Error {
  constructor() {
    super("insufficient_credits");
  }
}

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
      const address = generateRandomEmail();
      const { data, error } = await supabase.rpc("consume_credit_for_email", {
        p_email_address: address,
      });
      if (error) throw error;
      const result = data as { success: boolean; error?: string; email_id?: string };
      if (!result.success) {
        if (result.error === "insufficient_credits") throw new InsufficientCreditsError();
        throw new Error(result.error || "failed");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["temp-emails"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return { emails, isLoading, createEmail };
};
