import { atom } from "jotai";
import { 
  getAppSettings, 
  getNginxSettings, 
  setNginxConfigPathSettings, 
  clearNginxSettings,
  setThemeSetting,
  updateGeneralSettings,
  updateLocalSitesSettings
} from "../helpers/ipcHandler";
import { AppSettings } from "../../electron/app/settings/settingsManager";

// Base settings atoms
export const appSettingsAtom = atom<AppSettings | null>(null);
export const settingsLoadingAtom = atom<boolean>(false);
export const settingsErrorAtom = atom<Error | null>(null);

// Derived atoms for specific settings sections
export const nginxSettingsAtom = atom<{
  configPath?: string;
  enabledPath?: string;
  lastConfigured?: string;
  isConfigured: boolean;
  validation: { isValid: boolean; error?: string };
} | null>(null);

export const themeAtom = atom<'light' | 'dark' | 'system'>((get) => {
  const settings = get(appSettingsAtom);
  const theme = settings?.general.theme;
  
  // Validate theme value and fallback to 'system' if invalid
  const validThemes: readonly string[] = ['light', 'dark', 'system'];
  if (theme && validThemes.includes(theme)) {
    return theme as 'light' | 'dark' | 'system';
  }
  
  return 'system';
});

export const autoStartAtom = atom<boolean>((get) => {
  const settings = get(appSettingsAtom);
  return settings?.general.autoStart || false;
});

export const autoOpenAfterCreateAtom = atom<boolean>((get) => {
  const settings = get(appSettingsAtom);
  return settings?.localSites.autoOpenAfterCreate || false;
});

// Action atoms

// Load all settings
export const loadAppSettingsAtom = atom(
  null,
  async (_get, set) => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      const settings = await getAppSettings();
      set(appSettingsAtom, settings);
    } catch (error) {
      set(settingsErrorAtom, error instanceof Error ? error : new Error('Failed to load settings'));
    } finally {
      set(settingsLoadingAtom, false);
    }
  }
);

// Load nginx settings specifically
export const loadNginxSettingsAtom = atom(
  null,
  async (_get, set) => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      const nginxSettings = await getNginxSettings();
      set(nginxSettingsAtom, nginxSettings);
    } catch (error) {
      set(settingsErrorAtom, error instanceof Error ? error : new Error('Failed to load nginx settings'));
    } finally {
      set(settingsLoadingAtom, false);
    }
  }
);

// Set nginx configuration path
export const setNginxConfigPathAtom = atom(
  null,
  async (_get, set, data: { configPath: string; enabledPath?: string }) => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      await setNginxConfigPathSettings(data.configPath, data.enabledPath);
      
      // Reload nginx settings after update
      const nginxSettings = await getNginxSettings();
      set(nginxSettingsAtom, nginxSettings);
      
      // Also reload full app settings
      const appSettings = await getAppSettings();
      set(appSettingsAtom, appSettings);
    } catch (error) {
      set(settingsErrorAtom, error instanceof Error ? error : new Error('Failed to set nginx configuration path'));
      throw error;
    } finally {
      set(settingsLoadingAtom, false);
    }
  }
);

// Clear nginx settings
export const clearNginxSettingsAtom = atom(
  null,
  async (_get, set) => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      await clearNginxSettings();
      
      // Reload settings after clearing
      const nginxSettings = await getNginxSettings();
      set(nginxSettingsAtom, nginxSettings);
      
      const appSettings = await getAppSettings();
      set(appSettingsAtom, appSettings);
    } catch (error) {
      set(settingsErrorAtom, error instanceof Error ? error : new Error('Failed to clear nginx settings'));
      throw error;
    } finally {
      set(settingsLoadingAtom, false);
    }
  }
);

// Set theme
export const setThemeAtom = atom(
  null,
  async (_get, set, theme: 'light' | 'dark' | 'system') => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      await setThemeSetting(theme);
      
      // Reload app settings after update
      const appSettings = await getAppSettings();
      set(appSettingsAtom, appSettings);
    } catch (error) {
      set(settingsErrorAtom, error instanceof Error ? error : new Error('Failed to set theme'));
      throw error;
    } finally {
      set(settingsLoadingAtom, false);
    }
  }
);

// Update general settings
export const updateGeneralSettingsAtom = atom(
  null,
  async (_get, set, settings: {
    theme?: 'light' | 'dark' | 'system';
    autoStart?: boolean;
    checkForUpdates?: boolean;
  }) => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      await updateGeneralSettings(settings);
      
      // Reload app settings after update
      const appSettings = await getAppSettings();
      set(appSettingsAtom, appSettings);
    } catch (error) {
      set(settingsErrorAtom, error instanceof Error ? error : new Error('Failed to update general settings'));
      throw error;
    } finally {
      set(settingsLoadingAtom, false);
    }
  }
);

// Update local sites settings
export const updateLocalSitesSettingsAtom = atom(
  null,
  async (_get, set, settings: {
    autoOpenAfterCreate?: boolean;
  }) => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      await updateLocalSitesSettings(settings);
      
      // Reload app settings after update
      const appSettings = await getAppSettings();
      set(appSettingsAtom, appSettings);
    } catch (error) {
      set(settingsErrorAtom, error instanceof Error ? error : new Error('Failed to update local sites settings'));
      throw error;
    } finally {
      set(settingsLoadingAtom, false);
    }
  }
);

// Clear settings error
export const clearSettingsErrorAtom = atom(
  null,
  (_get, set) => {
    set(settingsErrorAtom, null);
  }
);
