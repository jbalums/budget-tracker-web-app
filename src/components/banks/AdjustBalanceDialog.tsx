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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ArrowUpDown } from "lucide-react";
import { Bank } from "@/hooks/useBudgetData";

interface AdjustBalanceDialogProps {
  bank: Bank;
  onAdjust: (data: {
    bankId: string;
    newBalance: number;
    reason?: string;
  }) => Promise<void>;
  isPending: boolean;
}

export function AdjustBalanceDialog({ bank, onAdjust, isPending }: AdjustBalanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"set" | "add" | "subtract">("set");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const calculateNewBalance = () => {
    const value = parseFloat(amount) || 0;
    switch (adjustmentType) {
      case "add":
        return bank.balance + value;
      case "subtract":
        return Math.max(0, bank.balance - value);
      case "set":
      default:
        return value;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdjust({
      bankId: bank.id,
      newBalance: calculateNewBalance(),
      reason: reason.trim() || undefined,
    });
    setAmount("");
    setReason("");
    setAdjustmentType("set");
    setOpen(false);
  };

  const newBalance = calculateNewBalance();
  const difference = newBalance - bank.balance;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="mr-1 h-3 w-3" />
          Adjust
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Balance</DialogTitle>
          <DialogDescription>
            Adjust the balance for {bank.name}. Current: ₱{Number(bank.balance).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup
            value={adjustmentType}
            onValueChange={(v) => setAdjustmentType(v as "set" | "add" | "subtract")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="set" id="set" />
              <Label htmlFor="set" className="cursor-pointer">Set to</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="add" id="add" />
              <Label htmlFor="add" className="cursor-pointer">Add</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subtract" id="subtract" />
              <Label htmlFor="subtract" className="cursor-pointer">Subtract</Label>
            </div>
          </RadioGroup>

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
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Bank statement reconciliation, Interest deposit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          <div className="rounded-lg bg-secondary p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Balance:</span>
              <span>₱{Number(bank.balance).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Adjustment:</span>
              <span className={difference >= 0 ? "text-income" : "text-expense"}>
                {difference >= 0 ? "+" : ""}₱{difference.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-medium">
              <span>New Balance:</span>
              <span>₱{newBalance.toLocaleString()}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !amount}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Adjustment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}