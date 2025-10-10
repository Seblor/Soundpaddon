
import { App } from 'electron';
import Store from 'electron-store';
import path from 'path';

const store = new Store();

export function setDownloadLocation (location: string): void {
  store.set(`downloadLocation`, location);
}

export function getDownloadLocation (electronApp: App): string {
  return store.get(`downloadLocation`, path.join(electronApp.getPath('userData'), 'sounds')) as string;
}

export function resetDownloadLocation (electronApp: App): void {
  store.set(`downloadLocation`, path.join(electronApp.getPath('userData'), 'sounds'));
}

