import React, { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Link } from "react-router-dom";
import {
  appSettingsAtom,
  nginxSettingsAtom,
  settingsLoadingAtom,
  settingsErrorAtom,
  loadAppSettingsAtom,
  setNginxConfigPathAtom,
  clearNginxSettingsAtom,
  setThemeAtom,
  clearSettingsErrorAtom,
  themeSettingAtom,
} from "../atoms/consolidatedAtoms";
import {
  Folder,
  AlertCircle,
  CheckCircle,
  X,
  Sun,
  Moon,
  Monitor,
  Loader2,
  Trash2,
} from "lucide-react";
import { PageWrapper, MainWrapper } from "../ui/wrapper";

const SettingsPage: React.FC = () => {
  const appSettings = useAtomValue(appSettingsAtom);
  const nginxSettings = useAtomValue(nginxSettingsAtom);
  const loading = useAtomValue(settingsLoadingAtom);
  const error = useAtomValue(settingsErrorAtom);
  const theme = useAtomValue(themeSettingAtom);

  const loadAppSettings = useSetAtom(loadAppSettingsAtom);
  const setNginxConfigPath = useSetAtom(setNginxConfigPathAtom);
  const clearNginxSettings = useSetAtom(clearNginxSettingsAtom);
  const setTheme = useSetAtom(setThemeAtom);
  const clearError = useSetAtom(clearSettingsErrorAtom);

  // Local state for forms
  const [nginxConfigPathForm, setNginxConfigPathForm] = useState("");
  const [showNginxForm, setShowNginxForm] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadAppSettings();
  }, [loadAppSettings]);

  // Update form when nginx settings change
  useEffect(() => {
    if (nginxSettings) {
      setNginxConfigPathForm(nginxSettings.configPath || "");
    }
  }, [nginxSettings]);

  const handleNginxConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nginxConfigPathForm.trim()) {
      return;
    }

    try {
      await setNginxConfigPath({
        configPath: nginxConfigPathForm,
      });
      setShowNginxForm(false);
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const handleClearNginxSettings = async () => {
    if (!confirm("Are you sure you want to clear nginx settings?")) {
      return;
    }

    try {
      await clearNginxSettings();
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    try {
      await setTheme(newTheme);
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const selectDirectory = async () => {
    const { ipcRenderer } = window;
    const result = await ipcRenderer.invoke("show-open-dialog", {
      properties: ["openDirectory"],
      title: "Select Nginx Configuration Directory",
    });

    if (!result.canceled && result.filePaths.length > 0) {
      setNginxConfigPathForm(result.filePaths[0]);
    }
  };

  // Debug: Show loading state if settings are still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <MainWrapper>
        <div className="flex flex-col h-full space-y-6">
          {/* Error Display */}
          {error && (
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">
                  {error.message}
                </span>
              </div>
              <button
                onClick={() => clearError()}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Nginx Configuration */}
            <div className="  rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Nginx Configuration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure nginx paths for automatic site management
                  </p>
                </div>
                {nginxSettings?.isConfigured ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                )}
              </div>

              {nginxSettings?.isConfigured ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Configuration Directory
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        {nginxSettings.configPath}
                      </code>
                      <button
                        onClick={() => setShowNginxForm(!showNginxForm)}
                        className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleClearNginxSettings}
                        className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {nginxSettings.validation &&
                    !nginxSettings.validation.isValid && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Warning:</strong>{" "}
                          {nginxSettings.validation.error}
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No nginx configuration set up
                  </p>

                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      <strong>💡 Don't have nginx installed?</strong>
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Check out the Docker Setup guide in the{" "}
                      <Link
                        to="/about"
                        className="underline hover:text-blue-600 dark:hover:text-blue-200 font-medium"
                      >
                        About & Help
                      </Link>{" "}
                      page for an alternative containerized approach that
                      doesn't require installing nginx directly on your system.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowNginxForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Configure Nginx Path
                  </button>
                </div>
              )}

              {/* Nginx Configuration Form */}
              {showNginxForm && (
                <div className="mt-6 p-4 border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg">
                  <form
                    onSubmit={handleNginxConfigSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Configuration Directory *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={nginxConfigPathForm}
                          onChange={(e) =>
                            setNginxConfigPathForm(e.target.value)
                          }
                          placeholder="/etc/nginx/sites-available"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={selectDirectory}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <Folder className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span>Save Configuration</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNginxForm(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Appearance
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() =>
                        handleThemeChange(value as "light" | "dark" | "system")
                      }
                      className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        theme === value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* App Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Application Information
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Version
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {appSettings?.version || "1.0.0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Settings Location
                  </span>
                  <code className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {navigator.userAgent.includes("Mac")
                      ? "~/Library/Application Support/DevZone"
                      : navigator.userAgent.includes("Win")
                      ? "%APPDATA%/DevZone"
                      : "~/.config/DevZone"}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainWrapper>
    </PageWrapper>
  );
};

export default SettingsPage;
