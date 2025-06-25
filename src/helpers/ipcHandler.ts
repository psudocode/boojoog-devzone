import {
  HostEntry,
  IReadHostsFileResponse,
} from "../../electron/app/hosts/hosts";
import { NginxConfig, NginxSettings } from "../../electron/app/nginx/nginx";
import { AppSettings } from "../../electron/app/settings/settingsManager";

/**
 * Fetches all entries from the hosts file
 * @returns Promise resolving to host entries and total line count
 * @throws Error if fetching fails
 */
export async function getHostsEntries(): Promise<IReadHostsFileResponse> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("get-hosts-entries");

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to get hosts entries");
  }
}

/**
 * Interface for updating hosts file
 */
export interface IUpdateHostsData {
  entries: HostEntry[];
  rawBefore: string;
  rawAfter: string;
}

/**
 * Updates hosts file with provided entries and raw content
 * @param data Object containing entries, rawBefore, and rawAfter
 * @throws Error if update fails or if administrative privileges are denied
 */
export async function updateHostsEntries(
  data: IUpdateHostsData
): Promise<void> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("update-hosts-entries", data);

  if (!response.success) {
    throw new Error(response.message || "Failed to update hosts entries");
  }
}

/**
 * Gets the raw content of the hosts file
 * @returns Promise resolving to the raw hosts file content
 * @throws Error if fetching fails
 */
export async function getRawHostsFile(): Promise<string> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("get-raw-hosts-file");

  if (response.success) {
    return response.data.content;
  } else {
    throw new Error(response.message || "Failed to get raw hosts file");
  }
}

// Nginx IPC Handlers

/**
 * Sets the nginx configuration path
 * @param settings Nginx configuration settings
 * @throws Error if setting the path fails
 */
export async function setNginxConfigPath(settings: NginxSettings): Promise<void> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("set-nginx-config-path", settings);

  if (!response.success) {
    throw new Error(response.message || "Failed to set nginx configuration path");
  }
}

/**
 * Validates if a nginx configuration path is valid
 * @param configPath Path to validate
 * @returns Promise resolving to validation result
 */
export async function validateNginxConfigPath(configPath: string): Promise<boolean> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("validate-nginx-config-path", configPath);

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to validate nginx configuration path");
  }
}

/**
 * Gets all nginx configuration files
 * @returns Promise resolving to array of nginx configurations
 */
export async function getAllNginxConfigs(): Promise<NginxConfig[]> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("get-all-nginx-configs");

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to get nginx configurations");
  }
}

/**
 * Gets only Boojoog-managed nginx configuration files
 * @returns Promise resolving to array of Boojoog-managed nginx configurations
 */
export async function getBoojoogNginxConfigs(): Promise<NginxConfig[]> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("get-boojoog-nginx-configs");

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to get Boojoog nginx configurations");
  }
}

/**
 * Gets a specific nginx configuration by filename
 * @param filename The filename of the configuration to retrieve
 * @returns Promise resolving to the nginx configuration or null if not found
 */
export async function getNginxConfigByFilename(filename: string): Promise<NginxConfig | null> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("get-nginx-config-by-filename", filename);

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to get nginx configuration");
  }
}

/**
 * Creates a new nginx configuration file
 * @param filename The filename for the new configuration
 * @param content The content of the configuration
 * @returns Promise resolving to the created nginx configuration
 */
export async function createNginxConfig(filename: string, content: string): Promise<NginxConfig> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("create-nginx-config", { filename, content });

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to create nginx configuration");
  }
}

/**
 * Updates an existing nginx configuration file
 * @param filename The filename of the configuration to update
 * @param content The new content of the configuration
 * @returns Promise resolving to the updated nginx configuration
 */
export async function updateNginxConfig(filename: string, content: string): Promise<NginxConfig> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("update-nginx-config", { filename, content });

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to update nginx configuration");
  }
}

/**
 * Removes a nginx configuration file (only Boojoog-managed files)
 * @param filename The filename of the configuration to remove
 * @throws Error if removal fails or if file is not Boojoog-managed
 */
export async function removeNginxConfig(filename: string): Promise<void> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("remove-nginx-config", filename);

  if (!response.success) {
    throw new Error(response.message || "Failed to remove nginx configuration");
  }
}

// Settings IPC Handlers

/**
 * Gets all application settings
 * @returns Promise resolving to all app settings
 * @throws Error if fetching fails
 */
export async function getAppSettings(): Promise<AppSettings> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("get-app-settings");

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to get app settings");
  }
}

/**
 * Gets nginx-specific settings
 * @returns Promise resolving to nginx settings with validation info
 * @throws Error if fetching fails
 */
export async function getNginxSettings(): Promise<{
  configPath?: string;
  enabledPath?: string;
  lastConfigured?: string;
  isConfigured: boolean;
  validation: { isValid: boolean; error?: string };
}> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("get-nginx-settings");

  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to get nginx settings");
  }
}

/**
 * Sets nginx configuration paths
 * @param configPath Path to nginx configuration directory
 * @param enabledPath Optional path to enabled configurations directory
 * @throws Error if setting fails
 */
export async function setNginxConfigPathSettings(configPath: string, enabledPath?: string): Promise<void> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("set-nginx-config-path", { configPath, enabledPath });

  if (!response.success) {
    throw new Error(response.message || "Failed to set nginx configuration path");
  }
}

/**
 * Clears nginx settings
 * @throws Error if clearing fails
 */
export async function clearNginxSettings(): Promise<void> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("clear-nginx-settings");

  if (!response.success) {
    throw new Error(response.message || "Failed to clear nginx settings");
  }
}

/**
 * Sets theme preference
 * @param theme Theme to set ('light', 'dark', or 'system')
 * @throws Error if setting fails
 */
export async function setThemeSetting(theme: 'light' | 'dark' | 'system'): Promise<void> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("set-theme", theme);

  if (!response.success) {
    throw new Error(response.message || "Failed to set theme");
  }
}

/**
 * Updates general settings
 * @param settings General settings to update
 * @throws Error if updating fails
 */
export async function updateGeneralSettings(settings: {
  theme?: 'light' | 'dark' | 'system';
  autoStart?: boolean;
  checkForUpdates?: boolean;
}): Promise<void> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("update-general-settings", settings);

  if (!response.success) {
    throw new Error(response.message || "Failed to update general settings");
  }
}

/**
 * Updates local sites settings
 * @param settings Local sites settings to update
 * @throws Error if updating fails
 */
export async function updateLocalSitesSettings(settings: {
  autoOpenAfterCreate?: boolean;
}): Promise<void> {
  const { ipcRenderer } = window;
  const response = await ipcRenderer.invoke("update-local-sites-settings", settings);

  if (!response.success) {
    throw new Error(response.message || "Failed to update local sites settings");
  }
}
