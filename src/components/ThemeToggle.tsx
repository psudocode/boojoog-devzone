import { useAtomValue, useSetAtom } from "jotai";
import { Moon, Sun, Monitor } from "lucide-react";
import { themeSettingAtom, setThemeAtom } from "../atoms/consolidatedAtoms";

export default function ThemeToggle() {
  const theme = useAtomValue(themeSettingAtom);
  const setTheme = useSetAtom(setThemeAtom);

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system -> light
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      {theme === "light" && <Sun size={20} />}
      {theme === "dark" && <Moon size={20} />}
      {theme === "system" && <Monitor size={20} />}
    </button>
  );
}
