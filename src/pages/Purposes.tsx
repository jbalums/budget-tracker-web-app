import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useBudgetData } from "@/hooks/useBudgetData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Target, Trash2 } from "lucide-react";
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

const categoryColors: Record<string, string> = {
  Needs: "bg-income",
  Wants: "bg-wants",
  Investments: "bg-investment",
  Emergency: "bg-emergency",
};

export default function Purposes() {
  const { purposes, categories, addPurpose, deletePurpose, isLoading } = useBudgetData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPurpose.mutateAsync({ name, category_id: categoryId });
    setName("");
    setCategoryId("");
    setDialogOpen(false);
  };

  // Group purposes by category
  const purposesByCategory = categories.map((category) => ({
    category,
    purposes: purposes.filter((p) => p.category_id === category.id),
  }));

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Organize your expenses by purpose
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Purpose
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Purpose</DialogTitle>
                <DialogDescription>Create a new spending purpose</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Purpose Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Groceries, Utilities, Gym"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={addPurpose.isPending || !categoryId}>
                  {addPurpose.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Purpose
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Purposes by Category */}
        {purposesByCategory.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 font-semibold">No purposes yet</h3>
              <p className="mb-4 text-sm text-muted-foreground text-center">
                Create purposes to categorize your expenses
              </p>
              <Button onClick={() => setDialogOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Purpose
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {purposesByCategory.map(({ category, purposes: catPurposes }) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${categoryColors[category.name] || "bg-accent"}`} />
                    <CardTitle className="text-base">{category.name}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      ({catPurposes.length} purposes)
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {catPurposes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No purposes in this category</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {catPurposes.map((purpose) => (
                        <div
                          key={purpose.id}
                          className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5"
                        >
                          <span className="text-sm font-medium">{purpose.name}</span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-expense">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete {purpose.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This purpose will be removed. Transactions using this purpose won't be deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deletePurpose.mutate(purpose.id)}
                                  className="bg-expense hover:bg-expense/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
