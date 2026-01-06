import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  window: {
    restoreAndMaximize: () => ipcRenderer.invoke("window:restoreAndMaximize"),
    minimize: () => ipcRenderer.invoke("window:minimize"),
    toggleFullscreen: () => ipcRenderer.invoke("window:toggleFullscreen")
  },

  app: {
    getVersion: () => ipcRenderer.invoke("app:getVersion"),
    quit: () => ipcRenderer.invoke("app:quit")
  },

  shell: {
    openExternal: (url: string) => ipcRenderer.invoke("shell:openExternal", url)
  },

  auth: {
    login: () => ipcRenderer.invoke("auth:login"),
    exchangeToken: (code: string) => ipcRenderer.invoke("auth:exchangeToken", code),
    getAccessToken: () => ipcRenderer.invoke("auth:getAccessToken"),
    logout: () => ipcRenderer.invoke("auth:logout")
  }
});
