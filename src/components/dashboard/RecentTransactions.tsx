import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/hooks/useBudgetData";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      transaction.type === "income" ? "bg-income-muted" : "bg-expense-muted"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft className="h-4 w-4 text-income" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-expense" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.purpose?.name || (transaction.type === "income" ? "Income" : "Expense")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.bank?.name} • {format(new Date(transaction.transaction_date), "MMM d")}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "font-semibold",
                    transaction.type === "income" ? "text-income" : "text-expense"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}₱{transaction.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
