import { type Socket } from "socket.io";
import Soundpad, { PlayStatus, type Sound } from 'soundpad.js'
import { isBuild, sleep } from "../utils/misc";
import _ from 'lodash'

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
}

if (isBuild() === false) {
  await Promise.all(Object.values(clients).map(client => client.connect()))
}


/**
 * === Playback Fetcher ===
 */
let playbackPosition = 0
let playbackDuration = 0
let playbackStatus = PlayStatus.STOPPED
const socketsToNotify: Socket[] = []

setImmediate(async () => {
  while (isBuild() === false) {
    await clients.playbackFetcher.connectionAwaiter

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
 * === Sounds Fetcher ===
 */

let sounds: Sound[] = []

setImmediate(async () => {
  while (isBuild() === false) {
    await clients.soundsFetcher.connectionAwaiter

    const newSounds = await clients.soundsFetcher.getSoundListJSON()
    if (newSounds && _.isEqual(soundListToComparable(newSounds), soundListToComparable(sounds)) === false) {
      sounds = newSounds
      socketsToNotify.forEach(socket => socket.emit('sounds', sounds))
    }
    await sleep(1000)
  }
})

/**
 * === Export ===
 */

export default function onWebsocketConnection(socket: Socket): void {
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
    title: sound.title,
    url: sound.url,
  }))
}
