import { startControllerNavigation } from "./controller";
import { app, BrowserWindow } from 'electron';
import * as path from "path";

app.setAppUserModelId("com.youtubetvpc.app");

app.disableHardwareAcceleration();

app.commandLine.appendSwitch(
  "disable-features",
  "CalculateNativeWinOcclusion"
);

function createWindow(): void {
  const win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    title: "Youtube On TV",
    icon: path.join(__dirname, "../assets/icon.ico"), // Set icon on taskbar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Pretend to be a Samsung Smart TV
  win.webContents.setUserAgent(
    'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/538.1 (KHTML, like Gecko) SamsungBrowser/3.1 TV Safari/538.1'
  );

  win.loadURL('https://www.youtube.com/tv#/');

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      win.webContents.openDevTools();
    }
    //if (input.key === 'Escape') {
    //  app.quit();
    //}
  });
  
  // Since this is just a browser we have to set these to transparent to fix black backgrounds on text.
  win.once('ready-to-show', async () => {
  win.webContents.insertCSS(`
    yt-formatted-string,
    ytlr-video-title-tray,
    ytlr-video-metadata-line,
    yt-core-attributed-string {
      background-color: transparent !important;
      background: transparent !important;
    }

    div[idomkey="time-label"] *,
    span[idomkey="detail-text-0"] *,
    span[idomkey="detail-text-1"] *,
    span[idomkey="detail-text-2"] *,
    span[idomkey="detail-text-1"]::before,
    span[idomkey="detail-text-2"]::before,
    div[idomkey="badges-and-detail-container"] * {
      background-color: transparent !important;
      background: transparent !important;
    }
  `);
  startControllerNavigation(win);
});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});