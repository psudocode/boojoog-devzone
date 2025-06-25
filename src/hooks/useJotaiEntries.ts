import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { HostEntry } from "../../electron/app/hosts/hosts";
import {
  hostsEntriesAtom,
  loadingAtom,
  errorAtom,
  fetchEntriesAtom,
  addEntryAtom,
  updateEntryAtom,
  deleteEntryAtom,
  saveEntriesAtom,
  rawHostsFileAtom,
  fetchRawHostsFileAtom,
} from "../atoms/hostsAtoms";

export interface UseJotaiEntriesReturn {
  entries: HostEntry[];
  loading: boolean;
  error: Error | null;
  rawHostsFile: string;
  addEntry: (entry: Omit<HostEntry, "lineNumber">) => void;
  updateEntry: (lineNumber: number, updatedEntry: Partial<HostEntry>) => void;
  deleteEntry: (lineNumber: number) => void;
  saveEntries: () => Promise<void>;
  refreshEntries: () => Promise<void>;
  fetchRawHostsFile: () => Promise<void>;
}

export const useJotaiEntries = (): UseJotaiEntriesReturn => {
  // Get atoms
  const [entries] = useAtom(hostsEntriesAtom);
  const loading = useAtomValue(loadingAtom);
  const error = useAtomValue(errorAtom);
  const rawHostsFile = useAtomValue(rawHostsFileAtom);

  // Get atom setters/actions
  const fetchEntries = useSetAtom(fetchEntriesAtom);
  const addEntry = useSetAtom(addEntryAtom);
  const saveEntries = useSetAtom(saveEntriesAtom);
  const setUpdateEntry = useSetAtom(updateEntryAtom);
  const setDeleteEntry = useSetAtom(deleteEntryAtom);
  const fetchRawFile = useSetAtom(fetchRawHostsFileAtom);

  // Wrapper functions with more convenient signatures
  const updateEntry = useCallback(
    (lineNumber: number, updatedEntry: Partial<HostEntry>) => {
      setUpdateEntry({ lineNumber, updatedEntry });
    },
    [setUpdateEntry]
  );

  const deleteEntry = useCallback(
    (lineNumber: number) => {
      setDeleteEntry(lineNumber);
    },
    [setDeleteEntry]
  );

  // Refresh entries function
  const refreshEntries = useCallback(async () => {
    await fetchEntries();
  }, [fetchEntries]);

  // Fetch raw hosts file content
  const fetchRawHostsFile = useCallback(async () => {
    await fetchRawFile();
  }, [fetchRawFile]);

  return {
    entries,
    loading,
    error,
    rawHostsFile,
    addEntry,
    updateEntry,
    deleteEntry,
    saveEntries,
    refreshEntries,
    fetchRawHostsFile,
  };
};
