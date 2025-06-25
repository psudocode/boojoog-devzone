import React, { useState, useEffect } from "react";
import { HostEntry } from "../../electron/app/hosts/hosts";
import { useJotaiEntries } from "../hooks/useJotaiEntries";

interface UpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialEntry?: HostEntry;
  mode: "add" | "edit";
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  isOpen,
  onClose,
  initialEntry,
  mode,
}) => {
  const { addEntry, updateEntry, saveEntries } = useJotaiEntries();

  const [formData, setFormData] = useState<{
    ip: string;
    hostname: string;
    comment: string;
  }>({
    ip: "",
    hostname: "",
    comment: "",
  });

  const [errors, setErrors] = useState<{
    ip?: string;
    hostname?: string;
  }>({});

  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens or initialEntry changes
  useEffect(() => {
    if (isOpen && initialEntry && mode === "edit") {
      setFormData({
        ip: initialEntry.ip,
        hostname: initialEntry.hostname,
        comment: initialEntry.comment || "",
      });
    } else if (isOpen && mode === "add") {
      setFormData({
        ip: "127.0.0.1", // Set default IP to 127.0.0.1
        hostname: "",
        comment: "",
      });
    }
    setErrors({});
  }, [isOpen, initialEntry, mode]);

  const validateForm = (): boolean => {
    const newErrors: { ip?: string; hostname?: string } = {};

    // IP validation - Simple IPv4 validation
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!formData.ip) {
      newErrors.ip = "IP address is required";
    } else if (!ipPattern.test(formData.ip)) {
      newErrors.ip = "Invalid IP address format";
    }

    // Hostname validation
    if (!formData.hostname) {
      newErrors.hostname = "Hostname is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      if (mode === "add") {
        addEntry({
          ip: formData.ip,
          hostname: formData.hostname,
          comment: formData.comment || undefined,
        });
      } else if (mode === "edit" && initialEntry) {
        updateEntry(initialEntry.lineNumber, {
          ip: formData.ip,
          hostname: formData.hostname,
          comment: formData.comment || undefined,
        });
      }

      // Save changes to the system
      await saveEntries();
      onClose();
    } catch (error) {
      console.error("Error saving entry:", error);

      // Check if it's a permission error
      if (
        error instanceof Error &&
        (error.message.includes("EACCES") ||
          error.message.includes("permission") ||
          error.message.includes("privileges"))
      ) {
        alert(
          "Administrative privileges required: This operation requires administrator rights to modify the hosts file. You will be prompted for your password."
        );
      } else {
        alert(
          `Failed to save entry: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {mode === "add" ? "Add New Host Entry" : "Edit Host Entry"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="ip"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              IP Address
            </label>
            <input
              type="text"
              id="ip"
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.ip
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-400 dark:focus:ring-indigo-500/70 focus:border-indigo-400 dark:focus:border-indigo-500/70 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors`}
              placeholder="127.0.0.1"
            />
            {errors.ip && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.ip}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="hostname"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Hostname
            </label>
            <input
              type="text"
              id="hostname"
              name="hostname"
              value={formData.hostname}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.hostname
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-400 dark:focus:ring-indigo-500/70 focus:border-indigo-400 dark:focus:border-indigo-500/70 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors`}
              placeholder="localhost"
            />
            {errors.hostname && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.hostname}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Comment (Optional)
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-400 dark:focus:ring-indigo-500/70 focus:border-indigo-400 dark:focus:border-indigo-500/70 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              placeholder="Add a comment"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 dark:bg-indigo-600/80 rounded-md hover:bg-indigo-600 dark:hover:bg-indigo-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-colors"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : mode === "add"
                ? "Add Entry"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;
