import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  Wallet,
  PieChart,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Multi-Bank Tracking",
    description: "Track balances across all your bank accounts in one place",
  },
  {
    icon: PieChart,
    title: "Smart Budgeting",
    description: "Allocate your income with percentage-based budget categories",
  },
  {
    icon: TrendingUp,
    title: "Expense Insights",
    description: "Visual charts and progress bars to monitor your spending",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and protected",
  },
];

const benefits = [
  "Track income and expenses effortlessly",
  "Set up budget categories: Needs, Wants, Investments, Emergency",
  "Get warnings when approaching budget limits",
  "View detailed transaction history with filters",
  "Beautiful charts and analytics",
];

export default function Index() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <Wallet className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="font-display text-lg font-bold">BudgetFlow</span>
          </div>
          <div className="flex items-center gap-3">
            {loading ? null : user ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight lg:text-6xl">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-accent to-investment bg-clip-text text-transparent">
                Finances
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
              A beautiful, simple budget tracker to manage your income, expenses,
              and savings goals. Track multiple bank accounts, set budget limits,
              and never overspend again.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2 px-8">
                <Link to="/register">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 bg-card/30 py-20">
        <div className="container px-4">
          <h2 className="mb-12 text-center font-display text-2xl font-bold lg:text-3xl">
            Everything you need to manage your money
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border/50 bg-card p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-center font-display text-2xl font-bold lg:text-3xl">
              Why BudgetFlow?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-income" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button size="lg" asChild>
                <Link to="/register">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent" />
              <span className="font-display font-semibold">BudgetFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 BudgetFlow. Your personal finance companion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
