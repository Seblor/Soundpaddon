import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Sound } from "soundpad.js/lib/web";
import { derived, type Writable } from "svelte/store";

type Cell = {
  content: Sound | CustomLayout | null
}

type CustomLayout = {
  name: string
  rows: number
  columns: number
  cells: Cell[][]
}

export const portaitLayout: Writable<CustomLayout> = localStorageStore('v1_portaitLayout', createNewLayout('Portrait', 8, 5));
export const landscapeLayout: Writable<CustomLayout> = localStorageStore('v1_landscapeLayout', createNewLayout('Landscape', 5, 8));

export const customizedLayoutLandscapeAdaptor: Writable<'grid' | 'list'> = localStorageStore('v1_customizedLayoutLandscapeAdaptor', 'grid');
export const isCustomLayoutLandscapeGrid = derived(customizedLayoutLandscapeAdaptor, ($customizedLayoutLandscapeAdaptor) => $customizedLayoutLandscapeAdaptor === 'grid');

export function createNewLayout(name: string, rows: number, columns: number): CustomLayout {
  return { name, rows, columns, cells: Array.from({ length: rows }, () => Array.from({ length: columns }, () => ({ content: null }))) }
}
