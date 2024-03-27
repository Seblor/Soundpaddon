import type { Sound } from "soundpad.js/web"

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getSoundName(sound: Sound): string {
  return sound.title
    ? sound.title.replace(/^\d+-/, "")
    : RegExp(/.+\/([^/]+)\..+$/).exec(sound.url.replace(/\/\/|\\\\|\\/g, "/"))?.[1] ??
    ""
}
