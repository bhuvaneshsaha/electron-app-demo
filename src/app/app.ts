import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElectronService } from './core/services/electron.service';
import { AuthStore } from './core/store/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private electronService = inject(ElectronService);
  protected authStore = inject(AuthStore);
  
  protected readonly title = signal('electron-app-demo');
  protected readonly version = signal<string>('');
  protected readonly isElectron = signal<boolean>(false);

  ngOnInit() {
    this.isElectron.set(this.electronService.isElectron);
    this.loadVersion();
  }

  async loadVersion() {
    const v = await this.electronService.getAppVersion();
    this.version.set(v);
  }

  quit() {
    this.electronService.quitApp();
  }

  toggleFullscreen() {
    this.electronService.toggleFullscreen();
  }

  minimize() {
    this.electronService.minimize();
  }

  maximize() {
    this.electronService.restoreAndMaximize();
  }

  login() {
    this.authStore.login();
  }

  logout() {
    this.authStore.logout();
  }

  async openMultipleWindows() {
    const urls = [
      'https://electronjs.org',
      'https://angular.io',
      'https://github.com'
    ];
    
    for (const url of urls) {
      await this.electronService.openExternal(url);
    }
  }
}
