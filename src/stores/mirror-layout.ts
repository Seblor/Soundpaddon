import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Sound } from 'soundpad.js/web';
import { get, type Writable } from 'svelte/store';

export enum SOUND_COLORS_HSL {
  BLUE = '200 93% 27%',
  GREEN = '120 93% 27%',
  ORANGE = '30 93% 27%',
  PINK = '320 93% 27%',
  PURPLE = '280 93% 27%',
  RED = '0 93% 27%',
  YELLOW = '60 93% 27%',
}


export type CustomSoundData = {
  name: string;
  color: SOUND_COLORS_HSL;
}

const defaultSoundMetadata: CustomSoundData = {
  color: SOUND_COLORS_HSL.BLUE,
  name: ''
}

/**
 * === Settings ===
 */

/**
 * === Persistent Settings ===
 */

export const soundOrder: Writable<Array<string>> = localStorageStore('v1_soundOrder', []);
export const soundMetadata: Writable<Record<string, CustomSoundData>> = localStorageStore('v1_soundMetadata', {});

export function getSoundName(sound: Sound): string {
  return getSoundMetadata(sound).name;
}

export function getSoundMetadata(sound: Sound): CustomSoundData {
  return get(soundMetadata)[sound.url] ?? {
    color: SOUND_COLORS_HSL.BLUE,
    name: generateSoundNameFromSoundpad(sound)
  };
}

export function setSoundMetadata(sound: Sound, data: Partial<CustomSoundData>) {
  const newMetadata = {
    ...getSoundMetadata(sound),
    ...data
  }

  if (newMetadata.color === SOUND_COLORS_HSL.BLUE && newMetadata.name === generateSoundNameFromSoundpad(sound)) {
    soundMetadata.update((metadata) => {
      delete metadata[sound.url];
      return metadata;
    });
    return;
  }
  soundMetadata.update((metadata) => {
    metadata[sound.url] = newMetadata;
    return metadata;
  });
}

export function generateSoundNameFromSoundpad(sound: Sound): string {
  return sound.title
    ? sound.title.replace(/^\d+-/, "")
    : RegExp(/.+\/([^/]+)\..+$/).exec(sound.url.replace(/\/\/|\\\\|\\/g, "/"))?.[1] ??
    ""
}
