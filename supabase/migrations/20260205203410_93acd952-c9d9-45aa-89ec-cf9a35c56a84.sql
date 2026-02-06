-- Add rollover_balance column to track carried-over amounts
ALTER TABLE public.budget_categories 
ADD COLUMN rollover_balance numeric DEFAULT 0;

-- Add last_reset_month to track when budgets were last reset
ALTER TABLE public.budget_categories 
ADD COLUMN last_reset_month date DEFAULT NULL;