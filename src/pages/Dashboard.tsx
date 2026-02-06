import { useBudgetData } from "@/hooks/useBudgetData";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { BudgetChart } from "@/components/dashboard/BudgetChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Loader2 } from "lucide-react";

export default function Dashboard() {
  const {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    remainingBudget,
    categories,
    transactions,
    profile,
    isLoading,
  } = useBudgetData();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Quick action */}
        <div className="flex justify-end">
          <AddTransactionDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Balance"
            value={totalBalance}
            icon={<Wallet className="h-5 w-5 text-accent" />}
            subtitle="Across all banks"
          />
          <StatCard
            title="Monthly Income"
            value={monthlyIncome}
            icon={<TrendingUp className="h-5 w-5 text-income" />}
            variant="income"
            subtitle="This month"
          />
          <StatCard
            title="Monthly Expenses"
            value={monthlyExpenses}
            icon={<TrendingDown className="h-5 w-5 text-expense" />}
            variant="expense"
            subtitle="This month"
          />
          <StatCard
            title="Remaining Budget"
            value={remainingBudget}
            icon={<PiggyBank className="h-5 w-5 text-accent" />}
            subtitle={`From ₱${(profile?.monthly_income || 0).toLocaleString()} budget`}
          />
        </div>

        {/* Charts and Progress */}
        <div className="grid gap-6 lg:grid-cols-2">
          <BudgetProgress categories={categories} monthlyIncome={profile?.monthly_income || 0} />
          <BudgetChart categories={categories} monthlyIncome={profile?.monthly_income || 0} />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions} />
      </div>
    </AppLayout>
  );
}
