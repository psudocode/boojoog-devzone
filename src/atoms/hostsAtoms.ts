import { atom } from "jotai";
import {
  getHostsEntries,
  updateHostsEntries,
  getRawHostsFile,
} from "../helpers/ipcHandler";
import { HostEntry } from "../../electron/app/hosts/hosts";

// Atom for storing the list of host entries
export const hostsEntriesAtom = atom<HostEntry[]>([]);

// Atoms for storing the raw parts of the hosts file
export const rawBeforeAtom = atom<string>("");
export const rawAfterAtom = atom<string>("");

// Atom for loading state
export const loadingAtom = atom<boolean>(false);

// Atom for error state
export const errorAtom = atom<Error | null>(null);

// Atom for raw hosts file content
export const rawHostsFileAtom = atom<string>("");

// Derived atom for getting the maximum line number
export const maxLineNumberAtom = atom((get) => {
  const entries = get(hostsEntriesAtom);
  return entries.length > 0 ? Math.max(...entries.map((e) => e.lineNumber)) : 0;
});

// Action atoms for operations

// Fetch entries action
export const fetchEntriesAtom = atom(
  null, // null for read value (we don't need to read anything special)
  async (_, set) => {
    try {
      set(loadingAtom, true);
      set(errorAtom, null);
      const response = await getHostsEntries();

      if (response.hostsBlock && response.hostsBlock.length > 0) {
        const hostsBlock = response.hostsBlock[0];
        set(hostsEntriesAtom, hostsBlock.entries);
        set(rawBeforeAtom, hostsBlock.rawBefore);
        set(rawAfterAtom, hostsBlock.rawAfter);
      } else {
        set(hostsEntriesAtom, []);
        set(rawBeforeAtom, "");
        set(rawAfterAtom, "");
      }
    } catch (err) {
      set(errorAtom, err instanceof Error ? err : new Error(String(err)));
    } finally {
      set(loadingAtom, false);
    }
  }
);

// Add entry action
export const addEntryAtom = atom(
  null,
  (get, set, entry: Omit<HostEntry, "lineNumber">) => {
    const maxLineNumber = get(maxLineNumberAtom);
    const newEntry: HostEntry = {
      ...entry,
      lineNumber: maxLineNumber + 1,
    };

    set(hostsEntriesAtom, (prev) => [...prev, newEntry]);
  }
);

// Update entry action
export const updateEntryAtom = atom(
  null,
  (
    _,
    set,
    params: { lineNumber: number; updatedEntry: Partial<HostEntry> }
  ) => {
    const { lineNumber, updatedEntry } = params;

    set(hostsEntriesAtom, (prev) =>
      prev.map((entry) =>
        entry.lineNumber === lineNumber ? { ...entry, ...updatedEntry } : entry
      )
    );
  }
);

// Delete entry action
export const deleteEntryAtom = atom(null, (_, set, lineNumber: number) => {
  set(hostsEntriesAtom, (prev) =>
    // Filter out the entry with the specified ip and hostname
    prev.filter((entry) => entry.lineNumber !== lineNumber)
  );
});

// Save entries action
export const saveEntriesAtom = atom(null, async (get, set) => {
  try {
    set(loadingAtom, true);
    set(errorAtom, null);
    const entries = get(hostsEntriesAtom);
    const rawBefore = get(rawBeforeAtom);
    const rawAfter = get(rawAfterAtom);

    await updateHostsEntries({
      entries,
      rawBefore,
      rawAfter,
    });
  } catch (err) {
    set(errorAtom, err instanceof Error ? err : new Error(String(err)));
    throw err;
  } finally {
    set(loadingAtom, false);
  }
});

// Fetch raw hosts file content action
export const fetchRawHostsFileAtom = atom(null, async (_, set) => {
  try {
    set(loadingAtom, true);
    set(errorAtom, null);
    const content = await getRawHostsFile();
    set(rawHostsFileAtom, content);
  } catch (err) {
    set(errorAtom, err instanceof Error ? err : new Error(String(err)));
    throw err;
  } finally {
    set(loadingAtom, false);
  }
});
