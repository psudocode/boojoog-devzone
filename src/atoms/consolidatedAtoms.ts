import { atom } from "jotai";
import { 
  getAppSettings, 
  setThemeSetting,
  updateGeneralSettings,
  updateLocalSitesSettings,
  setNginxConfigPathSettings,
  clearNginxSettings
} from "../helpers/ipcHandler";
import { AppSettings } from "../../electron/app/settings/settingsManager";

// ============================================================================
// CONSOLIDATED SETTINGS ATOMS - Single source of truth
// ============================================================================

// Base settings atom - single source of truth for all app settings
export const appSettingsAtom = atom<AppSettings | null>(null);

// Loading and error states
export const settingsLoadingAtom = atom<boolean>(false);
export const settingsErrorAtom = atom<Error | null>(null);

// ============================================================================
// THEME ATOMS - Consolidated theme management
// ============================================================================

// System theme detection atom
export const systemThemeAtom = atom<'light' | 'dark'>('light');

// Current theme setting from app settings
export const themeSettingAtom = atom<'light' | 'dark' | 'system'>((get) => {
  const settings = get(appSettingsAtom);
  const theme = settings?.general.theme;
  
  // Validate theme value and fallback to 'system' if invalid
  const validThemes: readonly string[] = ['light', 'dark', 'system'];
  if (theme && validThemes.includes(theme)) {
    return theme as 'light' | 'dark' | 'system';
  }
  
  return 'system';
});

// Effective theme (resolves 'system' to actual theme)
export const currentThemeAtom = atom<'light' | 'dark'>((get) => {
  const themeSetting = get(themeSettingAtom);
  if (themeSetting === 'system') {
    return get(systemThemeAtom);
  }
  return themeSetting;
});

// Theme toggle action
export const setThemeAtom = atom(
  null,
  async (_, set, theme: 'light' | 'dark' | 'system') => {
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

// ============================================================================
// NGINX ATOMS - Consolidated nginx management
// ============================================================================

// Nginx settings atom (derived from app settings)
export const nginxSettingsAtom = atom<{
  configPath?: string;
  enabledPath?: string;
  lastConfigured?: string;
  isConfigured: boolean;
  validation: { isValid: boolean; error?: string };
} | null>((get) => {
  const settings = get(appSettingsAtom);
  if (!settings) return null;
  
  return {
    configPath: settings.nginx.configPath,
    enabledPath: settings.nginx.enabledPath,
    lastConfigured: settings.nginx.lastConfigured,
    isConfigured: Boolean(settings.nginx.configPath),
    validation: { isValid: Boolean(settings.nginx.configPath), error: undefined }
  };
});

// Nginx configuration path atoms (derived)
export const nginxConfigPathAtom = atom<string | undefined>((get) => {
  const nginxSettings = get(nginxSettingsAtom);
  return nginxSettings?.configPath;
});

export const nginxEnabledPathAtom = atom<string | undefined>((get) => {
  const nginxSettings = get(nginxSettingsAtom);
  return nginxSettings?.enabledPath;
});

export const nginxPathConfiguredAtom = atom<boolean>((get) => {
  const nginxSettings = get(nginxSettingsAtom);
  return nginxSettings?.isConfigured || false;
});

// Nginx actions
export const setNginxConfigPathAtom = atom(
  null,
  async (_, set, data: { configPath: string; enabledPath?: string }) => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      await setNginxConfigPathSettings(data.configPath, data.enabledPath);
      
      // Reload app settings after update
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

export const clearNginxSettingsAtom = atom(
  null,
  async (_, set) => {
    try {
      set(settingsLoadingAtom, true);
      set(settingsErrorAtom, null);

      await clearNginxSettings();
      
      // Reload app settings after clearing
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

// ============================================================================
// GENERAL SETTINGS ATOMS
// ============================================================================

export const autoStartAtom = atom<boolean>((get) => {
  const settings = get(appSettingsAtom);
  return settings?.general.autoStart || false;
});

export const checkForUpdatesAtom = atom<boolean>((get) => {
  const settings = get(appSettingsAtom);
  return settings?.general.checkForUpdates !== false; // Default to true
});

// ============================================================================
// LOCAL SITES SETTINGS ATOMS
// ============================================================================

export const autoOpenAfterCreateAtom = atom<boolean>((get) => {
  const settings = get(appSettingsAtom);
  return settings?.localSites.autoOpenAfterCreate || false;
});

// ============================================================================
// ACTION ATOMS - Main operations
// ============================================================================

// Load all settings from backend
export const loadAppSettingsAtom = atom(
  null,
  async (_, set) => {
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

// Update general settings
export const updateGeneralSettingsAtom = atom(
  null,
  async (_, set, settings: {
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
  async (_, set, settings: {
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
  (_, set) => {
    set(settingsErrorAtom, null);
  }
);

// ============================================================================
// SYSTEM THEME DETECTION - Initialize system theme detection
// ============================================================================

// Initialize system theme detection atom (call once in App.tsx)
export const initSystemThemeDetectionAtom = atom(
  null,
  (_, set) => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      set(systemThemeAtom, mediaQuery.matches ? "dark" : "light");
    };

    // Set initial theme
    updateSystemTheme();

    // Listen for changes
    mediaQuery.addEventListener("change", updateSystemTheme);
    
    // Return cleanup function
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }
);

// ============================================================================
// NGINX CONFIG MANAGEMENT ATOMS - For nginx configuration files
// ============================================================================

// Import nginx functions for config management
import {
  getAllNginxConfigs,
  getBoojoogNginxConfigs,
  validateNginxConfigPath,
  createNginxConfig,
  updateNginxConfig,
  removeNginxConfig,
} from "../helpers/ipcHandler";
import { NginxConfig } from "../../electron/app/nginx/nginx";

// Nginx configurations storage
export const allNginxConfigsAtom = atom<NginxConfig[]>([]);
export const boojoogNginxConfigsAtom = atom<NginxConfig[]>([]);
export const selectedNginxConfigAtom = atom<NginxConfig | null>(null);
export const nginxEditModeAtom = atom<boolean>(false);
export const nginxLoadingAtom = atom<boolean>(false);
export const nginxErrorAtom = atom<Error | null>(null);

// Fetch all nginx configurations
export const fetchAllNginxConfigsAtom = atom(
  null,
  async (_, set) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      const configs = await getAllNginxConfigs();
      set(allNginxConfigsAtom, configs);
    } catch (error) {
      set(nginxErrorAtom, error instanceof Error ? error : new Error('Failed to fetch nginx configs'));
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Fetch Boojoog-managed nginx configurations
export const fetchBoojoogNginxConfigsAtom = atom(
  null,
  async (_, set) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      const configs = await getBoojoogNginxConfigs();
      set(boojoogNginxConfigsAtom, configs);
    } catch (error) {
      set(nginxErrorAtom, error instanceof Error ? error : new Error('Failed to fetch Boojoog nginx configs'));
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Validate nginx configuration path
export const validateNginxConfigPathAtom = atom(
  null,
  async (_, set, configPath: string) => {
    try {
      return await validateNginxConfigPath(configPath);
    } catch (error) {
      set(nginxErrorAtom, error instanceof Error ? error : new Error('Failed to validate nginx path'));
      return false;
    }
  }
);

// Create nginx configuration
export const createNginxConfigAtom = atom(
  null,
  async (_, set, data: { filename: string; content: string }) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      const newConfig = await createNginxConfig(data.filename, data.content);
      
      // Refresh configs
      await set(fetchBoojoogNginxConfigsAtom);
      
      return newConfig;
    } catch (error) {
      set(nginxErrorAtom, error instanceof Error ? error : new Error('Failed to create nginx config'));
      throw error;
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Update nginx configuration
export const updateNginxConfigAtom = atom(
  null,
  async (_, set, data: { filename: string; content: string }) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      const updatedConfig = await updateNginxConfig(data.filename, data.content);
      
      // Refresh configs
      await set(fetchBoojoogNginxConfigsAtom);
      
      return updatedConfig;
    } catch (error) {
      set(nginxErrorAtom, error instanceof Error ? error : new Error('Failed to update nginx config'));
      throw error;
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Remove nginx configuration
export const removeNginxConfigAtom = atom(
  null,
  async (get, set, filename: string) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      await removeNginxConfig(filename);
      
      // Refresh configs
      await set(fetchBoojoogNginxConfigsAtom);
      
      // Clear selected config if it was the one being removed
      const selected = get(selectedNginxConfigAtom);
      if (selected && selected.filename === filename) {
        set(selectedNginxConfigAtom, null);
      }
    } catch (error) {
      set(nginxErrorAtom, error instanceof Error ? error : new Error('Failed to remove nginx config'));
      throw error;
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Clear nginx error
export const clearNginxErrorAtom = atom(
  null,
  (_, set) => {
    set(nginxErrorAtom, null);
  }
);

// Toggle nginx edit mode
export const toggleNginxEditModeAtom = atom(
  null,
  (get, set, newMode?: boolean) => {
    if (newMode !== undefined) {
      set(nginxEditModeAtom, newMode);
    } else {
      const currentMode = get(nginxEditModeAtom);
      set(nginxEditModeAtom, !currentMode);
    }
  }
);

// ============================================================================
