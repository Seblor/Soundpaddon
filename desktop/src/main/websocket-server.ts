import { type Socket } from "socket.io";
import Soundpad, { PlayStatus, type Category, type Sound } from 'soundpad.js'
import { sleep } from "./utils/misc";
import _ from 'lodash'
// import {execSync} from 'child_process'

// execSync(`PowerShell -Command "Add-Type -AssemblyName PresentationFramework;[System.Windows.MessageBox]::Show('Hello World', '${process.env.name}', 0, 16)"`)

// Using multiple clients since Soundpad uses a named pipe, race conditions may mix responses in a single message
const clients = {
  playbackFetcher: new Soundpad({
    autoReconnect: true,
    startSoundpadOnConnect: true,
  }),
  soundsFetcher: new Soundpad({
    autoReconnect: true,
    startSoundpadOnConnect: true,
  }),
  categoriesFetcher: new Soundpad({
    autoReconnect: true,
    startSoundpadOnConnect: true,
  }),
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  process.exit();
}

Promise.all(Object.values(clients).map(client => client.connect()))


/**
 * === Playback Fetcher ===
 */
let playbackPosition = 0
let playbackDuration = 0
let playbackStatus = PlayStatus.STOPPED
const socketsToNotify: Socket[] = []

setImmediate(async () => {
  while (true) {
    await Promise.all(Object.values(clients).map(client => client.connectionAwaiter))

    const newPlaybackPosition = await clients.playbackFetcher.getPlaybackPosition()
    const newPlaybackDuration = await clients.playbackFetcher.getPlaybackDuration()
    const newPlaybackStatus = await clients.playbackFetcher.getPlayStatus()

    if (playbackStatus === PlayStatus.PLAYING && newPlaybackStatus === PlayStatus.STOPPED) {
      socketsToNotify.forEach(socket => socket.emit('playback-position', 0))
    }

    if (newPlaybackStatus === PlayStatus.PLAYING && (newPlaybackPosition !== playbackPosition || newPlaybackDuration !== playbackDuration)) {
      playbackPosition = newPlaybackPosition
      playbackDuration = newPlaybackDuration
      socketsToNotify.forEach(socket => socket.emit('playback-position', playbackPosition / playbackDuration))
    }
    playbackStatus = newPlaybackStatus
    await sleep(25)
  }
})

/**
 * === Sounds & Categories Fetcher ===
 */

let sounds: Sound[] = []
let categories: Category[] = []

setImmediate(async () => {
  while (true) {
    await Promise.all(Object.values(clients).map(client => client.connectionAwaiter))

    const [newSounds, newCategories] = await Promise.all([
      clients.soundsFetcher.getSoundListJSON(),
      clients.categoriesFetcher.getCategoriesJSON(true, true),
    ])

    if (newSounds && _.isEqual(soundListToComparable(newSounds), soundListToComparable(sounds)) === false) {
      sounds = newSounds
      socketsToNotify.forEach(socket => socket.emit('sounds', sounds))
    }
    if (newCategories && _.isEqual(categoriesToComparable(newCategories), categoriesToComparable(categories)) === false) {
      categories = newCategories
      socketsToNotify.forEach(socket => socket.emit('categories', categories))
    }
    await sleep(1000)
  }
})

/**
 * === Export ===
 */

export default async function onWebsocketConnection(socket: Socket): Promise<void> {
  await Promise.all(Object.values(clients).map(client => client.connectionAwaiter))

  socket.emit('sounds', sounds)
  socketsToNotify.push(socket)
  socket.on('disconnect', () => {
    socketsToNotify.splice(socketsToNotify.indexOf(socket), 1)
  })
}

function soundListToComparable(sounds: Sound[]): {
  index: number;
  title: string;
  url: string;
}[] {
  return sounds.map(sound => ({
    index: sound.index,
    title: sound.tag,
    color: sound.color,
    url: sound.url,
  }))
}

function categoriesToComparable(categories: Category[]): {
  index: number;
  icon: string;
  name: string;
  sounds: ReturnType<typeof soundListToComparable>;
}[] {
  return categories.map(category => ({
    index: category.index,
    icon: category.icon ?? 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==', // Transparent 1x1 PNG
    name: category.name,
    sounds: soundListToComparable(category.sounds ?? []),
    subCategories: categoriesToComparable(category.subCategories ?? []),
  }))
}
