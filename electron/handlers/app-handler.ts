import { ipcMain, app } from 'electron';

export function registerAppHandlers() {
  ipcMain.handle("app:getVersion", () => {
    return app.getVersion();
  });

  ipcMain.handle("app:quit", () => {
    app.quit();
  });
}
