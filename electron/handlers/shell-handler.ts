import { ipcMain, BrowserWindow, IpcMainInvokeEvent } from 'electron';
import { shell } from 'electron';

export function registerShellHandlers() {
  ipcMain.handle("shell:openExternal", (event: IpcMainInvokeEvent, url: string) => {
    // The original code created a modal window to show the URL
    // But the handler name is 'shell:openExternal' which implies opening in default browser?
    // Let's check the original implementation.
    // Original: Created a new BrowserWindow (modal) to load the URL.
    
    const parent = BrowserWindow.fromWebContents(event.sender);
    
    if (parent) {
        const modal = new BrowserWindow({
            parent,
            modal: true,
            width: 1000,
            height: 700,
            autoHideMenuBar: true,
            webPreferences: {
              contextIsolation: true,
              nodeIntegration: false,
            },
        });
        modal.loadURL(url);
    }
  });
}
