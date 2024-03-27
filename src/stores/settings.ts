import { localStorageStore } from '@skeletonlabs/skeleton';
import { writable, type Writable } from 'svelte/store';

/**
 * === Settings ===
 */

export const settingsOpacity: Writable<number> = writable(1);

/**
 * === Persistent Settings ===
 */

export const serverHost: Writable<{ ip: string, port: 3000 }> = localStorageStore('v1_serverHost', { ip: '127.0.0.1', port: 3000 })

export const mirrorLayoutSoundButtonSize: Writable<number> = localStorageStore('v1_mirrorLayoutSoundButtonSize', 60);

export const showSearchBar: Writable<boolean> = localStorageStore('v1_showSearchBar', false);

export const selectedLayout: Writable<'mirror' | 'customized'> = localStorageStore('v1_selectedLayout', 'mirror');

export const customizedLayoutSoundColumns: Writable<number> = localStorageStore('v1_customizedLayoutSoundColumns', 5);
export const customizedLayoutSoundRows: Writable<number> = localStorageStore('v1_customizedLayoutSoundRows', 8);

/**
 * === Drawer functions ===
 */

export function makeDrawerTransparent() {
  settingsOpacity.set(0.5);
}

export function makeDrawerOpaque() {
  settingsOpacity.set(1);
}
