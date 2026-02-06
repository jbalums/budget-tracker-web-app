import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-accent" />
          ) : (
            <Sun className="h-5 w-5 text-accent" />
          )}
        </div>
        <div>
          <Label htmlFor="dark-mode" className="text-sm font-medium">
            Dark Mode
          </Label>
          <p className="text-xs text-muted-foreground">
            Switch between light and dark themes
          </p>
        </div>
      </div>
      <Switch
        id="dark-mode"
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}
