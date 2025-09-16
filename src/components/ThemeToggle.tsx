import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">☀️</span>
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <span className="text-sm font-medium">🌙</span>
    </div>
  );
}