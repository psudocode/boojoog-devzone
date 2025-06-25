import React, { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  localSitesAtom,
  localSiteLoadingAtom,
  localSiteErrorAtom,
  createLocalSiteAtom,
  checkNginxPathAtom,
  clearLocalSiteErrorAtom,
  removeLocalSiteAtom,
  validateDomainAtom,
  validateLocalAddressAtom,
  CreateLocalSiteData,
} from "../atoms/localSiteAtoms";
import {
  loadAppSettingsAtom,
  autoOpenAfterCreateAtom,
  nginxPathConfiguredAtom,
} from "../atoms/consolidatedAtoms";
import {
  Plus,
  Globe,
  Server,
  Trash2,
  AlertCircle,
  Settings,
  ExternalLink,
  Clock,
} from "lucide-react";
import { openExternalLink } from "../helpers/externalLinkHandler";
import { PageWrapper, MainWrapper } from "../ui/wrapper";
import Info from "../ui/info";

const LocalSitePage: React.FC = () => {
  const localSites = useAtomValue(localSitesAtom);
  const loading = useAtomValue(localSiteLoadingAtom);
  const error = useAtomValue(localSiteErrorAtom);
  const nginxConfigured = useAtomValue(nginxPathConfiguredAtom);
  const autoOpenAfterCreate = useAtomValue(autoOpenAfterCreateAtom);

  const createLocalSite = useSetAtom(createLocalSiteAtom);
  const checkNginxPath = useSetAtom(checkNginxPathAtom);
  const clearError = useSetAtom(clearLocalSiteErrorAtom);
  const removeLocalSite = useSetAtom(removeLocalSiteAtom);
  const validateDomain = useSetAtom(validateDomainAtom);
  const validateLocalAddress = useSetAtom(validateLocalAddressAtom);
  const loadAppSettings = useSetAtom(loadAppSettingsAtom);
  //   const updateLocalSitesSettings = useSetAtom(updateLocalSitesSettingsAtom);

  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateLocalSiteData>({
    domain: "",
    localAddress: "",
    comment: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<CreateLocalSiteData>>(
    {}
  );

  // Check nginx configuration and load settings on mount
  useEffect(() => {
    loadAppSettings();
    checkNginxPath();
  }, [loadAppSettings, checkNginxPath]);

  const validateForm = (): boolean => {
    const errors: Partial<CreateLocalSiteData> = {};

    if (!formData.domain.trim()) {
      errors.domain = "Domain is required";
    } else if (!validateDomain(formData.domain)) {
      errors.domain = "Invalid domain format (e.g., myapp.local)";
    }

    if (!formData.localAddress.trim()) {
      errors.localAddress = "Local address is required";
    } else if (!validateLocalAddress(formData.localAddress)) {
      errors.localAddress =
        "Invalid format. Use localhost:port or 127.0.0.1:port (e.g., localhost:3000)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createLocalSite(formData);
      setFormData({ domain: "", localAddress: "", comment: "" });
      setFormErrors({});
      setShowCreateForm(false);

      // Auto-open site if setting is enabled
      if (autoOpenAfterCreate) {
        setTimeout(() => openSite(formData.domain), 1000); // Small delay to allow site creation
      }
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const handleRemove = async (siteId: string, domain: string) => {
    if (
      !confirm(
        `Are you sure you want to remove the local site "${domain}"?\n\nNote: This will only remove it from the list. You may need to manually clean up the hosts file and nginx configuration.`
      )
    ) {
      return;
    }

    try {
      await removeLocalSite(siteId);
    } catch (err) {
      // Error is handled by the atom
    }
  };

  const openSite = (domain: string) => {
    const url = domain.includes("://") ? domain : `http://${domain}`;
    openExternalLink(url);
  };

  return (
    <PageWrapper>
      <MainWrapper>
        {nginxConfigured && (
          <div className="flex items-center mb-4">
            <div className="flex flex-1 items-center justify-between">
              <h2 className="flex text-lg font-semibold text-gray-900 dark:text-white">
                Your Local Sites ({localSites.length})
              </h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center justify-end space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Local Site</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Info
            icon={AlertCircle}
            title="Error"
            description={error.message}
            variant="error"
            actions={
              <button
                onClick={clearError}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Dismiss
              </button>
            }
            closable={true}
          />
        )}

        {/* Nginx Configuration Warning */}
        {!nginxConfigured && (
          <Info
            icon={Settings}
            title="Nginx Configuration Required"
            description="To use Local Sites, you need to configure your nginx directory path first. This allows the app to automatically create nginx configuration files."
            actions={
              <button
                onClick={() => (window.location.hash = "/settings")}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Configure Nginx
              </button>
            }
            variant="alert"
            closable={false}
          />
        )}

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Create New Local Site
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain Name *
                  </label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        domain: e.target.value,
                      }))
                    }
                    placeholder="testing.local"
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                      formErrors.domain
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.domain && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {formErrors.domain}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Local Address with Port *
                  </label>
                  <input
                    type="text"
                    value={formData.localAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        localAddress: e.target.value,
                      }))
                    }
                    placeholder="localhost:3021"
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                      formErrors.localAddress
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.localAddress && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {formErrors.localAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comment (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="My awesome app"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Site"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Local Sites List */}
        <div className="flex-1">
          {loading && localSites.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : localSites.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Local Sites Created
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first local site to get started with local
                development
              </p>
              {nginxConfigured && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Local Site
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {localSites.map((site) => (
                  <div
                    key={site.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {site.domain}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleRemove(site.id, site.domain)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {site.localAddress ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Server className="h-4 w-4" />
                          <span>{site.localAddress}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No nginx configuration.
                        </p>
                      )}
                      {site.comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          #{site.comment}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          Created {site.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="flex items-center space-x-1">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              site.hostsEntryExists
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Hosts
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              site.nginxConfigExists
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Nginx
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => openSite(site.domain)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Open</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </MainWrapper>
    </PageWrapper>
  );
};

export default LocalSitePage;
