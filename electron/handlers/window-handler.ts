import { ipcMain, BrowserWindow } from 'electron';
import * as windowUtils from '../utils/window-utils';

export function registerWindowHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle("window:restoreAndMaximize", () => {
    windowUtils.restoreAndMaximize(mainWindow);
  });

  ipcMain.handle("window:minimize", () => {
    windowUtils.minimize(mainWindow);
  });

  ipcMain.handle("window:toggleFullscreen", () => {
    windowUtils.toggleFullscreen(mainWindow);
  });

  ipcMain.handle("window:zoomIn", () => {
    windowUtils.zoomIn(mainWindow);
  });

  ipcMain.handle("window:zoomOut", () => {
    windowUtils.zoomOut(mainWindow);
  });

  ipcMain.handle("window:resetZoom", () => {
    windowUtils.resetZoom(mainWindow);
  });
}
