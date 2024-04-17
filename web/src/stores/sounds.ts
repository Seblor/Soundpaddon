import { type Sound } from 'soundpad.js/lib/web';
import { writable } from 'svelte/store';

export const sounds = writable([] as Sound[]);
