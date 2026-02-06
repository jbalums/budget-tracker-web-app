import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export interface Bank {
  id: string;
  name: string;
  balance: number;
  owner: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  monthly_limit: number;
  spent: number;
  color: string;
  user_id: string;
  rollover_balance: number;
  last_reset_month: string | null;
}

export interface Purpose {
  id: string;
  name: string;
  category_id: string;
  user_id: string;
  category?: BudgetCategory;
}

export interface Transaction {
  id: string;
  bank_id: string;
  purpose_id: string | null;
  type: "income" | "expense";
  amount: number;
  remarks: string | null;
  transaction_date: string;
  created_at: string;
  user_id: string;
  bank?: Bank;
  purpose?: Purpose;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  monthly_income: number;
}

export function useBudgetData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch profile
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  // Fetch banks
  const { data: banks = [], isLoading: banksLoading } = useQuery({
    queryKey: ["banks", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banks")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Bank[];
    },
    enabled: !!user,
  });

  // Fetch budget categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["budget_categories", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_categories")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as BudgetCategory[];
    },
    enabled: !!user,
  });

  // Fetch purposes with categories
  const { data: purposes = [], isLoading: purposesLoading } = useQuery({
    queryKey: ["purposes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purposes")
        .select("*, category:budget_categories(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Purpose[];
    },
    enabled: !!user,
  });

  // Fetch transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, bank:banks(*), purpose:purposes(*, category:budget_categories(*))")
        .eq("user_id", user!.id)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  // Update profile
  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["budget_categories"] });
    },
  });

  // Bank mutations
  const addBank = useMutation({
    mutationFn: async (bank: { name: string; balance: number; owner: string }) => {
      const { error } = await supabase
        .from("banks")
        .insert({ ...bank, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      toast({ title: "Bank added successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to add bank", description: error.message });
    },
  });

  const updateBank = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Bank> & { id: string }) => {
      const { error } = await supabase
        .from("banks")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      toast({ title: "Bank updated successfully" });
    },
  });

  const deleteBank = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("banks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      toast({ title: "Bank deleted successfully" });
    },
  });

  // Category mutations
  const updateCategory = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BudgetCategory> & { id: string }) => {
      const { error } = await supabase
        .from("budget_categories")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget_categories"] });
    },
  });

  // Purpose mutations
  const addPurpose = useMutation({
    mutationFn: async (purpose: { name: string; category_id: string }) => {
      const { error } = await supabase
        .from("purposes")
        .insert({ ...purpose, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purposes"] });
      toast({ title: "Purpose added successfully" });
    },
  });

  const deletePurpose = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("purposes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purposes"] });
      toast({ title: "Purpose deleted successfully" });
    },
  });

  // Transaction mutations
  const addTransaction = useMutation({
    mutationFn: async (transaction: {
      bank_id: string;
      purpose_id?: string;
      type: "income" | "expense";
      amount: number;
      remarks?: string;
      transaction_date: string;
    }) => {
      // Add transaction
      const { error: txError } = await supabase
        .from("transactions")
        .insert({ ...transaction, user_id: user!.id });
      if (txError) throw txError;

      // Update bank balance
      const bank = banks.find((b) => b.id === transaction.bank_id);
      if (bank) {
        const newBalance =
          transaction.type === "income"
            ? bank.balance + transaction.amount
            : bank.balance - transaction.amount;

        const { error: bankError } = await supabase
          .from("banks")
          .update({ balance: newBalance })
          .eq("id", transaction.bank_id);
        if (bankError) throw bankError;
      }

      // Update category spent if expense
      if (transaction.type === "expense" && transaction.purpose_id) {
        const purpose = purposes.find((p) => p.id === transaction.purpose_id);
        if (purpose) {
          const category = categories.find((c) => c.id === purpose.category_id);
          if (category) {
            const { error: catError } = await supabase
              .from("budget_categories")
              .update({ spent: category.spent + transaction.amount })
              .eq("id", category.id);
            if (catError) throw catError;
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      queryClient.invalidateQueries({ queryKey: ["budget_categories"] });
      toast({ title: "Transaction recorded successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to add transaction", description: error.message });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (transaction: Transaction) => {
      // Reverse the balance change
      const bank = banks.find((b) => b.id === transaction.bank_id);
      if (bank) {
        const newBalance =
          transaction.type === "income"
            ? bank.balance - transaction.amount
            : bank.balance + transaction.amount;

        await supabase.from("banks").update({ balance: newBalance }).eq("id", transaction.bank_id);
      }

      // Reverse category spent if expense
      if (transaction.type === "expense" && transaction.purpose_id) {
        const purpose = purposes.find((p) => p.id === transaction.purpose_id);
        if (purpose) {
          const category = categories.find((c) => c.id === purpose.category_id);
          if (category) {
            await supabase
              .from("budget_categories")
              .update({ spent: Math.max(0, category.spent - transaction.amount) })
              .eq("id", category.id);
          }
        }
      }

      const { error } = await supabase.from("transactions").delete().eq("id", transaction.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      queryClient.invalidateQueries({ queryKey: ["budget_categories"] });
      toast({ title: "Transaction deleted successfully" });
    },
  });

  // Reset monthly budgets with rollover for Wants
  const resetMonthlyBudgets = useMutation({
    mutationFn: async () => {
      const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      
      for (const category of categories) {
        // Check if already reset this month
        if (category.last_reset_month === currentMonthStart) continue;
        
        const income = profile?.monthly_income || 0;
        const baseLimit = income * (category.percentage / 100);
        
      // Calculate rollover from remaining balance for all categories
      const previousLimit = baseLimit + (category.rollover_balance || 0);
      const remaining = previousLimit - category.spent;
      const newRollover = Math.max(0, remaining); // Only positive rollover
        
        const { error } = await supabase
          .from("budget_categories")
          .update({
            spent: 0,
            rollover_balance: newRollover,
            last_reset_month: currentMonthStart,
          })
          .eq("id", category.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget_categories"] });
      toast({ title: "Monthly budgets reset", description: "Unused balances have been rolled over" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to reset budgets", description: error.message });
    },
  });

  // Computed values
  const totalBalance = banks.reduce((sum, bank) => sum + Number(bank.balance), 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.transaction_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const remainingBudget = (profile?.monthly_income || 0) - monthlyExpenses;

  // Check if budgets need reset (new month)
  const needsMonthlyReset = categories.some((c) => {
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    return c.last_reset_month !== currentMonthStart && c.last_reset_month !== null;
  });

  return {
    profile,
    banks,
    categories,
    purposes,
    transactions,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    remainingBudget,
    isLoading: banksLoading || categoriesLoading || purposesLoading || transactionsLoading,
    needsMonthlyReset,
    updateProfile,
    addBank,
    updateBank,
    deleteBank,
    updateCategory,
    addPurpose,
    deletePurpose,
    addTransaction,
    deleteTransaction,
    resetMonthlyBudgets,
  };
}
