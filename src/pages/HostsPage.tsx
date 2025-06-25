import React, { useState } from "react";
import { HostEntry } from "../../electron/app/hosts/hosts";
import { useJotaiEntries } from "../hooks/useJotaiEntries";
import { openExternalLink } from "../helpers/externalLinkHandler";
import {
  Link,
  RefreshCcw,
  FileText,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import { MainWrapper, PageWrapper } from "../ui/wrapper";
import UpdateForm from "../ui/updateForm";
import RawHostsViewer from "../ui/rawHostsViewer";

const HostsManager: React.FC = () => {
  const {
    entries,
    loading,
    error,
    deleteEntry,
    saveEntries,
    refreshEntries,
    rawHostsFile,
    fetchRawHostsFile,
  } = useJotaiEntries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<HostEntry | undefined>(
    undefined
  );
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRawViewerOpen, setIsRawViewerOpen] = useState(false);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setCurrentEntry(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditClick = (entry: HostEntry) => {
    setCurrentEntry(entry);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (entry: HostEntry) => {
    if (window.confirm(`Are you sure you want to delete ${entry.hostname}?`)) {
      setIsDeleting(true);
      try {
        deleteEntry(entry.lineNumber);
        await saveEntries();
      } catch (error) {
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
            `Failed to delete entry: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshEntries();
    } catch (error) {
      alert("Failed to refresh entries. Please try again.");
    }
  };

  const handleViewRawFile = async () => {
    try {
      await fetchRawHostsFile();
      setIsRawViewerOpen(true);
    } catch (error) {
      alert("Failed to fetch hosts file. Please try again.");
    }
  };

  const handleOpenExternalLink = async (
    hostname: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    try {
      // Add protocol if not present
      const url = hostname.includes("://") ? hostname : `http://${hostname}`;
      await openExternalLink(url);
    } catch (error) {
      alert(
        `Failed to open link: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <PageWrapper>
      <MainWrapper>
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddClick}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 dark:bg-green-600/80 rounded-md hover:bg-green-600 dark:hover:bg-green-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 dark:focus:ring-green-500 transition-colors"
                disabled={loading}
              >
                <Link size={14} className="mr-2" />
                Add New Entry
              </button>
              <button
                onClick={handleViewRawFile}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-500 dark:bg-purple-600/80 rounded-md hover:bg-purple-600 dark:hover:bg-purple-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 dark:focus:ring-purple-500 transition-colors"
                disabled={loading}
              >
                <FileText size={14} className="mr-2" />
                View Raw File
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-600/80 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors"
                disabled={loading}
              >
                <RefreshCcw size={14} className="mr-2" />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-400 dark:focus:ring-indigo-500/70 focus:border-indigo-400 dark:focus:border-indigo-500/70 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              <div className="flex">
                <div className="py-1">
                  <svg
                    className="fill-current h-6 w-6 text-red-500 dark:text-red-400 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error.message}</p>
                  {error.message?.includes("EACCES") && (
                    <p className="mt-2">
                      <strong>Administrative privileges required:</strong> This
                      operation requires administrative privileges to modify the
                      hosts file.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading && !isDeleting ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No matching entries found"
                : "No host entries yet. Add one to get started."}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Line
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      IP Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Hostname
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Comment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Test Link
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-800"
                          : "bg-gray-100 dark:bg-gray-700/50"
                      } hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 transition-colors">
                        {entry.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 transition-colors">
                        {entry.hostname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors truncate">
                        {/* {entry.comment || "-"} */}
                        {/* limit comment to 20 char */}
                        {entry.comment ? (
                          entry.comment.length > 20 ? (
                            <span title={entry.comment}>
                              {entry.comment.slice(0, 20)}...
                            </span>
                          ) : (
                            entry.comment
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <a
                          href={`http://${entry.hostname}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 dark:text-blue-400/90 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center justify-center transition-colors"
                          onClick={(e) =>
                            handleOpenExternalLink(entry.hostname, e)
                          }
                        >
                          <ExternalLink size={14} className="mr-2" />
                          Open
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="text-indigo-500 dark:text-indigo-400/90 hover:text-indigo-700 dark:hover:text-indigo-300 mr-4 transition-colors"
                        >
                          <Pencil size={14} className="inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(entry)}
                          className="text-red-500 dark:text-red-400/90 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                          disabled={isDeleting}
                        >
                          <Trash2 size={14} className="inline mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <UpdateForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialEntry={currentEntry}
            mode={modalMode}
          />

          <RawHostsViewer
            isOpen={isRawViewerOpen}
            onClose={() => setIsRawViewerOpen(false)}
            content={rawHostsFile}
          />
        </div>
      </MainWrapper>
    </PageWrapper>
  );
};

export default HostsManager;
