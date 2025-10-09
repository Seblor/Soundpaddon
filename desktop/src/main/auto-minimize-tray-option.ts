import Store from 'electron-store';

const store = new Store();

export function enableMinimizeOnWinClose (): void {
  store.set(`minimizeOnWinClose`, true);
}

export function disableMinimizeOnWinClose (): void {
  store.set(`minimizeOnWinClose`, false);
}

export function getMinimizeOnWinClose (): boolean {
  return Boolean(store.get(`minimizeOnWinClose`, false));
}
