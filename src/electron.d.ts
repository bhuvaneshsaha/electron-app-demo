import { ElectronAPI } from './app/core/interfaces/electron-api.interface';

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
