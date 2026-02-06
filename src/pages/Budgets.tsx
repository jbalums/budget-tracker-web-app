import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useBudgetData } from "@/hooks/useBudgetData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Save, PieChart, RefreshCw, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categoryColors: Record<string, string> = {
  Needs: "bg-income",
  Wants: "bg-wants",
  Investments: "bg-investment",
  Emergency: "bg-emergency",
};

export default function Budgets() {
  const { profile, categories, updateProfile, updateCategory, resetMonthlyBudgets, needsMonthlyReset, isLoading } = useBudgetData();
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [saving, setSaving] = useState(false);
  const [categoryValues, setCategoryValues] = useState<Record<string, string>>({});

  // Initialize values when data loads
  useState(() => {
    if (profile?.monthly_income) {
      setMonthlyIncome(profile.monthly_income.toString());
    }
  });

  const handleSaveIncome = async () => {
    setSaving(true);
    await updateProfile.mutateAsync({ monthly_income: parseFloat(monthlyIncome) || 0 });
    
    // Recalculate all category limits based on new income
    const income = parseFloat(monthlyIncome) || 0;
    for (const category of categories) {
      const limit = income * (category.percentage / 100);
      await updateCategory.mutateAsync({ id: category.id, monthly_limit: limit });
    }
    
    toast({ title: "Monthly income updated", description: "Budget limits have been recalculated" });
    setSaving(false);
  };

  const handlePercentageChange = async (categoryId: string, percentage: string) => {
    setCategoryValues((prev) => ({ ...prev, [categoryId]: percentage }));
  };

  const handleSavePercentage = async (categoryId: string) => {
    const percentage = parseFloat(categoryValues[categoryId] || "0");
    const income = profile?.monthly_income || 0;
    const limit = income * (percentage / 100);
    
    await updateCategory.mutateAsync({
      id: categoryId,
      percentage,
      monthly_limit: limit,
    });
    
    toast({ title: "Category updated" });
  };

  const income = profile?.monthly_income || 0;
  const totalPercentage = categories.reduce((sum, c) => sum + Number(c.percentage), 0);

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
        {/* Monthly Reset Alert */}
        {needsMonthlyReset && (
          <Alert>
            <RefreshCw className="h-4 w-4" />
            <AlertTitle>New Month Detected</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Reset budgets for the new month? Unused balances will roll over.</span>
              <Button 
                size="sm" 
                onClick={() => resetMonthlyBudgets.mutate()}
                disabled={resetMonthlyBudgets.isPending}
              >
                {resetMonthlyBudgets.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Now"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Rollover Info */}
        <Alert variant="default" className="border-accent/30 bg-accent/5">
          <Info className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent">Budget Rollover Feature</AlertTitle>
          <AlertDescription>
            Unused budget from all categories rolls over to the next month. Only positive balances carry forward.
          </AlertDescription>
        </Alert>

        {/* Monthly Income Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-accent" />
              Monthly Income
            </CardTitle>
            <CardDescription>
              Set your monthly income to calculate budget allocations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Enter monthly income"
                  value={monthlyIncome || profile?.monthly_income || ""}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveIncome} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
            {income > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Current monthly budget: ₱{income.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Category Allocations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Budget Categories</h2>
            <p className={`text-sm ${totalPercentage !== 100 ? "text-emergency" : "text-income"}`}>
              Total: {totalPercentage}%
            </p>
          </div>

          {categories.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PieChart className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 font-semibold">No categories yet</h3>
                <p className="text-sm text-muted-foreground">
                  Categories will be created when you sign up
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category) => {
                const baseLimit = income * (category.percentage / 100);
                // Include rollover in the available budget for all categories
                const rollover = category.rollover_balance || 0;
                const limit = baseLimit + rollover;
                const percentUsed = limit > 0 ? (category.spent / limit) * 100 : 0;

                return (
                  <Card key={category.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full ${categoryColors[category.name] || "bg-accent"}`} />
                        <CardTitle className="text-base">{category.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`percentage-${category.id}`}>Percentage of Income</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`percentage-${category.id}`}
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={categoryValues[category.id] ?? category.percentage}
                            onChange={(e) => handlePercentageChange(category.id, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSavePercentage(category.id)}
                            disabled={updateCategory.isPending}
                          >
                            Save
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Limit:</span>
                          <span className="font-medium">₱{baseLimit.toLocaleString()}</span>
                        </div>
                        {rollover > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">+ Rollover:</span>
                            <span className="font-medium text-wants">₱{rollover.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Available:</span>
                          <span className="font-medium">₱{limit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Spent:</span>
                          <span className="font-medium">₱{category.spent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remaining:</span>
                          <span className={`font-medium ${limit - category.spent < 0 ? "text-expense" : "text-income"}`}>
                            ₱{(limit - category.spent).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full transition-all ${
                              percentUsed >= 100
                                ? "bg-expense"
                                : percentUsed >= 80
                                ? "bg-emergency"
                                : categoryColors[category.name] || "bg-accent"
                            }`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{Math.round(percentUsed)}% used</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
