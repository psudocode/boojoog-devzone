import { useEffect, useState } from "react";
import { getHostsEntries, updateHostsEntries } from "../helpers/ipcHandler";
import { HostEntry } from "../../electron/app/hosts/hosts";

interface UseEntriesReturn {
  entries: HostEntry[];
  loading: boolean;
  error: Error | null;
  addEntry: (entry: Omit<HostEntry, "lineNumber">) => void;
  updateEntry: (lineNumber: number, updatedEntry: Partial<HostEntry>) => void;
  deleteEntry: (lineNumber: number) => void;
  saveEntries: () => Promise<void>;
  refreshEntries: () => Promise<void>;
}

export const useEntries = (): UseEntriesReturn => {
  const [entries, setEntries] = useState<HostEntry[]>([]);
  const [rawBefore, setRawBefore] = useState<string>("");
  const [rawAfter, setRawAfter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to load entries from the system
  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHostsEntries();

      if (response.hostsBlock && response.hostsBlock.length > 0) {
        const hostsBlock = response.hostsBlock[0];
        setEntries(hostsBlock.entries);
        setRawBefore(hostsBlock.rawBefore);
        setRawAfter(hostsBlock.rawAfter);
      } else {
        setEntries([]);
        setRawBefore("");
        setRawAfter("");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Load entries when component mounts
  useEffect(() => {
    fetchEntries();
  }, []);

  // Add a new entry
  const addEntry = (entry: Omit<HostEntry, "lineNumber">) => {
    // Calculate new line number (use the highest existing line number + 1)
    const newLineNumber =
      entries.length > 0
        ? Math.max(...entries.map((e) => e.lineNumber)) + 1
        : 1;

    const newEntry: HostEntry = {
      ...entry,
      lineNumber: newLineNumber,
    };

    setEntries((prev) => [...prev, newEntry]);
  };

  // Update an existing entry
  const updateEntry = (
    lineNumber: number,
    updatedEntry: Partial<HostEntry>
  ) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.lineNumber === lineNumber ? { ...entry, ...updatedEntry } : entry
      )
    );
  };

  // Delete an entry
  const deleteEntry = (lineNumber: number) => {
    setEntries((prev) =>
      prev.filter((entry) => entry.lineNumber !== lineNumber)
    );
  };

  // Save all entries back to the system
  const saveEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      await updateHostsEntries({
        entries,
        rawBefore,
        rawAfter,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh entries from the system
  const refreshEntries = async () => {
    await fetchEntries();
  };

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    saveEntries,
    refreshEntries,
  };
};
