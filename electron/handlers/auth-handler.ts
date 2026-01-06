import { ipcMain, BrowserWindow, IpcMainInvokeEvent } from 'electron';
import { authService } from '../services/auth-service';
import { config } from '../utils/config';

let exchangeInProgress = false;

function handleAuthCallback(url: string, authWindow: BrowserWindow, resolve: (value: string | null) => void) {
  if (!url.startsWith(config.auth.redirectUri)) return;

  const parsedUrl = new URL(url);
  const code = parsedUrl.searchParams.get("code");
  const error = parsedUrl.searchParams.get("error");

  if (error) {
    console.error("❌ OAuth error:", parsedUrl.searchParams.toString());
    authWindow.close();
    resolve(null);
    return;
  }

  if (!code) {
    console.warn("⚠️ Callback without code:", url);
    return;
  }

  console.log("✅ Authorization code received:", code);
  authWindow.close();
  resolve(code);
}

export function registerAuthHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle("auth:login", async () => {
    return new Promise((resolve, reject) => {
      const { codeChallenge } = authService.generatePKCE();

      const authWindow = new BrowserWindow({
        width: config.authWindow.width,
        height: config.authWindow.height,
        modal: true,
        parent: mainWindow,
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false
        }
      });

      // Fix for devtools if needed, or keeping it clean
      // authWindow.openDevTools(); 

      const authUrl = authService.getAuthUrl(codeChallenge);
      authWindow.loadURL(authUrl);

      const handleUrl = (url: string, event: Electron.Event) => {
        if (url.startsWith(config.auth.redirectUri)) {
           if (event && event.preventDefault) event.preventDefault();
           handleAuthCallback(url, authWindow, resolve);
        }
      };

      authWindow.webContents.on("will-redirect", (event, url) => {
        console.log("➡️ Redirect detected:", url);
        handleUrl(url, event);
      });

      authWindow.webContents.on("will-navigate", (event, url) => {
        console.log("➡️ Navigation detected:", url);
        handleUrl(url, event);
      });

      authWindow.webContents.on("did-navigate", (event, url) => {
        console.log("➡️ Did navigate detected:", url);
        // did-navigate event does not have preventDefault
        if (url.startsWith(config.auth.redirectUri)) {
           handleAuthCallback(url, authWindow, resolve);
        }
      });
      
      authWindow.on('closed', () => {
         // Maybe resolve null if closed without code? 
         // The promise might hang if we don't resolve.
         // But handleAuthCallback closes it.
      });
    });
  });

  ipcMain.handle("auth:exchangeToken", async (_: IpcMainInvokeEvent, code: string) => {
    if (exchangeInProgress) {
      console.log("⚠️ Token exchange already in progress");
      return;
    }

    exchangeInProgress = true;
    try {
      const codeVerifier = authService.getVerifier();
      if (!codeVerifier) {
          throw new Error("No PKCE verifier found");
      }

      console.log("▶ Exchanging code:", code);
      const result = await authService.exchangeToken(code, codeVerifier);
      console.log("▶ Token response:", result);
      return result;
    } catch (err) {
        console.error("Token exchange failed", err);
        throw err;
    } finally {
        exchangeInProgress = false;
    }
  });

  ipcMain.handle("auth:getAccessToken", () => {
    // TODO: Implement token storage if needed. 
    // Currently relying on renderer to store token.
    return null; 
  });

  ipcMain.handle("auth:logout", () => {
    // TODO: Implement logout logic (e.g. clear cookies, etc)
    return true;
  });
}
