
import * as path from 'path';

export const config = {
  window: {
    width: 1200,
    height: 800,
  },
  authWindow: {
    width: 500,
    height: 700,
  },
  tray: {
    tooltip: "First App",
    iconPath: path.join(__dirname, "../../electron/logo.ico"),
  },
  paths: {
    indexHtml: "../dist/electron-app-demo/browser/index.html",
    icon: "../electron/logo.ico"
  },
  auth: {
    // AWS Cognito details
    mode: 'cognito',
    redirectUri: "electron-app-demo://callback",
    authDomain: "https://us-east-1l8xttvvw4.auth.us-east-1.amazoncognito.com",
    clientId: "7huhicf17qof5kq3hhrf9knca7"
  }
};
