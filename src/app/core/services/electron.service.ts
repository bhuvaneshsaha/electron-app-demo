import { Injectable } from '@angular/core';
import { ElectronAPI } from '../interfaces/electron-api.interface';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  get isElectron(): boolean {
    return !!(typeof window !== 'undefined' && window.electron);
  }

  /**
   * Access specific electron APIs safely.
   * Returns undefined if not running in Electron.
   */
  get api(): ElectronAPI | undefined {
    return this.isElectron ? window.electron : undefined;
  }

  // Wrapper examples for common tasks to ensure safety

  async getAppVersion(): Promise<string> {
    if (!this.isElectron) return 'Web-Version';
    return await this.api!.app.getVersion();
  }

  async quitApp(): Promise<void> {
    if (this.isElectron) {
      await this.api!.app.quit();
    }
  }

  async openExternal(url: string): Promise<void> {
    if (this.isElectron) {
      await this.api!.shell.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }

  // Window Controls
  async toggleFullscreen(): Promise<void> {
    if (this.isElectron) await this.api!.window.toggleFullscreen();
  }

  async minimize(): Promise<void> {
    if (this.isElectron) await this.api!.window.minimize();
  }

  async restoreAndMaximize(): Promise<void> {
    if (this.isElectron) await this.api!.window.restoreAndMaximize();
  }

  // Auth
  async login(): Promise<string | null> {
    if (this.isElectron) return await this.api!.auth.login();
    return null;
  }

  async exchangeToken(code: string): Promise<any> {
    if (this.isElectron) return await this.api!.auth.exchangeToken(code);
    return null;
  }

  async logout(): Promise<void> {
    if (this.isElectron) await this.api!.auth.logout();
  }
}
