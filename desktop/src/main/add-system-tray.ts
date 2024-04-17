// @ts-check

import { closeSoundpad } from 'soundpad.js'
import { disableAutoStart, enableAutoStart, getAutoStartValue } from './start-with-windows'
import { Menu, Tray, type App } from 'electron';
import { BrowserWindow, type KeyboardEvent, type MenuItem, type MenuItemConstructorOptions } from 'electron/main';

export async function createTray(app: App, iconPath: string) {
  const tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate(await generateSystrayTemplate(app, tray))
  tray.setToolTip('Soundpaddon')
  tray.setContextMenu(contextMenu)

  tray.on('click', (e: KeyboardEvent) => {
    const appWindow = BrowserWindow.getAllWindows()[0]
    if (appWindow.isVisible()) {
      appWindow.hide()
    } else {
      appWindow.show()
      appWindow.focus()
    }
  })
}

async function generateSystrayTemplate(app: App, tray: Tray): Promise<(MenuItemConstructorOptions | MenuItem)[]> {
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
