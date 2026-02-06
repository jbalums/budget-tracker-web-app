import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useBudgetData, Transaction } from "@/hooks/useBudgetData";
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Receipt, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Records() {
  const { transactions, banks, categories, deleteTransaction, isLoading } = useBudgetData();
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get unique months from transactions
  const months = [...new Set(transactions.map((t) => format(new Date(t.transaction_date), "yyyy-MM")))].sort().reverse();

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const monthMatch = monthFilter === "all" || format(new Date(t.transaction_date), "yyyy-MM") === monthFilter;
    const bankMatch = bankFilter === "all" || t.bank_id === bankFilter;
    const categoryMatch = categoryFilter === "all" || t.purpose?.category?.id === categoryFilter;
    return monthMatch && bankMatch && categoryMatch;
  });

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
        {/* Header with Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {format(new Date(month + "-01"), "MMMM yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={bankFilter} onValueChange={setBankFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Banks" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Banks</SelectItem>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AddTransactionDialog />
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Receipt className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 font-semibold">No transactions found</h3>
              <p className="mb-4 text-sm text-muted-foreground text-center">
                {transactions.length === 0
                  ? "Start by adding your first transaction"
                  : "Try adjusting your filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {format(new Date(transaction.transaction_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full",
                              transaction.type === "income" ? "bg-income-muted" : "bg-expense-muted"
                            )}
                          >
                            {transaction.type === "income" ? (
                              <ArrowDownLeft className="h-3 w-3 text-income" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3 text-expense" />
                            )}
                          </div>
                          <span className="capitalize">{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.bank?.name || "—"}</TableCell>
                      <TableCell>
                        {transaction.purpose ? (
                          <span>
                            {transaction.purpose.name}
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({transaction.purpose.category?.name})
                            </span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold",
                          transaction.type === "income" ? "text-income" : "text-expense"
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}₱{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {transaction.remarks || "—"}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-expense">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will reverse the balance changes to your bank account and budget category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTransaction.mutate(transaction)}
                                className="bg-expense hover:bg-expense/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="flex justify-end gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Total Income: </span>
              <span className="font-semibold text-income">
                +₱{filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Expenses: </span>
              <span className="font-semibold text-expense">
                -₱{filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
