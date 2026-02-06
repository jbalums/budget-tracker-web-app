import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { BudgetCategory } from "@/hooks/useBudgetData";

interface BudgetChartProps {
  categories: BudgetCategory[];
  monthlyIncome: number;
}

const COLORS: Record<string, string> = {
  Needs: "#10b981",
  Wants: "#8b5cf6",
  Investments: "#3b82f6",
  Emergency: "#f59e0b",
};

export function BudgetChart({ categories, monthlyIncome }: BudgetChartProps) {
  const data = categories.map((category) => ({
    name: category.name,
    value: monthlyIncome * (category.percentage / 100),
    spent: category.spent,
    color: COLORS[category.name] || "#6366f1",
  }));

  if (data.length === 0 || monthlyIncome === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Set your monthly income to see budget allocation
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Budget Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-popover p-3 shadow-lg">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Budget: ₱{data.value.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Spent: ₱{data.spent.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
