import React, { useState, useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  nginxSettingsAtom,
  boojoogNginxConfigsAtom,
  nginxLoadingAtom,
  nginxErrorAtom,
  selectedNginxConfigAtom,
  nginxEditModeAtom,
  setNginxConfigPathAtom,
  validateNginxConfigPathAtom,
  fetchAllNginxConfigsAtom,
  fetchBoojoogNginxConfigsAtom,
  createNginxConfigAtom,
  updateNginxConfigAtom,
  removeNginxConfigAtom,
  toggleNginxEditModeAtom,
  loadAppSettingsAtom,
} from "../atoms/consolidatedAtoms";
import {
  Folder,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Settings,
  FileText,
  Globe,
  Server,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
} from "lucide-react";
import { MainWrapper, PageWrapper } from "../ui/wrapper";
import Info from "../ui/info";

const NginxPage: React.FC = () => {
  const nginxSettings = useAtomValue(nginxSettingsAtom);
  const boojoogConfigs = useAtomValue(boojoogNginxConfigsAtom);
  const loading = useAtomValue(nginxLoadingAtom);
  const error = useAtomValue(nginxErrorAtom);
  const [selectedConfig, setSelectedConfig] = useAtom(selectedNginxConfigAtom);
  const editMode = useAtomValue(nginxEditModeAtom);

  const setNginxConfigPath = useSetAtom(setNginxConfigPathAtom);
  const validateConfigPath = useSetAtom(validateNginxConfigPathAtom);
  const fetchAllConfigs = useSetAtom(fetchAllNginxConfigsAtom);
  const fetchBoojoogConfigs = useSetAtom(fetchBoojoogNginxConfigsAtom);
  const createConfig = useSetAtom(createNginxConfigAtom);
  const updateConfig = useSetAtom(updateNginxConfigAtom);
  const removeConfig = useSetAtom(removeNginxConfigAtom);
  const toggleEditMode = useSetAtom(toggleNginxEditModeAtom);
  const loadAppSettings = useSetAtom(loadAppSettingsAtom);

  // Local state
  const [configPath, setConfigPath] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newConfigName, setNewConfigName] = useState("");
  const [newConfigContent, setNewConfigContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [pathValidation, setPathValidation] = useState<{
    isValid: boolean;
    checked: boolean;
  }>({ isValid: false, checked: false });

  // Load app settings on mount
  useEffect(() => {
    loadAppSettings();
  }, [loadAppSettings]);

  // Initialize config path from settings
  useEffect(() => {
    if (nginxSettings) {
      setConfigPath(nginxSettings.configPath || "");
    }
  }, [nginxSettings]);

  // Load configs when settings are available
  useEffect(() => {
    if (nginxSettings) {
      fetchAllConfigs();
      fetchBoojoogConfigs();
    }
  }, [nginxSettings, fetchAllConfigs, fetchBoojoogConfigs]);

  // Update edit content when selected config changes
  useEffect(() => {
    if (selectedConfig) {
      setEditContent(selectedConfig.content);
    }
  }, [selectedConfig]);

  const handleConfigPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.value;
    setConfigPath(path);
    setPathValidation({ isValid: false, checked: false });
  };

  const validatePath = async () => {
    if (!configPath.trim()) {
      setPathValidation({ isValid: false, checked: true });
      return;
    }

    try {
      const isValid = await validateConfigPath(configPath);
      setPathValidation({ isValid, checked: true });
    } catch {
      setPathValidation({ isValid: false, checked: true });
    }
  };

  const handleSetConfigPath = async () => {
    try {
      await setNginxConfigPath({ configPath });
      setShowSettings(false);
      setPathValidation({ isValid: false, checked: false });
      // Refresh configs after setting path
      fetchAllConfigs();
      fetchBoojoogConfigs();
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const handleCreateConfig = async () => {
    if (!newConfigName.trim() || !newConfigContent.trim()) return;

    try {
      await createConfig({
        filename: newConfigName,
        content: newConfigContent,
      });
      setShowCreateForm(false);
      setNewConfigName("");
      setNewConfigContent("");
      // Refresh configs after creation
      fetchAllConfigs();
      fetchBoojoogConfigs();
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const handleUpdateConfig = async () => {
    if (!selectedConfig || !editContent.trim()) return;

    try {
      await updateConfig({
        filename: selectedConfig.filename,
        content: editContent,
      });
      toggleEditMode(false);
      // Refresh configs after update
      fetchAllConfigs();
      fetchBoojoogConfigs();
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const handleRemoveConfig = async (filename: string) => {
    if (
      !confirm(
        `Are you sure you want to remove the configuration "${filename}"?`
      )
    ) {
      return;
    }

    try {
      await removeConfig(filename);
      // Clear selection if removing the currently selected config
      if (selectedConfig?.filename === filename) {
        setSelectedConfig(null);
      }
      // Refresh configs after removal
      fetchAllConfigs();
      fetchBoojoogConfigs();
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const defaultConfigTemplate = `server {
    listen 80;
    server_name example.local;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

  return (
    <PageWrapper>
      <div className="p-1 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center space-x-3">
            {nginxSettings?.configPath ? (
              <div className="flex text-sm justify-center items-center text-gray-600 dark:text-gray-400 pl-4">
                <Folder size={11} className="mr-2" />{" "}
                {nginxSettings?.configPath}
              </div>
            ) : (
              <div className="flex text-sm justify-center items-center text-gray-600 dark:text-gray-400 pl-4">
                <Folder size={11} className="mr-2" /> No Path Set
              </div>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="flex text-xs ml-6 items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
              <span>Change Folder</span>
            </button>
          </div>
        </div>
      </div>
      <MainWrapper>
        <div className="dark:border-gray-700">
          {!error && (
            <div className="">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        nginxSettings ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                    <span className="text-sm">
                      {nginxSettings
                        ? "Configuration Active"
                        : "Not Configured"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">
                      {boojoogConfigs.length} config
                      {boojoogConfigs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4" />
                    <span className="text-sm">
                      {boojoogConfigs.length} managed
                    </span>
                  </div>
                </div>

                {nginxSettings && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New Config</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Info
            variant="error"
            description="An error occurred while fetching or managing nginx configurations."
            title={error.message}
            icon={AlertCircle}
            actions={[
              <button
                key="retry"
                onClick={() => {
                  setShowSettings(!showSettings);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Config
              </button>,
            ]}
            className="mt-4"
          />
        )}

        {!error && (
          <div className="flex-1 overflow-hidden border-t border-gray-200 dark:border-gray-700 mt-4">
            <div className="flex h-full">
              {/* Enhanced Sidebar */}
              <div className="w-80  border-r border-gray-200 dark:border-gray-700 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-gray-200 dark:border-gray-700 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Configurations
                    </h2>
                    <button
                      onClick={() => {
                        fetchAllConfigs();
                        fetchBoojoogConfigs();
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Refresh"
                    >
                      <RefreshCcw className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Config List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : boojoogConfigs.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No Boojoog-managed configs found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {boojoogConfigs.map((config) => (
                        <div
                          key={config.id}
                          onClick={() => setSelectedConfig(config)}
                          className={`group p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            selectedConfig?.id === config.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  selectedConfig?.id === config.id
                                    ? "bg-blue-100 dark:bg-blue-800"
                                    : "bg-gray-100 dark:bg-gray-700"
                                }`}
                              >
                                <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                  {config.filename}
                                </h3>
                                {config.isBoojoogManaged && (
                                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                    Managed
                                  </span>
                                )}
                              </div>
                            </div>

                            {config.isBoojoogManaged && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveConfig(config.filename);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          {/* Config Details */}
                          {config.serverNames.length > 0 && (
                            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <Globe className="h-3 w-3" />
                              <span className="truncate">
                                {config.serverNames.join(", ")}
                              </span>
                            </div>
                          )}

                          {config.upstreams.length > 0 && (
                            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                              <Server className="h-3 w-3" />
                              <span className="truncate">
                                {config.upstreams.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
                {selectedConfig ? (
                  <>
                    {/* Config Header */}
                    <div className="p-6 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {selectedConfig.filename}
                          </h2>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              Modified:{" "}
                              {selectedConfig.lastModified.toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>
                              Size: {selectedConfig.content.length} chars
                            </span>
                            {selectedConfig.isBoojoogManaged && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 dark:text-green-400">
                                  Boojoog Managed
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedConfig.isBoojoogManaged && (
                        <div className="flex space-x-2 justify-end mt-6">
                          {editMode ? (
                            <>
                              <button
                                onClick={handleUpdateConfig}
                                disabled={loading}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                              >
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                              </button>
                              <button
                                onClick={() => {
                                  toggleEditMode(false);
                                  setEditContent(selectedConfig.content);
                                }}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                <X className="h-4 w-4" />
                                <span>Cancel</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => toggleEditMode(true)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                              <span>Edit Config</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Config Content */}
                    <div className="flex-1 px-6 pb-6">
                      {editMode ? (
                        <div className="h-full">
                          <textarea
                            value={editContent}
                            rows={editContent.split("\n").length + 2 || 10}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-full p-4 border-2 border-blue-300 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            placeholder="Enter your nginx configuration..."
                          />
                        </div>
                      ) : (
                        <div className="h-full">
                          <pre className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm overflow-auto whitespace-pre-wrap">
                            {selectedConfig.content}
                          </pre>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full my-8">
                    <div className="flex flex-col text-center justify-center items-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-6">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Select a Configuration
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                        Choose a configuration from the sidebar to view and edit
                        its contents
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Nginx Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Configure your nginx configuration path
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Configuration Path
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={configPath}
                      onChange={handleConfigPathChange}
                      placeholder="/etc/nginx/sites-available"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      onClick={validatePath}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Test
                    </button>
                  </div>
                  {pathValidation.checked && (
                    <div
                      className={`mt-2 flex items-center space-x-2 text-sm ${
                        pathValidation.isValid
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {pathValidation.isValid ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <span>
                        {pathValidation.isValid
                          ? "Path is valid"
                          : "Path is invalid or inaccessible"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setPathValidation({ isValid: false, checked: false });
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetConfigPath}
                  disabled={!configPath.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Save Path
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Config Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Configuration
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Create a new nginx configuration file
                </p>
              </div>

              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Configuration Name
                  </label>
                  <input
                    type="text"
                    value={newConfigName}
                    onChange={(e) => setNewConfigName(e.target.value)}
                    placeholder="example.local.conf"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Configuration Content
                    </label>
                    <button
                      onClick={() => setNewConfigContent(defaultConfigTemplate)}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Use Template
                    </button>
                  </div>
                  <textarea
                    value={newConfigContent}
                    onChange={(e) => setNewConfigContent(e.target.value)}
                    placeholder="Enter your nginx configuration..."
                    className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewConfigName("");
                    setNewConfigContent("");
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateConfig}
                  disabled={
                    !newConfigName.trim() || !newConfigContent.trim() || loading
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Create Config
                </button>
              </div>
            </div>
          </div>
        )}
      </MainWrapper>
    </PageWrapper>
  );
};

export default NginxPage;
