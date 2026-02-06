-- Create bank_adjustments table to log all balance adjustments
CREATE TABLE public.bank_adjustments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_id UUID NOT NULL REFERENCES public.banks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  previous_balance NUMERIC NOT NULL,
  new_balance NUMERIC NOT NULL,
  adjustment_amount NUMERIC NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bank_adjustments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own bank adjustments"
ON public.bank_adjustments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank adjustments"
ON public.bank_adjustments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank adjustments"
ON public.bank_adjustments
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_bank_adjustments_bank_id ON public.bank_adjustments(bank_id);
CREATE INDEX idx_bank_adjustments_user_id ON public.bank_adjustments(user_id);
CREATE INDEX idx_bank_adjustments_created_at ON public.bank_adjustments(created_at DESC);