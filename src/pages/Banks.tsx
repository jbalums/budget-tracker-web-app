import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useBudgetData, Bank } from "@/hooks/useBudgetData";
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
import { Plus, Loader2, Pencil, Trash2, Building2 } from "lucide-react";
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

export default function Banks() {
  const { banks, addBank, updateBank, deleteBank, isLoading } = useBudgetData();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  
  // Add form state
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [owner, setOwner] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBank.mutateAsync({
      name,
      balance: parseFloat(balance) || 0,
      owner,
    });
    setName("");
    setBalance("");
    setOwner("");
    setAddDialogOpen(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBank) return;
    await updateBank.mutateAsync({
      id: editingBank.id,
      name,
      owner,
    });
    setEditDialogOpen(false);
    setEditingBank(null);
  };

  const openEditDialog = (bank: Bank) => {
    setEditingBank(bank);
    setName(bank.name);
    setOwner(bank.owner);
    setEditDialogOpen(true);
  };

  const totalBalance = banks.reduce((sum, bank) => sum + Number(bank.balance), 0);

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
          <div>
            <p className="text-muted-foreground">
              Total Balance: <span className="font-semibold text-foreground">₱{totalBalance.toLocaleString()}</span>
            </p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Bank
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Bank Account</DialogTitle>
                <DialogDescription>Add a new bank account to track</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bank Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., BDO Savings"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Account Owner</Label>
                  <Input
                    id="owner"
                    placeholder="e.g., John Doe"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Initial Balance (₱)</Label>
                  <Input
                    id="balance"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addBank.isPending}>
                  {addBank.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Bank
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Banks Grid */}
        {banks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 font-semibold">No bank accounts yet</h3>
              <p className="mb-4 text-sm text-muted-foreground text-center">
                Add your first bank account to start tracking your finances
              </p>
              <Button onClick={() => setAddDialogOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Bank Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banks.map((bank) => (
              <Card key={bank.id} className="stat-card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                        <Building2 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{bank.name}</CardTitle>
                        <CardDescription>{bank.owner}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 font-display text-2xl font-bold">
                    ₱{Number(bank.balance).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(bank)}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-expense hover:text-expense">
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {bank.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this bank account and all associated transactions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBank.mutate(bank.id)}
                            className="bg-expense hover:bg-expense/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Bank Account</DialogTitle>
              <DialogDescription>Update bank account details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Bank Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-owner">Account Owner</Label>
                <Input
                  id="edit-owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={updateBank.isPending}>
                {updateBank.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
