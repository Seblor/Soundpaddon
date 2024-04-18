import { demoData } from '$lib/demo/demo-sounds';
import { checkIsDemo } from '$lib/utils/misc';
import { writable } from 'svelte/store';

export const sounds = writable((checkIsDemo() ? demoData : []));
