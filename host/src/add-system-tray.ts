
import SysTrayModule, { type ClickEvent, type Menu } from 'systray'
import fs from 'node:fs'
import nodeSea from 'node:sea'
import { closeSoundpad } from 'soundpad.js'
import { disableAutoStart, enableAutoStart, getAutoStartValue } from './start-with-windows'
import { hideWindow } from './utils/win';

// @ts-ignore (dev mode is ESM, prod is CJS)
const SysTray = nodeSea.isSea() ? SysTrayModule : SysTrayModule.default

const iconPath = 'D:\\workspace\\soundpaddon-svelte\\host\\assets\\soundpaddon.ico'

function iconToBase64(path: string) {
  const fileContent = fs.readFileSync(path)
  return fileContent.toString('base64')
}

function getIconAsBase64() {
  if (nodeSea.isSea()) {
    const iconAsset = nodeSea.getRawAsset('soundpaddon.ico')
    if (typeof iconAsset === 'string') {
      return iconAsset
    } else {
      return Buffer.from(new Uint8Array(iconAsset)).toString('base64')
    }
  } else {
    return iconToBase64(iconPath)
  }
}

export async function createTray() {
  const systray = new SysTray({
    copyDir: './traybin',
    menu: {
      // you should using .png icon in macOS/Linux, but .ico format in windows
      icon: getIconAsBase64(),
      title: "Soundpaddon",
      tooltip: "Soundpaddon",
      items: [{
        title: "Open Soundpaddon with Windows",
        checked: await getAutoStartValue('Soundpaddon'),
        enabled: true
      }, {
        title: "Close Soundpad and Soundpaddon",
        checked: false,
        enabled: true
      }, {
        title: "Close soundpaddon",
        enabled: true
      }]
    } as Menu,
    debug: false,
    // copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
  })

  systray.onClick(async (action: ClickEvent) => {
    if (action.seq_id === 0) {
      systray.sendAction({
        type: 'update-item',
        item: {
          ...action.item,
          checked: !action.item.checked,
        },
        seq_id: action.seq_id,
      })
      if (!action.item.checked) {
        console.log('enabling autostart');
        enableAutoStart('Soundpaddon', '"C:\\Program Files (x86)\\Soundpad\\Soundpad.exe"').catch(console.error)
      } else {
        console.log('disabling autostart');
        disableAutoStart('Soundpaddon')
      }
    } else if (action.seq_id === 1) {
      await closeSoundpad()
      systray.kill()
    } else if (action.seq_id === 2) {
      systray.kill()
    }
  })

  hideWindow()
}
