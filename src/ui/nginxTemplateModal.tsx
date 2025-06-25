import React, { useState } from "react";
import { X, Copy, ChevronDown, ChevronUp } from "lucide-react";
import {
  nginxTemplates,
  NginxTemplate,
  fillTemplate,
} from "../../electron/app/nginx/templates";

interface NginxTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (content: string) => void;
}

const NginxTemplateModal: React.FC<NginxTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<NginxTemplate | null>(null);
  const [placeholderValues, setPlaceholderValues] = useState<
    Record<string, string>
  >({});
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTemplateSelect = (template: NginxTemplate) => {
    setSelectedTemplate(template);
    // Initialize placeholder values
    const initialValues: Record<string, string> = {};
    template.placeholders.forEach((placeholder) => {
      initialValues[placeholder] = "";
    });
    setPlaceholderValues(initialValues);
  };

  const handlePlaceholderChange = (placeholder: string, value: string) => {
    setPlaceholderValues((prev) => ({
      ...prev,
      [placeholder]: value,
    }));
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;

    const filledContent = fillTemplate(
      selectedTemplate.content,
      placeholderValues
    );
    onSelectTemplate(filledContent);
    onClose();
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const toggleTemplateExpansion = (templateName: string) => {
    setExpandedTemplate(
      expandedTemplate === templateName ? null : templateName
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nginx Configuration Templates
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Template List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 space-y-2">
              {nginxTemplates.map((template) => (
                <div
                  key={template.name}
                  className={`border rounded-lg overflow-hidden $\{
                    selectedTemplate?.name === template.name
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {template.description}
                    </div>
                  </button>

                  <div className="px-3 pb-2">
                    <button
                      onClick={() => toggleTemplateExpansion(template.name)}
                      className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {expandedTemplate === template.name ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          <span>Hide Preview</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          <span>Show Preview</span>
                        </>
                      )}
                    </button>

                    {expandedTemplate === template.name && (
                      <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded p-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Preview
                          </span>
                          <button
                            onClick={() => copyToClipboard(template.content)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto max-h-40">
                          {template.content}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Configuration */}
          <div className="flex-1 overflow-y-auto">
            {selectedTemplate ? (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedTemplate.description}
                  </p>
                </div>

                {selectedTemplate.placeholders.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Configure Template
                    </h4>
                    <div className="space-y-4">
                      {selectedTemplate.placeholders.map((placeholder) => (
                        <div key={placeholder}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {placeholder
                              .replace(/[{}]/g, "")
                              .replace(/_/g, " ")
                              .toUpperCase()}
                          </label>
                          <input
                            type="text"
                            value={placeholderValues[placeholder] || ""}
                            onChange={(e) =>
                              handlePlaceholderChange(
                                placeholder,
                                e.target.value
                              )
                            }
                            placeholder={`Enter value for ${placeholder}`}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      Generated Configuration
                    </h4>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          fillTemplate(
                            selectedTemplate.content,
                            placeholderValues
                          )
                        )
                      }
                      className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-900 dark:text-white overflow-x-auto border border-gray-200 dark:border-gray-700">
                    {fillTemplate(selectedTemplate.content, placeholderValues)}
                  </pre>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUseTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <Copy className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a Template
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a template from the list to configure and use
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NginxTemplateModal;
