import { BrowserWindow } from 'electron';

export function restoreAndMaximize(mainWindow: BrowserWindow | null) {
  if (!mainWindow) return;

  if (!mainWindow.isVisible()) mainWindow.show();
  if (mainWindow.isMinimized()) mainWindow.restore();

  mainWindow.maximize();
  mainWindow.focus();
}

export function minimize(mainWindow: BrowserWindow | null) {
  if (!mainWindow) return;
  mainWindow.minimize();
}

export function toggleFullscreen(mainWindow: BrowserWindow | null) {
  if (!mainWindow) return;
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
}
