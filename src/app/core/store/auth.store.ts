import { Injectable, signal, computed, inject } from '@angular/core';
import { ElectronService } from '../services/electron.service';

export interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private electronService = inject(ElectronService);

  // State Signals
  private _accessToken = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Computed Selectors
  readonly accessToken = this._accessToken.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  
  readonly isAuthenticated = computed(() => !!this._accessToken());

  constructor() {
    // Optionally load token from local storage or electron store on init
  }

  // Actions
  async login() {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      // 1. Start Login Flow -> Get Code
      const code = await this.electronService.login();
      
      if (code) {
        // 2. Exchange Code for Token
        const response = await this.electronService.exchangeToken(code);
        if (response && response.access_token) {
           this._accessToken.set(response.access_token);
        } else {
           this._error.set('Failed to exchange token');
        }
      } else {
        // User cancelled or failed
        this._isLoading.set(false);
      }
    } catch (err: any) {
      this._error.set(err.message || 'Login failed');
    } finally {
      this._isLoading.set(false);
    }
  }

  async logout() {
    this._isLoading.set(true);
    try {
      await this.electronService.logout();
      this._accessToken.set(null);
    } catch (err: any) {
      this._error.set(err.message || 'Logout failed');
    } finally {
      this._isLoading.set(false);
    }
  }
}
