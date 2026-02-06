import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BankAdjustment } from "@/hooks/useBankAdjustments";
import { Bank } from "@/hooks/useBudgetData";

interface BankLogsSheetProps {
  bank: Bank;
  adjustments: BankAdjustment[];
  isLoading: boolean;
}

export function BankLogsSheet({ bank, adjustments, isLoading }: BankLogsSheetProps) {
  const bankAdjustments = adjustments.filter((a) => a.bank_id === bank.id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="mr-1 h-3 w-3" />
          Logs
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Balance History</SheetTitle>
          <SheetDescription>
            Adjustment history for {bank.name}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-6 h-[calc(100vh-140px)]">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : bankAdjustments.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <History className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No adjustments yet</p>
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {bankAdjustments.map((adjustment) => {
                const isPositive = adjustment.adjustment_amount > 0;
                const isZero = adjustment.adjustment_amount === 0;
                
                return (
                  <div
                    key={adjustment.id}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {isZero ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ) : isPositive ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-income/10">
                            <TrendingUp className="h-4 w-4 text-income" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-expense/10">
                            <TrendingDown className="h-4 w-4 text-expense" />
                          </div>
                        )}
                        <div>
                          <p className={`font-medium ${
                            isZero ? "text-muted-foreground" :
                            isPositive ? "text-income" : "text-expense"
                          }`}>
                            {isPositive ? "+" : ""}₱{Number(adjustment.adjustment_amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(adjustment.created_at), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          ₱{Number(adjustment.previous_balance).toLocaleString()}
                        </p>
                        <p className="font-medium">
                          → ₱{Number(adjustment.new_balance).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {adjustment.reason && (
                      <p className="mt-2 text-sm text-muted-foreground border-t border-border pt-2">
                        {adjustment.reason}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}