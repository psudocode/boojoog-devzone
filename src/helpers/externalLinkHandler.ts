export async function openExternalLink(url: string): Promise<void> {
  const { ipcRenderer } = window;
  try {
    const response = await ipcRenderer.invoke("open-external-link", url);
    if (!response.success) {
      throw new Error(response.message || "Failed to open external link");
    }
  } catch (error) {
    console.error("Error opening external link:", error);
    throw error;
  }
}
