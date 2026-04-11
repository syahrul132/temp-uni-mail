import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMessages = (tempEmailId: string | null) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, refetch } = useQuery({
    queryKey: ["messages", tempEmailId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_messages")
        .select("*")
        .eq("temp_email_id", tempEmailId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!tempEmailId,
    refetchInterval: 10000,
  });

  const sendMessage = useMutation({
    mutationFn: async (msg: { recipient: string; subject: string; body: string; sender: string }) => {
      const { data, error } = await supabase
        .from("email_messages")
        .insert({
          temp_email_id: tempEmailId!,
          sender: msg.sender,
          recipient: msg.recipient,
          subject: msg.subject,
          body: msg.body,
          direction: "outgoing",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages", tempEmailId] }),
  });

  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("email_messages")
        .update({ is_read: true })
        .eq("id", messageId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages", tempEmailId] }),
  });

  return { messages, isLoading, refetch, sendMessage, markAsRead };
};
