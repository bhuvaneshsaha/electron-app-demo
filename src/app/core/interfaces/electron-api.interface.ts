export interface ElectronAPI {
  window: {
    restoreAndMaximize: () => Promise<void>;
    minimize: () => Promise<void>;
    toggleFullscreen: () => Promise<void>;
    zoomIn: () => Promise<void>;
    zoomOut: () => Promise<void>;
    resetZoom: () => Promise<void>;
  };
  app: {
    getVersion: () => Promise<string>;
    quit: () => Promise<void>;
  };
  shell: {
    openExternal: (url: string) => Promise<void>;
  };
  auth: {
    login: () => Promise<string | null>;
    exchangeToken: (code: string) => Promise<any>;
    getAccessToken: () => Promise<string>;
    logout: () => Promise<void>;
  };
}
