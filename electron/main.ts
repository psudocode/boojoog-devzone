import { app, BrowserWindow, ipcMain, dialog } from "electron";
// import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { registerExposedHandlers } from "./app/hosts/exposedHandler";
import { registerNginxHandlers } from "./app/nginx/exposedHandler";
import { registerSettingsHandlers } from "./app/settings/exposedHandler";

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// CUSTOM HANDLER
registerExposedHandlers();
registerNginxHandlers();
registerSettingsHandlers();

// File dialog handler for settings page
ipcMain.handle("show-open-dialog", async (_, options) => {
  const result = await dialog.showOpenDialog(options);
  return result;
});

// Window state management
interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

const defaultWindowState: WindowState = {
  width: 1024,
  height: 768,
};

function getStateFilePath(): string {
  return path.join(app.getPath("userData"), "window-state.json");
}

function saveWindowState(browserWindow: BrowserWindow): void {
  if (!browserWindow.isMinimized() && !browserWindow.isMaximized()) {
    const bounds = browserWindow.getBounds();
    const state: WindowState = {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
    };

    try {
      fs.writeFileSync(getStateFilePath(), JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save window state:", error);
    }
  }
}

function loadWindowState(): WindowState {
  try {
    const statePath = getStateFilePath();
    if (fs.existsSync(statePath)) {
      const stateData = fs.readFileSync(statePath, "utf8");
      const state = JSON.parse(stateData) as WindowState;
      return {
        width: state.width || defaultWindowState.width,
        height: state.height || defaultWindowState.height,
        x: state.x,
        y: state.y,
      };
    }
  } catch (error) {
    console.error("Failed to load window state:", error);
  }

  return defaultWindowState;
}

let win: BrowserWindow | null;

function createWindow() {
  const { width, height, x, y } = loadWindowState();
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: width,
    height: height,
    x: x,
    y: y,
    minWidth: 1080,
    minHeight: 600,
    center: !x && !y, // Only center if no position is saved
    resizable: true, // Allow window to be resizable
    fullscreenable: false, // Prevent fullscreen mode
    backgroundColor: "#ffffff", // Light background color
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      webviewTag: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Set window title
  win.setTitle("DevZone");
  // Uncomment the line below to set a fixed size window (non-resizable)
  // win.setResizable(false);

  // Save window state when it's resized or moved
  win.on("resize", () => {
    if (win) saveWindowState(win);
  });

  win.on("move", () => {
    if (win) saveWindowState(win);
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Save window state on close
  win.on("close", () => {
    if (win) {
      saveWindowState(win);
    }
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

// Save window state before quitting
app.on("before-quit", () => {
  if (win) {
    saveWindowState(win);
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
