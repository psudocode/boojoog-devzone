import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { currentThemeAtom, systemThemeAtom } from "../atoms/consolidatedAtoms";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme] = useAtom(currentThemeAtom);
  const setSystemTheme = useSetAtom(systemThemeAtom);

  // Detect system theme preference and update atom
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    // Set initial theme
    updateSystemTheme();

    // Listen for changes
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, [setSystemTheme]);

  // Apply theme to document
  useEffect(() => {
    console.log(`Applying theme: ${currentTheme}`);

    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(currentTheme);

    // Apply theme styles
    if (currentTheme === "dark") {
      document.body.style.backgroundColor = "#1a1a1a";
      document.body.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    }
  }, [currentTheme]);

  return <>{children}</>;
}
