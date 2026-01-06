import { app, BrowserWindow, Tray, Menu } from "electron";
import * as path from "path";
import { registerAuthHandlers } from "./handlers/auth-handler";
import { registerShellHandlers } from "./handlers/shell-handler";
import { registerWindowHandlers } from "./handlers/window-handler";
import { registerAppHandlers } from "./handlers/app-handler";
import { config } from "./utils/config";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuiting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: config.window.width,
    height: config.window.height,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // Loaded from dist-electron/preload.js (relative to dist-electron/main.js which is __dirname)
      preload: path.join(__dirname, "preload.js"), 
    },
  });

  // Path adjustment: We are in dist-electron/main.js
  mainWindow.loadFile(path.join(__dirname, config.paths.indexHtml));

  mainWindow.setMenu(null);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // HIDE app instead of closing
  mainWindow.on("close", (event) => {
    if (!isQuiting) {
      event.preventDefault();
      if (mainWindow) mainWindow.hide();
    }
  });

  // Register Handlers that depend on mainWindow
  registerWindowHandlers(mainWindow);
  registerAuthHandlers(mainWindow);
  registerAppHandlers();
}

// Global handlers
registerShellHandlers();

app.whenReady().then(() => {
  createWindow();

  // CREATE TRAY
  // icon is in build/icon.ico relative to root. 
  // From dist-electron/, it is ../build/icon.ico
  tray = new Tray(config.tray.iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open App",
      click: () => {
        if (mainWindow) mainWindow.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip(config.tray.tooltip);
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    if (mainWindow) mainWindow.show();
  });
});

// DO NOT quit app when window closed
app.on("window-all-closed", () => {
  // Just listening to this event prevents the default behavior (quit)
});
