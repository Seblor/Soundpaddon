// Courtesy of https://github.com/marklagendijk/node-start-on-windows-boot changed to return promises instead of using callbacks

import WinReg from 'winreg';

export function enableAutoStart(name: string, file: string) {
  return new Promise<void>((resolve, reject) => {
    getKey()
      .set(name, WinReg.REG_SZ, file, (err) => !err ? resolve() : reject(err));
  });
}

export function disableAutoStart(name: string) {
  return new Promise<void>((resolve, reject) => {
    getKey()
      .remove(name, (err) => !err ? resolve() : reject(err));
  });
}

export function getAutoStartValue(name: string) {
  return new Promise<boolean>((resolve) => {
    getKey().get(name, (error, result) => {
      if (error) {
        resolve(false)
      }
      resolve(true)
    });
  });
}

const RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';
function getKey() {
  return new WinReg({
    hive: WinReg.HKCU, //CurrentUser,
    key: RUN_LOCATION
  });
}
