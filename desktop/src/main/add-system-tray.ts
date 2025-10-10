// @ts-check

import { closeSoundpad } from 'soundpad.js'
import { disableAutoStart, enableAutoStart, getAutoStartValue } from './start-with-windows-tray-option'
import { Menu, shell, Tray, type App } from 'electron';
import { BrowserWindow, dialog, type KeyboardEvent, type MenuItem, type MenuItemConstructorOptions } from 'electron/main';
import { enableMinimizeOnWinClose, getMinimizeOnWinClose, disableMinimizeOnWinClose } from './auto-minimize-tray-option';
import { getDownloadLocation, resetDownloadLocation, setDownloadLocation } from './download-location-tray-option';

export async function createTray (app: App, iconPath: string) {
  const tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate(await generateSystrayTemplate(app, tray))
  tray.setToolTip('Soundpaddon')
  tray.setContextMenu(contextMenu)

  tray.on('click', (e: KeyboardEvent) => {
    const appWindow = BrowserWindow.getAllWindows()[0]
    if (appWindow.isVisible()) {
      appWindow.focus()
    } else {
      appWindow.show()
    }
  })
}

async function generateSystrayTemplate (app: App, tray: Tray): Promise<(MenuItemConstructorOptions | MenuItem)[]> {
  return [
    {
      label: 'Open Soundpaddon with Windows',
      type: 'checkbox',
      checked: await getAutoStartValue('Soundpaddon'),
      click: async () => {
        if (await getAutoStartValue('Soundpaddon')) {
          console.log('disabling autostart');
          await disableAutoStart('Soundpaddon')
        } else {
          console.log('enabling autostart');
          await enableAutoStart('Soundpaddon', app.getPath('exe')).catch(console.error)
        }

        // Update the context menu with the new checkbox value
        tray.setContextMenu(Menu.buildFromTemplate(await generateSystrayTemplate(app, tray)))
      }
    },
    {
      label: 'Minimize to tray when closing Soundpaddon\'s window',
      type: 'checkbox',
      checked: getMinimizeOnWinClose(),
      click: async () => {
        if (getMinimizeOnWinClose()) {
          console.log('disabling minimize on close');
          disableMinimizeOnWinClose()
        } else {
          console.log('enabling minimize on close');
          enableMinimizeOnWinClose()
        }

        // Update the context menu with the new checkbox value
        tray.setContextMenu(Menu.buildFromTemplate(await generateSystrayTemplate(app, tray)))
      }
    },
    {
      label: 'Sound download location',
      submenu: [
        {
          label: 'Set download location',
          click: async () => {
            const result = await dialog.showOpenDialog({
              properties: ['openDirectory']
            })
            if (!result.canceled && result.filePaths.length > 0) {
              setDownloadLocation(result.filePaths[0])
            }
          }
        },
        {
          label: 'Open download location',
          click: async () => {
            const location = getDownloadLocation(app)
            shell.openPath(location)
          }
        },
        {
          label: 'Reset download location',
          click: async () => {
            resetDownloadLocation(app)
          }
        }
      ],
    },
    { type: 'separator' },
    {
      label: 'Close Soundpad and Soundpaddon',
      type: 'normal',
      click: async () => {
        await closeSoundpad()
        app.exit()
      }
    },
    {
      label: 'Close Soundpaddon',
      type: 'normal',
      click: () => {
        app.exit()
      }
    }
  ]
}
