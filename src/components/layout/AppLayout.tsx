import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Target,
  Receipt,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/banks", label: "Banks", icon: Wallet },
  { path: "/budgets", label: "Budgets", icon: PieChart },
  { path: "/purposes", label: "Purposes", icon: Target },
  { path: "/records", label: "Records", icon: Receipt },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const currentPage = navItems.find((item) => item.path === location.pathname);

  return (
		<div className="flex min-h-screen bg-background">
			{/* Desktop Sidebar */}
			<aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
				<div className="flex h-16 items-center gap-2 border-b border-border px-6">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
						<Wallet className="h-5 w-5 text-accent-foreground" />
					</div>
					<span className="font-display text-lg font-bold">
						Budget Tracker
					</span>
				</div>

				<nav className="flex-1 space-y-1 p-4">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
									isActive
										? "bg-accent text-accent-foreground"
										: "text-muted-foreground hover:bg-secondary hover:text-foreground",
								)}
							>
								<Icon className="h-5 w-5" />
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="border-t border-border p-4">
					<div className="mb-3 flex items-center justify-between px-3">
						<span className="text-xs text-muted-foreground">
							{user?.email}
						</span>
						<ThemeToggle />
					</div>
					<Button
						variant="ghost"
						className="w-full justify-start gap-3 text-muted-foreground hover:text-white"
						onClick={handleSignOut}
					>
						<LogOut className="h-5 w-5" />
						Sign Out
					</Button>
				</div>
			</aside>

			{/* Mobile Header & Content */}
			<div className="flex flex-1 flex-col">
				{/* Mobile Header */}
				<header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
					<div className="flex items-center gap-2">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
							<Wallet className="h-5 w-5 text-accent-foreground" />
						</div>
						<span className="font-display text-lg font-bold">
							Budget Tracker
						</span>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</Button>
				</header>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="absolute inset-0 top-16 z-50 bg-card lg:hidden">
						<nav className="space-y-1 p-4">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive =
									location.pathname === item.path;
								return (
									<Link
										key={item.path}
										to={item.path}
										onClick={() => setMobileMenuOpen(false)}
										className={cn(
											"flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
											isActive
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-secondary hover:text-foreground",
										)}
									>
										<Icon className="h-5 w-5" />
										{item.label}
										<ChevronRight className="ml-auto h-4 w-4" />
									</Link>
								);
							})}
						</nav>
						<div className="border-t border-border p-4">
							<Button
								variant="ghost"
								className="w-full justify-start gap-3 text-muted-foreground hover:text-white"
								onClick={handleSignOut}
							>
								<LogOut className="h-5 w-5" />
								Sign Out
							</Button>
						</div>
					</div>
				)}

				{/* Page Content */}
				<main className="flex-1 overflow-auto">
					<div className="container max-w-7xl py-6 px-4 lg:py-8">
						{currentPage && (
							<div className="mb-6">
								<h1 className="font-display text-2xl font-bold lg:text-3xl">
									{currentPage.label}
								</h1>
							</div>
						)}
						{children}
					</div>
				</main>
			</div>
		</div>
  );
}
