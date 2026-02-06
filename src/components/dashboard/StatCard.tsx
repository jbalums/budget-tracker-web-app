import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: "default" | "income" | "expense";
  subtitle?: string;
}

export function StatCard({ title, value, icon, variant = "default", subtitle }: StatCardProps) {
  return (
    <Card className={cn(
      "stat-card-hover overflow-hidden",
      variant === "income" && "border-income/20 bg-income-muted",
      variant === "expense" && "border-expense/20 bg-expense-muted"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn(
              "font-display text-2xl font-bold",
              variant === "income" && "text-income",
              variant === "expense" && "text-expense"
            )}>
              {typeof value === "number" ? `₱${value.toLocaleString()}` : value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            variant === "default" && "bg-secondary",
            variant === "income" && "bg-income/10",
            variant === "expense" && "bg-expense/10"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
