import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBudgetData, Bank, Purpose } from "@/hooks/useBudgetData";
import { Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";

export function AddTransactionDialog() {
  const { banks, purposes, addTransaction } = useBudgetData();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [bankId, setBankId] = useState("");
  const [purposeId, setPurposeId] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addTransaction.mutateAsync({
      bank_id: bankId,
      purpose_id: type === "expense" ? purposeId : undefined,
      type,
      amount: parseFloat(amount),
      remarks: remarks || undefined,
      transaction_date: date,
    });

    // Reset form
    setBankId("");
    setPurposeId("");
    setAmount("");
    setRemarks("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setOpen(false);
  };

  const selectedBank = banks.find((b) => b.id === bankId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={type} onValueChange={(v) => setType(v as "income" | "expense")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income" className="data-[state=active]:bg-income data-[state=active]:text-income-foreground">
                Income
              </TabsTrigger>
              <TabsTrigger value="expense" className="data-[state=active]:bg-expense data-[state=active]:text-expense-foreground">
                Expense
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="bank">Bank Account</Label>
            <Select value={bankId} onValueChange={setBankId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a bank" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name} (₱{bank.balance.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBank && (
              <p className="text-xs text-muted-foreground">
                Owner: {selectedBank.owner}
              </p>
            )}
          </div>

          {type === "expense" && (
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Select value={purposeId} onValueChange={setPurposeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a purpose" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {purposes.map((purpose) => (
                    <SelectItem key={purpose.id} value={purpose.id}>
                      {purpose.name} ({purpose.category?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₱)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Add notes about this transaction..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={addTransaction.isPending || !bankId || !amount}
          >
            {addTransaction.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Record Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
