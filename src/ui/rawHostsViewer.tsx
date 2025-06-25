import React, { useState } from "react";
import { X } from "lucide-react";
import { HostEntry } from "../../electron/app/hosts/hosts";

interface RawHostsViewerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const RawHostsViewer: React.FC<RawHostsViewerProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const [entries, setEntries] = useState<HostEntry[] | null>(null);

  React.useEffect(() => {
    if (content) {
      const blockRegex =
        /# BEGIN BoojoogHostsManager\n([\s\S]*?)# END BoojoogHostsManager\n?/;
      const match = content.match(blockRegex);
      if (match) {
        const rawBlock = match[1].trim();
        const lines = rawBlock.split("\n");
        const parsedEntries: HostEntry[] = lines
          .map((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return null; // skip empty lines

            const parts = trimmed.split(/\s+/);
            if (parts.length < 2) return null; // skip invalid lines

            const commentMatch = trimmed.match(/#(.*)$/);
            const entry: HostEntry = {
              lineNumber: index,
              ip: parts[0],
              hostname: parts[1],
            };
            if (commentMatch && commentMatch[1].trim()) {
              entry.comment = commentMatch[1].trim();
            }
            return entry;
          })
          .filter((e): e is HostEntry => e !== null); // remove nulls and assert correct type

        setEntries(parsedEntries);
      } else {
        setEntries([]);
      }
    } else {
      setEntries(null);
    }
  }, [content]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-4/5 max-w-4xl max-h-[80vh] overflow-hidden flex flex-col transition-all duration-200">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Hosts File Content
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-col space-y-6">
            {/* Full Content */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">
                Complete Hosts File
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {content}
              </pre>
            </div>

            {/* Blocks Display */}
            <div className="flex flex-1">
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Managed Block
                </h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap h-40 overflow-y-auto">
                  {entries !== null
                    ? entries
                        .map((entry) => {
                          const comment = entry.comment
                            ? ` # ${entry.comment}`
                            : "";
                          return `${entry.ip.padEnd(
                            15
                          )} ${entry.hostname.padEnd(20)}${comment}`;
                        })
                        .join("\n")
                    : "<No entries found>"}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600/80 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500/70 focus:ring-opacity-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RawHostsViewer;
