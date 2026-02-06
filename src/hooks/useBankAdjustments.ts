import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export interface BankAdjustment {
  id: string;
  bank_id: string;
  user_id: string;
  previous_balance: number;
  new_balance: number;
  adjustment_amount: number;
  reason: string | null;
  created_at: string;
}

export function useBankAdjustments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all adjustments
  const { data: adjustments = [], isLoading } = useQuery({
    queryKey: ["bank_adjustments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bank_adjustments")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BankAdjustment[];
    },
    enabled: !!user,
  });

  // Adjust bank balance
  const adjustBalance = useMutation({
    mutationFn: async ({
      bankId,
      previousBalance,
      newBalance,
      reason,
    }: {
      bankId: string;
      previousBalance: number;
      newBalance: number;
      reason?: string;
    }) => {
      const adjustmentAmount = newBalance - previousBalance;

      // Create adjustment log
      const { error: logError } = await supabase.from("bank_adjustments").insert({
        bank_id: bankId,
        user_id: user!.id,
        previous_balance: previousBalance,
        new_balance: newBalance,
        adjustment_amount: adjustmentAmount,
        reason: reason || null,
      });
      if (logError) throw logError;

      // Update bank balance
      const { error: bankError } = await supabase
        .from("banks")
        .update({ balance: newBalance })
        .eq("id", bankId);
      if (bankError) throw bankError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank_adjustments"] });
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      toast({ title: "Balance adjusted successfully" });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to adjust balance",
        description: error.message,
      });
    },
  });

  return {
    adjustments,
    isLoading,
    adjustBalance,
  };
}