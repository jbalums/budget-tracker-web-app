import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BudgetCategory } from "@/hooks/useBudgetData";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface BudgetProgressProps {
  categories: BudgetCategory[];
  monthlyIncome: number;
}

const categoryColors: Record<string, string> = {
  Needs: "bg-income",
  Wants: "bg-wants",
  Investments: "bg-investment",
  Emergency: "bg-emergency",
};

export function BudgetProgress({ categories, monthlyIncome }: BudgetProgressProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Budget Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => {
          const baseLimit = monthlyIncome * (category.percentage / 100);
          // Include rollover in the available budget for all categories
          const rollover = category.rollover_balance || 0;
          const totalLimit = baseLimit + rollover;
          const percentage = totalLimit > 0 ? (category.spent / totalLimit) * 100 : 0;
          const isWarning = percentage >= 80 && percentage < 100;
          const isExceeded = percentage >= 100;

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      categoryColors[category.name] || "bg-accent"
                    )}
                  />
                  <span className="font-medium">{category.name}</span>
                  {(isWarning || isExceeded) && (
                    <AlertTriangle
                      className={cn(
                        "h-4 w-4",
                        isExceeded ? "text-expense" : "text-emergency"
                      )}
                    />
                  )}
                </div>
                <span className="text-muted-foreground">
                  ₱{category.spent.toLocaleString()} / ₱{totalLimit.toLocaleString()}
                </span>
              </div>
              <div className="relative overflow-hidden rounded-full bg-secondary h-2">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isExceeded
                      ? "bg-expense"
                      : isWarning
                      ? "bg-emergency"
                      : categoryColors[category.name] || "bg-accent"
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {category.percentage}% of income{rollover > 0 && ` + ₱${rollover.toLocaleString()} rollover`} • {Math.round(percentage)}% used
              </p>
            </div>
          );
        })}

        {categories.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No budget categories set up yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
