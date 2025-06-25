import { atom } from "jotai";
import {
  getAllNginxConfigs,
  getBoojoogNginxConfigs,
  setNginxConfigPath,
  validateNginxConfigPath,
  createNginxConfig,
  updateNginxConfig,
  removeNginxConfig,
} from "../helpers/ipcHandler";
import { NginxConfig, NginxSettings } from "../../electron/app/nginx/nginx";

// Atom for storing nginx configuration settings
export const nginxSettingsAtom = atom<NginxSettings | null>(null);

// Atom for storing all nginx configurations
export const allNginxConfigsAtom = atom<NginxConfig[]>([]);

// Atom for storing only Boojoog-managed nginx configurations
export const boojoogNginxConfigsAtom = atom<NginxConfig[]>([]);

// Atom for loading state
export const nginxLoadingAtom = atom<boolean>(false);

// Atom for error state
export const nginxErrorAtom = atom<Error | null>(null);

// Atom for currently selected configuration
export const selectedNginxConfigAtom = atom<NginxConfig | null>(null);

// Atom for edit mode
export const nginxEditModeAtom = atom<boolean>(false);

// Action atoms for operations

// Set nginx configuration path action
export const setNginxConfigPathAtom = atom(
  null,
  async (_, set, settings: NginxSettings) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      await setNginxConfigPath(settings);
      set(nginxSettingsAtom, settings);
      
      // Fetch configs after setting path
      await set(fetchAllNginxConfigsAtom);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Unknown error");
      set(nginxErrorAtom, errorObj);
      throw errorObj;
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Validate nginx configuration path action
export const validateNginxConfigPathAtom = atom(
  null,
  async (_, __, configPath: string): Promise<boolean> => {
    try {
      return await validateNginxConfigPath(configPath);
    } catch (error) {
      return false;
    }
  }
);

// Fetch all nginx configurations action
export const fetchAllNginxConfigsAtom = atom(
  null,
  async (_, set) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      const configs = await getAllNginxConfigs();
      set(allNginxConfigsAtom, configs);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to fetch nginx configurations");
      set(nginxErrorAtom, errorObj);
      set(allNginxConfigsAtom, []);
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Fetch Boojoog-managed nginx configurations action
export const fetchBoojoogNginxConfigsAtom = atom(
  null,
  async (_, set) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      const configs = await getBoojoogNginxConfigs();
      set(boojoogNginxConfigsAtom, configs);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to fetch Boojoog nginx configurations");
      set(nginxErrorAtom, errorObj);
      set(boojoogNginxConfigsAtom, []);
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Create nginx configuration action
export const createNginxConfigAtom = atom(
  null,
  async (_, set, data: { filename: string; content: string }) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      const newConfig = await createNginxConfig(data.filename, data.content);
      
      // Refresh the configs list
      await set(fetchAllNginxConfigsAtom);
      await set(fetchBoojoogNginxConfigsAtom);
      
      return newConfig;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to create nginx configuration");
      set(nginxErrorAtom, errorObj);
      throw errorObj;
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Update nginx configuration action
export const updateNginxConfigAtom = atom(
  null,
  async (_, set, data: { filename: string; content: string }) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      const updatedConfig = await updateNginxConfig(data.filename, data.content);
      
      // Refresh the configs list
      await set(fetchAllNginxConfigsAtom);
      await set(fetchBoojoogNginxConfigsAtom);
      
      return updatedConfig;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to update nginx configuration");
      set(nginxErrorAtom, errorObj);
      throw errorObj;
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Remove nginx configuration action
export const removeNginxConfigAtom = atom(
  null,
  async (get, set, filename: string) => {
    try {
      set(nginxLoadingAtom, true);
      set(nginxErrorAtom, null);
      
      await removeNginxConfig(filename);
      
      // Refresh the configs list
      await set(fetchAllNginxConfigsAtom);
      await set(fetchBoojoogNginxConfigsAtom);
      
      // Clear selected config if it was the removed one
      const currentSelected = get(selectedNginxConfigAtom);
      if (currentSelected && currentSelected.filename === filename) {
        set(selectedNginxConfigAtom, null);
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to remove nginx configuration");
      set(nginxErrorAtom, errorObj);
      throw errorObj;
    } finally {
      set(nginxLoadingAtom, false);
    }
  }
);

// Clear nginx error action
export const clearNginxErrorAtom = atom(
  null,
  (_, set) => {
    set(nginxErrorAtom, null);
  }
);

// Toggle edit mode action
export const toggleNginxEditModeAtom = atom(
  null,
  (get, set, mode?: boolean) => {
    const currentMode = get(nginxEditModeAtom);
    set(nginxEditModeAtom, mode !== undefined ? mode : !currentMode);
  }
);
