// @ts-check

const { app, BrowserWindow, screen, shell } = require('electron');
const { nativeImage } = require('electron/common');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const host = require('./main/index');
const { nativeTheme } = require('electron/main');

const iconPath = path.join(__dirname, '../assets/soundpaddon.ico')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
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

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url === 'https://support.soundpaddon.app/') {
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
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const server = await host.createHttpServer({
    certificateRootPath: path.join(app.getPath('userData'), 'soundpaddon/ssl'),
    pathToServe: __dirname + '/renderer',
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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
