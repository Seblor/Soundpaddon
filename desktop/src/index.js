// @ts-check

const { app, BrowserWindow, screen, shell } = require('electron');
const { nativeImage } = require('electron/common');
const path = require('node:path');
const { dialog } = require('electron/main');
const net = require('net');
const { getSoundpadPath, isSoundpadOpened, openSoundpad, waitForPipe } = require('soundpad.js');
const { existsSync } = require('node:fs');

const iconPath = path.join(__dirname, '../assets/soundpaddon.ico')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
} else {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  checkIfSoundpadIsInstalledAndPurchased().then(async (checkResult) => {
    if (checkResult === false) {
      app.quit();
      return;
    }
    app.whenReady()
      .then(async () => {
        const host = require('./main/dist/index')
        const server = await host.createHttpServer({
          certificateRootPath: path.join(app.getPath('userData'), 'ssl'),
          pathToServe: __dirname + '/renderer',
          electronApp: app,
        })

        await new Promise(resolve => {
          server
            .listen(8555)
            .once('listening', resolve)
        })

        host.setSystemTray(app, iconPath);

        createWindow();

        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        app.on('activate', () => {
          if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
          }
        });
      });
  });
}

const createWindow = async () => {
  let factor = screen.getPrimaryDisplay().scaleFactor;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: nativeImage.createFromPath(iconPath),
    autoHideMenuBar: true,
    width: (screen.getPrimaryDisplay().workAreaSize.width * 0.75) / factor,
    height: (screen.getPrimaryDisplay().workAreaSize.height * 0.75) / factor,
    webPreferences: {
      zoomFactor: 1.0 / factor,
      preload: './preload.js',
    }
  });

  const externalUrls = [
    'https://ko-fi.com/seblor',
    'https://support.soundpaddon.app/',
  ];

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (externalUrls.includes(url)) {
      shell.openExternal(url);
      return {
        action: 'deny'
      }
    }
    return { action: 'deny' }
  })

  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });

  // and load the index.html of the app.
  mainWindow.loadURL('https://127-0-0-1.local-ip.sh:8555/panel/desktop');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function checkIfSoundpadIsInstalledAndPurchased() {
  if (getSoundpadPath() === null || existsSync(getSoundpadPath()) === false) {
    dialog.showErrorBox('Soundpad is not installed', 'Please install Soundpad to use Soundpaddon.');
    return false;
  }
  openSoundpad(false)
  let isSoundpadOpen = false;
  while (!isSoundpadOpen) {
    isSoundpadOpen = await isSoundpadOpened(false);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const isPipeOpen = await Promise.race([
    waitForPipe().then(() => true),
    new Promise(resolve => setTimeout(resolve, 2e3)).then(() => false),
  ])
  if (isPipeOpen === false) {
    dialog.showErrorBox('Soundpad is in trial version', 'Remote control of Soundpad is not available in the trial version. Please purchase Soundpad to use Soundpaddon.');
    return false;
  }
  return true;
}
