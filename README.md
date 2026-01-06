# Electron + Angular Architecture Documentation

This project integrates **Angular (Renderer Process)** with **Electron (Main Process)**. 
Use this guide to understand how communication flows between them and how to add new features.

---

## 🏗️ Architecture Overview

The app uses a **secure, type-safe IPC (Inter-Process Communication)** bridge.
The goal is to keep the Angular app agnostic of Electron internals, relying on an interface and a service wrapper.

### **Communication Flow**
1. **Angular Component/Store**: Calls a method in `ElectronService`.
2. **ElectronService**: Checks if running in Electron. If yes, calls `window.electron.[method]`.
3. **Preload Script (`preload.ts`)**: The bridge that passes the call from Renderer to Main using `ipcRenderer.invoke`.
4. **Main Handler (`handlers/*.ts`)**: Listens for the event name, executes Node.js logic, and returns a result.

---

## 📂 Project Structure

### **1. Angular (Renderer)**
*   `src/app/core/services/electron.service.ts`: The **only** place where `window.electron` is accessed. It provides safe fallbacks for web browsers.
*   `src/app/core/interfaces/electron-api.interface.ts`: Defines the strict contract (TypeScript Interface) for the API exposed by the preload script.

### **2. Bridge (Preload)**
*   `electron/preload.ts`: Exposes specific, limited APIs to the renderer using `contextBridge`. It does **not** expose the entire Node.js runtime (for security).

### **3. Electron (Main)**
*   `electron/main.ts`: Entry point. Creates the window and registers handlers.
*   `electron/handlers/`: Contains the actual logic for Electron tasks (FileSystem, Auth, Window Controls), keeping `main.ts` clean.

---

## 🚀 How to Add a New Electron Feature

Example: Adding a feature to **"Read a text file"**.

### **Step 1: Main Process (Logic)**
Create a handler in `electron/handlers/file-handler.ts`:
```typescript
import { ipcMain } from 'electron';
import * as fs from 'fs';

export function registerFileHandlers() {
  ipcMain.handle('file:read', async (_, path) => {
    return fs.readFileSync(path, 'utf-8');
  });
}
```
*Register this in `electron/main.ts`!*

### **Step 2: Preload (Bridge)**
Expose the method in `electron/preload.ts`:
```typescript
contextBridge.exposeInMainWorld('electron', {
  // ... existing apis
  file: {
    read: (path: string) => ipcRenderer.invoke('file:read', path)
  }
});
```

### **Step 3: Interface (Type Safety)**
Update `src/app/core/interfaces/electron-api.interface.ts`:
```typescript
export interface ElectronAPI {
  // ... existing members
  file: {
    read: (path: string) => Promise<string>;
  }
}
```

### **Step 4: Angular Service (Usage)**
Add a wrapper in `src/app/core/services/electron.service.ts`:
```typescript
async readFile(path: string): Promise<string> {
  if (this.isElectron) {
    return await this.api!.file.read(path);
  }
  // Optional: Fallback for browser
  return ''; 
}
```

Now you can use `this.electronService.readFile()` anywhere in your Angular components!

---

## 🛠️ Commands

*   `npm run electron`: specific build and run (Angular Build + Watch Electron).
*   `ng build`: specific build for Angular only.
