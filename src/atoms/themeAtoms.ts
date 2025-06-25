import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Theme types
export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

// Atom to store user preference in localStorage
export const themePreferenceAtom = atomWithStorage<ThemePreference>(
  "theme-preference",
  "system" // Default is system, but this should be overridden by localStorage
);

// Derived atom that determines actual theme based on preference and system setting
export const actualThemeAtom = atom<Theme>((get) => {
  const preference = get(themePreferenceAtom);

  console.log("Current theme preference:", preference); // Debug log

  if (preference === "system") {
    // Check if system prefers dark mode
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return systemPrefersDark ? "dark" : "light";
  }

  return preference;
});

// Atom to toggle theme
export const toggleThemeAtom = atom(
  null, // read function not needed
  (get, set) => {
    const currentPreference = get(themePreferenceAtom);
    console.log("Current theme preference:", currentPreference); // Debug log

    const nextPreference: ThemePreference =
      currentPreference === "light"
        ? "dark"
        : currentPreference === "dark"
        ? "system"
        : "light";

    console.log("Toggling theme from", currentPreference, "to", nextPreference);
    set(themePreferenceAtom, nextPreference);
  }
);
