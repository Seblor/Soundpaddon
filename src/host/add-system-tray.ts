
import SysTray, { type ClickEvent, type Menu } from 'systray'
import fs from 'node:fs'
import { closeSoundpad } from 'soundpad.js'
import { disableAutoStart, enableAutoStart, getAutoStartValue } from '../lib/utils/start-with-windows.js'

const iconPath = 'D:\\workspace\\soundpaddon-svelte\\static\\soundpaddon.ico'

function iconToBase64(path: string) {
  const fileContent = fs.readFileSync(path)
  return fileContent.toString('base64')
}

// @ts-ignore
const systray = new SysTray.default({
  menu: {
    // you should using .png icon in macOS/Linux, but .ico format in windows
    icon: iconToBase64(iconPath),
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
  copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
}) as SysTray

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
